// ==UserScript==
// @name         Hattrick detailed match attendance
// @version      2024-02-25
// @description  Show the income and capacity of each stadium sector
// @author       shotgunshine
// @license      MIT
// @match        https://*.hattrick.org/Club/Matches/Match.aspx*
// @grant        none
// ==/UserScript==

function detailedAttendance(seats, sold, price) {
    return `<td class="right">${Math.floor(sold/seats*100)}%</td><td class="right">€ ${(sold*price).toLocaleString()}</td>`;
}

(function() {
    'use strict';

    let match = window.HT.ngMatch.data;
    if (match.isFinished && !match.isWalkover && match.sourceSystem == 'Hattrick') {
        let interval = setInterval(() => {
            let rows = document.querySelectorAll('.box.matchinfo .htbox-table tr');
            if (rows.length > 0) {
                clearInterval(interval);

                rows[0].innerHTML += detailedAttendance(match.seatsStanding, match.soldSeatsStanding, 7);
                rows[1].innerHTML += detailedAttendance(match.seatsPlain, match.soldSeatsPlain, 10);
                rows[2].innerHTML += detailedAttendance(match.seatsPlus, match.soldSeatsPlus, 19);
                rows[3].innerHTML += detailedAttendance(match.seatsBoxed, match.soldSeatsBoxed, 35);
                rows[4].firstChild.nextSibling.setAttribute('colspan', 3);

                for (let tooltip of document.getElementsByTagName('hattrick-tooltip')) {
                    tooltip.remove();
                }
            }
        }, 100);
    }
})();
