// ==UserScript==
// @name         Hattrick transfer hotlist
// @version      2024-10-15
// @description  Follow players on sale
// @author       shotgunshine
// @license      MIT
// @match        https://*.hattrick.org/Club/Transfers/*
// @match        https://*.hattrick.org/Club/Players/Player*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// ==/UserScript==

function savePlayer(id, name, deadline) {
    GM_setValue(id, {name: name, deadline: deadline});
}

function deletePlayer(id) {
    GM_deleteValue(id);
    printPlayers();
}

function getTime(isodate) {
    let d = isodate.split(/-| |:/);
    return new Date(d[2], d[1] - 1, d[0], d[3], d[4]);
}

function printPlayers() {
    let hotlist = GM_listValues();
    let sorted = hotlist.sort((a,b) => { return getTime(GM_getValue(a).deadline) - getTime(GM_getValue(b).deadline); });
    let list = '';
    let even = false;
    for (let id of sorted) {
        list += `<li player-id="${id}" style="padding: 5px 10px;"${even ? ' class="even"' : ''}>`;
        list += `<input type="image" src="../../Img/Icons/cross_small.png" class="float_right" /> `;
        list += `<a href="/Club/Players/Player.aspx?playerId=${id}">`;
        list += GM_getValue(id).name;
        list += ` (${id})`;
        list += '</a><br>';
        list += `<span class="shy" data-isodate="${GM_getValue(id).deadline}">${GM_getValue(id).deadline}</span>`;
        list += '</li>';
        even = !even;
    }
    document.getElementById('hotlisted-players').innerHTML = list;
    for (let li of document.getElementById('hotlisted-players').children) {
        li.children[0].addEventListener('click', event => {
            deletePlayer(event.target.parentNode.getAttribute('player-id'));
        });
    }
}

function hotlistButton(playerId, playerName, deadline) {
    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.textContent = 'Hotlist';
    button.style = 'margin-right: 5px;';
    button.addEventListener('click', () => {
        savePlayer(playerId, playerName, deadline);
        window.location = '/Club/Transfers/';
    });
    return button;
}

(function() {
    'use strict';

    if (window.location.pathname.includes('Player.aspx')) {
        let a = document.querySelector('.alert [src="/Img/icons/arrow_refresh.png"]');
        if (a) {
            let playerName = document.title.split(' » ')[0];
            let playerId = window.location.search.match(/playerId=[0-9]+/)[0].split('=')[1];
            let deadline = a.parentNode.parentNode.innerHTML.match(/[0-9]+-[0-9]+-[0-9]+ [0-9]+:[0-9]+/)[0];
            a.parentNode.insertBefore(hotlistButton(playerId, playerName, deadline), a);
        }
    }
    if (window.location.pathname.includes('Club/Transfers')) {
        let a = document.querySelector('.club-transfer-table');
        if (a) {
            let box = '<div style="margin-right: 9px;"><div class="box mainBox"><h2>Hotlisted players</h2><ul id="hotlisted-players"></ul></div></div>';
            a.innerHTML += box;
            printPlayers();
        }
    }
})();
