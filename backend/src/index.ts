import express from "express"
import rootRouter from "./routes/index"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.PORT


app.use("/api/v1",rootRouter)

app.listen(port, ()=>{
    console.log(`Server running on port: ${port}`)
})