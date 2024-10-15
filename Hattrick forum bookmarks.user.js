// ==UserScript==
// @name         Hattrick forum bookmarks
// @version      2024-08-17
// @description  Bookmark forum posts
// @author       shotgunshine
// @license      MIT
// @match        https://*.hattrick.org/Forum/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// ==/UserScript==

function savePost(id, name) {
    GM_setValue(id, name);
}

function deletePost(id) {
    GM_deleteValue(id);
    printPosts();
}

function printPosts() {
    let list = '';
    for (let p of GM_listValues()) {
        list += `<li post-id="${p}">`;
        list += `<a href="#${p}">🗑️</a> `;
        list += `<a href="/Forum/Read.aspx?t=${p.split('.')[0]}&n=${p.split('.')[1]}">`;
        list += GM_getValue(p);
        list += ` (${p})`;
        list += '</a></li>';
    }
    document.getElementById('forum-bookmarks').innerHTML = list;
    for (let li of document.getElementById('forum-bookmarks').children) {
        li.children[0].addEventListener('click', event => {
            deletePost(event.target.parentNode.getAttribute('post-id'));
        });
    }
}

function bookmarkButton(postId) {
    let button = document.createElement('a');
    button.href = `#${postId}`;
    button.textContent = 'Save 🔖';
    button.style = 'margin-right: 5px;';
    let postName = document.title.split('»')[0].trim();
    button.addEventListener('click', () => {
        savePost(postId, postName);
        window.location = '/Forum/#forum-bookmarks';
    });

    return button;
}

(function() {
    'use strict';

    if (window.location.pathname.includes('Read')) {
        for (let a of document.querySelectorAll('.cfHeader.singleLine > .float_left > a:first-child')) {
            let postId = a.getAttribute('href').split('(')[1].split('\'')[5];
            a.parentNode.insertBefore(bookmarkButton(postId), a);
        }
    } else {
        let box = '<div><div class="box mainBox"><h2>Bookmarked posts</h2><ul id="forum-bookmarks"></ul></div></div>';
        document.getElementById('ctl00_ctl00_CPContent_CPMain_ucHtUsersMessages_updSneakpeek').outerHTML += box;
        printPosts();
    }
})();
