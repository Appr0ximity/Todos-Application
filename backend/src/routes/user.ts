import express, { Request, Response } from "express"
import { z } from "zod"
import prisma from "../api/prisma"
import { sign } from "jsonwebtoken"

const router = express.Router()

const signUp = z.object({
    email: z.string().email(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string()
})

router.post("/signup", async (req: Request, res: Response)=>{
    const {success} = signUp.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            msg:"Invalid Credentials"
        })
    }

    const currentUser = await prisma.user.findUnique({
        where:{
            email : req.body.email
        }
    })

    if(currentUser != null){
        return res.status(411).json({
            msg: "User already exists"
        })
    }


    try {
        const response = await prisma.user.create({
            data: {
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: req.body.password
            },
        })
        console.log(response)
        return res.status(200).json({
            msg: "Sign up successful!"
        })
    } catch (error) {
        return res.status(401).json({
            msg: error
        })
    }

})

const siginIn = z.object({
    email: z.string().email(),
    password:  z.string()
})

router.get("/signin", async(req: Request, res: Response)=>{
    const SECRETKEY: string = process.env.SECRETKEY || ""

    const {success} = siginIn.safeParse(req.body)
    
    if(!success){
        return res.status(411).json({
            msg:"Enter the proper details!"
        })
    }

    const currentUser = await prisma.user.findUnique({
        where:{
            email : req.body.email
        }
    })

    if(!currentUser){
        return res.status(411).json({
            msg:"You don't have an account linked to that email! Create an account to login"
        })
    }

    try {
        const token = sign({
            id: currentUser.id
        }, SECRETKEY)

        return res.status(200).json({
            msg: "Sign in successful!",
            token: token
        })
    } catch (error) {
        return res.status(401).json({
            msg: error
        })
    }

})

export default router