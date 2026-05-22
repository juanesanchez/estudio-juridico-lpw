import { About } from "@/components/About";
import { ARTServices } from "@/components/ARTServices";
import { ChatbotWrapper } from "@/components/Chatbot/ChatbotWrapper";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Team } from "@/components/Team";

export default function Home() {
  return (
    <main className="min-h-screen bg-ink text-porcelain">
      <Navbar />
      <ChatbotWrapper />
      <About />
      <ARTServices />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}
