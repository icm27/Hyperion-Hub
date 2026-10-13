import os
import subprocess
from pathlib import Path

downloads_dir = Path.home() / "web-port-main"

if not downloads_dir.exists():
    print(f"[!] Could not find {downloads_dir}.")
    print("Please make sure you right-clicked 'Downloads' in the Files app and selected 'Share with Linux'.")
    exit(1)

# Target game directories
games_to_upload = ["hotline-miami", "sonic.exe", "repo"]
# Find buckshot roulette folder (matching partial name)
for folder in downloads_dir.iterdir():
    if folder.is_dir() and "buckshot" in folder.name.lower():
        games_to_upload.append(folder.name)

wrapper_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Playing Game</title>
    <style>
        body, html { margin: 0; padding: 0; width: 100vw; height: 100vh; overflow: hidden; background: #000; }
        iframe { width: 100%; height: 100%; border: none; display: block; }
    </style>
</head>
<body>
    <iframe id="gameFrame" src="game.html" allowfullscreen></iframe>
    <script nonce="MjQ2OTk4ODc5OSwyMjg2NzkyOTQ=">
        function triggerFullscreen() {
            const target = document.getElementById('gameFrame');
            if (target.requestFullscreen) target.requestFullscreen();
            else if (target.webkitRequestFullscreen) target.webkitRequestFullscreen();
            else if (target.mozRequestFullScreen) target.mozRequestFullScreen();
            else if (target.msRequestFullscreen) target.msRequestFullscreen();
        }
    </script>
</body>
</html>"""

for game_name in games_to_upload:
    game_path = downloads_dir / game_name
    if not game_path.exists():
        print(f"[!] Skipping {game_name}: Folder not found.")
        continue

    print(f"\n==========================================")
    print(f"📦 Prepping and Uploading: {game_name}")
    print(f"==========================================")

    orig_index = game_path / "index.html"
    orig_game = game_path / "game.html"

    # If game.html doesn't exist, rename index.html -> game.html and create wrapper
    if not orig_game.exists() and orig_index.exists():
        print(f"  -> Renaming index.html to game.html")
        orig_index.rename(orig_game)
        with open(orig_index, "w") as f:
            f.write(wrapper_html)
        print(f"  -> Created fullscreen wrapper index.html")

    # Upload all files recursively
    for root, _, files in os.walk(game_path):
        for file in files:
            local_file = Path(root) / file
            rel_path = local_file.relative_to(game_path)
            r2_key = f"{game_name}/{rel_path.as_posix()}"

            print(f"  🚀 Uploading: {r2_key} ...")
            cmd = ["npx", "wrangler", "r2", "object", "put", f"arcade-games/{r2_key}", f"--file={local_file}"]
            res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
            if res.returncode != 0:
                print(f"  [X] Failed uploading {r2_key}: {res.stderr.decode()}")

print("\n🎉 All games uploaded to Cloudflare R2 successfully!")
