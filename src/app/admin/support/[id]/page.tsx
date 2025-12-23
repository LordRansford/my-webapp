import AdminSupportTicketClient from "./ui.client";
import { getSupportTicketAdminSafe } from "@/lib/admin/supportStore";

export const metadata = {
  title: "Admin: Support ticket",
  robots: { index: false, follow: false },
};

export default async function AdminSupportTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = await getSupportTicketAdminSafe(id);
  if (!ticket) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 lg:px-8 space-y-3">
        <h1 className="text-2xl font-semibold text-slate-900">Ticket not found</h1>
        <p className="text-slate-700">This ticket does not exist or is not accessible.</p>
      </main>
    );
  }
  return <AdminSupportTicketClient ticket={ticket} />;
}


