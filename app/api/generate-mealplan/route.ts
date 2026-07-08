// app/api/generate-mealplan/route.ts

import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set.");
      return NextResponse.json(
        { error: "Server misconfiguration: missing OPENAI_API_KEY." },
        { status: 500 }
      );
    }

    // Create the client inside the request handler so a missing/invalid
    // key returns a proper JSON error instead of crashing the whole route
    // module at import time (which Next.js turns into an HTML error page).
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Extract parameters from the request body
    const { dietType, calories, allergies, cuisine, snacks } =
      await request.json();

    const prompt = `
      You are a professional nutritionist. Create a 7-day meal plan for an individual following a ${dietType} diet aiming for ${calories} calories per day.
      
      Allergies or restrictions: ${allergies || "none"}.
      Preferred cuisine: ${cuisine || "no preference"}.
      Snacks included: ${snacks ? "yes" : "no"}.
      
      For each day, provide:
        - Breakfast
        - Lunch
        - Dinner
        ${snacks ? "- Snacks" : ""}
      
      Use simple ingredients and provide brief instructions. Include approximate calorie counts for each meal.
      
      Structure the response as a JSON object where each day is a key, and each meal (breakfast, lunch, dinner, snacks) is a sub-key. Example:
      
      {
        "Monday": {
          "Breakfast": "Oatmeal with fruits - 350 calories",
          "Lunch": "Grilled chicken salad - 500 calories",
          "Dinner": "Steamed vegetables with quinoa - 600 calories",
          "Snacks": "Greek yogurt - 150 calories"
        },
        "Tuesday": {
          "Breakfast": "Smoothie bowl - 300 calories",
          "Lunch": "Turkey sandwich - 450 calories",
          "Dinner": "Baked salmon with asparagus - 700 calories",
          "Snacks": "Almonds - 200 calories"
        }
        // ...and so on for each day
      }

      Return just the json with no extra commentaries and no backticks.
    `;

    // Send the prompt to the AI model
    const response = await openai.chat.completions.create({
      model: "meta-llama/llama-3.2-3b-instruct:free", // Ensure this model is accessible and suitable
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7, // Adjust for creativity vs. consistency
      max_tokens: 1500, // Adjust based on expected response length
    });

    // Extract the AI's response
    const rawContent = response.choices[0]?.message?.content;

    if (!rawContent) {
      console.error("Empty response from AI model:", response);
      return NextResponse.json(
        { error: "The AI model returned an empty response. Please try again." },
        { status: 500 }
      );
    }

    // Some free/OpenRouter models wrap JSON in ```json ... ``` fences
    // despite instructions not to. Strip those before parsing.
    const aiContent = rawContent
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    // Attempt to parse the AI's response as JSON
    let parsedMealPlan: { [day: string]: DailyMealPlan };
    console.log(aiContent);
    try {
      parsedMealPlan = JSON.parse(aiContent);
    } catch (parseError) {
      console.error("Error parsing AI response as JSON:", parseError);
      console.error("Raw AI content was:", aiContent);
      // If parsing fails, return the raw text with an error message
      return NextResponse.json(
        { error: "Failed to parse meal plan. Please try again." },
        { status: 500 }
      );
    }

    // Validate the structure of the parsedMealPlan
    if (typeof parsedMealPlan !== "object" || parsedMealPlan === null) {
      throw new Error("Invalid meal plan format received from AI.");
    }

    // Optionally, perform additional validation on the structure here

    // Return the parsed meal plan
    return NextResponse.json({ mealPlan: parsedMealPlan });
  } catch (error: any) {
    console.error("Error generating meal plan:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate meal plan. Please try again later." },
      { status: 500 }
    );
  }
}

// Define the DailyMealPlan interface here or import it if defined elsewhere
interface DailyMealPlan {
  Breakfast?: string;
  Lunch?: string;
  Dinner?: string;
  Snacks?: string;
}