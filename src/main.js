import { siteHTML } from './site-body.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, onChildRemoved, set, update, onValue, serverTimestamp, get, query, limitToLast } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAMPOhPvHgXTGTXWbEzIZGubkG1oAFp08w",
    authDomain: "hyperion-chat-657b7.firebaseapp.com",
    databaseURL: "https://hyperion-chat-657b7-default-rtdb.firebaseio.com",
    projectId: "hyperion-chat-657b7",
    storageBucket: "hyperion-chat-657b7.firebasestorage.app",
    messagingSenderId: "216695074768",
    appId: "1:216695074768:web:7a30172645cba8ea37d3d5",
    measurementId: "G-K1YD7LF363"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

document.getElementById('hyperion-root').innerHTML = siteHTML;

const isVerified = localStorage.getItem('hyperion_auth') === 'true';
const gateCheck = sessionStorage.getItem('hyperion_gate');
//
if (isVerified) {
    document.documentElement.classList.add('unlocked');
} else {
    if (gateCheck === 'pending') {
        localStorage.setItem('hyperion_auth', 'true');
        sessionStorage.removeItem('hyperion_gate');
        document.documentElement.classList.add('unlocked');
    } else {
        sessionStorage.setItem('hyperion_gate', 'pending');
    }
}

window.unlockHub = function() {
    localStorage.setItem('hyperion_auth', 'true');
    window.location.reload();
};

if (localStorage.getItem('autoCloak') === null) {
    localStorage.setItem('autoCloak', 'true');
}

window.pendingGifUrl = { full: null, mini: null };

window.attachGif = function(url, mode) {
    window.pendingGifUrl[mode] = url;
    const preview = document.getElementById(`${mode}-gif-preview`);
    if (preview) {
        preview.innerHTML = `
            <div style="position:relative; display:inline-flex; border: 1px solid var(--border-primary); border-radius: 8px; padding: 4px; background: var(--search-bg);">
                <img src="${url}" style="height: 100px; border-radius: 6px; object-fit: contain;">
                <button onclick="window.removeAttachedGif('${mode}')" style="position:absolute; top:-8px; right:-8px; background:var(--text-main); color:var(--bg-main); border:none; border-radius:50%; width:22px; height:22px; cursor:pointer; font-weight:bold; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; font-size:14px;">&times;</button>
            </div>`;
        preview.style.display = 'flex';
        preview.style.justifyContent = 'flex-start'; 
    }
};

window.removeAttachedGif = function(mode) {
    window.pendingGifUrl[mode] = null;
    const preview = document.getElementById(`${mode}-gif-preview`);
    if (preview) {
        preview.innerHTML = '';
        preview.style.display = 'none';
    }
};

const savedTheme = localStorage.getItem('hyperion_theme') || 'default';
document.documentElement.setAttribute('data-theme', savedTheme);

const customBg = localStorage.getItem('hyperion_custom_bg');
const customAccent = localStorage.getItem('hyperion_custom_accent');
if (customBg) {
    document.documentElement.style.setProperty('--bg-main', customBg);
    document.documentElement.style.setProperty('--card-bg', customBg);
    document.documentElement.style.setProperty('--panel-bg', customBg);
    document.documentElement.style.setProperty('--sidebar-bg', customBg);
    document.documentElement.style.setProperty('--search-bg', customBg);
}
if (customAccent) {
    document.documentElement.style.setProperty('--text-main', customAccent);
    document.documentElement.style.setProperty('--border-hover', customAccent);
}

const vantaThemes = {
    'default': { base: 0x050505, low: 0x000000, mid: 0x1a1a1a, high: 0x2a2a2a },
    'stellar-light': { base: 0xf4f5f7, low: 0xe2e8f0, mid: 0xffffff, high: 0xcbd5e1 },
    'abyssal-blue': { base: 0x1a233a, low: 0x0f172a, mid: 0x25314c, high: 0x4cc9f0 },
    'nebula-violet': { base: 0x251a3a, low: 0x150e24, mid: 0x31244c, high: 0xb5179e },
    'solar-flare': { base: 0x2d1914, low: 0x1a0e0b, mid: 0x3d221c, high: 0xf97316 },
    'glacier-drift': { base: 0x4c566a, low: 0x3b4252, mid: 0x81a1c1, high: 0x88c0d0 },
    'soft-rose': { base: 0xe86a8e, low: 0xc25977, mid: 0xff8fa3, high: 0xffffff }
};

window.vantaEffect = null;
window.updateVantaColors = function(themeName, cBg, cAcc) {
    try {
        if (!window.VANTA || !window.VANTA.FOG) return;
        
        if (performanceMode) {
            if (window.vantaEffect) {
                window.vantaEffect.destroy();
                window.vantaEffect = null;
            }
            document.getElementById('canvas-bg').style.background = cBg || vantaThemes[themeName]?.base || 'var(--bg-main)';
            return;
        }

        if (!window.vantaEffect) {
            window.vantaEffect = VANTA.FOG({
                el: "#canvas-bg",
                mouseControls: true, touchControls: true, gyroControls: false,
                minHeight: 200.00, minWidth: 200.00, blurFactor: 0.65, speed: 2.00, zoom: 1.00
            });
        }
        
        if (cBg && cAcc) {
            let baseC = parseInt(cBg.replace('#', '0x'), 16);
            let accC = parseInt(cAcc.replace('#', '0x'), 16);
            window.vantaEffect.setOptions({ baseColor: baseC, lowlightColor: baseC, midtoneColor: baseC, highlightColor: accC });
        } else {
            let colors = vantaThemes[themeName] || vantaThemes['default'];
            window.vantaEffect.setOptions({ baseColor: colors.base, lowlightColor: colors.low, midtoneColor: colors.mid, highlightColor: colors.high });
        }
    } catch (e) {
        document.getElementById('canvas-bg').style.background = cBg || vantaThemes[themeName]?.base || '#000';
    }
};

const safeProfiles = [
    { title: "Google Classroom", domain: "classroom.google.com" },
    { title: "Google Docs", domain: "docs.google.com" },
    { title: "Google Slides", domain: "docs.google.com" },
    { title: "Algebra Practice", domain: "ixl.com" },
    { title: "US History Project", domain: "docs.google.com" },
    { title: "Physics Lab Report", domain: "docs.google.com" },
    { title: "Canvas Learning", domain: "instructure.com" },
    { title: "Quizlet Flashcards", domain: "quizlet.com" },
    { title: "Desmos | Graphing Calculator", domain: "desmos.com" },
    { title: "Khan Academy", domain: "khanacademy.org" },
    { title: "Reading Assignment", domain: "docs.google.com" },
    { title: "DeltaMath", domain: "deltamath.com" },
    { title: "AP Central | College Board", domain: "collegeboard.org" },
    { title: "Naviance Student", domain: "naviance.com" },
    { title: "Edpuzzle", domain: "edpuzzle.com" },
    { title: "Kahoot!", domain: "kahoot.it" },
    { title: "Infinite Campus", domain: "infinitecampus.com" },
    { title: "Skyward Document Viewer", domain: "skyward.com" },
    { title: "Grammarly Editor", domain: "grammarly.com" },
    { title: "NoodleTools", domain: "noodletools.com" }
];

const chosenProfile = localStorage.getItem('hyperion_auth') === 'true'
    ? safeProfiles[Math.floor(Math.random() * safeProfiles.length)]
    : { title: "Google Docs - Math Workspace", domain: "docs.google.com" };

let currentHubTitle = chosenProfile.title;
window.currentHubIcon = `https://www.google.com/s2/favicons?domain=${chosenProfile.domain}&sz=64`;

document.title = currentHubTitle;

let faviconLink = document.querySelector("link[rel~='icon']");
if (!faviconLink) {
    faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    document.head.appendChild(faviconLink);
}
faviconLink.href = window.currentHubIcon;
// 

let customBookmarks = JSON.parse(localStorage.getItem('hyperion_custom_bookmarks') || '[]');

window.handleBookmarkImgError = function(img) {
    if (!img || !img.parentElement) return;
    img.parentElement.innerHTML = '<i class="fa-solid fa-globe" style="font-size: 26px; color: var(--text-main); transition: color 0.3s ease;"></i>';
};

window.saveCustomBookmark = function() {
    const name = document.getElementById('bm-name').value.trim();
    let url = document.getElementById('bm-url').value.trim();
    let image = document.getElementById('bm-image').value.trim();

    if (!name || !url) return window.showPS5Notification("Error", "Name and URL are required.", 4000);
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    if (!image) {
        try {
            const domain = new URL(url).hostname;
            image = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        } catch (e) {
            image = ''; 
        }
    }

    customBookmarks.push({ id: Date.now(), name, url, image });
    localStorage.setItem('hyperion_custom_bookmarks', JSON.stringify(customBookmarks));
    
    window.renderCustomBookmarks();
    window.forceClose('add-bookmark-modal');
    
    document.getElementById('bm-name').value = '';
    document.getElementById('bm-url').value = '';
    document.getElementById('bm-image').value = '';
    
    window.showPS5Notification("Bookmark Added", `${name} saved locally.`, 4000);
};

window.deleteCustomBookmark = function(e, id) {
    e.stopPropagation(); 
    customBookmarks = customBookmarks.filter(b => b.id !== id);
    localStorage.setItem('hyperion_custom_bookmarks', JSON.stringify(customBookmarks));
    window.renderCustomBookmarks();
};

window.renderCustomBookmarks = function() {
    const homeContainer = document.getElementById('custom-bookmarks-container');
    if (homeContainer) {
        homeContainer.innerHTML = '';
        customBookmarks.forEach(bm => {
            const safeName = window.escapeHTML(bm.name);
            const safeUrl = window.escapeHTML(bm.url);
            const safeImg = window.escapeHTML(bm.image);
            
            const iconHtml = bm.image 
                ? `<img src="${safeImg}" class="custom-bm-img" onerror="window.handleBookmarkImgError(this)">`
                : `<i class="fa-solid fa-globe" style="font-size: 26px; color: var(--text-main); transition: color 0.3s ease;"></i>`;

            homeContainer.innerHTML += `
                <div class="web-bookmark" style="position: relative;" onclick="window.launchProxy('${safeUrl}')">
                    <button class="custom-bm-delete" onclick="window.deleteCustomBookmark(event, ${bm.id})">&times;</button>
                    <div class="bookmark-circle" style="padding: 0; border-color: var(--border-primary);">
                        ${iconHtml}
                    </div>
                    <span>${safeName}</span>
                </div>
            `;
        });
    }

    document.querySelectorAll('.ntp-bookmarks').forEach(ntpRow => {
        ntpRow.querySelectorAll('.custom-ntp-item').forEach(el => el.remove());

        customBookmarks.forEach(bm => {
            const safeName = window.escapeHTML(bm.name);
            const safeUrl = window.escapeHTML(bm.url);
            const safeImg = window.escapeHTML(bm.image);

            const ntpIconHtml = bm.image
                ? `<img src="${safeImg}" class="custom-bm-img" onerror="window.handleBookmarkImgError(this)">`
                : `<i class="fa-solid fa-globe" style="font-size: 26px; color: #fff; transition: color 0.3s ease;"></i>`;

            const item = document.createElement('div');
            item.className = 'web-bookmark custom-ntp-item';
            item.style.position = 'relative';
            item.onclick = () => window.launchProxy(safeUrl);
            item.innerHTML = `
                <button class="custom-bm-delete" onclick="window.deleteCustomBookmark(event, ${bm.id})">&times;</button>
                <div class="bookmark-circle" style="padding: 0; border-color: var(--border-primary);">
                    ${ntpIconHtml}
                </div>
                <span>${safeName}</span>
            `;
            
            const addNewBtn = ntpRow.querySelector('.add-new-btn');
            if (addNewBtn) {
                ntpRow.insertBefore(item, addNewBtn);
            } else {
                ntpRow.appendChild(item);
            }
        });
    });
};

window.currentMode = 'web';
let searchEngine = localStorage.getItem('searchEngine') || 'https://duckduckgo.com/?q=';
let proxyEngine = localStorage.getItem('proxyEngine') || 'scramjet'; 
let transportEngine = localStorage.getItem('transportEngine') || 'libcurl'; 
let panicKey = localStorage.getItem('panicKey') || '';
let panicUrl = localStorage.getItem('panicUrl') || 'https://classroom.google.com';
let autoCloak = localStorage.getItem('autoCloak') === 'true';
let profanityEnabled = localStorage.getItem('profanityFilter') !== 'false';
let performanceMode = localStorage.getItem('performanceMode') === 'true';
let favoriteGames = JSON.parse(localStorage.getItem('hyperion_favorites') || '[]');
let currentGamePath = '';
let currentGameName = '';
let showingFavorites = false;
let R2_DOMAIN = "https://assets.modestocainstallmentpayday.loan";
let filteredGames = [];
let allGamesArray = [];

let myDeviceId = localStorage.getItem('hyperion_device_uid');
if (!myDeviceId) {
    myDeviceId = 'hyp_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
    localStorage.setItem('hyperion_device_uid', myDeviceId);
}

if (localStorage.getItem('antiClose') === null) {
    localStorage.setItem('antiClose', 'true');
}
let antiClose = localStorage.getItem('antiClose') === 'true';

window.addEventListener('beforeunload', (e) => {
    if (antiClose) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave?';
    }
});

window.globalBadges = {};
onValue(ref(db, 'badges'), (snap) => {
    window.globalBadges = snap.val() || {};
    document.querySelectorAll('.chat-msg-row').forEach(row => {
        const deviceId = row.getAttribute('data-device-id');
        const badgeContainer = row.querySelector('.custom-badge-container');
        if (deviceId && badgeContainer) {
            const userBadges = window.globalBadges[deviceId];
            if (userBadges && Object.keys(userBadges).length > 0) {
                let html = '';
                Object.values(userBadges).forEach(b => {
                    html += `<span style="background:${window.escapeHTML(b.bg)}; color:${window.escapeHTML(b.color)}; font-size:9px; font-weight:800; padding:1px 5px 0 5px; border-radius:4px; margin-left:6px; letter-spacing:0.5px; display:inline-flex; align-items:center; justify-content:center; height:17px; line-height:1; box-sizing:border-box; vertical-align:middle; position:relative; top:-1px;">${window.escapeHTML(b.label)}</span>`;
                });
                badgeContainer.innerHTML = html;
            } else {
                badgeContainer.innerHTML = '';
            }
        }
    });
});

window.globalNicknames = {};
onValue(ref(db, 'nicknames'), (snap) => {
    window.globalNicknames = snap.val() || {};
    document.querySelectorAll('.chat-msg-row').forEach(row => {
        const deviceId = row.getAttribute('data-device-id');
        const originalUser = row.getAttribute('data-original-user');
        if (deviceId && originalUser) {
            const nameSpan = row.querySelector('.chat-msg-text-block strong');
            if (nameSpan) {
                const forcedName = window.globalNicknames[deviceId];
                nameSpan.innerText = forcedName ? forcedName : originalUser;
            }
        }
    });
});

let currentUser = localStorage.getItem("chat_username");
if (!currentUser) {
    currentUser = "Guest_" + Math.floor(Math.random() * 9999);
    localStorage.setItem("chat_username", currentUser);
}

if (navigator.webdriver || window.document.documentElement.getAttribute("webdriver")) {
    localStorage.setItem('bot_lockout', 'true');
}

const isBot = localStorage.getItem('hyperion_bot_lockout') === 'true';

let myChatColor = localStorage.getItem("chat_color") || "#4cc9f0";
let myChatFont = localStorage.getItem("chat_font") || "'Poppins', sans-serif";
let myChatEffect = localStorage.getItem("chat_effect") || "none";
let myChatPfp = localStorage.getItem("chat_pfp") || "";

const safeInitKey = currentUser.toLowerCase().replace(/[.#$\[\]]/g, "_");
set(ref(db, `users/${safeInitKey}`), { active: true, last_active: Date.now() });

window.updatePlayingAs = function() {
    const display = document.getElementById('current-username-display');
    if (display) {
        display.innerText = currentUser;
        display.className = myChatEffect && myChatEffect !== 'none' ? `effect-${myChatEffect}` : "";
        display.style.cssText = `font-size:14px; font-weight:600; white-space:nowrap; text-overflow:ellipsis; overflow:hidden; --user-color:${myChatColor}; color:${myChatColor};`;
    }
};

let sessionErrorCount = 0;
const MAX_ERRORS_PER_SESSION = 3;

window.logTelemetryError = function(errorData) {
    if (sessionErrorCount >= MAX_ERRORS_PER_SESSION) return;
    sessionErrorCount++; 

    try {
        push(ref(db, 'telemetry/errors'), {
            ...errorData,
            user: currentUser || 'Guest',
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: serverTimestamp()
        }).catch(() => {});
    } catch (e) {}
};

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'PROXY_SW_ERROR') {
            window.logTelemetryError({
                type: 'service_worker_proxy_error',
                engine: event.data.engine || 'unknown',
                message: event.data.message || 'Unknown SW proxy error',
                targetUrl: event.data.url || 'unknown',
                source: 'sw.js'
            });
        }
    });
}

window.addEventListener('error', (event) => {
    if (event.message && (
    event.message.includes('ResizeObserver') ||
    event.message === 'Script error.' ||
    event.message.includes("Unexpected identifier 'http'")
)) return;
    
    if (event.filename && (event.filename.includes('tightslybella') || event.filename.includes('invoke.js'))) return;
    if (event.message && event.message.includes('cross-origin')) return;
    
    window.logTelemetryError({
        type: 'runtime_error',
        message: event.message || 'Unknown error',
        source: event.filename || 'unknown',
        line: event.lineno || 0,
        stack: event.error && event.error.stack ? event.error.stack : 'No stack trace'
    });
});

window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (!reason) return;
    const msg = reason.message || String(reason);
    
    if (msg.includes('net::ERR_BLOCKED_BY_CLIENT') || msg.includes('AbortError') || msg.includes('tightslybella')) return;

    window.logTelemetryError({
        type: 'promise_rejection',
        message: msg,
        stack: reason.stack || 'No stack trace',
        source: 'global_promise_rejection'
    });
});

window.goFullscreen = function() {
    const gameContainer = document.getElementById('iframe-wrapper');
    const iframe = gameContainer.querySelector('iframe');
    const targetElement = iframe || gameContainer; 

    if (!document.fullscreenElement) {
        if (targetElement.requestFullscreen) {
            targetElement.requestFullscreen();
        } else if (targetElement.webkitRequestFullscreen) {
            targetElement.webkitRequestFullscreen();
        } else if (targetElement.msRequestFullscreen) { 
            targetElement.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
};

window.browserTabs = [];
window.activeTabId = null;

const ntpBookmarks = [
    { name: "Movies", icon: "fa-solid fa-film", url: "https://movy.sx/" },
    { name: "Discord", icon: "fa-brands fa-discord", url: "https://discord.com/login" },
    { name: "TikTok", icon: "fa-brands fa-tiktok", url: "https://tiktok.com" },
    { name: "ChatGPT", icon: "fa-solid fa-robot", url: "https://chatgpt.com" },
    { name: "Search", icon: "fa-solid fa-magnifying-glass", url: "https://duckduckgo.com" },
    { name: "Youtube", icon: "fa-brands fa-youtube", url: "https://youtube.com" }
];

window.createNewBrowserTab = function(initialUrl = '', internalId = null, internalTitle = null) {
    const tabId = 'tab_' + Date.now();
    const tabTitle = internalTitle || (initialUrl ? 'Loading...' : 'New Tab');
    const tabObj = { id: tabId, title: tabTitle, url: initialUrl, internalId: internalId };
    window.browserTabs.push(tabObj);

    const contentWrapper = document.createElement('div');
    contentWrapper.id = 'proxy-content-' + tabId;
    contentWrapper.className = 'proxy-tab-content';
    contentWrapper.style.display = 'none';

    if (!internalId) {
        const ntp = document.createElement('div');
        ntp.className = 'new-tab-page';
        ntp.style.justifyContent = 'center';
        ntp.style.paddingTop = '0';

        let bmHtml = '';
        ntpBookmarks.forEach(bm => {
            bmHtml += `
                <div class="web-bookmark" onclick="window.launchProxy('${bm.url}', '${tabId}')">
                    <div class="bookmark-circle"><i class="${bm.icon}" style="font-size: 26px; color: #fff;"></i></div>
                    <span>${bm.name}</span>
                </div>
            `;
        });
        
        bmHtml += `
            <div id="custom-ntp-bookmarks-container-${tabId}" style="display: contents;"></div>
            <div class="web-bookmark add-new-btn" onclick="window.openModal('add-bookmark-modal')">
                <div class="bookmark-circle" style="border: 1px dashed var(--text-muted); background: transparent;">
                    <i class="fa-solid fa-plus" style="font-size: 24px; color: var(--text-muted);"></i>
                </div>
                <span style="color: var(--text-muted);">Add New</span>
            </div>
        `;

        ntp.innerHTML = `
            <div style="position: absolute; top: 25px; right: 30px; display: flex; gap: 15px; z-index: 1000;">
                <button class="top-widget" style="position: static; box-shadow: 0 4px 15px rgba(0,0,0,0.3);" onclick="window.openInternalTab('music-modal', 'Music')">MUSIC</button>
                <button class="top-widget" style="position: static; box-shadow: 0 4px 15px rgba(0,0,0,0.3);" onclick="window.openInternalTab('chat-modal', 'Chat')">CHAT</button>
                <button class="top-widget" style="position: static; box-shadow: 0 4px 15px rgba(0,0,0,0.3);" onclick="window.openInternalTab('settings-modal', 'Settings')">SETTINGS</button>
                <button class="top-widget" style="position: static; box-shadow: 0 4px 15px rgba(0,0,0,0.3);" onclick="window.openModal('discord-modal')">DISCORD</button>
            </div>
            <h1 class="ntp-title" style="margin-bottom: 5px; margin-top: -60px;">Hyperion Hub</h1>
            <div class="ntp-search-wrapper" style="display: flex; justify-content: center; align-items: center; gap: 15px; width: 100%; max-width: 700px; margin: 0 auto 15px auto;">
                <div class="search-container" style="flex: 1; margin: 0 !important; position: relative;">
                    <input type="text" class="ntp-search-input" placeholder="Browse the web freely..." autocomplete="off" style="width: 100%; padding: 14px 20px; font-size: 15px; font-family: 'Poppins', sans-serif; background: var(--search-bg); color: var(--text-main); border: 1px solid var(--border-primary); border-radius: 8px; outline: none; box-sizing: border-box; transition: all 0.2s ease;">
                </div>
            </div>
            <div id="ntp-quote-display-${tabId}" style="font-size: 14px; color: var(--text-main); font-style: italic; margin: 0 auto 20px auto; font-weight: 600; text-align: center;"></div>
            <div class="ntp-bookmarks" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 35px; max-width: 800px; margin: 15px auto 0 auto; transform: scale(0.85);">${bmHtml}</div>
        `;

        setTimeout(() => {
            const quoteEl = document.getElementById(`ntp-quote-display-${tabId}`);
            if (quoteEl) {
                quoteEl.innerText = `"${hubQuotes[Math.floor(Math.random() * hubQuotes.length)]}"`;
            }
        }, 0);

        const ntpInput = ntp.querySelector('.ntp-search-input');
        ntpInput.addEventListener('focus', () => { ntpInput.style.borderColor = 'var(--border-hover)'; ntpInput.style.background = 'var(--card-bg)'; });
        ntpInput.addEventListener('blur', () => { ntpInput.style.borderColor = 'var(--border-primary)'; ntpInput.style.background = 'var(--search-bg)'; });

        ntpInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = ntpInput.value.trim();
                if (!query) return;
                if (window.handleHyperionURL(query, tabId)) return;
                
                let finalUrl = '';
                if (query.includes('.') && !query.includes(' ')) {
                    finalUrl = query.startsWith('http') ? query : 'https://' + query;
                } else {
                    finalUrl = searchEngine + encodeURIComponent(query);
                }
                window.launchProxy(finalUrl, tabId);
            }
        });

        const iframe = document.createElement('iframe');
        iframe.id = 'proxy-frame-' + tabId;
        iframe.className = 'proxy-browser-frame';
        iframe.setAttribute('allow', 'autoplay; fullscreen; encrypted-media; picture-in-picture');

        iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms allow-modals allow-pointer-lock allow-orientation-lock allow-downloads');
        
        iframe.style.display = initialUrl ? 'block' : 'none';
        ntp.style.display = initialUrl ? 'none' : 'flex';

        contentWrapper.appendChild(ntp);
        contentWrapper.appendChild(iframe);
        window.attachPanicToFrame(iframe);

        setTimeout(window.renderCustomBookmarks, 0);
    }

    document.getElementById('proxy-frame-wrapper').appendChild(contentWrapper);
    window.renderBrowserTabs();
    window.switchBrowserTab(tabId);

    if (initialUrl && !internalId) {
        window.launchProxy(initialUrl, tabId);
    }
};

window.openInternalTab = function(modalId, title) {
    const existingTab = window.browserTabs.find(t => t.internalId === modalId);
    if (existingTab) {
        window.switchBrowserTab(existingTab.id);
        return;
    }
    window.createNewBrowserTab('', modalId, title);
};
//
window.switchBrowserTab = function(tabId) {
    window.activeTabId = tabId;
    
    const proxyContainer = document.getElementById('proxy-container');
    const homeView = document.getElementById('home-view');
    const gamesView = document.getElementById('games-view');
    
    if(homeView) homeView.style.setProperty('display', 'none', 'important');
    if(gamesView) gamesView.style.setProperty('display', 'none', 'important');
    if(proxyContainer) proxyContainer.style.setProperty('display', 'flex', 'important');
    
    document.documentElement.classList.add('proxy-active');
    document.body.classList.add('proxy-active');
    
    document.querySelectorAll('.proxy-tab-content').forEach(f => f.style.display = 'none');
    
    ['music-modal', 'chat-modal', 'settings-modal', 'discord-modal'].forEach(id => {
        const modal = document.getElementById(id);
        if(modal && modal.classList.contains('modal-as-tab')) {
            modal.classList.remove('modal-as-tab');
            modal.style.display = 'none';
            document.body.appendChild(modal);
        }
    });

    const activeTabObj = window.browserTabs.find(t => t.id === tabId);
    if (!activeTabObj) return;

    const activeContent = document.getElementById('proxy-content-' + tabId);
    if (activeContent) activeContent.style.display = 'flex';

    const urlBar = document.getElementById('proxy-url-bar');
    if (activeTabObj.internalId) {
        const modal = document.getElementById(activeTabObj.internalId);
        if (modal) {
            activeContent.appendChild(modal);
            modal.classList.add('modal-as-tab');
            modal.style.display = 'flex';
            if (activeTabObj.internalId === 'settings-modal') {
                window.updateActiveThemeCard(localStorage.getItem('hyperion_theme') || 'default');
                window.updateActiveEngineCard(localStorage.getItem('proxyEngine') || 'uv');
            }
        }
        if (urlBar) {
            urlBar.value = 'hyperion://' + activeTabObj.title.toLowerCase();
            urlBar.readOnly = false;
        }
    } else {
        if (urlBar) {
            urlBar.readOnly = false;
            urlBar.value = activeTabObj.url || '';
        }
    }

    window.renderBrowserTabs();
};

window.closeBrowserTab = function(tabId, e) {
    if (e) e.stopPropagation();
    
    const tabObj = window.browserTabs.find(t => t.id === tabId);
    if (tabObj && tabObj.internalId) {
        const modal = document.getElementById(tabObj.internalId);
        if (modal) {
            modal.classList.remove('modal-as-tab');
            modal.style.display = 'none';
            document.body.appendChild(modal);
        }
    }

    const content = document.getElementById('proxy-content-' + tabId);
    if (content) content.remove();
    
    window.browserTabs = window.browserTabs.filter(t => t.id !== tabId);
    
    if (window.browserTabs.length === 0) {
        const proxyContainer = document.getElementById('proxy-container');
        if (proxyContainer) proxyContainer.style.setProperty('display', 'none', 'important');
        
        document.documentElement.classList.remove('proxy-active');
        document.body.classList.remove('proxy-active');
        
        window.applyExperienceMode(window.currentMode);
    } else if (window.activeTabId === tabId) {
        window.switchBrowserTab(window.browserTabs[window.browserTabs.length - 1].id);
    } else {
        window.renderBrowserTabs();
    }
};

window.closeAllProxyTabs = function() {
    [...window.browserTabs].forEach(t => window.closeBrowserTab(t.id));
};

let draggedTabId = null;

window.renderBrowserTabs = function() {
    const container = document.getElementById('browser-tab-container');
    if (!container) return;
    container.innerHTML = '';
    
    window.browserTabs.forEach((tab, index) => {
        const btn = document.createElement('div');
        btn.className = 'browser-tab ' + (tab.id === window.activeTabId ? 'active' : '');
        btn.draggable = true;
        
        btn.addEventListener('dragstart', (e) => {
            draggedTabId = tab.id;
            e.dataTransfer.effectAllowed = 'move';
            setTimeout(() => btn.style.opacity = '0.5', 0);
        });
        
        btn.addEventListener('dragover', (e) => {
            e.preventDefault();
            btn.style.borderLeft = '2px solid var(--text-main)';
        });
        
        btn.addEventListener('dragleave', () => {
            btn.style.borderLeft = 'none';
        });
        
        btn.addEventListener('drop', (e) => {
            e.preventDefault();
            btn.style.borderLeft = 'none';
            if (draggedTabId === tab.id) return;
            
            const draggedIdx = window.browserTabs.findIndex(t => t.id === draggedTabId);
            const [removed] = window.browserTabs.splice(draggedIdx, 1);
            window.browserTabs.splice(index, 0, removed);
            window.renderBrowserTabs();
        });
        
        btn.addEventListener('dragend', () => {
            btn.style.opacity = '1';
            document.querySelectorAll('.browser-tab').forEach(t => t.style.borderLeft = 'none');
        });

        btn.onclick = () => window.switchBrowserTab(tab.id);
        
        const titleSpan = document.createElement('span');
        titleSpan.className = 'browser-tab-title';
        titleSpan.id = 'tab-title-' + tab.id;
        titleSpan.innerText = tab.title;

        const closeBtn = document.createElement('button');
        closeBtn.className = 'browser-tab-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = (e) => window.closeBrowserTab(tab.id, e);

        btn.appendChild(titleSpan);
        btn.appendChild(closeBtn);
        container.appendChild(btn);
    });
};

