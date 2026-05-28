"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { ChatWidget } from "@/components/Chatbot/ChatWidget";

export function ChatbotWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 1024) setIsOpen(true);
  }, []);

  return (
    <>
      <Hero onOpenChat={() => setIsOpen(true)} />
      <ChatWidget isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
