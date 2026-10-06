import { useEffect, useState } from "react";

const urgencyOrder = { High: 0, Medium: 1, Low: 2 };

const urgencyColors = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
};

const statusColors = {
  pending: "bg-gray-100 text-gray-600",
  open: "bg-blue-100 text-blue-700",
  "in-progress": "bg-purple-100 text-purple-700",
  resolved: "bg-green-100 text-green-700",
};

function TicketList({ refreshTrigger }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    fetch("http://localhost:3000/tickets")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((err) => console.error("Failed to fetch tickets:", err));
  }, [refreshTrigger]);

  if (loading) return <p>Loading tickets...</p>;

  let visibleTickets = tickets.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    if (urgencyFilter !== "all" && t.urgency !== urgencyFilter) return false;
    return true;
  });

  visibleTickets = [...visibleTickets].sort((a, b) => {
    if (sortBy === "urgency") {
      return (urgencyOrder[a.urgency] ?? 99) - (urgencyOrder[b.urgency] ?? 99);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="all">All Categories</option>
          <option value="Billing">Billing</option>
          <option value="Technical">Technical</option>
          <option value="Bug">Bug</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={urgencyFilter}
          onChange={(e) => setUrgencyFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="all">All Urgencies</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="date">Sort: Newest First</option>
          <option value="urgency">Sort: Urgency</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="py-2 pr-4 font-medium">Title</th>
              <th className="py-2 pr-4 font-medium">Description</th>
              <th className="py-2 pr-4 font-medium">Category</th>
              <th className="py-2 pr-4 font-medium">Urgency</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {visibleTickets.map((t) => (
              <tr
                key={t._id}
                onClick={() => setSelectedTicket(t)}
                className="border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50"
              >
                <td className="py-3 pr-4 font-medium text-gray-900">{t.title}</td>
                <td className="py-3 pr-4 text-gray-600 w-80 whitespace-normal break-words">{t.description}</td>
                <td className="py-3 pr-4 text-gray-700">{t.category || "—"}</td>
                <td className="py-3 pr-4">
                  {t.urgency ? (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${urgencyColors[t.urgency]}`}>
                      {t.urgency}
                    </span>
                  ) : "—"}
                </td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[t.status]}`}>
                    {t.status}
                  </span>
                </td>
                <td className="py-3 pr-4 text-gray-500">{new Date(t.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTicket && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold text-gray-900">
                Ticket Details
              </h2>

              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-500 cursor-pointer hover:text-gray-900 text-xl"
              >
                ✕
              </button>
            </div>

            <h3 className="text-lg font-semibold mb-2">
              {selectedTicket.title}
            </h3>

            <div className="flex flex-wrap gap-2 mb-5">
              {selectedTicket.category && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {selectedTicket.category}
                </span>
              )}

              {selectedTicket.urgency && (
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${urgencyColors[selectedTicket.urgency]
                    }`}
                >
                  {selectedTicket.urgency}
                </span>
              )}

              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[selectedTicket.status]
                  }`}
              >
                {selectedTicket.status}
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-5">
              Created: {new Date(selectedTicket.createdAt).toLocaleString()}
            </p>

            <div className="mb-5">
              <h4 className="font-semibold text-gray-800 mb-2">
                Description
              </h4>

              <p className="text-gray-600 whitespace-pre-wrap break-words leading-6">
                {selectedTicket.description}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                🤖 AI Suggested Response
              </h4>

              <div>
  <h4 className="font-semibold text-gray-800 mb-2">
    🤖 AI Suggested Response
  </h4>

  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-gray-700">
    <p>
      {selectedTicket.suggestedResponse || "No response available yet."}
    </p>

    <div className="flex justify-end mt-3">
      <button
        onClick={() =>
          navigator.clipboard.writeText(
            selectedTicket.suggestedResponse || ""
          )
        }
        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
      >
        Copy Response
      </button>
    </div>
  </div>
</div>


            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketList;