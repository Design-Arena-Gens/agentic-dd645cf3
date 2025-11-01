import { FlameKindling } from "lucide-react";

type GroundingCardProps = {
  practice?: {
    name: string;
    description: string;
    steps: string[];
  };
};

export function GroundingCard({ practice }: GroundingCardProps) {
  if (!practice) return null;

  return (
    <div className="rounded-3xl bg-primary-500/10 p-6 ring-1 ring-primary-500/40">
      <div className="flex items-center gap-3">
        <FlameKindling className="h-5 w-5 text-primary-200" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-100">
            Grounding Suggestion
          </p>
          <p className="text-lg font-semibold text-slate-100">{practice.name}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-200">{practice.description}</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-200">
        {practice.steps.map((step, index) => (
          <li key={index} className="flex gap-2">
            <span className="mt-1 h-6 w-6 rounded-full bg-slate-900/80 text-center text-xs font-semibold leading-6 text-primary-200 ring-1 ring-primary-500/30">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
