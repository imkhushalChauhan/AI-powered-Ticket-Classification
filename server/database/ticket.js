import mongoose from "mongoose";

const { Schema } = mongoose;

const TicketSchema = new Schema({
    title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    enum: ["Billing", "Technical", "Bug", "Other"],
    default: null
  },
  urgency: {
    type: String,
    enum: ["Low", "High", "Medium"],
    default: null
  },
  suggestedResponse: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ["pending", "open", "in-progress", "resolved"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const TicketModel = mongoose.model("Ticket", TicketSchema);

export default TicketModel;