function startUrlSync() {
    const searchBox = document.querySelector('input[placeholder="Browse the web freely..."]') || document.querySelector('input');
    const proxyContainer = document.getElementById('proxy-container');

    setInterval(() => {
        try {
            if (!proxyContainer || proxyContainer.style.display === 'none') return;
            const activeTabObj = window.browserTabs.find(t => t.id === window.activeTabId);
            if (!activeTabObj || activeTabObj.internalId) return;

            const activeFrame = document.getElementById('proxy-frame-' + window.activeTabId);
            if (!activeFrame || !activeFrame.contentWindow) return;
            if (activeFrame.style.display === 'none') return;

            if (document.activeElement === searchBox) return;

            const cw = activeFrame.contentWindow;
            let currentUrl = '';

            try {
                const doc = activeFrame.contentDocument || cw.document;
                if (doc) {
                    const titleEl = document.getElementById('tab-title-' + window.activeTabId);
                    if (titleEl && doc.title && titleEl.innerText !== doc.title) {
                        titleEl.innerText = doc.title;
                        activeTabObj.title = doc.title;
                    }
                }
            } catch (crossOriginError) {}

            if (cw.__uv$location && cw.__uv$location.href) {
                currentUrl = cw.__uv$location.href;
            } else if (cw.$scramjet?.location?.href) {
                currentUrl = cw.$scramjet.location.href;
            } else if (cw.location && cw.location.href) {
                const raw = cw.location.href;
                const uvPrefix = window.__uv$config?.prefix || '/uv/service/';
                const sjPrefix = window.__scramjet$config?.prefix || '/scramjet/';
                
                if (raw.includes(uvPrefix)) {
                    const encodedPart = raw.split(uvPrefix)[1];
                    if (encodedPart) currentUrl = window.__uv$config?.decodeUrl ? window.__uv$config.decodeUrl(encodedPart) : decodeUV(encodedPart);
                } else if (raw.includes(sjPrefix)) {
                    const pathAfterPrefix = raw.split(sjPrefix)[1];
                    if (pathAfterPrefix) {
                        const parts = pathAfterPrefix.split('/');
                        const encodedPart = parts.length >= 3 ? parts.slice(2).join('/') : pathAfterPrefix;
                        currentUrl = window.__scramjet$config?.codec?.decode ? window.__scramjet$config.codec.decode(encodedPart) : decodeURIComponent(encodedPart);
                    }
                } else {
                    currentUrl = raw;
                }
            }

            if (!currentUrl || currentUrl === 'about:blank' || currentUrl.endsWith('/service/')) return;

            const urlBar = document.getElementById('proxy-url-bar');
            if (urlBar && document.activeElement !== urlBar && urlBar.value !== currentUrl) {
                urlBar.value = currentUrl;
            }
        } catch (err) {}
    }, 500);
}

function encodeUV(str) {
    if (!str) return str;
    return encodeURIComponent(str.toString().split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join(''));
}

function decodeUV(str) {
    if (!str) return str;
    const [input, ...search] = str.split('?');
    let decoded = decodeURIComponent(input).split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join('');
    return decoded + (search.length ? '?' + search.join('?') : '');
}

window.launchProxy = async function(targetUrl, targetTabId = window.activeTabId) {
    const now = Date.now();
    if (window.__lastLaunchUrl === targetUrl && now - (window.__lastLaunchTime || 0) < 400) {
        return;
    }
    window.__lastLaunchUrl = targetUrl;
    window.__lastLaunchTime = now;

    if (!window.proxyReady && window.proxyReadyPromise) {
        window.showPS5Notification("Initializing Proxy", "Connecting to server, launching in a moment...", 3500);
        await Promise.race([
            window.proxyReadyPromise,
            new Promise(resolve => setTimeout(resolve, 10000))
        ]).catch(() => {});
        window.proxyReady = true;
    }

    const proxyContainer = document.getElementById('proxy-container');
    const isHidden = proxyContainer && proxyContainer.style.display === 'none';

    if (window.browserTabs.length === 0 || isHidden) {
        window.__lastLaunchTime = 0; 
        window.createNewBrowserTab(targetUrl);
        return;
    }

    const timeout = setTimeout(() => {
        window.logTelemetryError({ type: 'proxy_timeout', message: 'Server took over 7s to respond', targetUrl, source: 'launchProxy' });
        window.showPS5Notification("Proxy Slow", "Server taking long to respond. Try switching engines or clear cache in Settings.", 6000);
    }, 7000);

    try {
        const activeFrame = document.getElementById('proxy-frame-' + targetTabId);
        const tabContent = document.getElementById('proxy-content-' + targetTabId);
        if (!activeFrame || !tabContent) {
            clearTimeout(timeout);
            return;
        }

        const ntp = tabContent.querySelector('.new-tab-page');
        if (ntp) ntp.style.display = 'none';
        activeFrame.style.display = 'block';

        let currentEngine = localStorage.getItem('proxyEngine') || 'scramjet';

        targetUrl = targetUrl.replace(/^https?:\/\/(www\.)?discord\.gg\/+/i, 'https://discord.com/invite/');
        const isDiscord = targetUrl.toLowerCase().includes('discord.com') || targetUrl.toLowerCase().includes('discord.gg');
        if (isDiscord) {
            currentEngine = 'uv';
        }

        if (currentEngine === 'scramjet' && !window.scramjetController) {
            window.logTelemetryError({ type: 'scramjet_auto_fallback', message: 'Scramjet failed to load, falling back to UV', source: 'launchProxy' });
            currentEngine = 'uv';
        }

        if (proxyContainer) proxyContainer.style.setProperty('display', 'flex', 'important');
        document.body.classList.add('proxy-active');
        
        if (currentEngine === 'uv') {
            const prefix = window.__uv$config?.prefix || '/uv/service/';
            const encodedUrl = window.__uv$config?.encodeUrl ? window.__uv$config.encodeUrl(targetUrl) : encodeUV(targetUrl);
            activeFrame.src = prefix + encodedUrl;
        } else {
            let sjFrame = activeFrame.__sjFrame;
            
            if (sjFrame && sjFrame.controller !== window.scramjetController) {
                sjFrame = null;
            }

            if (!sjFrame && window.scramjetController) {
                sjFrame = window.scramjetController.createFrame(activeFrame);
                activeFrame.__sjFrame = sjFrame;
            }

            if (sjFrame) {
                if (navigator.serviceWorker.controller && window.scramjetController.serviceWorkerController !== navigator.serviceWorker.controller) {
                    window.scramjetController.serviceWorkerController = navigator.serviceWorker.controller;
                    try { window.scramjetController.setupMessagePort(); } catch(e) {}
                }
                
                sjFrame.go(targetUrl);
            } else {
                window.logTelemetryError({ type: 'proxy_engine_failure', engine: 'scramjet', message: 'Controller null during launch attempt', source: 'launchProxy' });
                window.showPS5Notification("Proxy Error", "Engine failed to start. Switch to Ultraviolet in Settings.", 6000);
                activeFrame.src = 'about:blank';
            }
        }

        activeFrame.onload = () => clearTimeout(timeout);
    } catch (err) {
        clearTimeout(timeout);
        window.logTelemetryError({ type: 'proxy_connection_failure', message: String(err), source: 'launchProxy' });
        window.showPS5Notification("Proxy Error", "Connection failed. Reset cache in Settings.", 6000);
        window.attachPanicToFrame(document.getElementById('proxy-frame-' + targetTabId));
    }
};

window.fixProxyCache = async function() {
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let reg of registrations) {
            await reg.unregister();
        }
    }
    if (window.caches) {
        const names = await caches.keys();
        for (let name of names) {
            await caches.delete(name);
        }
    }
    localStorage.removeItem('baremux_transport');
    window.location.reload();
};

window.forceAppUpdate = async function() {
    const confirmed = confirm(
        "Force update/Delete local data\n\n" +
        "This will wipe your local storage and reset your site settings to pull the newest version.\n\n" +
        "Any unexported game saves in the transferrer will be lost.\n\n" +
        "Are you sure you want to continue?"
    );

    if (!confirmed) return;

    if (typeof window.showPS5Notification === 'function') {
        window.showPS5Notification("Updating App", "Clearing local data and reloading...", 4000);
    }

    try {
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
                await registration.unregister();
            }
        }

        if (window.caches) {
            const cacheKeys = await caches.keys();
            for (const key of cacheKeys) {
                await caches.delete(key);
            }
        }

        if (window.indexedDB && indexedDB.databases) {
            try {
                const dbs = await indexedDB.databases();
                for (const db of dbs) {
                    if (db.name) {
                        indexedDB.deleteDatabase(db.name);
                    }
                }
            } catch (idbErr) {}
        }

        localStorage.clear();
        sessionStorage.clear();

        const cleanOrigin = window.location.origin + window.location.pathname;
        window.location.replace(`${cleanOrigin}?update_ts=${Date.now()}`);
    } catch (err) {
        window.location.reload();
    }
};

window.bareMuxConn = null;
window.scramjetController = null;
window.proxyReadyPromise = null;

async function testWebSocket(url, timeoutMs = 2500) {
    return new Promise((resolve) => {
        let ws;
        try {
            ws = new WebSocket(url);
        } catch (e) {
            return resolve(false);
        }
        const timer = setTimeout(() => {
            if (ws.readyState !== WebSocket.CLOSED) ws.close();
            resolve(false);
        }, timeoutMs);

        ws.onopen = () => {
            clearTimeout(timer);
            ws.close();
            resolve(true);
        };
        ws.onerror = () => {
            clearTimeout(timer);
            resolve(false);
        };
    });
}

async function verifyProxyAssets() {
    const criticalAssets = [
        { path: '/net/index.js', desc: 'BareMux Library' },
        { path: '/net/worker.js', desc: 'BareMux Worker' },
        { path: '/base/index.mjs', desc: 'Epoxy Transport Module' },
        { path: '/modules/core.js', desc: 'Ultraviolet Core Bundle' },
        { path: '/modules/settings.js', desc: 'Ultraviolet Config' },
        { path: '/modules/handler.js', desc: 'Ultraviolet Handler' },
        { path: '/modules/client.js', desc: 'Ultraviolet Client Injection' },
        { path: '/modules/worker.js', desc: 'Ultraviolet SW File' },
        { path: '/metrics/bundle.js', desc: 'Scramjet Core Bundle' },
        { path: '/metrics/cache.wasm', desc: 'Scramjet WebAssembly Binary' },
        { path: '/config.js', desc: 'Scramjet Config' },
        { path: '/sw.js', desc: 'Root Service Worker' },
        { path: '/libs/shield.js', desc: 'Stealth Adblock Engine' }
    ];

    console.groupCollapsed('%c[Stealth Audit] Checking renamed proxy assets...', 'color: #4cc9f0; font-weight: bold;');
    
    let hasFailures = false;

    await Promise.all(criticalAssets.map(async (asset) => {
        try {
            const res = await fetch(asset.path, { method: 'HEAD' });
            if (!res.ok) {
                hasFailures = true;
                console.error(`❌ [Missing/Misnamed]: ${asset.desc} at "${asset.path}" returned HTTP ${res.status} (${res.statusText})`);
                if (typeof window.logTelemetryError === 'function') {
                    window.logTelemetryError({
                        type: 'missing_asset',
                        message: `Asset returned HTTP ${res.status}: ${asset.path}`,
                        source: 'verifyProxyAssets'
                    });
                }
            } else {
                console.log(`✅ [Verified]: ${asset.desc} found at "${asset.path}"`);
            }
        } catch (err) {
            hasFailures = true;
            console.error(`❌ [Network Block/Error]: Cannot reach ${asset.desc} at "${asset.path}". Details:`, err);
        }
    }));

    const namespaceChecks = [
        { name: 'BareMux', exists: typeof window.BareMux !== 'undefined', file: '/net/index.js' },
        { name: 'Ultraviolet', exists: typeof window.Ultraviolet !== 'undefined', file: '/modules/core.js' },
        { name: '__uv$config', exists: typeof window.__uv$config !== 'undefined', file: '/modules/settings.js' },
        { name: '__scramjet$config', exists: typeof window.__scramjet$config !== 'undefined', file: '/config.js' },
        { name: '$scramjet', exists: typeof window.$scramjet !== 'undefined', file: '/metrics/bundle.js' },
        { name: '$scramjetController', exists: typeof window.$scramjetController !== 'undefined', file: '/metrics/bundle.js' }
    ];

    namespaceChecks.forEach(check => {
        if (!check.exists) {
            hasFailures = true;
            console.error(`[Namespace Missing]: window.${check.name} is undefined. Check syntax or export in ${check.file}`);
        } else {
            console.log(`[Namespace Ready]: window.${check.name} initialized`);
        }
    });

    if (!hasFailures) {
        console.log('%call 12 renamed assets and namespaces verified', 'color: #22c55e; font-weight: bold;');
    } else {
        console.warn('%one or more assets failed verification', 'color: #f59e0b; font-weight: bold;');
    }
    
    console.groupEnd();
}

async function initProxy() {
    if (!Object.getOwnPropertyDescriptor(Response.prototype, 'rawHeaders')) {
        Object.defineProperty(Response.prototype, 'rawHeaders', {
            get() { return [...this.headers]; }
        });
    }

    verifyProxyAssets().catch(() => {});

    try {
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (let reg of registrations) {
                if (reg.active && reg.active.scriptURL.includes('worker.js')) {
                    await reg.unregister();
                }
            }
            localStorage.removeItem('bare-mux-path');

            const reg = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
                updateViaCache: 'none'
            });
            reg.update().catch(() => {});

            if (reg.installing) {
                await Promise.race([
                    new Promise(resolve => {
                        reg.installing.addEventListener('statechange', (e) => {
                            if (e.target.state === 'activated' || e.target.state === 'redundant') resolve();
                        });
                    }),
                    new Promise(resolve => setTimeout(resolve, 2000))
                ]);
            }

            const readyReg = await navigator.serviceWorker.ready;
            if (!navigator.serviceWorker.controller) {
                await new Promise(resolve => {
                    const onCtrl = () => {
                        navigator.serviceWorker.removeEventListener('controllerchange', onCtrl);
                        resolve();
                    };
                    navigator.serviceWorker.addEventListener('controllerchange', onCtrl);
                    setTimeout(resolve, 2000);
                });
            }
            
            const activeSw = navigator.serviceWorker.controller || readyReg.active || reg.active;
            if (activeSw) {
                activeSw.postMessage({ type: 'warmup' });
            }

            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wispUrl = `${protocol}//${window.location.host}/server/`;
            const httpFallbackUrl = "https://bare-fallback.cupcakemonkey445.workers.dev/";
            
            let useLibcurl = (localStorage.getItem('transportEngine') || 'libcurl') === 'libcurl';

            if (typeof BareMux !== 'undefined' && !window.bareMuxConn) {
                window.bareMuxConn = new BareMux.BareMuxConnection("/net/worker.js");

                let retries = 2;
                let wispConnected = false;

                while (retries > 0 && !wispConnected) {
                    try {
                        await new Promise((resolve, reject) => {
                            const ws = new WebSocket(wispUrl);
                            const timer = setTimeout(() => { ws.close(); reject(new Error("Ping Timeout")); }, 3500);
                            ws.onerror = () => { clearTimeout(timer); reject(new Error("Blocked by Client")); };
                            ws.onopen = () => { clearTimeout(timer); ws.close(); resolve(); };
                        });

                        window.currentTransport = 'wisp';
                        wispConnected = true;
                        console.log("[Proxy] Wisp connection established! Using", useLibcurl ? "Libcurl" : "Epoxy");

                        await window.bareMuxConn.setTransport(
                            useLibcurl ? "/libcurl/wrapper.mjs" : "/base/index.mjs",
                            [{ wisp: wispUrl, websocket: wispUrl }]
                        ).catch(() => {});
                    } catch (err) {
                        retries--;
                        if (retries === 0) {
                            console.warn("[Proxy] WSS persistently blocked. Engaging HTTP Shield fallback.");
                            useLibcurl = false;
                            try {
                                await window.bareMuxConn.setTransport("/baremod/engine.mjs", [httpFallbackUrl]);
                                window.currentTransport = 'bare-http';
                                console.log("[Proxy] Baseline HTTP Shield engaged.");
                            } catch (fallbackErr) {
                                console.warn("[Proxy] HTTP Shield missing.");
                            }
                        }
                    }
                }

                if (!window.__networkMonitor) {
                    window.__networkMonitor = setInterval(() => {
                        if (navigator.serviceWorker.controller) {
                            navigator.serviceWorker.controller.postMessage({ type: 'keep-alive' });
                        }
                    }, 25000); 
                }
            }

            if (window.$scramjetController && !window.scramjetInitialized) {
                try {
                    const { Controller, config } = window.$scramjetController;
                    config.prefix = '/scramjet/';
                    config.injectPath = '/metrics/inject.js';
                    config.wasmPath = '/metrics/cache.wasm';
                    config.scramjetPath = '/metrics/bundle.js';

                    if (window.__scramjet$config?.codec) {
                        config.codec = window.__scramjet$config.codec;
                    }

                    let activeTransport = null;
                    const runtimeImport = new Function('p', 'return imp' + 'ort(p)');
                    
                    if (window.currentTransport === 'wisp') {
                        if (useLibcurl) {
                            let LClass = window.LibcurlClient || window.LibcurlTransport?.LibcurlClient || window.LibcurlTransport?.default;
                            if (!LClass) {
                                try {
                                    const mod = await runtimeImport('/libcurl/wrapper.mjs');
                                    LClass = mod.default || mod.LibcurlClient;
                                } catch (e) {}
                            }
                            if (typeof LClass === 'function') {
                                activeTransport = new LClass({ wisp: wispUrl, websocket: wispUrl, connections: [20, 15, 2] });
                            }
                        } else {
                            let EClass = window.EpxMod?.EpoxyTransport || window.EpxMod?.default;
                            if (!EClass) {
                                try {
                                    const mod = await runtimeImport('/base/index.mjs');
                                    EClass = mod.default || mod.EpoxyTransport || mod.EpoxyClient;
                                } catch (e) {}
                            }
                            if (typeof EClass === 'object' && EClass !== null) {
                                EClass = EClass.default || EClass.EpoxyTransport || EClass.EpoxyClient;
                            }
                            if (typeof EClass === 'function') {
                                activeTransport = new EClass({ wisp: wispUrl, websocket: wispUrl });
                            }
                        }
                    } else if (window.currentTransport === 'bare-http') {
                        if (typeof window.BareClient !== 'undefined') {
                            activeTransport = new window.BareClient(httpFallbackUrl);
                        } else if (window.bare && window.bare.BareClient) {
                            activeTransport = new window.bare.BareClient(httpFallbackUrl);
                        } else {
                            try {
                                const mod = await runtimeImport('/baremod/engine.mjs');
                                const BClass = mod.BareClient || mod.default?.BareClient || mod.default;
                                if (typeof BClass === 'function') {
                                    activeTransport = new BClass(httpFallbackUrl);
                                }
                            } catch (e) {}
                        }
                    }

                    if (activeTransport) {
                        const transportAdapter = {
                            init: async () => {
                                if (typeof activeTransport.init === 'function') await activeTransport.init();
                            },
                            async request(remote, method, body, headers, redirect) {
                                if (activeTransport.ready === false && typeof activeTransport.init === 'function') {
                                    await activeTransport.init();
                                }
                                let res;
                                try {
                                    res = await activeTransport.request(remote, method, body, headers, redirect);
                                } catch (reqErr) {
                                    if (String(remote).includes("generate_204")) {
                                        return { status: 200, statusText: "OK", headers: [["content-length", "0"]], rawHeaders: [["content-length", "0"]], body: new Uint8Array(0) };
                                    }
                                    try {
                                        await new Promise(r => setTimeout(r, 150));
                                        res = await activeTransport.request(remote, method, body, headers, redirect);
                                    } catch (retryErr) {
                                        return { status: 502, statusText: "Bad Gateway", headers: [["content-length", "0"]], rawHeaders: [["content-length", "0"]], body: new Uint8Array(0) };
                                    }
                                }
                                if (res && res.headers && !Array.isArray(res.headers)) {
                                    res.headers = typeof res.headers.entries === 'function'
                                        ? [...res.headers.entries()]
                                        : Object.entries(res.headers);
                                }
                                if (res && !res.rawHeaders && res.headers) {
                                    res.rawHeaders = res.headers;
                                }
                                return res;
                            },
                            connect(url, protocols, requestHeaders, onopen, onmessage, onclose, onerror) {
                                if (typeof activeTransport.connect === 'function') {
                                    return activeTransport.connect(url, protocols, requestHeaders, onopen, onmessage, onclose, onerror);
                                }
                            }
                        };
                        
                        window.scramjetController = new Controller({
                            serviceworker: activeSw,
                            transport: transportAdapter,
                            scramjetConfig: { flags: { sourcemaps: false, scramitize: false } }
                        });

                        window.scramjetController.guardServiceWorkerRevive = false;
                        await Promise.race([
                            window.scramjetController.wait(),
                            new Promise(r => setTimeout(r, 2000))
                        ]);
                        console.log("Scramjet v2 Controller Connected via RPC");
                        window.scramjetInitialized = true;
                    }
                } catch (err) {
                    console.error("Scramjet Init Error:", err);
                }
            }
            window.proxyReady = true;
            startUrlSync();
        }
    } catch (err) {
        window.logTelemetryError({ type: 'proxy_init_failure', message: err.message || String(err), source: 'initProxy' });
    }
}

window.proxyReady = false;
if (localStorage.getItem('hyperion_auth') === 'true' && !isBot) {
    window.proxyReadyPromise = initProxy()
        .catch(e => console.error("Proxy Init Failed:", e))
        .finally(() => { window.proxyReady = true; });
} else {
    window.proxyReady = true;
    window.proxyReadyPromise = Promise.resolve();
}

let currentRoom = "public";
let isHost = false;
let lastMessageTime = 0;
let currentUnsubscribe = null;
let currentRoomListener = null;

let myOwnedRooms = JSON.parse(localStorage.getItem('my_owned_rooms') || '[]');
let joinedRooms = JSON.parse(localStorage.getItem('joined_rooms') || '[]');
let activeRoomUsers = new Set();
let deletionTimers = {};
let currentSettingsRoom = null;

const PROFANITY = ["badword1", "badword2"]; 
const URL_REGEX = new RegExp('https?:\\/\\/[^\\s]+|[a-zA-Z0-9-]+\\.[a-z]{2,}', 'gi');

window.saveRooms = function() {
    localStorage.setItem('my_owned_rooms', JSON.stringify(myOwnedRooms));
    localStorage.setItem('joined_rooms', JSON.stringify(joinedRooms));
    window.updateRoomDropdown();
};

window.updateRoomDropdown = function() {
    const select = document.getElementById('mini-chat-room-select');
    if(!select) return;
    const currentVal = currentRoom;
    select.innerHTML = '<option value="public">Global Chat</option>';
    myOwnedRooms.forEach(id => { select.innerHTML += `<option value="${id}"># room-${id.toLowerCase()}</option>`; });
    joinedRooms.forEach(id => { select.innerHTML += `<option value="${id}"># room-${id.toLowerCase()}</option>`; });
    select.value = currentVal;
};

window.censorText = function(text) {
    if (!profanityEnabled || !text) return text;
    let clean = text;
    const filters = [
        { regex: /n+[\s\W_]*[i1l|!]+[\s\W_]*g+[\s\W_]*g*[\s\W_]*[e3]+[\s\W_]*r+s*/gi, replacement: "ni**er" },
        { regex: /n+[\s\W_]*[i1l|!]+[\s\W_]*g+[\s\W_]*g*[\s\W_]*[a4]+[\s\W_]*s*/gi, replacement: "ni**a" },
        { regex: /n+[\s\W_]*[e3]+[\s\W_]*g+[\s\W_]*g*[\s\W_]*[e3]+[\s\W_]*r+s*/gi, replacement: "ne**er" },
        { regex: /n+[\s\W_]*[e3]+[\s\W_]*g+[\s\W_]*g*[\s\W_]*[a4]+[\s\W_]*s*/gi, replacement: "ne**a" },
        { regex: /f+[\s\W_]*[a4@]+[\s\W_]*g+[\s\W_]*g*[\s\W_]*[o0i1]+[\s\W_]*t*s*/gi, replacement: "fa**ot" },
        { regex: /r+[\s\W_]*[e3]+[\s\W_]*t+[\s\W_]*[a4@]+[\s\W_]*r+[\s\W_]*d+s*/gi, replacement: "re**rd" },
        { regex: /f+[\s\W_]*[u*x]+[\s\W_]*c+[\s\W_]*k+s*|f+[\s\W_]*u+[\s\W_]*q+/gi, replacement: "f**k" },
        { regex: /b+[\s\W_]*[i1|!]+[\s\W_]*t+[\s\W_]*c+[\s\W_]*h+e*s*/gi, replacement: "b**ch" },
        { regex: /s+[\s\W_]*h+[\s\W_]*[i1|!]+[\s\W_]*t+s*/gi, replacement: "s**t" },
        { regex: /\b(c+[\s\W_]*[u*]+[\s\W_]*n+[\s\W_]*t+s*)\b/gi, replacement: "c**t" },
        { regex: /\b(d+[\s\W_]*[i1]+[\s\W_]*c+[\s\W_]*k+s*|d+[\s\W_]*[i1]+[\s\W_]*h+)\b/gi, replacement: "d**k" },
        { regex: /\b(c+[\s\W_]*[o0]+[\s\W_]*c+[\s\W_]*k+s*)\b/gi, replacement: "c**k" },
        { regex: /\b(p+[\s\W_]*u+[\s\W_]*s+[\s\W_]*s+[\s\W_]*y+)\b/gi, replacement: "p***y" },
        { regex: /\b(w+[\s\W_]*h+[\s\W_]*[o0]+[\s\W_]*r+[\s\W_]*e+s*|s+[\s\W_]*l+[\s\W_]*u+[\s\W_]*t+s*)\b/gi, replacement: "****" }
    ];
    filters.forEach(item => { clean = clean.replace(item.regex, item.replacement); });
    return clean;
};

window.pendingPfpBase64 = "";

window.promptGifEmbed = function() {
    const url = prompt("Input a Giphy or Klipy GIF link here:");
    if (!url) return;
    const safeDomains = /(giphy\.com|klipy\.com|klipy\.co)/i;
    if (!safeDomains.test(url)) {
        return window.showPS5Notification("Blocked", "Only Giphy and Klipy links are allowed for safety reasons", 5000);
    }
    
    const inputId = document.getElementById('full-chat-messages') && document.getElementById('chat-modal').style.display !== 'none' 
        ? 'full-chat-input' 
        : 'mini-chat-input';
        
    window.insertAtCursor(inputId, ` ${url} `);
};

