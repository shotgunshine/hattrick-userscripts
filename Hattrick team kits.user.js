// ==UserScript==
// @name         Hattrick team kits
// @version      2024-10-09
// @description  Show match kits on club page and players page
// @author       shotgunshine
// @license      MIT
// @match        https://*.hattrick.org/Club/?*
// @match        https://*.hattrick.org/Club/Players/?*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

function saveMatchKit() {
    let matchKitId = document.getElementById('match-kit-id').value;
    GM_setValue('matchKitId', matchKitId);
    let teamId = window.location.search.match(/TeamID=[0-9]+/)[0].split('=')[1];
    GM_setValue('teamId', teamId);
    window.location.reload();
}

(function() {
    'use strict';

    let matchKitId = GM_getValue('matchKitId') ?? 4;
    let basePath = `https://res.hattrick.org/kits/${Math.ceil(matchKitId/100000)}/${Math.ceil(matchKitId/10000)}/${Math.ceil(matchKitId/1000)}/${matchKitId}`;

    if (document.querySelector('[src="../Img/Illustrations/dimmed_fake_matchkit_preview.png"]')) {
        document.querySelector('.footer.suphl').outerHTML = '<div><input type="text" placeholder="MatchKitId" size="8" id="match-kit-id" /> <button type="button" id="match-kit-save">Save</button></div>';
        document.getElementById('match-kit-save').addEventListener('click', saveMatchKit);
        document.getElementById('match-kit-save').addEventListener('keyup', event => {
            if (event.key == 'Enter') saveMatchKit();
        });
        let dimmedFake = document.querySelector('[src="../Img/Illustrations/dimmed_fake_matchkit_preview.png"]');
        if (dimmedFake) dimmedFake.setAttribute('src', `${basePath}/matchKitLarge.png`);
    }

    if (window.location.toString().match('/Club/Players/[?]TeamID=' + GM_getValue('teamId'))) {
        for (let n = 1; n <= 12; n++) {
            for (let body of document.querySelectorAll(`[src^="/Img/Avatar/bodies/bd${n}_s1.png"]`)) {
                body.setAttribute('src', `${basePath}/body${n}.png`);
            }
        }
    }
})();
