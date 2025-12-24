export default function handler(req, res) {
  const number = process.env.WHATSAPP_CHAT_NUMBER || "";
  if (!number) {
    return res.status(503).send("WhatsApp is not available right now.");
  }
  // Redirect hides the number from the frontend codebase, but the destination will still be visible in the browser.
  const text = encodeURIComponent("Hello, I would like help with Ransfords Notes.");
  const url = `https://wa.me/${encodeURIComponent(number)}?text=${text}`;
  res.writeHead(302, { Location: url });
  res.end();
}


