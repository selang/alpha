// ==UserScript==
// @name         P2P分享by SeLang
// @namespace    http://cmsv1.findmd5.com/
// @version      0.2
// @description  目标是网页右键收藏，一键打包种子，一键分享，浏览器直接查看，在线编辑发布网站。 QQ群号：455809302,点击链接加入群【油猴脚本私人定制】：https://jq.qq.com/?_wv=1027&k=45p9bea。
// @author       selang
// @include       /https?\:\/\/help\.baidu\.com/
// @require       https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require       https://cdn.jsdelivr.net/webtorrent/latest/webtorrent.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular.min.js
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
// ==/UserScript==

var imgType = ['.jpg', '.gif', '.jpeg'];
const forceSuffix = '.selang';

(function () {
    'use strict';
    priorityLog('欢迎进群：455809302交流。一起玩。\r\n如果不是老司机，只要有创意也欢迎加入。点击链接加入群【油猴脚本私人级别定制】：https://jq.qq.com/?_wv=1027&k=460soLy');
    priorityLog('约定内容后缀名名为.selang');
    priorityLog('种子分享网站：(https://btorrent.xyz/)，建立一个文本文档以.selang结尾；文档里每一行放入一个图片的链接地址，再在网站上分享。拷贝种子或者磁力链接地址到对应页面，点击获取，一会应该就能获取到种子里的图片了');
    priorityLog('例子：建立一个文本文档以.selang结尾；文档里每一行放入一个图片的链接地址，再在网站上分享。拷贝种子或者磁力链接地址到(http://help.baidu.com)，点击获取，一会应该就能获取到种子里的图片了');
    injectTorrentInputComponent();
})();

function torrentParse(torrentVal) {
    if (WebTorrent.WEBRTC_SUPPORT) {
        var client = new WebTorrent();
        var torrentId = torrentVal;
        client.add(torrentId, function (torrent) {
            var length = torrent.files.length;
            log('共有文件：' + length);
            forEach(torrent.files, function (file) {
                log(file);
                var path = file.path;
                if (forceSuffix === getSuffix(path)) {
                    file.getBuffer(function (err, buffer) {
                        if (err) throw err;
                        var text = buffer.toString();
                        text = text.replace(/\r|\n/, '\r');
                        var txtArray = text.split(/\r/);
                        forEach(txtArray, function (txt) {
                            var type = getSuffix(txt);
                            if (imgType.indexOf(type) != -1) {
                                $('#mainContainer').append('<img src=' + txt + ' alt=""/>');
                            }
                        });
                    });
                }
            });
        })
    } else {
        priorityLog('不支持！')
    }
}

function injectTorrentInputComponent() {
    clearHeadAndBody();
    $('body').append('<input id="torrentVal" type="text" value="" placeholder="请输入特制的种子地址"/><input id="torrentBtn" type="button" value="获取"/>');
    bindBtn(window,function (e) {
        var torrentVal = $('#torrentVal').val();
        torrentParse(torrentVal);
    });
    $('body').append('<div id="mainContainer"></div>');
}

function bindBtn(e, callback) {
    $('#torrentBtn').bind('click', callback);
}

function clearHeadAndBody() {
    $('body').html('');
    $('head').html('');
}

//循环
function forEach(arr, callback) {
    for (var j = 0, len = arr.length; j < len; j++) {
        callback(arr[j]);
    }
}

//取后缀名
function getSuffix(path) {
    var point = path.lastIndexOf(".");

    var type = path.substr(point);
    if (type) {
        return type.toLowerCase();
    }
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
