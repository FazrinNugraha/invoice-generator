import { useState, useEffect } from "react";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceTemplate from "./components/InvoiceTemplate";
import type { InvoiceData } from "./components/InvoiceForm";
import { useInvoiceDrafts } from "./hooks/useInvoiceDrafts";
import type { InvoiceDraft } from "./hooks/useInvoiceDrafts";

const DEFAULT_DATA: InvoiceData = {
  date: "",
  clientName: "",
  clientAddress: "",
  items: [{ description: "", total: "" }],
  subTotal: "",
  discount: "",
  dp: "",
  pelunasan: "",
  sisaPembayaran: "",
  paymentClientName: "",
  paymentMethod: "",
  paymentDate: "",
  status: "DP",
};

function App() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(DEFAULT_DATA);
  const { drafts, saveDraft, deleteDraft, getDaysRemaining } = useInvoiceDrafts();

  useEffect(() => {
    if (invoiceData.clientName.trim()) {
      document.title = `Invoice - ${invoiceData.clientName.trim()}`;
    } else {
      document.title = "Invoice - Agungjaya Alumunium";
    }
  }, [invoiceData.clientName]);

  const handleSaveDraft = () => {
    saveDraft(invoiceData);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLoadDraft = (draft: InvoiceDraft) => {
    setInvoiceData(draft.data);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <InvoiceForm
        data={invoiceData}
        onChange={setInvoiceData}
        onSaveDraft={handleSaveDraft}
        onPrint={handlePrint}
        drafts={drafts}
        onLoadDraft={handleLoadDraft}
        onDeleteDraft={deleteDraft}
        getDaysRemaining={getDaysRemaining}
      />
      <div className="flex-1 overflow-hidden p-4 lg:p-8 flex justify-center items-start print:p-0 print:block print:overflow-visible">
        <div className="scale-window print:!transform-none print:!shadow-none print:!mb-0">
          <InvoiceTemplate data={invoiceData} />
        </div>
      </div>
    </div>
  );
}

export default App;