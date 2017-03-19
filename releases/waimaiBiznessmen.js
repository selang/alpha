// ==UserScript==
// @name         外卖商家提取人by SeLang
// @namespace    http://cmsv1.findmd5.com/
// @version      0.1
// @description  目标是提取商家基本信息，有想法的请反馈。QQ群号：455809302,点击链接加入群【油猴脚本私人定制】：https://jq.qq.com/?_wv=1027&k=45p9bea。
// @author       selang
// @include       /https?\:\/\/waimai\.meituan\.com/
// @require       https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @connect      *
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_getTab
// @grant        GM_getTabs
// @grant        GM_saveTab
// @grant        GM_xmlhttpRequest
// ==/UserScript==

//图灵机器人key,改这里
var tulingKey = '64b194e6e27740fcbee72869d1b8ec81';

(function() {
    'use strict';
    priorityLog('看到这里，你肯定是个老司机了。欢迎老司机进群：455809302交流。一起玩。\r\n如果不是老司机，只要有创意也欢迎加入。点击链接加入群【油猴脚本私人级别定制】：https://jq.qq.com/?_wv=1027&k=460soLy');
    collectoerResult('https://waimai.meituan.com/ajax/poilist?_token=eJx9kV9v0zAUxb+LH3iptdiO42tXmtBQWRfGgI21Kp0QSposyVL3T5qQtojvzrU7Kp6IIuWnc4/Pvbn+RZo4I0PO8AFK2h2y1EYbASqEUFCy+EfTzEgwlKTNdESGT5zJiAKw7055QOGJK8aoYaicUCtEIfF1nhgtpGzbzTAI+qSySXVh86rtktXFYm2Dcm3zoLfQrFbb3KRQEvof99uutT8Wid0kVbG6TJMq6944abfumkV+ySMhCDa1j66p5pxyEAoT8R8QQ+ZROjQenUE6BKMQI+2RIYJDHirHyrPkkXNzz+BCmIvGnnhUQehZoUdF0rMWyNJ7QoGdQo/CaMpF5BHQzX24kDgg99nCjc3cqFgT1IAnof8Slk/EjD4TXoDPYRqrfhQGIdUnTXEKvjeLOFXGE96yOmk42ivxs8a8DzdZu03iNzlvVAMdxVNXa19rO7wLMiT5h/2nqn5/W4yu7vov6tBreBwYeTh05XidHK+ndjyY1ZP7lC3j7dXe8nG6386L5vO7efFSrLMKHqy6WWazl4m6S/RG1d+m4dFc15oF4XLyvJndxD+f+9uvh+y4bXRdiGUxmRdRed8ORsePNfn9B60zt6s=')
})();

function collectoerResult(url) {
    var urlFormObj = {
        classify_type: 'cate_all',
        sort_type: '0',
        price_type: '0',
        support_online_pay: '0',
        support_invoice: '0',
        support_logistic: '0',
        page_offset: '21',
        page_size: '20'
    };
    obtainHtml_POST(url,
        urlEncode(urlFormObj),
        function(responseText) {
            log(responseText);
        });
}

//获取参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

//日志
function log(c) {
    if (true) {
        console.log(c);
    }
}

function priorityLog(c) {
    console.log(c);
}


/**
 * param 将要转为URL参数字符串的对象
 * key URL参数字符串的前缀
 * encode true/false 是否进行URL编码,默认为true
 * 
 * return URL参数字符串
 */
function urlEncode(param, key, encode) {
    if (param == null) return '';
    var paramStr = '';
    var t = typeof(param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
    }
    else {
        for (var i in param) {
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
            paramStr += urlEncode(param[i], k, encode);
        }
    }
    return paramStr;
};

function obtainHtml_POST(url, str, callback) {
    log(str);
    GM_xmlhttpRequest({
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: str,
        url: url,
        onload: function(response) {
            callback(response.responseText);
        }
    });
}