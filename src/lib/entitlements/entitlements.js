const DONATION_KEY = "template-donation-token";
const PERMISSION_KEY = "template-permission-token";

const safeWindow = () => (typeof window !== "undefined" ? window : null);

export function setDonationToken(token) {
  const win = safeWindow();
  if (!win || !token) return;
  win.localStorage.setItem(DONATION_KEY, token);
}

export function getDonationToken() {
  const win = safeWindow();
  if (!win) return null;
  return win.localStorage.getItem(DONATION_KEY);
}

export function setPermissionToken(token) {
  const win = safeWindow();
  if (!win || !token) return;
  win.localStorage.setItem(PERMISSION_KEY, token.trim());
}

export function getPermissionToken() {
  const win = safeWindow();
  if (!win) return null;
  const token = win.localStorage.getItem(PERMISSION_KEY);
  return token ? token.trim() : null;
}

export function hasDonationSupport() {
  return Boolean(getDonationToken());
}

export function hasPermissionToken() {
  return Boolean(getPermissionToken());
}

export function unlockCommercialNoAttribution() {
  return hasDonationSupport() || hasPermissionToken();
}
