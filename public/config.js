self.__scramjet$config = {
    prefix: '/scramjet/',
    codec: {
        encode: (str) => {
            if (!str) return str;
            let xored = str.split('').map((c, i) => (i % 2 ? String.fromCharCode(c.charCodeAt(0) ^ 2) : c)).join('');
            return encodeURIComponent(xored);
        },
        decode: (str) => {
            if (!str) return str;
            const [input, ...search] = str.split('?');
            let decoded = decodeURIComponent(input);
            let unxored = decoded.split('').map((c, i) => (i % 2 ? String.fromCharCode(c.charCodeAt(0) ^ 2) : c)).join('');
            return unxored + (search.length ? '?' + search.join('?') : '');
        }
    },
    config: '/config.js',
    bundle: '/metrics/bundle.js',
    inject: '/metrics/inject.js',
    wasm: '/metrics/cache.wasm',
    files: {
        all: '/metrics/bundle.js',
        sync: '/metrics/sync.js',
        wasm: '/metrics/cache.wasm'
    }
};