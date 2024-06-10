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

    window.HT.startPage.hideFirstSignupSetup();
    window.HT.startPage.showFirstSignupSetup = null;
})();
