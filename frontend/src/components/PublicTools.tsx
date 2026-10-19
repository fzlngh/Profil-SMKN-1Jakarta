"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type SpeechRecognitionResultEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

const preferencesKey = "smkn1-public-accessibility";

const welcomeMessage =
  "Halo! Aku Wilhelmina, asisten virtual SMKN 1 Jakarta. Mau tahu soal apa hari ini?";

const quickQuestions = [
  ["Info program studi", "▤"],
  ["Jadwal & agenda", "◷"],
  ["Mitra industri & PKL", "⌁"],
  ["Kontak & lokasi", "⌖"]
];

export function PublicTools() {
  const pathname = usePathname();
  const faqHref = pathname === "/" ? "#faq" : "/#faq";
  const [largeText, setLargeText] = useState(0);
  const [contrast, setContrast] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [greetingVisible, setGreetingVisible] = useState(true);
  const [question, setQuestion] = useState("");
  const [readAloudStatus, setReadAloudStatus] = useState("");
  const [chatSpeechStatus, setChatSpeechStatus] = useState("");
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: welcomeMessage }
  ]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const accessTriggerRef = useRef<HTMLButtonElement>(null);
  const questionInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(preferencesKey);
      if (saved) {
        const preferences = JSON.parse(saved) as {
          largeText?: number;
          contrast?: boolean;
          dyslexiaFont?: boolean;
        };
        if (preferences.largeText === 1 || preferences.largeText === 2) setLargeText(preferences.largeText);
        setContrast(preferences.contrast === true);
        setDyslexiaFont(preferences.dyslexiaFont === true);
      }
    } catch {
      // Preferences remain available for this visit when browser storage is disabled.
    } finally {
      setPreferencesLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!preferencesLoaded) return;
    const root = document.documentElement;
    root.dataset.textScale = String(largeText);
    root.classList.toggle("high-contrast", contrast);
    root.classList.toggle("dyslexia-font", dyslexiaFont);
    try {
      window.localStorage.setItem(
        preferencesKey,
        JSON.stringify({ largeText, contrast, dyslexiaFont })
      );
    } catch {
      // Accessibility controls still work when browser storage is disabled.
    }
  }, [largeText, contrast, dyslexiaFont, preferencesLoaded]);

  useEffect(() => {
    if (chatOpen) questionInputRef.current?.focus();
  }, [chatOpen]);

  useEffect(() => {
    const openChat = () => setChatOpen(true);
    window.addEventListener("open-school-chat", openChat);
    return () => window.removeEventListener("open-school-chat", openChat);
  }, []);

  useEffect(() => () => {
    recognitionRef.current?.stop();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  function speak(text: string) {
    if (!("speechSynthesis" in window) || !text) {
      setReadAloudStatus("Pembacaan suara tidak tersedia di browser ini.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.onend = () => setReadAloudStatus("");
    window.speechSynthesis.speak(utterance);
    setReadAloudStatus("Pembacaan suara dimulai.");
  }

  function stopSpeaking() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setReadAloudStatus("Pembacaan suara dihentikan.");
  }

  function toggleSpeechInput() {
    const speechWindow = window as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setChatSpeechStatus("Dikte suara tidak didukung browser ini. Silakan ketik pertanyaan.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "id-ID";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) setQuestion((current) => `${current}${current ? " " : ""}${transcript}`.slice(0, 2000));
      setChatSpeechStatus(transcript ? "Dikte selesai. Periksa teks sebelum mengirim." : "Suara tidak dikenali. Silakan coba lagi.");
    };
    recognition.onerror = () => {
      setListening(false);
      setChatSpeechStatus("Dikte suara gagal atau izin mikrofon ditolak.");
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
      setChatSpeechStatus("Mendengarkan. Ucapkan pertanyaan dalam bahasa Indonesia.");
    } catch {
      setListening(false);
      setChatSpeechStatus("Dikte suara tidak dapat dimulai. Silakan coba lagi.");
    }
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
        body: JSON.stringify({ message: normalized }),
        cache: "no-store",
        signal: AbortSignal.timeout(30_000)
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        const code = typeof result === "object" && result !== null && "error" in result
          && typeof result.error === "object" && result.error !== null && "code" in result.error
          ? result.error.code
          : "";
        const messages: Record<string, string> = {
          CHAT_NOT_CONFIGURED: "Asisten belum dikonfigurasi oleh pengelola situs.",
          CHAT_TIMEOUT: "Asisten belum merespons. Silakan coba lagi.",
          CHAT_PROVIDER_RATE_LIMITED: "Layanan AI sedang mencapai batas penggunaan. Silakan coba lagi nanti.",
          CHAT_UNAVAILABLE: "Layanan AI sementara tidak tersedia. Silakan coba lagi nanti.",
          RATE_LIMITED: "Batas pertanyaan tercapai. Silakan tunggu beberapa saat sebelum mencoba lagi."
        };
        setError(messages[typeof code === "string" ? code : ""] || "Pertanyaan belum dapat diproses. Silakan coba lagi.");
        return;
      }
      const reply = typeof result === "object" && result !== null && "data" in result
        && typeof result.data === "object" && result.data !== null && "reply" in result.data
        && typeof result.data.reply === "string"
        ? result.data.reply
        : "";
      if (!reply) {
        setError("Asisten mengirim jawaban yang tidak dapat dibaca. Silakan coba lagi.");
        return;
      }
      setMessages((current) => [...current, { role: "assistant", content: reply }]);
    } catch {
      setError("Asisten sekolah sementara tidak dapat dijangkau. Silakan coba lagi.");
    } finally {
      setPending(false);
    }
  }

  function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(question);
  }

  function closeChat() {
    recognitionRef.current?.stop();
    setListening(false);
    setChatOpen(false);
  }

  function onChatKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") closeChat();
  }

  return (
    <>
      <div className="access-widget">
        <button
          ref={accessTriggerRef}
          className="utility-trigger"
          type="button"
          aria-expanded={accessOpen}
          aria-controls="accessibility-panel"
          aria-label={accessOpen ? "Tutup pengaturan aksesibilitas" : "Buka pengaturan aksesibilitas"}
          onClick={() => setAccessOpen((open) => !open)}
        >
          A−
        </button>
        <section
          className="access-panel"
          id="accessibility-panel"
          aria-labelledby="accessibility-title"
          hidden={!accessOpen}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setAccessOpen(false);
              accessTriggerRef.current?.focus();
            }
          }}
        >
          <h2 id="accessibility-title">Pengaturan aksesibilitas</h2>
          <div className="text-size-controls" role="group" aria-label="Ukuran teks">
            <button type="button" disabled={largeText === 0} onClick={() => setLargeText((size) => Math.max(0, size - 1))}>Perkecil teks</button>
            <span aria-live="polite">Ukuran teks: {["Normal", "Besar", "Lebih besar"][largeText]}</span>
            <button type="button" disabled={largeText === 2} onClick={() => setLargeText((size) => Math.min(2, size + 1))}>Perbesar teks</button>
          </div>
          <button type="button" aria-pressed={contrast} onClick={() => setContrast((enabled) => !enabled)}>
            Kontras tinggi <span>{contrast ? "aktif" : "nonaktif"}</span>
          </button>
          <button type="button" aria-pressed={dyslexiaFont} onClick={() => setDyslexiaFont((enabled) => !enabled)}>
            Tampilan ramah disleksia <span>{dyslexiaFont ? "aktif" : "nonaktif"}</span>
          </button>
          <p className="accessibility-note">Memakai OpenDyslexic jika tersedia di perangkat, dengan Verdana sebagai alternatif.</p>
          <button type="button" onClick={() => speak(document.querySelector("main")?.textContent?.trim() || "")}>Bacakan isi halaman</button>
          <button type="button" onClick={stopSpeaking}>Hentikan pembacaan</button>
          <p className="speech-status" role="status" aria-live="polite">{readAloudStatus}</p>
        </section>
      </div>

      <div className="chat-widget">
        {!chatOpen && <>
          {greetingVisible && <div className="chat-greeting" role="note" aria-label="Sapaan Wilhelmina">
            <button className="chat-greeting-open" type="button" onClick={() => setChatOpen(true)} aria-controls="school-chat">
              <span>Halo, saya Wilhelmina!<strong>Tanya apa saja soal SMKN 1 Jakarta.</strong></span>
            </button>
            <button className="chat-greeting-dismiss" type="button" aria-label="Tutup sapaan" onClick={() => setGreetingVisible(false)}>×</button>
            <i aria-hidden="true" />
          </div>}
          <button className="chat-trigger" type="button" onClick={() => setChatOpen(true)} aria-label="Buka chat Wilhelbot" aria-controls="school-chat" aria-expanded={chatOpen}>
          <span className="chat-trigger-icon" aria-hidden="true"><img src="/mascot.png" alt="" /></span>
          <span className="chat-trigger-copy"><strong>Tanya Chatbot</strong><small>Asisten info sekolah</small></span>
          </button>
        </>}
        <section className="chat-panel" id="school-chat" role="dialog" aria-modal="false" aria-labelledby="chat-title" hidden={!chatOpen} onKeyDown={onChatKeyDown}>
          <div className="chat-brand-row">
            <div className="chat-header-actions"><button type="button" aria-label="Kembali dan tutup chatbot" title="Kembali" onClick={closeChat}>←</button></div>
            <span className="chat-avatar" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 5.75A2.75 2.75 0 0 1 7.75 3h8.5A2.75 2.75 0 0 1 19 5.75v7.5A2.75 2.75 0 0 1 16.25 16H10l-4.5 4v-4.4A2.74 2.74 0 0 1 5 13.25v-7.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg></span>
            <div className="chat-brand-copy"><div className="chat-brand-name"><strong>WilhelBot <i className="chat-ai-badge">AI</i></strong></div><span>Online - Asisten SMKN 1 Jakarta <i aria-hidden="true" /></span></div>
          </div>
          <h2 className="sr-only" id="chat-title">Chat WilhelBot, asisten SMKN 1 Jakarta</h2>
          <div className="chat-messages" role="log" aria-live="polite" aria-relevant="additions">
            {messages.map((message, index) => (
              <div className={`chat-message chat-message-${message.role}`} key={`${message.role}-${index}`}>
                <p>{message.content}</p>
                {message.role === "assistant" && <button className="chat-read-aloud" type="button" onClick={() => speak(message.content)}>Bacakan jawaban</button>}
                {message.role === "assistant" && /belum tersedia|belum terverifikasi|tidak dapat membantu|tidak menemukan informasi/i.test(message.content) && (
                  <Link className="chat-contact-link" href={faqHref}>Lihat FAQ sekolah</Link>
                )}
              </div>
            ))}
            {messages.length === 1 && <div className="chat-suggestions"><small>PILIH TOPIK</small>{quickQuestions.map(([item, icon]) => <button key={item} type="button" disabled={pending} onClick={() => void ask(item)}><span aria-hidden="true">{icon}</span>{item}</button>)}</div>}
            {pending && <p className="chat-loading" role="status">Asisten sedang menyiapkan jawaban…</p>}
          </div>
          <div className="chat-composer">
            {error && <p className="chat-error" role="alert">{error} <Link href={faqHref}>Lihat FAQ sekolah</Link></p>}
            <form onSubmit={submitQuestion}>
              <label className="sr-only" htmlFor="chat-question">Tulis pertanyaan Anda di sini</label>
              <div className="chat-form-row">
                <input
                  id="chat-question"
                  ref={questionInputRef}
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  required
                  maxLength={2000}
                  disabled={pending}
                  placeholder="Tulis pertanyaan Anda di sini..."
                />
                <button className="speech-toggle" type="button" aria-label={listening ? "Hentikan dikte suara" : "Dikte suara"} title={listening ? "Hentikan dikte suara" : "Dikte suara"} aria-pressed={listening} onClick={toggleSpeechInput}>
                  {listening ? <span aria-hidden="true">■</span> : <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4m-3 0h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                </button>
                <button type="submit" disabled={pending || !question.trim()} aria-label="Kirim pertanyaan">
                  {pending ? "…" : "➤"}
                </button>
              </div>
            </form>
            <p className="speech-status chat-speech-status" role="status" aria-live="polite">{chatSpeechStatus}</p>
            <div className="chat-footer"><span>Jawaban berdasarkan konten publik terbit. Pesan diproses oleh penyedia AI; jangan sertakan data pribadi.</span></div>
          </div>
        </section>
      </div>
    </>
  );
}
