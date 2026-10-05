"use client";

import { FormEvent, useRef, useState } from "react";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type ChatResponse = {
  data?: { reply?: string };
  error?: { message?: string };
};

const welcomeMessage =
  "Halo! Saya asisten informasi SMK Negeri 1 Jakarta. Saya hanya menjawab seputar informasi sekolah yang tersedia dan akan memberi tahu jika informasi belum terverifikasi.";

const quickQuestions = [
  "Apa saja program keahliannya?",
  "Di mana saya bisa melihat informasi prestasi?",
  "Bagaimana cara menghubungi sekolah?"
];

export function PublicTools() {
  const [largeText, setLargeText] = useState(0);
  const [contrast, setContrast] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: welcomeMessage }
  ]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const chatTriggerRef = useRef<HTMLButtonElement>(null);

  function adjustText() {
    const next = (largeText + 1) % 3;
    setLargeText(next);
    document.documentElement.dataset.textScale = String(next);
  }

  function toggleContrast() {
    const next = !contrast;
    setContrast(next);
    document.documentElement.classList.toggle("high-contrast", next);
  }

  async function ask(message: string) {
    const normalized = message.trim();
    if (!normalized || pending) return;

    setError("");
    setQuestion("");
    setMessages((current) => [...current, { role: "user", content: normalized }]);
    setPending(true);
    try {
      const response = await fetch("/api/public/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: normalized })
      });
      const result = (await response.json()) as ChatResponse;
      const reply = result.data?.reply;
      if (!response.ok || !reply) {
        throw new Error(result.error?.message || "Asisten belum dapat menjawab. Silakan coba lagi.");
      }
      setMessages((current) => [...current, { role: "assistant", content: reply }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Koneksi asisten terganggu. Silakan coba lagi.");
      setQuestion(normalized);
    } finally {
      setPending(false);
    }
  }

  function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(question);
  }

  function speak(text: string) {
    if (!("speechSynthesis" in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    window.speechSynthesis.speak(utterance);
  }

  function closeChat() {
    setChatOpen(false);
    chatTriggerRef.current?.focus();
  }

  return (
    <>
      <div className="access-widget">
        {accessOpen && <div className="access-panel" aria-label="Pengaturan aksesibilitas">
          <strong>Aksesibilitas</strong>
          <button type="button" onClick={adjustText}>Ukuran teks: {["Normal", "Besar", "Lebih besar"][largeText]}</button>
          <button type="button" aria-pressed={contrast} onClick={toggleContrast}>Kontras tinggi {contrast ? "aktif" : "nonaktif"}</button>
          <button type="button" onClick={() => speak(document.querySelector("main")?.textContent?.slice(0, 1200) || "")}>Bacakan isi halaman</button>
        </div>}
        <button className="utility-trigger" type="button" aria-expanded={accessOpen} aria-label="Buka pengaturan aksesibilitas" onClick={() => setAccessOpen(!accessOpen)}>A−</button>
      </div>

      <div className="chat-widget">
        {chatOpen && <section className="chat-panel" id="school-chat" aria-labelledby="chat-title">
          <div className="chat-brand-row">
            <span className="chat-avatar" aria-hidden="true">S1</span>
            <div><span>ASISTEN INFORMASI SEKOLAH</span><strong>SMKN 1 Jakarta</strong></div>
            <button type="button" aria-label="Tutup chatbot" onClick={closeChat}>×</button>
          </div>
          <div className="chat-heading">
            <div><span>CHATBOT AI · 3 MODEL GRATIS</span><h2 id="chat-title">Ada yang ingin diketahui?</h2></div>
          </div>
          <p className="chat-scope">Jawaban hanya seputar SMK Negeri 1 Jakarta. Informasi yang belum terverifikasi akan disebutkan apa adanya.</p>
          <div className="chat-messages" role="log" aria-live="polite" aria-relevant="additions">
            {messages.map((message, index) => (
              <div className={`chat-message chat-message-${message.role}`} key={`${message.role}-${index}`}>
                <p>{message.content}</p>
                {message.role === "assistant" && <button type="button" onClick={() => speak(message.content)}>Bacakan jawaban</button>}
              </div>
            ))}
            {pending && <p className="chat-loading" role="status">Asisten sedang menyiapkan jawaban…</p>}
          </div>
          <div className="chat-composer">
            <div className="chat-quick-heading"><strong>Pertanyaan cepat</strong></div>
            <div className="chat-quick-questions">
              {quickQuestions.map((item) => (
                <button type="button" key={item} disabled={pending} onClick={() => void ask(item)}>{item}</button>
              ))}
            </div>
            {error && <p className="chat-error" role="alert">{error}</p>}
            <form onSubmit={submitQuestion}>
              <label className="sr-only" htmlFor="chat-question">Tulis pertanyaan tentang sekolah</label>
              <div className="chat-form-row">
                <input
                  id="chat-question"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  required
                  maxLength={2000}
                  disabled={pending}
                  placeholder="Tulis pesan tentang sekolah…"
                />
                <button type="submit" disabled={pending || !question.trim()} aria-label="Kirim pertanyaan">
                  {pending ? "…" : "↑"}
                </button>
              </div>
            </form>
            <p className="chat-privacy">Pertanyaan diproses oleh penyedia AI pihak ketiga. Jangan kirim data pribadi.</p>
          </div>
        </section>}
        <button
          ref={chatTriggerRef}
          className="chat-trigger"
          type="button"
          aria-expanded={chatOpen}
          aria-controls="school-chat"
          aria-label={chatOpen ? "Tutup chatbot informasi sekolah" : "Buka chatbot informasi sekolah"}
          onClick={() => setChatOpen(!chatOpen)}
        >
          {chatOpen ? "Tutup" : "Tanya sekolah"} <span aria-hidden="true">✳</span>
        </button>
      </div>
    </>
  );
}
