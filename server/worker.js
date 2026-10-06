import { Worker } from "bullmq";
import connection from "./queue/connection.js";
import TicketModel from "./database/ticket.js";
import classifyTicket from "./services/classifyTicket.js";
import mongoose from "mongoose";
import getTicketHash from "./services/hashTicket.js";

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Worker connected to mongoDB")
    })

const job = new Worker("ticket-classification", async (job) => {
    const { ticketId } = job.data;
    try {
        const ticket = await TicketModel.findById(ticketId);

    if (ticket) {
      const hash = getTicketHash(ticket.title, ticket.description);

      let classification;
      const cached = await connection.get(hash);

      if (cached) {
        console.log("Cache hit for ticket:", ticketId);
        classification = JSON.parse(cached);
      } else {
        console.log("Cache miss for ticket:", ticketId);
        classification = await classifyTicket(ticket.title, ticket.description);
        await connection.set(hash, JSON.stringify(classification));
      }

      await TicketModel.updateOne({ _id: ticket._id }, {
        category: classification.category,
        urgency: classification.urgency,
        suggestedResponse: classification.suggestedResponse,
        status: "open",
      });
    } else {
      console.log("Entry doesn't exist");
    }
  } catch (err) {
  console.error("Classification failed:", err.message);
  throw err;
}
}, { connection });

job.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

job.on("failed", (job, err) => {
    console.error(`Job ${job.id} failed:`, err.message);
});

job.on("error", (err) => {
    console.error("Worker error:", err.message);
});