// ==UserScript==
// @name         美女图聚合展示by SeLang
// @namespace    http://cmsv1.findmd5.com/
// @version      2.5
// @description  目标是聚合美女图片，省去翻页烦恼。已实现：蕾丝猫(lesmao.com)，优美(umei.cc)，美图录(meitulu.com)，美女86(17786.com)，24美女图片(24meinv.me)。待实现：。有需要聚合的网址请反馈。 QQ群号：455809302,点击链接加入群【油猴脚本私人定制】：https://jq.qq.com/?_wv=1027&k=45p9bea
// @author       selang
// @include       /https?\:\/\/www\.lesmao\.com/
// @include       /https?\:\/\/www\.umei\.cc/
// @include       /https?\:\/\/www\.meitulu\.com/
// @include       /https?\:\/\/www\.17786\.com/
// @include       /https?\:\/\/www\.nvshens\.com/
// @include       /https?\:\/\/m\.nvshens\.com/
// @include       /https\:\/\/www\.youtube\.com/
// @include       /https?\:\/\/www\.24meinv\.me/
// @require       https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.3/FileSaver.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.5.2/dom-to-image.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/dexie/1.5.1/dexie.min.js
// @connect      *
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_getTab
// @grant        GM_getTabs
// @grant        GM_saveTab
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// ==/UserScript==

var blobCache = {};
var blobUrlCache = {};

