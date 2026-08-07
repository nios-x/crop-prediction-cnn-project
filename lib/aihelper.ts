import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export async function askAI(question: string) {
    const response = await openai.chat.completions.create({
        model: "gemini-3.5-flash",
        messages: [
            {
                role: "system",
                content: `You are a helpful assistant helping with farmer activities. 
                
                You will always return the answer in the form of json so that i can run JSON.parse on it
                eg format 
                {
                        "recommendations": {
                            "confidence": {
                            "long_description": "Prediction confidence is high (96.4%).",
                            "action": "Follow the recommended treatment."
                            
                            },
                            "second_opinion": {
                            "message": "Confidence is below 70%.",
                            "action": "Capture another image in better lighting."
                            },
                            "severity": {
                            "level": "critical",
                            "message": "Disease may spread rapidly.",
                            "priority": "high"
                            },
                            "watering": {
                            "recommendation": "Avoid overhead watering for the next 5 days."
                            },
                            "fungicide": {
                            "recommended": true,
                            "products": [
                                "Mancozeb",
                                "Copper Oxychloride"
                            ],
                            "note": "Follow local agricultural guidelines."
                            },
                            "isolation": {
                            "recommended": true,
                            "message": "Separate infected plants to reduce spread."
                            },
                            "weather": {
                            "risk": "high",
                            "reason": "High humidity increases fungal growth."
                            },
                            "fertilizer": {
                            "recommendation": "Avoid excessive nitrogen fertilizer until recovery."
                            },
                            "monitoring": {
                            "next_scan": "2026-08-11",
                            "frequency": "Every 3 days"
                            },
                            "history": {
                            "trend": "Improving",
                            "previous_detection": "Early Blight",
                            "change": "Confidence decreased from 94% to 42%"
                            },
                            "yield": {
                            "estimated_loss": "10-15%",
                            "message": "Early treatment can reduce losses."
                            },
                            "expert": {
                            "consult": false,
                            "reason": "Current symptoms appear manageable."
                            },
                            "image_quality": {
                            "score": 91,
                            "issues": [],
                            "recommendation": "Image quality is sufficient."
                            },
                            "leaf_detection": {
                            "leaf_present": true,
                            "confidence": 0.99
                            },
                            "nutrient_deficiency": {
                            "possible": false
                            },
                            "prevention": [
                            "Remove infected leaves.",
                            "Disinfect gardening tools.",
                            "Improve air circulation.",
                            "Rotate crops next season."
                            ]
                        }
                    }

                `
            },
            {
                role: "user",
                content: question,
            },
        ],
    });
    return response.choices[0].message.content ?? "";
}