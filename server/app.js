import "dotenv/config";

import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import TicketModel from "./database/ticket.js";
import classifyTicket from "./services/classifyTicket.js";
import ticketQueue from "./queue/ticketQueue.js";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/ticket", async (req, res) => {
  try {
    const { title, description } = req.body;

    const ticket = new TicketModel({
      title,
      description,
    });

    await ticket.save();
    ticketQueue.add("classify", { ticketId: ticket._id });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Error creating ticket", error: err.message });
  }
});

app.get("/tickets", async (req,res)=>{
    try{
        const tickets = await TicketModel.find().sort({createdAt: -1});
        res.status(201).json(tickets);
    }   catch(err) {
        res.status(500).json({
            message: "Error fetching tickets",
            error: err.message
        })
    }
});

mongoose
    .connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("Connected to Mongodb");

        app.listen(5000, ()=>{
            console.log("Server is connected on port 3000")
        });
    })
    .catch((err)=>{
    console.error("MongoDB connection error:", err);        
    })