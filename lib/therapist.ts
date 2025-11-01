import { ConversationMessage, TherapistResponse } from "@/lib/types";

const negativeKeywords = [
  "anxious",
  "anxiety",
  "worried",
  "stressed",
  "stress",
  "overwhelmed",
  "tired",
  "exhausted",
  "sad",
  "down",
  "depressed",
  "hopeless",
  "angry",
  "frustrated",
  "guilty",
  "shame",
  "lonely",
  "afraid",
  "fear"
];

const positiveKeywords = [
  "grateful",
  "excited",
  "optimistic",
  "happy",
  "hopeful",
  "motivated",
  "Calm",
  "relaxed",
  "proud",
  "confident"
];

const themeKeywords: Record<string, string[]> = {
  work: ["work", "career", "job", "boss", "deadline", "burnout"],
  relationships: ["relationship", "partner", "friend", "family", "lonely", "trust"],
  health: ["sleep", "health", "exercise", "diet", "sick", "fatigue"],
  selfWorth: ["failure", "worthless", "not enough", "insecure", "confidence", "imposter"],
  anxiety: ["anxious", "panic", "panic attack", "fear", "worry"],
  depression: ["down", "depressed", "hopeless", "empty", "numb"]
};

const cognitiveDistortions: Record<string, string> = {
  "all-or-nothing thinking":
    "phrases like 'always', 'never', or 'completely' suggest a tendency to view situations in black-and-white terms.",
  "catastrophizing":
    "statements that jump to worst-case scenarios can be a sign of catastrophizing.",
  "discounting the positive":
    "downplaying achievements or positive feedback can point to discounting the positive."
};

const groundingTechniques = [
  {
    name: "5-4-3-2-1 Senses Reset",
    description:
      "Use your senses to anchor yourself in the present moment when anxiety feels overwhelming.",
    steps: [
      "Pause and breathe slowly, noticing the air entering and leaving your lungs.",
      "Name five things you can see around you.",
      "Identify four things you can touch and what they feel like.",
      "Listen for three distinct sounds.",
      "Notice two things you can smell.",
      "Describe one thing you can taste, or recall a comforting flavor."
    ]
  },
  {
    name: "Box Breathing",
    description:
      "A structured breathing technique that can calm your nervous system within minutes.",
    steps: [
      "Inhale through your nose for a count of four.",
      "Hold your breath gently for a count of four.",
      "Exhale through your mouth for a count of four.",
      "Hold again for four counts, then repeat for four cycles."
    ]
  }
];

type SentimentResult = {
  label: "positive" | "negative" | "neutral";
  score: number;
};

const formatTimestamp = () => new Date().toISOString();

function analyzeSentiment(message: string): SentimentResult {
  const text = message.toLowerCase();
  let score = 0;

  for (const keyword of negativeKeywords) {
    if (text.includes(keyword)) {
      score -= 1;
    }
  }

  for (const keyword of positiveKeywords) {
    if (text.includes(keyword)) {
      score += 1;
    }
  }

  if (score > 1) return { label: "positive", score };
  if (score < -1) return { label: "negative", score };
  return { label: "neutral", score };
}

function extractThemes(message: string): string[] {
  const text = message.toLowerCase();
  const matches = new Set<string>();

  Object.entries(themeKeywords).forEach(([theme, keywords]) => {
    if (keywords.some((keyword) => text.includes(keyword))) {
      matches.add(theme);
    }
  });

  return [...matches];
}

