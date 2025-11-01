import { generateTherapistResponse } from "@/lib/therapist";
import { ConversationMessage } from "@/lib/types";
import { NextResponse } from "next/server";

type RequestPayload = {
  history: ConversationMessage[];
  message: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestPayload;

    if (!body?.message || typeof body.message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const sanitizedHistory = Array.isArray(body.history)
      ? body.history.slice(-8)
      : [];

    const response = generateTherapistResponse(sanitizedHistory, body.message);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Therapist respond error", error);
    return NextResponse.json(
      {
        error:
          "I'm having trouble formulating a thoughtful response right now. Can we try again?"
      },
      { status: 500 }
    );
  }
}
