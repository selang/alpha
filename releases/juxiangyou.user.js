// ==UserScript==
// @name         聚享游豪华套装
// @namespace    http://cmsv1.findmd5.com/
// @version      0.2
// @description  聚享游
// @author       david
// @include       /https?\:\/\/www\.juxiangyou\.com/
// @require       https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @connect      *
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_getTab
// @grant        GM_getTabs
// @grant        GM_saveTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_xmlhttpRequest
// @run-at       document-body
// ==/UserScript==


(function () {
    'use strict';
    priorityLog('');
    var pathname = window.location.pathname;
    // if('/fun/play/crazy28/wdjc'===pathname) {
        $('p.login-p.login-p-id.mar-t4').text('ID：11696158');
        $('span.J_udou').text('123456');
    // }
})();

//日志
function log(c) {
    if (false) {
        console.log(c);
    }
}

function priorityLog(c) {
    console.log(c);
}

