// ==UserScript==
// @name         Hattrick transfer countdown
// @version      2024-01-09
// @description  Show the time left until the auction deadline
// @author       shotgunshine
// @license      MIT
// @match        https://*.hattrick.org/Club/Transfers/*
// @grant        none
// ==/UserScript==

function formatTime(n) { return n.toString().padStart(2, '0'); }

function showDeadlines() {
    let auctions = document.querySelectorAll('[data-isodate]');
    let now = new Date();
    for (let a of auctions) {
        let d = a.getAttribute('data-isodate').split(/-| |:/);
        let end = new Date(d[2], d[1] - 1, d[0], d[3], d[4]);
        let delta = end - now;
        if (delta > 0) {
            let hrs = Math.floor(delta/1000/60/60);
            let min = Math.floor(delta/1000/60 - 60*hrs);
            let sec = Math.floor(delta/1000 - 60*min - 60*60*hrs);
            a.innerHTML = a.getAttribute('data-isodate');
            a.innerHTML += ` (${formatTime(hrs)}:${formatTime(min)}:${formatTime(sec)})`;
        } else {
            a.innerHTML = a.getAttribute('data-isodate');
            a.innerHTML += ' 🏁';
        }
    }
}

(function() {
    'use strict';

    showDeadlines();
    setInterval(showDeadlines, 1000);

    let chk = document.createElement('input');
    chk.setAttribute('type', 'checkbox');
    document.querySelector('h1 > span.float_right').textContent = 'Auto-refresh (10s): ';
    document.querySelector('h1 > span.float_right').appendChild(chk);
    chk.checked = JSON.parse(localStorage.getItem('auto')) ?? false;
    chk.addEventListener('click', () => { localStorage.setItem('auto', chk.checked); });
    setInterval(
        () => { if (chk.checked) window.location.reload(); },
        1000 * 10
    );

})();