window.handlePfpUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return window.showPS5Notification('Error', 'Must be an image file.', 4000);
    if (file.size > 5 * 1024 * 1024) return window.showPS5Notification('Error', 'Image must be under 5MB.', 4000);
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const maxSize = 128;
            let width = img.width;
            let height = img.height;
            
            if (width > height) {
                if (width > maxSize) { height *= maxSize / width; width = maxSize; }
            } else {
                if (height > maxSize) { width *= maxSize / height; height = maxSize; }
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            const base64Str = canvas.toDataURL('image/jpeg', 0.8);
            
            document.getElementById('pfp-preview').src = base64Str;
            document.getElementById('pfp-preview').style.display = 'block';
            document.getElementById('pfp-dropzone-text').innerText = "Image Ready";
            window.pendingPfpBase64 = base64Str; 
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

window.handleChatImageUpload = function(event, mode) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        event.target.value = '';
        return window.showPS5Notification('Error', 'Must be an image file.', 4000);
    }
    if (file.size > 10 * 1024 * 1024) {
        event.target.value = '';
        return window.showPS5Notification('Error', 'Image must be under 10MB.', 4000);
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const maxSize = 400; 
            let width = img.width;
            let height = img.height;
            
            if (width > height) {
                if (width > maxSize) { height *= maxSize / width; width = maxSize; }
            } else {
                if (height > maxSize) { width *= maxSize / height; height = maxSize; }
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            const base64Str = canvas.toDataURL('image/jpeg', 0.85);
            window.attachGif(base64Str, mode);
            event.target.value = ''; 
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

window.removePfp = function() {
    window.pendingPfpBase64 = "";
    document.getElementById('pfp-preview').style.display = 'none';
    document.getElementById('pfp-preview').src = "";
    document.getElementById('pfp-dropzone-text').innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Upload Image';
    document.getElementById('pfp-file-input').value = "";
};

window.updateMyKeysUI = function() {
    const list = document.getElementById('my-keys-list');
    if(!list) return;
    
    const keysToRemove = [];
    let pendingChecks = myOwnedRooms.length;

    if (pendingChecks === 0) {
        list.innerHTML = '<div class="empty-keys">No chatrooms made! Click on Create Room to make one!</div>';
        return;
    }

    myOwnedRooms.forEach(key => {
        get(ref(db, `rooms/${key}/info`)).then(snap => {
            if (!snap.exists()) keysToRemove.push(key);
            
            pendingChecks--;
            if (pendingChecks === 0) {
                if (keysToRemove.length > 0) {
                    myOwnedRooms = myOwnedRooms.filter(k => !keysToRemove.includes(k));
                    window.saveRooms();
                }

                list.innerHTML = '';
                if(myOwnedRooms.length === 0) {
                    list.innerHTML = '<div class="empty-keys">No chatrooms made! Click on Create Room to make one!</div>';
                    return;
                }
                
                myOwnedRooms.forEach(validKey => {
                    const item = document.createElement('div');
                    item.className = 'my-key-item';
                    item.innerHTML = `<span># room-${validKey.toLowerCase()}</span><span style="color:#fcd34d; font-family:monospace; font-weight:bold;">${validKey}</span>`;
                    list.appendChild(item);
                });
            }
        });
    });
};

window.executeKick = function(userToKick) {
    if(!currentSettingsRoom) return;
    const safeKey = userToKick.toLowerCase().replace(/[.#$\[\]]/g, "_");
    set(ref(db, `rooms/${currentSettingsRoom}/banned/${safeKey}`), true);
    document.getElementById('room-settings-menu').style.display = 'none';
};

window.executeDelete = function(roomId) {
    const menu = document.getElementById('room-settings-menu');
    if(menu && menu.parentNode) {
        document.body.appendChild(menu);
        menu.style.display = 'none';
    }
    set(ref(db, `rooms/${roomId}`), null);
    set(ref(db, `public_rooms/${roomId}`), null); 
};

window.deleteMessage = function(msgId) {
    const isOwner = auth.currentUser && auth.currentUser.uid === "9Pi7EBEFOSZjLlrbved0adovXdM2";
    if (isOwner) {
        set(ref(db, `rooms/${currentRoom}/messages/${msgId}`), null);
    }
};

window.sanitize = function(text) {
    const urlCheck = /https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.[a-z]{2,}/gi;
    const safeDomains = /(giphy\.com|klipy\.com|klipy\.co)/i;
    
    const links = text.match(urlCheck);
    if (links) {
        const allSafe = links.every(link => safeDomains.test(link));
        if (!allSafe) return { valid: false, err: "Links blocked. Only Giphy and Klipy GIF links are allowed." };
    }
    
    return { valid: true, text: text };
};

const hubQuotes = [
    "Awesome website I'm making check it out: http://localhost:3000",
    "Math and astrology REALLY sucks went from an A to a D",
    "Found a unblocked link for a fast search, it's google.com",
    "ECM fix the music section already...",
    "AP Spanish is going to be the absolute end of me",
    "The current heat is no joke",
    "Ew I found this trash site called hyperion hub",
    "You know you can change game providers right?",
    "We have a proxy btw",
    "Can't wait for winter hope my winter people agree with me",
    "BOO it's spooky season",
    "Happy halloween!",
    "The F students are the inventors",
    "Anyone else play roblox?, no just me?",
    "Join the DlSC0RD!"
];

window.refreshHubQuote = function() {
    const quoteEl = document.getElementById('hub-quote-display');
    if (quoteEl) {
        quoteEl.innerText = `"${hubQuotes[Math.floor(Math.random() * hubQuotes.length)]}"`;
    }
};

window.favGifs = JSON.parse(localStorage.getItem('hyperion_fav_gifs') || '[]');
window.recentGifs = JSON.parse(localStorage.getItem('hyperion_recent_gifs') || '[]');

window.toggleGifFav = function(e, url) {
    e.stopPropagation(); 
    if (window.favGifs.includes(url)) {
        window.favGifs = window.favGifs.filter(g => g !== url);
        e.currentTarget.classList.remove('active');
        e.currentTarget.innerHTML = '<i class="fa-regular fa-star"></i>';
    } else {
        window.favGifs.push(url);
        e.currentTarget.classList.add('active');
        e.currentTarget.innerHTML = '<i class="fa-solid fa-star"></i>';
    }
    localStorage.setItem('hyperion_fav_gifs', JSON.stringify(window.favGifs));
};

window.addRecentGif = function(url) {
    window.recentGifs = window.recentGifs.filter(g => g !== url);
    window.recentGifs.unshift(url);
    if (window.recentGifs.length > 20) window.recentGifs.pop();
    localStorage.setItem('hyperion_recent_gifs', JSON.stringify(window.recentGifs));
};

window.toggleGifPicker = function(e, mode) {
    e.stopPropagation();
    const container = document.getElementById(`${mode}-gif-picker-container`);
    const btn = e.currentTarget || e.target.closest('button');
    if (!container || !btn) return;

    if (container.style.display === 'flex' || container.style.display === 'block') {
        container.style.display = 'none';
        return;
    }

    const emojiContainer = document.getElementById(`${mode}-emoji-picker-container`);
    if (emojiContainer) emojiContainer.style.display = 'none';

    document.body.appendChild(container); 
    
    container.style.display = 'flex';
    container.style.padding = '0'; 
    container.style.position = 'fixed';
    container.style.zIndex = '2147483647'; 
    
    const isFull = mode === 'full';
    container.style.width = isFull ? '450px' : '320px'; 
    container.style.height = isFull ? '450px' : '350px';

    const btnRect = btn.getBoundingClientRect();
    if (isFull) {
        container.style.bottom = `${window.innerHeight - btnRect.top + 10}px`;
        container.style.left = `${btnRect.left}px`;
        container.style.right = 'auto';
    } else {
        container.style.bottom = `${window.innerHeight - btnRect.top + 10}px`;
        container.style.right = `${window.innerWidth - btnRect.right}px`;
        container.style.left = 'auto';
    }

    window.renderGifPickerUI(mode, 'trending', '');
};

window.renderGifPickerUI = async function(mode, tab, query) {
    const container = document.getElementById(`${mode}-gif-picker-container`);
    if (!container) return;

    let html = `
        <div class="discord-emoji-picker">
            <div class="dep-header">
                <div class="dep-search-wrap">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="${mode}-gif-search-input" class="dep-search-input" placeholder="Search Giphy" autocomplete="off" value="${window.escapeHTML(query)}">
                </div>
                <div class="dgp-tabs">
                    <button class="dgp-tab ${tab === 'trending' ? 'active' : ''}" onclick="event.stopPropagation(); window.renderGifPickerUI('${mode}', 'trending', document.getElementById('${mode}-gif-search-input').value)">Trending</button>
                    <button class="dgp-tab ${tab === 'favorites' ? 'active' : ''}" onclick="event.stopPropagation(); window.renderGifPickerUI('${mode}', 'favorites', '')">Favorites</button>
                    <button class="dgp-tab ${tab === 'recent' ? 'active' : ''}" onclick="event.stopPropagation(); window.renderGifPickerUI('${mode}', 'recent', '')">Recent</button>
                </div>
            </div>
            <div class="dgp-body" id="${mode}-gif-results">
                <div style="color:var(--text-muted); text-align:center; padding:20px; font-size:12px; font-family:'Poppins', sans-serif;">Loading...</div>
            </div>
        </div>
    `;
    container.innerHTML = html;

    const searchInput = document.getElementById(`${mode}-gif-search-input`);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            window.renderGifPickerUI(mode, 'trending', searchInput.value.trim());
        }
    });
    if (query) searchInput.focus();

    const resultsContainer = document.getElementById(`${mode}-gif-results`);
    let gifsToRender = [];

    if (tab === 'favorites') {
        gifsToRender = window.favGifs.map(url => ({ full: url, small: url }));
        window.renderGifGrid(gifsToRender, resultsContainer, mode);
    } else if (tab === 'recent') {
        gifsToRender = window.recentGifs.map(url => ({ full: url, small: url }));
        window.renderGifGrid(gifsToRender, resultsContainer, mode);
    } else {
        const GIPHY_API_KEY = "iQyIdpWBHBC7mqP8Edkiu32a0P0TIf0W"; 
        const endpoint = query === '' 
            ? `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=30&rating=pg-13`
            : `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=30&rating=pg-13`;

        try {
            let res = await fetch(endpoint);
            if (!res.ok) throw new Error('Blocked');
            let data = await res.json();
            
            if (data && data.data) {
                gifsToRender = data.data.map(g => ({
                    small: g.images.fixed_width.url, 
                    full: g.images.original.url
                }));
            }
            window.renderGifGrid(gifsToRender, resultsContainer, mode);
        } catch (err) {
            const prefix = window.__uv$config?.prefix || '/uv/service/';
            const proxyUrl = prefix + (window.__uv$config?.encodeUrl ? window.__uv$config.encodeUrl(endpoint) : encodeURIComponent(endpoint));
            try {
                let proxyRes = await fetch(proxyUrl);
                let data = await proxyRes.json();
                if (data && data.data) {
                    gifsToRender = data.data.map(g => ({
                        small: g.images.fixed_width.url,
                        full: g.images.original.url
                    }));
                }
                window.renderGifGrid(gifsToRender, resultsContainer, mode);
            } catch (proxyErr) {
                window.logTelemetryError({ type: 'gif_search_blocked', message: proxyErr.message || String(proxyErr), url: endpoint, source: 'Giphy API' });
                resultsContainer.innerHTML = '<div style="color: #e86a8e; font-size: 12px; text-align: center; padding: 20px;">GIF search blocked by network.<br><span style="font-size:10px; color:var(--text-muted); font-weight:normal;">Error logged to Firebase.</span></div>';
            }
        }
    }
};

window.renderGifGrid = function(gifs, container, mode) {
    if (gifs.length === 0) {
        container.innerHTML = '<div style="color: var(--text-muted); font-size: 12px; text-align: center; padding: 20px; font-family:\'Poppins\', sans-serif;">No GIFs found.</div>';
        return;
    }

    let html = `<div class="dgp-grid">`;
    gifs.forEach(g => {
        const isFav = window.favGifs.includes(g.full);
        const starClass = isFav ? 'fa-solid fa-star' : 'fa-regular fa-star';
        const activeClass = isFav ? 'active' : '';

        html += `
            <div class="dgp-gif-wrap" onclick="window.selectGif('${g.full}', '${mode}')">
                <img src="${g.small}" loading="lazy" onload="this.style.opacity=1" onerror="if(!this.src.includes('/uv/service/')) { const p = window.__uv$config?.prefix || '/uv/service/'; this.src = p + (window.__uv$config?.encodeUrl ? window.__uv$config.encodeUrl('${g.small}') : encodeURIComponent('${g.small}')); this.onload = function(){this.style.opacity=1}; }">
                <button class="dgp-fav-btn ${activeClass}" onclick="window.toggleGifFav(event, '${g.full}')"><i class="${starClass}"></i></button>
            </div>
        `;
    });
    html += `</div>`;
    container.innerHTML = html;
};

window.selectGif = function(url, mode) {
    window.attachGif(url, mode);
    window.addRecentGif(url);
    document.getElementById(`${mode}-gif-picker-container`).style.display = 'none';
};

let gifSearchTimeout = null;
window.searchGifs = async function(query, mode) {
    const resultsContainer = document.getElementById(`${mode}-gif-results`);
    if (!resultsContainer) return;
    resultsContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 12px; text-align: center; grid-column: 1/-1; padding: 20px;">Loading...</div>';

    const GIPHY_API_KEY = "iQyIdpWBHBC7mqP8Edkiu32a0P0TIf0W"; 
    
    const endpoint = query.trim() === '' 
        ? `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=30&rating=pg-13`
        : `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=30&rating=pg-13`;

    let data;
    try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('Blocked');
        data = await res.json();
    } catch (err) {
        const prefix = window.__uv$config?.prefix || '/uv/service/';
        const proxyUrl = prefix + (window.__uv$config?.encodeUrl ? window.__uv$config.encodeUrl(endpoint) : encodeURIComponent(endpoint));
        try {
            const proxyRes = await fetch(proxyUrl);
            data = await proxyRes.json();
        } catch (proxyErr) {
            window.logTelemetryError({
                type: 'gif_search_blocked',
                message: proxyErr.message || String(proxyErr),
                url: endpoint,
                source: 'Giphy API'
            });
            resultsContainer.innerHTML = '<div style="color: #e86a8e; font-size: 12px; text-align: center; grid-column: 1/-1; padding: 20px;">GIF search blocked by network.<br><span style="font-size:10px; color:var(--text-muted); font-weight:normal;">Error securely logged to Firebase.</span></div>';
            return;
        }
    }

    resultsContainer.innerHTML = '';
    const gifs = data?.data || [];
    if (gifs.length === 0) {
        resultsContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 12px; text-align: center; grid-column: 1/-1; padding: 20px;">No results found.</div>';
        return;
    }

    gifs.forEach(gif => {
        const imgUrl = gif.images.fixed_height_small.url; 
        const fullUrl = gif.images.original.url;
        
        const img = document.createElement('img');
        img.src = imgUrl;
        img.style.width = '100%';
        img.style.borderRadius = '6px';
        img.style.cursor = 'pointer';
        img.style.objectFit = 'cover';
        
        img.onerror = function() {
            if (!this.src.includes('/uv/service/')) {
                const prefix = window.__uv$config?.prefix || '/uv/service/';
                this.src = prefix + (window.__uv$config?.encodeUrl ? window.__uv$config.encodeUrl(imgUrl) : encodeURIComponent(imgUrl));
            }
        };

        img.onclick = () => {
            window.attachGif(fullUrl, mode);
            document.getElementById(`${mode}-gif-picker-container`).style.display = 'none';
        };
        resultsContainer.appendChild(img);
    });
};

window.makeDraggable = function(elmnt, header) {
    if(!elmnt || !header) return;
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    header.onmousedown = function(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    };
    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
};

window.createSidebarButton = function(roomId) {
    if (roomId === 'public') return;
    let activeBtn = document.getElementById(`btn-room-${roomId}`);
    if (activeBtn) return; 

    const wrapper = document.createElement('div');
    wrapper.id = `wrapper-${roomId}`;
    wrapper.className = 'channel-wrapper';
    
    const btn = document.createElement('button');
    btn.id = `btn-room-${roomId}`;
    btn.className = 'channel-btn';
    btn.innerHTML = `# room-${roomId.toLowerCase()}`;
    btn.onclick = () => window.loadRoom(roomId);
    wrapper.appendChild(btn);
    
    if (myOwnedRooms.includes(roomId)) {
        const dots = document.createElement('button');
        dots.className = 'room-dots';
        dots.innerHTML = '⋮';
        dots.onclick = (e) => window.toggleRoomSettings(e, roomId);
        wrapper.appendChild(dots);
    }
    
    document.getElementById('private-rooms-list')?.appendChild(wrapper);

    onValue(ref(db, `rooms/${roomId}`), (snap) => {
        if (!snap.exists()) {
            myOwnedRooms = myOwnedRooms.filter(id => id !== roomId);
            joinedRooms = joinedRooms.filter(id => id !== roomId);
            window.saveRooms();
            
            const w = document.getElementById(`wrapper-${roomId}`);
            if (w) {
                const menu = document.getElementById('room-settings-menu');
                if (menu && w.contains(menu)) document.body.appendChild(menu);
                w.remove();
            }
            
            if (currentRoom === roomId) {
                window.showPS5Notification("Room Closed", "This room was deleted.", 6000);
                window.loadRoom('public');
            }
            window.updateMyKeysUI();
            unreadRooms.delete(roomId); 
        }
    });

    onValue(ref(db, `rooms/${roomId}/info/name`), (snap) => {
        if (snap.exists()) {
            const rName = snap.val();
            const updateBtn = document.getElementById(`btn-room-${roomId}`);
            if (updateBtn) updateBtn.innerHTML = `# ${window.escapeHTML(rName)}`;
            if (currentRoom === roomId) {
                const fullChatTitle = document.getElementById("full-chat-title");
                if (fullChatTitle) fullChatTitle.innerText = `# ${window.escapeHTML(rName)}`;
                const select = document.getElementById('mini-chat-room-select');
                const opt = select?.querySelector(`option[value="${roomId}"]`);
                if (opt) opt.innerText = `# ${window.escapeHTML(rName)}`;
            }
        }
    });
};

let fullEmojiPicker = null;
let miniEmojiPicker = null;

window.listenForRequests = function(roomKey) {
    onChildAdded(ref(db, `rooms/${roomKey}/requests`), (snapshot) => {
        const reqUser = snapshot.key;
        const data = snapshot.val();
        
        if (data.status === "pending" && myOwnedRooms.includes(roomKey)) {
            const reqId = `req-${roomKey}-${reqUser}`;
            if(document.getElementById(reqId)) return;

            const fullReq = document.createElement("div");
            fullReq.id = reqId;
            fullReq.style.cssText = "background:var(--border-primary); padding:10px 14px; border-radius:10px; font-size:12px; border:1px solid #fcd34d; pointer-events:auto; box-shadow:0 4px 12px rgba(0,0,0,0.4); max-width:240px; margin:0 auto;";
            fullReq.innerHTML = `
                <div style="text-align:center;">
                    <strong style="color:#fcd34d;">${reqUser}</strong> wants to join <strong style="color:#fff;"># room-${roomKey.toLowerCase()}</strong>
                </div>
                <div style="margin-top:10px; display:flex; gap:10px; justify-content:center;">
                    <button id="acc-full-${reqId}" style="background:#4cc9f0; color:#000; border:none; padding:6px 12px; cursor:pointer; border-radius:6px; font-weight:bold;">Accept</button>
                    <button id="dec-full-${reqId}" style="background:#e86a8e; color:#000; border:none; padding:6px 12px; cursor:pointer; border-radius:6px; font-weight:bold;">Decline</button>
                </div>
            `;
            document.getElementById('full-chat-requests')?.appendChild(fullReq);

            const miniReq = document.createElement("div");
            miniReq.id = `mini-${reqId}`;
            miniReq.style.cssText = "background:var(--border-primary); padding:8px; border-radius:8px; font-size:11px; border:1px solid #fcd34d; pointer-events:auto; box-shadow:0 4px 12px rgba(0,0,0,0.4);";
            miniReq.innerHTML = `
                <div style="text-align:center; margin-bottom:4px;">
                    <strong>${reqUser}</strong> wants to join room-${roomKey.toLowerCase()}
                </div>
                <div style="display:flex; gap:6px; justify-content:center;">
                    <button id="acc-mini-${reqId}" style="background:#4cc9f0; border:none; padding:3px 6px; border-radius:4px; font-weight:bold; color:#000;">Acc</button>
                    <button id="dec-mini-${reqId}" style="background:#e86a8e; border:none; padding:3px 6px; border-radius:4px; font-weight:bold; color:#000;">Dec</button>
                </div>
            `;
            document.getElementById('mini-chat-requests')?.appendChild(miniReq);

            const acceptReq = () => { update(ref(db, `rooms/${roomKey}/requests/${reqUser}`), { status: "accepted" }); fullReq.remove(); miniReq.remove(); };
            const declineReq = () => { update(ref(db, `rooms/${roomKey}/requests/${reqUser}`), { status: "declined" }); fullReq.remove(); miniReq.remove(); };

            document.getElementById(`acc-full-${reqId}`).onclick = acceptReq;
            document.getElementById(`dec-full-${reqId}`).onclick = declineReq;
            document.getElementById(`acc-mini-${reqId}`).onclick = acceptReq;
            document.getElementById(`dec-mini-${reqId}`).onclick = declineReq;
        }
    });
};

window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('closing');
        modal.style.display = 'flex'; 
        
        if (modalId === 'settings-modal') {
            const currentProxy = localStorage.getItem('proxyEngine') || 'scramjet';
            const currentTransport = localStorage.getItem('transportEngine') || 'libcurl';
            
            document.querySelectorAll('#engine-card-uv, #engine-card-scramjet').forEach(card => card.classList.remove('active'));
            const activeProxyCard = document.getElementById(`engine-card-${currentProxy}`);
            if (activeProxyCard) activeProxyCard.classList.add('active');

            document.querySelectorAll('.transport-card').forEach(card => card.classList.remove('active'));
            const activeTransportCard = document.getElementById(`transport-card-${currentTransport}`);
            if (activeTransportCard) activeTransportCard.classList.add('active');
            
            window.updateActiveThemeCard(localStorage.getItem('hyperion_theme') || 'default');
            
            if (typeof window.updateActiveExperienceCard === 'function') {
                window.updateActiveExperienceCard(localStorage.getItem('hyperion_experience') || 'web');
            }
        }
    }
};

window.forceClose = function(id) { 
    const modal = document.getElementById(id);
    if(modal) {
        modal.classList.add('closing'); 
        setTimeout(() => { modal.style.display = 'none'; }, 200); 
    }
};

window.closeModal = function(event, id) {
    if (event.target.id === id) window.forceClose(id); 
};

window.switchTab = function(event, tabId) {
    document.querySelectorAll('.settings-tab').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const tab = document.getElementById(tabId);
    if(tab) tab.style.display = 'block';
    event.currentTarget.classList.add('active');
};

window.syncIframeTheme = function() {
    const iframe = document.getElementById('save-manager-iframe');
    if (!iframe || !iframe.contentWindow) return;
    
    const style = getComputedStyle(document.documentElement);
    const cssVars = {
        '--bg-main': style.getPropertyValue('--bg-main').trim() || '#000000',
        '--card-bg': style.getPropertyValue('--card-bg').trim() || '#0a0a0a',
        '--panel-bg': style.getPropertyValue('--panel-bg').trim() || '#050505',
        '--border-primary': style.getPropertyValue('--border-primary').trim() || '#1c1c1c',
        '--text-main': style.getPropertyValue('--text-main').trim() || '#ededed',
        '--text-muted': style.getPropertyValue('--text-muted').trim() || '#737373',
        '--border-hover': style.getPropertyValue('--border-hover').trim() || '#333333'
    };

    iframe.contentWindow.postMessage({
        type: 'HYPERION_THEME_SYNC',
        cssVars: cssVars
    }, '*');
};

window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'HYPERION_REQ_THEME') {
        window.syncIframeTheme();
    }
});

window.setTheme = function(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('hyperion_theme', themeName);
    window.updateActiveThemeCard(themeName);
    
    if (typeof window.updateVantaColors === 'function') {
        window.updateVantaColors(themeName, null, null);
    }

    if (typeof window.syncIframeTheme === 'function') {
        setTimeout(window.syncIframeTheme, 50);
    }
};

window.setProxyEngine = function(engineName) {
    proxyEngine = engineName;
    localStorage.setItem('proxyEngine', engineName);
    window.updateActiveEngineCard(engineName);
    window.showPS5Notification("Engine Updated", `Switched to ${engineName === 'uv' ? 'Ultraviolet' : 'Scramjet'}`, 4000);
};

window.setTransportEngine = function(engineName) {
    transportEngine = engineName;
    localStorage.setItem('transportEngine', engineName);
    window.updateActiveTransportCard(engineName);
    
    window.showPS5Notification("Transport Updated", `Switched to ${engineName === 'libcurl' ? 'Libcurl' : 'Epoxy'}. Reloading...`, 3000);
    setTimeout(() => {
        window.location.reload();
    }, 1500);
};

window.updateActiveTransportCard = function(engineName) {
    document.querySelectorAll('.transport-card').forEach(card => card.classList.remove('active'));
    const activeCard = document.getElementById(`transport-card-${engineName}`);
    if (activeCard) activeCard.classList.add('active');
};

window.updateActiveEngineCard = function(engineName) {
    document.querySelectorAll('.engine-card').forEach(card => card.classList.remove('active'));
    const activeCard = document.getElementById(`engine-card-${engineName}`);
    if (activeCard) activeCard.classList.add('active');
};

window.updateActiveThemeCard = function(themeName) {
    document.querySelectorAll('.theme-option-card').forEach(card => card.classList.remove('active'));
    const activeCard = document.getElementById(`theme-card-${themeName}`);
    if (activeCard) activeCard.classList.add('active');
};

window.updateActiveProviderCard = function(providerName) {
    document.querySelectorAll('[id^="provider-card-"]').forEach(card => card.classList.remove('active'));
    const activeCard = document.getElementById(`provider-card-${providerName}`);
    if (activeCard) activeCard.classList.add('active');
};

window.setGameProvider = function(providerName) {
    localStorage.setItem('hyperion_game_provider', providerName);
    window.updateActiveProviderCard(providerName);
    
    const disclaimer = document.getElementById('provider-disclaimer');
    if (disclaimer) {
        disclaimer.style.display = (providerName === 'hyperion') ? 'none' : 'block';
    }
    
    if (typeof window.loadGameLibrary === 'function') {
        window.loadGameLibrary(providerName);
    }
};

window.loadGameLibrary = async function(provider) {
    const grid = document.getElementById('main-game-grid');
    if (!grid) return;
    
    grid.innerHTML = '<div class="music-list-loading" style="grid-column: 1 / -1;">Fetching game library...</div>';
    const pagination = document.getElementById('pagination-controls');
    if (pagination) pagination.innerHTML = '';

    try {
        let fetchedGames = [];

        if (provider === 'hyperion') {
            fetchedGames = [...(window.localHyperionGames || [])];
            
        } else if (provider === 'gnmath') {
            const manifestUrl = 'https://raw.githubusercontent.com/gn-math/assets/main/zones.json';
            
            const htmlBase = 'https://gn-math.github.io/html';
            const assetsBase = 'https://gn-math.github.io/assets';

            const res = await fetch(manifestUrl);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const rawData = await res.json();
            
            const items = Array.isArray(rawData) ? rawData : Object.values(rawData);
            
            fetchedGames = items.map(g => {
                const title = (g.name || g.title || 'Untitled Game').trim();
                let targetUrl = g.url || g.path || '';

                if (targetUrl) {
                    targetUrl = targetUrl.replace('{HTML_URL}', htmlBase).replace('{ASSETS_URL}', assetsBase);

                    if (!targetUrl.startsWith('http')) {
                        if (targetUrl.endsWith('.html')) {
                            targetUrl = htmlBase + '/' + targetUrl.replace(/^\//, '');
                        } else {
                            targetUrl = assetsBase + '/' + targetUrl.replace(/^\//, '') + '/index.html';
                        }
                    }
                } else if (g.id) {
                    targetUrl = `${htmlBase}/${g.id}.html`;
                }

                return { name: title, path: targetUrl };
            }).filter(g => {
                return g.name && g.path && !g.name.startsWith('[!]') && !g.name.startsWith('-');
            });
        }

        allGamesArray = fetchedGames;
        allGamesArray.sort((a, b) => a.name.localeCompare(b.name));
        filteredGames = [...allGamesArray];
        
        window.renderPage(1);
        
        const providerTitles = { 'hyperion': 'Hyperion Vault', 'gnmath': 'GNmath' };

    } catch (error) {
        console.error("Failed to load library:", error);
        grid.innerHTML = '<div class="music-list-loading" style="color:#e86a8e; grid-column: 1 / -1;">Failed to load GNmath library. Switch back to Hyperion Vault.</div>';
    }
};

window.toggleMiniChat = function() {
    const body = document.getElementById("mini-chat-body");
    if(!body) return;
    if (body.style.maxHeight === "0px" || body.style.maxHeight === "") {
        body.style.maxHeight = "450px";
        body.style.opacity = "1";
        body.style.pointerEvents = "auto";
    } else {
        body.style.maxHeight = "0px";
        body.style.opacity = "0";
        body.style.pointerEvents = "none";
    }
};

window.toggleMiniPlayer = function() {
    const player = document.getElementById('mini-music-widget');
    if (!player) return;
    player.classList.toggle('collapsed');
};

let ps5Timeout = null;
window.showPS5Notification = function(title, desc, durationMs = 4000) {
    let container = document.getElementById('notification-container');
    if (!container) return;

    const notif = document.createElement('div');
    notif.className = 'ps5-notification-card';
    notif.innerHTML = `
        <div class="ps5-icon">i</div>
        <div class="ps5-text">
            <span class="ps5-title">${window.escapeHTML(title)}</span>
            <span class="ps5-desc">${window.escapeHTML(desc)}</span>
        </div>
    `;
    
    container.appendChild(notif);
    
    const height = notif.offsetHeight;
    
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            notif.classList.add('show');
        });
    });

    setTimeout(() => {
        notif.classList.remove('show');
        notif.classList.add('hiding');
        
        notif.style.marginTop = `-${height + 10}px`; 

        setTimeout(() => notif.remove(), 400); 
    }, durationMs);
};

window.toggleMyKeys = function() {
    const list = document.getElementById('my-keys-list');
    const arrow = document.getElementById('my-keys-arrow');
    if(!list || !arrow) return;
    if(list.style.display === 'flex') {
        list.style.display = 'none';
        arrow.innerText = '▼';
    } else {
        list.style.display = 'flex';
        arrow.innerText = '▲';
    }
};

window.toggleRoomSettings = function(e, roomId) {
    e.stopPropagation();
    const menu = document.getElementById('room-settings-menu');
    if(!menu) return;
    if(currentSettingsRoom === roomId && menu.style.display === 'flex') {
        menu.style.display = 'none';
        return;
    }
    currentSettingsRoom = roomId;
    menu.style.display = 'flex';
    e.target.parentNode.appendChild(menu);
    menu.style.top = '25px';
    menu.style.right = '0';
    
    document.getElementById('room-settings-main').style.display = 'flex';
    document.getElementById('room-settings-delete').style.display = 'none';
    document.getElementById('room-settings-kick').style.display = 'none';
    
    const cancelBtn = document.getElementById('cancel-delete-btn');
    if(cancelBtn) cancelBtn.style.display = deletionTimers[roomId] ? 'block' : 'none';
};

window.showDeleteOptions = function(e) {
    if(e) e.stopPropagation();
    document.getElementById('room-settings-main').style.display = 'none';
    document.getElementById('room-settings-kick').style.display = 'none';
    document.getElementById('room-settings-delete').style.display = 'flex';
};

window.showKickOptions = function(e) {
    if(e) e.stopPropagation();
    document.getElementById('room-settings-main').style.display = 'none';
    document.getElementById('room-settings-delete').style.display = 'none';
    document.getElementById('room-settings-kick').style.display = 'flex';

    const list = document.getElementById('kick-user-list');
    if(!list) return;
    list.innerHTML = '';
    if(activeRoomUsers.size === 0) {
        list.innerHTML = '<span style="font-size:11px; color:var(--text-muted); padding:4px;">No other users detected</span>';
        return;
    }
    activeRoomUsers.forEach(user => {
        const btn = document.createElement('button');
        btn.className = 'settings-opt-btn';
        btn.innerText = `Kick ${user}`;
        btn.onclick = (ev) => { ev.stopPropagation(); window.executeKick(user); };
        list.appendChild(btn);
    });
};

