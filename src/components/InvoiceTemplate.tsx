import { Phone, MapPin } from "lucide-react";
import type { InvoiceData } from "./InvoiceForm";

interface InvoiceTemplateProps {
  data: InvoiceData;
}

export default function InvoiceTemplate({ data }: InvoiceTemplateProps) {
  return (
    <div
      id="invoice-template"
      className="print-area flex-1 flex items-start justify-center bg-gray-100 p-8 overflow-y-auto min-h-screen"
    >
      {/* A4 Paper */}
      <div
        className="invoice-paper bg-white w-[210mm] h-[297mm] shadow-2xl relative overflow-hidden flex flex-col"
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
                  AGUNGJAYA_ALUMUNIUM
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
              <p className="text-[16px] font-bold text-[#0f172a] mb-1.5">Invoice to:</p>
              <p className="text-[20px] font-extrabold text-[#0f172a]">
                {data.clientName || "\u00A0"}
              </p>
              <p className="text-[16px] font-semibold text-[#0f172a] mt-1">
                {data.clientAddress || "\u00A0"}
              </p>
            </div>

            {/* From */}
            <div className="text-right">
              <p className="text-[16px] font-bold text-[#0f172a] mb-1.5">From:</p>
              <p className="text-[20px] font-extrabold text-[#0f172a]">
                AGUNGJAYA_ALUMINUM
              </p>
              <p className="text-[16px] font-semibold text-[#0f172a] mt-1">
                Duren Sawit , Jakarta Timur
              </p>
            </div>
          </div>
        </div>

        {/* ===== TABLE SECTION ===== */}
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
                className="flex items-start min-h-[70px]"
                style={{ borderBottom: "1px solid #E5E7EB" }}
              >
                <div className="flex-1 py-5 px-2">
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

            {/* DP Row */}
            <div
              className="flex items-center min-h-[60px]"
            >
              <div className="flex-1 py-5 px-2">
                <p className="text-[16px] text-gray-800 font-semibold tracking-wide">DP</p>
              </div>
              <div className="w-[200px] py-5 px-2 text-right">
                <p className="text-[16px] text-gray-800 font-medium">
                  {data.dp || "\u00A0"}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom border line for table area before Sisa Pembayaran */}
          <div className="mt-2" style={{ borderBottom: "1px solid #D1D5DB" }} />

          {/* Sisa Pembayaran / Total */}
          <div className="flex items-center justify-end mt-8 mb-4 gap-6">
            <span className="text-[16px] font-semibold text-gray-700">
              {data.status === "LUNAS" ? "Total" : "Sisa Pembayaran"}
            </span>
            <div
              className="px-8 py-3 rounded-sm"
              style={{ backgroundColor: "#FEF3C7" }}
            >
              <span className="text-[22px] font-black text-gray-900 tracking-wide">
                {data.sisaPembayaran || "Rp ___________"}
              </span>
            </div>
          </div>
        </div>

        {/* ===== THICK AMBER SEPARATOR ===== */}
        <div className="px-12 mt-6 mb-5">
          <div className="h-[3px]" style={{ backgroundColor: "#E8A317" }} />
        </div>

        {/* ===== PAYMENT METHOD SECTION ===== */}
        <div className="px-12 pb-6">
          <div className="flex justify-between items-end">
            {/* Left: Payment Info */}
            <div>
              <h3
                className="text-[18px] font-extrabold text-gray-900 uppercase tracking-wider mb-3"
              >
                Payment Method
              </h3>
              <p className="text-[18px] font-bold text-[#0f172a]">
                {data.paymentClientName || "\u00A0"}
              </p>
              <p className="text-[16px] text-gray-500 mt-1">
                {data.paymentMethod || "\u00A0"}
              </p>
              <p
                className="text-[17px] font-bold mt-1.5 tracking-wide"
                style={{ color: "#E8A317" }}
              >
                {data.paymentDate || "\u00A0"}
              </p>
              <p className="text-[19px] font-extrabold text-[#0f172a] mt-6">
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
                className="px-10 py-2 text-center"
                style={{ border: "2px solid #9CA3AF" }}
              >
                <span className="text-[14px] font-bold text-gray-700 tracking-wide">
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
