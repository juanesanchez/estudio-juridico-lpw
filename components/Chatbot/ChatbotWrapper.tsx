"use client";

import { useState } from "react";
import { Hero } from "@/components/Hero";
import { ChatWidget } from "@/components/Chatbot/ChatWidget";

export function ChatbotWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Hero onOpenChat={() => setIsOpen(true)} />
      <ChatWidget isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
