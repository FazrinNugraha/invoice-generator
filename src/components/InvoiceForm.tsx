import { Plus, Trash2, Printer } from "lucide-react";

export interface InvoiceItem {
  description: string;
  total: string;
}

export interface InvoiceData {
  date: string;
  clientName: string;
  clientAddress: string;
  items: InvoiceItem[];
  dp: string;
  sisaPembayaran: string;
  paymentClientName: string;
  paymentMethod: string;
  paymentDate: string;
  status: string;
}

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export default function InvoiceForm({ data, onChange }: InvoiceFormProps) {
  const updateField = (field: keyof InvoiceData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    onChange({ ...data, items: [...data.items, { description: "", total: "" }] });
  };

  const removeItem = (index: number) => {
    if (data.items.length <= 1) return;
    const newItems = data.items.filter((_, i) => i !== index);
    onChange({ ...data, items: newItems });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="no-print w-full lg:w-[420px] shrink-0 bg-white lg:border-r border-gray-200 lg:h-screen lg:overflow-y-auto shadow-md lg:shadow-none z-10 relative">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold text-gray-900">Agungjaya_Alumunium</h1>
            <p className="text-xs text-gray-500 mt-0.5">Invoice Generator</p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Printer size={16} />
            Cetak PDF
          </button>
        </div>
      </div>

      <div className="px-6 py-5 space-y-6">
        {/* Section: Tanggal */}
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tanggal Invoice</h2>
          <input
            type="text"
            value={data.date}
            onChange={(e) => updateField("date", e.target.value)}
            placeholder="6/ 4/ 2026"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-shadow"
          />
        </section>

        {/* Section: Invoice To */}
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Invoice To</h2>
          <div className="space-y-2.5">
            <input
              type="text"
              value={data.clientName}
              onChange={(e) => updateField("clientName", e.target.value)}
              placeholder="Nama Klien (cth: Ibu Denia)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-shadow"
            />
            <input
              type="text"
              value={data.clientAddress}
              onChange={(e) => updateField("clientAddress", e.target.value)}
              placeholder="Alamat Klien (cth: Kalideres, Jakarta Barat)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-shadow"
            />
          </div>
        </section>

        {/* Section: Items */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Daftar Pesanan</h2>
            <button
              onClick={addItem}
              className="flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors cursor-pointer"
            >
              <Plus size={14} />
              Tambah Baris
            </button>
          </div>
          <div className="space-y-3">
            {data.items.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-medium text-gray-500">Item {index + 1}</span>
                  {data.items.length > 1 && (
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <textarea
                  value={item.description}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                  placeholder="Deskripsi pesanan (cth: 3 Set Daun Jendela&#10;1 Set Pintu Kaca Sliding)"
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none transition-shadow mb-2"
                />
                <input
                  type="text"
                  value={item.total}
                  onChange={(e) => updateItem(index, "total", e.target.value)}
                  placeholder="Total harga (cth: Rp 7.800.000)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-shadow"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Section: DP & Sisa */}
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">DP & Sisa Pembayaran</h2>
          <div className="space-y-2.5">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">DP (Uang Muka)</label>
              <input
                type="text"
                value={data.dp}
                onChange={(e) => updateField("dp", e.target.value)}
                placeholder="Rp 3.900.000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-shadow"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                {data.status === "LUNAS" ? "Total" : "Sisa Pembayaran"}
              </label>
              <input
                type="text"
                value={data.sisaPembayaran}
                onChange={(e) => updateField("sisaPembayaran", e.target.value)}
                placeholder="Rp 3.900.000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-shadow"
              />
            </div>
          </div>
        </section>

        {/* Section: Payment Method */}
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Payment Method</h2>
          <div className="space-y-2.5">
            <input
              type="text"
              value={data.paymentClientName}
              onChange={(e) => updateField("paymentClientName", e.target.value)}
              placeholder="Nama Klien (cth: Ibu Denia)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-shadow"
            />
            <input
              type="text"
              value={data.paymentMethod}
              onChange={(e) => updateField("paymentMethod", e.target.value)}
              placeholder="Metode (cth: Bank Transfer)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-shadow"
            />
            <input
              type="text"
              value={data.paymentDate}
              onChange={(e) => updateField("paymentDate", e.target.value)}
              placeholder="Tanggal Bayar (cth: Pay by : 6 April 2026)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-shadow"
            />
          </div>
        </section>

        {/* Section: Status */}
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Status Pembayaran</h2>
          <div className="flex gap-2">
            {["DP", "LUNAS"].map((s) => (
              <button
                key={s}
                onClick={() => updateField("status", s)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg border-2 transition-all cursor-pointer ${
                  data.status === s
                    ? "border-amber-500 bg-amber-50 text-amber-700"
                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Print Button Bottom */}
        <button
          onClick={handlePrint}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-3 rounded-lg transition-colors cursor-pointer shadow-sm"
        >
          <Printer size={16} />
          Cetak / Export PDF
        </button>
      </div>
    </div>
  );
}
