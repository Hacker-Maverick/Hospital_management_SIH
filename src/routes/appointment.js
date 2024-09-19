import { Router } from "express";
import { hashpassword } from "../services/hash.js"
import { patientdbs } from "../models/mongoose/patientschema.js";
import { queues } from "../models/mongoose/queueschema.js";

const router = Router();

const updateOrCreateQueue = async (docid, patid, date) => {
    try {
      // Construct the queid as "docid_date"
      const queid = `${docid}_${date}`;
  
      // Try to find the queue based on docid and date
      let queue = await queues.findOneAndUpdate(
        { docid: docid, date: date }, // Find queue by docid and date
        {
          $push: { patient_queue: { id: patid } }, // Add patid to the patient queue
          $inc: { total: 1 }, // Increment total by 1
        },
        { new: true } // Return the updated document
      );
  
      if (!queue) {
        // If queue is not found, create a new one
        queue = new queues({
          queid: queid,        // queid as docid_date
          date: date,          // The given date in ddmmyy format
          total: 1,            // First patient, so total is 1
          patient_queue: [{ id: patid }], // Add patid to the patient queue
          docid: docid,        // The docid provided
        });
  
        // Save the new queue
        await queue.save();
      }
      const updatedPatient = await patientdbs.findOneAndUpdate(
        { _id:patid },               // Find patient by mobile number
        { $set: { queid: queue.queid } },  // Set queid in the patient document
        { new: true }                      // Return the updated document
      );
  
    } catch (error) {
      console.error("Error updating or creating queue:", error);
    }
  };
  

router.post("/appointment", async (req, res) => {
    const data = req.body;
    data.password = hashpassword(data.password);
    data.daysleft = 30;
    data.queid = "";
    const appointment = new patientdbs(data);
    await appointment.save();
    let patid = await patientdbs.findOne({mobile:data.mobile},{id:1})
    updateOrCreateQueue(data.docid,patid.id,data.date)
    res.status(201).send("Appointment confirmed");
})

router.post("/addappointment",async (req,res)=>{
  const data = req.body;
  const patid = await  patientdbs.findOne({mobile:data.mobile},{_id:1})
  updateOrCreateQueue(data.docid,patid.id,data.date)
  res.status(201).send("Appointment confirmed");
})

export default router;