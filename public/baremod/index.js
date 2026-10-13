import { BareClient } from "https://cdn.jsdelivr.net/npm/@tomphttp/bare-client@3.3.3/dist/index.mjs";

export default class FallbackTransport {
    constructor(serverUrl) {
        this.client = new BareClient(serverUrl);
    }
    async init() {}
    async request(remote, method, body, headers, redirect) {
        let safeHeaders = [];
        if (headers) {
            if (Array.isArray(headers)) {
                safeHeaders = headers;
            } else if (typeof headers.entries === 'function') {
                for (const [k, v] of headers.entries()) safeHeaders.push([k, v]);
            } else {
                for (let k in headers) safeHeaders.push([k, headers[k]]);
            }
        }
        return this.client.request(remote, method, body, safeHeaders, redirect);
    }
    connect(url, protocols, requestHeaders, onopen, onmessage, onclose, onerror) {
        return this.client.connect(url, protocols, requestHeaders, onopen, onmessage, onclose, onerror);
    }
}
