import { askAI } from "@/lib/aihelper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { prediction, cropType, confidence } = body;

        if (!prediction || !cropType) {
            return NextResponse.json(
                { error: "Missing prediction or cropType" },
                { status: 400 }
            );
        }

        const question = `I have a ${cropType} plant leaf that has been diagnosed with "${prediction}" with a confidence of ${(confidence * 100).toFixed(1)}%. Please provide detailed recommendations in the JSON format specified. Be specific to this disease and crop type.`;

        const aiResponse = await askAI(question);

        // The response may contain markdown code fences, strip them
        let cleaned = aiResponse.trim();
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.slice(7);
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.slice(3);
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.slice(0, -3);
        }
        cleaned = cleaned.trim();

        const parsed = JSON.parse(cleaned);
        return NextResponse.json(parsed);
    } catch (error) {
        console.error("[AI Review] Error:", error);
        return NextResponse.json(
            { error: "Failed to get AI review. Please try again." },
            { status: 500 }
        );
    }
}
