const fs = require('fs');
const path = require('path');

const adConfig = {
    "healthand.badcreditinstallmentloanlenders.com": {
        popunder: "https://tightslybella.com/ac/24/c5/ac24c5e55a2afc8ee229128e759719d7.js",
        socialbar: "https://tightslybella.com/4e/45/7d/4e457d3e889e19fc7a2fb99f816f93d0.js",
        banner: "21a3217194655082207eb9ec1aa8e296"
    },
    "business.badcreditinstallmentloanlenders.com": {
        popunder: "https://tightslybella.com/01/8d/29/018d299dbfc7ac3e53cd8769b673d77a.js",
        socialbar: "https://tightslybella.com/4d/64/37/4d6437322f6312569bd54cf281902ba5.js",
        banner: "21a3217194655082207eb9ec1aa8e296"
    },
    "chilling.highcountrycoffee.com": {
        popunder: "https://tightslybella.com/c3/c3/3c/c3c33c7ecca9a57c26ce1eee4707c967.js",
        socialbar: "https://tightslybella.com/53/c7/dc/53c7dcf8b84eafc94e53d5b732fa4efb.js",
        banner: "8249a3a6ea9b967d0d9e99ac96ae9dab"
    },
    "health.genresponse.health": {
        popunder: "https://tightslybella.com/06/41/0b/06410b808b639afc91a820e18cf8d92e.js",
        socialbar: "https://tightslybella.com/ea/8e/d5/ea8ed50aa15ae0ea82435c7711585dbb.js",
        banner: "9a934d58a198572dad032492a78cacc6"
    },
    "learning.genresponse.health": {
        popunder: "https://tightslybella.com/70/e9/71/70e971a654571f7c5f1b331754ab2e42.js",
        socialbar: "https://tightslybella.com/03/ce/51/03ce510e3151ae414c3bc7fd370e9e71.js",
        banner: "ca66cbc5653fffff5f4df8549763d302"
    },
    "learningmath.highcountrycoffee.com": {
        popunder: "https://tightslybella.com/98/68/5a/98685a8f1ed847f51e209887d705c98c.js",
        socialbar: "https://tightslybella.com/53/c7/dc/53c7dcf8b84eafc94e53d5b732fa4efb.js",
        banner: "9a934d58a198572dad032492a78cacc6"
    },
    "learning.keyword.asia": {
        popunder: "https://tightslybella.com/43/6c/0d/436c0d92e7c0595d692bf046151440d0.js",
        socialbar: "https://tightslybella.com/53/c7/dc/53c7dcf8b84eafc94e53d5b732fa4efb.js",
        banner: "9a934d58a198572dad032492a78cacc6"
    },
    "math.yallashoot.mom": {
        popunder: "https://tightslybella.com/ba/fe/76/bafe768e7ead07689bd5de10682f171e.js",
        socialbar: "https://tightslybella.com/97/64/c6/9764c6270686cec4a3fd67e894f23bd8.js",
        banner: "d182ff475bb58a98791e82e81323bd1d"
    },
    "science.yallashoot.mom": {
        popunder: "https://tightslybella.com/a9/d4/1e/a9d41eeb62c0fdccd10b3ab1ae1c5307.js",
        socialbar: "https://tightslybella.com/35/b1/d8/35b1d8ffbfeb086742dd98d6fe82038d.js",
        banner: "9964b48bce67c7ceeb44669bb8b716d6"
    },
    "exploring.keyword.asia": {
        popunder: "https://tightslybella.com/c8/1e/49/c81e4972aa4fa6e8e6fa4f1b5ce242e4.js",
        socialbar: "https://tightslybella.com/33/c6/3e/33c63e68029de17f72a950af226fd323.js",
        banner: "1ddeb46962749d1fe7740ed9d57e38f5"
    },
    "artists.tyronesubg.art": {
        popunder: "https://tightslybella.com/7d/c9/19/7dc919bd0eddd83d2ed7e4055612e0b2.js",
        socialbar: "https://tightslybella.com/4b/2d/90/4b2d90ec32b0c927e601c425a5022eba.js",
        banner: "d578a163a0e37586d49aa87c93685e12"
    },
    "artworks.tyronesubg.art": {
        popunder: "https://tightslybella.com/61/ea/22/61ea22da3d74826856270246d99cc27f.js",
        socialbar: "https://tightslybella.com/54/0c/ce/540ccee3c5a6a937167023f83e740432.js",
        banner: "d578a163a0e37586d49aa87c93685e12"
    },
    "algebra.yallashoot.quest": {
        popunder: "https://tightslybella.com/52/bc/9c/52bc9cee8a7ebf3dbd96897e37f4c2f8.js",
        socialbar: "https://tightslybella.com/15/7b/77/157b77546296fe746764a94f4307051a.js",
        banner: "653b1f7fe9c21fcf7b6913e15e18e6fc"
    },
    "math.yallashoot.quest": {
        popunder: "https://tightslybella.com/e2/0e/10/e20e10adb3c747eff073862e8cdda779.js",
        socialbar: "https://tightslybella.com/4c/96/85/4c968562344ddacd7785b1a2543d74c9.js",
        banner: "fddd120eef3f658e9fbf0dba9140e871"
    },
    "learn-algebra.knpa.org": { 
        popunder: "https://tightslybella.com/5d/0e/ba/5d0eba410e72baa7deb4fb2ce8c8816f.js",
        socialbar: "https://tightslybella.com/e2/c0/05/e2c005a2ae9bb1675c1159d84de1df2b.js",
        banner: "788b7cc175ff7e4f591cbdb4b3aaf57a"
    },
    "math-sat.knpa.org": { 
        popunder: "https://tightslybella.com/27/81/7a/27817a608a0635499aaf0c8ae3925759.js",
        socialbar: "https://tightslybella.com/42/98/98/4298984896929a4655e68ba0c7c0ad33.js",
        banner: "0976c0a571a46fc36af7d6a37e369093"
    },
    "arcade-site-2ko.pages.dev": {
        popunder: "https://tightslybella.com/26/37/0f/26370fa4a144a63b642d83a0b5f14d2a.js",
        socialbar: "https://tightslybella.com/10/88/c1/1088c19e9519d9239c28caa632a11c29.js",
        banner: null
    },
    "math-algebra.modestocainstallmentpayday.loan": {
        popunder: "https://tightslybella.com/1f/cd/3b/1fcd3bf73f62eaa7db30213cac0a5a59.js",
        socialbar: "https://tightslybella.com/ef/87/e8/ef87e872c2b951f09527fed52de3a3b8.js",
        banner: "449b07079bb5cad4eb4a02584b157a59"
    },
    "algebra.modestocainstallmentpayday.loan": {
        popunder: "https://tightslybella.com/18/75/1c/18751ca2f2b247e6a72999a597d044ff.js",
        socialbar: "https://tightslybella.com/b9/e8/ab/b9e8ab2e30dc2279b709924009030018.js",
        banner: "449b07079bb5cad4eb4a02584b157a59"
    },
    "science.zakura.org": {
        popunder: "https://tightslybella.com/c8/b3/fa/c8b3faddaf796b2836d0767f51da2db3.js",
        socialbar: "https://tightslybella.com/3e/db/9a/3edb9aef47285d82352ea4067bd767d8.js",
        banner: "20a7e3ec005b60a7edd938d13f867b3e"
    },
    "hyperion.zakura.org": {
        popunder: "https://tightslybella.com/7f/eb/6e/7feb6e72d04392b209cc657b2a34593d.js",
        socialbar: "https://tightslybella.com/50/fc/64/50fc645c8a49f42dfe602adddf5d3c58.js",
        banner: "3da8aa1a68c1545502065e7713a595a2"
    },
    "banking.12monthloans.net": {
        popunder: "https://tightslybella.com/db/fb/23/dbfb23f3699c656d837c4728aecba38b.js",
        socialbar: "https://tightslybella.com/d8/fe/79/d8fe79899976977638545a5537ae2c1a.js",
        banner: "48a398c544e0eb92415fe51674b057c4"
    },
    "learning.12monthloans.net": {
        popunder: "https://tightslybella.com/0d/d6/19/0dd619708595e16336c280e087244ea5.js",
        socialbar: "https://tightslybella.com/8a/53/69/8a53698a7017aba48f20addf67b3f909.js",
        banner: "08e88f2062bd334fc65950a3ea3eb6ec"
    },
    "idfkk.buecherinsel.com": {
        popunder: "https://tightslybella.com/8c/e6/fa/8ce6fa02ccfb0aea070395622586fd80.js",
        socialbar: "https://tightslybella.com/5b/ef/22/5bef228e3596121fc42c783a5cf1cd32.js",
        banner: "997c06a473787db201c6060dd8e8aa6e"
    },
    "coolsite.buecherinsel.com": {
        popunder: "https://tightslybella.com/d4/0b/69/d40b69475e155bbb2999ec4f68d0346c.js",
        socialbar: "https://tightslybella.com/1d/00/3c/1d003c61c6c40913455380eeeddc709b.js",
        banner: "aa17b82a6f749125e5a76d2472d75534"
    },
    "banking.onlinequickpayday.loan": {
        popunder: "https://tightslybella.com/e7/39/e0/e739e0a306414d8476cb0f8edd38b7dc.js",
        socialbar: "https://tightslybella.com/94/44/5c/94445c37199c4ae1a7884ba84b4b7f87.js",
        banner: "38d82cb2ab303b4db277e9c31657b4ed"
    },
    "banks.onlinequickpayday.loan": {
        popunder: "https://tightslybella.com/20/3c/f5/203cf5710173bb010c518fa58a1c2905.js",
        socialbar: "https://tightslybella.com/8e/e1/b7/8ee1b7362c0edd00efc82e0361e74339.js",
        banner: "47b84be5f398224567dd62c6ccf1eaeb"
    },
    "banking.500dollarpayday.loan": {
        popunder: "https://tightslybella.com/48/7f/e5/487fe50047757814079d3f50c0b61bfe.js",
        socialbar: "https://tightslybella.com/46/5d/72/465d72935bbf39e6cb04d023bf8a9a57.js",
        banner: "711ec1d40d19a2877044de6a2c0aae04"
    },
    "banks.500dollarpayday.loan": {
        popunder: "https://tightslybella.com/ca/af/4e/caaf4e623da2edbc71a817623f23c0eb.js",
        socialbar: "https://tightslybella.com/5f/fb/06/5ffb064cdd4e1ae79552615e4e64a27d.js",
        banner: "7a498647bd3313c213cfa68e12d2e5c0"
    },
    "fallback": { 
        popunder: "https://tightslybella.com/98/68/5a/98685a8f1ed847f51e209887d705c98c.js",
        socialbar: "https://tightslybella.com/42/98/98/4298984896929a4655e68ba0c7c0ad33.js",
        banner: "b1ab3b9ddbdcbdd731ef991207af24e5"
    }
};

