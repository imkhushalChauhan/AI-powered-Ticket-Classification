import { Worker } from "bullmq";
import connection from "./queue/connection.js";
import TicketModel from "./database/ticket.js";
import classifyTicket from "./services/classifyTicket.js";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Worker connected to mongoDB")
    })

const job = new Worker("ticket-classification", async (job) => {
    const { ticketId } = job.data;
    try {
        const ticket = await TicketModel.findById(ticketId);
        if (ticket) {
            const classification = await classifyTicket(ticket.title, ticket.description);
            await TicketModel.updateOne({ _id: ticket._id }, {
                category: classification.category,
                urgency: classification.urgency,
                suggestedResponse: classification.suggestedResponse,
                status: "open"
            });
        }else{
            console.log("Entry doesnt exist");
        }
    } catch(err){
        console.error("message :", err.message)
    }
}, { connection })

job.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

job.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

job.on("error", (err) => {
  console.error("Worker error:", err.message);
});