// ==UserScript==
// @name         Hattrick match prediction
// @version      2024-04-15
// @description  Show a (bad) prediction on the match report
// @author       shotgunshine
// @license      MIT
// @match        https://*.hattrick.org/Club/Matches/Match.aspx*
// @match        https://*.hattrick.org/*/Club/Matches/Match.aspx*
// @grant        none
// @require      https://shotgunshine.github.io/imp/imp/binomial.js
// @require      https://shotgunshine.github.io/imp/imp/ratings.js
// @require      https://shotgunshine.github.io/imp/imp/predictor.js
// ==/UserScript==

function getRatingsHome(match, minute) {
    let ratings = match.ratings.filter(x => x.teamId == match.homeTeamIdDB)[0];
    let timeline = match.analysis.timeline.filter(x => x.minute < minute).at(-1);
    return new IMP.ratings(
        timeline.ratings.sectors[2].homeRating / 4,
        timeline.ratings.sectors[1].homeRating / 4,
        timeline.ratings.sectors[0].homeRating / 4,
        timeline.ratings.sectors[3].homeRating / 4,
        timeline.ratings.sectors[6].homeRating / 4,
        timeline.ratings.sectors[5].homeRating / 4,
        timeline.ratings.sectors[4].homeRating / 4,
        ratings.averageIndirectFreeKickDef / 4,
        ratings.averageIndirectFreeKickAtt / 4,
        0.25,
        match.homeTacticType,
        match.homeTacticSkill
    );
}

function getRatingsAway(match, minute) {
    let ratings = match.ratings.filter(x => x.teamId == match.awayTeamIdDB)[0];
    let timeline = match.analysis.timeline.filter(x => x.minute < minute).at(-1);
    return new IMP.ratings(
        timeline.ratings.sectors[4].awayRating / 4,
        timeline.ratings.sectors[5].awayRating / 4,
        timeline.ratings.sectors[6].awayRating / 4,
        timeline.ratings.sectors[3].awayRating / 4,
        timeline.ratings.sectors[0].awayRating / 4,
        timeline.ratings.sectors[1].awayRating / 4,
        timeline.ratings.sectors[2].awayRating / 4,
        ratings.averageIndirectFreeKickDef / 4,
        ratings.averageIndirectFreeKickAtt / 4,
        0.25,
        match.awayTacticType,
        match.awayTacticSkill
    );
}

function getAverageRatingsHome(match) {
    let ratings = match.ratings.filter(x => x.teamId == match.homeTeamIdDB)[0];
    return new IMP.ratings(
        ratings.averageLeftDef / 4,
        ratings.averageMidDef / 4,
        ratings.averageRightDef / 4,
        ratings.averageMidfield / 4,
        ratings.averageLeftAtt / 4,
        ratings.averageMidAtt / 4,
        ratings.averageRightAtt / 4,
        ratings.averageIndirectFreeKickDef / 4,
        ratings.averageIndirectFreeKickAtt / 4,
        0.25,
        match.homeTacticType,
        match.homeTacticSkill
    );
}

function getAverageRatingsAway(match) {
    let ratings = match.ratings.filter(x => x.teamId == match.awayTeamIdDB)[0];
    return new IMP.ratings(
        ratings.averageLeftDef / 4,
        ratings.averageMidDef / 4,
        ratings.averageRightDef / 4,
        ratings.averageMidfield / 4,
        ratings.averageLeftAtt / 4,
        ratings.averageMidAtt / 4,
        ratings.averageRightAtt / 4,
        ratings.averageIndirectFreeKickDef / 4,
        ratings.averageIndirectFreeKickAtt / 4,
        0.25,
        match.awayTacticType,
        match.awayTacticSkill
    );
}

function getOdds(prediction) {
    let odds = [0, 0, 0];
    prediction.forEach((x, h) => { x.forEach((y, a) => { odds[Math.sign(a - h) + 1] += y })});
    return {
        win: (odds[0] * 100).toFixed(1),
        draw: (odds[1] * 100).toFixed(1),
        loss: (odds[2] * 100).toFixed(1)
    };
}

