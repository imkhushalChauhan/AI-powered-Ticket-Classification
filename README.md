# AI-Powered Support Ticket Router

An AI-powered support ticket management system that automatically classifies support tickets based on category and urgency and generates a suggested response.

## Features

- Create support tickets
- AI-based ticket classification
- Category detection: Billing, Technical, Bug, Other
- Urgency detection: Low, Medium, High
- AI-generated suggested responses
- Redis + BullMQ asynchronous processing
- MongoDB persistence
- Ticket filtering and sorting
- Ticket details modal
- Copy AI-generated response

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### AI & Infrastructure
- Groq API
- Redis / Upstash
- BullMQ
- ioredis

## Architecture

React → Express → MongoDB

                 ↓

              BullMQ

                 ↓

               Redis

                 ↓

                Groq

                 ↓

               MongoDB

## Environment Variables

Create a `.env` file in the server directory:

```env
MONGO_URL=Enter your mongodb url
REDIS_URL=Enter your redis url. You can use upstash also for this.
LLM_API_KEY=Enter your api key for llm.
