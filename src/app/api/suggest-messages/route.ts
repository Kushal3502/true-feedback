import { generateText } from "ai";
import { NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST() {
  try {
    const prompt =
      "Create a string containing three open-ended, engaging questions for an anonymous social messaging platform, such as Qooh.me. Each question should be separated by '||'. The questions should be inclusive, avoid sensitive or overly personal topics, and focus on universal themes that encourage friendly and positive interaction. Aim for intriguing prompts that foster curiosity and meaningful conversations. For example: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Make sure the tone is welcoming and the topics resonate with a diverse audience.";

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      maxTokens: 400,
      prompt,
    });

    const questions = text.replace("\n", "").split("||");

    return NextResponse.json({ success: true, questions }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
