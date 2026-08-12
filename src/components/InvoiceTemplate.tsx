import { Phone, MapPin, Receipt, Tag, Wallet, CheckCircle, CreditCard } from "lucide-react";
import type { InvoiceData } from "./InvoiceForm";

interface InvoiceTemplateProps {
  data: InvoiceData;
}

export default function InvoiceTemplate({ data }: InvoiceTemplateProps) {
  const hasDp = Boolean(
    data.dp &&
    data.dp.replace(/[^0-9]/g, "") !== "" &&
    parseInt(data.dp.replace(/[^0-9]/g, ""), 10) > 0
  );

  return (
    <div
      id="invoice-template"
      className="print-area flex-1 flex items-start justify-center bg-gray-100 p-8 overflow-y-auto min-h-screen"
    >
      {/* A4 Paper */}
      <div
        className="invoice-paper bg-white w-[210mm] min-h-[297mm] shadow-2xl relative flex flex-col"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* ===== TOP DECORATIVE BAR ===== */}
        <div className="absolute top-0 left-0 w-full h-[65px] bg-[#E8A317] overflow-hidden">
          {/* Slashed white gap */}
          <div 
            className="absolute bg-white h-[200px] w-[30px]"
            style={{ 
              top: "-50px", 
              right: "26%", 
              transform: "rotate(-35deg)" 
            }}
          />
        </div>

        {/* ===== HEADER CONTENT ===== */}
        <div className="relative px-12 pt-[95px] pb-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo + Company Name */}
            <div className="flex items-center gap-4 ml-0">
              <img
                src="/LOGO.jpeg"
                alt="Logo Agungjaya"
                className="w-[70px] h-[70px] object-contain"
              />
              <div className="flex flex-col mt-1">
                <h1
                  className="text-[19px] font-extrabold text-[#0f172a] tracking-wide leading-none mb-1"
                >
                  AGUNGJAYA ALUMINIUM
                </h1>
                <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-0.5">
                  Aluminium dan Kaca
                </p>
              </div>
            </div>

            {/* Right: INVOICE title + Date */}
            <div className="text-right mr-0 mt-1">
              <h2
                className="text-[44px] font-black tracking-widest text-[#2d3748] leading-none mb-2"
              >
                INVOICE
              </h2>
              <p className="text-[15px] text-gray-900 flex justify-end items-center gap-3 pr-1">
                <span className="font-bold">Date:</span>
                <span>{data.date || "\u00A0"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* ===== INVOICE TO / FROM SECTION ===== */}
        <div className="px-12 pt-6 pb-4">
          <div className="flex justify-between items-start">
            {/* Invoice To */}
            <div>
              <p className="text-[12px] font-bold text-amber-600 uppercase tracking-widest mb-1">Invoice To</p>
              <p className="text-[20px] font-extrabold text-[#0f172a]">
                {data.clientName || "\u00A0"}
              </p>
              <p className="text-[16px] font-semibold text-[#0f172a] mt-1">
                {data.clientAddress || "\u00A0"}
              </p>
            </div>

            {/* From */}
            <div className="text-right">
              <p className="text-[12px] font-bold text-amber-600 uppercase tracking-widest mb-1">From</p>
              <p className="text-[20px] font-extrabold text-[#0f172a]">
                AGUNGJAYA ALUMINIUM
              </p>
              <p className="text-[16px] font-semibold text-[#0f172a] mt-1">
                Duren Sawit, Jakarta Timur
              </p>
            </div>
          </div>
        </div>

        {/* ===== TABLE SECTION ===== */}
        <div className="px-12 mt-6">
          {/* Table Header */}
          <div
            className="flex items-center"
            style={{
              borderTop: "3px solid #E8A317",
              borderBottom: "2px solid #E8A317",
            }}
          >
            <div className="flex-1 py-4 px-2">
              <span className="text-[14px] font-bold text-gray-800 uppercase tracking-[2px]">
                Item
              </span>
            </div>
            <div className="w-[200px] py-4 px-2 text-right">
              <span className="text-[14px] font-bold text-gray-800 uppercase tracking-[2px]">
                Total
              </span>
            </div>
          </div>

          {/* Table Body Rows */}
          <div>
            {data.items.map((item, index) => (
              <div
                key={index}
                className="invoice-row flex items-start min-h-[70px]"
                style={{ borderBottom: "1px solid #E5E7EB" }}
              >
                <div className="flex-1 py-5 px-2 flex items-start gap-3">
                  <span className="text-[14px] font-bold text-amber-600 mt-0.5 shrink-0">
                    {index + 1}.
                  </span>
                  <p className="text-[16px] text-gray-800 whitespace-pre-line leading-[1.8]">
                    {item.description || "\u00A0"}
                  </p>
                </div>
                <div className="w-[200px] py-5 px-2 text-right">
                  <p className="text-[16px] text-gray-800 font-medium">
                    {item.total || "\u00A0"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary and Sisa Pembayaran */}
          <div className="mt-4 flex flex-col items-end">
            <div className="w-[350px]">
              {/* Top Border */}
              <div className="border-t-[1.5px] border-gray-300 w-full mb-1" />
              
              {data.subTotal && (
                <div className="flex items-center justify-between py-2 px-2">
                  <div className="flex items-center gap-2">
                    <Receipt size={15} className="text-gray-500" />
                    <p className="text-[16px] text-gray-800 font-medium">Subtotal</p>
                  </div>
                  <p className="text-[16px] text-gray-800 font-medium">{data.subTotal}</p>
                </div>
              )}
              
              {data.discount && (
                <div className="flex items-center justify-between py-2 px-2">
                  <div className="flex items-center gap-2">
                    <Tag size={15} className="text-red-500" />
                    <p className="text-[16px] text-gray-800 font-medium">Discount</p>
                  </div>
                  <p className="text-[16px] text-red-600 font-medium">{data.discount}</p>
                </div>
              )}
              
              {hasDp && (
                <div className="flex items-center justify-between py-2 px-2">
                  <div className="flex items-center gap-2">
                    <Wallet size={15} className="text-amber-600" />
                    <p className="text-[16px] text-gray-800 font-medium">DP</p>
                  </div>
                  <p className="text-[16px] text-gray-800 font-medium">{data.dp}</p>
                </div>
              )}
              
              {data.status === "LUNAS" && data.pelunasan && (
                <div className="flex items-center justify-between py-2 px-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={15} className="text-emerald-600" />
                    <p className="text-[16px] text-gray-800 font-medium">Pelunasan</p>
                  </div>
                  <p className="text-[16px] text-gray-800 font-medium">{data.pelunasan}</p>
                </div>
              )}
              
              {/* Border above Total */}
              <div className="border-t-[2px] border-[#1e3a8a] w-full mt-1.5" />
              
              {/* Total / Sisa Pembayaran */}
              <div className="flex items-center justify-between py-2.5 px-3 bg-[#f0f7ff]">
                <div className="flex items-center gap-2">
                  <CreditCard size={16} className="text-[#1e3a8a]" />
                  <p className="text-[16px] text-[#1e3a8a] font-bold">
                    {data.status === "LUNAS" ? "Total" : "Sisa Pembayaran"}
                  </p>
                </div>
                <p className="text-[18px] text-[#1e3a8a] font-extrabold tracking-wide">
                  {data.sisaPembayaran || "Rp 0"}
                </p>
              </div>

              {/* Border below Total */}
              <div className="border-b-[2px] border-[#1e3a8a] w-full mb-1" />
            </div>
          </div>
        </div>

        {/* ===== THICK AMBER SEPARATOR ===== */}
        <div className="px-12 mt-6 mb-5">
          <div className="h-[3px]" style={{ backgroundColor: "#E8A317" }} />
        </div>

        {/* ===== PAYMENT METHOD SECTION ===== */}
        <div className="invoice-payment px-12 pb-6">
          <div className="flex justify-between items-end">
            {/* Left: Payment Info - Clean Typographic Spacing */}
            <div>
              <p className="text-[12px] font-bold text-amber-600 uppercase tracking-widest mb-3">
                Payment Method
              </p>
              
              <div className="space-y-1">
                <p className="text-[18px] font-extrabold text-[#0f172a] leading-tight">
                  {data.paymentClientName || "\u00A0"}
                </p>
                <p className="text-[15px] font-medium text-gray-500">
                  {data.paymentMethod || "\u00A0"}
                </p>
                {data.paymentDate && (
                  <p className="text-[15px] font-bold text-amber-600 mt-2 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                    {data.paymentDate}
                  </p>
                )}
              </div>

              <p className="text-[15px] font-bold italic text-gray-400 mt-5">
                Thank you for your business :)
              </p>
            </div>

            {/* Right: Logo + Status Badge */}
            <div className="flex flex-col items-center gap-3 mr-4">
              <img
                src="/LOGO.jpeg"
                alt="Logo Agungjaya"
                className="w-[90px] h-[90px] object-contain"
              />
              <div
                className={`px-8 py-2 text-center rounded-md border-2 ${
                  data.status === "LUNAS"
                    ? "bg-emerald-50 border-emerald-600 text-emerald-800"
                    : "bg-amber-50 border-amber-500 text-amber-800"
                }`}
              >
                <span className="text-[14px] font-extrabold tracking-widest uppercase">
                  {data.status || "DP"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div
          className="mt-auto w-full h-[65px] relative overflow-hidden"
          style={{ backgroundColor: "#E8A317" }}
        >
          {/* Slashed white gap */}
          <div 
            className="absolute bg-white h-[200px] w-[30px]"
            style={{ 
              top: "-50px", 
              left: "26%", 
              transform: "rotate(35deg)" 
            }}
          />
          <div className="absolute top-0 right-0 w-[70%] h-full flex items-center justify-center gap-10">
            <div className="flex items-center gap-3 text-[#0f172a]">
              <div className="w-[30px] h-[30px] rounded-full border-[1.5px] border-[#0f172a] flex items-center justify-center">
                <Phone size={15} strokeWidth={2} />
              </div>
              <span className="text-[16px] font-medium tracking-wide">
                0822-6101-8391
              </span>
            </div>
            <div className="flex items-center gap-3 text-[#0f172a]">
              <div className="w-[30px] h-[30px] rounded-full border-[1.5px] border-[#0f172a] flex items-center justify-center">
                <MapPin size={15} strokeWidth={2} />
              </div>
              <span className="text-[16px] font-medium tracking-wide">
                Duren Sawit, Jakarta Timur
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
