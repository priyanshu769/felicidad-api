const express = require('express')
const bodyParser = require("body-parser")
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())

// DB connect
const initializeDBConnect = require("./db/db.connect.js")
initializeDBConnect()

// Routers
const posts = require("./routers/posts.v1.router")
const users = require('./routers/users.v1.router')

app.use("/posts", posts)
app.use("/users", users)

app.get("/", (req, res)=> {
    res.send("This is Felicidad API.")
})

const PORT = 8000

app.listen(process.env.PORT || PORT, ()=>{
    console.log("Server running on port 3000...")
})