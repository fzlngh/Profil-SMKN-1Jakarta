"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ToastType = "info" | "ok" | "err";
interface ToastItem {
  id: number;
  msg: string;
  type: ToastType;
}

const ToastContext = createContext<(msg: string, type?: ToastType) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((msg: string, type: ToastType = "info") => {
    const id = Date.now() + Math.random();
    setItems(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setItems(prev => prev.filter(i => i.id !== id));
    }, 3400);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2">
        {items.map(i => (
          <div
            key={i.id}
            className={`bg-navy-dark text-white px-4 py-2.5 rounded-lg text-[13px] shadow-card max-w-[320px] border-l-4 ${
              i.type === "err" ? "border-danger" : i.type === "ok" ? "border-ok" : "border-gold"
            }`}
          >
            {i.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
