// ==UserScript==
// @name         涂鸦by SeLang
// @namespace    http://cmsv1.findmd5.com/
// @version      1.0
// @description  目标是聚合美女图片，省去翻页烦恼。已实现：蕾丝猫(lesmao.com)，优美(umei.cc)。有需要聚合的网址请反馈。 QQ群号：455809302,点击链接加入群【油猴脚本私人定制】：https://jq.qq.com/?_wv=1027&k=45p9bea
// @author       selang
// @include       /https?\:\/\/www\.lesmao\.com/
// @include       /https?\:\/\/www\.umei\.cc/
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
    priorityLog('已实现：蕾丝猫(http://www.lesmao.com)，优美(http://www.umei.cc)');

    var currentPageUrl = window.location.href;
    var currentHostname = window.location.hostname;
    var currentPathname = window.location.pathname;
    var currentProtocol = window.location.protocol;
    if ('www.lesmao.com' === currentHostname) {
        var match = currentPathname.match(/^\/(thread-\d+-)(\d+)(-\d+\.html)$/im);
        var preUrl = currentProtocol + '//' + currentHostname + '/'
        var limitPage = 30;
        if (match !== null) {
            var partPreUrl = match[1];
            var currentPageNum = match[2];
            var subfixUrl = match[3];
            currentWindowImpl(preUrl + partPreUrl, limitPage, subfixUrl);
        } else {
            // Match attempt failed
            var mod = getUrlParam('mod');
            if ('viewthread' === mod) {
                var tid = getUrlParam('tid');
                var partPreUrl = '/forum.php?mod=viewthread&tid=' + tid + '&page=';
                var subfixUrl = '';
                currentWindowImpl(preUrl + partPreUrl, limitPage, subfixUrl);
            }
        }
    } else if ('www.umei.cc' === currentHostname) {
        var match = currentPathname.match(/^\/(\w+\/\w+\/)(\d+)(?:_\d+)?\.htm$/im);
        var preUrl = currentProtocol + '//' + currentHostname + '/'
        if (match !== null) {
            var partPreUrl = match[1];
            var pageId = match[2];
            var subfixUrl = '.htm';
            // log(preUrl + partPreUrl + pageId + subfixUrl);
            var pageStr = $('.NewPages li a').html();
            // log(pageStr);
            var myregexp = /共(\d+)页/m;
            var match2 = myregexp.exec(pageStr);
            var limitPage = 0;
            if (match2 != null) {
                limitPage = match2[1];
                currentWindowImpl(preUrl + partPreUrl + pageId + '_', limitPage, subfixUrl);
            }
        }
    }
})();

//获取参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

function currentWindowImpl(preUrl, limitPage, subfixUrl) {
    injectAggregationRef();
    switchAggregationBtn(preUrl, limitPage, subfixUrl);
    dependenceJQuery(window, bindBtn(window, function (e) {
        switchAggregationBtn(preUrl, limitPage, subfixUrl);
    }));
}

//按钮切换
function switchAggregationBtn(preUrl, limitPage, subfixUrl) {
    if ($('#injectaggregatBtn').val() === '聚合显示') {
        $('#injectaggregatBtn').val('聚合隐藏');
        collectPics(window, preUrl, limitPage, subfixUrl);
        $('#c_container').show();
        $('#thread-pic').hide();
        $('#thread-page').hide();

        $('.ImageBody').hide();// umei.cc
    } else {
        $('#injectaggregatBtn').val('聚合显示');
        $('#c_container').hide();
        $('#thread-pic').show();
        $('#thread-page').show();

        $('.ImageBody').show();// umei.cc
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
function collectPics(e, preUrl, limitPage, subfixUrl) {
    var id = e.setInterval(function () {
        if (e.$) {
            e.clearInterval(id);
            var breakPageLoop = false;
            for (var i = 1; i <= limitPage; i++) {
                //创建div去装各自
                e.$('#c_container').append('<div id="c_' + i + '"></div>');
                if (!breakPageLoop) {
                    var lock = true;
                    obtainHtml(preUrl + i + subfixUrl, function (html, i) {
                        // log(html);
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(html, "text/html");
                        // log(preUrl + i + subfixUrl);
                        var imgObj;
                        imgObj = $(doc).find('ul > li > img');
                        if (imgObj.length==0) {
                            imgObj = $(doc).find('.ImageBody p img')
                        }
                        var status = query(e.$('#c_' + i), $(imgObj));
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
    if ($('.thread-tr')) {//lesmao
        $('.thread-tr').after('<input type="button" id="injectaggregatBtn" value="聚合显示"/>');
    }
    if ($('#vt')) {//lesmao
        $('#vt').append('<input type="button" id="injectaggregatBtn" value="聚合显示"/>');
    }
    if ($('.hr10')) {//http://www.umei.cc/weimeitupian/oumeitupian/20043_2.htm
        $($('.hr10')[0]).after('<input type="button" id="injectaggregatBtn" value="聚合显示"/>');
        $('iframe').remove();//移除广告等无必要元素
    }
    $('#injectaggregatBtn').after('<div id="c_container"></div>');
}

function bindBtn(e, callback) {
    $('#injectaggregatBtn').bind('click', callback);
}
