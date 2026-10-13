export const siteHTML = `
    <div id="global-loader">
        <div class="loader-spinner"></div>
    </div>

    <div id="notification-container" style="position: fixed; top: 85px; left: 30px; z-index: 2147483647; display: flex; flex-direction: column; gap: 10px; pointer-events: none;"></div>

    <div id="stealth-ui" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100vw; height: 100vh; background: #f8f9fa; font-family: Arial, sans-serif; z-index: 2147483647; display: block; overflow-y: auto;">
        
        <div style="background: #fff; padding: 12px 24px; border-bottom: 1px solid #dadce0; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="color: #5f6368; font-size: 24px; cursor: pointer; padding-right: 15px;" onclick="window.location.href='https://docs.google.com'">≡</div>
                <div style="background: #4285f4; color: white; width: 40px; height: 40px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; font-family: 'Times New Roman', serif; cursor: pointer;" onclick="window.unlockHub()">≡</div>
                <h2 style="margin: 0; color: #5f6368; font-weight: normal; font-size: 22px; cursor: pointer;" onclick="window.location.href='https://docs.google.com'">Docs</h2>
            </div>
            <div style="flex: 1; max-width: 720px; margin: 0 40px;">
                <div style="background: #f1f3f4; padding: 12px 20px; border-radius: 8px; color: #5f6368; font-size: 16px; display: flex; align-items: center; gap: 15px; cursor: text;" onclick="window.location.href='https://docs.google.com'">
                    <svg focusable="false" viewBox="0 0 24 24" width="20" height="20" fill="#5f6368"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
                    <span>Search</span>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 20px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: #ea4335; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; cursor: pointer;" onclick="window.location.href='https://docs.google.com'">U</div>
            </div>
        </div>

        <div style="background: #f1f3f4; padding: 40px 24px; border-bottom: 1px solid #dadce0;">
            <div style="max-width: 900px; margin: 0 auto;">
                <h3 style="margin: 0 0 20px 0; color: #202124; font-weight: normal; font-size: 16px;">Start a new document</h3>
                <div style="display: flex; gap: 20px;">
                    <div style="cursor: pointer; text-align: center;" onclick="window.location.href='https://docs.google.com/document/u/0/create'">
                        <div style="width: 130px; height: 170px; background: #fff; border: 1px solid #dadce0; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 50px; color: #1a73e8; transition: border-color 0.2s;" onmouseover="this.style.borderColor='#1a73e8'" onmouseout="this.style.borderColor='#dadce0'">
                            <img src="https://ssl.gstatic.com/docs/templates/thumbnails/docs-blank-googlecolors.png" style="width:100%; height:100%; object-fit:cover; border-radius:4px;">
                        </div>
                        <p style="margin: 10px 0 0 0; font-size: 14px; color: #202124; font-weight: 500;">Blank</p>
                    </div>
                    <div style="cursor: pointer; text-align: center;" onclick="window.location.href='https://docs.google.com/document/u/0/?ftv=1'">
                        <div style="width: 130px; height: 170px; background: #fff; border: 1px solid #dadce0; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 50px; color: #1a73e8; transition: border-color 0.2s;" onmouseover="this.style.borderColor='#1a73e8'" onmouseout="this.style.borderColor='#dadce0'">
                            <img src="https://ssl.gstatic.com/docs/templates/thumbnails/docs-blank-googlecolors.png" style="width:100%; height:100%; object-fit:cover; border-radius:4px;">
                        </div>
                        <p style="margin: 10px 0 0 0; font-size: 14px; color: #202124; font-weight: 500;">Project proposal</p>
                    </div>
                    <div style="cursor: pointer; text-align: center;" onclick="window.location.href='https://docs.google.com/document/u/0/?ftv=1'">
                        <div style="width: 130px; height: 170px; background: #fff; border: 1px solid #dadce0; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 50px; color: #1a73e8; transition: border-color 0.2s;" onmouseover="this.style.borderColor='#1a73e8'" onmouseout="this.style.borderColor='#dadce0'">
                            <img src="https://ssl.gstatic.com/docs/templates/thumbnails/docs-blank-googlecolors.png" style="width:100%; height:100%; object-fit:cover; border-radius:4px;">
                        </div>
                        <p style="margin: 10px 0 0 0; font-size: 14px; color: #202124; font-weight: 500;">Resume</p>
                    </div>
                </div>
            </div>
        </div>

        <div style="max-width: 900px; margin: 40px auto; padding: 0 24px;">
            <div style="background: #fff; border: 1px solid #dadce0; padding: 25px 30px; border-radius: 8px;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                    <div style="background: #fce8e6; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #c5221f; font-weight: bold; font-size: 20px;">!</div>
                    <h3 style="margin:0; color: #202124; font-weight: 500; font-size: 22px;">Sync Error: Workspace Offline</h3>
                </div>
                <p style="color: #3c4043; line-height: 1.6; font-size: 14px;">The shared cloud workspace failed to synchronize correctly with the Google servers. Your session token is pending validation or your network connection was briefly interrupted.</p>
                <p style="color: #3c4043; line-height: 1.6; font-size: 14px; margin-bottom: 0;"><strong>Please refresh your browser window (F5 or CTRL+R)</strong> to clear your local cache, securely re-authenticate with the workspace, and reload your documents.</p>
            </div>
            
            <h3 style="margin: 30px 0 15px 0; color: #202124; font-weight: 500; font-size: 16px;">Recent documents</h3>
            <div style="border: 1px solid #dadce0; border-radius: 8px; overflow: hidden; background: #fff;">
                <div style="display: flex; padding: 12px 16px; border-bottom: 1px solid #dadce0; cursor: pointer;" onclick="window.location.href='https://docs.google.com'">
                    <div style="flex: 1; display: flex; align-items: center; gap: 12px; color: #3c4043; font-size: 14px; font-weight: 500;">
                        <div style="background: #4285f4; color: white; width: 24px; height: 24px; border-radius: 2px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; font-family: 'Times New Roman', serif;">≡</div>
                        Algebra Notes
                    </div>
                    <div style="width: 150px; color: #5f6368; font-size: 12px; display: flex; align-items: center;">Opened 2:41 PM</div>
                </div>
                <div style="display: flex; padding: 12px 16px; cursor: pointer;" onclick="window.location.href='https://docs.google.com'">
                    <div style="flex: 1; display: flex; align-items: center; gap: 12px; color: #3c4043; font-size: 14px; font-weight: 500;">
                        <div style="background: #4285f4; color: white; width: 24px; height: 24px; border-radius: 2px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; font-family: 'Times New Roman', serif;">≡</div>
                        US History Essay Rough Draft
                    </div>
                    <div style="width: 150px; color: #5f6368; font-size: 12px; display: flex; align-items: center;">Opened yesterday</div>
                </div>
            </div>
        </div>

    </div>

    <div id="arcade-ui">

        <div class="side-ad side-ad-left" id="ad-left"></div>
        <div class="side-ad side-ad-right" id="ad-right"></div>

        <div id="game-container">
            <div id="iframe-wrapper"></div>
            <div id="game-bottom-bar">
                <div class="gb-left-controls">
                    <button class="gb-btn" onclick="window.closeGame()">← Hub</button>
                    <button class="gb-btn" onclick="window.goFullscreen()">⛶ Fullscreen</button>
                    <button class="gb-btn" onclick="window.reloadGame()">↻ Restart</button>
                    <button id="game-fav-btn" class="gb-btn fav-btn" onclick="window.toggleFavorite()" style="margin-left: 5px;">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

<div id="canvas-bg"></div>

<div style="position: fixed; top: 25px; left: 30px; z-index: 2147483647;">
    <button id="mode-toggle" class="top-widget" onclick="if(window.applyExperienceMode){window.applyExperienceMode(window.currentMode === 'games' ? 'web' : 'games');}" style="position: static; display: flex; align-items: center; gap: 8px; transform: scale(1.1); transform-origin: top left; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
        <i class="fa-solid fa-gamepad" id="mode-toggle-icon"></i> <span id="mode-toggle-text">GAMES</span>
    </button>
</div>

<div id="home-view" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100vw; height: 100vh; position: fixed; top: 0; left: 0; z-index: 10; overflow: hidden; box-sizing: border-box;">
    <h1 style="text-align: center; margin-top: -60px;">Hyperion Hub</h1>
    
    <div class="search-wrapper" style="display: flex; justify-content: center; align-items: center; width: 100%; max-width: 700px; margin: 0 auto 15px auto; position: relative; z-index: 2;">
        <input type="text" id="proxy-search" placeholder="Browse the web freely..." autocomplete="off" style="width: 100%; box-sizing: border-box; padding: 0 20px; height: 50px; border-radius: 8px; font-size: 15px; font-family: 'Poppins', sans-serif; background: var(--search-bg); color: var(--text-main); border: 1px solid var(--border-primary); outline: none; transition: all 0.2s ease;">
    </div>

    <div id="hub-quote-display" style="font-size: 14px; color: var(--text-main); font-style: italic; margin: 0 auto 20px auto; font-weight: 600; text-align: center;"></div>

    <div id="web-container" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 35px; max-width: 800px; margin: 15px auto 0 auto; position: relative; z-index: 5; transform: scale(0.85);">
        <div class="web-bookmark" data-url="https://movy.sx/">
            <div class="bookmark-circle"><i class="fa-solid fa-film" style="font-size: 26px; color: #fff;"></i></div>
            <span>Movies</span>
        </div>
        <div class="web-bookmark" data-url="https://discord.com">
            <div class="bookmark-circle"><i class="fa-brands fa-discord" style="font-size: 28px; color: #fff;"></i></div>
            <span>Discord</span>
        </div>
        <div class="web-bookmark" data-url="https://tiktok.com">
            <div class="bookmark-circle"><i class="fa-brands fa-tiktok" style="font-size: 26px; color: #fff;"></i></div>
            <span>TikTok</span>
        </div>
        <div class="web-bookmark" data-url="https://chatgpt.com">
            <div class="bookmark-circle"><i class="fa-solid fa-robot" style="font-size: 24px; color: #fff;"></i></div>
            <span>ChatGPT</span>
        </div>
        <div class="web-bookmark" data-url="https://duckduckgo.com">
            <div class="bookmark-circle"><i class="fa-solid fa-magnifying-glass" style="font-size: 24px; color: #fff;"></i></div>
            <span>Search</span>
        </div>
        <div class="web-bookmark" data-url="https://youtube.com">
            <div class="bookmark-circle"><i class="fa-brands fa-youtube" style="font-size: 26px; color: #fff;"></i></div>
            <span>Youtube</span>
        </div>
        <div id="custom-bookmarks-container" style="display: contents;"></div>
        <div class="web-bookmark" onclick="window.openModal('add-bookmark-modal')">
            <div class="bookmark-circle" style="border: 1px dashed var(--text-muted); background: transparent;">
                <i class="fa-solid fa-plus" style="font-size: 24px; color: var(--text-muted);"></i>
            </div>
            <span style="color: var(--text-muted);">Add New</span>
        </div>
    </div>
</div>

<div id="games-view" style="display: none; flex-direction: column; align-items: center; width: 100vw; min-height: 100vh; position: absolute; top: 0; left: 0; z-index: 10; padding: 100px 20px 40px 20px; box-sizing: border-box;">
    <h1 style="text-align: center; margin-bottom: 30px;">Hyperion Hub</h1>
    
    <div class="search-wrapper" style="display: flex; justify-content: center; align-items: stretch; gap: 12px; width: 100%; max-width: 700px; margin: 0 auto 15px auto; position: relative;">
        <input type="text" id="game-search" placeholder="Select a game to launch..." autocomplete="off" oninput="window.updateSearchFilter()" style="flex: 1; min-width: 0; box-sizing: border-box; padding: 0 20px; height: 50px; border-radius: 8px; font-size: 15px; font-family: 'Poppins', sans-serif; background: var(--search-bg); color: var(--text-main); border: 1px solid var(--border-primary); outline: none; transition: all 0.2s ease;">
        <button id="hub-fav-toggle" class="fav-filter-btn" onclick="window.toggleHubFavorites()" style="flex-shrink: 0; margin: 0; height: 50px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="fa-regular fa-heart"></i> Favorites
        </button>
    </div>

    <div id="games-quote-display" style="font-size: 14px; color: var(--text-main); font-style: italic; margin: 0 auto 20px auto; font-weight: 600; text-align: center;"></div>

    <div id="provider-disclaimer" style="display: none; font-size: 11px; color: var(--text-muted); margin-bottom: 20px; text-transform: lowercase; letter-spacing: 0.5px;">
        *Any ads or content shown in-game are strictly from the currently selected provider, not us
    </div>
    
    <div class="grid" id="main-game-grid"></div>
    <div class="pagination" id="pagination-controls"></div>
</div>

<div id="proxy-container" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: var(--panel-bg); z-index: 2147483640; flex-direction: column; overflow: hidden; margin: 0; border-radius: 0;">
    
    <div class="browser-tab-bar">
        <button class="proxy-exit-btn" onclick="window.closeAllProxyTabs()"><i class="fa-solid fa-angles-left"></i> Back</button>
        <div class="tab-divider"></div>
        <div id="browser-tab-container" class="browser-tab-container"></div>
        <button class="browser-new-tab-btn" onclick="window.createNewBrowserTab()">+</button>
    </div>

    <div class="proxy-navbar">
        <div class="proxy-nav-left">
    <button id="nav-back-btn" class="proxy-nav-btn" title="Back"><i class="fa-solid fa-arrow-left"></i></button>
    <button id="nav-forward-btn" class="proxy-nav-btn" title="Forward"><i class="fa-solid fa-arrow-right"></i></button>
    
    <button id="nav-refresh-btn" class="proxy-nav-btn" title="Reload">
        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
    </button>

    <button id="nav-home-btn" class="proxy-nav-btn" title="Home"><i class="fa-solid fa-house"></i></button>
</div>
        
        <div class="proxy-nav-center">
            <div class="proxy-url-box">
                <i class="fa-solid fa-lock" style="color: var(--text-muted); font-size: 12px;"></i>
                <input type="text" id="proxy-url-bar" autocomplete="off" spellcheck="false" placeholder="Search Google or type a URL">
            </div>
        </div>
        
        <div class="proxy-nav-right">
            <button id="fullscreen-proxy" class="proxy-nav-btn"><i class="fa-solid fa-expand"></i></button>
        </div>
    </div>

    <div id="proxy-frame-wrapper" style="flex: 1; position: relative; background: var(--bg-main); width: 100%; display: flex; flex-direction: column;"></div>
</div>

        <button id="music-widget" class="top-widget" onclick="window.openModal('music-modal')">MUSIC</button>
        <button id="chat-nav-widget" class="top-widget" onclick="window.openModal('chat-modal')">CHAT</button>
        <button id="settings-widget" class="top-widget" onclick="window.openModal('settings-modal')">SETTINGS</button>
        <button id="discord-widget" class="top-widget" onclick="window.openModal('discord-modal')">DISCORD</button>

        <div id="mini-music-widget" class="music-widget-container">
            <button id="music-show-btn" class="music-reopen-btn" onclick="window.toggleMiniPlayer()" title="Show Music Player">
                <i class="fa-solid fa-music"></i>
            </button>
            <div id="music-widget-full-ui">
                <div id="music-ambient-bg" class="music-ambient-layer"></div>
                <div class="music-widget-content">
                    <div class="music-info-row">
                        <div class="music-art-frame">
                            <img id="music-album-art" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23737373'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E" alt="Art">
                        </div>
                        <div class="music-track-details">
                            <div id="music-track-title">Not Playing</div>
                            <div id="music-track-artist">Select a track</div>
                        </div>
                        <div class="music-top-actions">
                            <button class="music-action-btn" onclick="window.openModal('music-modal')" title="Expand Library">⛶</button>
                            <button class="music-action-btn" onclick="window.toggleMiniPlayer()" title="Hide Player"><i class="fa-solid fa-eye-slash"></i></button>
                        </div>
                    </div>
                    <div class="music-controls-row">
                        <button id="music-shuffle"><i class="fa-solid fa-shuffle"></i></button>
                        <button id="music-prev"><i class="fa-solid fa-backward-step"></i></button>
                        <button id="music-play-pause" class="play-pause-btn"><i class="fa-solid fa-play"></i></button>
                        <button id="music-next"><i class="fa-solid fa-forward-step"></i></button>
                        <button id="music-loop"><i class="fa-solid fa-repeat"></i></button>
                    </div>
                    <div class="music-progress-row">
                        <span id="music-time-current">0:00</span>
                        <div class="music-progress-bar-bg" id="music-progress-bg">
                            <div class="music-progress-bar-fill" id="music-progress-fill"></div>
                        </div>
                        <span id="music-time-total">0:00</span>
                    </div>
                </div>
            </div>
            <audio id="global-audio-player" style="display: none;"></audio>
        </div>

            <div id="music-modal" class="fullscreen-modal" onclick="window.closeModal(event, 'music-modal')">
        <div class="modal-box music-library-box">
            <button class="modal-close-corner spotify-close" onclick="window.forceClose('music-modal')">&times;</button>
            
            <div class="music-modal-header" style="display: flex; justify-content: space-between; align-items: center;">
                <div class="music-search-wrap" style="flex: 1;">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="music-library-search" placeholder="What do you want to play?" autocomplete="off">
                </div>
                <div style="background: rgba(249, 115, 22, 0.15); border: 1px solid #f97316; color: #f97316; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-left: 20px;">
                    <i class="fa-solid fa-person-digging"></i> Still Under Construction!
                </div>
            </div>
            
            <div class="music-modal-body">
            <h2 class="spotify-section-title">Popular Artists</h2>
            <div class="music-artist-grid" id="music-artist-pills">
            </div>
            
            <h2 class="spotify-section-title" id="spotify-albums-title" style="margin-top: 10px; display: none;">Popular Albums</h2>
            <div class="music-album-grid" id="music-album-grid" style="display: none;">
            </div>
            
            <h2 class="spotify-section-title" style="margin-top: 10px;">Tracks</h2>
            <div class="music-track-table-header">
                <span>#</span>
                <span>Title</span>
                <span>Artist</span>
                <span style="text-align: right;"><i class="fa-regular fa-clock"></i></span>
            </div>
            <div class="music-track-list" id="music-track-list">
                <div class="music-list-loading">Loading tracks...</div>
            </div>
        </div>
        </div>
    </div>

        <div id="mini-chat-widget" style="position:fixed; right:20px; bottom:20px; width:340px; background:var(--panel-bg); border:1px solid var(--border-primary); border-radius:12px; z-index:2147483645 !important; font-family:'Poppins', sans-serif; display:flex; flex-direction:column; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
            <div style="padding:12px 15px; border-bottom:1px solid var(--border-primary); display:flex; justify-content:space-between; align-items:center; background:var(--card-bg); border-radius:12px 12px 0 0; cursor:pointer;" onclick="window.toggleMiniChat()">
                <select id="mini-chat-room-select" class="mini-chat-select" onclick="event.stopPropagation()" onchange="window.loadRoom(this.value)">
                    <option value="public">Global Chat</option>
                </select>
                <span style="color:var(--text-muted); font-weight:bold; font-size:18px; line-height:0.5; margin-top:-8px;">_</span>
            </div>
            <div id="mini-chat-body" style="display:flex; flex-direction:column; position:relative; max-height:450px; opacity:1; pointer-events:auto; transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease; overflow:hidden;">
                <div id="mini-chat-requests" class="global-requests" style="top:5px; padding:0 12px;"></div>
                <div id="mini-chat-messages" style="height:260px; overflow-y:auto; padding:12px; display:flex; flex-direction:column; gap:8px;"></div>
                <div style="padding:12px; border-top:1px solid var(--border-primary); position:relative;">
                    <div id="mini-reply-bar" class="reply-bar">
                        <span>Replying to <b id="mini-reply-user">@user</b></span>
                        <button class="reply-close-btn" onclick="window.cancelReply()">✕</button>
                    </div>
                    <div style="display:flex; gap:8px; align-items:center; position:relative;">
    <textarea id="mini-chat-input" placeholder="Type a message..." maxlength="3000" rows="1" style="flex:1; background:var(--search-bg); color:var(--text-main); border:1px solid rgba(255, 255, 255, 0.25); padding:12px 95px 12px 12px; border-radius:8px; outline:none; font-size:13px; resize:none; overflow-y:auto; line-height:1.4; height:42px; box-sizing:border-box; font-family:'Poppins', sans-serif;"></textarea>

    <div id="mini-emoji-autocomplete" class="emoji-autocomplete"></div>
    
    <button class="emoji-btn" onclick="document.getElementById('mini-chat-img-upload').click()" style="right: 62px; font-size: 13px;" title="Upload Image"><i class="fa-regular fa-image"></i></button>
    <input type="file" id="mini-chat-img-upload" accept="image/png, image/jpeg, image/gif, image/webp" style="display: none;" onchange="window.handleChatImageUpload(event, 'mini')">

    <button class="emoji-btn" onclick="window.toggleGifPicker(event, 'mini')" style="right: 34px; font-weight: 800; font-size: 10px; letter-spacing: 0.5px;" title="Browse GIFs">GIF</button>
    <button id="mini-emoji-btn" class="emoji-btn" style="right: 8px;" onclick="window.toggleMiniEmojiPicker(event)">
        <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM8.5 9.5C7.67157 9.5 7 10.1716 7 11C7 11.8284 7.67157 12.5 8.5 12.5C9.32843 12.5 10 11.8284 10 11C10 10.1716 9.32843 9.5 8.5 9.5ZM17 11C17 10.1716 16.3284 9.5 15.5 9.5C14.6716 9.5 14 10.1716 14 11C14 11.8284 14.6716 12.5 15.5 12.5C16.3284 12.5 17 11.8284 17 11ZM12 17.5C14.4853 17.5 16.5 15.5 16.5 14.5H7.5C7.5 15.5 9.51472 17.5 12 17.5Z"></path></svg>
    </button>
</div>

                    <div id="mini-gif-picker-container" class="emoji-picker-container" style="display: none; background: var(--panel-bg); border: 1px solid var(--border-primary); padding: 12px; flex-direction: column; gap: 10px; height: 280px; box-sizing: border-box; bottom: 65px; right: 12px; width: 280px;">
                        <input type="text" id="mini-gif-search" placeholder="Search Giphy..." style="width:100%; box-sizing: border-box; padding: 8px; border-radius: 6px; background: var(--search-bg); color: var(--text-main); border: 1px solid var(--border-primary); outline: none; font-family: 'Space Grotesk', sans-serif;">
                        <div id="mini-gif-results" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; overflow-y: auto; flex: 1;"></div>
                    </div>

                    <div id="mini-emoji-picker-container" class="emoji-picker-container" style="bottom: 65px; right: 12px; height: 280px; width: 280px;"></div>
                </div>
            </div>
        </div>

        <div id="chat-modal" class="fullscreen-modal" onclick="window.closeModal(event, 'chat-modal')">
            <div class="modal-box" style="display:flex; width:1200px; height:850px; max-width:90vw; max-height:85vh; padding:0; overflow:hidden;">
                
                <div style="width:230px; background:var(--sidebar-bg); border-right:1px solid var(--border-primary); display:flex; flex-direction:column; justify-content:space-between;">
                    
                    <div style="display:flex; flex-direction:column; overflow:hidden; flex:1;">
                        <div style="padding:24px 20px; border-bottom:none; z-index:10;">
                            <h3 style="margin:0; font-family:'Poppins', sans-serif; font-size:22px; font-weight:800; color:var(--text-main); text-align:left; padding-left:10px;">Chat</h3>
                        </div>
                        <div style="padding:20px 15px; flex:1; overflow-y:auto; position:relative;">

                            <div style="font-size:12px; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px; padding-left:4px;">📌 Important Stuff</div>
<div class="channel-wrapper"><button class="channel-btn" onclick="window.loadRoom('rules')" id="btn-room-rules">📜 rules</button></div>
<div class="channel-wrapper"><button class="channel-btn" onclick="window.loadRoom('announcements')" id="btn-room-announcements">📢 announcements</button></div>
<div class="channel-wrapper"><button class="channel-btn" onclick="window.loadRoom('site-updates')" id="btn-room-site-updates">❗ site-updates</button></div>
<div class="channel-wrapper"><button class="channel-btn" onclick="window.loadRoom('links')" id="btn-room-links">🔗 links</button></div>

<div class="channel-wrapper"><button class="channel-btn active" onclick="window.loadRoom('public')" id="btn-room-public">💬 global-chat</button></div>
<div class="channel-wrapper"><button class="channel-btn" onclick="window.loadRoom('suggestions')" id="btn-room-suggestions">❓ suggestions</button></div>
<div class="channel-wrapper"><button class="channel-btn" onclick="window.loadRoom('random-bs')" id="btn-room-random-bs">⁉️ random-bs</button></div>

<!-- TEMPORARILY DISABLED 
<div style="font-size:12px; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin:30px 0 12px 0; padding-left:4px; display:flex; justify-content:space-between; align-items:center;">User Made</div>
<div id="public-rooms-list" style="margin-bottom:12px;"><div style="font-size:11px; color:var(--text-muted); padding:4px;">Loading...</div></div>
<button class="channel-btn" onclick="window.createPublicRoom()" style="color:var(--text-main);">+ Create Public Channel</button>
-->

<div style="font-size:12px; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin:30px 0 12px 0; padding-left:4px; display:flex; justify-content:space-between; align-items:center;">Private Rooms</div>
<div id="private-rooms-list" style="margin-bottom:12px;"></div>
<button class="channel-btn" onclick="window.createPrivateRoom()" style="color:var(--text-main);">+ Create Room</button>
<button class="channel-btn" onclick="window.joinPrivateRoomUI()" style="color:var(--text-main);"># Join Room</button>

                        </div>
                    </div>

                    <div style="background:var(--sidebar-bg); border-top:none; display:flex; flex-direction:column; z-index:10;">
                        <div class="my-keys-toggle" onclick="window.toggleMyKeys()">
                            <span>My Keys</span>
                            <span id="my-keys-arrow">▼</span>
                        </div>
                        <div id="my-keys-list">
                            <div style="font-size:11px; color:var(--text-muted); font-style:italic;">No chatrooms made! Click on Create Room to make one!</div>
                        </div>

                        <div style="padding:18px 20px; background:var(--card-bg); border-top:1px solid var(--border-primary); display:flex; align-items:center; justify-content:space-between; min-height: 80px; box-sizing: border-box;">
                            <div style="display:flex; flex-direction:column; overflow:hidden; padding-right:10px;">
                                <span style="font-size:10px; color:var(--text-muted); font-weight:800; text-transform:uppercase;">Playing as</span>
                                <span id="current-username-display" style="font-size:14px; color:var(--text-main); font-weight:600; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;"></span>
                            </div>
                            <button onclick="window.openChatProfile()" style="background: var(--search-bg); border: 1px solid var(--border-primary); color: var(--text-main); padding: 8px 12px; border-radius: 6px; cursor: pointer; transition: transform 0.2s;" title="Change Chat Settings">
                                <i class="fa-solid fa-gear"></i>
                            </button>
                        </div>
                    </div>

                </div>

                <div style="flex:1; display:flex; flex-direction:column; background:var(--panel-bg); position:relative; overflow:hidden;">
                    <div id="full-chat-requests" class="global-requests" style="top:85px; padding:0 30px;"></div>
                    <button class="modal-close-corner" onclick="window.forceClose('chat-modal')" style="top:18px; right:20px;">&times;</button>
                    
                    <div style="padding:24px 30px; border-bottom:none; background:var(--card-bg); z-index:5;">
                        <h4 id="full-chat-title" style="margin:0; font-size:20px; color:var(--text-main); font-family: 'Space Grotesk', sans-serif; font-weight: 700;"># global-chat</h4>
                    </div>
                    
                    <div id="full-chat-messages" style="flex:1; padding:25px 30px; overflow-y:auto; display:flex; flex-direction:column; gap:16px;"></div>
                    
                    <div style="padding:15px 30px; background:var(--card-bg); border-top:1px solid var(--border-primary); position: relative; min-height: 80px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center;">
                        
                        <div id="full-reply-bar" class="reply-bar" style="margin-bottom: 5px;">
                            <span><i class="fa-solid fa-reply"></i> Replying to <b id="full-reply-user">@user</b></span>
                            <button class="reply-close-btn" onclick="window.cancelReply()">✕</button>
                        </div>
                        
                        <div id="full-gif-preview" style="display:none; padding-bottom:10px;"></div>

                        <div id="full-chat-input-area" style="display: flex; align-items: center; gap: 10px; background: var(--search-bg); padding: 10px 14px; border-radius: 12px; border: 1px solid var(--border-primary);">

    <div id="full-emoji-autocomplete" class="emoji-autocomplete"></div>

    <button class="chat-action-btn" onclick="document.getElementById('full-chat-img-upload').click()" title="Upload Image"><i class="fa-regular fa-image"></i></button>
    <input type="file" id="full-chat-img-upload" accept="image/png, image/jpeg, image/gif, image/webp" style="display: none;" onchange="window.handleChatImageUpload(event, 'full')">

    <button class="chat-action-btn gif-text" onclick="window.toggleGifPicker(event, 'full')" title="Browse GIFs">GIF</button>
    
    <button class="chat-action-btn" onclick="window.toggleFullEmojiPicker(event)" title="Emojis"><i class="fa-regular fa-face-smile"></i></button>
    <textarea id="full-chat-input" placeholder="Message..." maxlength="3000" rows="1" style="flex:1; height:42px; background:transparent; color:var(--text-main); border:none; outline:none; font-size:15px; font-family:'Space Grotesk', sans-serif; padding:10px 12px 0 12px; resize:none; overflow-y:auto; box-sizing:border-box;"></textarea>
    
    <button class="chat-send-btn" onclick="window.handleSend(document.getElementById('full-chat-input').value, 'full')"><i class="fa-solid fa-arrow-up"></i></button>
</div>

                        <div id="full-chat-readonly" style="display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); padding: 16px; border-radius: 12px; border: 1px dashed var(--border-primary); color: var(--text-muted); font-size: 13px; font-weight: 600; font-family: 'Space Grotesk', sans-serif;">
                            <i class="fa-solid fa-lock" style="margin-right: 8px;"></i> Only approved people can send messages in this channel.
                        </div>
                    </div>
                </div>
            </div> 
        </div>

        <div id="full-gif-picker-container" class="emoji-picker-container" style="display: none; background: var(--panel-bg); border: 1px solid var(--border-primary); padding: 14px; flex-direction: column; gap: 10px; height: 350px; box-sizing: border-box; bottom: 100px; left: 30px;">
            <input type="text" id="full-gif-search" placeholder="Search Giphy and press Enter..." style="width:100%; padding: 10px; border-radius: 6px; background: var(--search-bg); color: var(--text-main); border: 1px solid var(--border-primary); outline: none; font-family: 'Space Grotesk', sans-serif;">
            <div id="full-gif-results" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; overflow-y: auto; flex: 1;"></div>
        </div>
        
        <div id="full-emoji-picker-container" class="emoji-picker-container" style="display: none; bottom: 100px; left: 30px; height: 350px; width: 350px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);"></div>

        <div id="room-settings-menu" class="room-settings-menu">
            <div id="room-settings-main" style="display:flex; flex-direction:column; gap:4px;">
                <button class="settings-opt-btn" onclick="window.renameRoom(event)">Rename Room</button>
                <button class="settings-opt-btn" onclick="window.showKickOptions(event)">Kick User ➔</button>
                <button class="settings-opt-btn" onclick="window.showDeleteOptions(event)" style="color:#e86a8e;">Delete Room ➔</button>
            </div>
            <div id="room-settings-kick" style="display:none; flex-direction:column; gap:4px; max-height:150px; overflow-y:auto;">
                <button class="settings-opt-btn" onclick="window.showMainOptions(event)">← Back</button>
                <div id="kick-user-list" style="display:flex; flex-direction:column; gap:4px;"></div>
            </div>
            <div id="room-settings-delete" style="display:none; flex-direction:column; gap:4px;">
                <button class="settings-opt-btn" onclick="window.showMainOptions(event)">← Back</button>
                <button class="settings-opt-btn" onclick="window.deleteRoomIn(0, event)">Delete Immediately</button>
                <button class="settings-opt-btn" onclick="window.deleteRoomIn(10, event)">Delete in 10s</button>
                <button class="settings-opt-btn" onclick="window.deleteRoomIn(30, event)">Delete in 30s</button>
                <button class="settings-opt-btn" onclick="window.deleteRoomIn(60, event)">Delete in 1m</button>
                <button class="settings-opt-btn" onclick="window.deleteRoomIn(300, event)">Delete in 5m</button>
            </div>
            <button class="settings-opt-btn" onclick="window.cancelDeletion(event)" id="cancel-delete-btn" style="color:#e86a8e; display:none; margin-top:4px;">Stop Deletion</button>
        </div>

        <div id="discord-modal" class="fullscreen-modal" onclick="window.closeModal(event, 'discord-modal')">
            <div class="modal-box discord-box">
                <button class="modal-close-corner" style="top: 14px; right: 18px;" onclick="window.forceClose('discord-modal')">&times;</button>
                <h4>Join the discord for links AND updates :)</h4>
                <a class="join-btn" href="https://discord.gg/4b64tAUTKA" target="_blank">Join server</a>
            </div>
        </div>

        <div id="add-bookmark-modal" class="fullscreen-modal" onclick="window.closeModal(event, 'add-bookmark-modal')">
    <div class="modal-box" style="padding: 30px; width: 400px; text-align: left;">
        <button class="modal-close-corner" onclick="window.forceClose('add-bookmark-modal')">&times;</button>
        <h4 style="margin: 0 0 20px 0; font-family: 'Space Grotesk', sans-serif; font-size: 20px; color: var(--text-main);">Add Custom Bookmark</h4>
        
        <label class="setting-label">Site Name</label>
        <input type="text" id="bm-name" class="setting-input" placeholder="e.g. Reddit" style="margin-bottom: 15px;">
        
        <label class="setting-label">URL</label>
        <input type="text" id="bm-url" class="setting-input" placeholder="https://reddit.com" style="margin-bottom: 15px;">
        
        <label class="setting-label">Image URL (Optional)</label>
        <input type="text" id="bm-image" class="setting-input" placeholder="Leave blank to auto-fetch site icon" style="margin-bottom: 20px;">
        
        <button class="action-btn" onclick="window.saveCustomBookmark()">Add Bookmark</button>
    </div>
</div>

        <div id="badge-modal" class="fullscreen-modal" onclick="window.closeModal(event, 'badge-modal')">
            <div class="modal-box" style="padding: 30px; width: 400px; text-align: left;">
                <button class="modal-close-corner" onclick="window.forceClose('badge-modal')">&times;</button>
                <h4 style="margin: 0 0 20px 0; font-family: 'Space Grotesk', sans-serif; font-size: 20px; color: var(--text-main);">Manage User Badges</h4>

                <input type="hidden" id="badge-target-device">
                <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--border-primary);">
                    <label class="setting-label">Force/Edit Username</label>
                    <div style="display: flex; gap: 8px; margin-top: 8px;">
                        <input type="text" id="badge-forced-name" class="setting-input" placeholder="Leave blank to reset..." style="margin: 0;">
                        <button class="action-btn" onclick="window.saveForcedName()" style="width: auto; padding: 0 16px;">Save</button>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label class="setting-label" style="display:block; margin-bottom:8px;">Current Badges</label>
                    <div id="current-badges-list" style="max-height: 120px; overflow-y: auto;"></div>
                </div>

                <div style="width:100%; height:1px; background:var(--border-primary); margin-bottom:20px;"></div>

                <label class="setting-label">Add New Badge</label>
                <input type="text" id="badge-label" class="setting-input" placeholder="Type badge name..." style="margin-bottom: 15px; text-transform: uppercase;">

                <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <span style="font-size: 13px; font-weight: 600; color: var(--text-main);">Background Color</span>
                    <input type="color" id="badge-bg-color" value="#f59e0b" style="background:none; border:none; width:40px; height:30px; cursor:pointer;">
                </div>

                <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <span style="font-size: 13px; font-weight: 600; color: var(--text-main);">Text Color</span>
                    <input type="color" id="badge-text-color" value="#000000" style="background:none; border:none; width:40px; height:30px; cursor:pointer;">
                </div>

                <div style="margin-bottom: 20px; text-align: center; padding: 12px; background: var(--card-bg); border-radius: 8px; border: 1px solid var(--border-primary);">
                    <span id="badge-preview-text" style="font-size:9px; font-weight:800; padding:2px 6px; border-radius:4px; letter-spacing:0.5px; vertical-align:middle; display:inline-flex; align-items:center; justify-content:center; height:18px; box-sizing:border-box; background:#f59e0b; color:#000000;">PREVIEW</span>
                </div>

                <button class="action-btn" onclick="window.saveBadge()">Add Badge</button>
            </div>
        </div>

        <div id="settings-modal" class="fullscreen-modal" onclick="window.closeModal(event, 'settings-modal')">
            <div class="modal-box settings-container" style="display:flex; width:850px; max-width:90vw; height:600px; max-height:85vh; text-align:left; overflow:hidden;">
                <button class="modal-close-corner" onclick="window.forceClose('settings-modal')">&times;</button>
                
                <div class="settings-sidebar">
                    <h3>Settings</h3>
                    <button class="tab-btn active" onclick="window.switchTab(event, 'tab-appearance')">Appearance</button>
                    <button class="tab-btn" onclick="window.switchTab(event, 'tab-games')">Games</button>
                    <button class="tab-btn" onclick="window.switchTab(event, 'tab-privacy')">Privacy and Security</button>
                    <button class="tab-btn" onclick="window.switchTab(event, 'tab-sitedata')">Site Data</button>
                    <button class="tab-btn" onclick="window.switchTab(event, 'tab-network')">Proxy</button>
                </div>

                <div class="settings-content-area">
                    <div id="tab-appearance" class="settings-tab" style="display: block;">
                        
                        <h4>Appearance</h4>
                        
                        <div class="setting-section">
                            <h5>Default Startup</h5>
                            <p>Choose what opens when you first load the Hub</p>
                            <div class="engine-picker-grid">
                                <div class="engine-card" id="exp-card-web" onclick="window.setDefaultExperience('web')">
                                    <div class="engine-title" style="margin-bottom: 4px;">Web</div>
                                    <div class="engine-desc">Starts on the web browser view</div>
                                </div>
                                <div class="engine-card" id="exp-card-games" onclick="window.setDefaultExperience('games')">
                                    <div class="engine-title" style="margin-bottom: 4px;">Games</div>
                                    <div class="engine-desc">Starts directly in the game library</div>
                                </div>
                            </div>
                        </div>

                        <div class="setting-section">
                            <div class="setting-row">
                                <div>
                                    <h5>Potato Mode</h5>
                                    <p style="margin:0;">Disable background animations for weaker devices.</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" id="performance-toggle">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </div>
                        <div class="setting-section">
                            <div class="setting-row">
                                <div>
                                    <h5>Ambient Player Background</h5>
                                    <p style="margin:0;">Make the mini-player glow with the colors of the current album art.</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" id="ambient-player-toggle" checked>
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </div>
                        <div class="setting-section">
                            <h5>Color Theme</h5>
                            <p>Pick a color palette for the interface.</p>
                            <div class="theme-picker-grid">
                                <div class="theme-option-card" id="theme-card-default" onclick="window.setTheme('default')">
                                    <div class="theme-card-header">
                                        <div class="theme-dot-swatch" style="background: #030303;"></div>
                                        <div class="theme-title-text">Cosmic Carbon</div>
                                    </div>
                                    <p class="theme-desc-text">Classic black and white</p>
                                </div>
                                <div class="theme-option-card" id="theme-card-stellar-light" onclick="window.setTheme('stellar-light')">
                                    <div class="theme-card-header">
                                        <div class="theme-dot-swatch" style="background: #ffffff;"></div>
                                        <div class="theme-title-text">Stellar Light</div>
                                    </div>
                                    <p class="theme-desc-text">Crisp bright visibility</p>
                                </div>
                                <div class="theme-option-card" id="theme-card-abyssal-blue" onclick="window.setTheme('abyssal-blue')">
                                    <div class="theme-card-header">
                                        <div class="theme-dot-swatch" style="background: #4cc9f0;"></div>
                                        <div class="theme-title-text">Abyssal Blue</div>
                                    </div>
                                    <p class="theme-desc-text">Deep ocean tones</p>
                                </div>
                                <div class="theme-option-card" id="theme-card-nebula-violet" onclick="window.setTheme('nebula-violet')">
                                    <div class="theme-card-header">
                                        <div class="theme-dot-swatch" style="background: #9d4edd;"></div>
                                        <div class="theme-title-text">Nebula Violet</div>
                                    </div>
                                    <p class="theme-desc-text">Neon space purples</p>
                                </div>
                                <div class="theme-option-card" id="theme-card-solar-flare" onclick="window.setTheme('solar-flare')">
                                    <div class="theme-card-header">
                                        <div class="theme-dot-swatch" style="background: #ffb703;"></div>
                                        <div class="theme-title-text">Solar Flare</div>
                                    </div>
                                    <p class="theme-desc-text">Fiery orange ambers</p>
                                </div>
                                <div class="theme-option-card" id="theme-card-glacier-drift" onclick="window.setTheme('glacier-drift')">
                                    <div class="theme-card-header">
                                        <div class="theme-dot-swatch" style="background: #88c0d0;"></div>
                                        <div class="theme-title-text">Glacier Drift</div>
                                    </div>
                                    <p class="theme-desc-text">Arctic, frosted slates</p>
                                </div>
                                <div class="theme-option-card" id="theme-card-soft-rose" onclick="window.setTheme('soft-rose')">
                                    <div class="theme-card-header">
                                        <div class="theme-dot-swatch" style="background: #ffb3c1;"></div>
                                        <div class="theme-title-text">Soft Rose</div>
                                    </div>
                                    <p class="theme-desc-text">Soft pastel pink backgrounds</p>
                                </div>
                            </div>
                        </div>
                        <div class="setting-section">
                            <h5 style="margin-bottom: 15px;">Custom Interface Colors</h5>
                            <div style="display:flex; flex-direction:column; gap: 15px; background: var(--panel-bg); padding: 20px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.15);">
                                <div style="display:flex; justify-content: space-between; align-items: center;">
                                    <span style="font-size: 13px; font-weight: 600; color: var(--text-main);">Background Color</span>
                                    <div style="width: 36px; height: 36px; border-radius: 50%; overflow: hidden; border: 2px solid rgba(255, 255, 255, 0.3); box-shadow: 0 0 10px rgba(0,0,0,0.5);">
                                        <input type="color" id="custom-bg-color" style="width: 200%; height: 200%; transform: translate(-25%, -25%); border: none; cursor: pointer;">
                                    </div>
                                </div>
                                <div style="width: 100%; height: 1px; background: rgba(255, 255, 255, 0.15);"></div>
                                <div style="display:flex; justify-content: space-between; align-items: center;">
                                    <span style="font-size: 13px; font-weight: 600; color: var(--text-main);">Accent / Text Color</span>
                                    <div style="width: 36px; height: 36px; border-radius: 50%; overflow: hidden; border: 2px solid rgba(255, 255, 255, 0.3); box-shadow: 0 0 10px rgba(0,0,0,0.5);">
                                        <input type="color" id="custom-accent-color" style="width: 200%; height: 200%; transform: translate(-25%, -25%); border: none; cursor: pointer;">
                                    </div>
                                </div>
                            </div>
                            <button class="action-btn" onclick="window.resetCustomColors()" style="margin-top: 15px; padding: 12px; font-size: 13px;">Reset to Theme Default</button>
                        </div>

                        <div class="setting-section">
                        <h5 style="margin-bottom: 15px;">Custom Background</h5>
                        <div style="display:flex; flex-direction:column; gap: 10px;">
                            <div style="display:flex; gap:10px;">
                                <button class="action-btn" onclick="document.getElementById('custom-bg-file').click()" style="flex: 1;"><i class="fa-solid fa-upload"></i> Upload Image</button>
                                <button class="action-btn" onclick="window.clearCustomBgImage()" style="flex: 1; background: rgba(232, 106, 142, 0.1); border-color: #e86a8e; color: #e86a8e;">Clear</button>
                            </div>
                            <input type="file" id="custom-bg-file" accept="image/*" style="display: none;" onchange="window.handleCustomBgUpload(event)">
                        </div>
                    </div>

                    </div>


                    <div id="tab-games" class="settings-tab">
                        <h4>Games</h4>
                        <div class="setting-section">
                            <h5>Game Provider</h5>
                            <p>Choose where to load the game library from, providers are fetched by CDN and routed (more coming soon)</p>
                            <div class="engine-picker-grid">
                                <div class="engine-card active" id="provider-card-hyperion" onclick="window.setGameProvider('hyperion')">
                                    <div class="engine-title">Main Vault</div>
                                    <div class="engine-desc">Locally hosted and reliable</div>
                                </div>
                                <!-- bye bye for now
                                <div class="engine-card" id="provider-card-truffled" onclick="window.setGameProvider('truffled')">
                                    <div class="engine-title">Truffled</div>
                                    <div class="engine-desc">Community archive</div>
                                </div>
                                -->
                                <div class="engine-card" id="provider-card-gnmath" onclick="window.setGameProvider('gnmath')">
                                    <div class="engine-title">GNmath</div>
                                    <div class="engine-desc">Probably largest collection</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="tab-privacy" class="settings-tab">
                        <h4>Privacy and Security</h4>
                        <div class="setting-section">
                            <h5>Panic Button</h5>
                            <p>Quickly redirect to another site by pressing a key globally.</p>
                            <div class="setting-row">
                                <span class="setting-label">Panic Key</span>
                                <input type="text" id="panic-key-input" class="setting-input" style="width:120px; text-align:center;" readonly>
                            </div>
                            <div style="margin-top: 10px;">
                                <span class="setting-label">Redirect URL</span>
                                <input type="text" id="panic-url-input" class="setting-input" placeholder="https://classroom.google.com">
                            </div>
                        </div>

                        <div class="setting-section">
                            <div class="setting-row">
                                <div>
                                    <h5>Auto Cloak</h5>
                                    <p style="margin:0;">Disguise the tab icon and title when you switch away.</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" id="auto-cloak-toggle">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </div>

                        <div class="setting-section">
                            <div class="setting-row">
                                <div>
                                    <h5>Anti-Close Protection</h5>
                                    <p style="margin:0;">Show a confirmation warning if you try to close the tab.</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" id="anti-close-toggle">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </div>

                        <div class="setting-section">
                            <div class="setting-row">
                                <div>
                                    <h5>Chat Profanity Filter</h5>
                                    <p style="margin:0;">Visually censor strong profanity and slurs in chat rooms.</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" id="profanity-toggle">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </div>

                        <div class="setting-section">
                            <h5>URL Cloaking</h5>
                            <p>Cloak the site to hide the actual address. Blob cloaking prevents automated 10-second tabs close patches.</p>
                            <button class="action-btn" onclick="window.applyBlobCloak()" style="margin-bottom: 12px;">Apply Blob Cloak</button>
                            <button class="action-btn" onclick="window.applyAboutBlank()">Apply About:Blank Cloak</button>
                        </div>
                    </div>
                    <div id="tab-sitedata" class="settings-tab">
                        <h4>Site Data</h4>
                        
                        <div class="setting-section" style="border: 1px solid rgba(232, 106, 142, 0.4); background: rgba(232, 106, 142, 0.05); margin-bottom: 20px;">
                            <h5 style="color: #e86a8e; display: flex; align-items: center; gap: 8px;">
                                <i class="fa-solid fa-triangle-exclamation"></i> Force App Update & Reset
                            </h5>
                            <p style="margin-bottom: 12px; font-size: 12px; line-height: 1.5;">
                                <strong>Warning</strong> Deletes all cache and offline storage
                                <strong>This will likely reset local settings, theme customizations, and chat usernames.</strong> It is recommended to export your game saves before continuing
                            </p>
                            <button class="action-btn" onclick="window.forceAppUpdate()" style="background: rgba(232, 106, 142, 0.2); border: 1px solid #e86a8e; color: #fff; padding: 12px; font-weight: 700;">
                                Force update/Delete local data
                            </button>
                        </div>

                        <iframe id="save-manager-iframe" style="width: 100%; height: 460px; border: none; overflow: hidden; background: transparent;"></iframe>
                    </div>
                   <div id="tab-network" class="settings-tab">
                        <h4>Proxy</h4>
                        <div class="setting-section">
                            <h5>Proxy Engine</h5>
                            <p>Choose which proxy engine to use (I recommend switching between the two to see which suits you best for the site you're using)</p>
                            
                            <div class="engine-picker-grid">
                                <div class="engine-card" id="engine-card-uv" onclick="window.setProxyEngine('uv')">
                                    <div class="engine-title">Ultraviolet</div>
                                    <div class="engine-desc">Recommended for stability and heavy sites</div>
                                </div>
                                <div class="engine-card active" id="engine-card-scramjet" onclick="window.setProxyEngine('scramjet')">
                                    <div class="engine-title">Scramjet</div>
                                    <div class="engine-desc">Experimental but good for basic browsing</div>
                                </div>
                            </div>
                        </div>

                        <div class="setting-section">
                            <h5>Transporter</h5>
                            <p>Choose the transport engine (each excels in its own category)</p>
                            
                            <div class="engine-picker-grid">
                                <div class="engine-card transport-card active" id="transport-card-libcurl" onclick="window.setTransportEngine('libcurl')">
                                    <div class="engine-title">Libcurl</div>
                                    <div class="engine-desc">stable media streaming (Default)</div>
                                </div>
                                <div class="engine-card transport-card" id="transport-card-epoxy" onclick="window.setTransportEngine('epoxy')">
                                    <div class="engine-title">Epoxy</div>
                                    <div class="engine-desc">Lightweight engine for standard web pages</div>
                                </div>
                            </div>
                        </div>

                        <div class="setting-section">
                            <h5>Clear Proxy</h5>
                            <p>Flushes service workers and resets cache</p>
                            <button class="action-btn" onclick="window.fixProxyCache()" style="padding: 12px; font-size: 13px;">Reset Proxy Cache and Reload</button>
                        </div>
                    </div>
                </div> 
            </div> 
        </div> 

    </div> 

    <div id="chat-profile-settings" style="display:none; position:fixed; top:200px; left:200px; width:300px; background:var(--panel-bg); border:1px solid rgba(255, 255, 255, 0.3); border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.5); z-index:2147483647 !important; flex-direction:column; overflow:hidden;">
        <div id="chat-profile-header" style="background:var(--card-bg); padding:10px 15px; border-bottom:none; cursor:grab; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:bold; font-size:14px; color:var(--text-main); font-family:'Poppins', sans-serif;">Chat Profile</span>
            <button onclick="window.closeChatProfile()" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:18px; line-height:1;">&times;</button>
        </div>
        <div style="padding:20px; display:flex; flex-direction:column; gap:15px; font-family:'Poppins', sans-serif;">
            <div>
                <label style="font-size:12px; color:var(--text-muted); font-weight:bold;">USERNAME</label>
                <input type="text" id="prof-username" style="width:100%; box-sizing:border-box; background:var(--search-bg); color:var(--text-main); border:1px solid rgba(255, 255, 255, 0.25); padding:8px 12px; border-radius:6px; margin-top:5px; outline:none; font-family:'Poppins', sans-serif;">
            </div>
            <div>
                <label style="font-size:12px; color:var(--text-muted); font-weight:bold;">PROFILE PICTURE</label>
                <div id="pfp-dropzone" style="width:100%; height: 75px; border: 2px dashed var(--border-primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 5px; cursor: pointer; transition: all 0.2s; background: var(--search-bg); overflow: hidden; position: relative;" onclick="document.getElementById('pfp-file-input').click()">
                    <img id="pfp-preview" src="" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; display: none; border: 1px solid var(--border-primary);">
                    <span id="pfp-dropzone-text" style="font-size: 13px; color: var(--text-muted); font-weight: 600;"><i class="fa-solid fa-cloud-arrow-up"></i> Upload Image</span>
                </div>
                <input type="file" id="pfp-file-input" accept="image/png, image/jpeg, image/gif, image/webp" style="display: none;" onchange="window.handlePfpUpload(event)">
                <button onclick="window.removePfp()" style="margin-top: 8px; background: transparent; border: 1px solid #e86a8e; color: #e86a8e; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer; width: 100%; transition: all 0.2s;">Remove Profile Picture</button>
            </div>
            <div>
                <label style="font-size:12px; color:var(--text-muted); font-weight:bold;">NAME COLOR</label>
                <div style="display:flex; align-items:center; gap:10px; margin-top:5px;">
                    <input type="color" id="prof-color" style="background:none; border:none; width:40px; height:30px; cursor:pointer;">
                    <span id="prof-color-hex" style="font-size:12px; color:var(--text-main); font-family:monospace;">#4cc9f0</span>
                </div>
            </div>
            <div>
                <label style="font-size:12px; color:var(--text-muted); font-weight:bold;">LOCAL CHAT FONT</label>
                <select id="prof-font" style="width:100%; box-sizing:border-box; background:var(--search-bg); color:var(--text-main); border:1px solid rgba(255, 255, 255, 0.25); padding:8px 12px; border-radius:6px; margin-top:5px; outline:none; font-family:'Poppins', sans-serif;">
                    <option value="'Poppins', sans-serif">Poppins (Default)</option>
                    <option value="monospace">Monospace</option>
                    <option value="'Caveat', cursive">Caveat (Cursive)</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="'Courier New', Courier, monospace">Courier New</option>
                    <option value="'Times New Roman', Times, serif">Times New Roman</option>
                </select>
            </div>
            <div>
                <label style="font-size:12px; color:var(--text-muted); font-weight:bold;">NAME EFFECT</label>
                <select id="prof-effect" style="width:100%; box-sizing:border-box; background:var(--search-bg); color:var(--text-main); border:1px solid rgba(255, 255, 255, 0.25); padding:8px 12px; border-radius:6px; margin-top:5px; outline:none; font-family:'Poppins', sans-serif;">
                    <option value="none">None</option>
                    <option value="shine">Shine</option>
                    <option value="neon">Neon</option>
                    <option value="fade">Fade In/Out</option>
                    <option value="glitch">Glitch</option>
                    <option value="chrome">Chrome</option>
                    <option value="liquid">Liquid</option>
                    <option value="glass">Glass</option>
                    <option value="grainy">Grainy</option>
                </select>
                <div style="margin-top: 15px; text-align: center; padding: 12px; background: var(--card-bg); border-radius: 8px; border: 1px solid var(--border-primary); overflow:hidden; white-space:nowrap;">
                    <span id="effect-preview-text" style="font-size: 16px; font-weight: bold;">Preview Name</span>
                </div>
            </div>
            <button onclick="window.saveChatProfile()" style="background:var(--text-main); color:var(--bg-main); border:none; padding:10px; border-radius:8px; cursor:pointer; font-weight:bold; font-family:'Poppins', sans-serif;">Save Changes</button>
        </div>
    </div>

    <div id="experience-overlay" style="display: none; position: fixed; inset: 0; background: var(--bg-main); z-index: 2147483647; align-items: center; justify-content: center; padding: 40px; box-sizing: border-box; transition: opacity 0.4s ease;">
        
        <div style="display: flex; align-items: center; gap: 80px; max-width: 900px; width: 100%; flex-wrap: wrap; justify-content: center; animation: overlaySlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;">
            
            <div style="display: flex; flex-direction: column; align-items: center; border-right: 2px solid var(--border-primary); padding-right: 40px;">
                <h1 style="font-family: 'Space Grotesk', sans-serif; font-size: 5.5rem; line-height: 1; margin: 0; color: var(--text-main); font-weight: 700;">Hyperion</h1>
                <h1 style="font-family: 'Space Grotesk', sans-serif; font-size: 5.5rem; line-height: 1; margin: 0; color: var(--text-muted); font-weight: 700;">Hub</h1>
            </div>

            <div style="display: flex; flex-direction: column; gap: 20px; flex: 1; min-width: 320px;">
                
                <div style="display: flex; align-items: center; gap: 20px; cursor: pointer; padding: 15px 20px; border-radius: 12px; background: var(--search-bg); border: none; transition: all 0.2s;" onmouseover="this.style.background='var(--card-bg)'; this.style.transform='translateX(5px)';" onmouseout="this.style.background='var(--search-bg)'; this.style.transform='translateX(0)';" onclick="window.selectExperience('games')">
                    <button class="top-widget" style="position: static; margin: 0; pointer-events: none; flex-shrink: 0; box-shadow: none;"><i class="fa-solid fa-gamepad"></i> GAMES</button>
                    <div style="color: var(--text-muted); font-size: 13px; line-height: 1.4; text-align: left;">Jump straight into the game library. No distractions, just play.</div>
                </div>

                <div style="font-size: 11.5px; color: var(--text-main); opacity: 0.85; text-align: center; margin: 5px 0; letter-spacing: 0.5px; font-weight: 500;">
                    *changeable at any time in settings
                </div>

                <div style="display: flex; align-items: center; gap: 20px; cursor: pointer; padding: 15px 20px; border-radius: 12px; background: var(--search-bg); border: none; transition: all 0.2s;" onmouseover="this.style.background='var(--card-bg)'; this.style.transform='translateX(5px)';" onmouseout="this.style.background='var(--search-bg)'; this.style.transform='translateX(0)';" onclick="window.selectExperience('web')">
                    <button class="top-widget" style="position: static; margin: 0; pointer-events: none; flex-shrink: 0; box-shadow: none;"><i class="fa-solid fa-globe"></i> WEB</button>
                    <div style="color: var(--text-muted); font-size: 13px; line-height: 1.4; text-align: left;">Browse the web freely and access the proxy tools.</div>
                </div>

            </div>

            </div>
        </div>
    </div>
`;