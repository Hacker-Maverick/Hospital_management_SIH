import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  docid: { type: String, required: true, unique: true },
  license: { type: String, required: true },
  photourl: { type: String },
  degrees: { type: String },
  category: { type: String },
  experience: { type: Number },
  fee: { type: String },
});

const patientSchema = new mongoose.Schema({
  id: { type: String, required: true }
});

const hospitalSchema = new mongoose.Schema({
  hospitalcode: { type: String, required: true, unique: true },
  hospitalname: { type: String, required: true },
  About: { type: String },
  photourl: [ String ],
  beds: [
    {
      bedType: { type: String },
      total: { type: Number },
      occupied: { type: Number },
      charge: { type: Number }
    }
  ],
  Achievements: [ String ],
  location: { type: String },
  address: {
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String }
  },
  license: { type: String, required: true },
  doctors: [doctorSchema],
  patients: [patientSchema],
  ambulance: [{
    busy: { type: Number },
    vehicleno: { type: String },
    contact: { type: String }
  }],
  reviews: [
    {
      rating: { type: Number },
      comments: { type: String }
    }
  ],
});

export const hospitaldbs = mongoose.model("hospitaldbs", hospitalSchema);
