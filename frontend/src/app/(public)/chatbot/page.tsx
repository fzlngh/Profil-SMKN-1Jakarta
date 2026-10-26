export const metadata = {
  title: "Chatbot Wilhelmina — SMK Negeri 1 Jakarta",
  description: "Tanyakan informasi publik tentang SMK Negeri 1 Jakarta kepada Wilhelmina.",
};

export default function ChatbotPage() {
  return (
    <section className="chatbot-page-intro" aria-labelledby="chatbot-page-title">
      <div>
        <p>ASISTEN VIRTUAL SMKN 1 JAKARTA</p>
        <h1 id="chatbot-page-title">Halo, saya Wilhelmina.</h1>
        <span>Tanyakan apa saja soal SMKN 1 Jakarta.</span>
      </div>
    </section>
  );
}
