import crypto from "crypto";

function getTicketHash(title, description) {
    const combined = `${title}|${description}`;

    const normalized = combined
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");

    const hash = crypto
        .createHash("sha256")
        .update(normalized)
        .digest("hex");

    return hash;
}

export default getTicketHash;