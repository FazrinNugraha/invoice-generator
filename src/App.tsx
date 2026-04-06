import { useState } from "react";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceTemplate from "./components/InvoiceTemplate";
import type { InvoiceData } from "./components/InvoiceForm";

function App() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    date: "",
    clientName: "",
    clientAddress: "",
    items: [{ description: "", total: "" }],
    dp: "",
    sisaPembayaran: "",
    paymentClientName: "",
    paymentMethod: "",
    paymentDate: "",
    status: "DP",
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <InvoiceForm data={invoiceData} onChange={setInvoiceData} />
      <div className="flex-1 overflow-hidden p-4 lg:p-8 flex justify-center items-start print:p-0 print:block print:overflow-visible">
        <div className="scale-window print:!transform-none print:!shadow-none print:!mb-0">
          <InvoiceTemplate data={invoiceData} />
        </div>
      </div>
    </div>
  );
}

export default App;