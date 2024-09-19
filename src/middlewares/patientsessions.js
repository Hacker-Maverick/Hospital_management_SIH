import session from "express-session"
import MongoStore from "connect-mongo"
import mongoose from "mongoose"

export default session({
    secret: "sessions_are_always_better_than_cookies",
    saveUninitialized: false,
    resave: false,
    cookie: {
      name: "pat_sess_1hs_fr_ptnt",
      maxAge: 3600000,
    },
    store:MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/serverdb",
      collection: "session_patients",
      client:mongoose.connection.getClient()
    })
  })