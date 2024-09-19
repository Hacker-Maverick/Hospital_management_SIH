import { queues } from "../models/mongoose/queueschema.js";
import { Router } from "express";

const router = Router();

router.post('/patquedata', async (req, res) => {
    if(!req.user){
        return res.status(401).send({message: "Unauthorized"});
    }
    const data = await queues.findOne({ queid: req.body.queid }, { total: 1, date: 1, "patient_queue.id": 1, _id: 0 })
    let i = 0, j = data.patient_queue;
    while (j[i]) {
        if (j[i].id == req.user) {
            break;
        }
        i++;
    }
    if (data.total == i)
        i = -1;
    const patdata = {
        total: data.total,
        current: i,
        date: data.date,
    }
    res.status(200).json(patdata)
})

router.post("/docqueue",async (req,res)=>{
    const data = await queues.findOne({ docid: req.body.docid,date:req.body.date }, { total: 1, _id: 0 })
    res.status(200).json(data)
})

export default router