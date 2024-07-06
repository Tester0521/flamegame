---
title: Home | Welcome!
basename: /
url: /
layout: main.vto
---
<header class="header">
    <script>
        let theme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
        document.documentElement.dataset.theme = theme;
        (window.matchMedia('(orientation: portrait)').matches) ? alert('🔥🔥🔥 Поверните устройство 🔥🔥🔥') : 0;
        const changeTheme = () => {
            theme = theme === "dark" ? "light" : "dark";
            localStorage.setItem("theme", theme);
            document.documentElement.dataset.theme = theme;
        }
    </script> 
    <button class="button header-theme" onclick="changeTheme()">
        <span class="icon">◐</span>
    </button>
    <img class="header-avatar" src="/avatar.jpg" alt="Avatar" transform-images="webp avif 200@2">
    <h1 class="header-title">🔥 Flame game 🔥</h1>
    <p>Let's gooooooo!.</p>
</header>
<a href="/game" class="button playButton" style="--bg.sprite-color:#fff; --text-color:black">
    Play!
</a>
<footer>
<p><a href="https://t.me/qitteenn">Дима</a> видит, а остальные -- нет.</p>
</footer>
