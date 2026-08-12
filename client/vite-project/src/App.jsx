import { useState } from "react";
import TicketForm from "./TicketForm";
import TicketList from "./TicketList";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div>
      <h1>Support Ticket Router</h1>
      <TicketForm onTicketCreated={() => setRefreshTrigger((n) => n + 1)} />
      <TicketList refreshTrigger={refreshTrigger} />
    </div>
  );
}

export default App;