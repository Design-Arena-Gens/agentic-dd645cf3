export type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  metadata?: {
    sentiment?: "positive" | "neutral" | "negative";
    confidence?: number;
    topics?: string[];
  };
};

export type TherapeuticInsight = {
  title: string;
  description: string;
};

export type CopingTechnique = {
  label: string;
  summary: string;
  steps: string[];
};

export type TherapistResponse = {
  reply: ConversationMessage;
  insights: TherapeuticInsight[];
  techniques: CopingTechnique[];
  followUpPrompts: string[];
  grounding?: {
    name: string;
    description: string;
    steps: string[];
  };
};
