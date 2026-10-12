"use client";

export function ChatbotLink() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event("open-school-chat"))}>Chatbot Sekolah</button>;
}
