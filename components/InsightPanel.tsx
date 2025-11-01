import { CopingTechnique, TherapeuticInsight } from "@/lib/types";
import { BookOpen, Brain, Compass } from "lucide-react";

type InsightPanelProps = {
  insights: TherapeuticInsight[];
  techniques: CopingTechnique[];
};

export function InsightPanel({ insights, techniques }: InsightPanelProps) {
  if (insights.length === 0 && techniques.length === 0) {
    return null;
  }

  return (
    <div className="glass-panel w-full rounded-3xl p-6">
      <div className="flex items-center gap-2 pb-3">
        <Brain className="h-5 w-5 text-primary-300" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
          Therapeutic Insights
        </h3>
      </div>

      {insights.length > 0 && (
        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.title}
              className="rounded-2xl bg-slate-900/70 p-4 ring-1 ring-primary-500/20"
            >
              <p className="text-sm font-semibold text-primary-100">{insight.title}</p>
              <p className="mt-2 text-sm text-slate-200">{insight.description}</p>
            </div>
          ))}
        </div>
      )}

      {techniques.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary-300" />
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Regulation Toolkit
            </h4>
          </div>

          {techniques.map((technique) => (
            <div
              key={technique.label}
              className="rounded-2xl bg-slate-900/70 p-4 ring-1 ring-primary-500/20"
            >
              <p className="text-sm font-semibold text-primary-100">{technique.label}</p>
              <p className="mt-2 text-sm text-slate-200">{technique.summary}</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {technique.steps.map((step, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="mt-1 h-6 w-6 rounded-full bg-primary-500/10 text-center text-xs font-semibold leading-6 text-primary-200 ring-1 ring-primary-500/40">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-primary-500/10 p-4 ring-1 ring-primary-500/40">
        <BookOpen className="h-5 w-5 text-primary-200" />
        <p className="text-sm text-primary-100">
          This agent is supportive, not a crisis responder. If you&apos;re in immediate
          danger, contact your local emergency number or a crisis hotline such as
          988 (US).
        </p>
      </div>
    </div>
  );
}