(function () {
    'use strict';

    priorityLog('看到这里，你肯定是个老司机了。欢迎老司机进群：455809302交流。一起玩。\r\n如果不是老司机，只要有创意也欢迎加入。点击链接加入群【油猴脚本私人级别定制】：https://jq.qq.com/?_wv=1027&k=460soLy。');
    priorityLog('已实现：蕾丝猫(http://www.lesmao.com)，优美(http://www.umei.cc)，美图录(http://www.meitulu.com)，美女86(http://www.17786.com)，宅男女神(http://www.nvshens.com)，24美女图片(24meinv.me)');
    priorityLog('已实现：绕过YouTube的年龄限制');
    priorityLog('未实现：');

    var currentPageUrl = window.location.href;
    var currentHostname = window.location.hostname;
    var currentPathname = window.location.pathname;
    var currentProtocol = window.location.protocol;
    hotkeys();
    if ('www.lesmao.com' === currentHostname) {
        var match = currentPathname.match(/^\/(thread-\d+-)(\d+)(-\d+\.html)$/im);
        var preUrl = currentProtocol + '//' + currentHostname + '/';
        var limitPage = 30;
        if (match !== null) {
            var partPreUrl = match[1];
            var currentPageNum = match[2];
            var subfixUrl = match[3];
            var limitPageStr=$('#thread-page > div > div > label > span').text();
            var limitPageMatch = limitPageStr.match(/(\d+)/i);
            if(limitPageMatch!=null){
                limitPage=parseInt(limitPageMatch[1]);
            }
            currentWindowImpl(preUrl + partPreUrl, 1, limitPage, subfixUrl, currentHostname);
        } else {
            // Match attempt failed
            var mod = getUrlParam('mod');
            if ('viewthread' === mod) {
                var tid = getUrlParam('tid');
                var partPreUrl = '/forum.php?mod=viewthread&tid=' + tid + '&page=';
                var subfixUrl = '';
                var limitPageStr=$('#page > div > label > span').text();
                var limitPageMatch = limitPageStr.match(/(\d+)/i);
                if(limitPageMatch!=null){
                    limitPage=parseInt(limitPageMatch[1]);
                }
                currentWindowImpl(preUrl + partPreUrl, 1, limitPage, subfixUrl, currentHostname);
            }
        }
    } else if ('www.umei.cc' === currentHostname) {
        var match = currentPathname.match(/^\/(\w+\/\w+(?:\/\w+)?\/)(\d+)(?:_\d+)?\.htm$/im);
        var preUrl = currentProtocol + '//' + currentHostname + '/';
        if (match !== null) {
            var partPreUrl = match[1];
            var pageId = match[2];
            var subfixUrl = '.htm';
            log(preUrl + partPreUrl + pageId + subfixUrl);
            var pageStr = $('.NewPages li a').html();
            log(pageStr);
            var myregexp = /共(\d+)页/m;
            var match2 = myregexp.exec(pageStr);
            var limitPage = 0;
            if (match2 != null) {
                limitPage = match2[1];
                currentWindowImpl(preUrl + partPreUrl + pageId + '_', limitPage, subfixUrl, currentHostname);
            }
        }
    }
    else if ('www.meitulu.com' === currentHostname) {
        var match = currentPathname.match(/^\/(item\/)(\d+)(?:_\d+)?\.html$/im);
        var preUrl = currentProtocol + '//' + currentHostname + '/';
        if (match !== null) {
            var partPreUrl = match[1];
            var pageId = match[2];
            var subfixUrl = '.html';
            log(preUrl + partPreUrl + pageId + subfixUrl);
            var pageStr = $('a.a1:last').prev().html();
            log(pageStr);
            var limitPage = parseInt(pageStr);
            currentWindowImpl(preUrl + partPreUrl + pageId + '_', 1, limitPage, subfixUrl, currentHostname);
        }
    } else if ('www.17786.com' === currentHostname) {
        var match = currentPathname.match(/^\/(\d+)(?:_\d+)?\.html$/im); //http://www.17786.com/7745_1.html
        var preUrl = currentProtocol + '//' + currentHostname + '/';
        if (match !== null) {
            var partPreUrl = '';
            var pageId = match[1];
            var subfixUrl = '.html';
            log(preUrl + partPreUrl + pageId + subfixUrl);
            var pageStr = $('h2').html();
            log(pageStr);
            var limitPage = 0;
            var myregexp = /\(\d+\/(\d+)\)/im;
            var match = myregexp.exec(pageStr);
            if (match != null) {
                limitPage = parseInt(match[1]);
                currentWindowImpl(preUrl + partPreUrl + pageId + '_', 1, limitPage, subfixUrl, currentHostname);
            }
        } else {
            var match = currentPathname.match(/^\/((?:\w+\/)+)(\d+)(?:_\d+)?\.html$/im);//http://www.17786.com/beautiful/feizhuliutupian/44569.html
            var preUrl = currentProtocol + '//' + currentHostname + '/';
            if (match !== null) {
                var partPreUrl = match[1];
                var pageId = match[2];
                var subfixUrl = '.html';
                log(preUrl + partPreUrl + pageId + subfixUrl);
                var pageStr = $('h2').html();
                log(pageStr);
                var limitPage = 40;
                currentWindowImpl(preUrl + partPreUrl + pageId + '_', 1, limitPage, subfixUrl, currentHostname);
            }
        }
    } else if ('www.nvshens.com' === currentHostname || 'm.nvshens.com' === currentHostname) {
        var match = currentPathname.match(/^\/(g\/\d+)\/?(?:\d+\.html)?$/im);
        var preUrl = currentProtocol + '//' + currentHostname + '/';
        if (match !== null) {
            var partPreUrl = match[1];
            var pageId = '/';
            var subfixUrl = '.html';
            log(preUrl + partPreUrl + pageId + subfixUrl);
            var pageStr = $('div#dinfo span[style="color: #DB0909"]').html();
            if (!pageStr) {
                pageStr = $('div#ddinfo span[style="color: #DB0909"]').html();
            }
            var pageNumMatch = pageStr.match(/(\d+)张照片/im);
            if (pageNumMatch != null) {
                pageStr = pageNumMatch[1];
            }
            var limitPage = parseInt(pageStr);
            var number = limitPage % 5;
            limitPage = Math.floor(limitPage / 5);
            if (number > 0) {
                limitPage = limitPage + 1;
            }
            log(limitPage);
            currentWindowImpl(preUrl + partPreUrl + pageId, 1, limitPage, subfixUrl, currentHostname);
        }
    } else if ('www.24meinv.me' === currentHostname) {
        {//去广告
            var id = setInterval(function () {
                $('#hgg2').remove();
                $('#j__s').remove();
                $('#__jx_div').remove();
                $('iframe').remove();
                $('body > div.foot > div > div:nth-child(13)').remove();
            }, 100);
        }
        {
            var match = currentPathname.match(/^\/(hd1\/\w+?)(?:_\d+)?\.html$/im);
            var preUrl = currentProtocol + '//' + currentHostname + '/';
            if (match !== null) {
                var partPreUrl = match[1];
                var pageId = '';
                var subfixUrl = '.html';
                log(preUrl + partPreUrl + pageId + subfixUrl);
                var pageStr = $('div.page.ps > a:last-child').attr('href');
                var limitPage = 0;
                if (pageStr) {
                    var myregexp = /^\/(hd1\/\w+?)(?:_(\d+))?\.html$/im;
                    var match = myregexp.exec(pageStr);
                    if (match == null) {
                        match = myregexp.exec(currentPathname);
                    }
                    if (match != null) {
                        limitPage = parseInt(match[2]);
                        limitPage++;//首页从0开始
                        currentWindowImpl(preUrl + partPreUrl + pageId + '_', 0, limitPage, subfixUrl, currentHostname);
                    } else {

                    }
                }
            }
        }
    }

    if ('www.youtube.com' === currentHostname) {
        var vId = "";
        var id = setInterval(function () {
            $('#player-unavailable').not('.hid').addClass('hid');
            var curVId = getUrlParam('v');
            if (curVId != null && vId != curVId) {
                log('切换VID');
                vId = curVId;
                var sid = setInterval(function () {
                    var swichVIdState = switchVId(vId);
                    if (swichVIdState) {
                        clearInterval(sid);
                    }
                }, 100);
            }
        }, 100);
    }
})();