const compiledPopunder = `
    <script>
        (function() {
            const adMap = ${JSON.stringify(adConfig)};
            const siteAds = adMap[window.location.hostname] || adMap["fallback"];
            
            window.currentAdConfig = siteAds;

            const originalOpen = window.open;
            window.open = new Proxy(originalOpen, {
                apply: function(target, thisArg, args) {
                    const url = args[0];
                    if (url && typeof url === 'string' && (url.includes('blob:') || url === 'about:blank')) {
                        return Reflect.apply(target, thisArg, args);
                    }
                    
                    const lastPopTime = localStorage.getItem('lastPopTime');
                    const now = Date.now();
                    
                    if (lastPopTime && (now - parseInt(lastPopTime) < 300000)) {
                        console.log("Popunder blocked by 5-minute shield.");
                        return { closed: false, focus: function(){}, close: function(){}, document: { write: function(){}, open: function(){}, close: function(){} }, location: { href: '', assign: function(){}, replace: function(){} }, postMessage: function(){} };
                    }
                    
                    localStorage.setItem('lastPopTime', now.toString());
                    return Reflect.apply(target, thisArg, args);
                }
            });
            window.open.toString = function() { return "function open() { [native code] }"; };

            if (siteAds && siteAds.popunder) {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = siteAds.popunder;
                document.head.appendChild(script);
            }
        })();
    </script>
`;

