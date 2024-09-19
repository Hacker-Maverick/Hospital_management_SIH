import express from "express"
import mongoose from "mongoose"

//routers import
import hosloginrouter from './src/routes/hoslogin.js'
import hossignuprouter from './src/routes/hossignup.js'
import patloginrouter from './src/routes/patlogin.js'
import searchsuggestionrouter from './src/routes/searchlist.js'
import searchresultrouter from './src/routes/searchres.js'
import appiontmentrouter from "./src/routes/appointment.js"
import querouter from "./src/routes/queue.js"
import adminpagerouter from "./src/routes/admin.js"

const app = express()
const port = 3000
export const mypath = "D:\\Git\\SIH\\src";

try{let db = await mongoose.connect("mongodb://localhost:27017/serverdb")}
catch(e){console.log(e)};

app.use(express.static('public'))

//routers
app.use(hosloginrouter);
app.use(hossignuprouter);
app.use(patloginrouter);
app.use(searchsuggestionrouter);
app.use(searchresultrouter);
app.use(appiontmentrouter);
app.use(querouter);
app.use(adminpagerouter);

//Listener
app.listen(port, () => {
    console.log(`Example app listening on port http://127.0.0.1:${port}`)
  })