import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Groq API error");
    }

    return NextResponse.json({
      reply: data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Chat API error:", error.message);
    return NextResponse.json(
      {
        error: "Failed to get response from AI",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}