const compiledBanners = `
    <script>
        function cycleAds() {
            if (window.location.hostname.includes('pages.dev')) return;
            const siteAds = window.currentAdConfig;
            if (!siteAds || !siteAds.banner) {
                const leftAd = document.getElementById('ad-left');
                const rightAd = document.getElementById('ad-right');
                if (leftAd) leftAd.innerHTML = '';
                if (rightAd) rightAd.innerHTML = '';
                return;
            }
            
            const bannerKey = siteAds.banner;
            const adData = "<scr" + "ipt type='text/javascript'>atOptions={key:'" + bannerKey + "',format:'iframe',height:600,width:160,params:{}};</scr" + "ipt><scr" + "ipt type='text/javascript' src='https://tightslybella.com/" + bannerKey + "/invoke.js'></scr" + "ipt>";
            const safeAdData = adData.replace(/"/g, '&quot;');
            const iframe = '<iframe srcdoc="' + safeAdData + '" style="width:160px;height:600px;border:none;overflow:hidden;"></iframe>';
            
            const leftAd = document.getElementById('ad-left');
            const rightAd = document.getElementById('ad-right');
            
            if (leftAd) leftAd.innerHTML = iframe;
            if (rightAd) rightAd.innerHTML = iframe;
        }
        
        window.addEventListener('load', () => { 
            cycleAds(); 
            setInterval(cycleAds, 100000); 
        });
    </script>
`;

