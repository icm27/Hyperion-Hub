let pendingErrors = [];

function notifyClientError(errorMessage, targetUrl, engine = 'unknown') {
    self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(clients => {
        if (!clients || clients.length === 0) {
            pendingErrors.push({ errorMessage, targetUrl, engine });
            return;
        }
        clients.forEach(client => {
            client.postMessage({
                type: 'PROXY_SW_ERROR',
                message: errorMessage,
                url: targetUrl,
                engine: engine
            });
        });
    }).catch(() => {});
}

function flushPendingErrors() {
    if (pendingErrors.length === 0) return;
    self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(clients => {
        if (clients && clients.length > 0) {
            while (pendingErrors.length > 0) {
                const err = pendingErrors.shift();
                clients.forEach(client => client.postMessage({
                    type: 'PROXY_SW_ERROR',
                    message: err.errorMessage,
                    url: err.targetUrl,
                    engine: err.engine
                }));
            }
        }
    }).catch(() => {});
}

const adblockSources = [
    { name: 'local', url: '/libs/shield.js' },
    { name: 'cdn', url: 'https://cdn.jsdelivr.net/npm/@ghostery/adblocker@2.2.6/dist/adblocker.umd.min.js' }
];

let adblockLoaded = false;
let lastError = null;

for (let i = 0; i < adblockSources.length; i++) {
    const current = adblockSources[i];
    const next = adblockSources[i + 1];

    try {
        importScripts(current.url);
        adblockLoaded = true;
        console.log(`${current.name} success!`);
        break;
    } catch (err) {
        lastError = err;
        if (next) console.warn(`Failed on ${current.name}, switching to ${next.name}`);
    }
}

if (!adblockLoaded) {
    let condition = "Unknown Failure";
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        condition = "Device is offline";
    } else if (lastError && (lastError.name === 'NetworkError' || String(lastError).includes('NetworkError'))) {
        condition = "Firewall/DNS block (network intercepted or blocked script download)";
    } else if (lastError && lastError.name === 'SyntaxError') {
        condition = "Captive portal / 404 block (network returned HTML error page instead of JS)";
    } else if (lastError) {
        condition = `${lastError.name || 'Error'}: ${lastError.message || String(lastError)}`;
    }

    console.error(`All options failed! Diagnosed error: ${condition}`);
    notifyClientError(`Adblocker completely failed: ${condition}`, 'shield.js', 'adblock');
}

importScripts('/config.js');
importScripts('/metrics/worker.js');
importScripts('/modules/core.js');
importScripts('/modules/settings.js');
importScripts('/modules/worker.js');
importScripts('/libs/shield.js');

let adblockEngine = null;
let isInitializing = false;

self.addEventListener('unhandledrejection', event => {
    if (event.reason && event.reason.name === 'NotFoundError') {
        event.preventDefault();
    }
});

let uv = null;
try {
    uv = new UVServiceWorker();
} catch(e) {}

const ASSET_AND_GAME_ALLOWLIST = [
    /vidrift/, /themoviedb\.org/, /tmdb\.org/, /vidsrc/, /2embed/, /autoembed/,
    /megacloud/, /rabbitstream/, /vidcloud/, /streamtape/, /dood/,
    /\.m3u8/, /\.mp4/, /\.m4s/, /\.ts/,
    /\.unityweb/, /\.data/, /\.pck/, /\.wasm/,
    /\.ogg/, /\.mp3/, /\.wav/, /\.bin/,
    /unpkg\.com/, /cdnjs\.cloudflare\.com/, /cdn\.jsdelivr\.net/,
    /github\.io/, /gitlab\.io/, /itch\.io/,
    /discord\.com/, /discordapp\.com/, /discordapp\.net/, /discord\.gg/,
    /youtube\.com/, /googlevideo\.com/, /ytimg\.com/, /yout-ube\.com/,
    /tightslybella\.com/, /workdeadlinededicate\.com/, /show-sb\.com/, /redgarto\.com/,
    /realizationnewestfangs\.com/, /spendsdetachment\.com/, /zoologyfibre\.com/, 
    /kettledroopingcontinuation\.com/, /portalfluently\.com/, /topperanlases\.com/,
    /alwingulla\.com/, /highcpmgate\.com/
];

