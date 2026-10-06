import { useState } from "react";
import TicketForm from "./TicketForm";
import TicketList from "./TicketList";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Support Ticket Router
        </h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <TicketForm onTicketCreated={() => setRefreshTrigger((n) => n + 1)} />
        </div>
        <TicketList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}

export default App;