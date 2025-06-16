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

    if (document.querySelector('#divNewUserSignupLink > a')) {
        window.HT.startPage.showFirstSignupSetup = null;
        window.HT.startPage.hideFirstSignupSetup();
    }

    let newLogin = document.querySelector('app-signup .extra-message > a');
    if (newLogin) newLogin.click();
})();
