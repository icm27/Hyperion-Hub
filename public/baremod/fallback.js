const allowedHeaders = new Set([
    'accept', 'accept-language', 'accept-encoding', 'user-agent', 
    'content-type', 'referer', 'origin', 'cookie', 
    'sec-fetch-dest', 'sec-fetch-mode', 'sec-fetch-site', 
    'sec-ch-ua', 'sec-ch-ua-mobile', 'sec-ch-ua-platform',
    'cache-control', 'pragma', 'dnt', 'x-requested-with'
]);

export default class BulletproofFallback {
    constructor(serverUrl) {
        this.endpoint = serverUrl.endsWith('/') ? serverUrl + 'v2/' : serverUrl + '/v2/';
        this.ready = true;
        console.log("=========================================");
        console.log("[FALLBACK ACTIVE] The true bulletproof script has loaded!");
        console.log("=========================================");
    }

    async init() { this.ready = true; }

    async request(remote, method, body, headers, redirect) {
        const url = new URL(remote);

        if (url.protocol === 'ws:' || url.protocol === 'wss:') {
            return { status: 502, statusText: 'WS Blocked', headers: [], rawHeaders: [], body: new ReadableStream({start(c){c.close()}}) };
        }

        const safeHeaders = {};
        const forwardHeaders = [];
        let entries = [];

        if (headers) {
            if (typeof headers.entries === 'function') entries = [...headers.entries()];
            else if (Array.isArray(headers)) {
                if (headers.length > 0 && Array.isArray(headers[0])) entries = headers;
                else for (let i = 0; i < headers.length; i += 2) entries.push([headers[i], headers[i + 1]]);
            } else if (typeof headers === 'object') entries = Object.entries(headers);
        }

        for (const [rawKey, rawVal] of entries) {
            if (!rawKey || typeof rawKey !== 'string') continue;
            const k = rawKey.trim().toLowerCase();
            if (allowedHeaders.has(k)) {
                safeHeaders[k] = String(rawVal);
                forwardHeaders.push(k);
            }
        }

        const bareHeaders = new Headers();
        bareHeaders.set('x-bare-protocol', url.protocol);
        bareHeaders.set('x-bare-host', url.hostname);
        bareHeaders.set('x-bare-port', url.port || (url.protocol === 'https:' ? '443' : '80'));
        bareHeaders.set('x-bare-path', url.pathname + url.search);
        bareHeaders.set('x-bare-headers', JSON.stringify(safeHeaders));
        bareHeaders.set('x-bare-forward-headers', JSON.stringify(forwardHeaders));

        const fetchInit = { method: method || 'GET', headers: bareHeaders, redirect: 'manual' };
        if (method !== 'GET' && method !== 'HEAD' && body !== undefined && body !== null) fetchInit.body = body;

        try {
            const bareResponse = await fetch(this.endpoint, fetchInit);
            const status = parseInt(bareResponse.headers.get('x-bare-status') || bareResponse.status, 10);
            const statusText = bareResponse.headers.get('x-bare-status-text') || bareResponse.statusText || 'OK';

            const responseHeaders = [];
            const rawBareHeaders = bareResponse.headers.get('x-bare-headers');
            if (rawBareHeaders) {
                try {
                    const parsed = JSON.parse(rawBareHeaders);
                    for (const [k, v] of Object.entries(parsed)) {
                        if (Array.isArray(v)) for (const val of v) responseHeaders.push([k, String(val)]);
                        else responseHeaders.push([k, String(v)]);
                    }
                } catch (e) {}
            } else {
                for (const [k, v] of bareResponse.headers.entries()) if (!k.startsWith('x-bare-')) responseHeaders.push([k, v]);
            }

            return { status, statusText, headers: responseHeaders, rawHeaders: responseHeaders, body: bareResponse.body || new ReadableStream({start(c){c.close()}}) };
        } catch (err) {
            return { status: 502, statusText: 'Bad Gateway', headers: [], rawHeaders: [], body: new ReadableStream({start(c){c.close()}}) };
        }
    }

    connect() { return { close() {}, send() {} }; }
}
