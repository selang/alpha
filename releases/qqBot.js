// ==UserScript==
// @name         QQ机器人by SeLang
// @namespace    http://cmsv1.findmd5.com/
// @version      0.3
// @description  目标是实现一些人性化的功能，有想法的请反馈。注意：纯图片视频等不捕捉；表情会被转成超链接；含图片仅回复文字;匿名聊天不捕捉。 QQ群号：455809302,点击链接加入群【油猴脚本私人定制】：https://jq.qq.com/?_wv=1027&k=45p9bea。
// @author       selang
// @include       /https?\:\/\/w\.qq\.com/
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
var tulingKey='64b194e6e27740fcbee72869d1b8ec81';

(function () {
    'use strict';
    priorityLog('看到这里，你肯定是个老司机了。欢迎老司机进群：455809302交流。一起玩。\r\n如果不是老司机，只要有创意也欢迎加入。加群双击，暴击:https://jq.qq.com/?_wv=1027&k=45p9bea。');
    priorityLog('已加入图灵机器人API，请填入自己的图灵机器人key。key申请：http://www.tuling123.com/');
    priorityLog('参考海绵宝宝的想法，加入图灵机器人API，一肚子坏水会不会来打我O(∩_∩)O');
    priorityLog('测试QQ群号：550738206,更改默认群，欢迎进群炸机器人,点击链接加入群【web qq机器人测试群】：https://jq.qq.com/?_wv=1027&k=460shtL');
    //测试QQ群号：550738206
    listenChatContent('web qq机器人测试群');
})();

//参数是群名
function useGroup(groupName) {
    var id = window.setInterval(function () {
        // log($('#chat_textarea').prop('outerHTML'));
        var jqObj = $('li.list_item :contains(' + groupName + ')');
        var len = jqObj.length;
        if (len != 0) {
            $(jqObj).click();
            log('扫描到useGroup');
            window.clearInterval(id);
        } else {
            log('扫描useGroup中');
        }
    }, 100);
}

function listenChatContent(target) {
    useGroup(target);
    var currentLength = 0;
    //chat_content
    currentLength = $('.chat_content_group.buddy').length;
    var id = window.setInterval(function () {
        var otherPersons = $('.chat_content_group.buddy');
        var len = otherPersons.length;
        if (len != 0 && len != currentLength) {
            currentLength = len;
            log(otherPersons[len - 1]);
            var qqNum = $(otherPersons[len - 1]).attr('_sender_uin');
            var chat_content = $(otherPersons[len - 1]).find('.chat_content').html();
            var chat_nick = $(otherPersons[len - 1]).find('.chat_nick').html();
            // window.clearInterval(id);
            if(chat_content.startsWith('#')){
                //图灵API对接
                obtainHtml_POST('http://www.tuling123.com/openapi/api', chat_content, qqNum, function (txt) {
                    var data=JSON.parse(txt);
                    log(data);
                    var msg=data.text;
                    if(data.url){
                        msg+='\r\n'+data.url;
                    }
                    sendMsg(msg);
                });
            }else {
                //sendMsg(chat_nick + '_' + qqNum + '你刚刚说了：' + '\r\n' + chat_content);
            }
        } else {
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
    } else {
        var ele = e.document.createElement('script');
        ele.src = "https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js";
        e.document.body.appendChild(ele);
        var id = e.setInterval(function () {
            if (e.jQuery) {
                e.clearInterval(id);
            }
        }, 100);
    }
}

//等待JQuery加载完毕
function dependenceJQuery(e, callback) {
    var id = e.setInterval(function () {
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
        onload: function (response) {
            callback(response.responseText);
        }
    });
}

function obtainHtml_POST(url, info, qNum, callback) {
    var str = JSON.stringify({
        key: tulingKey, //更换自己的图灵机器人key
        info: info,
        userid: qNum,

    });
    log(str);
    GM_xmlhttpRequest({
        method: 'POST',
        headers: {
            "Accept": "application/*"
        },
        data: str,
        url: url,
        onload: function (response) {
            callback(response.responseText);
        }
    });
}

function sendMsg(msg) {
    $('#chat_textarea').val(msg);
    $('#send_chat_btn').click();
}
