const __fetch = globalThis.fetch;
globalThis.fetch = async function(req, opts) {
    try {
        if (typeof req === 'string' || req instanceof URL) {
            let u = new URL(req);
            if (u.port === '443' || u.port === '80') u.port = '';
            req = u.toString();
        }
        // ERADICATE THE SNI-BREAKING HOST HEADER
        if (opts && opts.headers) {
            let safeHeaders = new Headers(opts.headers);
            safeHeaders.delete('host');
            opts.headers = safeHeaders;
        }
    } catch(e) {}
    return __fetch(req, opts);
};
