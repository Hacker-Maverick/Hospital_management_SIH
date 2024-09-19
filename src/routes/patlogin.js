import { Router } from "express";
import passport from "passport";
import session from "../middlewares/patientsessions.js"
import {bodyjson} from "../middlewares/bodyparse.js"
import "../models/strategy/strategy.js"
import { patientdbs } from "../models/mongoose/patientschema.js";

const router = Router();

router.use(bodyjson)
router.use(session)
router.use(passport.initialize());
router.use(passport.session());

router.post("/patientlogin", passport.authenticate("patauth"), (req, res) => {
    res.status(200).send("Congratulation you logged in");
}
)

router.get("/patientlog", async (req, res) => {
    console.log(req.user)
    const patient = await patientdbs.findById(req.user,{_id:0,password:0,__v:0,})
    res.status(200).json(patient);
})

router.get("/patientlogout", (req, res) => {
    if (!req.user) return res.sendStatus(400);
    req.logout((err) => {
        if (err) { res.status(400).send(err) }
        res.status(200).redirect("/")
    });

})

export default router;