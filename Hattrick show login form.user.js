// ==UserScript==
// @name         Hattrick show login form
// @version      2024-02-25
// @description  Show the login form on the login page so that you can login (duh???)
// @author       shotgunshine
// @license      MIT
// @match        https://*.hattrick.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (document.querySelector('ng-app-signup')) {
        let interval = setInterval(() => {
            let newLogin = document.querySelector('app-signup .extra-message > a');
            if (newLogin) {
                clearInterval(interval);
                newLogin.click();
            }
        }, 10);
    }
})();
