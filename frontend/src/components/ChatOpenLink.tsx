"use client";

export function ChatOpenLink({ className, children = "Chatbot Sekolah", "aria-label": ariaLabel, onClick }: { className?: string; children?: React.ReactNode; "aria-label"?: string; onClick?: React.MouseEventHandler<HTMLAnchorElement> }) {
  return <a className={className} href="#school-chat" aria-label={ariaLabel} onClick={(event) => { event.preventDefault(); window.dispatchEvent(new Event("open-school-chat")); onClick?.(event); }}>{children}</a>;
}
