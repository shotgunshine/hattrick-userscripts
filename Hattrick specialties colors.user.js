// ==UserScript==
// @name         Hattrick specialties colors
// @version      2024-03-21
// @description  Highlight speciality icons with different colors
// @author       shotgunshine
// @license      MIT
// @match        https://*.hattrick.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let css = `
        [class^="icon-speciality-"] {filter: drop-shadow(1px 1px 0 black) !important;}
        .icon-speciality-0 {color: gray !important;}
        .icon-speciality-1 {color: plum !important;}
        .icon-speciality-2 {color: aqua !important;}
        .icon-speciality-3 {color: gold !important;}
        .icon-speciality-4 {color: lime !important;}
        .icon-speciality-5 {color: tomato !important;}
        .icon-speciality-6 {color: pink !important;}
        .icon-speciality-8 {color: peru !important;}
        .icon-transferlisted {
            filter: drop-shadow(0 0 2px green);
            color: green;
            font-weight: bold;
        }
    `;

    let style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
})();