function switchVId(vId) {
    $('#player-unavailable').not('.hid').addClass('hid');
    var text = $('#unavailable-message').text();
    if (text && text.indexOf('内容警告') != -1) {
        log('内容警告::');
        $('#player-api').removeClass('off-screen-target').html('<iframe src="https://www.youtube.com/embed/' +
            vId +
            '" width="100%" height="100%" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""></iframe>');
        return true;
    }
    return false;
}

//热键
function hotkeys() {
    GM_registerMenuCommand("图片打包下载", packageAndDownload, "d");
    $(document).keydown(function (e) {
        if (e.ctrlKey && e.shiftKey) {
            if (e.which == 76) {//L
                log("触发快捷键");
            }
        }
    });
}

function packageAndDownload() {
    var zip = new JSZip();
    var imgList = $('img[label="sl"]');
    var length = imgList.length;
    $.each(imgList, function (index, value) {
        zip.file("readme.txt", "感谢使用selang提供的插件。欢迎进群：455809302交流。一起玩。\r\n如果不是老司机，只要有创意也欢迎加入。点击链接加入群【油猴脚本私人级别定制】：https://jq.qq.com/?_wv=1027&k=460soLy\n");
        var img = zip.folder("images");
        var imgSrc = $(value).attr('src');
        {
            if (blobCache[imgSrc]) {
                img.file(index + ".jpg", blobCache[imgSrc], {base64: false});
                length--;
            } else {
                if (!imgSrc.startsWith('blob:')) {
                    obtainBlob(imgSrc, function (response) {
                        var responseHeaders = parseHeaders(response.responseHeaders);
                        var contentType = responseHeaders['Content-Type'];
                        if (!contentType) {
                            contentType = "image/png";
                        }
                        var blob = new Blob([response.response], {type: contentType});
                        blobCache[imgSrc] = blob;
                        img.file(index + ".jpg", blobCache[imgSrc], {base64: false});
                        length--;
                    });
                } else {
                    img.file(index + ".jpg", blobCache[blobUrlCache[imgSrc]], {base64: false});
                    length--;
                }
            }
        }
    });
    var id = setInterval(function () {
        if (length == 0) {
            clearInterval(id);
            zip.generateAsync({type: "blob"})
                .then(function (content) {
                    saveAs(content, "PackageSL.zip");
                });
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

function currentWindowImpl(preUrl, startIndex, limitPage, subfixUrl, currentHostname) {
    injectAggregationRef(currentHostname);
    switchAggregationBtn(preUrl, startIndex, limitPage, subfixUrl, currentHostname);
    dependenceJQuery(window, bindBtn(window, function (e) {
        switchAggregationBtn(preUrl, startIndex, limitPage, subfixUrl, currentHostname);
    }));
}

//按钮切换
function switchAggregationBtn(preUrl, startIndex, limitPage, subfixUrl, currentHostname) {
    if ($('#injectaggregatBtn').val() === '聚合显示') {
        $('#injectaggregatBtn').val('聚合隐藏');
        collectPics(startIndex, window, preUrl, limitPage, subfixUrl, currentHostname);
        $('#c_container').show();

        if ('www.lesmao.com' === currentHostname) {
            $('#thread-pic').hide();
            $('#thread-page').hide();
        } else if ('www.umei.cc' === currentHostname) {
            $('.ImageBody').hide();
        }
        else if ('www.meitulu.com' === currentHostname) {
            $('div.content').hide();
            $('body > center').hide();
        } else if ('www.17786.com' === currentHostname) {
            {
                $('div.img_box').hide();
                $('div.wt-pagelist').hide();
            }
            $('div#picBody').hide();
            $('.articleV2Page').hide();
        } else if ('www.nvshens.com' === currentHostname || 'm.nvshens.com' === currentHostname) {
            {
                $('div.ck-box-unit').hide();
                $('div.photos').hide();
                $('div#imgwrap').hide();
            }
        } else if ('www.24meinv.me' === currentHostname) {
            {
                $('div.gtps.fl').hide();
            }
        }

    } else {
        $('#injectaggregatBtn').val('聚合显示');
        $('#c_container').hide();

        if ('www.lesmao.com' === currentHostname) {
            $('#thread-pic').show();
            $('#thread-page').show();
        } else if ('www.umei.cc' === currentHostname) {
            $('.ImageBody').show();
        }
        else if ('www.meitulu.com' === currentHostname) {
            $('div.content').show();
            $('body > center').show();
        } else if ('www.17786.com' === currentHostname) {
            {
                $('div.img_box').show();
                $('div.wt-pagelist').show();
            }
            $('div#picBody').show();
            $('.articleV2Page').show();
        } else if ('www.nvshens.com' === currentHostname || 'm.nvshens.com' === currentHostname) {
            {
                $('div.ck-box-unit').show();
                $('div.photos').show();
                $('div#imgwrap').show();
            }
        } else if ('www.24meinv.me' === currentHostname) {
            {
                $('div.gtps.fl').show();
            }
        }
    }
}

//日志
function log(c) {
    if (false) {
        console.log(c);
    }
}

function err(c) {
    if (false) {
        console.error(c);
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
function collectPics(i, e, preUrl, limitPage, subfixUrl, currentHostname) {
    var id = e.setInterval(function () {
        if (e.$) {
            e.clearInterval(id);
            var breakPageLoop = false;
            log('limitPage::' + limitPage);
            for (i; i <= limitPage; i++) {
                //创建div去装各自
                e.$('#c_container').append('<div id="c_' + i + '"></div>');
                if (!breakPageLoop) {
                    var lock = true;
                    log(preUrl + i + subfixUrl);
                    obtainHtml(preUrl + i + subfixUrl, function (html, i) {

                        // log(html);
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(html, "text/html");
                        // log(preUrl + i + subfixUrl);
                        var imgObj;
                        if ('www.lesmao.com' === currentHostname) {
                            imgObj = $(doc).find('ul > li > img');
                        } else if ('www.umei.cc' === currentHostname) {
                            imgObj = $(doc).find('.ImageBody p img');
                            {//移除图片附属广告
                                $('div div div.ad-widget-imageplus-sticker').parent().parent().remove();
                            }
                        }
                        else if ('www.meitulu.com' === currentHostname) {
                            imgObj = $(doc).find('div.content > center  > img');
                            {//http://www.meitulu.com广告遮挡层
                                $("a[id^='__tg_ciw_a__']").remove();
                                $("a[id^='__qdd_ciw_a__']").remove();
                                $('iframe').remove();//移除广告等无必要元素
                            }
                        } else if ('www.17786.com' === currentHostname) {
                            imgObj = $(doc).find('img.IMG_show');
                            if (imgObj.length == 0) {
                                imgObj = $(doc).find('a#RightUrl img');
                            }
                        } else if ('www.nvshens.com' === currentHostname || 'm.nvshens.com' === currentHostname) {
                            imgObj = $(doc).find('ul#hgallery img');
                            if (imgObj.length == 0) {
                                imgObj = $(doc).find('div#imgwrap img');
                            }
                        } else if ('www.24meinv.me' === currentHostname) {
                            imgObj = $(doc).find('div.gtps.fl img');
                            $(imgObj).each(function (index) {
                                // log(index + ": " + $(this).prop('outerHTML'));
                                var imgSrc = $(this).attr('src').replace(/http:\/\/pic\.diercun\.com(.*?\/)m([\w.]+)$/img, "http://img.diercun.com$1$2");
                                $(this).attr('src', imgSrc);
                            });
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
            $(this).attr('label', 'sl');
            objContainer.append('<div>' + $(this).prop('outerHTML') + '</div>');
        }
    });
}

//获取网页
function obtainHtml(url, sucess, i) {
    var headers = parseHeaders("Accept:image/webp,image/*,*/*;q=0.8\n" +
        "Accept-Encoding:gzip, deflate, sdch\n" +
        "Accept-Language:zh-CN,zh;q=0.8\n" +
        "Referer:" + window.location.href + "\n" +
        "User-Agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
    );
    GM_xmlhttpRequest({
        method: 'GET',
        headers: headers,
        url: url,
        onload: function (response) {
            sucess(response.responseText, i);
        }
    });
}

function obtainBlob(url, sucess, i) {
    GM_xmlhttpRequest({
        method: 'GET',
        headers: {
            "Accept": "application/*"
        },
        url: url,
        responseType: 'blob',
        onload: function (response) {
            sucess(response, i);
        }
    });
}

function injectAggregationRef(currentHostname) {
    var injectComponent =
        '<input id="captureBtn" type="button" value="截图并下载"/>' +
        '<span>&nbsp;&nbsp;</span>' +
        '<input id="packageBtn" type="button" value="打包下载聚合图片"/>' +
        '<span>&nbsp;&nbsp;</span>' +
        '<input id="injectaggregatBtn" type="button" value="聚合显示"/>';
    if ('www.lesmao.com' === currentHostname) {
        if ($('.thread-tr')) {
            $('.thread-tr').after(injectComponent);
        }
        if ($('#vt')) {
            $('#vt').append(injectComponent);
        }
    } else if ('www.umei.cc' === currentHostname) {
        if ($('.hr10')) {//http://www.umei.cc/weimeitupian/oumeitupian/20043_2.htm
            $($('.hr10')[0]).after(injectComponent);
            $('iframe').remove();//移除广告等无必要元素
        }
    }
    else if ('www.meitulu.com' === currentHostname) {
        if ($('div.bk3')) {
            $('div.bk3').after(injectComponent);
            {//http://www.meitulu.com广告遮挡层
                $("a[id^='__tg_ciw_a__']").remove();
                $("a[id^='__qdd_ciw_a__']").remove();
                $('iframe').remove();//移除广告等无必要元素
            }
        }
    } else if ('www.17786.com' === currentHostname) {
        {
            $('div.tsmaincont-desc').after(injectComponent);
        }
        $('div.articleV2Desc').after(injectComponent);
    } else if ('www.nvshens.com' === currentHostname || 'm.nvshens.com' === currentHostname) {
        $('div[id^=mms]').remove();//移除广告等无必要元素
        {
            $('div#dinfo').after(injectComponent);
            $('div#ddinfo').after(injectComponent);
        }
    } else if ('www.24meinv.me' === currentHostname) {
        {
            $('div.hd1').after(injectComponent);
        }
    }
    $('#injectaggregatBtn').after('<div id="c_container"></div>');
}


function bindBtn(e, callback) {
    $('#injectaggregatBtn').bind('click', callback);
    $('#captureBtn').bind('click', function (e) {
        var imgList = $('img[label="sl"]');
        var length = imgList.length;
        $.each(imgList, function (index, value) {
            var imgSrc = $(value).attr('src');
            {
                if (blobCache[imgSrc]) {
                    length--;
                } else {
                    if (!imgSrc.startsWith('blob:')) {
                        obtainBlob(imgSrc, function (response) {
                            var responseHeaders = parseHeaders(response.responseHeaders);
                            var contentType = responseHeaders['Content-Type'];
                            if (!contentType) {
                                contentType = "image/png";
                            }
                            var blob = new Blob([response.response], {type: contentType});
                            blobCache[imgSrc] = blob;
                            length--;
                        });
                    }
                }
            }
        });
        var id = setInterval(function () {
            if (length == 0) {
                clearInterval(id);
                var length2 = imgList.length;
                $.each(imgList, function (index, value) {
                    var imgSrc = $(value).attr('src');
                    {
                        if (!imgSrc.startsWith('blob:')) {
                            if (blobCache[imgSrc]) {
                                var objectURL = URL.createObjectURL(blobCache[imgSrc]);
                                blobUrlCache[objectURL] = imgSrc;
                                $(value).attr('src', objectURL);
                                length2--;
                            }
                        } else {
                            length2--;
                        }
                    }
                });
                var id2 = setInterval(function () {
                    if (length2 == 0) {
                        clearInterval(id2);
                        domtoimage.toBlob($('#c_container').get(0))
                            .then(function (blob) {
                                saveAs(blob, "captureSL.png");
                            })
                            .catch(function (error) {
                                err('截图太大不能保存!');
                            });
                    }
                }, 100);

            }
        }, 100);
    });
    $('#packageBtn').bind('click', function (e) {
        packageAndDownload();
    });
}

//解析返回头
function parseHeaders(headStr) {
    var o = {};
    var myregexp = /^([^:]+):(.*)$/img;
    var match = /^([^:]+):(.*)$/img.exec(headStr);
    while (match != null) {
        o[match[1].trim()] = match[2].trim();
        match = myregexp.exec(headStr);
    }
    return o;
}