const SYNTHETIC_TRACKERS = [
    /adscore\.com/, /adscore\.net/,
    /doubleclick\.net/, /googlesyndication\.com/, /googleadservices\.com/,
    /googletagmanager\.com/, /facebook\.net/, /facebook\.com/, /tiktok\.com/, /hotjar\.com/, /hotjar\.io/,
    /mxpnl\.com/, /amplitude\.com/, /segment\.com/, /ads-twitter\.com/, /licdn\.com/, /pinterest\.com/,
    /quantserve\.com/, /crwdcntrl\.net/, /id5-sync\.com/, /bluekai\.com/, /flushpersist\.com/,
    /adroll\.com/, /pubmatic\.com/, /taboola\.com/, /outbrain\.com/, /criteo\.net/, /revcontent\.com/,
    /mgid\.com/, /content-ad\.net/, /zemanta\.com/, /ntv\.io/, /applovin\.com/,
    /supersonicads\.com/, /vungle\.com/, /chartboost\.com/, /inmobi\.com/, /rayjump\.com/,
    /teads\.tv/, /spotxchange\.com/, /freewheel\.tv/, /tremorhub\.com/, /amazon-adsystem\.com/,
    /media\.net/, /adswizz\.com/, /megaphone\.fm/, /vidyard\.com/, /iheart\.com/, /soundcloud\.com/,
    /deezer\.com/, /tritondigital\.com/, /adcolony\.com/, /mouseflow\.com/, /freshmarketer\.com/,
    /luckyorange\.com/, /luckyorange\.net/, /bugsnag\.com/, /sentry-cdn\.com/, /getsentry\.com/,
    /samsungads\.com/, /cookiebot\.com/, /cookielaw\.org/, /privacy-mgmt\.com/, /consensu\.org/,
    /unityads\.unity3d\.com/,
    /admaven\.com/, /propellerads\.com/, /popcash\.net/, /popads\.net/,
    /exoclick\.com/, /hilltopads\.com/, /clickadu\.com/, /monetag\.com/, /onclickalgo\.com/
];

async function initAdblocker() {
    console.log("[Shield] Booting up adblocker sequence...");
    
    if (!self.GhosteryAdblocker) {
        console.error("[Shield] ERROR: GhosteryAdblocker library is missing from the Service Worker!");
        return;
    }
    
    if (adblockEngine) {
        console.log("[Shield] Engine is already running.");
        return;
    }
    
    if (isInitializing) return;

    isInitializing = true;
    try {
        console.log("[Shield] Attempting to fetch heavy-duty local blocklists...");
        adblockEngine = await GhosteryAdblocker.FiltersEngine.fromLists(fetch, [
            '/libs/easylist.txt',
            '/libs/easyprivacy.txt',
            '/libs/unbreak.txt'
        ]);
        console.log("✅ [Shield Active]: Loaded local heavy-duty blocklists successfully.");
    } catch (e) {
        console.warn("⚠️ [Shield Fallback]: Failed to load local blocklists, engaging basic rules.", e);
        adblockEngine = GhosteryAdblocker.FiltersEngine.parse(
            "||doubleclick.net^\n||google-analytics.com^\n||tiktok.com/api/ad/*\n||popads.net^\n||propellerads.com^\n||admaven.com^\n||onclickalgo.com^"
        );
    }
    isInitializing = false;
}

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(initAdblocker());
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim().then(() => flushPendingErrors()));
    initAdblocker();
});

self.addEventListener('message', () => {
    flushPendingErrors();
});

function isUrlBlocked(targetUrl, reqDestination, reqReferrer) {
    if (!targetUrl) return false;
    if (ASSET_AND_GAME_ALLOWLIST.some(regex => regex.test(targetUrl))) return false;
    if (SYNTHETIC_TRACKERS.some(regex => regex.test(targetUrl))) return true;

    if (adblockEngine) {
        const match = adblockEngine.match({ url: targetUrl, type: reqDestination || 'other', sourceUrl: reqReferrer });
        if (match && match.match) return true;
    }
    return false;
}

