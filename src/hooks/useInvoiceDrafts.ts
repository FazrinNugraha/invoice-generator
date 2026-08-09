import { useState, useEffect, useCallback } from "react";
import type { InvoiceData } from "../components/InvoiceForm";

const STORAGE_KEY = "agungjaya_invoice_drafts";
const EXPIRY_DAYS = 30;
const EXPIRY_MS = EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export interface InvoiceDraft {
  id: string;
  savedAt: number; // timestamp (ms)
  data: InvoiceData;
}

function loadFromStorage(): InvoiceDraft[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as InvoiceDraft[];
  } catch {
    return [];
  }
}

function saveToStorage(drafts: InvoiceDraft[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

function purgeExpired(drafts: InvoiceDraft[]): InvoiceDraft[] {
  const now = Date.now();
  return drafts.filter((d) => now - d.savedAt < EXPIRY_MS);
}

export function useInvoiceDrafts() {
  const [drafts, setDrafts] = useState<InvoiceDraft[]>(() =>
    purgeExpired(loadFromStorage())
  );

  // Setiap kali drafts berubah, simpan ke localStorage
  useEffect(() => {
    saveToStorage(drafts);
  }, [drafts]);

  /** Simpan draft baru dengan nama klien sebagai identifier */
  const saveDraft = useCallback((data: InvoiceData) => {
    const newDraft: InvoiceDraft = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      savedAt: Date.now(),
      data,
    };
    setDrafts((prev) => {
      const purged = purgeExpired(prev);
      // Cek apakah sudah ada draft dengan nama klien yang sama (update if same clientName)
      const existingIndex = purged.findIndex(
        (d) => d.data.clientName.trim().toLowerCase() === data.clientName.trim().toLowerCase() &&
               data.clientName.trim() !== ""
      );
      if (existingIndex !== -1) {
        // Update draft yang sudah ada
        const updated = [...purged];
        updated[existingIndex] = { ...newDraft, id: purged[existingIndex].id };
        return updated;
      }
      return [...purged, newDraft];
    });
    return newDraft;
  }, []);

  /** Hapus satu draft berdasarkan id */
  const deleteDraft = useCallback((id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  }, []);

  /** Ambil daftar draft yang masih valid (belum expired) */
  const validDrafts = purgeExpired(drafts);

  /** Hitung sisa hari hingga expired */
  const getDaysRemaining = (savedAt: number): number => {
    const elapsed = Date.now() - savedAt;
    const remaining = EXPIRY_MS - elapsed;
    return Math.max(0, Math.ceil(remaining / (24 * 60 * 60 * 1000)));
  };

  return { drafts: validDrafts, saveDraft, deleteDraft, getDaysRemaining };
}
