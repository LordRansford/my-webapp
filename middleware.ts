import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAdminRole, isAdminRole } from "@/lib/admin/rbac";

function html(title: string, message: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${title}</title>
    <style>
      body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial; margin:0; background:#f8fafc; color:#0f172a}
      .wrap{max-width:720px; margin:0 auto; padding:48px 20px}
      .card{background:#fff; border:1px solid #e2e8f0; border-radius:18px; padding:22px}
      h1{font-size:28px; margin:0 0 8px}
      p{margin:0 0 12px; line-height:1.5; color:#334155}
      a{display:inline-block; margin-right:10px; padding:10px 14px; border-radius:999px; text-decoration:none; font-weight:700; font-size:14px}
      .primary{background:#0f172a; color:#fff}
      .secondary{border:1px solid #cbd5e1; color:#0f172a; background:#fff}
      .tag{font-size:12px; font-weight:700; color:#64748b; letter-spacing:.06em; text-transform:uppercase}
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <div class="tag">Admin</div>
        <h1>${title}</h1>
        <p>${message}</p>
        <div>
          <a class="secondary" href="/">Return home</a>
          <a class="primary" href="/signin">Sign in</a>
        </div>
      </div>
    </div>
  </body>
</html>`;
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isAdminPage = path === "/admin" || path.startsWith("/admin/");
  const isAdminApi = path.startsWith("/api/admin/");
  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    if (isAdminApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return new NextResponse(html("Access denied", "You must be signed in to access the admin area."), {
      status: 401,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  const claimedRole = (token as any)?.adminRole;
  const role = isAdminRole(claimedRole) ? claimedRole : getAdminRole({ email: String((token as any)?.email || "") });
  if (!role) {
    if (isAdminApi) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return new NextResponse(html("Access denied", "You do not have permission to access the admin area."), {
      status: 403,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};


