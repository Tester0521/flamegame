---
title: FlameGame | by @qitteenn
basename: game
url: /game
layout: main.vto
---
<style>
    body, html {
        background-color: black;

        margin: 0;
        padding: 0;

        overflow: hidden;

        width: 100%;
        height: 100%;
        user-select: none; /* Запретить выделение для всего контента */
        -webkit-touch-callout: none; /* Отключить вызов контекстного меню для iOS */
        -webkit-user-select: none; /* Отключить выделение для iOS */
        -moz-user-select: none; /* Отключить выделение для Firefox */
        -ms-user-select: none; /* Отключить выделение для IE/Edge */
    }

    body {
        background-image: url('img/locations/space.jpg');
        background-size: cover;
        background-repeat: no-repeat;
    }
</style>
<canvas class="canvas" id="canvas"></canvas>
<div class="pauseBtn"><span>🔥</span></div>
<div class="shiftBtn"><span>Shift</span></div>
<div id="joystickContainer"></div>
<script type="module" src="/game.js" charset="utf-8"></script>