window.showMainOptions = function(e) {
    if(e) e.stopPropagation();
    document.getElementById('room-settings-delete').style.display = 'none';
    document.getElementById('room-settings-kick').style.display = 'none';
    document.getElementById('room-settings-main').style.display = 'flex';
};

window.renameRoom = function(e) {
    if(e) e.stopPropagation();
    if(!currentSettingsRoom) return;
    const newName = prompt("Enter new room name:");
    if(!newName) return;
    update(ref(db, `rooms/${currentSettingsRoom}/info`), { name: newName });
    document.getElementById('room-settings-menu').style.display = 'none';
};

window.deleteRoomIn = function(seconds, e) {
    if(e) e.stopPropagation();
    if(!currentSettingsRoom) return;
    const roomId = currentSettingsRoom;
    document.getElementById('room-settings-menu').style.display = 'none';
    if(deletionTimers[roomId]) clearTimeout(deletionTimers[roomId]);
    
    if(seconds === 0) {
        window.executeDelete(roomId);
    } else {
        let timeStr = seconds >= 60 ? (seconds/60)+' minute(s)' : seconds+' seconds';
        push(ref(db, `rooms/${roomId}/messages`), { user: 'SYSTEM', text: `⚠️ Room will be deleted in ${timeStr}.`, timestamp: serverTimestamp() });
        deletionTimers[roomId] = setTimeout(() => window.executeDelete(roomId), seconds * 1000);
    }
};

window.cancelDeletion = function(e) {
    if(e) e.stopPropagation();
    if(!currentSettingsRoom) return;
    const roomId = currentSettingsRoom;
    if(deletionTimers[roomId]) {
        clearTimeout(deletionTimers[roomId]);
        delete deletionTimers[roomId];
        push(ref(db, `rooms/${roomId}/messages`), { user: 'SYSTEM', text: '✅ Room deletion cancelled.', timestamp: serverTimestamp() });
    }
    document.getElementById('room-settings-menu').style.display = 'none';
};

window.updateEffectPreview = function() {
    const preview = document.getElementById('effect-preview-text');
    if(!preview) return;
    const color = document.getElementById('prof-color').value;
    const effect = document.getElementById('prof-effect').value;
    const name = document.getElementById('prof-username').value || "Preview Name";
    preview.innerText = name;
    preview.className = effect !== 'none' ? `effect-${effect}` : "";
    preview.style.cssText = `font-size:16px; font-weight:bold; --user-color:${color}; color:${color};`;
};

window.openChatProfile = function() {
    document.getElementById('prof-username').value = currentUser;
    document.getElementById('prof-color').value = myChatColor;
    document.getElementById('prof-color-hex').innerText = myChatColor.toUpperCase();
    document.getElementById('prof-font').value = myChatFont;
    document.getElementById('prof-effect').value = myChatEffect;
    
    window.pendingPfpBase64 = myChatPfp;
    if (myChatPfp) {
        document.getElementById('pfp-preview').src = myChatPfp;
        document.getElementById('pfp-preview').style.display = 'block';
        document.getElementById('pfp-dropzone-text').innerText = "Current Image";
    } else {
        window.removePfp();
    }

    window.updateEffectPreview();
    document.getElementById('chat-profile-settings').style.display = 'flex';
};

window.closeChatProfile = function() {
    document.getElementById('chat-profile-settings').style.display = 'none';
};

window.saveChatProfile = async function() {
    const newName = document.getElementById('prof-username').value.trim();
    const newColor = document.getElementById('prof-color').value;
    const newFont = document.getElementById('prof-font').value;
    const newEffect = document.getElementById('prof-effect').value; 
    
    myChatColor = newColor; localStorage.setItem("chat_color", myChatColor);
    myChatFont = newFont; localStorage.setItem("chat_font", myChatFont);
    myChatEffect = newEffect; localStorage.setItem("chat_effect", myChatEffect);
    
    myChatPfp = window.pendingPfpBase64 || ""; 
    localStorage.setItem("chat_pfp", myChatPfp);
    
    const miniChatMessages = document.getElementById("mini-chat-messages");
    const fullChatMessages = document.getElementById("full-chat-messages");
    if(miniChatMessages) miniChatMessages.style.fontFamily = myChatFont;
    if(fullChatMessages) fullChatMessages.style.fontFamily = myChatFont;
    
    window.updatePlayingAs();

    if (newName && newName !== currentUser) {
        if (newName.length > 15) return window.showPS5Notification("Error", "Username too long! Max 15 characters.", 6000);
        const mod = window.sanitize(newName);
        if (!mod.valid || mod.text !== newName) return window.showPS5Notification("Error", "Invalid or inappropriate username.", 6000);
        
        const nameKey = newName.toLowerCase().replace(/[.#$\[\]]/g, "_");
        const userRef = ref(db, `users/${nameKey}`);
        try {
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const lastActive = data.last_active || 0;
                if(Date.now() - lastActive <= 7 * 24 * 60 * 60 * 1000) {
                    return window.showPS5Notification("Error", "Username taken and active!", 6000);
                }
            }
            const oldNameKey = currentUser.toLowerCase().replace(/[.#$\[\]]/g, "_");
            set(ref(db, `users/${oldNameKey}`), null);
            set(userRef, { active: true, last_active: Date.now() });
            currentUser = newName;
            localStorage.setItem("chat_username", currentUser);
            window.updatePlayingAs();
            window.showPS5Notification("Success", "Profile updated!", 6000);
        } catch (e) {
            return window.showPS5Notification("Error", "Error saving profile.", 6000);
        }
    } else {
        window.showPS5Notification("Success", "Profile styling updated!", 6000);
    }
    window.closeChatProfile();
};

window.createPrivateRoom = function() {
    const key = Math.random().toString(36).substring(2, 8).toUpperCase();
    isHost = true;
    set(ref(db, `rooms/${key}/info`), { host: currentUser, created: serverTimestamp() });
    myOwnedRooms.push(key);
    window.saveRooms();
    window.updateMyKeysUI();
    
    window.createSidebarButton(key); 
    
    window.loadRoom(key);
    window.listenForRequests(key);
    window.showPS5Notification("Private Room Created", `Your Key is: ${key}`, 30000);
};

window.createPublicRoom = function() {
    if (!auth.currentUser) return window.showPS5Notification("Error", "Connecting to secure server, try again in 1s.", 4000);
    
    const isOwner = auth.currentUser && auth.currentUser.uid === "9Pi7EBEFOSZjLlrbved0adovXdM2";
    const deleteBtnHtml = isOwner ? `<button class="msg-action-btn" title="Delete Message" onclick="window.deleteMessage('${msgId}')" style="color:#ef4444;"><i class="fa-solid fa-trash"></i></button>` : '';
    const publicList = document.getElementById('public-rooms-list');
    const roomCount = publicList ? publicList.querySelectorAll('.channel-wrapper').length : 0;
    
    if (roomCount >= 15 && !isOwner) {
        return window.showPS5Notification("Limit Reached", "There can only be 5 public channels at a time.", 4000);
    }
    
    const rawName = prompt("Enter a name for your public channel (max 20 chars):");
    if (!rawName) return;
    
    const roomName = rawName.trim().substring(0, 20).toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (roomName.length < 3) return window.showPS5Notification("Error", "Name must be at least 3 characters.", 4000);
    
    const key = Math.random().toString(36).substring(2, 8).toUpperCase();
    isHost = true;
    
    set(ref(db, `rooms/${key}/info`), { host: currentUser, uid: auth.currentUser.uid, name: roomName, type: 'public', created: serverTimestamp() });
    set(ref(db, `public_rooms/${key}`), roomName);
    
    myOwnedRooms.push(key);
    window.saveRooms();
    window.updateMyKeysUI();
    window.loadRoom(key);
    window.showPS5Notification("Public Room Created", `# ${roomName} is now live!`, 5000);
};

onValue(ref(db, 'public_rooms'), (snapshot) => {
    const publicList = document.getElementById('public-rooms-list');
    if (!publicList) return;
    
    publicList.innerHTML = '';
    if (snapshot.exists()) {
        const isOwner = auth.currentUser && auth.currentUser.uid === "9Pi7EBEFOSZjLlrbved0adovXdM2";
        
        snapshot.forEach((childSnapshot) => {
            const roomId = childSnapshot.key;
            const roomName = childSnapshot.val();
            
            const wrapper = document.createElement('div');
            wrapper.id = `wrapper-${roomId}`;
            wrapper.className = 'channel-wrapper';
            
            const btn = document.createElement('button');
            btn.id = `btn-room-${roomId}`;
            btn.className = 'channel-btn';
            btn.innerHTML = `# ${window.escapeHTML(roomName)}`;
            btn.onclick = () => window.loadRoom(roomId);
            
            wrapper.appendChild(btn);
            
            if (isOwner) {
                const dots = document.createElement('button');
                dots.className = 'room-dots';
                dots.innerHTML = '⋮';
                dots.onclick = (e) => window.toggleRoomSettings(e, roomId);
                wrapper.appendChild(dots);
            }
            
            publicList.appendChild(wrapper);
        });
    } else {
        publicList.innerHTML = '<div style="font-size:11px; color:var(--text-muted); padding:4px;">No public rooms yet.</div>';
    }
});

onValue(ref(db, 'public_rooms'), (snapshot) => {
    const publicList = document.getElementById('public-rooms-list');
    if (!publicList) return;
    
    publicList.innerHTML = '';
    if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
            const roomId = childSnapshot.key;
            const roomName = childSnapshot.val();
            
            const wrapper = document.createElement('div');
            wrapper.id = `wrapper-${roomId}`;
            wrapper.className = 'channel-wrapper';
            
            const btn = document.createElement('button');
            btn.id = `btn-room-${roomId}`;
            btn.className = 'channel-btn';
            btn.innerHTML = `# ${window.escapeHTML(roomName)}`;
            btn.onclick = () => window.loadRoom(roomId);
            
            wrapper.appendChild(btn);
            
            if (myOwnedRooms.includes(roomId)) {
                const dots = document.createElement('button');
                dots.className = 'room-dots';
                dots.innerHTML = '⋮';
                dots.onclick = (e) => window.toggleRoomSettings(e, roomId);
                wrapper.appendChild(dots);
            }
            
            publicList.appendChild(wrapper);
        });
    } else {
        publicList.innerHTML = '<div style="font-size:11px; color:var(--text-muted); padding:4px;">No public rooms yet.</div>';
    }
});

window.joinPrivateRoomUI = function() {
    const key = prompt("Enter Private Room Key:")?.toUpperCase();
    if (!key) return;
    set(ref(db, `rooms/${key}/requests/${currentUser}`), { status: "pending" });
    const statusHtml = `<span style="color:#fcd34d; font-style:italic;">Sent join request for ${key}...</span>`;
    
    const miniStatus = document.createElement("div");
    miniStatus.style.cssText = "font-size:11px; text-align:center;";
    miniStatus.innerHTML = statusHtml;
    const miniChatMessages = document.getElementById("mini-chat-messages");
    if(miniChatMessages) miniChatMessages.appendChild(miniStatus);

    const fullStatus = document.createElement("div");
    fullStatus.style.cssText = "font-size:13px; text-align:center; padding:10px; border:1px dashed #fcd34d; border-radius:8px; width:fit-content; margin:0 auto;";
    fullStatus.innerHTML = statusHtml;
    const fullChatMessages = document.getElementById("full-chat-messages");
    if(fullChatMessages) fullChatMessages.appendChild(fullStatus);

    onValue(ref(db, `rooms/${key}/requests/${currentUser}/status`), (snapshot) => {
        if (snapshot.val() === "accepted") {
            if(!joinedRooms.includes(key) && !myOwnedRooms.includes(key)) {
                joinedRooms.push(key);
                window.saveRooms();
            }
            
            window.createSidebarButton(key);
            
            window.loadRoom(key);
        }
        if (snapshot.val() === "declined") {
            window.showPS5Notification("Declined", "Host declined your request.", 6000);
            miniStatus.remove();
            fullStatus.remove();
        }
    });
};

window.escapeHTML = function(str) {
    if (!str) return "";
    return String(str).replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
};

let currentReactionsUnsubscribe = null;
let activeReplyTarget = null;
let currentRoomReactions = {};
const unreadRooms = new Set();
window.activeReactionMessageId = null;

window.setReplyTarget = function(messageId, username, textPreview) {
    activeReplyTarget = {
        id: messageId,
        user: username,
        snippet: textPreview.substring(0, 45) + (textPreview.length > 45 ? '...' : '')
    };
    ['full', 'mini'].forEach(type => {
        const bar = document.getElementById(`${type}-reply-bar`);
        const user = document.getElementById(`${type}-reply-user`);
        if (bar && user) {
            user.innerText = `@${username}`;
            bar.style.display = 'flex';
        }
    });
    const input = document.getElementById('full-chat-input') || document.getElementById('mini-chat-input');
    if (input) input.focus();
};

window.cancelReply = function() {
    activeReplyTarget = null;
    const fullBar = document.getElementById('full-reply-bar');
    const miniBar = document.getElementById('mini-reply-bar');
    if (fullBar) fullBar.style.display = 'none';
    if (miniBar) miniBar.style.display = 'none';
};

