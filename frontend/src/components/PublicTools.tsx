"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

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
  "Halo Sobat Vokasi! 👋 Saya Wilhel, asisten Virtual SMKN 1 Jakarta (Budi Utomo). Ada yang bisa saya bantu seputar PPDB 2025/2026, Program Keahlian, Jadwal Loket PTSP, atau Legalisir Ijazah?";

const quickQuestions = [
  "Apa saja program keahliannya?",
  "Di mana saya bisa melihat informasi prestasi?",
  "Bagaimana cara menghubungi sekolah?"
];

export function PublicTools() {
  const [largeText, setLargeText] = useState(0);
  const [contrast, setContrast] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
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
    const text = normalized.toLocaleLowerCase("id-ID");
    const reply = text.includes("program") || text.includes("keahlian")
      ? "Informasi program keahlian dapat dilihat pada halaman Program Keahlian. Data di situs ini bersifat pratinjau dan tidak mengambil data layanan sekolah."
      : text.includes("prestasi") || text.includes("kegiatan")
        ? "Silakan lihat halaman Kesiswaan untuk informasi kegiatan dan prestasi yang tercantum pada desain situs."
        : text.includes("kontak") || text.includes("hubung")
          ? "Kanal kontak sekolah dan formulir pratinjau tersedia pada halaman Hubungi Kami. Formulir tidak mengirim atau menyimpan data."
          : "Asisten ini sedang dalam mode pratinjau dan belum terhubung ke layanan sekolah. Silakan gunakan tautan halaman atau kontak yang tersedia di situs.";
    setMessages((current) => [...current, { role: "assistant", content: reply }]);
    setPending(false);
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

  function clearConversation() {
    setMessages([{ role: "assistant", content: welcomeMessage }]);
    setQuestion("");
    setError("");
    setChatSpeechStatus("");
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
        <section className="chat-panel" id="school-chat" aria-labelledby="chat-title" hidden={!chatOpen} onKeyDown={onChatKeyDown}>
          <div className="chat-brand-row">
            <span className="chat-avatar" aria-hidden="true">♧</span>
            <div className="chat-brand-copy"><div className="chat-brand-name"><strong>Wilhel</strong><span>AI VOKASI</span></div><span>Asisten Virtual SMKN 1 Jakarta</span><small>Jakarta <b>● Online • Siap membantu 24/7</b></small></div>
            <div className="chat-header-actions"><button type="button" aria-label="Percakapan baru" title="Percakapan baru" onClick={clearConversation}>⟳</button><button type="button" aria-label="Minimalkan chatbot" title="Minimalkan" onClick={closeChat}>−</button><button type="button" aria-label="Tutup chatbot" title="Tutup" onClick={closeChat}>×</button></div>
          </div>
          <h2 className="sr-only" id="chat-title">Chat dengan Wilhel, Asisten Virtual SMKN 1 Jakarta</h2>
          <div className="chat-messages" role="log" aria-live="polite" aria-relevant="additions">
            {messages.map((message, index) => (
              <div className={`chat-message chat-message-${message.role}`} key={`${message.role}-${index}`}>
                <p>{message.content}</p>
                {message.role === "assistant" && <button className="chat-read-aloud" type="button" onClick={() => speak(message.content)}>Bacakan jawaban</button>}
                {message.role === "assistant" && /belum tersedia|belum terverifikasi|tidak dapat membantu/i.test(message.content) && (
                  <a className="chat-contact-link" href="/kontak#faq">Lihat FAQ &amp; kontak sekolah</a>
                )}
              </div>
            ))}
            {pending && <p className="chat-loading" role="status">Asisten sedang menyiapkan jawaban…</p>}
          </div>
          <div className="chat-composer">
            {error && <p className="chat-error" role="alert">{error} <a href="/kontak#faq">Lihat FAQ &amp; kontak sekolah</a></p>}
            <form onSubmit={submitQuestion}>
              <label className="sr-only" htmlFor="chat-question">Tulis pertanyaan Anda di sini</label>
              <div className="chat-form-row">
                <label className="chat-attachment" aria-label="Lampirkan file" title="Lampirkan file"><input type="file" accept="image/*,.pdf" onChange={(event) => { if (event.target.files?.[0]) setChatSpeechStatus(`Lampiran dipilih: ${event.target.files[0].name}`); }} /><span aria-hidden="true">♧</span></label>
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
                  {listening ? "■" : "♩"}
                </button>
                <button type="submit" disabled={pending || !question.trim()} aria-label="Kirim pertanyaan">
                  {pending ? "…" : "➤"}
                </button>
              </div>
            </form>
            <p className="speech-status chat-speech-status" role="status" aria-live="polite">{chatSpeechStatus}</p>
            <div className="chat-footer"><span>◉ Didukung oleh AI Vokasi • Terintegrasi TPS SMKN 1 Jakarta</span><button type="button" onClick={clearConversation}>Bersihkan Percakapan</button></div>
          </div>
        </section>
      </div>
    </>
  );
}
