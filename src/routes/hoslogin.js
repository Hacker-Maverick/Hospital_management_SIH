import { Router } from "express";
import passport from "passport";
import path from "path";
import { mypath } from "../../server.js";
import session from "../middlewares/hospitalsessions.js"
import {bodyjson} from "../middlewares/bodyparse.js"
import "../models/strategy/strategy.js"

const router = Router();

router.use(bodyjson)
router.use(session)
router.use(passport.initialize());
router.use(passport.session());

router.post("/hospitallogin", passport.authenticate("hospitalauth"), (req, res) => {
    res.status(200).send("Congratulation you logged in");
}
)

router.get("/hospitallog", (req, res) => {
    console.log(req.user)
    res.status(200).send("user identified")
})

router.get("/hospitallogout", (req, res) => {
    if (!req.user) return res.sendStatus(400);
    req.logout((err) => {
        if (err) { res.status(400).send(err) }
        res.status(200).send("You have been logged out")
    });

})

export default router;