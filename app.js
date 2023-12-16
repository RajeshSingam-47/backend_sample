const express = require("express")
const cors = require("cors")
const app = express()
app.use(cors())
app.use(express.json())

const {open} = require("sqlite")

const sqlite3 = require("sqlite3")

const path = require("path")

let db = null

const dbPath = path.join(__dirname,"singam.db")

const initializeDBAndServer = async()=>{
    try{
        db = await open({
            filename:dbPath,
            driver:sqlite3.Database
        })

        app.listen(4000,()=>{
            console.log("Server is Running")
        })
    }catch(e){
        console.log(`DB error ${e.message}`)
        process.exit(1)
    }

}

// console.log(sqlite3.Database)

initializeDBAndServer()


app.post("/add", async(req,res)=>{

    const {name,email,phone} = req.body
console.log(name,email,phone)
    const dataFromTable = `select * from singam where name = "${name}"`

    const dataResponce = await db.get(dataFromTable)

    if (dataResponce === undefined){

        const enterIntoTable = `insert into singam (name,email,phone) values ("${name}","${email}",${phone})`

        const entryResponse = await db.run(enterIntoTable)

        console.log(entryResponse)

        res.send("Profile Created Successfully")
    }

    else{
        res.send("User Already  exist")
    }

})

app.get("/", async(req,res)=>{

    const data = `select * from singam`

    const dataDetails = await db.all(data)

    console.log(dataDetails)

    res.send(dataDetails)

})