window.toggleReaction = function(messageId, emoji) {
    if (!messageId || !emoji) return;
    const userKey = currentUser.toLowerCase().replace(/[.#$\[\]]/g, '_');
    const reactionRef = ref(db, `rooms/${currentRoom}/reactions/${messageId}/${emoji}/${userKey}`);
    get(reactionRef).then(snap => {
        if (snap.exists() && snap.val() === true) {
            set(reactionRef, null);
        } else {
            set(reactionRef, true);
        }
    });
};

window.insertAtCursor = function(inputId, text) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const currentVal = input.value;
    input.value = currentVal.substring(0, start) + text + currentVal.substring(end);
    input.selectionStart = input.selectionEnd = start + text.length;
    input.focus();
};


window.handleSend = function(text, mode = 'full') {
    const attachedEmbed = window.pendingGifUrl[mode];
    
    let cleanText = (text || '').trim();
    if (!cleanText && !attachedEmbed) return; 

    const isOwner = auth.currentUser && auth.currentUser.uid === "9Pi7EBEFOSZjLlrbved0adovXdM2";

    if (!isOwner) {
        cleanText = cleanText.substring(0, 300); 
        if (Date.now() - lastMessageTime < 1500) return window.showPS5Notification("Slow Down", "Wait 1.5s between messages.", 6000);
        
        if (currentRoom === 'suggestions') {
            const lastSug = localStorage.getItem('hyperion_last_suggestion');
            if (lastSug && Date.now() - parseInt(lastSug) < 3600000) {
                const remaining = Math.ceil((3600000 - (Date.now() - parseInt(lastSug))) / 60000);
                return window.showPS5Notification("Cooldown", `You can suggest again in ${remaining} minutes.`, 6000);
            }
            localStorage.setItem('hyperion_last_suggestion', Date.now());
        }

        if (cleanText) {
            const mod = window.sanitize(cleanText);
            if (!mod.valid) return window.showPS5Notification("Error", mod.err, 6000);
            cleanText = mod.text;
        }
    }

    const payload = {
        user: currentUser,
        text: cleanText,
        embed: attachedEmbed || null, 
        color: myChatColor,
        effect: myChatEffect,
        pfp: myChatPfp,
        deviceId: myDeviceId,
        timestamp: serverTimestamp()
    };

    if (isOwner) {
        payload.badge = 'OWNER';
    }

    if (activeReplyTarget) {
        payload.replyTo = {
            user: activeReplyTarget.user,
            snippet: activeReplyTarget.snippet
        };
    }

    push(ref(db, `rooms/${currentRoom}/messages`), payload);
    const safeUpdateKey = currentUser.toLowerCase().replace(/[.#$\[\]]/g, "_");
    update(ref(db, `users/${safeUpdateKey}`), { last_active: Date.now() });

    const inputEl = document.getElementById(`${mode}-chat-input`);
    if (inputEl) inputEl.value = "";
    window.removeAttachedGif(mode);
    window.cancelReply();
    lastMessageTime = Date.now();
};

const baseLoadRoom = window.loadRoom;
window.loadRoom = function(roomId) {
    const wrapper = document.getElementById(`wrapper-${roomId}`) || document.getElementById('btn-room-public')?.parentElement;
    if (wrapper) wrapper.classList.remove('has-unread');
    if (currentReactionsUnsubscribe) {
        currentReactionsUnsubscribe();
        currentReactionsUnsubscribe = null;
    }
    currentRoomReactions = {};

    currentRoom = roomId;
    activeRoomUsers.clear();
    const miniChatMessages = document.getElementById("mini-chat-messages");
    const fullChatMessages = document.getElementById("full-chat-messages");
    const fullChatTitle = document.getElementById("full-chat-title");
    
    if(miniChatMessages) miniChatMessages.innerHTML = "";
    if(fullChatMessages) fullChatMessages.innerHTML = "";
    const select = document.getElementById('mini-chat-room-select');
    if(select) select.value = roomId;
const staticRooms = {
        'public': '💬 global-chat',
        'announcements': '📢 announcements',
        'site-updates': '❗ site-updates',
        'links': 'Links',
        'suggestions': '❓ suggestions',
        'random-bs': '⁉️ random-bs'
    };
    if (fullChatTitle) {
        fullChatTitle.innerText = staticRooms[roomId] ? staticRooms[roomId] : `# room-${roomId.toLowerCase()}`;
    }

    const isOwner = auth.currentUser && auth.currentUser.uid === "9Pi7EBEFOSZjLlrbved0adovXdM2";
    const readOnlyRooms = ['rules', 'announcements', 'site-updates', 'links'];
    const isLocked = readOnlyRooms.includes(roomId) && !isOwner;

    const fullInputArea = document.getElementById('full-chat-input-area');
    const fullReadOnlyMsg = document.getElementById('full-chat-readonly');
    
    if (fullInputArea && fullReadOnlyMsg) {
        if (isLocked) {
            fullInputArea.style.display = 'none';
            fullReadOnlyMsg.style.display = 'flex';
        } else {
            fullInputArea.style.display = 'flex';
            fullReadOnlyMsg.style.display = 'none';
        }
    }
    document.querySelectorAll('.channel-btn').forEach(btn => btn.classList.remove('active'));
    let activeBtn = document.getElementById(`btn-room-${roomId}`);
    if (activeBtn) activeBtn.classList.add('active');

    if (currentUnsubscribe) currentUnsubscribe();
    if (currentRoomListener) currentRoomListener();

    if (roomId !== 'public') {
        currentRoomListener = onValue(ref(db, `rooms/${roomId}`), (snap) => {
            if (snap.exists()) {
                const banned = snap.child('banned').val() || {};
                const checkKey = currentUser.toLowerCase().replace(/[.#$\[\]]/g, "_");
                if (banned[checkKey]) {
                    window.showPS5Notification("Kicked", "You have been kicked from the room.", 6000);
                    window.loadRoom('public');
                }
            }
        });
    }
    const roomRef = ref(db, `rooms/${roomId}/messages`);
    const fetchLimit = roomId === 'suggestions' ? 500 : 300;
    const limitedQuery = query(roomRef, limitToLast(fetchLimit));
    
    currentUnsubscribe = onChildAdded(limitedQuery, (snapshot) => {
        const data = snapshot.val();
        const msgId = snapshot.key;
        let msgHtml = '';

        const safeUser = window.escapeHTML(window.censorText(data.user || "Unknown"));

        if (data.user === 'SYSTEM') {
            msgHtml = `<strong class="system-msg">${data.text}</strong>`;
        } else {
            if (data.user !== currentUser) activeRoomUsers.add(data.user);
            
            const nameColor = data.color || (data.user === currentUser ? myChatColor : "#737373");
            const displayUser = (data.deviceId && window.globalNicknames && window.globalNicknames[data.deviceId]) 
                ? window.escapeHTML(window.censorText(window.globalNicknames[data.deviceId])) 
                : safeUser;
            let safeText = window.escapeHTML(window.censorText(data.text));
            safeText = safeText.replace(/\n/g, '<br>');
            
            let jsSafeReplyText = safeText.replace(/'/g, "\\'").replace(/"/g, "&quot;");
            
            let nameStyle = `--user-color:${window.escapeHTML(nameColor)}; color:${window.escapeHTML(nameColor)};`;
            let effectClass = data.effect && data.effect !== 'none' ? `effect-${window.escapeHTML(data.effect)}` : "";
            
            let embedUrl = data.embed || null;
            if (!embedUrl) {
                const gifRegex = /https?:\/\/(?:[a-z0-9-]+\.)?(giphy\.com|klipy\.com|klipy\.co|tenor\.com)\/[^\s]+/i;
                const rawMatch = (data.text || '').match(gifRegex);
                if (rawMatch) {
                    embedUrl = rawMatch[0];
                    safeText = safeText.replace(window.escapeHTML(rawMatch[0]), '').trim();
                } else if ((data.text || '').startsWith('data:image/')) {
                    embedUrl = data.text;
                    safeText = '';
                }
            }

            if (typeof twemoji !== 'undefined' && safeText) {
                safeText = twemoji.parse(safeText, {
                    base: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@17.0.3/assets/',
                    folder: '72x72',
                    ext: '.png',
                    className: 'chat-emoji'
                });
            }
            
            let embedHtml = '';
            if (embedUrl) {
                embedHtml = `<div style="margin-top: 8px;"><img src="${window.escapeHTML(embedUrl)}" style="max-width: 250px; max-height: 250px; border-radius: 8px; object-fit: contain;" onerror="this.style.display='none'"></div>`;
            }
            
            let badgeHtml = '';
            if (data.badge === 'OWNER') {
                badgeHtml = `<span class="owner-badge" style="vertical-align:middle; position:relative; top:-1px; height:17px; padding:1px 5px 0 5px; display:inline-flex; align-items:center;">OWNER</span>`;
            }

            let customBadgeHtml = '';
            if (data.deviceId && window.globalBadges && window.globalBadges[data.deviceId]) {
                const userBadges = window.globalBadges[data.deviceId];
                Object.values(userBadges).forEach(b => {
                    customBadgeHtml += `<span style="background:${window.escapeHTML(b.bg)}; color:${window.escapeHTML(b.color)}; font-size:9px; font-weight:800; padding:1px 5px 0 5px; border-radius:4px; margin-left:6px; letter-spacing:0.5px; display:inline-flex; align-items:center; justify-content:center; height:17px; line-height:1; box-sizing:border-box; vertical-align:middle; position:relative; top:-1px;">${window.escapeHTML(b.label)}</span>`;
                });
            }

            let replyHtml = '';
            if (data.replyTo) {
                replyHtml = `<div class="message-reply-quote"><i class="fa-solid fa-reply"></i> <strong>@${window.escapeHTML(data.replyTo.user)}</strong> ${window.escapeHTML(data.replyTo.snippet)}</div>`;
            }

            const isOwner = auth.currentUser && auth.currentUser.uid === "9Pi7EBEFOSZjLlrbved0adovXdM2";
            const deleteBtnHtml = isOwner ? `<button class="msg-action-btn" title="Delete Message" onclick="window.deleteMessage('${msgId}')" style="color:#ef4444;"><i class="fa-solid fa-trash"></i></button>` : '';
            
            const addBadgeBtnHtml = isOwner ? `<button class="msg-action-btn" title="Manage Badge" onclick="window.promptGrantBadge('${data.deviceId || ''}')" style="color:#1db954;"><i class="fa-solid fa-tag"></i></button>` : '';

            const safePfp = data.pfp ? window.escapeHTML(data.pfp) : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23737373'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

            const textHtml = safeText ? `<strong style="margin: 0 6px 0 2px; vertical-align: middle;">:</strong><span style="opacity: 0.9; vertical-align: middle;">${safeText}</span>` : '';

            msgHtml = `
                ${replyHtml}
                <div class="chat-msg-content-wrapper">
                    <img src="${safePfp}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; flex-shrink: 0; background: var(--search-bg); border: 1px solid var(--border-primary);" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'%23737373\\'%3E%3Cpath d=\\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\\'/%3E%3C/svg%3E'">
                    <div class="chat-msg-text-block">
                        <div style="font-family: 'Space Grotesk', sans-serif; font-size: 14px; word-wrap: break-word; line-height: 1.5;">
                            <strong class="${effectClass}" style="${nameStyle}; vertical-align: middle;">${displayUser}</strong>${badgeHtml}
                            <span class="custom-badge-container">${customBadgeHtml}</span>${textHtml}
                        </div>
                        ${embedHtml}
                    </div>
                </div>
                <div class="reactions-row" id="reactions-${msgId}" style="margin-left: 44px;"></div>
                <div class="msg-action-bar">
                ${deleteBtnHtml}
                ${addBadgeBtnHtml}
                <button class="msg-action-btn" title="Reply" onclick="window.setReplyTarget('${msgId}', '${displayUser}', '${jsSafeReplyText}')"><i class="fa-solid fa-reply"></i></button>
                <button class="msg-action-btn react-add-btn" title="Add Reaction" onclick="window.openReactionPicker(event, '${msgId}')"><i class="fa-regular fa-face-smile"></i>+</button>
            </div>
            `;
        }

        function createMsgElement(isMini) {
            const wrap = document.createElement("div");
            wrap.className = "chat-msg-row";
            wrap.setAttribute("data-msg-id", msgId);
            wrap.setAttribute("data-device-id", data.deviceId || ''); 
            wrap.setAttribute("data-original-user", safeUser);
            wrap.style.cssText = `${isMini ? 'font-size:12px; padding:6px 10px;' : 'font-size:14px; padding:10px 14px;'} color:var(--text-main); background:var(--card-bg); border-radius:8px; border:1px solid var(--border-primary); margin-bottom: 6px;`;
            wrap.innerHTML = msgHtml;
            return wrap;
        }

        function appendOrPrepend(container, wrapElement, incomingMsgId) {
            if (!container) return;
            const firstChild = container.firstElementChild;
            if (firstChild && incomingMsgId < firstChild.getAttribute('data-msg-id')) {
                container.prepend(wrapElement);
            } else {
                container.appendChild(wrapElement);
                container.scrollTop = container.scrollHeight;
            }
        }

        appendOrPrepend(miniChatMessages, createMsgElement(true), msgId);
        appendOrPrepend(fullChatMessages, createMsgElement(false), msgId);
    });

    window.currentRemoveUnsubscribe = onChildRemoved(limitedQuery, (snapshot) => {
        document.querySelectorAll(`[data-msg-id="${snapshot.key}"]`).forEach(el => el.remove());
    });

    const roomReactionsRef = ref(db, `rooms/${roomId}/reactions`);
    currentReactionsUnsubscribe = onValue(roomReactionsRef, (snap) => {
        currentRoomReactions = snap.val() || {};
        document.querySelectorAll('.reactions-row').forEach(row => {
            const mId = row.id.replace('reactions-', ''); 
            const data = currentRoomReactions[mId] || {};
            let html = '';
            
            for (const [emoji, users] of Object.entries(data)) {
                if (!users) continue;
                const count = Object.keys(users).length;
                const myKey = currentUser.toLowerCase().replace(/[.#$\[\]]/g, '_');
                const hasReacted = users[myKey] === true;
                
                if (count > 0) {
                    html += `<span class="reaction-pill ${hasReacted ? 'reacted' : ''}" onclick="window.toggleReaction('${mId}', '${emoji}')">${emoji} <span style="margin-left:4px; font-weight:600;">${count}</span></span>`;
                }
            }
            row.innerHTML = html;

            if (typeof twemoji !== 'undefined' && html !== '') {
                twemoji.parse(row, {
                    base: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@17.0.3/assets/',
                    folder: '72x72',
                    ext: '.png',
                    className: 'chat-emoji'
                });
            }
        });
    });
};

window.watchForUnread = function(roomId) {
    if (unreadRooms.has(roomId)) return; 
    unreadRooms.add(roomId);

    const roomMsgRef = query(ref(db, `rooms/${roomId}/messages`), limitToLast(1));
    let initialLoad = true;
    
    onChildAdded(roomMsgRef, () => {
        if (initialLoad) {
            initialLoad = false;
            return;
        }
        if (currentRoom !== roomId) {
            const wrapper = document.getElementById(`wrapper-${roomId}`) || document.getElementById(`btn-room-${roomId}`)?.closest('.channel-wrapper');
            if (wrapper) wrapper.classList.add('has-unread');
        }
    });
};

['public', 'rules', 'announcements', 'site-updates', 'links', 'suggestions', 'random-bs'].forEach(room => window.watchForUnread(room));

myOwnedRooms.forEach(room => window.watchForUnread(room));
joinedRooms.forEach(room => window.watchForUnread(room));
window.reloadGame = function() {
    const gameFrame = document.getElementById('game-frame');
    if(gameFrame) gameFrame.src = gameFrame.src;
};

window.toggleFavorite = function() {
    const index = favoriteGames.indexOf(currentGamePath);
    const favBtn = document.getElementById('game-fav-btn');
    if (index > -1) {
        favoriteGames.splice(index, 1);
        if(favBtn) favBtn.classList.remove('is-fav');
    } else {
        favoriteGames.push(currentGamePath);
        if(favBtn) favBtn.classList.add('is-fav');
        window.showPS5Notification("Favorites", `Added '${currentGameName}' to favorites`, 4000);
    }
    localStorage.setItem('hyperion_favorites', JSON.stringify(favoriteGames));
    if (showingFavorites) window.updateSearchFilter();
};

window.toggleHubFavorites = function() {
    showingFavorites = !showingFavorites;
    const btn = document.getElementById('hub-fav-toggle');
    if(btn) {
        if (showingFavorites) {
            btn.classList.add('active');
            btn.innerHTML = `<i class="fa-solid fa-heart"></i> Favorites`;
        } else {
            btn.classList.remove('active');
            btn.innerHTML = `<i class="fa-regular fa-heart"></i> Favorites`;
        }
    }
    window.updateSearchFilter();
};

window.launchGame = function(gameUrl, gameName) {
    document.body.classList.add('playing-game');
    document.body.classList.remove('hide-social-bar');
    setTimeout(() => { document.body.classList.add('hide-social-bar'); }, 10000);

    window.history.pushState({ isGameOpen: true }, '', window.location.href);
    window.history.pushState({ isGameOpen: true }, '', window.location.href);
    const gameContainer = document.getElementById('game-container');
    const iframeWrapper = document.getElementById('iframe-wrapper');

    if (!gameContainer || !iframeWrapper) return;

    currentGamePath = gameUrl;
    currentGameName = gameName || "Game";

    const favBtn = document.getElementById('game-fav-btn');
    if (favBtn) {
        if (favoriteGames.includes(gameUrl)) favBtn.classList.add('is-fav');
        else favBtn.classList.remove('is-fav');
    }

    iframeWrapper.innerHTML = ''; 
    const newIframe = document.createElement('iframe');
    newIframe.id = 'game-frame';
    newIframe.src = gameUrl.startsWith('http') ? gameUrl : (R2_DOMAIN + gameUrl + '?v=10');
    newIframe.tabIndex = 0;

    newIframe.setAttribute('allowfullscreen', 'true');
    newIframe.setAttribute('referrerpolicy', 'no-referrer');
    newIframe.setAttribute('allow', 'autoplay; fullscreen; encrypted-media; picture-in-picture; pointer-lock; keyboard-map');
    newIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-modals allow-orientation-lock');

    newIframe.style.cssText = 'width: 100%; height: 100%; border: none; display: block; background: #000; border-radius: 0 0 8px 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); outline: none;';

    iframeWrapper.appendChild(newIframe);
    window.attachPanicToFrame(newIframe);
    gameContainer.style.display = 'flex';
    const randomProf = safeProfiles[Math.floor(Math.random() * safeProfiles.length)];
    document.title = randomProf.title;
    let link = document.querySelector("link[rel~='icon']");
    if(link) link.href = `https://www.google.com/s2/favicons?domain=${randomProf.domain}&sz=64`;

    newIframe.addEventListener('load', () => {
        try {
            newIframe.focus();
            newIframe.contentWindow?.focus();
        } catch (e) {}
    });

    iframeWrapper.onclick = () => {
        newIframe.focus();
    };
};

window.closeGame = function() {
    document.body.classList.remove('playing-game');
    document.body.classList.remove('hide-social-bar');            
    const gameContainer = document.getElementById('game-container');
    const iframeWrapper = document.getElementById('iframe-wrapper');
    if (gameContainer) gameContainer.style.display = 'none';
    document.title = currentHubTitle; 
    let link = document.querySelector("link[rel~='icon']");
    if(link) link.href = window.currentHubIcon;
    if (iframeWrapper) iframeWrapper.innerHTML = '';
    
    if (window.history.state && window.history.state.isGameOpen) {
        window.history.back();
    }
};

window.frequentEmojis = JSON.parse(localStorage.getItem('hyperion_freq_emojis') || '[]');

window.addFrequentEmoji = function(emoji) {
    window.frequentEmojis = window.frequentEmojis.filter(e => e !== emoji);
    window.frequentEmojis.unshift(emoji);
    if(window.frequentEmojis.length > 24) window.frequentEmojis.pop(); 
    localStorage.setItem('hyperion_freq_emojis', JSON.stringify(window.frequentEmojis));
};

window.emojiCache = null;

window.inlineEmojiState = { active: false, mode: null, query: '', results: [], selectedIndex: 0, cursorStart: 0 };

window.loadEmojiDictionary = async function() {
    if (window.emojiCache) return;
    try {
        let res = await fetch('/libs/emoji-data.json');
        if (!res.ok) res = await fetch('https://cdn.jsdelivr.net/npm/emoji-picker-element-data@1.8.0/en/emojibase/data.json');
        const data = await res.json();
        let grouped = {};
        data.forEach(item => {
            if (item.version && item.version > 14) return;
            const g = item.group !== undefined ? item.group : 0;
            if (g === 2) return; 
            if (!grouped[g]) grouped[g] = [];
            const emojiChar = item.emoji || item.unicode;
            if (emojiChar) {
                grouped[g].push({
                    emoji: emojiChar,
                    name: (item.annotation || 'emoji').replace(/ /g, '_'),
                    search: (item.annotation || '') + ' ' + (item.shortcodes ? item.shortcodes.join(' ') : '')
                });
            }
        });
        window.emojiCache = grouped;
    } catch (e) {
        window.emojiCache = { 0: [{emoji: "😀", name: "grin", search: "smile"}] }; 
    }
};

setTimeout(window.loadEmojiDictionary, 1000);

window.renderCustomEmojiPicker = async function(containerId, inputId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const isFull = containerId.includes('full');
    const gifPicker = document.getElementById(isFull ? 'full-gif-picker-container' : 'mini-gif-picker-container');
    if (gifPicker) gifPicker.style.display = 'none';

    container.style.display = 'flex';
    container.style.padding = '0';
    container.innerHTML = '<div style="color:var(--text-muted); padding:20px; text-align:center; font-family:\'Poppins\', sans-serif;">Loading emojis...</div>';

    if (!window.emojiCache) {
        try {
            let res = await fetch('/libs/emoji-data.json');
            if (!res.ok) res = await fetch('https://cdn.jsdelivr.net/npm/emoji-picker-element-data@1.8.0/en/emojibase/data.json');
            const data = await res.json();
            
            let grouped = {};
            data.forEach(item => {
                if (item.version && item.version > 14) return;
                const g = item.group !== undefined ? item.group : 0;
                if (g === 2) return; 
                if (!grouped[g]) grouped[g] = [];
                const emojiChar = item.emoji || item.unicode;
                if (emojiChar) {
                    grouped[g].push({
                        emoji: emojiChar,
                        search: (item.annotation || '') + ' ' + (item.shortcodes ? item.shortcodes.join(' ') : '') + ' ' + (item.tags ? item.tags.join(' ') : '')
                    });
                }
            });
            if (Object.keys(grouped).length === 0) throw new Error("Empty dataset");
            window.emojiCache = grouped;
        } catch (e) {
            window.emojiCache = { 0: [{emoji: "😀", search: "smile"}, {emoji: "👍", search: "thumbs up"}] }; 
        }
    }

    const GROUP_INFO = {
        0: { id: 'smileys', name: 'Smileys & Emotion', icon: 'fa-regular fa-face-smile' },
        1: { id: 'people', name: 'People & Body', icon: 'fa-solid fa-person' },
        3: { id: 'animals', name: 'Animals & Nature', icon: 'fa-solid fa-leaf' },
        4: { id: 'food', name: 'Food & Drink', icon: 'fa-solid fa-burger' },
        5: { id: 'travel', name: 'Travel & Places', icon: 'fa-solid fa-plane' },
        6: { id: 'activities', name: 'Activities', icon: 'fa-solid fa-basketball' },
        7: { id: 'objects', name: 'Objects', icon: 'fa-solid fa-lightbulb' },
        8: { id: 'symbols', name: 'Symbols', icon: 'fa-solid fa-heart' },
        9: { id: 'flags', name: 'Flags', icon: 'fa-regular fa-flag' }
    };

    let sidebarHtml = `<div class="dep-sidebar">`;
    if (window.frequentEmojis.length > 0) {
        sidebarHtml += `<button class="dep-sb-btn" title="Frequently Used" onclick="document.getElementById('cat-frequent-${containerId}').scrollIntoView({behavior:'smooth'})"><i class="fa-regular fa-clock"></i></button>`;
    }
    
    let bodyHtml = `<div class="dep-body" id="dep-body-${containerId}">`;
    if (window.frequentEmojis.length > 0) {
        bodyHtml += `<div id="cat-frequent-${containerId}" class="dep-section-title">Frequently Used</div><div class="dep-grid">`;
        window.frequentEmojis.forEach(emoji => {
            bodyHtml += `<button class="dep-emoji-btn" data-search="${emoji}" onclick="window.handleEmojiClick('${emoji}', '${containerId}', '${inputId}')">${emoji}</button>`;
        });
        bodyHtml += `</div>`;
    }

    Object.keys(window.emojiCache).sort((a,b) => Number(a) - Number(b)).forEach(groupKey => {
        const info = GROUP_INFO[groupKey] || { id: `cat${groupKey}`, name: 'More', icon: 'fa-solid fa-icons' };
        sidebarHtml += `<button class="dep-sb-btn" title="${info.name}" onclick="document.getElementById('cat-${info.id}-${containerId}').scrollIntoView({behavior:'smooth'})"><i class="${info.icon}"></i></button>`;
        
        bodyHtml += `<div id="cat-${info.id}-${containerId}" class="dep-section-title">${info.name}</div><div class="dep-grid">`;
        window.emojiCache[groupKey].forEach(item => {
            bodyHtml += `<button class="dep-emoji-btn" data-search="${window.escapeHTML(item.search.toLowerCase())}" onclick="window.handleEmojiClick('${item.emoji}', '${containerId}', '${inputId}')">${item.emoji}</button>`;
        });
        bodyHtml += `</div>`;
    });

    sidebarHtml += `</div>`;
    bodyHtml += `</div>`;

    container.innerHTML = `
        <div class="discord-emoji-picker">
            <div class="dep-header">
                <div class="dep-search-wrap">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" class="dep-search-input" placeholder="Find an emoji" autocomplete="off" onkeyup="window.filterCustomEmojis(this.value, '${containerId}')">
                </div>
            </div>
            <div class="dep-main">
                ${sidebarHtml}
                ${bodyHtml}
            </div>
        </div>
    `;

    if (typeof twemoji !== 'undefined') {
        twemoji.parse(container, {
            base: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@17.0.3/assets/',
            folder: '72x72',
            ext: '.png',
            className: 'chat-emoji'
        });
    }
};

window.filterCustomEmojis = function(query, containerId) {
    query = query.toLowerCase();
    const container = document.getElementById(`dep-body-${containerId}`);
    if (!container) return;
    
    const sections = container.querySelectorAll('.dep-section-title');
    const grids = container.querySelectorAll('.dep-grid');
    
    if (!query) {
        sections.forEach(s => s.style.display = 'block');
        grids.forEach(g => {
            g.style.display = 'grid';
            g.querySelectorAll('.dep-emoji-btn').forEach(b => b.style.display = 'flex');
        });
        return;
    }
    
    sections.forEach(s => s.style.display = 'none'); 
    grids.forEach(g => {
        let hasVisible = false;
        g.querySelectorAll('.dep-emoji-btn').forEach(b => {
            const terms = b.getAttribute('data-search') || '';
            if (terms.includes(query)) {
                b.style.display = 'flex';
                hasVisible = true;
            } else {
                b.style.display = 'none';
            }
        });
        g.style.display = hasVisible ? 'grid' : 'none';
    });
};

window.handleEmojiClick = function(emoji, containerId, inputId) {
    if (window.activeReactionMessageId) {
        window.toggleReaction(window.activeReactionMessageId, emoji);
        window.activeReactionMessageId = null;
        document.getElementById(containerId).style.display = 'none';
    } else {
        window.insertAtCursor(inputId, emoji);
    }
    window.addFrequentEmoji(emoji);
};

window.activePickerState = null; 

window.toggleFullEmojiPicker = function(e) {
    e.stopPropagation();
    const containerId = 'full-emoji-picker-container';
    const container = document.getElementById(containerId);
    const btn = e.currentTarget || e.target.closest('button');
    if (!btn || !container) return;

    if (window.activePickerState === 'full' && container.style.display !== 'none') {
        container.style.display = 'none';
        window.activePickerState = null;
        window.activeReactionMessageId = null;
        return;
    }

    window.activePickerState = 'full';
    window.activeReactionMessageId = null;
    document.body.appendChild(container); 
    const btnRect = btn.getBoundingClientRect();
    
    container.style.cssText = 'display: flex; position: fixed; z-index: 2147483647; width: 350px; height: 350px; background: var(--panel-bg); border: 1px solid var(--border-primary); border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);';
    
    container.style.bottom = `${window.innerHeight - btnRect.top + 10}px`; 
    container.style.left = `${btnRect.left}px`;
    
    window.renderCustomEmojiPicker(containerId, 'full-chat-input');
};

window.toggleMiniEmojiPicker = function(e) {
    e.stopPropagation();
    const containerId = 'mini-emoji-picker-container';
    const container = document.getElementById(containerId);
    const btn = e.currentTarget || e.target.closest('button');
    if (!btn || !container) return;

    if (window.activePickerState === 'mini' && container.style.display !== 'none') {
        container.style.display = 'none';
        window.activePickerState = null;
        window.activeReactionMessageId = null;
        return;
    }

    window.activePickerState = 'mini';
    window.activeReactionMessageId = null;
    document.body.appendChild(container);
    const btnRect = btn.getBoundingClientRect();
    
    container.style.cssText = 'display: flex; position: fixed; z-index: 2147483647; width: 280px; height: 280px; background: var(--panel-bg); border: 1px solid var(--border-primary); border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);';
    
    container.style.bottom = `${window.innerHeight - btnRect.top + 10}px`; 
    container.style.right = `${window.innerWidth - btnRect.right}px`;
    
    window.renderCustomEmojiPicker(containerId, 'mini-chat-input');
};

window.openReactionPicker = function(e, messageId) {
    e.stopPropagation();
    const btn = e.currentTarget || e.target.closest('.msg-action-btn');
    if (!btn) return;

    const isMini = btn.closest('#mini-chat-widget') !== null;
    const mode = isMini ? 'mini' : 'full';
    const containerId = `${mode}-emoji-picker-container`;
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const stateKey = `react_${messageId}`;

    if (window.activePickerState === stateKey && container.style.display !== 'none') {
        container.style.display = 'none';
        window.activePickerState = null;
        window.activeReactionMessageId = null;
        return;
    }

    window.activePickerState = stateKey;
    window.activeReactionMessageId = messageId;
    document.body.appendChild(container);
    
    const btnRect = btn.getBoundingClientRect();
    const pickerWidth = isMini ? 280 : 350;
    const pickerHeight = isMini ? 280 : 350;
    
    container.style.cssText = `display: flex; position: fixed; z-index: 2147483647; width: ${pickerWidth}px; height: ${pickerHeight}px; background: var(--panel-bg); border: 1px solid var(--border-primary); border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);`;

    let leftPos = btnRect.right + 12; 
    if (leftPos + pickerWidth > window.innerWidth) leftPos = btnRect.left - pickerWidth - 12;
    container.style.left = `${leftPos}px`;

    let topPos = btnRect.top - (pickerHeight / 2) + 15; 
    if (topPos < 10) topPos = 10; 
    if (topPos + pickerHeight > window.innerHeight) topPos = window.innerHeight - pickerHeight - 10;
    container.style.top = `${topPos}px`;

    window.renderCustomEmojiPicker(containerId, `${mode}-chat-input`);
};

document.addEventListener('click', (e) => {
    const pickers = ['full-emoji-picker-container', 'mini-emoji-picker-container', 'full-gif-picker-container', 'mini-gif-picker-container'];
    pickers.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.style.display !== 'none' && !el.contains(e.target)) {
            el.style.display = 'none';
            if (id.includes('emoji')) {
                window.activeReactionMessageId = null;
                window.activePickerState = null;
            }
        }
    });
});

window.applyBlobCloak = function() {
    const cloakHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${currentHubTitle}</title><link rel="icon" href="${window.currentHubIcon}"><style>body, html { margin: 0; padding: 0; width: 100vw; height: 100vh; overflow: hidden; background: #000; } iframe { width: 100%; height: 100%; border: none; display: block; }</style></head><body><iframe src="${window.location.href}"></iframe></body></html>`;
    const blob = new Blob([cloakHtml], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);
    const newWin = window.open(blobUrl, '_blank');
    if (newWin) window.location.replace(panicUrl);
};

window.applyAboutBlank = function() {
    let win = window.open('about:blank', '_blank');
    if (!win) return;
    let doc = win.document;
    doc.title = currentHubTitle;
    
    let link = doc.createElement('link');
    link.rel = 'icon';
    link.href = window.currentHubIcon;
    doc.head.appendChild(link);
    
    doc.documentElement.style.cssText = 'width:100%;height:100%;margin:0;padding:0;overflow:hidden;';
    doc.body.style.cssText = 'width:100%;height:100%;margin:0;padding:0;overflow:hidden;background:#000;';
    
    let iframe = doc.createElement('iframe');
    iframe.style.cssText = 'width:100vw;height:100vh;border:none;margin:0;padding:0;display:block;';
    iframe.src = window.location.href;
    
    doc.body.appendChild(iframe);
    window.location.replace(panicUrl); 
};

function hideLoader() {
    const loaders = document.querySelectorAll('#global-loader, #loading-screen, .loader-wrapper, [id*="load"], [class*="load"]');
    loaders.forEach(loader => {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    hideLoader();
    window.renderCustomBookmarks();
    const chatProfileBox = document.getElementById('chat-profile-settings');
    const chatProfileHeader = document.getElementById('chat-profile-header');
    if (chatProfileBox && chatProfileHeader) {
        window.makeDraggable(chatProfileBox, chatProfileHeader);
    }

    const tabContainer = document.getElementById('browser-tab-container');
    if (tabContainer) {
        tabContainer.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                tabContainer.scrollLeft += e.deltaY;
            }
        });
    }
    
    window.updatePlayingAs();

    window.syncPrivateRooms = async function() {
        const privateList = document.getElementById('private-rooms-list');
        if (privateList) privateList.innerHTML = '';
        
        let validOwned = [];
        let validJoined = [];
        
        for (const key of myOwnedRooms) {
            const snap = await get(ref(db, `rooms/${key}/info`));
            if (snap.exists()) {
                validOwned.push(key);
                window.createSidebarButton(key);
                window.listenForRequests(key);
                window.watchForUnread(key);
            }
        }
        
        for (const key of joinedRooms) {
            const snap = await get(ref(db, `rooms/${key}/info`));
            if (snap.exists()) {
                validJoined.push(key);
                window.createSidebarButton(key);
                window.watchForUnread(key);
            }
        }
        
        myOwnedRooms = validOwned;
        joinedRooms = validJoined;
        window.saveRooms();
        window.updateMyKeysUI();
        window.updateRoomDropdown();
        window.loadRoom('public');
    };
    
    window.syncPrivateRooms();

    const host = window.location.hostname;
    const hostParts = host.split('.');
    let rootDomain = 'modestocainstallmentpayday.loan';

    if (host.includes('pages.dev') || host === 'localhost' || host === '0.0.0.0') {
        rootDomain = 'modestocainstallmentpayday.loan';
    } else if (hostParts.length >= 2) {
        rootDomain = hostParts.slice(-2).join('.');
    }
    R2_DOMAIN = `https://assets.${rootDomain}`;

    initMusicLibrary();

    const saveIframe = document.getElementById('save-manager-iframe');
    const currentTheme = localStorage.getItem('hyperion_theme') || 'default';
    if (saveIframe) saveIframe.src = R2_DOMAIN + '/save-manager.html?theme=' + currentTheme + '&v=' + Date.now();
    const mainSearchInput = document.getElementById('game-search');
    const gamesContainer = document.getElementById('main-game-grid');
    const webContainer = document.getElementById('web-container');
    const paginationControls = document.getElementById('pagination-controls');
    const proxyContainer = document.getElementById('proxy-container');
    const hubFavToggle = document.getElementById('hub-fav-toggle');
    const keyInput = document.getElementById('panic-key-input');
    const urlInput = document.getElementById('panic-url-input');
    const cloakToggle = document.getElementById('auto-cloak-toggle');
    const perfToggle = document.getElementById('performance-toggle');
    const antiCloseToggle = document.getElementById('anti-close-toggle');
    const profToggle = document.getElementById('profanity-toggle');
    const miniChatInput = document.getElementById("mini-chat-input");
    const fullChatInput = document.getElementById("full-chat-input");
    const profColor = document.getElementById('prof-color');
    const profUsername = document.getElementById('prof-username');
    const profEffect = document.getElementById('prof-effect');
    window.updateActiveEngineCard(proxyEngine);
    window.updateActiveProviderCard(localStorage.getItem('hyperion_game_provider') || 'hyperion');
    
    if(keyInput) keyInput.value = panicKey;
    if(urlInput) urlInput.value = panicUrl;
    if(cloakToggle) cloakToggle.checked = autoCloak;
    if(perfToggle) perfToggle.checked = performanceMode;
    if(antiCloseToggle) antiCloseToggle.checked = antiClose;
    if(performanceMode) document.body.classList.add('lite-mode');
    if(profToggle) profToggle.checked = profanityEnabled;

    const customBgInput = document.getElementById('custom-bg-color');
    const customAccentInput = document.getElementById('custom-accent-color');
    
    if (customBgInput) {
        customBgInput.value = localStorage.getItem('hyperion_custom_bg') || '#000000';
        customBgInput.addEventListener('input', (e) => {
            const color = e.target.value;
            document.documentElement.style.setProperty('--bg-main', color);
            document.documentElement.style.setProperty('--card-bg', color);
            document.documentElement.style.setProperty('--panel-bg', color);
            document.documentElement.style.setProperty('--sidebar-bg', color);
            document.documentElement.style.setProperty('--search-bg', color);
            localStorage.setItem('hyperion_custom_bg', color);
            window.updateVantaColors(null, color, getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim());
            syncIframeTheme();
        });
    }

    if (customAccentInput) {
        customAccentInput.value = localStorage.getItem('hyperion_custom_accent') || '#ffffff';
        customAccentInput.addEventListener('input', (e) => {
            const color = e.target.value;
            document.documentElement.style.setProperty('--text-main', color);
            document.documentElement.style.setProperty('--border-hover', color);
            localStorage.setItem('hyperion_custom_accent', color);
            window.updateVantaColors(null, getComputedStyle(document.documentElement).getPropertyValue('--bg-main').trim(), color);
            syncIframeTheme(); 
        });
    }

    window.resetCustomColors = function() {
        localStorage.removeItem('hyperion_custom_bg');
        localStorage.removeItem('hyperion_custom_accent');
        document.documentElement.style.removeProperty('--bg-main');
        document.documentElement.style.removeProperty('--card-bg');
        document.documentElement.style.removeProperty('--panel-bg');
        document.documentElement.style.removeProperty('--sidebar-bg');
        document.documentElement.style.removeProperty('--search-bg');
        document.documentElement.style.removeProperty('--text-main');
        document.documentElement.style.removeProperty('--border-hover');
        if (customBgInput) customBgInput.value = '#000000';
        if (customAccentInput) customAccentInput.value = '#ffffff';
        window.showPS5Notification("Colors Reset", "Restored theme defaults.", 3000);        
        setTimeout(() => {
            const newBg = getComputedStyle(document.documentElement).getPropertyValue('--bg-main').trim() || '#000000';
            const newAccent = getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim() || '#ffffff';
            window.updateVantaColors(localStorage.getItem('hyperion_theme') || 'default', newBg, newAccent);
            
            const savedBgImg = localStorage.getItem('hyperion_custom_bg_img');
            if (savedBgImg) window.applyCustomBgImage(savedBgImg);
        }, 50);
    };

    window.applyCustomBgImage = function(src) {
        const bg = document.getElementById('canvas-bg');
        if (src) {
            bg.style.backgroundImage = `url('${src}')`;
            bg.style.backgroundSize = 'cover';
            bg.style.backgroundPosition = 'center';
            bg.style.opacity = '1';
            
            if (window.vantaEffect) {
                window.vantaEffect.destroy();
                window.vantaEffect = null;
            }
        } else {
            bg.style.backgroundImage = 'none';
            if (!performanceMode) {
                window.updateVantaColors(localStorage.getItem('hyperion_theme') || 'default', localStorage.getItem('hyperion_custom_bg'), localStorage.getItem('hyperion_custom_accent'));
            }
        }
    };

    window.handleCustomBgUpload = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (file.size > 10 * 1024 * 1024) {
            event.target.value = '';
            return window.showPS5Notification("Error", "Image must be under 10MB.", 4000);
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                localStorage.setItem('hyperion_custom_bg_img', e.target.result);
                window.applyCustomBgImage(e.target.result);
                document.getElementById('custom-bg-url').value = '';
                event.target.value = ''; 
                window.showPS5Notification("Background Set", "Custom image applied.", 3000);
            } catch (err) {
                event.target.value = '';
                window.showPS5Notification("Error", "Browser storage full! Use a smaller image or paste a URL.", 4000);
            }
        };
        reader.readAsDataURL(file);
    };

    window.clearCustomBgImage = function() {
        localStorage.removeItem('hyperion_custom_bg_img');
        const urlInput = document.getElementById('custom-bg-url');
        if (urlInput) urlInput.value = '';
        window.applyCustomBgImage(null);
        window.showPS5Notification("Background Cleared", "Restored default theme.", 3000);
    };

    const bgUrlInput = document.getElementById('custom-bg-url');
    if (bgUrlInput) {
        const savedData = localStorage.getItem('hyperion_custom_bg_img') || '';
        bgUrlInput.value = savedData.startsWith('http') ? savedData : '';
        
        bgUrlInput.addEventListener('change', (e) => {
            const val = e.target.value.trim();
            if (val) {
                localStorage.setItem('hyperion_custom_bg_img', val);
                window.applyCustomBgImage(val);
                window.showPS5Notification("Background Set", "Custom URL applied.", 3000);
            } else {
                window.clearCustomBgImage();
            }
        });
    }

    const savedBgImg = localStorage.getItem('hyperion_custom_bg_img');
    if (savedBgImg) {
        window.applyCustomBgImage(savedBgImg);
    }

    if (keyInput) {
        keyInput.style.cursor = 'pointer';
        
        keyInput.addEventListener('click', () => {
            keyInput.value = 'Press any key';
        });

        keyInput.addEventListener('blur', () => {
            keyInput.value = panicKey === ' ' ? 'Space' : panicKey;
        });

        keyInput.addEventListener('keydown', (e) => {
            e.preventDefault();
            e.stopPropagation();

            panicKey = e.key === ' ' ? 'Space' : e.key;
            keyInput.value = panicKey;
            localStorage.setItem('panicKey', panicKey);
            keyInput.blur();

            if (typeof window.showPS5Notification === 'function') {
                window.showPS5Notification("Panic Key Saved", `Trigger key: ${panicKey}`, 3000);
            }
        });
    }

    if (urlInput) {
        urlInput.addEventListener('change', (e) => {
            let val = e.target.value.trim();
            if (!val) val = 'https://classroom.google.com';
            if (!val.startsWith('http://') && !val.startsWith('https://')) {
                val = 'https://' + val;
            }
            panicUrl = val;
            urlInput.value = panicUrl;
            localStorage.setItem('panicUrl', panicUrl);

            if (typeof window.showPS5Notification === 'function') {
                window.showPS5Notification("Panic URL Saved", panicUrl, 3000);
            }
        });
    }
    
    if(cloakToggle) cloakToggle.addEventListener('change', (e) => { autoCloak = e.target.checked; localStorage.setItem('autoCloak', autoCloak); });
    if (perfToggle) {
        perfToggle.addEventListener('change', (e) => { 
            performanceMode = e.target.checked; 
            localStorage.setItem('performanceMode', performanceMode); 
            
            const curTheme = localStorage.getItem('hyperion_theme') || 'default';
            const cBg = localStorage.getItem('hyperion_custom_bg');
            const cAcc = localStorage.getItem('hyperion_custom_accent');

            if (performanceMode) { 
                document.body.classList.add('lite-mode'); 
                if (window.vantaEffect) {
                    window.vantaEffect.destroy();
                    window.vantaEffect = null;
                }
                document.getElementById('canvas-bg').style.background = cBg || vantaThemes[curTheme]?.base || 'var(--bg-main)';
            } else { 
                document.body.classList.remove('lite-mode'); 
                window.updateVantaColors(curTheme, cBg, cAcc);
            } 
        });
    }
    if(antiCloseToggle) antiCloseToggle.addEventListener('change', (e) => { antiClose = e.target.checked; localStorage.setItem('antiClose', antiClose); });
    if(profToggle) profToggle.addEventListener('change', (e) => { profanityEnabled = e.target.checked; localStorage.setItem('profanityFilter', profanityEnabled); window.showPS5Notification("Filter Updated", "New messages will reflect this setting.", 4000); });
    if(profColor) profColor.addEventListener('input', (e) => { document.getElementById('prof-color-hex').innerText = e.target.value.toUpperCase(); window.updateEffectPreview(); });
    if(profUsername) profUsername.addEventListener('input', window.updateEffectPreview);
    if(profEffect) profEffect.addEventListener('change', window.updateEffectPreview);

    if (miniChatInput) {
        miniChatInput.addEventListener('input', (e) => window.handleEmojiAutocomplete(e, 'mini'));
        miniChatInput.addEventListener('keydown', (e) => {
            if (window.handleEmojiKeydown(e)) return;
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                window.handleSend(miniChatInput.value.trim(), 'mini');
            }
        });
    }
    if (fullChatInput) {
        fullChatInput.addEventListener('input', (e) => window.handleEmojiAutocomplete(e, 'full'));
        fullChatInput.addEventListener('keydown', (e) => {
            if (window.handleEmojiKeydown(e)) return;
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                window.handleSend(fullChatInput.value.trim(), 'full');
            }
        });
    }
    
    const proxySearchInput = document.getElementById('proxy-search');
    
    if (mainSearchInput) {
        mainSearchInput.addEventListener('mousedown', () => {
            mainSearchInput.classList.remove('splash-active');
            void mainSearchInput.offsetWidth; 
            mainSearchInput.classList.add('splash-active');
        });
        mainSearchInput.addEventListener('input', window.updateSearchFilter);
    }

    if (proxySearchInput) {
        proxySearchInput.addEventListener('mousedown', () => {
            proxySearchInput.classList.remove('splash-active');
            void proxySearchInput.offsetWidth; 
            proxySearchInput.classList.add('splash-active');
        });

        proxySearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = proxySearchInput.value.trim();
                if (!query) return;
                
                let finalUrl = '';
                if (query.includes('.') && !query.includes(' ')) {
                    finalUrl = query.startsWith('http') ? query : 'https://' + query;
                } else {
                    finalUrl = searchEngine + encodeURIComponent(query);
                }
                window.launchProxy(finalUrl);
            }
        });
    }

    const proxyBackBtn = document.getElementById('nav-back-btn');
    const proxyForwardBtn = document.getElementById('nav-forward-btn');
    const proxyReloadBtn = document.getElementById('nav-refresh-btn');
    const proxyHomeBtn = document.getElementById('nav-home-btn');
    const proxyUrlBar = document.getElementById('proxy-url-bar');
    const closeProxyBtn = document.getElementById('close-proxy');
    const fullscreenProxyBtn = document.getElementById('fullscreen-proxy');

    if (proxyBackBtn) proxyBackBtn.addEventListener('click', () => {
        try { document.getElementById('proxy-frame-' + window.activeTabId).contentWindow.history.back(); } catch (e) {}
    });

    if (proxyForwardBtn) proxyForwardBtn.addEventListener('click', () => {
        try { document.getElementById('proxy-frame-' + window.activeTabId).contentWindow.history.forward(); } catch (e) {}
    });

    if (proxyReloadBtn) proxyReloadBtn.addEventListener('click', () => {
        const activeTabObj = window.browserTabs.find(t => t.id === window.activeTabId);
        if (activeTabObj && activeTabObj.internalId) return; 
        
        try { 
            const iframe = document.getElementById('proxy-frame-' + window.activeTabId);
            if (!iframe) return;

            const cw = iframe.contentWindow;
            if (cw && cw.__uv$location) {
                cw.__uv$location.reload();
            } else if (cw && cw.__scramjet$location) {
                cw.__scramjet$location.reload();
            } else {
                cw.location.reload();
            }
        } catch (e) {
            const iframe = document.getElementById('proxy-frame-' + window.activeTabId);
            if (iframe) iframe.src = iframe.src; 
        }
    });

    if (proxyHomeBtn) proxyHomeBtn.addEventListener('click', () => {
        const activeContent = document.getElementById('proxy-content-' + window.activeTabId);
        if (!activeContent) return;
        const activeFrame = document.getElementById('proxy-frame-' + window.activeTabId);
        const ntp = activeContent.querySelector('.new-tab-page');
        
        const activeTabObj = window.browserTabs.find(t => t.id === window.activeTabId);
        if (activeTabObj && activeTabObj.internalId) {
            const modal = document.getElementById(activeTabObj.internalId);
            if (modal) {
                modal.classList.remove('modal-as-tab');
                modal.style.display = 'none';
                document.body.appendChild(modal);
            }
            activeTabObj.internalId = null;
        }

        if (activeFrame) {
            activeFrame.src = 'about:blank';
            activeFrame.style.display = 'none';
        }
        if (ntp) ntp.style.display = 'flex';
        
        const urlBar = document.getElementById('proxy-url-bar');
        if (urlBar) {
            urlBar.value = '';
            urlBar.readOnly = false;
        }
        
        if (activeTabObj) {
            activeTabObj.url = '';
            activeTabObj.title = 'New Tab';
        }
        window.renderBrowserTabs();
    });

    if (closeProxyBtn) closeProxyBtn.addEventListener('click', () => {
        const pCont = document.getElementById('proxy-container');
        if (pCont) pCont.style.setProperty('display', 'none', 'important');
        
        document.documentElement.classList.remove('proxy-active');
        document.body.classList.remove('proxy-active');
        
        window.applyExperienceMode(window.currentMode);
    });

    window.goProxyFullscreen = function() {
        const frameWrapper = document.getElementById('proxy-frame-wrapper');
        if (!frameWrapper) return;
        
        if (!document.fullscreenElement) {
            if (frameWrapper.requestFullscreen) {
                frameWrapper.requestFullscreen();
            } else if (frameWrapper.webkitRequestFullscreen) {
                frameWrapper.webkitRequestFullscreen();
            }
        }
    };

    if (fullscreenProxyBtn) {
        fullscreenProxyBtn.addEventListener('click', window.goProxyFullscreen);
    }

    if (proxyUrlBar) {
        proxyUrlBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = proxyUrlBar.value.trim();
                
                if (!query) {
                    document.getElementById('nav-home-btn')?.click();
                    return;
                }
                
                if (window.handleHyperionURL(query, window.activeTabId)) return; 
                
                let finalUrl = '';
                if (query.includes('.') && !query.includes(' ')) {
                    finalUrl = query.startsWith('http') ? query : 'https://' + query;
                } else {
                    finalUrl = searchEngine + encodeURIComponent(query);
                }

                const tabObj = window.browserTabs.find(t => t.id === window.activeTabId);
                if (tabObj && tabObj.internalId) {
                    const modal = document.getElementById(tabObj.internalId);
                    if (modal) {
                        modal.classList.remove('modal-as-tab');
                        modal.style.display = 'none';
                        document.body.appendChild(modal);
                    }
                    tabObj.internalId = null;
                }

                window.launchProxy(finalUrl, window.activeTabId);
            }
        });
    }

    document.querySelectorAll('#web-container .web-bookmark').forEach(card => {
        card.addEventListener('click', () => {
            const url = card.getAttribute('data-url');
            if (url) window.launchProxy(url);
        });
    });

    const grid = document.getElementById('main-game-grid');
    if (!grid) return;

    window.localHyperionGames = [
        { name: "2048", path: "/2048/index.html" },
        { name: "Angry Birds", path: "/angrybirds/index.html" },
        { name: "Awesome Tanks", path: "/awsometanks/index.html" },
        { name: "Basketball Stars", path: "/basketballstars/index.html" },
        { name: "Basketball Legends", path: "/basketballlegends/index.html" },
        { name: "Baldi's Basics", path: "/baldi-basics/index.html" },
        { name: "Buckshot Roulette", path: "/buckshot-roulette/index.html" },
        { name: "Cookie Clicker", path: "/Algebra-work/index.html" },
        { name: "Jetpack Joyride", path: "/jetpackjoyride/index.html" },
        { name: "Five Nights At Freddy's", path: "/fnaf/index.html" },
        { name: "Five Nights At Freddy's 2", path: "/fnaf2/index.html" },
        { name: "Five Nights At Freddy's 3", path: "/fnaf3/index.html" },
        { name: "Five Nights At Freddy's 4", path: "/fnaf4/index.html" },
        { name: "Retro Bowl", path: "/Google-Docs/index.html" },
        { name: "Hollow Knight", path: "/hollow-knight/index.html" },
        { name: "OvO", path: "/ovo/index.html" },
        { name: "Retro Bowl College", path: "/retro-bowl-college/index.html" },
        { name: "Riddle School", path: "/riddleschool/index.html" },
        { name: "Riddle School 2", path: "/riddleschool2/index.html" },
        { name: "Riddle School 3", path: "/riddleschool3/index.html" },
        { name: "Riddle School 4", path: "/riddleschool4/index.html" },
        { name: "Riddle School 5", path: "/riddleschool5/index.html" },
        { name: "Riddle School Transfer", path: "/riddleschooltransfer/index.html" },
        { name: "Riddle School Transfer 2", path: "/riddleschooltransfer2/index.html" },
        { name: "SM64", path: "/sm64/index.html" },
        { name: "Tiny Fishing", path: "/tiny-fishing/index.html" },
        { name: "This is the only level too", path: "/thisistheonlylevel/index.html" },
        { name: "The Impossible Quiz", path: "/impossible-quiz/index.html" },
        { name: "The Impossible Quiz 2", path: "/impossible-quiz2/index.html" },
        { name: "Zombie Rush", path: "/zombie-rush/index.html" },
        { name: "Eaglercraft 1.12", path: "/1.12/index.html" },
        { name: "Eaglercraft 1.5", path: "/1.5/index.html" },
        { name: "Eaglercraft 1.8.8", path: "/1.8/index.html" },
        { name: "10 Minutes Till Dawn", path: "/10minutestilldawn/index.html" },
        { name: "12 Mini Battles", path: "/12minibattles/index.html" },
        { name: "1 on 1 Soccer", path: "/1on1soccer/index.html" },
        { name: "1 on 1 Tennis", path: "/1on1tennis/index.html" },
        { name: "1v1.lol", path: "/1v1.lol/index.html" },
        { name: "2048 Cupcakes", path: "/2048cupcakes/index.html" },
        { name: "3D Flight Simulator", path: "/3Dflightsimulator/index.html" },
        { name: "8 Ball Classic", path: "/8ballclassic/index.html" },
        { name: "MC Alpha 1.2.6", path: "/Alpha_1.2.6/index.html" },
        { name: "MC Beta 1.3", path: "/Beta_1.3/index.html" },
        { name: "MC Indev", path: "/Indev/index.html" },
        { name: "Agario Lite", path: "/agariolite/index.html" },
        { name: "Age of War", path: "/ageofwar/index.html" },
        { name: "Age of War 2", path: "/ageofwar2/index.html" },
        { name: "Ages of Conflict", path: "/agesofconflict/index.html" },
        { name: "Among Us", path: "/amongus/index.html" },
        { name: "Angry Birds Showdown", path: "/angrybirdsshowdown/index.html" },
        { name: "Angry Birds Space", path: "/angrybirdsspace/index.html" },
        { name: "Awesometanks", path: "/awesometanks/index.html" },
        { name: "Awesome Tanks 2", path: "/awesometanks2/index.html" },
        { name: "Backrooms", path: "/backrooms/index.html" },
        { name: "Bacon May Die", path: "/baconmaydie/index.html" },
        { name: "Bad Ice Cream", path: "/badicecream/index.html" },
        { name: "Bad Ice Cream 2", path: "/badicecream2/index.html" },
        { name: "Bad Ice Cream 3", path: "/badicecream3/index.html" },
        { name: "Bad Parenting", path: "/badparenting/index.html" },
        { name: "Bad Piggies", path: "/badpiggies/index.html" },
        { name: "Baseball Bros", path: "/baseballbros/index.html" },
        { name: "Basket Bros", path: "/basketbros/index.html" },
        { name: "Basket Random", path: "/basketrandom/index.html" },
        { name: "BitLife", path: "/bitlife/index.html" },
        { name: "Bit Planes", path: "/bitplanes/index.html" },
        { name: "Blocky Snakes", path: "/blockysnakes/index.html" },
        { name: "Bloons TD", path: "/bloonsTD/index.html" },
        { name: "Bloons TD 2", path: "/bloonsTD2/index.html" },
        { name: "Bloons TD 3", path: "/bloonsTD3/index.html" },
        { name: "Bloons TD 4", path: "/bloonsTD4/index.html" },
        { name: "Bloons TD 5", path: "/bloonsTD5/index.html" },
        { name: "Bloxorz", path: "/bloxorz/index.html" },
        { name: "Blumgi Racers", path: "/blumgiracers/index.html" },
        { name: "Blumgi Rocket", path: "/blumgirocket/index.html" },
        { name: "Bob the Robber", path: "/bobtherobber/index.html" },
        { name: "Bob the Robber 2", path: "/bobtherobber2/index.html" },
        { name: "Bob the Robber 5", path: "/bobtherobber5/index.html" },
        { name: "Bouncy Motors", path: "/bouncymotors/index.html" },
        { name: "Bowmasters", path: "/bowmasters/index.html" },
        { name: "Boxing Random", path: "/boxingrandom/index.html" },
        { name: "Breaking The Bank", path: "/breakingthebank/index.html" },
        { name: "Bubble Shooter", path: "/bubbleshooter/index.html" },
        { name: "Candy Crush", path: "/candycrush/index.html" },
        { name: "Capybara Clicker", path: "/capybaraclicker/index.html" },
        { name: "Car Drawing", path: "/cardrawing/index.html" },
        { name: "Car King Arena", path: "/carkingarena/index.html" },
        { name: "Chess", path: "/chess/index.html" },
        { name: "Choppy Orc", path: "/choppyorc/index.html" },
        { name: "CircloO", path: "/circloO/index.html" },
        { name: "CircloO 2", path: "/circloO2/index.html" },
        { name: "Clash of Vikings", path: "/clashofvikings/index.html" },
        { name: "Cleanup.io", path: "/cleanupio/index.html" },
        { name: "Cluster Rush", path: "/clusterrush/index.html" },
        { name: "Crazy Cars", path: "/crazycars/index.html" },
        { name: "Crazy Cattle 3D", path: "/crazycattle3D/index.html" },
        { name: "Crazy Crash Landing", path: "/crazycrashlanding/index.html" },
        { name: "Crazy Motorcycle", path: "/crazymotorcycle/index.html" },
        { name: "Crossy Road", path: "/crossyroad/index.html" },
        { name: "Cut the Rope", path: "/cuttherope/index.html" },
        { name: "Dadish", path: "/dadish/index.html" },
        { name: "Dadish 2", path: "/dadish2/index.html" },
        { name: "Dadish 3", path: "/dadish3/index.html" },
        { name: "Death Chase", path: "/deathchase/index.html" },
        { name: "Death Run 3D", path: "/deathrun3D/index.html" },
        { name: "Demolition Derby", path: "/demolitionderbycrashracing/index.html" },
        { name: "Doodle Jump", path: "/doodlejump/index.html" },
        { name: "Draw Climber", path: "/drawclimber/index.html" },
        { name: "Dreadhead Parkour", path: "/dreadheadparkour/index.html" },
        { name: "Drift Boss", path: "/driftboss/index.html" },
        { name: "Drive Mad", path: "/drivemad/index.html" },
        { name: "Duck Life", path: "/ducklife/index.html" },
        { name: "Duck Life 2", path: "/ducklife2/index.html" },
        { name: "Duck Life 3", path: "/ducklife3/index.html" },
        { name: "Duck Life 4", path: "/ducklife4/index.html" },
        { name: "Duck Life 5", path: "/ducklife5/index.html" },
        { name: "Ducklings.io", path: "/ducklingsio/index.html" },
        { name: "Eagle Ride", path: "/eagleride/index.html" },
        { name: "Earn to Die", path: "/earntodie/index.html" },
        { name: "Earn to Die 2", path: "/earntodie2/index.html" },
        { name: "Eggy Car", path: "/eggycar/index.html" },
        { name: "Elastic Face", path: "/elasticface/index.html" },
        { name: "Escape Road", path: "/escaperoad/index.html" },
        { name: "Escape Road 2", path: "/escaperoad2/index.html" },
        { name: "Escaping the Prison", path: "/escapingtheprison/index.html" },
        { name: "Evil Glitch", path: "/evilglitch/index.html" },
        { name: "Fancy Pants Adventure", path: "/fancypantsadventure/index.html" },
        { name: "Fancy Pants Adventure 2", path: "/fancypantsadventure2/index.html" },
        { name: "Fireboy and Watergirl", path: "/fireboyandwatergirl/index.html" },
        { name: "Fireboy and Watergirl 2", path: "/fireboyandwatergirl2/index.html" },
        { name: "Fireboy and Watergirl 3", path: "/fireboyandwatergirl3/index.html" },
        { name: "Fireboy and Watergirl 4", path: "/fireboyandwatergirl4/index.html" },
        { name: "Flappy Bird", path: "/flappybird/index.html" },
        { name: "Flood Runner 2", path: "/floodrunner2/index.html" },
        { name: "Flood Runner 3", path: "/floodrunner3/index.html" },
        { name: "Flood Runner 4", path: "/floodrunner4/index.html" },
        { name: "Football Bros", path: "/footballbros/index.html" },
        { name: "Football Legends", path: "/footballlegends/index.html" },
        { name: "Free Rider 3", path: "/freerider3/index.html" },
        { name: "Fruit Ninja", path: "/fruitninja/index.html" },
        { name: "Funny Battle", path: "/funnybattle/index.html" },
        { name: "Funny Battle 2", path: "/funnybattle2/index.html" },
        { name: "Funny Mad Racing", path: "/funnymadracing/index.html" },
        { name: "Funny Shooter 2", path: "/funnyshooter2/index.html" },
        { name: "Geometry Dash", path: "/geometrydash/index.html" },
        { name: "Geometry Dash Lite", path: "/geometrydashlite/index.html" },
        { name: "Geometry Vibes", path: "/geometryvibes/index.html" },
        { name: "Getaway Shootout", path: "/getawayshootout/index.html" },
        { name: "Get On Top", path: "/getontop/index.html" },
        { name: "Gladihoppers", path: "/gladihoppers/index.html" },
        { name: "Google Baseball", path: "/googlebaseball/index.html" },
        { name: "Google Dino", path: "/googledino/index.html" },
        { name: "Granny", path: "/granny/index.html" },
        { name: "Granny 2", path: "/granny2/index.html" },
        { name: "Guess Their Answer", path: "/guesstheiranswer/index.html" },
        { name: "Hanger 2", path: "/hanger2/index.html" },
        { name: "Happy Wheels", path: "/happywheels/index.html" },
        { name: "Helix Jump", path: "/helixjump/index.html" },
        { name: "Highway Traffic", path: "/highwaytraffic/index.html" },
        { name: "Hill Climb Racing Lite", path: "/hillclimbracinglite/index.html" },
        { name: "Hole.io", path: "/holeio/index.html" },
        { name: "Hotline Miami", path: "/hotline-miami/index.html" },
        { name: "House of Hazards", path: "/houseofhazards/index.html" },
        { name: "Hover Racer Drive", path: "/hoverracerdrive/index.html" },
        { name: "Idle Breakout", path: "/idlebreakout/index.html" },
        { name: "Iron Snout", path: "/ironsnout/index.html" },
        { name: "Johnny Trigger", path: "/johnnytrigger/index.html" },
        { name: "Jumping Shell", path: "/jumpingshell/index.html" },
        { name: "Karate Bros", path: "/karatebros/index.html" },
        { name: "Kart Bros", path: "/kartbros/index.html" },
        { name: "Learn to Fly", path: "/learntofly/index.html" },
        { name: "Learn to Fly 2", path: "/learntofly2/index.html" },
        { name: "Learn to Fly 3", path: "/learntofly3/index.html" },
        { name: "Learn to Fly Idle", path: "/learntoflyidle/index.html" },
        { name: "Level Devil", path: "/leveldevil/index.html" },
        { name: "Madalin Stunt Cars 2", path: "/madalinstuntcars2/index.html" },
        { name: "Melon Playground", path: "/melonplayground/index.html" },
        { name: "Merge Round Racers", path: "/mergeroundracers/index.html" },
        { name: "Minesweeper", path: "/minesweeper/index.html" },
        { name: "Monkey Mart", path: "/monkeymart/index.html" },
        { name: "Monster Tracks", path: "/monstertracks/index.html" },
        { name: "Moto X3M", path: "/motox3m/index.html" },
        { name: "Moto X3M 2", path: "/motox3m2/index.html" },
        { name: "Moto X3M 3", path: "/motox3m3/index.html" },
        { name: "Moto X3M Pool Party", path: "/motox3mpoolparty/index.html" },
        { name: "Motox 3 Mspookyland", path: "/motox3mspookyland/index.html" },
        { name: "Moto X3M Winter", path: "/motox3mwinter/index.html" },
        { name: "Noob Miner", path: "/noobminer/index.html" },
        { name: "Opposite Day", path: "/oppositeday/index.html" },
        { name: "OvO 2", path: "/ovo2/index.html" },
        { name: "OvO 3 Dimensions", path: "/ovo3dimensions/index.html" },
        { name: "Pac-Man", path: "/pacman/index.html" },
        { name: "Papa's Bakeria", path: "/papasbakeria/index.html" },
        { name: "Papa's Burgeria", path: "/papasburgeria/index.html" },
        { name: "Papa's Cheeseria", path: "/papascheeseria/index.html" },
        { name: "Papa's Cupcakeria", path: "/papascupcakeria/index.html" },
        { name: "Papa's Donuteria", path: "/papasdonuteria/index.html" },
        { name: "Papa's Freezeria", path: "/papasfreezeria/index.html" },
        { name: "Papa's Hot Doggeria", path: "/papashotdoggeria/index.html" },
        { name: "Papa's Pancakeria", path: "/papaspancakeria/index.html" },
        { name: "Papa's Pastaria", path: "/papaspastaria/index.html" },
        { name: "Papa's Pizzeria", path: "/papaspizzeria/index.html" },
        { name: "Papa's Scooperia", path: "/papasscooperia/index.html" },
        { name: "Papa's Sushiria", path: "/papassushiria/index.html" },
        { name: "Papa's Tacomia", path: "/papastacomia/index.html" },
        { name: "Papa's Wingeria", path: "/papaswingeria/index.html" },
        { name: "Paper.io 2", path: "/paperio2/index.html" },
        { name: "Parking Fury", path: "/parkingfury/index.html" },
        { name: "Parking Fury 2", path: "/parkingfury2/index.html" },
        { name: "Parking Fury 3", path: "/parkingfury3/index.html" },
        { name: "Pico's School", path: "/picosschool/index.html" },
        { name: "Ping Pong Chaos", path: "/pingpongchaos/index.html" },
        { name: "Pixel Speedrun", path: "/pixelspeedrun/index.html" },
        { name: "Plants vs Zombies", path: "/plantsvszombies/index.html" },
        { name: "Plonky", path: "/plonky/index.html" },
        { name: "PolyTrack", path: "/polytrack/index.html" },
        { name: "Poor Bunny", path: "/poorbunny/index.html" },
        { name: "Pou", path: "/pou/index.html" },
        { name: "Ragdoll Archers", path: "/ragdollarchers/index.html" },
        { name: "Ragdoll Hit", path: "/ragdollhit/index.html" },
        { name: "Ragdoll Soccer", path: "/ragdollsoccer/index.html" },
        { name: "Red Ball 4 Vol. 1", path: "/redball4vol1/index.html" },
        { name: "Red Ball 4 Vol. 2", path: "/redball4vol2/index.html" },
        { name: "Red Ball 4 Vol. 3", path: "/redball4vol3/index.html" },
        { name: "Retro Highway", path: "/retrohighway/index.html" },
        { name: "Retro Ping Pong", path: "/retropingpong/index.html" },
        { name: "Riddlescchool 3", path: "/riddlescchool3/index.html" },
        { name: "Rocket Soccer Derby", path: "/rocketsoccerderby/index.html" },
        { name: "Rooftop Snipers", path: "/rooftopsnipers/index.html" },
        { name: "Rooftop Snipers 2", path: "/rooftopsnipers2/index.html" },
        { name: "Repo", path: "/repo/index.html" },
        { name: "Run", path: "/run/index.html" },
        { name: "Run 2", path: "/run2/index.html" },
        { name: "Run 3", path: "/run3/index.html" },
        { name: "Sand Game", path: "/sandgame/index.html" },
        { name: "Short Life", path: "/shortlife/index.html" },
        { name: "Slope", path: "/slope/index.html" },
        { name: "Slope 2 Player", path: "/slope2player/index.html" },
        { name: "Slope 3", path: "/slope3/index.html" },
        { name: "Slow Roads", path: "/slowroads/index.html" },
        { name: "Smash Karts", path: "https://smashkarts.io/" },
        { name: "Super Mario 63", path: "/sm63/index.html" },
        { name: "Snowball.io", path: "/snowballio/index.html" },
        { name: "Snow Rider", path: "/snowrider/index.html" },
        { name: "Snow Road", path: "/snowroad/index.html" },
        { name: "Soccer Bros", path: "/soccerbros/index.html" },
        { name: "Soccer Random", path: "/soccerrandom/index.html" },
        { name: "Spacebar Clicker", path: "/spacebarclicker/index.html" },
        { name: "Space is Key", path: "/spaceiskey/index.html" },
        { name: "Space is Key 2", path: "/spaceiskey2/index.html" },
        { name: "Space Waves", path: "/spacewaves/index.html" },
        { name: "Speed Stars", path: "/speedstars/index.html" },
        { name: "Sprunki", path: "/sprunki/index.html" },
        { name: "Sonic.exe", path: "/sonic.exe/index.html" },
        { name: "Stack", path: "/stack/index.html" },
        { name: "Stacktris", path: "/stacktris/index.html" },
        { name: "State.io", path: "/stateio/index.html" },
        { name: "Stick Archers Battle", path: "/stickarchersbattle/index.html" },
        { name: "Stick Fighter", path: "/stickfighter/index.html" },
        { name: "Stickman Hook", path: "/stickmanhook/index.html" },
        { name: "Stick Merge", path: "/stickmerge/index.html" },
        { name: "Subway Surfers Beijing", path: "/subwaysurfersbeijing/index.html" },
        { name: "Subway Surfers Havana", path: "/subwaysurfershavana/index.html" },
        { name: "Subway Surfers San Francisco", path: "/subwaysurferssanfrancisco/index.html" },
        { name: "Super Bike The Champion", path: "/superbikethechampion/index.html" },
        { name: "SUPERHOT", path: "/superhot/index.html" },
        { name: "Super Liquid Soccer", path: "/superliquidsoccer/index.html" },
        { name: "Super Star Car", path: "/superstarcar/index.html" },
        { name: "Table Tennis World Tour", path: "/tabletennisworldtour/index.html" },
        { name: "Tag", path: "/tag/index.html" },
        { name: "Tap Road", path: "/taproad/index.html" },
        { name: "Temple of Boom", path: "/templeofboom/index.html" },
        { name: "Temple Run 2", path: "/templerun2/index.html" },
        { name: "Territorial.io", path: "/territorialio/index.html" },
        { name: "There Is No Game", path: "/thereisnog/index.html" },
        { name: "They Are Coming", path: "/theyarecoming/index.html" },
        { name: "Time Shooter 2", path: "/timeshooter2/index.html" },
        { name: "Time Shooter 3", path: "/timeshooter3/index.html" },
        { name: "Tomb of the Mask", path: "/tombofthemask/index.html" },
        { name: "Trap the Cat", path: "/trapthecat/index.html" },
        { name: "Trivia Crack", path: "/triviacrack/index.html" },
        { name: "Tube Jumpers", path: "/tubejumpers/index.html" },
        { name: "Tunnel Rush", path: "/tunnelrush/index.html" },
        { name: "Unicycle Hero", path: "/unicyclehero/index.html" },
        { name: "Vex 4", path: "/vex4/index.html" },
        { name: "Vex 5", path: "/vex5/index.html" },
        { name: "Vex 6", path: "/vex6/index.html" },
        { name: "Vex 7", path: "/vex7/index.html" },
        { name: "Vex 8", path: "/vex8/index.html" },
        { name: "Vex X3M", path: "/vexx3m/index.html" },
        { name: "Vex X3M 2", path: "/vexx3m2/index.html" },
        { name: "Volley Random", path: "/volleyrandom/index.html" },
        { name: "War the Knights", path: "/wartheknights/index.html" },
        { name: "We Become What We Behold", path: "/webecomewhatwebehold/index.html" },
        { name: "Wheelie Bike", path: "/wheeliebike/index.html" },
        { name: "Wheely", path: "/wheely/index.html" },
        { name: "Wheely 2", path: "/wheely2/index.html" },
        { name: "Wheely 3", path: "/wheely3/index.html" },
        { name: "Wheely 4", path: "/wheely4/index.html" },
        { name: "Wheely 5", path: "/wheely5/index.html" },
        { name: "Wheely 6", path: "/wheely6/index.html" },
        { name: "Wheely 7", path: "/wheely7/index.html" },
        { name: "Wheely 8", path: "/wheely8/index.html" },
        { name: "Wordle Unlimited", path: "/wordleunlimited/index.html" },
        { name: "World's Hardest Game", path: "/worldshardestgame/index.html" },
        { name: "World's Hardest Game 2", path: "/worldshardestgame2/index.html" },
        { name: "World's Hardest Game 3", path: "/worldshardestgame3/index.html" },
        { name: "Wrestle Bros", path: "/wrestlebros/index.html" }
    ];

    window.updateSearchFilter = function() {
        const query = document.getElementById('game-search')?.value.toLowerCase().trim() || "";
        filteredGames = allGamesArray.filter(g => {
            const matchesSearch = g.name.toLowerCase().includes(query);
            const matchesFav = !showingFavorites || favoriteGames.includes(g.path);
            return matchesSearch && matchesFav;
        });
        window.renderPage(1);
    };

    const cardsPerPage = 30;
    let currentPage = 1;

    window.renderPage = function(page) {
        currentPage = page;
        const startIndex = (page - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;
        const pageGames = filteredGames.slice(startIndex, endIndex);

        let html = '';
        pageGames.forEach(game => {
            const safeName = game.name.replace(/'/g, "\\'");
            html += `<div class="card" onclick="window.launchGame('${game.path}', '${safeName}')" style="display: flex;">
                        <h3>${game.name}</h3>
                     </div>`;
        });
        
        const gridEl = document.getElementById('main-game-grid');
        if (gridEl) gridEl.innerHTML = html;
        
        renderPaginationUI();
    };

    function renderPaginationUI() {
        const pagEl = document.getElementById('pagination-controls');
        if (!pagEl) return;
        pagEl.innerHTML = '';
        const totalPages = Math.ceil(filteredGames.length / cardsPerPage);
        
        if (totalPages <= 1) return; 

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.onclick = () => {
                window.renderPage(i);
                const sw = document.querySelector('.search-wrapper');
                if(sw) sw.scrollIntoView({ behavior: 'smooth', block: 'start' });
            };
            pagEl.appendChild(btn);
        }
    }

    window.refreshHubQuote = function() {
        const quoteText = `"${hubQuotes[Math.floor(Math.random() * hubQuotes.length)]}"`;
        const proxyQuote = document.getElementById('hub-quote-display');
        const gamesQuote = document.getElementById('games-quote-display');
        
        if (proxyQuote) proxyQuote.innerText = quoteText;
        if (gamesQuote) gamesQuote.innerText = quoteText;
    };
    window.refreshHubQuote();

    ['full', 'mini'].forEach(mode => {
        const input = document.getElementById(`${mode}-gif-search`);
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    window.searchGifs(input.value.trim(), mode);
                }
            });
        }
    });

    window.setGameProvider(localStorage.getItem('hyperion_game_provider') || 'hyperion');
    
    if (mainSearchInput) mainSearchInput.addEventListener('input', window.updateSearchFilter);
});

