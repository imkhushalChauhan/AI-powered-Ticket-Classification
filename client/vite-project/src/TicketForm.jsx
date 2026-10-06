import { useState } from "react";

function TicketForm({ onTicketCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Both fields are required");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) throw new Error("Failed to submit ticket");

      const newTicket = await res.json();
      setTitle("");
      setDescription("");
      onTicketCreated?.(newTicket); // notify parent to refresh list
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

return (
  <form onSubmit={handleSubmit} className="space-y-4">
    <h2 className="text-lg font-semibold text-gray-800">Submit a Ticket</h2>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Short summary of the issue"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the issue in detail"
        rows={4}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    {error && <p className="text-sm text-red-600">{error}</p>}

    <button
      type="submit"
      disabled={submitting}
      className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      {submitting ? "Submitting..." : "Submit Ticket"}
    </button>
  </form>
);
}

export default TicketForm;