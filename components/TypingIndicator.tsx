import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary-400/50 bg-primary-500/10 text-primary-200">
        •••
      </div>
      <div className="flex items-center gap-2 rounded-2xl bg-slate-900/70 px-4 py-2 ring-1 ring-primary-500/30">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="block h-2 w-2 rounded-full bg-primary-300"
            animate={{
              opacity: [0.25, 1, 0.25],
              y: [0, -2, 0]
            }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 1,
              delay: index * 0.2
            }}
          />
        ))}
      </div>
    </div>
  );
}
