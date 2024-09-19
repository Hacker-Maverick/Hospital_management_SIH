import session from "express-session"
import MongoStore from "connect-mongo"
import mongoose from "mongoose"

export default session({
    secret: "sessions_are_always_better_than_cookies",
    saveUninitialized: false,
    resave: false,
    cookie: {
      name: "hos_sess_24hs_fr_admn",
      maxAge: 3600000*24,
    },
    store:MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/serverdb",
      collectionName: "session_hospitals",
      client:mongoose.connection.getClient()
    })
  })