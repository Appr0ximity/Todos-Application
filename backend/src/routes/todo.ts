import e, { Request, Response } from "express";
import { auth } from "../middleware";
import prisma from "../api/prisma";
import { z } from "zod";

const router = e.Router()

router.get("/todos", auth, async (req: Request, res: Response)=>{
    const userId =  req.body.id

    try {
        const todos = await prisma.todo.findMany({
            where:{
                userId: userId
            }
        })

        return res.status(200).json({
            msg:"Successfully found all the todos",
            todos: todos
        })
    } catch (error) {
        console.log(error);
        return res.status(411).json({
            msg:"Error while fetching all todos"
        })
    }
})

const todoObject = z.object({
    title: z.string(),
    description: z.string()
})

router.post("/todo", auth, async (req: Request, res: Response)=>{
    const {success} = todoObject.safeParse(req.body)
    const userId: number = Number(req.user?.id || {})
    console.log(userId)

    if(!success){
        return res.status(411).json({
            msg:"Enter all the details!"
        })
    }

    try {
        const user = await prisma.user.findUnique({
            where:{
                id: userId
            }
        })

        if(!user){
            return res.status(411).json({
                msg:"User not found"
            })
        }

        const response  = await prisma.todo.create({
            data:{
                title: req.body.title,
                description: req.body.description,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
        console.log(response)
        return res.status(200).json({
            msg:"Todo created successfully!"
        })
    } catch (error) {
        console.log(error);
    }
})

router.patch("/add-type:id/:typeId", auth, async (req: Request, res: Response)=>{
    const todoId: number = Number(req.params.id)
    const typeId: number = Number(req.params.typeId)

    try {
        const response = await prisma.todo.update({
            where:{
                id: todoId
            },data:{
                typeId: typeId
            }
        })
        console.log(response)
    } catch (error) {
        console.log(error);
    }

})

router.delete("/delete:id", auth, async (req: Request, res: Response)=>{
    const todoId: number = Number(req.params.id)
    try {
        const response = await prisma.todo.delete({
            where: {
                id: todoId
            }
        })
        console.log(response)
    } catch (error) {
        console.log(error);
    }
})

router.put("/todo:id", auth, async (req: Request, res: Response)=>{
    const todoId: number = Number(req.query.id)

    try {
        const response  = await prisma.todo.update({
            where:{
                id: todoId
            },data:{
                title: req.body.title,
                description: req.body.description,
            }
        })
        console.log(response)
    } catch (error) {
        console.log(error);
    }
})

export default router