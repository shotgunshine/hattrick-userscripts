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
        {url: '/Club/TacticsRoom/?teamId=', icon: 'scAnalyzer', alt: 'Ufficio del tattico'},
        {url: 'https://shotgunshine.github.io/imp/', icon: 'scMatches', alt: 'IMP: Match Predictor'},
        {url: 'https://nickarana.pythonanywhere.com/', icon: 'scDigit1', alt: 'Nickarana\'s Match Simulator'},
        {url: 'https://hattrickportal.pro/Utils/PlayerTraining.aspx', icon: 'scTraining', alt: 'HT Portal » Training calculator'},
        {url: 'https://www.hattrick-youthclub.org/site/trainingsspeedcalculator', icon: 'scDigit2', alt: 'HT Youthclub - Training-speed calculator'}
    ];

    let s = document.querySelector('.scContainerNoSupporter');

    for (let l of links) {
        s.innerHTML += `<a href="${l.url}"><img src="/Img/Icons/transparent.gif" class="${l.icon}" title="${l.alt}"></a> `;
    }
})();
