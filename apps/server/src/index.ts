import express from "express"
import {initListeners, io} from "./services/socket"
const app = express()

app.use(express.json())

io.attach(app.listen(8000, () => {
    console.log("Server is running on port 8000")
  }) )

initListeners()