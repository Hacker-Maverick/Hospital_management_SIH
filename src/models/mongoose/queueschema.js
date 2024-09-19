import mongoose from "mongoose";

const queueSchema = new mongoose.Schema({
    queid: { type: String, required: true },
    date: { type: String, required: true },
    total: { type: Number },
    patient_queue: [{id: { type: String, required: true }}], // Array of patient objects with id and name
    docid: { type: String, required: true }
  });

  export const queues = mongoose.model("queues",queueSchema)