if (document.readyState !== 'loading') {
    hideLoader();
}
setTimeout(hideLoader, 500);

window.updateVantaColors(savedTheme, customBg, customAccent);
    
let allMusicTracks = [];
let currentTrackList = [];
let currentTrackIndex = 0;
let isAudioPlaying = false;
let isShuffle = false;
let isLoop = false;
let selectedArtistFilter = 'ALL';
let selectedAlbumFilter = 'ALL';

const audioPlayer = document.getElementById('global-audio-player');
const playPauseBtn = document.getElementById('music-play-pause');
const progressBarFill = document.getElementById('music-progress-fill');
const progressContainer = document.getElementById('music-progress-bg');
const timeCurrent = document.getElementById('music-time-current');
const timeTotal = document.getElementById('music-time-total');
const trackTitle = document.getElementById('music-track-title');
const trackArtist = document.getElementById('music-track-artist');
const trackArt = document.getElementById('music-album-art');
const ambientBg = document.getElementById('music-ambient-bg');

const folderToArtist = {
    "kanye": "Kanye West",
    "travis_scott": "Travis Scott",
    "carti": "Playboi Carti",
    "yeat": "Yeat",
    "zach_bryan": "Zach Bryan",
    "nbayoungboy": "NBA YoungBoy",
    "nle_choppa": "NLE Choppa",
    "micheal_jackson": "Michael Jackson",
    "drake": "Drake",
    "taylor_swift": "Taylor Swift",
    "ken_carson": "Ken Carson"
};

