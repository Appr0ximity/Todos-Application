 import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction)=>{
    const SECRETKEY: string = process.env.SECRETKEY || ""
    
    const authToken = req.headers.authorization
    if(!authToken || !authToken.startsWith("Bearer ")){
        return res.status(411).json({
            msg:"Invalid Token"
        })
    }

    const token = authToken.split(' ')[1]

    try {
        const decoded: any = verify(token, SECRETKEY)

        const id: number = Number(decoded.id)

        if(!id){
            return res.status(411).json({
                msg:"Invalid token"
            })
        }

        req.user = req.user || {}
        req.user.id = id

        next()
    } catch (error) {
        console.log(error)
        return res.status(403).json({
            msg:"Invalid Token"
        })
    }
    
}