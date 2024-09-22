import e from "express";
import userRouter from "./user"
import todoRouter from "./todo"
import typeRouter from "./type"

const router = e.Router()

router.use("/user", userRouter)
router.use("/todo", todoRouter)
router.use("/type", typeRouter)



export default router