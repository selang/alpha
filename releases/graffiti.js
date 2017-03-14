// ==UserScript==
// @name         涂鸦by SeLang
// @namespace    http://cmsv1.findmd5.com/
// @version      0.8
// @description  目标是聚合美女图片，省去翻页烦恼。已实现：蕾丝猫，有需要聚合的网址请反馈。 QQ群号：455809302,点击链接加入群【油猴脚本私人定制】：https://jq.qq.com/?_wv=1027&k=45p9bea
// @author       selang
// @include       /https?\:\/\/www\.lesmao\.com/
// @require       https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @connect      *
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_getTab
// @grant        GM_getTabs
// @grant        GM_saveTab
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    priorityLog('看到这里，你肯定是个老司机了。欢迎老司机进群：455809302交流。一起玩。\r\n如果不是老司机，只要有创意也欢迎加入。点击链接加入群【油猴脚本私人级别定制】：https://jq.qq.com/?_wv=1027&k=460soLy。');

    var currentPageUrl = window.location.href;
    var currentHostname = window.location.hostname;
    var currentPathname = window.location.pathname;
    var currentProtocol = window.location.protocol;
    if ('www.lesmao.com' === (currentHostname)) {
        var match = currentPathname.match(/^\/(thread-\d+-)(\d+)(-\d+\.html)$/im);
        var preUrl = currentProtocol + '//' + currentHostname + '/'
        if (match !== null) {
            var partPreUrl = match[1];
            var currentPageNum = match[2];
            var subfixUrl = match[3];
            currentWindowImpl(preUrl + partPreUrl, subfixUrl);
        } else {
            // Match attempt failed
            var mod = getUrlParam('mod');
            if ('viewthread' === mod) {
                var tid = getUrlParam('tid');
                var partPreUrl = '/forum.php?mod=viewthread&tid=' + tid + '&page=';
                var subfixUrl = '';
                currentWindowImpl(preUrl + partPreUrl, subfixUrl);
            }
        }
    } else {
        // Match attempt failed
    }
})();

//获取参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

function currentWindowImpl(preUrl, subfixUrl) {
    injectAggregationRef();
    switchAggregationBtn(preUrl,subfixUrl);
    dependenceJQuery(window, bindBtn(window, function (e) {
        switchAggregationBtn(preUrl,subfixUrl);
    }));
}

//按钮切换
function switchAggregationBtn(preUrl, subfixUrl) {
    if ($('#injectaggregatBtn').val() === '聚合显示') {
        $('#injectaggregatBtn').val('聚合隐藏');
        collectPics(window, preUrl, subfixUrl);
        $('#c_container').show();
        $('#thread-pic').hide();
        $('#thread-page').hide();
    } else {
        $('#injectaggregatBtn').val('聚合显示');
        $('#c_container').hide();
        $('#thread-pic').show();
        $('#thread-page').show();
    }
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

//收集图片，回调
function collectPics(e, preUrl, subfixUrl) {
    var id = e.setInterval(function () {
        if (e.$) {
            e.clearInterval(id);
            var breakPageLoop = false;
            for (var i = 1; i < 30; i++) {
                //创建div去装各自
                e.$('#c_container').append('<div id="c_' + i + '"></div>');
                if (!breakPageLoop) {
                    var lock = true;
                    obtainHtml(preUrl + i + subfixUrl, function (html, i) {
                        // log(html);
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(html, "text/html");
                        var status = query(e.$('#c_' + i), $(doc).find('ul > li > img'));
                        if ('end page' === status) {
                            breakPageLoop = true;
                        }
                        lock = false;
                    }, i);
                } else {
                    break;
                }
            }
        }
    }, 100);
}

//查询图片
function query(objContainer, jqObj) {
    jqObj.each(function (index) {
        // log(index + ": " + $(this).prop('outerHTML'));
        var imgSrc = $(this).attr('src');
        if (imgSrc.endsWith('/k/1178/')) {
            return 'end page';
        } else {
            $(this)[0].style = "width: 100%;height: 100%";
            objContainer.append('<div>' + $(this).prop('outerHTML') + '</div>');
        }
    });
}

//获取网页
function obtainHtml(url, sucess, i) {
    //GM_download('http://www.w3school.com.cn/jquery/test1.txt', "就好");
    GM_xmlhttpRequest({
        method: 'GET',
        headers: {
            "Accept": "application/*"
        },
        url: url,
        onload: function (response) {
            sucess(response.responseText, i);
        }
    });
}

function injectAggregationRef() {
    if ($('.thread-tr')) {
        $('.thread-tr').after('<input type="button" id="injectaggregatBtn" value="聚合显示"/>');
    }
    if ($('#vt')) {
        $('#vt').append('<input type="button" id="injectaggregatBtn" value="聚合显示"/>');
    }
    $('#injectaggregatBtn').after('<div id="c_container"></div>');
}

function bindBtn(e, callback) {
    $('#injectaggregatBtn').bind('click', callback);
}