(function() {
    'use strict';

    const maxMinute = 5;
    let match = window.HT.ngMatch.data;

    if (match.isFinished && !match.isWalkover) {
        let home, away, ratingsType, timeline = match.analysis.timeline.filter(x => x.minute < maxMinute).at(-1);
        if (timeline.ratings.sectors.length) {
            home = getRatingsHome(match, maxMinute);
            away = getRatingsAway(match, maxMinute);
            ratingsType = 'minute ' + timeline.minute;
        } else {
            home = getAverageRatingsHome(match);
            away = getAverageRatingsAway(match);
            ratingsType = 'average';
        }

        let possession = IMP.predictor.chanceDistribution(home.midfield, away.midfield);
        let pressing = IMP.predictor.tacticEfficacy(1, home.tactics[1]);
        pressing += IMP.predictor.tacticEfficacy(1, away.tactics[1]);
        let avgScoringHome = IMP.predictor.avgScoringChance(home, away);
        let avgScoringAway = IMP.predictor.avgScoringChance(away, home);
        let caThreshold = home.tactics[2]*away.tactics[2] ? 0.5 : 0.43245;
        let countersHome = (possession < caThreshold) ? IMP.predictor.tacticEfficacy(2, home.tactics[2]) : 0;
        let countersAway = (1 - possession < caThreshold) ? IMP.predictor.tacticEfficacy(2, away.tactics[2]) : 0;
        let avgChancesHome = possession + countersHome * (1 - possession) * (1 - avgScoringAway);
        let avgChancesAway = (1 - possession) + countersAway * possession * (1 - avgScoringHome);

        let prediction = getOdds(IMP.predictor.prediction(
            possession,
            pressing,
            avgScoringHome,
            avgScoringAway,
            countersHome,
            countersAway
        ));

        // wait for the page rendering
        let interval = setInterval(() => {
            let infobox = document.querySelector('.matchinfo > .boxBody');
            if (infobox != null) {
                clearInterval(interval);
                infobox.innerHTML += `
                    <div><hr><p class="center"><a href="https://shotgunshine.github.io/imp/" target="_blank">IMP: Match Predictor</a></p>
                    <div class="flex flex-space-between">
                    <div>${window.HT.ngMatch.data.homeShortTeamName}</div>
                    <div>Draw</div>
                    <div>${window.HT.ngMatch.data.awayShortTeamName}</div></div>
                    <div style="margin: 5px 0; line-height: 1; display: flex;">
                    <div style="padding: 2px 5px; background-color: #6ecdea; text-align: left; width: ${prediction.win}%;"><span>${prediction.win}%</span></div>
                    <div style="padding: 2px 5px; background-color: #eeeeee; text-align: center; width: ${prediction.draw}%;"><span>${prediction.draw}%</span></div>
                    <div style="padding: 2px 5px; background-color: #d15e5e; text-align: right; width: ${prediction.loss}%;"><span>${prediction.loss}%</span></div>
                    </div><div class="flex flex-space-between">
                    <div>${(10 * avgChancesHome * (1 - pressing) * avgScoringHome).toFixed(2)}</div>
                    <div>Average Goals</div>
                    <div>${(10 * avgChancesAway * (1 - pressing) * avgScoringAway).toFixed(2)}</div>
                    </div>
                    <div class="shy">Used ${ratingsType} ratings. Ignored SEs.</div>
                    <div><button id="download_ratings" type="button">Save ratings</button></div>
                    </div>
                `;
                document.getElementById('download_ratings').addEventListener('click', () => {
                    let a = document.createElement("a");
                    a.href = "data:text/json;charset=utf-8," + JSON.stringify(home);
                    a.download = `${match.homeTeamId}_${match.matchId}.imp`;
                    document.body.appendChild(a).click();
                    a.href = "data:text/json;charset=utf-8," + JSON.stringify(away);
                    a.download = `${match.awayTeamId}_${match.matchId}.imp`;
                    a.click();
                });
            }
        }, 100);
    }
})();
