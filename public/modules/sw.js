importScripts('uv.bundle.js');
importScripts('uv.config.js');
importScripts(__uv$config.sw || 'uv.sw.js');

importScripts('/config.js');
importScripts('/scramjet/scramjet.bundle.js');

const uv = new UVServiceWorker();
const scramjet = new ScramjetServiceWorker();

async function handleRequest(event) {
    if (scramjet.route(event)) {
        try {
            return await scramjet.fetch(event);
        } catch (err) {
            console.error("Scramjet Engine Error:", err);
            return new Response("Proxy Engine Error", { status: 500 });
        }
    }

    if (uv.route(event)) {
        try {
            return await uv.fetch(event);
        } catch (err) {
            console.error("UV Engine Error:", err);
            return new Response("Proxy Engine Error", { status: 500 });
        }
    }
    
    return await fetch(event.request);
}

self.addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event));
});