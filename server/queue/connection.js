import "dotenv/config";
import IORedis from "ioredis"

const connection = new IORedis(
    process.env.REDIS_URL,
{
    maxRetriesPerRequest: null,
}
);

connection.on("error", (err) => {
    console.error("Redis connection error:", err.message);
});

export default connection;