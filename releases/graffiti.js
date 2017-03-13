// ==UserScript==
// @name         涂鸦by SeLang
// @namespace    http://cmsv1.findmd5.com/
// @version      0.3
// @description  涂鸦之作，节约浏览网页的时间成本。目前针对蕾丝猫里详情页的美女图片进行了聚合，不用手动翻页。 QQ群号：455809302,点击链接加入群【油猴脚本私人定制】：https://jq.qq.com/?_wv=1027&k=45p9bea
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

    // Your code here...
    var currentPageUrl = window.location.href;
    var match = currentPageUrl.match(/^(http:\/\/www\.lesmao\.com\/thread-\d+-)(\d+)(-\d+\.html)$/im);
    if (match !== null) {
        var preUrl = match[1];
        var currentPageNum = match[2];
        var subfixUrl = match[3];
        currentWindowImpl(preUrl, subfixUrl);
    }
    else {
        // Match attempt failed
    }


})();

function currentWindowImpl(preUrl, subfixUrl) {
    dependenceJQuery(window, injectBtn(window, function (e) {
        if ($('#injectaggregatBtn').val() === '聚合显示') {
            $('#injectaggregatBtn').val('聚合隐藏');
            collectPics(window, preUrl, subfixUrl);
            $('#c_container').show();
        } else {
            $('#injectaggregatBtn').val('聚合显示');
            $('#c_container').hide();
        }
    }));
}


function log(c) {
    console.log(c);
}

//注入JS：jquery
function injectJs(e) {
    if (e.jQuery) {
        log('yes');
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

function dependenceJQuery(e, callback) {
    var id = e.setInterval(function () {
        if (e.jQuery) {
            e.clearInterval(id);
            callback;
        }
    }, 100);
}

//JS注入成功后，回调
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
                        //log(html);
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(html, "text/html");
                        var status = query(e.$('#c_' + i), $(doc).find('ul > li > img'));
                        if ('end page' === status) {
                            breakPageLoop = true;
                        }
                        lock = false;
                    }, i);
                }
                else {
                    break;
                }
            }
        }
    }, 100);
}

//查询图片
function query(objContainer, jqObj) {
    jqObj.each(function (index) {
        //log(index + ": " + $(this).prop('outerHTML'));
        var imgSrc = $(this).attr('src');
        if ('http://i.ajjc.net/k/1178/' === imgSrc) {
            return 'end page';
        }
        $(this)[0].style="width: 100%;height: 100%";
        objContainer.append('<div>' + $(this).prop('outerHTML') + '</div>');
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


function injectBtn(e, callback) {
    if ($('.thread-tr')) {
        $('.thread-tr').after('<input type="button" id="injectaggregatBtn" value="聚合显示"/>');
    }
    if ($('#vt')) {
        $('#vt').append('<input type="button" id="injectaggregatBtn" value="聚合显示"/>');
    }
    $('#injectaggregatBtn').after('<div id="c_container"></div>');
    $('#injectaggregatBtn').bind('click', callback);
}
