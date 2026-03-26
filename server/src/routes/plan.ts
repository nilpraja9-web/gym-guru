import { Router, type Request, type Response } from "express";
import { prisma } from "../lib/prisma";
import { generateTrainingPlan } from "../lib/ai";

export const planRouter = Router();

planRouter.post("/generate", async (req: Request, res: Response) => {
    try {
        const {userId} = req.body;
        if(!userId){
            return res.status(400).json({error: "User ID is required"});
        }
        const profile =await prisma.user_profiles.findUnique({
            where:{
                user_id: userId
            }
        })
        if(!profile){
            return res.status(404).json({error: "Profile not found"});
        }
        const latestPlan = await prisma.training_plan.findFirst({
            where:{
                user_id: userId
            },
            orderBy:{
                created_at: "desc"
            },
            select:{version:true}
         });

        const nextVersion = (latestPlan?.version ?? 0) + 1;
        let planJson;
        try {
            planJson = await generateTrainingPlan(profile);
        } catch (error) {
            console.error("[Route] Failed to generate plan:", error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            return res.status(500).json({ error: "Failed to generate plan", details: errorMessage });
        }


        const planText =JSON.stringify(planJson, null, 2);
        const newPlan =await prisma.training_plan.create({
            data:{
                user_id: userId,
                plan_json: planJson as any,
                plan_text: planText,
                version: nextVersion,
            }
        })
        res.json({
            id: newPlan.id,
            version: newPlan.version,
            createdAt: newPlan.created_at,
        })
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("[Route outer catch] Error:", errorMessage, error);
        return res.status(500).json({error: "Failed to generate plan", details: errorMessage});
    }
});
    planRouter.get("/current", async (req: Request, res: Response) => {
        try {
            const userId =req.query.userId as string;
            if(!userId){
                return res.status(400).json({error: "User ID is required"});
            }
            const plan = await prisma.training_plan.findFirst({
                where:{
                    user_id: userId
                },
                orderBy:{
                    created_at: "desc"
                }
            })
            if(!plan){
                return res.status(404).json({error: "Plan not found"});
            }
            res.json({
                 id: plan.id,
                 userId: plan.user_id,
                 planJson: plan.plan_json,
                 planText: plan.plan_text,
                 version: plan.version,
                 createdAt: plan.created_at,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error("[Route outer catch] Error:", errorMessage, error);
            return res.status(500).json({error: "Failed to get plan", details: errorMessage});
        }
    })

    