import "./index.js";

const RawTransport = self.LibcurlTransport?.LibcurlClient || self.LibcurlTransport?.default || self.LibcurlTransport;

class CappedLibcurl extends RawTransport {
    constructor(opts = {}) {
        if (opts.websocket && !opts.wisp) opts.wisp = opts.websocket;
        if (opts.wisp && !opts.websocket) opts.websocket = opts.wisp;
        opts.connections = [8, 60, 4];
        super(opts);
    }

    async request(remote, method, body, headers, signal) {
        if (headers && typeof headers === "object" && typeof headers[Symbol.iterator] !== "function") {
            headers = Object.entries(headers);
        } else if (!headers) {
            headers = [];
        }

        const res = await super.request(remote, method, body, headers, signal);

        if (res && res.headers && !res.rawHeaders) {
            res.rawHeaders = Array.isArray(res.headers)
                ? res.headers
                : (typeof res.headers.entries === "function" ? [...res.headers.entries()] : Object.entries(res.headers));
        }

        return res;
    }
}

export { CappedLibcurl as LibcurlClient };
export default CappedLibcurl;