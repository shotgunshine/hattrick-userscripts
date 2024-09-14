// ==UserScript==
// @name         Hattrick agreeability chance
// @version      2024-09-14
// @description  Display the chance of team spirit drop by player agreeability
// @author       shotgunshine
// @license      MIT
// @match        https://*.hattrick.org/Club/Players/Player.aspx*
// @grant        none
// ==/UserScript==

const dropBuy = ['69%', '47%', '30%', '0%', '0%'];
const dropSell = ['0%', '0%', '12%', '22%', '27%'];

(function() {
    'use strict';

    let agreeability = document.querySelector('[href^="/Help/Rules/AppDenominations.aspx?lt=gentleness"]');
    let level = Number(agreeability.href.split('?')[1].match(/[0-9]/)[0]);
    agreeability.innerHTML += ` (<img src="/Img/Matches/transfer_in_new.png"> ${dropBuy[level]}, <img src="/Img/Matches/transfer_out_new.png"> ${dropSell[level]})`;
})();
