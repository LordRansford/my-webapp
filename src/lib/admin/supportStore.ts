import { prisma } from "@/lib/db/prisma";

export type SupportStatus = "open" | "in_progress" | "resolved";

export type SupportTicketListItem = {
  id: string;
  userId: string | null;
  name: string | null;
  email: string | null;
  category: string;
  status: SupportStatus;
  createdAt: string;
  updatedAt: string;
};

function toIso(d: any) {
  try {
    return new Date(d).toISOString();
  } catch {
    return new Date(0).toISOString();
  }
}

export async function listSupportTicketsAdminSafe(opts: {
  status?: SupportStatus | null;
  category?: string | null;
  take: number;
  cursor?: string | null;
  sort: "newest" | "oldest";
}) {
  const take = Math.max(1, Math.min(50, opts.take));
  const where: any = {};
  if (opts.status) where.status = opts.status;
  if (opts.category) where.category = String(opts.category);

  const orderBy = opts.sort === "oldest" ? { createdAt: "asc" as const } : { createdAt: "desc" as const };

  const rows = await (prisma as any).supportTicket.findMany({
    where,
    take: take + 1,
    ...(opts.cursor ? { cursor: { id: opts.cursor }, skip: 1 } : {}),
    orderBy,
    select: {
      id: true,
      userId: true,
      name: true,
      email: true,
      category: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const next = rows.length > take ? rows[take] : null;
  const slice = rows.slice(0, take);
  return {
    items: slice.map((r: any) => ({
      id: String(r.id),
      userId: r.userId ? String(r.userId) : null,
      name: r.name ? String(r.name) : null,
      email: r.email ? String(r.email) : null,
      category: String(r.category || ""),
      status: r.status as SupportStatus,
      createdAt: toIso(r.createdAt),
      updatedAt: toIso(r.updatedAt),
    })) satisfies SupportTicketListItem[],
    nextCursor: next ? String(next.id) : null,
  };
}

export async function getSupportTicketAdminSafe(id: string) {
  const row = await (prisma as any).supportTicket.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      name: true,
      email: true,
      category: true,
      message: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      attachments: { select: { id: true, fileName: true, mimeType: true, sizeBytes: true, storageKey: true, createdAt: true } },
      notes: { select: { id: true, adminUserId: true, note: true, createdAt: true }, orderBy: { createdAt: "desc" as const } },
    },
  });
  if (!row) return null;
  return {
    id: String(row.id),
    userId: row.userId ? String(row.userId) : null,
    name: row.name ? String(row.name) : null,
    email: row.email ? String(row.email) : null,
    category: String(row.category || ""),
    message: String(row.message || ""),
    status: row.status as SupportStatus,
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
    attachments: (row.attachments || []).map((a: any) => ({
      id: String(a.id),
      fileName: String(a.fileName),
      mimeType: String(a.mimeType),
      sizeBytes: Number(a.sizeBytes),
      storageKey: a.storageKey ? String(a.storageKey) : null,
      createdAt: toIso(a.createdAt),
    })),
    notes: (row.notes || []).map((n: any) => ({ id: String(n.id), adminUserId: String(n.adminUserId), note: String(n.note), createdAt: toIso(n.createdAt) })),
  };
}

export async function setSupportTicketStatus(id: string, status: SupportStatus) {
  await (prisma as any).supportTicket.update({ where: { id }, data: { status } });
}

export async function addSupportTicketNote(id: string, adminUserId: string, note: string) {
  await (prisma as any).supportTicketNote.create({ data: { ticketId: id, adminUserId, note } });
}


