import { Router } from "express";
import { hospitaldbs } from "../models/mongoose/hospitalschema.js";
import { patientdbs } from "../models/mongoose/patientschema.js";
import { queues } from "../models/mongoose/queueschema.js";

const router = Router();

router.post("/adminpage", async (req, res) => {

    try {
        const hospitalId = req.user; // Hospital ObjectId from req.user
        const date = req.body.date; // Date from req.body

        // Step 1: Find the hospital and get all doctors
        const hospital = await hospitaldbs.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        // Extract doctors' docid and names
        const doctors = hospital.doctors.map(doctor => ({
            docid: doctor.docid,
            name: doctor.name
        }));

        // Step 2: Find all queues for each doctor with the given date
        const result = await Promise.all(doctors.map(async (doctor) => {
            const queu = await queues.find({
                docid: doctor.docid,
                date: date
            });

            // Collect patient IDs from all queues
            const patientIds = queu.flatMap(queue => queue.patient_queue.map(patient => patient.id));

            // Step 3: Find patient details for all collected IDs
            const patients = await patientdbs.find({
                _id: { $in: patientIds } // Assuming patient IDs are stored in the 'mobile' field
            }, 'name age'); // Only fetching name and age

            // Map patients to the desired format
            const patientQueue = patients.map(patient => ({
                name: patient.name,
                age: patient.age,
                id:patient.id
            }));

            return {
                docid: doctor.docid,
                name: doctor.name,
                patient_queue: patientQueue
            };
        }));

        // Return final result in the specified format
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

})

router.post("/removepat",async(req,res)=>{
    try {
        const { docid, date, patid } = req.body;

        // Step 1: Find the queue for the given docid and date
        const queue = await queues.findOne({ docid, date });
        if (!queue) {
            return res.status(404).json({ message: "Queue not found" });
        }
        // Find the index of the patient with the given patid
        const patientIndex = queue.patient_queue.findIndex(patient => patient.id == patid);
        if (patientIndex === -1) {
            return res.status(404).json({ message: "Patient not found in the queue" });
        }

        queue.total -= 1;

        // Remove the patient with the given patid
        queue.patient_queue.splice(patientIndex, 1); // Remove the specific patient

        // Save updated queue
        await queue.save();

        // Step 3: Update the patient
        const patient = await patientdbs.findOne({ _id: patid });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Set queid field to empty string
        patient.queid = '';
        
        // Save updated patient
        await patient.save();

        // Return success message
        res.status(200).json({ message: "Queue and patient updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

export default router;