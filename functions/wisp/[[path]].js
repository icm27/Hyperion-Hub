export async function onRequest(context) {
    const url = new URL(context.request.url);
    const BACKEND_WISP_HOST = "wisp.12monthloans.net"; 
    url.hostname = BACKEND_WISP_HOST;
    url.port = "443";
    return fetch(url.toString(), context.request);
}