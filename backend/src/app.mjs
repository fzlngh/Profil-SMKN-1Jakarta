import { randomUUID } from "node:crypto";
import express from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import { z } from "zod";
import { answerChat, getChatConfiguration } from "./chat.mjs";
import { CmsService, RESOURCE_NAMES, validateContent } from "./service.mjs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const chatPayload = z.object({
  message: z.string().trim().min(1).max(2_000)
    .refine((value) => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value))
}).strict();
const rolePayload = z.object({ role: z.enum(["admin_it", "editor_guru_staf"]) }).strict();
const pagination = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).max(100_000).default(0)
});
const RESOURCE_PATTERN = RESOURCE_NAMES.map((name) => name.replaceAll("-", "\\-")).join("|");

function errorBody(code, message) {
  return { error: { code, message } };
}

function sendError(res, status, code, message) {
  return res.status(status).json(errorBody(code, message));
}

function errorStatus(error) {
  switch (error?.message) {
    case "NOT_FOUND": return [404, "NOT_FOUND", "Resource not found."];
    case "CONFLICT": return [409, "CONFLICT", "Resource conflicts with an existing item."];
    case "INVALID_INPUT": return [400, "INVALID_INPUT", "Request is invalid."];
    case "CHAT_TIMEOUT": return [504, "CHAT_TIMEOUT", "Assistant did not respond. Please try again."];
    case "CHAT_UNAVAILABLE": return [502, "CHAT_UNAVAILABLE", "Assistant is temporarily unavailable."];
    default: return [503, "SERVICE_UNAVAILABLE", "Service is temporarily unavailable."];
  }
}

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

