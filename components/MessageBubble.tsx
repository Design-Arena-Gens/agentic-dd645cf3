import clsx from "classnames";
import { motion } from "framer-motion";
import { ConversationMessage } from "@/lib/types";
import { Sparkles, User } from "lucide-react";

type Props = {
  message: ConversationMessage;
};

export function MessageBubble({ message }: Props) {
  const isAssistant = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full gap-3"
    >
      <div
        className={clsx(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-medium",
          isAssistant
            ? "border-primary-400/70 bg-primary-500/10 text-primary-100"
            : "border-slate-600 bg-slate-800 text-slate-100"
        )}
      >
        {isAssistant ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      <div
        className={clsx(
          "flex max-w-[78%] flex-col gap-2 rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg",
          isAssistant
            ? "bg-slate-900/70 text-slate-100 ring-1 ring-primary-500/30"
            : "bg-primary-500/10 text-slate-100 ring-1 ring-primary-400/40"
        )}
      >
        {message.content.split("\n\n").map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit"
          })}
        </span>
      </div>
    </motion.div>
  );
}
