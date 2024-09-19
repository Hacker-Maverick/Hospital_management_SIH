import { Router } from "express";
import { hospitaldbs } from "../models/mongoose/hospitalschema.js";

const router = Router();

let  hospitalNamesWithLocation, uniqueCities, doctorsWithHospitalNames;
//Search suggestions

setTimeout(async () => {
    // Fetch all documents from the collection
    const hospitals = await hospitaldbs.find({},{hospitalname:1,'address':1,'doctors.name':1, 'doctors.category':1}).exec();

    // Extract hospital names with city and state
     hospitalNamesWithLocation = hospitals.map(hospital => {
      const city = hospital.address.city || "Unknown City";
      const state = hospital.address.state || "Unknown State";
      return `${hospital.hospitalname} - ${city} - ${state}`;
    });

    // Extract unique cities
    const citiesSet = new Set(hospitals.map(hospital => hospital.address.city).filter(Boolean));
     uniqueCities = Array.from(citiesSet);

    // Extract doctors with their associated hospital names
     doctorsWithHospitalNames = hospitals.flatMap(hospital =>
      hospital.doctors.map(doctor => (`${doctor.name} - ${doctor.category} - ${hospital.hospitalname}`))
    );

}, 100);

router.get("/searchsuggestion", (req, res) => {
    res.status(200).json({ hospitalNamesWithLocation, uniqueCities, doctorsWithHospitalNames })
})

export default router;
