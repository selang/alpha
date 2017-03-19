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
    collectoerResult('http://waimai.meituan.com/ajax/poilist?_token=eJx9kV9v0zAUxb+LH3iptdiO42tXmtBQWRfGgI21Kp0QSposyVL3T5qQtojvzrU7Kp6IIuWnc4/Pvbn+RZo4I0PO8AFK2h2y1EYbASqEUFCy+EfTzEgwlKTNdESGT5zJiAKw7055QOGJK8aoYaicUCtEIfF1nhgtpGzbzTAI+qSySXVh86rtktXFYm2Dcm3zoLfQrFbb3KRQEvof99uutT8Wid0kVbG6TJMq6944abfumkV+ySMhCDa1j66p5pxyEAoT8R8QQ+ZROjQenUE6BKMQI+2RIYJDHirHyrPkkXNzz+BCmIvGnnhUQehZoUdF0rMWyNJ7QoGdQo/CaMpF5BHQzX24kDgg99nCjc3cqFgT1IAnof8Slk/EjD4TXoDPYRqrfhQGIdUnTXEKvjeLOFXGE96yOmk42ivxs8a8DzdZu03iNzlvVAMdxVNXa19rO7wLMiT5h/2nqn5/W4yu7vov6tBreBwYeTh05XidHK+ndjyY1ZP7lC3j7dXe8nG6386L5vO7efFSrLMKHqy6WWazl4m6S/RG1d+m4dFc15oF4XLyvJndxD+f+9uvh+y4bXRdiGUxmRdRed8ORsePNfn9B60zt6s=')
})();

function collectoerResult(url) {
    obtainHtml_POST(url, JSON.stringify({
        classify_type: 'cate_all',
        sort_type: '0',
        price_type: '0',
        support_online_pay: '0',
        support_invoice: '0',
        support_logistic: '0',
        page_offset: '21',
        page_size: '20'
    }), function(responseText) {
        log(responseText);
    });
}

//参数是群名
function useGroup(groupName) {
    var id = window.setInterval(function() {
        // log($('#chat_textarea').prop('outerHTML'));
        var jqObj = $('li.list_item :contains(' + groupName + ')');
        var len = jqObj.length;
        if (len != 0) {
            $(jqObj).click();
            log('扫描到useGroup');
            window.clearInterval(id);
        }
        else {
            log('扫描useGroup中');
        }
    }, 100);
}

function listenChatContent(target) {
    useGroup(target);
    var currentLength = 0;
    //chat_content
    currentLength = $('.chat_content_group.buddy').length;
    var id = window.setInterval(function() {
        var otherPersons = $('.chat_content_group.buddy');
        var len = otherPersons.length;
        if (len != 0 && len != currentLength) {
            currentLength = len;
            log(otherPersons[len - 1]);
            var qqNum = $(otherPersons[len - 1]).attr('_sender_uin');
            var chat_content = $(otherPersons[len - 1]).find('.chat_content').html();
            var chat_nick = $(otherPersons[len - 1]).find('.chat_nick').html();
            // window.clearInterval(id);
            if (chat_content.startsWith('#')) {
                //图灵API对接
                obtainHtml_POST('http://www.tuling123.com/openapi/api', chat_content, qqNum, function(txt) {
                    var data = JSON.parse(txt);
                    log(data);
                    var msg = data.text;
                    if (data.url) {
                        msg += '\r\n' + data.url;
                    }
                    if (data.list) {
                        for (o in data.list) {
                            if (data.list[o].article) {
                                if (data.list[o].article === '') {
                                    msg += '\r\n' + data.list[o].source + '\r\n' + data.list[o].detailurl;
                                }
                                else {
                                    msg += '\r\n' + data.list[o].article + '\r\n' + data.list[o].detailurl;
                                }
                            }
                            if (data.list[o].name) {
                                msg += '\r\n' + data.list[o].name + '\r\n' + data.list[o].info + '\r\n' + data.list[o].detailurl;
                            }
                        }
                    }
                    sendMsg(msg);
                });
            }
            else {
                //sendMsg(chat_nick + '_' + qqNum + '你刚刚说了：' + '\r\n' + chat_content);
            }
        }
        else {
            log('扫描聊天记录中...');
        }
    }, 100);
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
    if (false) {
        console.log(c);
    }
}

function priorityLog(c) {
    console.log(c);
}

//注入JS：jquery
function injectJs(e) {
    if (e.jQuery) {
        log('jquery available');
    }
    else {
        var ele = e.document.createElement('script');
        ele.src = "https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js";
        e.document.body.appendChild(ele);
        var id = e.setInterval(function() {
            if (e.jQuery) {
                e.clearInterval(id);
            }
        }, 100);
    }
}

//等待JQuery加载完毕
function dependenceJQuery(e, callback) {
    var id = e.setInterval(function() {
        if (e.jQuery) {
            e.clearInterval(id);
            callback;
        }
    }, 100);
}

//获取网页
function obtainHtml(url, callback) {
    GM_xmlhttpRequest({
        method: 'GET',
        headers: {
            "Accept": "application/*"
        },
        url: url,
        onload: function(response) {
            callback(response.responseText);
        }
    });
}

function obtainHtml_POST(url, str, callback) {
    GM_xmlhttpRequest({
        method: 'POST',
        headers: {
            "Accept": "application/*"
        },
        data: str,
        url: url,
        onload: function(response) {
            callback(response.responseText);
        }
    });
}

function sendMsg(msg) {
    $('#chat_textarea').val(msg);
    $('#send_chat_btn').click();
}
