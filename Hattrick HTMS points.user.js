// ==UserScript==
// @name         Hattrick HTMS points
// @version      2025-04-28
// @description  Show HTMS points in the player profile
// @author       shotgunshine
// @license      MIT
// @match        https://*.hattrick.org/*/Player.aspx*
// @grant        none
// ==/UserScript==

function getSkills() {
    let skills = document.querySelectorAll('.denominationNumber');

    return {
        keeper: Number(skills[5].textContent),
        defending: Number(skills[6].textContent),
        playmaking: Number(skills[7].textContent),
        winger: Number(skills[8].textContent),
        passing: Number(skills[9].textContent),
        scoring: Number(skills[10].textContent),
        setPieces: Number(skills[11].textContent)
    };
}

function getAge() {
    return Number(document.querySelector('.byline').textContent.match(/[0-9]+/g)[0]);
}

function getDays() {
    return Number(document.querySelector('.byline').textContent.match(/[0-9]+/g)[1]);
}

function getPoints(skills) {
    const coefficients = {
        keeper: [0, 2, 12, 23, 39, 56, 76, 99, 123, 150, 183, 222, 268, 321, 380, 446, 519, 600, 691, 797, 924, 1074, 1278, 1278],
        defending: [0, 4, 18, 39, 65, 98, 134, 175, 221, 271, 330, 401, 484, 580, 689, 809, 942, 1092, 1268, 1487, 1791, 1791, 1791, 1791],
        playmaking: [0, 4, 17, 34, 57, 84, 114, 150, 190, 231, 281, 341, 412, 493, 584, 685, 798, 924, 1070, 1247, 1480, 1791, 1791, 1791],
        winger: [0, 2, 12, 25, 41, 60, 81, 105, 132, 161, 195, 238, 287, 344, 407, 478, 555, 642, 741, 855, 995, 1172, 1360, 1360],
        passing: [0, 3, 14, 31, 51, 75, 104, 137, 173, 213, 259, 315, 381, 457, 540, 634, 738, 854, 988, 1148, 1355, 1355, 1355, 1355],
        scoring: [0, 4, 17, 36, 59, 88, 119, 156, 197, 240, 291, 354, 427, 511, 607, 713, 830, 961, 1114, 1300, 1547, 1547, 1547, 1547],
        setPieces: [0, 1, 2, 5, 9, 15, 21, 28, 37, 46, 56, 68, 81, 95, 112, 131, 153, 179, 210, 246, 287, 334, 388, 450]
    };

    let points = 0;
    for (let s in skills) points += coefficients[s][skills[s]];

    return points;
}

function getPotential(age, days) {
    const coefficients = {
        17: 160,
        18: 159,
        19: 157,
        20: 155,
        21: 153,
        22: 150,
        23: 148,
        24: 145,
        25: 142,
        26: 139,
        27: 136
    };

    let potential = 0;
    for (let c in coefficients) if (c > age) potential += coefficients[c];
    if (age < 28) potential += Math.round(coefficients[age] / 112 * (112 - days));

    return potential;
}

(function() {
    'use strict';

    if (document.querySelector('.transferPlayerSkills')) {
        document.querySelector('.transferPlayerInformation > table').innerHTML += `<tr><td class="right">HTMS</td><td>${getPoints(getSkills())} / ${getPoints(getSkills()) + getPotential(getAge(), getDays())}</td></tr>`;
    }
})();
