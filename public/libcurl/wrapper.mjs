import "./index.js";

// Extract the class from the global object populated by your local file
const BaseClient = globalThis.LibcurlTransport?.LibcurlClient || globalThis.LibcurlTransport?.default || globalThis.LibcurlTransport;

export default class LibcurlWrapper extends BaseClient {
    constructor(opts) {
        // Map BareMux v2's standard 'wisp' arguments to what Libcurl actually expects
        if (opts && opts.wisp && !opts.websocket) {
            opts.websocket = opts.wisp;
        }
        if (opts && !opts.connections) {
            opts.connections = [30, 20, 6];
        }
        super(opts);
    }

    async request(remote, method, body, headers, redirect) {
        let safeHeaders = headers;
        
        // Fix the "headers is not iterable" crash by safely converting objects to arrays
        if (headers && typeof headers === 'object' && !Array.isArray(headers) && typeof headers.entries !== 'function') {
            safeHeaders = Object.entries(headers);
        }
        
        return super.request(remote, method, body, safeHeaders, redirect);
    }
}
