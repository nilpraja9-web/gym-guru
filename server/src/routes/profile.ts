import { Router, type Request, type Response } from "express";
import { prisma } from "../lib/prisma";

export const profileRouter = Router();

profileRouter.post("/", async(req: Request, res: Response) => {
    try{
        const {userId, ...profileData} = req.body;
        if(!userId){
            return res.status(400).json({message: "User ID is required"});
        }
        const {
            goal,
            experience,
            daysPerWeek,
            sessionDuration,
            equipment,
            injuries,
            split
        } = profileData;

        if (
            !goal ||
            !experience ||
            !daysPerWeek ||
            !sessionDuration ||
            !equipment||
            !split
        ){
            return res.status(400).json({message: "All fields are required"});
        }

        await prisma.user_profiles.upsert({
            where: {
                user_id: userId
            },
            create: {
                user_id: userId,
                goal,
                experience,
                daysPerWeek: daysPerWeek,
                sessionDuration: sessionDuration,
                equipment,
                injuries: injuries || null,
                split: split,
            },
            update: {
                goal,
                experience,
                daysPerWeek: daysPerWeek,
                sessionDuration: sessionDuration,
                equipment,
                injuries: injuries || null,
                split: split,
                update_at: new Date(),
            }
        });
        
        return res.status(201).json({message: "Profile created successfully"});

    }catch (err)
    {
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
    
});