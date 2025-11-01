'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "classnames";
import { Send, Sparkles } from "lucide-react";

import { GroundingCard } from "@/components/GroundingCard";
import { InsightPanel } from "@/components/InsightPanel";
import { MessageBubble } from "@/components/MessageBubble";
import { TypingIndicator } from "@/components/TypingIndicator";
import {
  ConversationMessage,
  CopingTechnique,
  TherapistResponse,
  TherapeuticInsight
} from "@/lib/types";

type FollowUp = string[];

const initialAssistantMessage: ConversationMessage = {
  role: "assistant",
  content:
    "Hi, I'm MindMend, your reflective companion. Take a slow breath and share whatever feels most present. We'll move gently and at your pace.",
  timestamp: new Date().toISOString(),
  metadata: {
    sentiment: "neutral",
    confidence: 0.6,
    topics: []
  }
};

export default function Home() {
  const [messages, setMessages] = useState<ConversationMessage[]>([
    initialAssistantMessage
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<TherapeuticInsight[]>([]);
  const [techniques, setTechniques] = useState<CopingTechnique[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp>([]);
  const [grounding, setGrounding] = useState<TherapistResponse["grounding"]>();
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ConversationMessage = {
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: [...messages, userMessage].slice(-10),
          message: trimmed
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate response");
      }

      const data: TherapistResponse = await response.json();
      setMessages((prev) => [...prev, data.reply]);
      setInsights(data.insights);
      setTechniques(data.techniques);
      setFollowUps(data.followUpPrompts);
      setGrounding(data.grounding);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm encountering a momentary difficulty responding. Let's try again in a little bit.",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentSuggestions = useMemo(() => followUps.slice(0, 4), [followUps]);

  return (
    <main className="relative flex min-h-screen flex-col items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-primary-500/30 via-slate-950/0 to-slate-950/0 blur-3xl" />
      <div className="relative grid w-full max-w-6xl gap-8 lg:grid-cols-[2fr,1fr]">
        <section className="flex flex-col gap-6 rounded-[32px] bg-black/20 p-4 sm:p-6 lg:p-8 ring-1 ring-slate-700/50">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-slate-900/50 p-4 ring-1 ring-primary-500/40">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary-200">
                MindMend
              </p>
              <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
                Psychologist Agent
              </h1>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-2 text-xs font-medium uppercase tracking-wide text-primary-100 ring-1 ring-primary-500/40">
              <Sparkles className="h-4 w-4" />
              CBT-informed reflections
            </div>
          </header>

          <div className="flex flex-1 flex-col justify-between gap-4 overflow-hidden">
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto pr-1">
              {messages.map((message) => (
                <MessageBubble key={message.timestamp + message.role} message={message} />
              ))}
              <AnimatePresence>{isLoading && <TypingIndicator />}</AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {currentSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentSuggestions.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setInput(prompt)}
                    className="rounded-full border border-primary-400/50 bg-primary-500/10 px-4 py-2 text-xs font-medium text-primary-100 transition hover:bg-primary-500/20"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="relative mt-2">
              <div className="flex items-end gap-3 rounded-3xl border border-slate-700/60 bg-slate-950/80 p-3 shadow-inner shadow-slate-900/40 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-400/40">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Describe what’s on your mind..."
                  className="max-h-40 min-h-[88px] flex-1 resize-none border-0 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                  disabled={isLoading}
                />
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading || input.trim().length === 0}
                  className={clsx(
                    "flex h-11 w-11 items-center justify-center rounded-full transition-all",
                    isLoading || input.trim().length === 0
                      ? "bg-slate-800 text-slate-500"
                      : "bg-primary-500/90 text-slate-50 shadow-lg shadow-primary-900/50 hover:bg-primary-400"
                  )}
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>
            </form>
          </div>
        </section>

        <aside className="flex flex-col gap-6">
          <InsightPanel insights={insights} techniques={techniques} />
          <GroundingCard practice={grounding} />

          <div className="glass-panel rounded-3xl p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-200">
              Reflective Prompts
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li>
                Check in with your body: what sensations tell you things are shifting?
              </li>
              <li>What support would future-you thank you for putting in place today?</li>
              <li>How might you show yourself compassion over the next 24 hours?</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-slate-900/60 p-6 ring-1 ring-slate-700/60">
            <h2 className="text-lg font-semibold text-slate-100">
              Safety Resources
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              If you&apos;re in immediate danger, call your local emergency number. In
              the US, dial or text 988 for the Suicide & Crisis Lifeline. In the UK,
              contact Samaritans at 116 123.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