const artistAvatars = {
    "Kanye West": "kanye_west.jpg",
    "Travis Scott": "travis_scott.jpg",
    "Playboi Carti": "playboi_carti.jpg",
    "Yeat": "yeat.jpg",
    "Zach Bryan": "zach_bryan.jpg",
    "NBA YoungBoy": "nba_youngboy.jpg",
    "NLE Choppa": "nle_choppa.jpg",
    "Michael Jackson": "michael_jackson.jpg",
    "Drake": "drake.jpg",
    "Taylor Swift": "taylor_swift.jpg",
    "Ken Carson": "ken_carson.jpg"
};

function cleanTrackTitle(title) {
    if (!title) return "Unknown";
    let clean = title.replace(/[\(\[].*?[\)\]]/g, '').trim();
    if (clean.startsWith("aud_")) return clean.substring(0, 12) + "..."; 
    return clean || title;
}

async function initMusicLibrary() {
    try {
        const res = await fetch(`${R2_DOMAIN}/sounds/master_tracks.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        let rawTracks = await res.json();
        
        allMusicTracks = rawTracks.map(t => {
            const folderPrefix = t.file.split('/')[0].toLowerCase();
            const trueArtist = folderToArtist[folderPrefix] || "Unknown Artist";
            
            return {
                ...t,
                artist: trueArtist,
                cleanTitle: cleanTrackTitle(t.title)
            };
        }).filter(t => t.artist !== "Unknown Artist");
        
        currentTrackList = [...allMusicTracks];
        buildArtistPills();
        window.applyMusicSearchFilter();
    } catch (e) {}
}

window.loadAndPlayTrack = function(track) {
    if (!track || !audioPlayer) return;
    audioPlayer.src = `${R2_DOMAIN}/sounds/${track.file}`;
    
    if (trackTitle) trackTitle.innerText = track.cleanTitle || "Unknown Title";
    if (trackArtist) trackArtist.innerText = track.artist || "Unknown Artist";
    
    const defaultArt = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23737373'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E";
    const artUrl = track.art ? `${R2_DOMAIN}/sounds/${track.art}` : defaultArt;
    if (trackArt) trackArt.src = artUrl;
    
    const ambientEnabled = localStorage.getItem('hyperion_ambient_music') !== 'false';
    if (ambientBg) {
        ambientBg.style.backgroundImage = `url('${artUrl}')`;
        ambientBg.style.opacity = ambientEnabled && track.art ? "0.45" : "0";
    }

    audioPlayer.play().then(() => {
        isAudioPlaying = true;
        updatePlayPauseUI();
        renderMusicModalList(currentTrackList);
    }).catch(e => {
        isAudioPlaying = false;
        updatePlayPauseUI();
    });
};

function updatePlayPauseUI() {
    if (!playPauseBtn) return;
    playPauseBtn.innerHTML = isAudioPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
}

function formatAudioTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function buildAlbumGrid(tracks) {
    const grid = document.getElementById('music-album-grid');
    const title = document.getElementById('spotify-albums-title');
    if (!grid || !title) return;

    const albums = {};
    tracks.forEach(t => {
        if (t.album && t.album !== "Unknown Album") {
            let normName = t.album.trim().toLowerCase();
            if (!albums[normName]) {
                albums[normName] = { art: t.art, artist: t.artist, name: t.album.trim() };
            }
        }
    });

    let albumList = Object.values(albums);
    
    if (selectedArtistFilter === 'ALL') {
        albumList = albumList.slice(0, 15);
    }
    
    if (albumList.length === 0) {
        grid.style.display = 'none';
        title.style.display = 'none';
        return;
    }

    grid.style.display = 'flex';
    title.style.display = 'block';

    let html = '';
    albumList.forEach(al => {
        const defaultArt = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23737373'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E";
        const artSrc = al.art ? `${R2_DOMAIN}/sounds/${al.art}` : defaultArt;
        
        html += `
            <div class="album-card" onclick="window.filterMusicByAlbum('${al.name.replace(/'/g, "\\'")}')">
                <img src="${artSrc}" alt="Album Art" onerror="this.onerror=null; this.src='${defaultArt}';">
                <div class="album-card-info">
                    <strong>${window.escapeHTML(al.name)}</strong>
                    <span>${window.escapeHTML(al.artist)}</span>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
}

function renderMusicModalList(tracks) {
    const container = document.getElementById('music-track-list');
    if (!container) return;
    if (!tracks || tracks.length === 0) {
        container.innerHTML = '<div class="music-list-loading">No tracks found.</div>';
        return;
    }

    const displayTracks = tracks.slice(0, 100);

    let html = '';
    displayTracks.forEach((track, index) => {
        const isCurrent = audioPlayer && audioPlayer.src.endsWith(encodeURI(track.file));
        const defaultArt = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23737373'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E";
        const artSrc = track.art ? `${R2_DOMAIN}/sounds/${track.art}` : defaultArt;
        
        html += `
            <div class="music-row ${isCurrent ? 'active-track' : ''}" onclick="window.loadAndPlayTrackFromModal('${track.file.replace(/'/g, "\\'")}')">
                <span class="music-row-index">${index + 1}</span>
                <div class="music-row-title-wrapper">
                    <img src="${artSrc}" class="music-row-thumb" onerror="this.onerror=null; this.src='${defaultArt}';">  
                    <div class="music-row-title-text">
                        <strong>${window.escapeHTML(track.cleanTitle)}</strong>
                    </div>
                </div>
                <span class="music-row-artist">${window.escapeHTML(track.artist)}</span>
                <span class="music-row-action"><i class="fa-solid fa-play music-row-play-icon"></i></span>
            </div>
        `;
    });
    
    if (tracks.length > 100) {
        html += `<div class="music-list-loading" style="padding: 20px;">Showing top 100 results. Use search or click an album to narrow down.</div>`;
    }
    
    container.innerHTML = html;
}

function buildArtistPills() {
    const pillContainer = document.getElementById('music-artist-pills');
    if (!pillContainer) return;
    
    const artists = Object.keys(artistAvatars).sort();
    
    let html = `
        <div class="artist-circle ${selectedArtistFilter === 'ALL' ? 'active' : ''}" onclick="window.filterMusicByArtist('ALL')">
            <div class="artist-circle-img" style="background:#1db954; color:#000;"><i class="fa-solid fa-music"></i></div>
            <span>All Artists</span>
        </div>
    `;
    
    artists.forEach(artist => {
        const localFileName = artistAvatars[artist];
        const initial = artist.charAt(0).toUpperCase();
        
        let imgSrc = localFileName.startsWith('http') 
            ? localFileName 
            : `${R2_DOMAIN}/sounds/artist_avatars/${localFileName}`;
            
        const imgHtml = localFileName ? `<img src="${imgSrc}" alt="${window.escapeHTML(artist)}" onerror="this.parentElement.innerHTML='${initial}';">` : initial;
            
        html += `
            <div class="artist-circle ${selectedArtistFilter === artist ? 'active' : ''}" onclick="window.filterMusicByArtist('${artist.replace(/'/g, "\\'")}')">
                <div class="artist-circle-img">${imgHtml}</div>
                <span>${window.escapeHTML(artist)}</span>
            </div>
        `;
    });
    pillContainer.innerHTML = html;
}

window.filterMusicByArtist = function(artist) {
    selectedArtistFilter = artist;
    selectedAlbumFilter = 'ALL';
    buildArtistPills();
    window.applyMusicSearchFilter();
};

window.filterMusicByAlbum = function(album) {
    selectedAlbumFilter = album;
    window.applyMusicSearchFilter();
};

window.applyMusicSearchFilter = function() {
    const query = document.getElementById('music-library-search')?.value.toLowerCase().trim() || "";
    let filtered = allMusicTracks.filter(t => {
        const matchesArtist = selectedArtistFilter === 'ALL' || t.artist === selectedArtistFilter;
        const matchesAlbum = selectedAlbumFilter === 'ALL' || t.album === selectedAlbumFilter;
        const matchesSearch = t.cleanTitle.toLowerCase().includes(query) || t.artist.toLowerCase().includes(query);
        return matchesArtist && matchesAlbum && matchesSearch;
    });
    
    buildAlbumGrid(filtered);
    renderMusicModalList(filtered);
};

window.loadAndPlayTrackFromModal = function(file) {
    const track = allMusicTracks.find(t => t.file === file);
    if (track) {
        currentTrackList = allMusicTracks;
        currentTrackIndex = allMusicTracks.findIndex(t => t.file === file);
        window.loadAndPlayTrack(track);
    }
};

if (playPauseBtn && audioPlayer) {
    playPauseBtn.addEventListener('click', () => {
        if (!audioPlayer.src && currentTrackList.length > 0) return window.loadAndPlayTrack(currentTrackList[0]);
        audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
        isAudioPlaying = !audioPlayer.paused;
        updatePlayPauseUI();
    });
}

if (audioPlayer) {
    audioPlayer.addEventListener('timeupdate', () => {
        if (!audioPlayer.duration || !progressBarFill) return;
        progressBarFill.style.width = `${(audioPlayer.currentTime / audioPlayer.duration) * 100}%`;
        if (timeCurrent) timeCurrent.innerText = formatAudioTime(audioPlayer.currentTime);
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        if (timeTotal) timeTotal.innerText = formatAudioTime(audioPlayer.duration);
    });

    audioPlayer.addEventListener('ended', () => {
        isLoop ? (audioPlayer.currentTime = 0, audioPlayer.play()) : window.playNextTrack();
    });
}

if (progressContainer && audioPlayer) {
    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        audioPlayer.currentTime = ((e.clientX - rect.left) / rect.width) * audioPlayer.duration;
    });
}

window.playNextTrack = function() {
    if (currentTrackList.length === 0) return;
    currentTrackIndex = isShuffle ? Math.floor(Math.random() * currentTrackList.length) : (currentTrackIndex + 1) % currentTrackList.length;
    window.loadAndPlayTrack(currentTrackList[currentTrackIndex]);
};

window.playPrevTrack = function() {
    if (currentTrackList.length === 0) return;
    currentTrackIndex = (currentTrackIndex - 1 + currentTrackList.length) % currentTrackList.length;
    window.loadAndPlayTrack(currentTrackList[currentTrackIndex]);
};

window.triggerPanic = function() {
    let dest = (localStorage.getItem('panicUrl') || panicUrl || 'https://classroom.google.com').trim();
    if (!dest.startsWith('http://') && !dest.startsWith('https://')) {
        dest = 'https://' + dest;
    }
    window.location.replace(dest);
};

function handlePanicKey(e) {
    if (document.activeElement && document.activeElement.id === 'panic-key-input') return;

    const currentKey = localStorage.getItem('panicKey') || panicKey || 'Escape';
    const pressed = e.key === ' ' ? 'Space' : e.key;

    if (pressed === currentKey || e.key === currentKey) {
        e.preventDefault();
        e.stopPropagation();
        window.triggerPanic();
    }
}

window.addEventListener('keydown', handlePanicKey, true);

window.attachPanicToFrame = function(frameEl) {
    if (!frameEl) return;
    try {
        frameEl.addEventListener('load', () => {
            try {
                const frameDoc = frameEl.contentDocument || frameEl.contentWindow?.document;
                if (frameDoc) {
                    frameDoc.removeEventListener('keydown', handlePanicKey, true);
                    frameDoc.addEventListener('keydown', handlePanicKey, true);
                }
            } catch (err) {}
        });
    } catch (e) {}
};

window.handleHyperionURL = function(url, currentTabId) {
    const query = url.trim().toLowerCase();
    if (query.startsWith('hyperion://')) {
        const target = query.replace('hyperion://', '');
        
        if (['settings', 'chat', 'music'].includes(target)) {
            const title = target.charAt(0).toUpperCase() + target.slice(1);
            const tabObj = window.browserTabs.find(t => t.id === currentTabId);
            if (tabObj) {
                tabObj.internalId = `${target}-modal`;
                tabObj.title = title;
                tabObj.url = '';
                window.switchBrowserTab(currentTabId);
            } else {
                window.openInternalTab(`${target}-modal`, title);
            }
            return true;
        } else if (target === 'discord') {
            window.openModal('discord-modal');
            const activeTab = window.browserTabs.find(t => t.id === currentTabId);
            if (activeTab) {
                const urlBar = document.getElementById('proxy-url-bar');
                if (urlBar) urlBar.value = activeTab.internalId ? `hyperion://${activeTab.title.toLowerCase()}` : (activeTab.url || '');
            }
            return true;
        }
    }
    return false;
};

