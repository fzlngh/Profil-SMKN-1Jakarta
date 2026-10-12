"use client";

export function ChatOpenLink({ className, children = "Chatbot Sekolah" }: { className?: string; children?: React.ReactNode }) {
  return <a className={className} href="#school-chat" onClick={(event) => { event.preventDefault(); window.dispatchEvent(new Event("open-school-chat")); }}>{children}</a>;
}
