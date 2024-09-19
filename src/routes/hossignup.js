import { Router } from "express";
import { hashpassword } from "../services/hash.js"
import {hospitaldbs} from "../models/mongoose/hospitalschema.js";
import {registered_hospitals} from "../models/mongoose/reghosschema.js";
import path from 'path'
import { mypath } from "../../server.js";

const router = Router();
let i=0;

router.post('/hospitalregister',async (req,res)=>{
    const data = req.body;
    while(data.admins[i]){
        data.admins[i].password = hashpassword(data.admins[i].password);
        i++;
    }
    data.hos_id=""
    console.log(data)
    const hospital = new registered_hospitals(data);
    try {
        await hospital.save();
        return res.status(201).send("Hospital Registered")
    }
    catch (err) { return res.status(400).send({ message: err.message }) }
});

router.post('/hospitalsignup',async (req,res)=>{
    const hosdata = req.body;
    let i=0,name_part,var2_part,name,var2,generatedId;
    while(hosdata.doctors[i]){
      name=hosdata.doctors[i].name;
      var2=hosdata.hospitalcode;
    // Extracting the required parts from name and replacing spaces with "-"
    name_part = (name.slice(0, 4) + name.slice(-4)).replace(/\s/g, "_");
    
    // Extracting the required parts from var2 and replacing spaces with "-"
    var2_part = (var2.slice(0, 2) + var2.slice(-2)).replace(/\s/g, "_");
    
    // Concatenating both parts to form the ID
    generatedId = name_part + var2_part;
    generatedId = generatedId.replace(/ /g, "_");
      hosdata.doctors[i].docid=generatedId;
      console.log(name," ",var2," ",generatedId)
      i++;
    }
    i=0;

    let reghos = await registered_hospitals.findOne({'hospitalcode': hosdata.hospitalcode  });
      if (!reghos) {
        return res.status(400).send("Invalid registration attempt"); // Username not found
      }
      // Find the specific admin object
      if (reghos.hos_id) {
        return res.status(400).send("Invalid registration attempt"); // Admin not found
      }

    const newhospital = new hospitaldbs(hosdata);
    try {
        await newhospital.save();
        reghos = await hospitaldbs.findOne({'hospitalcode': hosdata.hospitalcode  });
        await registered_hospitals.findOneAndUpdate({'hospitalcode': hosdata.hospitalcode},{'hos_id':reghos.id})
        return res.status(201).send("Hospital Registered")
    }
    catch (err) { return res.status(400).send({ message: err.message }) }
})

export default router;