window.promptGrantBadge = function(targetDeviceId) {
    if (!targetDeviceId) return window.showPS5Notification("Error", "Old message with no device ID.", 4000);
    
    document.getElementById('badge-target-device').value = targetDeviceId;
    document.getElementById('badge-label').value = '';
    const forcedInput = document.getElementById('badge-forced-name');
    if (forcedInput) forcedInput.value = window.globalNicknames[targetDeviceId] || '';
    
    const existingBadges = window.globalBadges[targetDeviceId] || {};
    const listContainer = document.getElementById('current-badges-list');
    
    if (listContainer) {
        listContainer.innerHTML = '';
        if (Object.keys(existingBadges).length === 0) {
            listContainer.innerHTML = '<div style="font-size:11px; color:var(--text-muted); font-style:italic;">No badges yet.</div>';
        } else {
            Object.entries(existingBadges).forEach(([badgeId, b]) => {
                listContainer.innerHTML += `
                    <div style="display:flex; justify-content:space-between; align-items:center; background:var(--search-bg); padding:6px 10px; border-radius:6px; margin-bottom:6px; border:1px solid var(--border-primary);">
                        <span style="background:${window.escapeHTML(b.bg)}; color:${window.escapeHTML(b.color)}; font-size:9px; font-weight:800; padding:2px 6px; border-radius:4px; display:inline-flex; align-items:center; height:18px;">${window.escapeHTML(b.label)}</span>
                        <button onclick="window.deleteSpecificBadge('${targetDeviceId}', '${badgeId}')" style="background:none; border:none; color:#e86a8e; cursor:pointer; font-size:14px;"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
            });
        }
    }
    
    window.updateBadgePreview();
    window.openModal('badge-modal');
};

window.deleteSpecificBadge = function(deviceId, badgeId) {
    set(ref(db, `badges/${deviceId}/${badgeId}`), null)
        .then(() => {
            window.showPS5Notification("Badge Removed", "Badge successfully deleted.", 3000);
            window.promptGrantBadge(deviceId);
        });
};

window.updateBadgePreview = function() {
    const preview = document.getElementById('badge-preview-text');
    const label = document.getElementById('badge-label').value.trim().toUpperCase() || 'PREVIEW';
    const bg = document.getElementById('badge-bg-color').value;
    const color = document.getElementById('badge-text-color').value;
    
    preview.innerText = label;
    preview.style.background = bg;
    preview.style.color = color;
};

window.saveBadge = function() {
    const targetDeviceId = document.getElementById('badge-target-device').value;
    const label = document.getElementById('badge-label').value.trim().toUpperCase();
    
    if (!label) return window.showPS5Notification("Error", "Badge text cannot be empty.", 4000);
    
    const bg = document.getElementById('badge-bg-color').value;
    const color = document.getElementById('badge-text-color').value;
    
    const badgeId = 'b_' + Math.random().toString(36).substr(2, 9);
    
    update(ref(db, `badges/${targetDeviceId}/${badgeId}`), {
        label: label,
        color: color,
        bg: bg
    }).then(() => {
        window.showPS5Notification("Badge Granted!", `[${label}] given successfully.`, 4000);
        document.getElementById('badge-label').value = '';
        window.promptGrantBadge(targetDeviceId); 
    }).catch(err => {
        window.showPS5Notification("Error", "Permission Denied. Are you logged in?", 4000);
    });
};

window.saveForcedName = function() {
    const targetDeviceId = document.getElementById('badge-target-device').value;
    const newName = document.getElementById('badge-forced-name').value.trim();
    if (!targetDeviceId) return;
    
    if (newName === "") {
        set(ref(db, `nicknames/${targetDeviceId}`), null).then(() => {
            window.showPS5Notification("Name Reset", "User's original name restored.", 3000);
        });
    } else {
        set(ref(db, `nicknames/${targetDeviceId}`), newName).then(() => {
            window.showPS5Notification("Name Updated", `User renamed to ${newName}`, 3000);
        });
    }
};

window.handleEmojiAutocomplete = function(e, mode) {
    const input = e.target;
    const val = input.value;
    const cursorPos = input.selectionStart;

    if (['ArrowUp', 'ArrowDown', 'Enter', 'Tab', 'Escape'].includes(e.key) && window.inlineEmojiState.active) return;

    const textBeforeCursor = val.substring(0, cursorPos);
    const match = textBeforeCursor.match(/(?:^|\s):([a-zA-Z0-9_]{2,})$/); 

    if (match) {
        window.inlineEmojiState.mode = mode;
        window.inlineEmojiState.query = match[1].toLowerCase();
        window.inlineEmojiState.cursorStart = cursorPos - match[1].length - 1; 
        window.renderEmojiAutocomplete();
    } else {
        window.closeEmojiAutocomplete();
    }
};

window.renderEmojiAutocomplete = function() {
    if (!window.emojiCache || !window.inlineEmojiState.query) return;
    
    let results = [];
    const query = window.inlineEmojiState.query;
    for (const group in window.emojiCache) {
        for (const item of window.emojiCache[group]) {
            if (item.search.toLowerCase().includes(query)) {
                results.push(item);
                if (results.length >= 20) break; 
            }
        }
        if (results.length >= 20) break;
    }

    const container = document.getElementById(`${window.inlineEmojiState.mode}-emoji-autocomplete`);
    if (!container) return;

    if (results.length === 0) return window.closeEmojiAutocomplete();

    window.inlineEmojiState.results = results;
    window.inlineEmojiState.active = true;
    if (window.inlineEmojiState.selectedIndex >= results.length) window.inlineEmojiState.selectedIndex = 0;

    let html = `<div class="ea-header">Emoji Matching :${window.escapeHTML(query)}</div>`;
    results.forEach((r, idx) => {
        const selected = idx === window.inlineEmojiState.selectedIndex ? 'selected' : '';
        html += `<div class="ea-item ${selected}" onclick="window.selectAutocompleteEmoji(${idx})">
                    <span class="ea-emoji">${r.emoji}</span>
                    <span class="ea-name">:${r.name}:</span>
                 </div>`;
    });
    
    container.innerHTML = html;
    container.style.display = 'flex';

    if (typeof twemoji !== 'undefined') {
        twemoji.parse(container, {
            base: 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@17.0.3/assets/',
            folder: '72x72',
            ext: '.png',
            className: 'chat-emoji',
            attributes: () => ({
                onerror: "this.outerHTML = this.alt"
            })
        });
    }

    const selectedEl = container.querySelector('.ea-item.selected');
    if (selectedEl) {
        const headerOffset = 35; 
        if (selectedEl.offsetTop < container.scrollTop + headerOffset) {
            container.scrollTop = selectedEl.offsetTop - headerOffset;
        } else if (selectedEl.offsetTop + selectedEl.offsetHeight > container.scrollTop + container.offsetHeight) {
            container.scrollTop = selectedEl.offsetTop + selectedEl.offsetHeight - container.offsetHeight;
        }
    }
};

window.closeEmojiAutocomplete = function() {
    window.inlineEmojiState.active = false;
    window.inlineEmojiState.results = [];
    window.inlineEmojiState.selectedIndex = 0;
    const fc = document.getElementById('full-emoji-autocomplete');
    const mc = document.getElementById('mini-emoji-autocomplete');
    if (fc) fc.style.display = 'none';
    if (mc) mc.style.display = 'none';
};

window.selectAutocompleteEmoji = function(index) {
    const state = window.inlineEmojiState;
    if (!state.active || !state.results[index]) return;
    
    const input = document.getElementById(`${state.mode}-chat-input`);
    const emoji = state.results[index].emoji;
    const before = input.value.substring(0, state.cursorStart);
    const after = input.value.substring(input.selectionStart);
    
    input.value = before + emoji + ' ' + after;
    
    const newCursor = state.cursorStart + emoji.length + 1;
    input.selectionStart = input.selectionEnd = newCursor;
    input.focus();
    
    window.closeEmojiAutocomplete();
    window.addFrequentEmoji(emoji);
};

window.handleEmojiKeydown = function(e) {
    if (!window.inlineEmojiState.active) return false;
    const state = window.inlineEmojiState;
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        state.selectedIndex = (state.selectedIndex + 1) % state.results.length;
        window.renderEmojiAutocomplete();
        return true;
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        state.selectedIndex = (state.selectedIndex - 1 + state.results.length) % state.results.length;
        window.renderEmojiAutocomplete();
        return true;
    } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        window.selectAutocompleteEmoji(state.selectedIndex);
        return true;
    } else if (e.key === 'Escape') {
        window.closeEmojiAutocomplete();
        return true;
    }
    return false;
};

document.addEventListener('DOMContentLoaded', () => {
    const currentProxy = localStorage.getItem('proxyEngine') || 'scramjet';
    if (typeof window.updateActiveEngineCard === 'function') {
        window.updateActiveEngineCard(currentProxy);
    }
    
    const currentTransport = localStorage.getItem('transportEngine') || 'libcurl';
    if (typeof window.updateActiveTransportCard === 'function') {
        window.updateActiveTransportCard(currentTransport);
    }

    const miniMusicContainer = document.getElementById('mini-music-widget');
    if (miniMusicContainer) {
        miniMusicContainer.classList.add('collapsed');
    }

    window.updateActiveExperienceCard = function(mode) {
        document.querySelectorAll('#exp-card-web, #exp-card-games').forEach(c => c.classList.remove('active'));
        const activeCard = document.getElementById(`exp-card-${mode}`);
        if (activeCard) activeCard.classList.add('active');
    };

    window.applyExperienceMode = function(mode) {
        const homeView = document.getElementById('home-view');
        const gamesView = document.getElementById('games-view');
        const webContainer = document.getElementById('web-container');
        const gamesContainer = document.getElementById('main-game-grid');
        const paginationControls = document.getElementById('pagination-controls');
        const modeToggleIcon = document.getElementById('mode-toggle-icon');
        const modeToggleText = document.getElementById('mode-toggle-text');
        const hubFavToggle = document.getElementById('hub-fav-toggle');
        
        window.currentMode = mode;
        
        [homeView, gamesView, webContainer, gamesContainer, paginationControls, hubFavToggle].forEach(el => {
            if(el) el.style.removeProperty('display');
        });
        
        if (mode === 'games') {
            if(modeToggleIcon) modeToggleIcon.className = 'fa-solid fa-globe';
            if(modeToggleText) modeToggleText.innerText = 'WEB';
            
            if(homeView) homeView.style.display = 'none';
            if(webContainer) webContainer.style.display = 'none';
            
            if(gamesView) gamesView.style.display = 'flex';
            if(gamesContainer) gamesContainer.style.display = 'grid';
            if(paginationControls) paginationControls.style.display = 'flex';
            if(hubFavToggle) hubFavToggle.style.display = 'flex';
        } else {
            if(modeToggleIcon) modeToggleIcon.className = 'fa-solid fa-gamepad';
            if(modeToggleText) modeToggleText.innerText = 'GAMES';
            
            if(gamesView) gamesView.style.display = 'none';
            if(gamesContainer) gamesContainer.style.display = 'none';
            if(paginationControls) paginationControls.style.display = 'none';
            if(hubFavToggle) hubFavToggle.style.display = 'none';
            
            if(homeView) homeView.style.display = 'flex';
            if(webContainer) webContainer.style.display = 'flex'; 
        }

        if (typeof window.updateActiveExperienceCard === 'function') {
            window.updateActiveExperienceCard(mode);
        }
    };

    window.setDefaultExperience = function(mode) {
        localStorage.setItem('hyperion_experience', mode);
        window.applyExperienceMode(mode);
        if (typeof window.showPS5Notification === 'function') {
            window.showPS5Notification("Settings Saved", `Default set to ${mode === 'web' ? 'Web' : 'Games'}.`, 3000);
        }
    };

    window.selectExperience = function(mode) {
        localStorage.setItem('hyperion_experience', mode);
        const overlay = document.getElementById('experience-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.style.display = 'none', 400);
        }
        window.applyExperienceMode(mode);
    };

    const savedExp = localStorage.getItem('hyperion_experience');
    const isAuth = localStorage.getItem('hyperion_auth') === 'true';
    const expOverlay = document.getElementById('experience-overlay');
    
    if (isAuth && !savedExp && expOverlay) {
        expOverlay.style.display = 'flex';
        const hv = document.getElementById('home-view');
        const gv = document.getElementById('games-view');
        if (hv) hv.style.display = 'none';
        if (gv) gv.style.display = 'none';
    } else if (isAuth && savedExp) {
        window.applyExperienceMode(savedExp);
    }

    document.addEventListener('fullscreenchange', () => {
        const frameWrapper = document.getElementById('proxy-frame-wrapper');
        let tabsBtn = document.getElementById('proxy-exit-fs-btn');
        
        if (document.fullscreenElement === frameWrapper) {
            if (!tabsBtn) {
                tabsBtn = document.createElement('button');
                tabsBtn.id = 'proxy-exit-fs-btn';
                tabsBtn.innerText = 'Tabs';
                tabsBtn.style.cssText = 'position: absolute; top: 0; left: 50%; transform: translateX(-50%); background: #333; color: #fff; border: 1px solid #555; border-top: none; padding: 6px 20px; border-radius: 0 0 8px 8px; font-family: "Poppins", sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; z-index: 2147483647; opacity: 0.2; transition: opacity 0.2s;';
                tabsBtn.onmouseover = () => tabsBtn.style.opacity = '1';
                tabsBtn.onmouseout = () => tabsBtn.style.opacity = '0.2';
                tabsBtn.onclick = () => { if (document.exitFullscreen) document.exitFullscreen(); };
                frameWrapper.appendChild(tabsBtn);
            }
            tabsBtn.style.display = 'block';
        } else if (tabsBtn) {
            tabsBtn.style.display = 'none';
        }
    });


    const proxySearchInput = document.getElementById('proxy-search');
    const mainSearchInput = document.getElementById('game-search');
    
    if (mainSearchInput) {
        mainSearchInput.addEventListener('mousedown', () => {
            mainSearchInput.classList.remove('splash-active');
            void mainSearchInput.offsetWidth; 
            mainSearchInput.classList.add('splash-active');
        });
        mainSearchInput.addEventListener('input', window.updateSearchFilter);
    }

    if (proxySearchInput) {
        proxySearchInput.addEventListener('mousedown', () => {
            proxySearchInput.classList.remove('splash-active');
            void proxySearchInput.offsetWidth; 
            proxySearchInput.classList.add('splash-active');
        });

        proxySearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = proxySearchInput.value.trim();
                if (!query) return;
                
                let finalUrl = '';
                if (query.includes('.') && !query.includes(' ')) {
                    finalUrl = query.startsWith('http') ? query : 'https://' + query;
                } else {
                    finalUrl = searchEngine + encodeURIComponent(query);
                }
                window.launchProxy(finalUrl);
            }
        });
    }

    const proxyBackBtn = document.getElementById('nav-back-btn');
    const proxyForwardBtn = document.getElementById('nav-forward-btn');
    const proxyReloadBtn = document.getElementById('nav-refresh-btn');
    const proxyHomeBtn = document.getElementById('nav-home-btn');
    const proxyUrlBar = document.getElementById('proxy-url-bar');
    const closeProxyBtn = document.getElementById('close-proxy');
    const fullscreenProxyBtn = document.getElementById('fullscreen-proxy');

    if (proxyBackBtn) proxyBackBtn.addEventListener('click', () => {
        try { document.getElementById('proxy-frame-' + window.activeTabId).contentWindow.history.back(); } catch (e) {}
    });

    if (proxyForwardBtn) proxyForwardBtn.addEventListener('click', () => {
        try { document.getElementById('proxy-frame-' + window.activeTabId).contentWindow.history.forward(); } catch (e) {}
    });

    if (proxyReloadBtn) proxyReloadBtn.addEventListener('click', () => {
        const activeTabObj = window.browserTabs.find(t => t.id === window.activeTabId);
        if (activeTabObj && activeTabObj.internalId) return; 
        
        try { 
            const iframe = document.getElementById('proxy-frame-' + window.activeTabId);
            if (!iframe) return;

            const cw = iframe.contentWindow;
            if (cw && cw.__uv$location) {
                cw.__uv$location.reload();
            } else if (cw && cw.__scramjet$location) {
                cw.__scramjet$location.reload();
            } else {
                cw.location.reload();
            }
        } catch (e) {
            const iframe = document.getElementById('proxy-frame-' + window.activeTabId);
            if (iframe) iframe.src = iframe.src; 
        }
    });

    if (proxyHomeBtn) proxyHomeBtn.addEventListener('click', () => {
        const activeContent = document.getElementById('proxy-content-' + window.activeTabId);
        if (!activeContent) return;
        const activeFrame = document.getElementById('proxy-frame-' + window.activeTabId);
        const ntp = activeContent.querySelector('.new-tab-page');
        
        const activeTabObj = window.browserTabs.find(t => t.id === window.activeTabId);
        if (activeTabObj && activeTabObj.internalId) {
            const modal = document.getElementById(activeTabObj.internalId);
            if (modal) {
                modal.classList.remove('modal-as-tab');
                modal.style.display = 'none';
                document.body.appendChild(modal);
            }
            activeTabObj.internalId = null;
        }

        if (activeFrame) {
            activeFrame.src = 'about:blank';
            activeFrame.style.display = 'none';
        }
        if (ntp) ntp.style.display = 'flex';
        
        const urlBar = document.getElementById('proxy-url-bar');
        if (urlBar) {
            urlBar.value = '';
            urlBar.readOnly = false;
        }
        
        if (activeTabObj) {
            activeTabObj.url = '';
            activeTabObj.title = 'New Tab';
        }
        window.renderBrowserTabs();
    });

    if (closeProxyBtn) closeProxyBtn.addEventListener('click', () => {
        const pCont = document.getElementById('proxy-container');
        if (pCont) pCont.style.setProperty('display', 'none', 'important');
        
        document.documentElement.classList.remove('proxy-active');
        document.body.classList.remove('proxy-active');
        
        window.applyExperienceMode(window.currentMode);
    });

    window.goProxyFullscreen = function() {
        const frameWrapper = document.getElementById('proxy-frame-wrapper');
        if (!frameWrapper) return;
        
        if (!document.fullscreenElement) {
            if (frameWrapper.requestFullscreen) {
                frameWrapper.requestFullscreen();
            } else if (frameWrapper.webkitRequestFullscreen) {
                frameWrapper.webkitRequestFullscreen();
            }
        }
    };

    if (fullscreenProxyBtn) {
        fullscreenProxyBtn.addEventListener('click', window.goProxyFullscreen);
    }

    if (proxyUrlBar) {
        proxyUrlBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = proxyUrlBar.value.trim();
                
                if (!query) {
                    document.getElementById('nav-home-btn')?.click();
                    return;
                }
                
                if (window.handleHyperionURL(query, window.activeTabId)) return; 
                
                let finalUrl = '';
                if (query.includes('.') && !query.includes(' ')) {
                    finalUrl = query.startsWith('http') ? query : 'https://' + query;
                } else {
                    finalUrl = searchEngine + encodeURIComponent(query);
                }

                const tabObj = window.browserTabs.find(t => t.id === window.activeTabId);
                if (tabObj && tabObj.internalId) {
                    const modal = document.getElementById(tabObj.internalId);
                    if (modal) {
                        modal.classList.remove('modal-as-tab');
                        modal.style.display = 'none';
                        document.body.appendChild(modal);
                    }
                    tabObj.internalId = null;
                }

                window.launchProxy(finalUrl, window.activeTabId);
            }
        });
    }

    document.querySelectorAll('#web-container .web-bookmark').forEach(card => {
        card.addEventListener('click', () => {
            const url = card.getAttribute('data-url');
            if (url) window.launchProxy(url);
        });
    });

    const grid = document.getElementById('main-game-grid');
    const paginationControls = document.getElementById('pagination-controls');

    window.localHyperionGames = [
        { name: "2048", path: "/2048/index.html" },
        { name: "Angry Birds", path: "/angrybirds/index.html" },
        { name: "Awesome Tanks", path: "/awsometanks/index.html" },
        { name: "Basketball Stars", path: "/basketballstars/index.html" },
        { name: "Basketball Legends", path: "/basketballlegends/index.html" },
        { name: "Baldi's Basics", path: "/baldi-basics/index.html" },
        { name: "Buckshot Roulette", path: "/buckshot-roulette/index.html" },
        { name: "Cookie Clicker", path: "/Algebra-work/index.html" },
        { name: "Jetpack Joyride", path: "/jetpackjoyride/index.html" },
        { name: "Five Nights At Freddy's", path: "/fnaf/index.html" },
        { name: "Five Nights At Freddy's 2", path: "/fnaf2/index.html" },
        { name: "Five Nights At Freddy's 3", path: "/fnaf3/index.html" },
        { name: "Five Nights At Freddy's 4", path: "/fnaf4/index.html" },
        { name: "Retro Bowl", path: "/Google-Docs/index.html" },
        { name: "Hollow Knight", path: "/hollow-knight/index.html" },
        { name: "OvO", path: "/ovo/index.html" },
        { name: "Retro Bowl College", path: "/retro-bowl-college/index.html" },
        { name: "Riddle School", path: "/riddleschool/index.html" },
        { name: "Riddle School 2", path: "/riddleschool2/index.html" },
        { name: "Riddle School 3", path: "/riddleschool3/index.html" },
        { name: "Riddle School 4", path: "/riddleschool4/index.html" },
        { name: "Riddle School 5", path: "/riddleschool5/index.html" },
        { name: "Riddle School Transfer", path: "/riddleschooltransfer/index.html" },
        { name: "Riddle School Transfer 2", path: "/riddleschooltransfer2/index.html" },
        { name: "SM64", path: "/sm64/index.html" },
        { name: "Tiny Fishing", path: "/tiny-fishing/index.html" },
        { name: "This is the only level too", path: "/thisistheonlylevel/index.html" },
        { name: "The Impossible Quiz", path: "/impossible-quiz/index.html" },
        { name: "The Impossible Quiz 2", path: "/impossible-quiz2/index.html" },
        { name: "Zombie Rush", path: "/zombie-rush/index.html" },
        { name: "Eaglercraft 1.12", path: "/1.12/index.html" },
        { name: "Eaglercraft 1.5", path: "/1.5/index.html" },
        { name: "Eaglercraft 1.8.8", path: "/1.8/index.html" },
        { name: "10 Minutes Till Dawn", path: "/10minutestilldawn/index.html" },
        { name: "12 Mini Battles", path: "/12minibattles/index.html" },
        { name: "1 on 1 Soccer", path: "/1on1soccer/index.html" },
        { name: "1 on 1 Tennis", path: "/1on1tennis/index.html" },
        { name: "1v1.lol", path: "/1v1.lol/index.html" },
        { name: "2048 Cupcakes", path: "/2048cupcakes/index.html" },
        { name: "3D Flight Simulator", path: "/3Dflightsimulator/index.html" },
        { name: "8 Ball Classic", path: "/8ballclassic/index.html" },
        { name: "MC Alpha 1.2.6", path: "/Alpha_1.2.6/index.html" },
        { name: "MC Beta 1.3", path: "/Beta_1.3/index.html" },
        { name: "MC Indev", path: "/Indev/index.html" },
        { name: "Agario Lite", path: "/agariolite/index.html" },
        { name: "Age of War", path: "/ageofwar/index.html" },
        { name: "Age of War 2", path: "/ageofwar2/index.html" },
        { name: "Ages of Conflict", path: "/agesofconflict/index.html" },
        { name: "Among Us", path: "/amongus/index.html" },
        { name: "Angry Birds Showdown", path: "/angrybirdsshowdown/index.html" },
        { name: "Angry Birds Space", path: "/angrybirdsspace/index.html" },
        { name: "Awesometanks", path: "/awesometanks/index.html" },
        { name: "Awesome Tanks 2", path: "/awesometanks2/index.html" },
        { name: "Backrooms", path: "/backrooms/index.html" },
        { name: "Bacon May Die", path: "/baconmaydie/index.html" },
        { name: "Bad Ice Cream", path: "/badicecream/index.html" },
        { name: "Bad Ice Cream 2", path: "/badicecream2/index.html" },
        { name: "Bad Ice Cream 3", path: "/badicecream3/index.html" },
        { name: "Bad Parenting", path: "/badparenting/index.html" },
        { name: "Bad Piggies", path: "/badpiggies/index.html" },
        { name: "Baseball Bros", path: "/baseballbros/index.html" },
        { name: "Basket Bros", path: "/basketbros/index.html" },
        { name: "Basket Random", path: "/basketrandom/index.html" },
        { name: "BitLife", path: "/bitlife/index.html" },
        { name: "Bit Planes", path: "/bitplanes/index.html" },
        { name: "Blocky Snakes", path: "/blockysnakes/index.html" },
        { name: "Bloons TD", path: "/bloonsTD/index.html" },
        { name: "Bloons TD 2", path: "/bloonsTD2/index.html" },
        { name: "Bloons TD 3", path: "/bloonsTD3/index.html" },
        { name: "Bloons TD 4", path: "/bloonsTD4/index.html" },
        { name: "Bloons TD 5", path: "/bloonsTD5/index.html" },
        { name: "Bloxorz", path: "/bloxorz/index.html" },
        { name: "Blumgi Racers", path: "/blumgiracers/index.html" },
        { name: "Blumgi Rocket", path: "/blumgirocket/index.html" },
        { name: "Bob the Robber", path: "/bobtherobber/index.html" },
        { name: "Bob the Robber 2", path: "/bobtherobber2/index.html" },
        { name: "Bob the Robber 5", path: "/bobtherobber5/index.html" },
        { name: "Bouncy Motors", path: "/bouncymotors/index.html" },
        { name: "Bowmasters", path: "/bowmasters/index.html" },
        { name: "Boxing Random", path: "/boxingrandom/index.html" },
        { name: "Breaking The Bank", path: "/breakingthebank/index.html" },
        { name: "Bubble Shooter", path: "/bubbleshooter/index.html" },
        { name: "Candy Crush", path: "/candycrush/index.html" },
        { name: "Capybara Clicker", path: "/capybaraclicker/index.html" },
        { name: "Car Drawing", path: "/cardrawing/index.html" },
        { name: "Car King Arena", path: "/carkingarena/index.html" },
        { name: "Chess", path: "/chess/index.html" },
        { name: "Choppy Orc", path: "/choppyorc/index.html" },
        { name: "CircloO", path: "/circloO/index.html" },
        { name: "CircloO 2", path: "/circloO2/index.html" },
        { name: "Clash of Vikings", path: "/clashofvikings/index.html" },
        { name: "Cleanup.io", path: "/cleanupio/index.html" },
        { name: "Cluster Rush", path: "/clusterrush/index.html" },
        { name: "Crazy Cars", path: "/crazycars/index.html" },
        { name: "Crazy Cattle 3D", path: "/crazycattle3D/index.html" },
        { name: "Crazy Crash Landing", path: "/crazycrashlanding/index.html" },
        { name: "Crazy Motorcycle", path: "/crazymotorcycle/index.html" },
        { name: "Crossy Road", path: "/crossyroad/index.html" },
        { name: "Cut the Rope", path: "/cuttherope/index.html" },
        { name: "Dadish", path: "/dadish/index.html" },
        { name: "Dadish 2", path: "/dadish2/index.html" },
        { name: "Dadish 3", path: "/dadish3/index.html" },
        { name: "Death Chase", path: "/deathchase/index.html" },
        { name: "Death Run 3D", path: "/deathrun3D/index.html" },
        { name: "Demolition Derby", path: "/demolitionderbycrashracing/index.html" },
        { name: "Doodle Jump", path: "/doodlejump/index.html" },
        { name: "Draw Climber", path: "/drawclimber/index.html" },
        { name: "Dreadhead Parkour", path: "/dreadheadparkour/index.html" },
        { name: "Drift Boss", path: "/driftboss/index.html" },
        { name: "Drive Mad", path: "/drivemad/index.html" },
        { name: "Duck Life", path: "/ducklife/index.html" },
        { name: "Duck Life 2", path: "/ducklife2/index.html" },
        { name: "Duck Life 3", path: "/ducklife3/index.html" },
        { name: "Duck Life 4", path: "/ducklife4/index.html" },
        { name: "Duck Life 5", path: "/ducklife5/index.html" },
        { name: "Ducklings.io", path: "/ducklingsio/index.html" },
        { name: "Eagle Ride", path: "/eagleride/index.html" },
        { name: "Earn to Die", path: "/earntodie/index.html" },
        { name: "Earn to Die 2", path: "/earntodie2/index.html" },
        { name: "Eggy Car", path: "/eggycar/index.html" },
        { name: "Elastic Face", path: "/elasticface/index.html" },
        { name: "Escape Road", path: "/escaperoad/index.html" },
        { name: "Escape Road 2", path: "/escaperoad2/index.html" },
        { name: "Escaping the Prison", path: "/escapingtheprison/index.html" },
        { name: "Evil Glitch", path: "/evilglitch/index.html" },
        { name: "Fancy Pants Adventure", path: "/fancypantsadventure/index.html" },
        { name: "Fancy Pants Adventure 2", path: "/fancypantsadventure2/index.html" },
        { name: "Fireboy and Watergirl", path: "/fireboyandwatergirl/index.html" },
        { name: "Fireboy and Watergirl 2", path: "/fireboyandwatergirl2/index.html" },
        { name: "Fireboy and Watergirl 3", path: "/fireboyandwatergirl3/index.html" },
        { name: "Fireboy and Watergirl 4", path: "/fireboyandwatergirl4/index.html" },
        { name: "Flappy Bird", path: "/flappybird/index.html" },
        { name: "Flood Runner 2", path: "/floodrunner2/index.html" },
        { name: "Flood Runner 3", path: "/floodrunner3/index.html" },
        { name: "Flood Runner 4", path: "/floodrunner4/index.html" },
        { name: "Football Bros", path: "/footballbros/index.html" },
        { name: "Football Legends", path: "/footballlegends/index.html" },
        { name: "Free Rider 3", path: "/freerider3/index.html" },
        { name: "Fruit Ninja", path: "/fruitninja/index.html" },
        { name: "Funny Battle", path: "/funnybattle/index.html" },
        { name: "Funny Battle 2", path: "/funnybattle2/index.html" },
        { name: "Funny Mad Racing", path: "/funnymadracing/index.html" },
        { name: "Funny Shooter 2", path: "/funnyshooter2/index.html" },
        { name: "Geometry Dash", path: "/geometrydash/index.html" },
        { name: "Geometry Dash Lite", path: "/geometrydashlite/index.html" },
        { name: "Geometry Vibes", path: "/geometryvibes/index.html" },
        { name: "Getaway Shootout", path: "/getawayshootout/index.html" },
        { name: "Get On Top", path: "/getontop/index.html" },
        { name: "Gladihoppers", path: "/gladihoppers/index.html" },
        { name: "Google Baseball", path: "/googlebaseball/index.html" },
        { name: "Google Dino", path: "/googledino/index.html" },
        { name: "Granny", path: "/granny/index.html" },
        { name: "Granny 2", path: "/granny2/index.html" },
        { name: "Guess Their Answer", path: "/guesstheiranswer/index.html" },
        { name: "Hanger 2", path: "/hanger2/index.html" },
        { name: "Happy Wheels", path: "/happywheels/index.html" },
        { name: "Helix Jump", path: "/helixjump/index.html" },
        { name: "Highway Traffic", path: "/highwaytraffic/index.html" },
        { name: "Hill Climb Racing Lite", path: "/hillclimbracinglite/index.html" },
        { name: "Hole.io", path: "/holeio/index.html" },
        { name: "Hotline Miami", path: "/hotline-miami/index.html" },
        { name: "House of Hazards", path: "/houseofhazards/index.html" },
        { name: "Hover Racer Drive", path: "/hoverracerdrive/index.html" },
        { name: "Idle Breakout", path: "/idlebreakout/index.html" },
        { name: "Iron Snout", path: "/ironsnout/index.html" },
        { name: "Johnny Trigger", path: "/johnnytrigger/index.html" },
        { name: "Jumping Shell", path: "/jumpingshell/index.html" },
        { name: "Karate Bros", path: "/karatebros/index.html" },
        { name: "Kart Bros", path: "/kartbros/index.html" },
        { name: "Learn to Fly", path: "/learntofly/index.html" },
        { name: "Learn to Fly 2", path: "/learntofly2/index.html" },
        { name: "Learn to Fly 3", path: "/learntofly3/index.html" },
        { name: "Learn to Fly Idle", path: "/learntoflyidle/index.html" },
        { name: "Level Devil", path: "/leveldevil/index.html" },
        { name: "Madalin Stunt Cars 2", path: "/madalinstuntcars2/index.html" },
        { name: "Melon Playground", path: "/melonplayground/index.html" },
        { name: "Merge Round Racers", path: "/mergeroundracers/index.html" },
        { name: "Minesweeper", path: "/minesweeper/index.html" },
        { name: "Monkey Mart", path: "/monkeymart/index.html" },
        { name: "Monster Tracks", path: "/monstertracks/index.html" },
        { name: "Moto X3M", path: "/motox3m/index.html" },
        { name: "Moto X3M 2", path: "/motox3m2/index.html" },
        { name: "Moto X3M 3", path: "/motox3m3/index.html" },
        { name: "Moto X3M Pool Party", path: "/motox3mpoolparty/index.html" },
        { name: "Motox 3 Mspookyland", path: "/motox3mspookyland/index.html" },
        { name: "Moto X3M Winter", path: "/motox3mwinter/index.html" },
        { name: "Noob Miner", path: "/noobminer/index.html" },
        { name: "Opposite Day", path: "/oppositeday/index.html" },
        { name: "OvO 2", path: "/ovo2/index.html" },
        { name: "OvO 3 Dimensions", path: "/ovo3dimensions/index.html" },
        { name: "Pac-Man", path: "/pacman/index.html" },
        { name: "Papa's Bakeria", path: "/papasbakeria/index.html" },
        { name: "Papa's Burgeria", path: "/papasburgeria/index.html" },
        { name: "Papa's Cheeseria", path: "/papascheeseria/index.html" },
        { name: "Papa's Cupcakeria", path: "/papascupcakeria/index.html" },
        { name: "Papa's Donuteria", path: "/papasdonuteria/index.html" },
        { name: "Papa's Freezeria", path: "/papasfreezeria/index.html" },
        { name: "Papa's Hot Doggeria", path: "/papashotdoggeria/index.html" },
        { name: "Papa's Pancakeria", path: "/papaspancakeria/index.html" },
        { name: "Papa's Pastaria", path: "/papaspastaria/index.html" },
        { name: "Papa's Pizzeria", path: "/papaspizzeria/index.html" },
        { name: "Papa's Scooperia", path: "/papasscooperia/index.html" },
        { name: "Papa's Sushiria", path: "/papassushiria/index.html" },
        { name: "Papa's Tacomia", path: "/papastacomia/index.html" },
        { name: "Papa's Wingeria", path: "/papaswingeria/index.html" },
        { name: "Paper.io 2", path: "/paperio2/index.html" },
        { name: "Parking Fury", path: "/parkingfury/index.html" },
        { name: "Parking Fury 2", path: "/parkingfury2/index.html" },
        { name: "Parking Fury 3", path: "/parkingfury3/index.html" },
        { name: "Pico's School", path: "/picosschool/index.html" },
        { name: "Ping Pong Chaos", path: "/pingpongchaos/index.html" },
        { name: "Pixel Speedrun", path: "/pixelspeedrun/index.html" },
        { name: "Plants vs Zombies", path: "/plantsvszombies/index.html" },
        { name: "Plonky", path: "/plonky/index.html" },
        { name: "PolyTrack", path: "/polytrack/index.html" },
        { name: "Poor Bunny", path: "/poorbunny/index.html" },
        { name: "Pou", path: "/pou/index.html" },
        { name: "Ragdoll Archers", path: "/ragdollarchers/index.html" },
        { name: "Ragdoll Hit", path: "/ragdollhit/index.html" },
        { name: "Ragdoll Soccer", path: "/ragdollsoccer/index.html" },
        { name: "Red Ball 4 Vol. 1", path: "/redball4vol1/index.html" },
        { name: "Red Ball 4 Vol. 2", path: "/redball4vol2/index.html" },
        { name: "Red Ball 4 Vol. 3", path: "/redball4vol3/index.html" },
        { name: "Retro Highway", path: "/retrohighway/index.html" },
        { name: "Retro Ping Pong", path: "/retropingpong/index.html" },
        { name: "Riddlescchool 3", path: "/riddlescchool3/index.html" },
        { name: "Rocket Soccer Derby", path: "/rocketsoccerderby/index.html" },
        { name: "Rooftop Snipers", path: "/rooftopsnipers/index.html" },
        { name: "Rooftop Snipers 2", path: "/rooftopsnipers2/index.html" },
        { name: "Repo", path: "/repo/index.html" },
        { name: "Run", path: "/run/index.html" },
        { name: "Run 2", path: "/run2/index.html" },
        { name: "Run 3", path: "/run3/index.html" },
        { name: "Sand Game", path: "/sandgame/index.html" },
        { name: "Short Life", path: "/shortlife/index.html" },
        { name: "Slope", path: "/slope/index.html" },
        { name: "Slope 2 Player", path: "/slope2player/index.html" },
        { name: "Slope 3", path: "/slope3/index.html" },
        { name: "Slow Roads", path: "/slowroads/index.html" },
        { name: "Smash Karts", path: "https://smashkarts.io/" },
        { name: "Super Mario 63", path: "/sm63/index.html" },
        { name: "Snowball.io", path: "/snowballio/index.html" },
        { name: "Snow Rider", path: "/snowrider/index.html" },
        { name: "Snow Road", path: "/snowroad/index.html" },
        { name: "Soccer Bros", path: "/soccerbros/index.html" },
        { name: "Soccer Random", path: "/soccerrandom/index.html" },
        { name: "Spacebar Clicker", path: "/spacebarclicker/index.html" },
        { name: "Space is Key", path: "/spaceiskey/index.html" },
        { name: "Space is Key 2", path: "/spaceiskey2/index.html" },
        { name: "Space Waves", path: "/spacewaves/index.html" },
        { name: "Speed Stars", path: "/speedstars/index.html" },
        { name: "Sprunki", path: "/sprunki/index.html" },
        { name: "Sonic.exe", path: "/sonic.exe/index.html" },
        { name: "Stack", path: "/stack/index.html" },
        { name: "Stacktris", path: "/stacktris/index.html" },
        { name: "State.io", path: "/stateio/index.html" },
        { name: "Stick Archers Battle", path: "/stickarchersbattle/index.html" },
        { name: "Stick Fighter", path: "/stickfighter/index.html" },
        { name: "Stickman Hook", path: "/stickmanhook/index.html" },
        { name: "Stick Merge", path: "/stickmerge/index.html" },
        { name: "Subway Surfers Beijing", path: "/subwaysurfersbeijing/index.html" },
        { name: "Subway Surfers Havana", path: "/subwaysurfershavana/index.html" },
        { name: "Subway Surfers San Francisco", path: "/subwaysurferssanfrancisco/index.html" },
        { name: "Super Bike The Champion", path: "/superbikethechampion/index.html" },
        { name: "SUPERHOT", path: "/superhot/index.html" },
        { name: "Super Liquid Soccer", path: "/superliquidsoccer/index.html" },
        { name: "Super Star Car", path: "/superstarcar/index.html" },
        { name: "Table Tennis World Tour", path: "/tabletennisworldtour/index.html" },
        { name: "Tag", path: "/tag/index.html" },
        { name: "Tap Road", path: "/taproad/index.html" },
        { name: "Temple of Boom", path: "/templeofboom/index.html" },
        { name: "Temple Run 2", path: "/templerun2/index.html" },
        { name: "Territorial.io", path: "/territorialio/index.html" },
        { name: "There Is No Game", path: "/thereisnog/index.html" },
        { name: "They Are Coming", path: "/theyarecoming/index.html" },
        { name: "Time Shooter 2", path: "/timeshooter2/index.html" },
        { name: "Time Shooter 3", path: "/timeshooter3/index.html" },
        { name: "Tomb of the Mask", path: "/tombofthemask/index.html" },
        { name: "Trap the Cat", path: "/trapthecat/index.html" },
        { name: "Trivia Crack", path: "/triviacrack/index.html" },
        { name: "Tube Jumpers", path: "/tubejumpers/index.html" },
        { name: "Tunnel Rush", path: "/tunnelrush/index.html" },
        { name: "Unicycle Hero", path: "/unicyclehero/index.html" },
        { name: "Vex 4", path: "/vex4/index.html" },
        { name: "Vex 5", path: "/vex5/index.html" },
        { name: "Vex 6", path: "/vex6/index.html" },
        { name: "Vex 7", path: "/vex7/index.html" },
        { name: "Vex 8", path: "/vex8/index.html" },
        { name: "Vex X3M", path: "/vexx3m/index.html" },
        { name: "Vex X3M 2", path: "/vexx3m2/index.html" },
        { name: "Volley Random", path: "/volleyrandom/index.html" },
        { name: "War the Knights", path: "/wartheknights/index.html" },
        { name: "We Become What We Behold", path: "/webecomewhatwebehold/index.html" },
        { name: "Wheelie Bike", path: "/wheeliebike/index.html" },
        { name: "Wheely", path: "/wheely/index.html" },
        { name: "Wheely 2", path: "/wheely2/index.html" },
        { name: "Wheely 3", path: "/wheely3/index.html" },
        { name: "Wheely 4", path: "/wheely4/index.html" },
        { name: "Wheely 5", path: "/wheely5/index.html" },
        { name: "Wheely 6", path: "/wheely6/index.html" },
        { name: "Wheely 7", path: "/wheely7/index.html" },
        { name: "Wheely 8", path: "/wheely8/index.html" },
        { name: "Wordle Unlimited", path: "/wordleunlimited/index.html" },
        { name: "World's Hardest Game", path: "/worldshardestgame/index.html" },
        { name: "World's Hardest Game 2", path: "/worldshardestgame2/index.html" },
        { name: "World's Hardest Game 3", path: "/worldshardestgame3/index.html" },
        { name: "Wrestle Bros", path: "/wrestlebros/index.html" }
    ];

    window.updateSearchFilter = function() {
        const query = document.getElementById('game-search')?.value.toLowerCase().trim() || "";
        filteredGames = allGamesArray.filter(g => {
            const matchesSearch = g.name.toLowerCase().includes(query);
            const matchesFav = !showingFavorites || favoriteGames.includes(g.path);
            return matchesSearch && matchesFav;
        });
        window.renderPage(1);
    };

    const cardsPerPage = 30;
    let currentPage = 1;

    window.renderPage = function(page) {
        currentPage = page;
        const startIndex = (page - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;
        const pageGames = filteredGames.slice(startIndex, endIndex);

        let html = '';
        pageGames.forEach(game => {
            const safeName = game.name.replace(/'/g, "\\'");
            html += `<div class="card" onclick="window.launchGame('${game.path}', '${safeName}')" style="display: flex;">
                        <h3>${game.name}</h3>
                     </div>`;
        });
        
        const gridEl = document.getElementById('main-game-grid');
        if(gridEl) gridEl.innerHTML = html;
        
        renderPaginationUI();
    };

    function renderPaginationUI() {
        const paginationControls = document.getElementById('pagination-controls');
        if(!paginationControls) return;
        paginationControls.innerHTML = '';
        const totalPages = Math.ceil(filteredGames.length / cardsPerPage);
        
        if (totalPages <= 1) return; 

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.onclick = () => {
                window.renderPage(i);
                const sw = document.getElementById('games-view');
                if(sw) sw.scrollTo({ top: 0, behavior: 'smooth' });
            };
            paginationControls.appendChild(btn);
        }
    }

    window.refreshHubQuote = function() {
        const quoteText = `"${hubQuotes[Math.floor(Math.random() * hubQuotes.length)]}"`;
        const proxyQuote = document.getElementById('hub-quote-display');
        const gamesQuote = document.getElementById('games-quote-display');
        
        if (proxyQuote) proxyQuote.innerText = quoteText;
        if (gamesQuote) gamesQuote.innerText = quoteText;
    };
    window.refreshHubQuote();
    
    window.setGameProvider(localStorage.getItem('hyperion_game_provider') || 'hyperion');
    
    setTimeout(() => {
        window.showPS5Notification('Hyperion Hub', 'Make sure to join the discord!', 6000);
    }, 2000);
}); 

document.addEventListener('click', (e) => {
    if (!e.target.closest('.emoji-autocomplete')) window.closeEmojiAutocomplete();
});

document.getElementById('badge-label')?.addEventListener('input', window.updateBadgePreview);
document.getElementById('badge-bg-color')?.addEventListener('input', window.updateBadgePreview);
document.getElementById('badge-text-color')?.addEventListener('input', window.updateBadgePreview);

document.getElementById('music-next')?.addEventListener('click', window.playNextTrack);
document.getElementById('music-prev')?.addEventListener('click', window.playPrevTrack);
document.getElementById('music-shuffle')?.addEventListener('click', (e) => {
    isShuffle = !isShuffle;
    e.currentTarget.style.color = isShuffle ? "#4cc9f0" : "rgba(255,255,255,0.7)";
});
document.getElementById('music-loop')?.addEventListener('click', (e) => {
    isLoop = !isLoop;
    e.currentTarget.style.color = isLoop ? "#4cc9f0" : "rgba(255,255,255,0.7)";
});
document.getElementById('music-library-search')?.addEventListener('input', window.applyMusicSearchFilter);

const ambientToggle = document.getElementById('ambient-player-toggle');
if (ambientToggle) {
    ambientToggle.checked = localStorage.getItem('hyperion_ambient_music') !== 'false';
    ambientToggle.addEventListener('change', (e) => {
        localStorage.setItem('hyperion_ambient_music', e.target.checked);
        const ambientBg = document.getElementById('music-ambient-bg');
        const audioPlayer = document.getElementById('global-audio-player');
        if (ambientBg && audioPlayer) {
            ambientBg.style.opacity = e.target.checked && audioPlayer.src ? "0.45" : "0";
        }
    });
}