const compiledSocialBar = `
    <script>
        (function() {
            const adMap = ${JSON.stringify(adConfig)};
            const siteAds = adMap[window.location.hostname] || adMap["fallback"];
            
            if (siteAds && siteAds.socialbar) {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = siteAds.socialbar;
                document.body.appendChild(script);
            }

            const originalTitleSetter = Object.getOwnPropertyDescriptor(Document.prototype, 'title').set;
            Object.defineProperty(document, 'title', {
                set: function(val) {
                    if (typeof val === 'string' && (val.includes('(1)') || val.includes('Message'))) return;
                    originalTitleSetter.call(this, val);
                }
            });

            setInterval(() => {
                const adFrames = document.querySelectorAll('iframe[id^="container-"]');
                const isPlaying = document.body.classList.contains('playing-game');
                
                adFrames.forEach(adFrame => {
                    const z = parseInt(window.getComputedStyle(adFrame).zIndex) || 0;
                    if (z < 1000) return;

                    if (isPlaying) {
                        adFrame.style.setProperty('display', 'none', 'important');
                        adFrame.style.setProperty('opacity', '0', 'important');
                    } else {
                        adFrame.style.setProperty('display', 'block', 'important');
                        adFrame.style.setProperty('opacity', '1', 'important');
                        
                        adFrame.style.setProperty('top', '100px', 'important');
                        adFrame.style.setProperty('left', '-50px', 'important');
                        adFrame.style.setProperty('right', 'auto', 'important');
                        adFrame.style.setProperty('bottom', 'auto', 'important');
                        
                        adFrame.style.setProperty('inset', '100px auto auto -50px', 'important');
                        
                        adFrame.style.setProperty('transform', 'scale(0.65)', 'important');
                        adFrame.style.setProperty('transform-origin', 'top left', 'important');
                        adFrame.style.setProperty('margin', '0', 'important');
                        adFrame.style.setProperty('z-index', '2147483640', 'important');
                    }
                });
            }, 50);
        })();
    </script>
`;

const indexPath = path.join(__dirname, 'index.html');

try {
    let html = fs.readFileSync(indexPath, 'utf8');

    html = html.replace(/(<!-- POPUNDER_START -->)[\s\S]*?(<!-- POPUNDER_END -->)/, `$1\n${compiledPopunder}\n$2`);
    html = html.replace(/(<!-- BANNERS_START -->)[\s\S]*?(<!-- BANNERS_END -->)/, `$1\n${compiledBanners}\n$2`);
    html = html.replace(/(<!-- SOCIALBAR_START -->)[\s\S]*?(<!-- SOCIALBAR_END -->)/, `$1\n${compiledSocialBar}\n$2`);

    fs.writeFileSync(indexPath, html, 'utf8');
    console.log('Success');
} catch (err) {
    console.error('Error updating ads', err);
}