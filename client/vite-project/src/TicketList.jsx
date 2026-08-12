import { useEffect, useState } from "react";

function TicketList({ refreshTrigger }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/tickets")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((err) => console.error("Failed to fetch tickets:", err));
  }, [refreshTrigger]); // refetch whenever a new ticket is created

  if (loading) return <p>Loading tickets...</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((t) => (
          <tr key={t._id}>
            <td>{t.title}</td>
            <td>{t.description}</td>
            <td>{new Date(t.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TicketList;