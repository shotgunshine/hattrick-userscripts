// ==UserScript==
// @name         Hattrick custom shortcuts
// @version      2024-02-09
// @description  Add customizable shortcuts in the page header
// @author       shotgunshine
// @license      MIT
// @match        https://*.hattrick.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let links = [
        {url: '/Club/Transfers/', icon: 'scBids', alt: 'Aste in corso'},
        {url: '/Club/Matches/MatchOrder/Matchorder.aspx?MatchID=0&SourceSystem=Hattrick&teamId=0', icon: 'scMatches2', alt: 'Simulatore di formazione'},
        {url: '/Club/TacticsRoom/', icon: 'scAnalyzer', alt: 'Ufficio del tattico'},
        {url: 'https://shotgunshine.github.io/imp/', icon: 'f_match', alt: 'IMP: Match Predictor'},
    ];

    let s = document.querySelector('.scContainerNoSupporter');

    for (let l of links) {
        s.innerHTML += `<a href="${l.url}"><img src="/Img/Icons/transparent.gif" class="${l.icon}" title="${l.alt}"></a> `;
    }
})();
