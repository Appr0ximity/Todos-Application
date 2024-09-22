import e, { Request, Response } from "express";
import { auth } from "../middleware";
import prisma from "../api/prisma";
import { z } from "zod";

const router = e.Router()

//get all the types
router.get("/types",auth, async (req: Request, res: Response)=>{
    try {
        const types = await prisma.type.findMany()

        return res.status(200).json({
            msg:"Successfully found all the types",
            types: types
        })
    } catch (error) {
        console.log(error)
        return res.status(411).json({
            msg:"Error while fetching all types!"
        })
    }
})

const type = z.object({
    type: z.string()
})


//create a new type
router.post("/type",auth, async (req: Request, res: Response)=>{
    const {success} = type.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            msg:"Enter a valid type!"
        })
    }

    try {
        const response = await prisma.type.create({
            data:{
                type: req.body.type
            }
        })
        console.log(response)
        return res.status(200).json({
            msg:"Successfully created a new type!"
        })
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            msg:"Error while creating a type"
        })
    }
})




export default router