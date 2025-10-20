import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface OptimizeRequest {
  title: string;
  description: string;
  features: string[];
  category: string;
}

export async function POST(request: Request) {
  try {
    const { title, description, features, category }: OptimizeRequest = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Product title is required" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert e-commerce SEO copywriter specializing in creating viral, conversion-focused product listings.

Given this AliExpress product data:
- Title: ${title}
- Description: ${description || "Not provided"}
- Features: ${features?.join(", ") || "Not provided"}
- Category: ${category}

Generate an optimized product listing with:

1. **Longtail Keywords** (10-15 keywords): Focus on buyer intent, trending search terms, and specific product attributes
2. **SEO Title** (55-60 chars): Catchy, keyword-rich, benefit-focused
3. **Product Description** (150-200 words): Compelling, benefit-driven, includes keywords naturally, addresses pain points
4. **Features** (5-7 bullet points): Specific, benefit-focused, use power words

Make it viral-worthy, conversion-focused, and optimized for search engines. Use emotional triggers and focus on benefits over features.

Respond ONLY with valid JSON in this exact format:
{
  "keywords": ["keyword1", "keyword2", ...],
  "title": "SEO-optimized title here",
  "description": "Full optimized description here",
  "features": ["Feature 1", "Feature 2", ...]
}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract the text content from the response
    const responseText = message.content[0].type === "text"
      ? message.content[0].text
      : "";

    // Parse the JSON response
    let optimizedData;
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        optimizedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", responseText);
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: optimizedData,
    });
  } catch (error: any) {
    console.error("SEO optimization error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to optimize product data" },
      { status: 500 }
    );
  }
}
