import cron from "node-cron";
import fs from "fs";
import path from "path";

type Invoice = {
  id: number;
  status: "paid" | "pending";
  description: string;
  date: string;
};

const DATA_DIR = path.resolve(process.cwd(), "Data");
const INVOICE_FILE = path.join(DATA_DIR, "invoice.json");
const ARCHIVE_FILE = path.join(DATA_DIR, "archive.json");

const readJson = <T>(file: string, fallback: T): T => {
  if (!fs.existsSync(file)) return fallback;
  const raw = fs.readFileSync(file, "utf-8").trim();
  if (!raw) return fallback;
  return JSON.parse(raw) as T;
};

const task = (): void => {
  try {
    const invoices = readJson<Invoice[]>(INVOICE_FILE, []);

    const paidInvoice = invoices.filter((i) => i.status === "paid");
    const pendingInvoice = invoices.filter((i) => i.status === "pending");

    console.log(`Paid: ${paidInvoice.length}, Pending: ${pendingInvoice.length}`);

    if (paidInvoice.length === 0) {
      console.log("Nothing to archive");
      return;
    }

    const archive = readJson<Invoice[]>(ARCHIVE_FILE, []);

    fs.writeFileSync(
      ARCHIVE_FILE,
      JSON.stringify([...archive, ...paidInvoice], null, 2),
      "utf-8"
    );

    fs.writeFileSync(
      INVOICE_FILE,
      JSON.stringify(pendingInvoice, null, 2),
      "utf-8"
    );

    console.log(`Archived ${paidInvoice.length} paid invoice(s)`);
  } catch (err) {
    console.error("Error:", err);
  }
};

cron.schedule("* * * * *", task);