export function createApp({ publicClient, serviceClient, env = process.env, fetchImpl = fetch, service: suppliedService } = {}) {
  const app = express();
  app.disable("x-powered-by");

  const trustedProxyHops = env.TRUST_PROXY;
  if (trustedProxyHops && /^\d+$/.test(trustedProxyHops)) {
    app.set("trust proxy", Number(trustedProxyHops));
  }

  const service = suppliedService || new CmsService({ publicClient, serviceClient });
  const allowedOrigins = new Set((env.FRONTEND_ORIGINS || env.FRONTEND_ORIGIN || "")
    .split(",").map((origin) => origin.trim()).filter(Boolean));
  const chatConfiguration = getChatConfiguration(env);

  app.use((req, res, next) => {
    const requestId = req.get("x-request-id");
    req.requestId = requestId && /^[A-Za-z0-9._-]{1,100}$/.test(requestId) ? requestId : randomUUID();
    res.setHeader("X-Request-ID", req.requestId);
    const origin = req.get("origin");
    if (origin) {
      if (!allowedOrigins.has(origin)) return sendError(res, 403, "ORIGIN_NOT_ALLOWED", "Request origin is not allowed.");
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, X-Request-ID");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    }
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
  });

  app.use(helmet());
  app.use(express.json({ limit: "128kb", strict: true, type: "application/json" }));
  app.use((req, res, next) => {
    const started = Date.now();
    res.on("finish", () => {
      // Never log bodies, query strings, authorization headers, or raw chatbot questions.
      console.info(JSON.stringify({
        event: "http.request",
        request_id: req.requestId,
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration_ms: Date.now() - started
      }));
    });
    next();
  });

  const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1_000,
    limit: 120,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (_req, res) => sendError(res, 429, "RATE_LIMITED", "Too many requests. Try again later.")
  });
  const chatLimiter = rateLimit({
    windowMs: 15 * 60 * 1_000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (_req, res) => sendError(res, 429, "RATE_LIMITED", "Too many questions. Try again later.")
  });
  app.use("/api/public", publicLimiter);

  app.get("/health", (_req, res) => res.json({ data: { status: "ok" } }));

  app.post("/api/public/chat", chatLimiter, asyncRoute(async (req, res) => {
    const parsed = chatPayload.safeParse(req.body);
    if (!parsed.success) return sendError(res, 400, "INVALID_INPUT", "Question is required (maximum 2000 characters).");
    if (!chatConfiguration) {
      return sendError(res, 503, "CHAT_NOT_CONFIGURED", "Assistant is not configured.");
    }
    try {
      const completion = await answerChat({
        message: parsed.data.message,
        configuration: chatConfiguration,
        fetchImpl,
        service
      });
      return res.json({ data: { reply: completion.answer, model: completion.model } });
    } catch (error) {
      const [status, code, message] = errorStatus(error);
      return sendError(res, status, code, message);
    }
  }));

  app.get(new RegExp(`^/api/public/(${RESOURCE_PATTERN})$`), asyncRoute(async (req, res) => {
    const parsed = pagination.safeParse(req.query);
    if (!parsed.success) return sendError(res, 400, "INVALID_INPUT", "Pagination is invalid.");
    const data = await service.listPublished(req.params[0], parsed.data);
    return res.json({ data });
  }));
  app.get(new RegExp(`^/api/public/(${RESOURCE_PATTERN})/([^/]+)$`), asyncRoute(async (req, res) => {
    const resource = req.params[0];
    const id = req.params[1];
    if (!UUID.test(id)) return sendError(res, 400, "INVALID_INPUT", "Resource identifier is invalid.");
    const data = await service.getPublished(resource, id);
    return res.json({ data });
  }));

  const authenticate = asyncRoute(async (req, res, next) => {
    const match = /^Bearer ([^\s]+)$/i.exec(req.get("authorization") || "");
    if (!match || !publicClient || !serviceClient) {
      return sendError(res, 401, "UNAUTHENTICATED", "Authentication is required.");
    }
    const { data, error } = await publicClient.auth.getUser(match[1]);
    if (error || !data?.user?.id) return sendError(res, 401, "UNAUTHENTICATED", "Authentication is required.");
    req.cmsUser = data.user;
    req.cmsRole = await service.getRole(data.user.id);
    if (!req.cmsRole) return sendError(res, 403, "FORBIDDEN", "You are not authorized to perform this action.");
    next();
  });

  const requireEditor = (req, res, next) => {
    if (!["admin_it", "editor_guru_staf"].includes(req.cmsRole)) {
      return sendError(res, 403, "FORBIDDEN", "You are not authorized to perform this action.");
    }
    next();
  };
  const requireAdmin = (req, res, next) => {
    if (req.cmsRole !== "admin_it") {
      return sendError(res, 403, "FORBIDDEN", "You are not authorized to perform this action.");
    }
    next();
  };

  app.get("/api/admin/me", authenticate, requireEditor, (req, res) => {
    return res.json({ data: { userId: req.cmsUser.id, role: req.cmsRole } });
  });
  app.get("/api/admin/analytics", authenticate, requireEditor, asyncRoute(async (_req, res) => {
    const data = await service.getChatAnalytics({ days: 30, limit: 20 });
    return res.json({ data });
  }));

  app.get(new RegExp(`^/api/admin/(${RESOURCE_PATTERN})$`), authenticate, requireEditor, asyncRoute(async (req, res) => {
    const parsed = pagination.safeParse(req.query);
    if (!parsed.success) return sendError(res, 400, "INVALID_INPUT", "Pagination is invalid.");
    const data = await service.listAdmin(req.params[0], { ...parsed.data, limit: Math.min(parsed.data.limit, 100) });
    return res.json({ data });
  }));
  app.post(new RegExp(`^/api/admin/(${RESOURCE_PATTERN})$`), authenticate, requireEditor, asyncRoute(async (req, res) => {
    const resource = req.params[0];
    const parsed = validateContent(resource, req.body);
    if (!parsed.success) return sendError(res, 400, "INVALID_INPUT", "Content does not match the resource schema.");
    const item = await service.createContent(resource, parsed.data);
    return res.status(201).json({ data: item });
  }));
  app.patch(new RegExp(`^/api/admin/(${RESOURCE_PATTERN})/([^/]+)$`), authenticate, requireEditor, asyncRoute(async (req, res) => {
    const resource = req.params[0];
    const id = req.params[1];
    if (!UUID.test(id)) return sendError(res, 400, "INVALID_INPUT", "Resource identifier is invalid.");
    const parsed = validateContent(resource, req.body, { partial: true });
    if (!parsed.success) return sendError(res, 400, "INVALID_INPUT", "Content does not match the resource schema.");
    const item = await service.updateContent(resource, id, parsed.data);
    return res.json({ data: item });
  }));
  app.delete(new RegExp(`^/api/admin/(${RESOURCE_PATTERN})/([^/]+)$`), authenticate, requireAdmin, asyncRoute(async (req, res) => {
    const resource = req.params[0];
    const id = req.params[1];
    if (!UUID.test(id)) return sendError(res, 400, "INVALID_INPUT", "Resource identifier is invalid.");
    await service.deleteContent(resource, id);
    return res.status(204).end();
  }));

  app.put("/api/admin/users/:userId/role", authenticate, requireAdmin, asyncRoute(async (req, res) => {
    if (!UUID.test(req.params.userId)) return sendError(res, 400, "INVALID_INPUT", "User identifier is invalid.");
    if (req.params.userId === req.cmsUser.id) return sendError(res, 409, "SELF_ROLE_CHANGE", "You cannot change your own role.");
    const parsed = rolePayload.safeParse(req.body);
    if (!parsed.success) return sendError(res, 400, "INVALID_INPUT", "Role is invalid.");
    await service.setUserRole(req.params.userId, parsed.data.role);
    return res.status(204).end();
  }));

  app.use((req, res) => sendError(res, 404, "NOT_FOUND", "Resource not found."));
  app.use((error, req, res, _next) => {
    if (res.headersSent) return;
    if (error?.type === "entity.too.large" || error instanceof SyntaxError) {
      return sendError(res, 400, "INVALID_INPUT", "Request body is invalid.");
    }
    const [status, code, message] = errorStatus(error);
    // Keep internal/provider/database errors out of client responses and logs.
    console.error(JSON.stringify({ event: "request.failed", request_id: req.requestId, code }));
    return sendError(res, status, code, message);
  });

  return app;
}
