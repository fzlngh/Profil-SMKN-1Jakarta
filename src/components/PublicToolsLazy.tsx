"use client";

import dynamic from "next/dynamic";

const PublicTools = dynamic(() => import("./PublicTools").then((m) => m.PublicTools), { ssr: false });

export function PublicToolsLazy() {
  return <PublicTools />;
}