function detectDistortions(message: string): string[] {
  const text = message.toLowerCase();
  const detected: string[] = [];

  if (/(always|never|completely|totally)/.test(text)) {
    detected.push("all-or-nothing thinking");
  }

  if (/(disaster|ruined|worst|fail utterly|can't handle)/.test(text)) {
    detected.push("catastrophizing");
  }

  if (/(just lucky|doesn't count|not a big deal|anyone could)/.test(text)) {
    detected.push("discounting the positive");
  }

  return detected;
}

function craftEmpatheticOpening(sentiment: SentimentResult, themes: string[]): string {
  const themeText =
    themes.length > 0
      ? ` around ${themes
          .map((theme) =>
            ({
              work: "your work life",
              relationships: "your relationships",
              health: "your wellbeing",
              selfWorth: "how you see yourself",
              anxiety: "those anxious moments",
              depression: "feeling low"
            } as Record<string, string>)[theme] ?? theme
          )
          .join(" and ")}`
      : "";

  if (sentiment.label === "negative") {
    return `Thank you for letting me in. It sounds like things have been heavy${themeText}, and I'm noticing the weight you're carrying.`;
  }

  if (sentiment.label === "positive") {
    return `I appreciate you sharing this update. There's a calm strength coming through${themeText}, and it's valuable to notice what feels more grounded right now.`;
  }

  return `I'm hearing a lot to unpack${themeText}. Let's stay with it together and explore what feels most important in this moment.`;
}

function summarizeKeyFeelings(message: string): string {
  const feelingsMap: Record<string, string> = {
    anxious: "anxiety",
    worry: "worry",
    worried: "worry",
    stressed: "stress",
    overwhelmed: "overwhelm",
    tired: "fatigue",
    exhausted: "exhaustion",
    lonely: "loneliness",
    sad: "sadness",
    guilty: "guilt",
    shame: "shame",
    afraid: "fear",
    fear: "fear"
  };

  const found = new Set<string>();
  const text = message.toLowerCase();

  Object.entries(feelingsMap).forEach(([keyword, label]) => {
    if (text.includes(keyword)) {
      found.add(label);
    }
  });

  if (found.size === 0) return "";

  const feelings = [...found].join(", ");
  return `I'm picking up on ${feelings}. It's completely valid to feel this way given everything you're navigating.`;
}

function generateReflectiveQuestion(message: string, themes: string[]): string {
  if (themes.includes("work")) {
    return "When you notice these patterns at work, what feels most draining or activating about them?";
  }

  if (themes.includes("relationships")) {
    return "How do these moments impact the way you show up with the people you care about?";
  }

  if (themes.includes("selfWorth")) {
    return "What part of you is hardest to be compassionate toward right now?";
  }

  if (themes.includes("anxiety")) {
    return "What tends to happen in your body when the anxious wave starts to rise?";
  }

  if (themes.includes("depression")) {
    return "When the heaviness shows up, what do you notice about your energy and motivation?";
  }

  if (message.length > 280) {
    return "If we zoom out for a moment, what feels like the central thread you'd want us to follow together?";
  }

  return "What part of this feels most important for us to unpack together right now?";
}

function buildInsights(
  themes: string[],
  distortions: string[],
  sentiment: SentimentResult
): TherapistResponse["insights"] {
  const insights = [];

  if (themes.length > 0) {
    insights.push({
      title: "Themes emerging",
      description: `Your reflections point toward ${themes
        .map((theme) =>
          ({
            work: "work-related pressure",
            relationships: "relational dynamics",
            health: "mind-body wellbeing",
            selfWorth: "self-worth narratives",
            anxiety: "cycles of anxiety",
            depression: "an undercurrent of low mood"
          } as Record<string, string>)[theme] ?? theme
        )
        .join(", ")}. Noticing these themes can help us track how situations connect.`
    });
  }

  if (distortions.length > 0) {
    distortions.forEach((distortion) => {
      insights.push({
        title: `Possible ${distortion}`,
        description: cognitiveDistortions[distortion]
      });
    });
  }

  if (sentiment.label === "negative") {
    insights.push({
      title: "Emotional load",
      description:
        "Your language suggests a meaningful emotional weight. Naming it is a powerful first step toward shifting it."
    });
  }

  if (sentiment.label === "positive") {
    insights.push({
      title: "Resources present",
      description:
        "There's resilience and grounded energy in what you shared. Let's gather what helps so you can return to it intentionally."
    });
  }

  return insights;
}

function selectTechniques(
  themes: string[],
  sentiment: SentimentResult
): TherapistResponse["techniques"] {
  const techniques: TherapistResponse["techniques"] = [];

  if (themes.includes("anxiety") || sentiment.label === "negative") {
    techniques.push({
      label: "Name & reframe",
      summary:
        "Slow down the thought, name the emotion, and explore an alternative compassionate perspective.",
      steps: [
        "Describe the activating situation in one sentence.",
        "Name the dominant emotion you're experiencing.",
        "Capture the automatic thought that shows up alongside the feeling.",
        "Ask: what evidence supports and what evidence softens this thought?",
        "Craft a balanced statement that feels believable and kind."
      ]
    });
  }

  if (themes.includes("selfWorth")) {
    techniques.push({
      label: "Inner mentor dialogue",
      summary:
        "Access a wiser, compassionate voice within you to respond to harsh inner criticism.",
      steps: [
        "Imagine a future version of yourself who has moved through this challenge.",
        "What would they notice about how hard you're trying?",
        "Let them offer a short affirmation or reassurance.",
        "Write it down and revisit it when the self-judgment returns."
      ]
    });
  }

  if (techniques.length === 0) {
    techniques.push({
      label: "Body scan check-in",
      summary:
        "Build awareness of physical cues so you can respond earlier when stress rises.",
      steps: [
        "Take a slow breath and notice where tension gathers in your body.",
        "Softly ask: what is this part of me trying to protect?",
        "Bring warmth to that area with your breath or a gentle stretch.",
        "Note any shift in sensation, even if subtle."
      ]
    });
  }

  return techniques;
}

function selectGroundingTechnique(
  themes: string[],
  sentiment: SentimentResult
): TherapistResponse["grounding"] {
  if (sentiment.label !== "negative" && !themes.includes("anxiety")) {
    return undefined;
  }

  if (themes.includes("anxiety")) {
    return groundingTechniques[0];
  }

  return groundingTechniques[1];
}

function followUpPrompts(themes: string[], distortions: string[]): string[] {
  const prompts = new Set<string>();

  if (themes.includes("work")) {
    prompts.add("What boundaries or supports at work would feel protective right now?");
  }

  if (themes.includes("relationships")) {
    prompts.add("How might you communicate your needs to someone you trust?");
  }

  if (themes.includes("selfWorth")) {
    prompts.add("What would you say to a close friend feeling the way you do?");
  }

  if (distortions.includes("catastrophizing")) {
    prompts.add("What are three realistic outcomes between the worst-case and best-case scenarios?");
  }

  if (prompts.size < 2) {
    prompts.add("What support or shift would make the biggest difference this week?");
  }

  prompts.add("Would you like to revisit a grounding practice together?");

  return [...prompts];
}

export function generateTherapistResponse(
  history: ConversationMessage[],
  latest: string
): TherapistResponse {
  const sentiment = analyzeSentiment(latest);
  const themes = extractThemes(latest);
  const distortions = detectDistortions(latest);

  const opening = craftEmpatheticOpening(sentiment, themes);
  const feelings = summarizeKeyFeelings(latest);
  const question = generateReflectiveQuestion(latest, themes);

  const paragraphs = [opening];
  if (feelings) paragraphs.push(feelings);

  paragraphs.push(
    "Let's take this step by step, staying curious rather than critical about what's coming up."
  );
  paragraphs.push(question);

  const reply: ConversationMessage = {
    role: "assistant",
    content: paragraphs.join("\n\n"),
    timestamp: formatTimestamp(),
    metadata: {
      sentiment: sentiment.label,
      confidence: 0.68,
      topics: themes
    }
  };

  return {
    reply,
    insights: buildInsights(themes, distortions, sentiment),
    techniques: selectTechniques(themes, sentiment),
    followUpPrompts: followUpPrompts(themes, distortions),
    grounding: selectGroundingTechnique(themes, sentiment)
  };
}
