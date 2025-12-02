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

function savePlayer(id, name, deadline, starting) {
    GM_setValue(id, {name: name, deadline: deadline, starting: starting});
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
    let browse = '&BrowseIds=' + sorted.join(',');
    for (let id of sorted) {
        list += `<li player-id="${id}" style="padding: 5px 10px;"${even ? ' class="even"' : ''}>`;
        list += `<input type="image" src="../../Img/Icons/cross.png" class="float_right" style="margin: 16px 0 0 8px;" /> `;
        list += `<textarea class="float_right" rows="2" cols="35">${GM_getValue(id).notes ?? ''}</textarea> `;
        list += `<a href="/Club/Players/Player.aspx?playerId=${id}${browse}">${GM_getValue(id).name} (${id})</a>`;
        list += '<br>';
        list += `<span class="shy" data-isodate="${GM_getValue(id).deadline}">${GM_getValue(id).deadline}</span>`;
        list += '<br>';
        list += `<span class="shy">${GM_getValue(id).starting}</span>`;
        list += '</li>';
        even = !even;
    }
    document.getElementById('hotlisted-players').innerHTML = list;
    for (let li of document.getElementById('hotlisted-players').children) {
        let id = li.getAttribute('player-id');
        li.querySelector('input').addEventListener('click', event => {
            deletePlayer(id);
        });
        li.querySelector('textarea').addEventListener('change', event => {
            GM_setValue(id, {
                name: GM_getValue(id).name,
                deadline: GM_getValue(id).deadline,
                starting: GM_getValue(id).starting,
                notes: event.target.value
            });
        });
    }
}

function hotlistButton(playerId, playerName, deadline, starting) {
    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.textContent = 'Hotlist';
    button.style = 'margin-right: 5px;';
    button.addEventListener('click', () => {
        savePlayer(playerId, playerName, deadline, starting);
        window.location = '/Club/Transfers/';
    });
    return button;
}

function removeButton(playerId) {
    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.textContent = 'De-hotlist';
    button.style = 'margin-right: 5px; color: red;';
    button.addEventListener('click', () => {
        GM_deleteValue(playerId);
        window.location = '/Club/Transfers/';
    });
    return button;
}

function exportButton() {
    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('class', 'float_right');
    button.textContent = 'CSV';
    button.addEventListener('click', () => {
        let a = document.createElement('a');
        a.href = 'data:text/csv;charset=utf-8,';
        a.href += 'Deadline,Player,Link,Comment%0A';
        let hotlist = GM_listValues();
        let sorted = hotlist.sort((a,b) => { return getTime(GM_getValue(a).deadline) - getTime(GM_getValue(b).deadline); });
        for (let id of sorted) {
            a.href += encodeURIComponent(GM_getValue(id).deadline);
            a.href += ',';
            a.href += encodeURIComponent(GM_getValue(id).name);
            a.href += ',';
            a.href += encodeURIComponent('https://www.hattrick.org/en-us/Club/Players/Player.aspx?playerId=' + id);
            a.href += ',';
            a.href += encodeURIComponent(GM_getValue(id).notes);
            a.href += '%0A';
        }
        a.download = 'hotlist.csv';
        document.body.appendChild(a).click();
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
            // TODO: currency agnostic regex
            let starting = a.parentNode.parentNode.innerHTML.match(/([0-9]+&nbsp;)+€/)[0];
            if (GM_getValue(playerId, null) === null) {
                a.parentNode.insertBefore(hotlistButton(playerId, playerName, deadline, starting), a);
            } else {
                a.parentNode.insertBefore(removeButton(playerId), a);
            }
        }
    }
    if (window.location.pathname.includes('Club/Transfers')) {
        let a = document.querySelector('.club-transfer-table');
        if (a) {
            let box = '<div style="margin-right: 9px;"><div class="box mainBox"><h2 id="hotlist-heading">Hotlisted players</h2><ul id="hotlisted-players"></ul></div></div>';
            a.innerHTML += box;
            printPlayers();
            document.getElementById('hotlist-heading').appendChild(exportButton());
        }
    }
})();
