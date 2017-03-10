// ==UserScript==
// @name         涂鸦by SeLang
// @namespace    http://cmsv1.findmd5.com/
// @version      0.1
// @description  涂鸦之作，节约浏览网页的时间成本。目前针对蕾丝猫里详情页的美女图片进行了聚合，不用手动翻页。
// @author       selang
// @include       /https?\:\/\/www\.lesmao\.com/
// @require       https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @connect      *
// @grant        GM_download
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
        console.log(preUrl + currentPageNum + subfixUrl);

        var myWindow = window.open('', '', 'width=300,height=600');
        injectJs(myWindow);
        callBackJs(myWindow, preUrl, subfixUrl);
        myWindow.focus();
    } else {
        // Match attempt failed
    }
})();

//注入JS：jquery
function injectJs(e) {
    var ele = e.document.createElement('script');
    ele.src = "https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js";
    e.document.body.appendChild(ele);
    var id = e.setInterval(function () {
        if (typeof e.$ != 'undefined') {
            e.clearInterval(id);
        }
    }, 100);
}

//JS注入成功后，回调
function callBackJs(e, preUrl, subfixUrl) {
    var id = e.setInterval(function () {
        if (typeof e.$ != 'undefined') {
            e.clearInterval(id);
            var breakPageLoop = false;
            for (var i = 1; i < 30; i++) {
                //创建div去装各自
                e.$('body').append('<div id="c_' + i + '"></div>');
                if (!breakPageLoop) {
                    var lock = true;
                    obtainHtml(preUrl + i + subfixUrl, function (html, i) {
                        //console.log(html);
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
        console.log(index + ": " + $(this).prop('outerHTML'));
        var imgSrc = $(this).attr('src');
        if ('http://i.ajjc.net/k/1178/' === imgSrc) {
            return 'end page';
        }
        objContainer.append('<div>' + $(this).prop('outerHTML') + '</div>');
    });
}

//获取网页
function obtainHtml(url, sucess, i) {
    //GM_download('http://www.w3school.com.cn/jquery/test1.txt', "就好");
   GM_xmlhttpRequest({
        method: 'GET',
        headers: {"Accept": "application/*"},
        url: url,
        onload: function (response) {
            sucess(response.responseText, i);
        }
    });
}
