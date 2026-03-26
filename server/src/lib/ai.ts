import OpenAI from "openai";
import dotenv from "dotenv";
import { TrainingPlan,UserProfile } from "../types/index"

dotenv.config();

  export async function generateTrainingPlan(
  profile: UserProfile | Record<string, any>,
): Promise<Omit<TrainingPlan, "id" | "userId" | "version" | "createdAt">> {
  // Normalize profile data
  const normalizedProfile: UserProfile = {
    goal: profile.goal || "bulk",
    experience: profile.experience || "intermediate",
    days_per_week: profile.days_per_week || 4,
    session_length: profile.session_length || 60,
    equipment: profile.equipment || "full_gym",
    injuries: profile.injuries || null,
    preferred_split: profile.preferred_split || "upper_lower",
  };
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_ROUTER_KEY;
  if (!apiKey){
    throw new Error("OpenAI API key (or OpenRouter key) is not defined");
  }
  const openai = new OpenAI({
    apiKey:apiKey,
    baseURL:"https://openrouter.ai/api/v1",
    defaultHeaders:{
        "HTTP-Referer": process.env.BASE_URL || "http://localhost:3000",
        "X-Title": "Gym AI"
    }

  });

 const prompt = buildPrompt(normalizedProfile);

  const FREE_MODELS = [
    "deepseek/deepseek-r1:free",
    "nvidia/nemotron-nano-8b-instruct:free",
    "google/gemma-3-27b-it:free",
    "openrouter/auto",   // always works — OpenRouter picks any available free model
  ];

  let lastError: unknown;
  for (const model of FREE_MODELS) {
    try {
      console.log(`[AI] Trying model: ${model}`);
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are an expert fitness trainer and program designer. You must respond with valid JSON only. Do not include any markdown, code fences, reasoning, or additional text. Only output the raw JSON object.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.6,
      });

      const rawContent = completion.choices[0].message.content;

      if (!rawContent) {
        console.error("[AI] No content in response from", model);
        continue;
      }

      // Strip markdown code fences if model wraps JSON in them
      const fenceMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = fenceMatch ? fenceMatch[1].trim() : rawContent.trim();

      const planData = JSON.parse(jsonStr);
      console.log(`[AI] Success with model: ${model}`);
      return formatPlanResponse(planData, normalizedProfile);
    } catch (err: unknown) {
      const status = (err as any)?.status;
      console.warn(`[AI] Model ${model} failed (${status}), trying next...`);
      lastError = err;
      if (status !== 404 && status !== 429 && status !== 400) {
        // Unexpected error — don't try more models
        break;
      }
    }
  }

  console.error("[AI] All models failed. Last error:", lastError);
  throw lastError;
}

function formatPlanResponse(
  aiResponse: any,
  profile: UserProfile,
): Omit<TrainingPlan, "id" | "userId" | "version" | "createdAt"> {
  const plan: Omit<TrainingPlan, "id" | "userId" | "version" | "createdAt"> = {
    overview: {
      goal: aiResponse.overview?.goal || `Customized ${profile.goal} program`,
      frequency:
        aiResponse.overview?.frequency ||
        `${profile.days_per_week} days per week`,
      split: aiResponse.overview?.split || profile.preferred_split,
      notes:
        aiResponse.overview?.notes ||
        "Follow the program consistently for best results.",
    },
    weeklySchedule: (aiResponse.weeklySchedule || []).map((day: any) => ({
      day: day.day || "Day",
      focus: day.focus || "Full Body",
      exercises: (day.exercises || []).map((ex: any) => ({
        name: ex.name || "Exercise",
        sets: ex.sets || 3,
        reps: ex.reps || "8-12",
        rest: ex.rest || "60-90 sec",
        rpe: ex.rpe || 7,
        notes: ex.notes,
        alternatives: ex.alternatives,
      })),
    })),
    progression:
      aiResponse.progression ||
      "Increase weight by 2.5-5lbs when you can complete all sets with good form. Track your progress weekly.",
  };
  return plan;
}

  

function buildPrompt(profile:UserProfile):string{
    const goalMap:Record<string,string> = {
     bulk: "build muscle and gain size",
    cut: "lose fat and maintain muscle",
    recomp: "simultaneously lose fat and build muscle",
    strength: "build maximum strength",
    endurance: "improve cardiovascular endurance and stamina",
        build_muscle: "Build muscle mass",
        lose_fat: "Lose fat",
        improve_strength: "Improve strength",
        improve_endurance: "Improve endurance",
        improve_flexibility: "Improve flexibility",
        improve_balance: "Improve balance",
        improve_coordination: "Improve coordination",
        improve_agility: "Improve agility",
        improve_power: "Improve power",
        improve_speed: "Improve speed",
        improve_reaction_time: "Improve reaction time",
        improve_cardiovascular_health: "Improve cardiovascular health",
        improve_flexibility_and_mobility: "Improve flexibility and mobility",
        improve_balance_and_stability: "Improve balance and stability",
        improve_coordination_and_agility: "Improve coordination and agility",
        improve_power_and_speed: "Improve power and speed",
    }
    const experienceMap:Record<string,string> = {
        beginner: "0-6 months of consistent training",
        intermediate: "intermediate (1-3 years of training experience)",
        advanced: "advanced (3+ years of training experience)",
    }
    const equipmentMap: Record<string, string> = {
        full_gym: "full gym access with all equipment",
        home: "home gym with limited equipment",
        dumbbells: "only dumbbells available",
  };
    const splitMap: Record<string, string> = {
        full_body: "full body workouts",
        upper_lower: "upper/lower split",
        ppl: "push/pull/legs split",
        custom: "best split for their goals",
  };
    return `Create a personalized ${profile.days_per_week}-day per week training plan for someone with the following profile:
  
    Goal: ${goalMap[profile.goal] || profile.goal}
    Experience Level: ${experienceMap[profile.experience] || profile.experience}
    Session Length: ${profile.session_length} minutes per session
    Equipment: ${equipmentMap[profile.equipment] || profile.equipment}
    Preferred Split: ${splitMap[profile.preferred_split] || profile.preferred_split}
    ${profile.injuries ? `Injuries/Limitations: ${profile.injuries}` : ""}

    Generate a complete training plan in JSON format with this exact structure:
    {
      "overview": {
        "goal": "brief description of the training goal",
        "frequency": "X days per week",
        "split": "training split name",
        "notes": "important notes about the program (2-3 sentences)"
      },
      "weeklySchedule": [
        {
          "day": "Monday",
          "focus": "muscle group or focus area",
          "exercises": [
            {
              "name": "Exercise Name",
              "sets": 4,
              "reps": "6-8",
              "rest": "2-3 min",
              "rpe": 8,
              "notes": "form cues or tips (optional)",
              "alternatives": ["Alternative 1", "Alternative 2"]
            }
          ]
        }
      ],
      "progression": "detailed progression strategy (2-3 sentences explaining how to progress)"
    }

      Requirements:
      - Create exactly ${profile.days_per_week} workout days
      - Each workout should fit within ${profile.session_length} minutes
      - Include 4-6 exercises per workout
      - RPE (Rate of Perceived Exertion) should be 6-9
      - Include compound movements for beginners/intermediate, advanced can have more isolation
      - Match the preferred split type: ${profile.preferred_split}
      - ${profile.injuries ? `Avoid exercises that could aggravate: ${profile.injuries}` : ""}
      - Provide exercise alternatives where appropriate
      - Make it progressive and suitable for ${experienceMap[profile.experience] || profile.experience} level

      Return ONLY the JSON object (no markdown, no extra text).
      `;
}   