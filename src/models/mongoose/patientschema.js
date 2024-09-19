import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email:{type:String},
  age: { type: Number, required: true },
  date_of_birth:{type:String},
  docid: { type: String, required: true },  // Associated doctor's ID, should be unique
  daysleft: { type: Number },  // Days left for treatment
  mobile: { type: String, required: true, unique: true },  // Mobile number, treated as a string
  password: { type: String, required: true },  // Patient's password
  blood: { type: String, required: true },  // Blood group
  gender: { type: String, required: true, enum: ['M', 'F'] },  // Gender, M for male, F for female
  address: { type: String, required: true },
  queid: { type: String },  // Queue ID
  date: { type: Number },
  timeslot: { type: String },
  doctor_hospital:{type:String}
});

// Creating the Patient model
export const patientdbs = mongoose.model('patientdbs', patientSchema);