async function handleRequest(event) {
    let url;
    try {
        url = new URL(event.request.url);
    } catch (e) {
        return new Response(null, { status: 204 });
    }

    if (url.hostname === 'assets.modestocainstallmentpayday.loan') {
        try {
            const res = await fetch(event.request);
            const newHeaders = new Headers(res.headers);
            newHeaders.set('Cross-Origin-Resource-Policy', 'cross-origin');
            return new Response(res.body, { status: res.status, statusText: res.statusText, headers: newHeaders });
        } catch (e) {
            return new Response(null, { status: 204 });
        }
    }

    if (url.pathname === '/metrics/bundle.js' || url.pathname === '/bundle.js') {
        return fetch('/metrics/bundle.js');
    }

    if (
        url.hostname.includes('tightslybella.com') ||
        url.hostname.includes('workdeadlinededicate.com') ||
        url.hostname.includes('show-sb.com') ||
        url.hostname.includes('redgarto.com') ||
        url.hostname.includes('zoologyfibre.com') ||
        url.hostname.includes('kettledroopingcontinuation.com') ||
        url.hostname.includes('realizationnewestfangs.com') ||
        url.hostname.includes('spendsdetachment.com') ||
        url.hostname.includes('portalfluently.com') ||
        url.hostname.includes('topperanlases.com') ||
        url.hostname.includes('alwingulla.com') ||
        url.hostname.includes('highcpmgate.com')
    ) {
        return fetch(event.request).catch(() => new Response(null, { status: 204 }));
    }

    if (url.pathname.includes('/scramjet/') && url.pathname.endsWith('.wasm')) {
    try {
        const wasmRes = await fetch('/metrics/cache.wasm');
        const wasmHeaders = new Headers(wasmRes.headers);
        wasmHeaders.set('Content-Type', 'application/wasm');
        return new Response(wasmRes.body, { status: 200, headers: wasmHeaders });
    } catch (e) {
        return new Response(null, { status: 404 });
    }
}

    if (
    url.pathname.startsWith('/net/') ||
    url.pathname.startsWith('/base/') ||
    url.pathname.startsWith('/baremod/') ||
    url.pathname.startsWith('/libcurl/') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/src/') ||    
    url.pathname.startsWith('/libs/') ||   
    url.pathname.startsWith('/metrics/') ||
    url.pathname.startsWith('/modules/') || 
    url.pathname === '/sw.js' ||
    url.pathname === '/style.css' ||
    url.pathname === '/index.html' ||
    url.pathname === '/' ||
    url.pathname === '/config.js'
) {
    return fetch(event.request).catch(() => new Response(null, { status: 204 }));
}

    if (uv && uv.route(event)) {
        if (!adblockEngine) await initAdblocker();

        try {
            const prefix = __uv$config.prefix || '/uv/service/';
            if (url.pathname.startsWith(prefix)) {
                const encodedPart = url.pathname.slice(prefix.length);
                let targetUrl = '';
                
                try {
                    if (typeof __uv$config.decodeUrl === 'function') {
                        targetUrl = __uv$config.decodeUrl(encodedPart);
                    } else {
                        const [input, ...search] = encodedPart.split('?');
                        let decoded = decodeURIComponent(input).split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join('');
                        targetUrl = decoded + (search.length ? '?' + search.join('?') : '');
                    }
                } catch (decodeErr) {}

                if (targetUrl && isUrlBlocked(targetUrl, event.request.destination, event.request.referrer)) {
                    if (event.request.destination === 'script' || targetUrl.endsWith('.js')) {
                        return new Response('/* Blocked */', { status: 200, headers: { 'Content-Type': 'application/javascript' } });
                    }
                    return new Response(null, { status: 204, statusText: 'No Content' });
                }
            }
        } catch (err) {}

        try {
            const res = await uv.fetch(event);
            if (res && res.status >= 500) {
                notifyClientError(`UV Returned HTTP ${res.status}`, event.request.url, 'uv');
            }
            return res;
        } catch (uvError) {
            notifyClientError(uvError.message || String(uvError), event.request.url, 'uv');
            if (event.request.destination === 'script' || url.pathname.endsWith('.js')) {
                return fetch(event.request).catch(() => new Response(null, { status: 204 }));
            }
            return new Response(null, { status: 204 });
        }
    }

    if (url.pathname.startsWith('/scramjet/')) {
        if (typeof $scramjetController !== 'undefined') {
            if ($scramjetController.shouldRoute(event)) {
                if (!adblockEngine) await initAdblocker();
                return $scramjetController.route(event);
            } else {
              
                for (let j = 0; j < 25; j++) {
                    await new Promise(r => setTimeout(r, 100));
                    if (typeof $scramjetController !== 'undefined' && $scramjetController.shouldRoute(event)) {
                        if (!adblockEngine) await initAdblocker();
                        return $scramjetController.route(event);
                    }
                }
                return new Response("Scramjet Gateway Timeout: Service Worker did not receive RPC port from the tab.\nRequested Path: " + url.pathname, {
                    status: 504, 
                    headers: { 'Content-Type': 'text/plain' }
                });
            }
        }
    }

    try {
        const response = await fetch(event.request);
        if (response.ok && response.headers.get('content-type')?.includes('text/html')) {
            const p = url.pathname;
            if (p !== '/' && p !== '/index.html' && p !== '/index_2.html') {
                return new Response("404 Not Found", { status: 404 });
            }
        }
        return response;
    } catch (err) {
        return new Response(null, { status: 204 });
    }
}

self.addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event));
});