// ==UserScript==
// @name         Hattrick skim series feed
// @version      2024-03-19
// @description  Filter some sentences from the series feed
// @author       shotgunshine
// @license      MIT
// @match        https://*.hattrick.org/World/Series/*
// @match        https://*.hattrick.org/*/World/Series/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let filter = new RegExp([
        // italiano
        ' ha scritto un messaggio sui social dove rende noto ai suoi fan di essere',
        ' Pochi minuti dopo, l\'ufficio stampa della squadra ha confermato la notizia pubblicando un comunicato ufficiale.',
        'La notizia era nell\'aria già da diversi giorni, tuttavia ora è stata battuta in via ufficiale da diverse agenzie stampa: ',
        ' considerato',
        ' da diversi addetti ai lavori',
        ' indetto una conferenza stampa per presentare ai propri tifosi',
        'Brutte notizie dall\'infermeria di ',
        'Brutta tegola per l\'allenatore di ',
        '. Questo giocatore è',
        // english
        ' has announced to social media networks that he',
        ' Moments later, the move was confirmed by the club.',
        ', a big name on the squad. It will be interesting to see what other changes this may lead to',
        'often described as ',
        ' that is presumed to become a key player for the team',
        ' an essential player',
        '. The player is',
    ].join('|'), 'gi');

    for (let td of document.querySelectorAll('#ctl00_ctl00_CPContent_CPMain_repLLUEvents td')) {
        td.innerHTML = td.innerHTML.replaceAll(filter, '');
    }
})();
