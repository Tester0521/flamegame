---
title: Home
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
        function changeTheme() {
            theme = theme === "dark" ? "light" : "dark";
            localStorage.setItem("theme", theme);
            document.documentElement.dataset.theme = theme;
        }
    </script> 
    <button class="button header-theme" onclick="changeTheme()">
        <span class="icon">◐</span>
    </button>
    <img class="header-avatar" src="/avatar.jpg" alt="Avatar" transform-images="webp avif 200@2">
    <h1 class="header-title">Lume game</h1>
    <p>Let's gooooooo!.</p>
</header>
<a href="/game" class="button" style="--bg-color:#fff; --text-color:black">
    Play!
</a>
