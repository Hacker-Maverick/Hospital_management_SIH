import { Router } from "express";
import { hospitaldbs } from "../models/mongoose/hospitalschema.js";

const router = Router()

let result;

router.post("/searchresult", async (req, res) => {
    let search = req.body;

    //cities
    if (search.type === 'cities' && search.city) {
        const hospitals = await hospitaldbs.find({ 'address.city': search.city }, { hospitalname: 1, 'address.city': 1, 'address.state': 1, _id: 0 }).exec();

        // Map the results to the desired format
        result = hospitals.map(hospital => ({
            name: hospital.hospitalname,
            city: hospital.address.city,
            state: hospital.address.state
        }));
        res.status(200).json(result)
    }

    //hospitals
    else if (search.type === 'hospitals' && search.hospitals) {
        const hospitals = await hospitaldbs.findOne({ 'hospitalname': search.hospitals }, { hospitalname: 1, 'address': 1, 'about': 1, 'photourl': 1, 'beds': 1, 'Achievements': 1, 'doctors.name': 1, 'doctors.license': 1, 'doctors.photourl': 1, 'doctors.degrees': 1, 'doctors.category': 1, 'doctors.fee': 1, 'doctors.workingschedule': 1, 'ambulance': 1, 'reviews': 1, _id: 0 })
        result = hospitals
        res.status(200).json(result)
    }

    //doctors
    else {
        result = await hospitaldbs.findOne({ 'doctors.name': search.doctors }, { hospitalname: 1,'doctors.name.$': 1,'doctors.docid':1, 'doctors.license': 1, 'doctors.photourl': 1, 'doctors.degrees': 1, 'doctors.category': 1, 'doctors.fee': 1, 'doctors.experience': 1, _id: 0 })
        const doctors = {
            hospitalname: result.hospitalname,
            name: result.doctors[0].name,
            docid: result.doctors[0].docid,
            license: result.doctors[0].license,
            photourl: result.doctors[0].photourl,
            degrees: result.doctors[0].degrees,
            category: result.doctors[0].category,
            experience: result.doctors[0].experience,
            fee: result.doctors[0].fee,
          };
        res.status(200).json(doctors)
    }
})

export default router;