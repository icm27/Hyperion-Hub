export default class DiagnosticFallback {
    constructor(serverUrl) {
        console.log("=========================================");
        console.log("🚨 BARE-MUX TRACER ROUND LOADED 🚨");
        console.log("=========================================");
        this.ready = true;
    }

    async init() { this.ready = true; }

    async request(remote, method, body, headers, redirect) {
        console.log(`🚨 INTERCEPTED REQUEST FOR: ${remote}`);
        
        // Return a fake 200 OK HTML page instead of contacting Cloudflare
        const html = `
            <div style="font-family: sans-serif; padding: 50px; text-align: center; color: white; background: #1a1a1a; height: 100vh;">
                <h1 style="color: #00ff00;">🔥 FALLBACK ENGINE IS ACTIVE 🔥</h1>
                <p>If you are reading this inside the iframe, the Service Worker cache is officially defeated.</p>
                <p>Cloudflare was completely bypassed, which means the 500 Error is dead.</p>
            </div>
        `;
        
        return {
            status: 200,
            statusText: 'OK',
            headers: [['content-type', 'text/html']],
            rawHeaders: [['content-type', 'text/html']],
            body: new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode(html));
                    controller.close();
                }
            })
        };
    }

    // Safely neutralize WebSockets without crashing
    connect(remote, protocols, getRequestHeaders, onmessage, onclose, onerror, onopen) {
        setTimeout(() => {
            if (typeof onerror === 'function') onerror('WS Blocked');
            if (typeof onclose === 'function') onclose(1006, '');
        }, 10);
        return { send() {}, close() {} };
    }
}
