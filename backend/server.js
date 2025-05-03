import express from "express"
import mongoose from "mongoose"
import cors from 'cors'
import contactRouter from "./routes/Contactlistroute.js"

const PORT = 4000

const app = express()


app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(cors())

mongoose
    .connect("mongodb://127.0.0.1:27017/dsll")
    .then(() => console.log('Mongo connected'))
    .catch((err) => console.log(err));

// API endpoint
app.use("/api/contactlist", contactRouter)

app.get("/", (req, res) => {
    res.send("api hoạt động")
})

app.listen(PORT, () => console.log(`connected to http://localhost:${PORT}`))
