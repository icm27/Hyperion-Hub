const _origFetch = globalThis.fetch;
globalThis.fetch = async function(req, opts) {
    try {
        if (typeof req === 'string' || req instanceof URL) {
            let u = new URL(req);
            if (u.protocol === 'https:' && u.port === '443') u.port = '';
            if (u.protocol === 'http:' && u.port === '80') u.port = '';
            req = u.toString();
        } else if (req instanceof Request) {
            let u = new URL(req.url);
            if ((u.protocol === 'https:' && u.port === '443') || (u.protocol === 'http:' && u.port === '80')) {
                u.port = '';
                req = new Request(u.toString(), req);
            }
        }
    } catch(e) {}
    return _origFetch(req, opts);
};
