import { Queue } from "bullmq";
import connection from "./connection.js";

const ticketQueue = new Queue("ticket-classification", { connection });

ticketQueue.on("error", (err) => {
  console.error("ticketQueue error:", err.message);
});

export default ticketQueue;