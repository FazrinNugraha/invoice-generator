import { useState } from "react";
import { Plus, Trash2, Printer, BookOpen, X, Clock } from "lucide-react";
import type { InvoiceDraft } from "../hooks/useInvoiceDrafts";

export interface InvoiceItem {
  description: string;
  total: string;
}

export interface InvoiceData {
  date: string;
  clientName: string;
  clientAddress: string;
  items: InvoiceItem[];
  subTotal?: string;
  discount?: string;
  dp: string;
  pelunasan: string;
  sisaPembayaran: string;
  paymentClientName: string;
  paymentMethod: string;
  paymentDate: string;
  status: string;
}

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  onSaveDraft: () => void;
  drafts: InvoiceDraft[];
  onLoadDraft: (draft: InvoiceDraft) => void;
  onDeleteDraft: (id: string) => void;
  getDaysRemaining: (savedAt: number) => number;
  onPrint: () => void;
}

export default function InvoiceForm({
  data,
  onChange,
  onSaveDraft,
  drafts,
  onLoadDraft,
  onDeleteDraft,
  getDaysRemaining,
  onPrint,
}: InvoiceFormProps) {
  const [showDrafts, setShowDrafts] = useState(false);

  const parseCurrency = (val?: string): number => {
    if (!val) return 0;
    const cleaned = val.replace(/[^0-9]/g, "");
    return cleaned ? parseInt(cleaned, 10) : 0;
  };

  const formatCurrencyValue = (num: number): string => {
    if (num <= 0) return "";
    return "Rp " + num.toLocaleString("id-ID");
  };

  const recalculate = (updatedData: InvoiceData, triggeredByField?: keyof InvoiceData) => {
    // 1. Calculate Subtotal from items
    const subTotalNum = updatedData.items.reduce(
      (sum, item) => sum + parseCurrency(item.total),
      0
    );
    const subTotalStr =
      triggeredByField === "subTotal"
        ? updatedData.subTotal || ""
        : subTotalNum > 0
        ? formatCurrencyValue(subTotalNum)
        : "";

    // 2. Parse Discount & DP
    const discountNum = parseCurrency(updatedData.discount);
    const dpNum = parseCurrency(updatedData.dp);
    const effectiveSubTotal = parseCurrency(subTotalStr) || subTotalNum;
    const netTotal = Math.max(0, effectiveSubTotal - discountNum);

    // 3. Calculate Pelunasan & Sisa Pembayaran
    let pelunasanStr = updatedData.pelunasan;
    let sisaStr = updatedData.sisaPembayaran;

    if (triggeredByField !== "pelunasan") {
      if (updatedData.status === "LUNAS" && dpNum > 0) {
        const calculatedPelunasan = Math.max(0, netTotal - dpNum);
        pelunasanStr = calculatedPelunasan > 0 ? formatCurrencyValue(calculatedPelunasan) : "";
      } else {
        pelunasanStr = "";
      }
    }

    if (triggeredByField !== "sisaPembayaran") {
      if (updatedData.status === "DP") {
        const calculatedSisa = Math.max(0, netTotal - dpNum);
        sisaStr = calculatedSisa > 0 ? formatCurrencyValue(calculatedSisa) : "";
      } else {
        // Status LUNAS -> Total Tagihan Netto
        sisaStr = netTotal > 0 ? formatCurrencyValue(netTotal) : "";
      }
    }

    return {
      ...updatedData,
      subTotal: subTotalStr,
      pelunasan: pelunasanStr,
      sisaPembayaran: sisaStr,
    };
  };

  // ===== Currency Input Helpers =====
  const CURRENCY_PREFIX = "Rp ";

  const handleCurrencyChange = (raw: string): string => {
    if (!raw || raw === CURRENCY_PREFIX) return "";
    if (raw.startsWith(CURRENCY_PREFIX)) return raw;
    return CURRENCY_PREFIX + raw;
  };

  const handleCurrencyFocus = (
    field: keyof InvoiceData,
    value: string
  ) => {
    if (!value) updateField(field, CURRENCY_PREFIX);
  };

  const handleCurrencyBlur = (
    field: keyof InvoiceData,
    value: string
  ) => {
    if (value === CURRENCY_PREFIX) updateField(field, "");
  };

  const handleItemCurrencyFocus = (index: number, value: string) => {
    if (!value) updateItem(index, "total", CURRENCY_PREFIX);
  };

  const handleItemCurrencyBlur = (index: number, value: string) => {
    if (value === CURRENCY_PREFIX) updateItem(index, "total", "");
  };

  const updateField = (field: keyof InvoiceData, value: string) => {
    const newData = { ...data, [field]: value };
    onChange(recalculate(newData, field));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    const newData = { ...data, items: newItems };
    onChange(recalculate(newData));
  };

  const addItem = () => {
    const newData = { ...data, items: [...data.items, { description: "", total: "" }] };
    onChange(recalculate(newData));
  };

  const removeItem = (index: number) => {
    if (data.items.length <= 1) return;
    const newItems = data.items.filter((_, i) => i !== index);
    const newData = { ...data, items: newItems };
    onChange(recalculate(newData));
  };

  const handlePrint = () => {
    if (data.clientName.trim()) {
      onSaveDraft();
    }
    onPrint();
  };

  const handleLoadDraft = (draft: InvoiceDraft) => {
    onLoadDraft(draft);
    setShowDrafts(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="no-print w-full lg:w-[420px] shrink-0 bg-white lg:border-r border-gray-200 lg:h-screen lg:overflow-y-auto shadow-md lg:shadow-none z-10 relative">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-gray-900 truncate">Agungjaya_Alumunium</h1>
              <p className="text-xs text-gray-500 mt-0.5">Invoice Generator</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Tombol Buka Riwayat */}
              <button
                onClick={() => setShowDrafts(true)}
                className="relative flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-amber-600 border border-gray-200 hover:border-amber-300 px-3 h-9 rounded-lg transition-all cursor-pointer whitespace-nowrap"
              >
                <BookOpen size={14} />
                <span>Riwayat</span>
                {drafts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {drafts.length}
                  </span>
                )}
              </button>
              {/* Tombol Cetak */}
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3.5 h-9 rounded-lg transition-colors cursor-pointer shadow-sm whitespace-nowrap"
              >
                <Printer size={14} />
                <span>Cetak PDF</span>
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Section: Status Pembayaran — di paling atas */}
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

          {/* Section: Tanggal */}
          <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tanggal Invoice</h2>
            <input
              type="text"
              value={data.date}
              onChange={(e) => {
                const newDate = e.target.value;
                onChange({
                  ...data,
                  date: newDate,
                  paymentDate: newDate ? `Pay by : ${newDate}` : "",
                });
              }}
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
                onChange={(e) => updateField("clientName", e.target.value.toUpperCase())}
                placeholder="Nama Klien (cth: IBU DENIA)"
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
                    placeholder={`Deskripsi pesanan (cth: 3 Set Daun Jendela\n1 Set Pintu Kaca Sliding)`}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none transition-shadow mb-2"
                  />
                  <input
                    type="text"
                    value={item.total}
                    onChange={(e) => updateItem(index, "total", handleCurrencyChange(e.target.value))}
                    onFocus={() => handleItemCurrencyFocus(index, item.total)}
                    onBlur={() => handleItemCurrencyBlur(index, item.total)}
                    placeholder="7.800.000"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-shadow"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Section: Ringkasan Biaya */}
          <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Ringkasan Biaya
            </h2>
            <div className="space-y-2.5">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Subtotal (Total Item)</label>
                <input
                  type="text"
                  value={data.subTotal || ""}
                  onChange={(e) => updateField("subTotal", handleCurrencyChange(e.target.value))}
                  onFocus={() => handleCurrencyFocus("subTotal", data.subTotal || "")}
                  onBlur={() => handleCurrencyBlur("subTotal", data.subTotal || "")}
                  placeholder="15.650.000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-shadow"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Discount (Opsional)</label>
                <input
                  type="text"
                  value={data.discount || ""}
                  onChange={(e) => updateField("discount", handleCurrencyChange(e.target.value))}
                  onFocus={() => handleCurrencyFocus("discount", data.discount || "")}
                  onBlur={() => handleCurrencyBlur("discount", data.discount || "")}
                  placeholder="650.000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-shadow"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">DP (Uang Muka)</label>
                <input
                  type="text"
                  value={data.dp}
                  onChange={(e) => updateField("dp", handleCurrencyChange(e.target.value))}
                  onFocus={() => handleCurrencyFocus("dp", data.dp)}
                  onBlur={() => handleCurrencyBlur("dp", data.dp)}
                  placeholder="3.900.000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-shadow"
                />
              </div>

              {/* Kolom Pelunasan — hanya muncul saat status LUNAS */}
              {data.status === "LUNAS" && (
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Pelunasan</label>
                  <input
                    type="text"
                    value={data.pelunasan}
                    onChange={(e) => updateField("pelunasan", handleCurrencyChange(e.target.value))}
                    onFocus={() => handleCurrencyFocus("pelunasan", data.pelunasan)}
                    onBlur={() => handleCurrencyBlur("pelunasan", data.pelunasan)}
                    placeholder="3.900.000"
                    className="w-full border border-amber-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-shadow bg-amber-50/50"
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  {data.status === "LUNAS" ? "Total" : "Sisa Pembayaran"}
                </label>
                <input
                  type="text"
                  value={data.sisaPembayaran}
                  onChange={(e) => updateField("sisaPembayaran", handleCurrencyChange(e.target.value))}
                  onFocus={() => handleCurrencyFocus("sisaPembayaran", data.sisaPembayaran)}
                  onBlur={() => handleCurrencyBlur("sisaPembayaran", data.sisaPembayaran)}
                  placeholder="3.900.000"
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



          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pb-2">
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-3 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <Printer size={16} />
              Cetak / Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* ===== MODAL RIWAYAT DRAFT ===== */}
      {showDrafts && (
        <div
          className="no-print fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">Riwayat Invoice</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {drafts.length === 0 ? "Belum ada riwayat" : `${drafts.length} invoice tersimpan (aktif 30 hari)`}
                </p>
              </div>
              <button
                onClick={() => setShowDrafts(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 px-4 py-3">
              {drafts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
                    <BookOpen size={24} className="text-amber-400" />
                  </div>
                  <p className="text-sm text-gray-500">Belum ada riwayat.</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Riwayat akan tersimpan otomatis saat mencetak invoice.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {[...drafts].reverse().map((draft) => {
                    const daysLeft = getDaysRemaining(draft.savedAt);
                    const isUrgent = daysLeft <= 2;
                    return (
                      <div
                        key={draft.id}
                        className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:border-amber-300 hover:bg-amber-50/40 transition-all"
                      >
                        <button
                          onClick={() => handleLoadDraft(draft)}
                          className="w-full text-left cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate">
                                {draft.data.clientName || "Tanpa Nama"}
                              </p>
                              {draft.data.clientAddress && (
                                <p className="text-xs text-gray-400 truncate mt-0.5">
                                  {draft.data.clientAddress}
                                </p>
                              )}
                              <div className="flex items-center gap-3 mt-2">
                                <span
                                  className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                    draft.data.status === "LUNAS"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-amber-100 text-amber-700"
                                  }`}
                                >
                                  {draft.data.status}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {draft.data.items.length} item
                                </span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div
                                className={`flex items-center gap-1 text-[10px] font-medium ${
                                  isUrgent ? "text-red-500" : "text-gray-400"
                                }`}
                              >
                                <Clock size={10} />
                                <span>{daysLeft}h lagi</span>
                              </div>
                              <p className="text-[10px] text-gray-300 mt-1 whitespace-nowrap">
                                {formatDate(draft.savedAt)}
                              </p>
                            </div>
                          </div>
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDraft(draft.id);
                          }}
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg transition-all cursor-pointer text-gray-300 hover:text-red-500"
                          title="Hapus draft"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-gray-100">
              <p className="text-[11px] text-gray-400 text-center">
              Tersimpan otomatis saat cetak · Terhapus setelah 30 hari
              </p>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
