import { prisma } from "@/lib/db/prisma";
import type { AdminRole } from "@/lib/admin/rbac";

export type AdminUserListItem = {
  userId: string;
  email: string;
  role: AdminRole | "NONE";
  accountStatus: "active" | "suspended" | "pending";
  createdAt: string;
  lastActiveAt: string;
};

function toIso(d: any) {
  try {
    return new Date(d).toISOString();
  } catch {
    return new Date(0).toISOString();
  }
}

export type UserSortKey = "created" | "lastActive" | "role";
export type SortDir = "asc" | "desc";

export async function listUsersAdminSafe(opts: {
  search?: string;
  take: number;
  cursor?: string | null;
  sortKey: UserSortKey;
  sortDir: SortDir;
}): Promise<{ items: AdminUserListItem[]; nextCursor: string | null }> {
  const take = Math.max(1, Math.min(50, opts.take));
  const search = (opts.search || "").trim().toLowerCase();

  const where = search
    ? {
        OR: [{ email: { contains: search } }],
      }
    : {};

  const orderBy =
    opts.sortKey === "created"
      ? { createdAt: opts.sortDir }
      : opts.sortKey === "lastActive"
        ? { lastActiveAt: opts.sortDir }
        : [{ adminRole: opts.sortDir }, { createdAt: "desc" as const }];

  const rows = await (prisma as any).userIdentity.findMany({
    where,
    take: take + 1,
    ...(opts.cursor ? { cursor: { id: opts.cursor }, skip: 1 } : {}),
    orderBy,
    select: {
      id: true,
      email: true,
      adminRole: true,
      accountStatus: true,
      createdAt: true,
      lastActiveAt: true,
    },
  });

  const next = rows.length > take ? rows[take] : null;
  const slice = rows.slice(0, take);
  const items: AdminUserListItem[] = slice.map((r: any) => ({
    userId: String(r.id),
    email: String(r.email || ""),
    role: (r.adminRole as AdminRole) || "NONE",
    accountStatus: (r.accountStatus as any) || "active",
    createdAt: toIso(r.createdAt),
    lastActiveAt: toIso(r.lastActiveAt),
  }));

  return { items, nextCursor: next ? String(next.id) : null };
}

export async function getUserAdminSafe(userId: string) {
  const row = await (prisma as any).userIdentity.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      adminRole: true,
      accountStatus: true,
      createdAt: true,
      lastActiveAt: true,
    },
  });
  if (!row) return null;
  return {
    userId: String(row.id),
    email: String(row.email || ""),
    role: (row.adminRole as AdminRole) || "NONE",
    accountStatus: (row.accountStatus as any) || "active",
    createdAt: toIso(row.createdAt),
    lastActiveAt: toIso(row.lastActiveAt),
  } satisfies AdminUserListItem;
}

export async function setUserAdminRole(userId: string, role: AdminRole | null) {
  await (prisma as any).userIdentity.update({
    where: { id: userId },
    data: { adminRole: role },
  });
}

export async function setUserAccountStatus(userId: string, status: "active" | "suspended" | "pending") {
  await (prisma as any).userIdentity.update({
    where: { id: userId },
    data: { accountStatus: status },
  });
}


