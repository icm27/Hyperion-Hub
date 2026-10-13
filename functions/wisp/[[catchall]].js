export async function onRequest(context) {
  const req = context.request;
  const upgradeHeader = req.headers.get("Upgrade");

  if (!upgradeHeader || upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket upgrade", { status: 426 });
  }

  const targetUrl = new URL(req.url);
  targetUrl.protocol = "https:";
  targetUrl.hostname = "wisp.modestocainstallmentpayday.loan";
  targetUrl.port = "443";

  return fetch(targetUrl.toString(), req);
}