// ==UserScript==
// @name         美女图聚合展示by SeLang
// @namespace    http://cmsv1.findmd5.com/
// @version      4.01
// @description  目标是聚合网页美女图片，省去翻页烦恼。有需要聚合的网址请反馈。 QQ群号：455809302,点击链接加入群【油猴脚本私人定制】：https://jq.qq.com/?_wv=1027&k=45p9bea
// @author       selang
// @include       /https?\:\/\/www\.lsmpx\.com/
// @include       /https?\:\/\/www\.lsm\.me/
// @include       /https?\:\/\/www\.umei\.cc/
// @include       /https?\:\/\/www\.meitulu\.com/
// @include       /https?\:\/\/www\.17786\.com/
// @include       /https?\:\/\/www\.nvshens\.com/
// @include       /https?\:\/\/m\.nvshens\.com/
// @include       /https?\:\/\/www\.youtube\.com/
// @include       /https?\:\/\/www\.aitaotu\.com/
// @include       /https?\:\/\/www\.mzitu\.com/
// @include       /https?\:\/\/www\.beautylegmm\.com/
// @include       /https?\:\/\/www\.rosiyy\.com/
// @include       /https?\:\/\/www\.xgtaotu\.com/
// @include       /https?\:\/\/www\.xgtutu\.com/
// @include       /https?\:\/\/www\.youzi4\.cc/
// @include       /https?\:\/\/www\.xiumeim\.com/
// @include       /https?\:\/\/www\.xmeim\.com/
// @include       /https?\:\/\/www\.win4000\.com/
// @include       /https?\:\/\/www\.mm131\.com/
// @include       /https?\:\/\/www\.114tuku\.com/
// @include       /https?\:\/\/www\.192tt\.com/
// @include       /https?\:\/\/www\.192tb\.com/
// @include       /https?\:\/\/www\.meituri\.com/
// @include       /https?\:\/\/www\.xiuren\.org/
// @include       /https?\:\/\/www\.juemei\.com/
// @include       /https?\:\/\/www\.tuao81\.top/
// @include       /https?\:\/\/(www\.)?rosim\.cc/
// @require       https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/dexie/1.5.1/dexie.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/webtorrent/0.98.19/webtorrent.min.js
// @connect      *
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_getTab
// @grant        GM_getTabs
// @grant        GM_saveTab
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// ==/UserScript==

GM_addStyle(".sl-btn { border:1 !important; } .sl-c-pic { margin-top:6px } ");

//日志
function log() {
    if (false) {
        console.log.apply(this, arguments);
    }
};

function err() {
    if (true) {
        console.error.apply(this, arguments);
    }
}

function priorityLog() {
    console.log.apply(this, arguments);
}

var Alpha_Script = {
    obtainHtml: function (options) {
        options = options || {};
        if (!options.url || !options.method) {
            throw new Error("参数不合法");
        }
        GM_xmlhttpRequest(options);
    },
    parseHeaders: function (headStr) {
        var o = {};
        var myregexp = /^([^:]+):(.*)$/img;
        var match = /^([^:]+):(.*)$/img.exec(headStr);
        while (match != null) {
            o[match[1].trim()] = match[2].trim();
            match = myregexp.exec(headStr);
        }
        return o;
    },
    //获取参数
    getParam: function (dest, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = dest.match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    isArray: function (value) {
        return Object.prototype.toString.apply(value) === '[object Array]';
    }
};

(function () {
    'use strict';
    priorityLog('看到这里，你肯定是个老司机了。欢迎老司机进群：455809302交流。一起玩。');
    priorityLog('如果不是老司机，只要有创意也欢迎加入。点击链接加入群【油猴脚本私人级别定制】：https://jq.qq.com/?_wv=1027&k=460soLy。');
    priorityLog('已实现：', '蕾丝猫(http://www.lsmpx.com)', '优美(http://www.umei.cc)', '美图录(http://www.meitulu.com)', '美女86(http://www.17786.com)', '宅男女神(http://www.nvshens.com)', '爱套图(http://www.aitaotu.com)', '妹子图(http://www.mzitu.com)');
    priorityLog('\t\tBeautyleg腿模写真(http://www.beautylegmm.com)', '性感套图(http://www.xgtutu.com/)', '秀美眉(http://www.xmeim.com/)', '优姿美女（http://www.youzi4.cc/)', '美女图片(http://www.mm131.com)');
    priorityLog('\t\t美桌(http://www.win4000.com/)', '114tuku(http://www.114tuku.com/)', '美女图片(https://www.192tt.com/)');
    priorityLog('\t\t......等');
    priorityLog('未实现：');
    priorityLog('\t\t绝美网(https://www.juemei.com/)');

    function injectBtns() {

        var pageUrls = [];

        // var myHttps = "http://127.0.0.1/static/imageAggregation";
        var myHttps = "https://cmsv1.findmd5.com/static/imageAggregation";
        var iframeHtml = '<iframe id="injectIframe_imageAggregation"\n' +
            '    title="聚合图片嵌入框"\n' +
            '    style="height: 40px;width: 100%;background: white;overflow:hidden;border:none"\n' +
            '    src="' + myHttps + '/aggregation.html">\n' +
            '</iframe>\n';
        var injectComponent = iframeHtml;

        var domain = '';
        var hostName = window.location.hostname;
        var protocol = window.location.protocol;
        var startUrl = protocol + '//' + hostName + '/';
        var injectAggregationRef = null;
        var switchAggregationBtn = null;
        var collectPics = null;
        var aggregationOnline = false;
        var switchAggregationBtnTemplateFunc = function (aggregationDispayFunc, aggregationDispayNoneFunc) {
            aggregationDispayFunc();
            (function () {
                window.top.addEventListener("message", receiveMessage, false);
                var aggregationOnlineCheckId = setInterval(function () {
                    POST_2_IFRAME({
                        tag: 'online'
                    });
                    log('检查聚合iframe是否加载成功中....');
                }, 100);

                function receiveMessage(event) {
                    var dt = event.data;
                    var data = dt.data;
                    if (!dt.tag) {
                        return;
                    }
                    if ("聚合切换" == dt.tag) {
                        var aggregationBtnTxt = data.aggregationBtnTxt;
                        if (aggregationBtnTxt === '聚合显示') {
                            $('#c_container').show();
                            aggregationDispayNoneFunc();
                            $('#injectIframe_imageAggregation').css('height', '40px');
                        } else {
                            $('#c_container').hide();
                            aggregationDispayFunc();
                            $('#injectIframe_imageAggregation').css('width', data.iframeWidth);
                            $('#injectIframe_imageAggregation').css('height', data.iframeHeight);
                        }
                    } else if ("back_online" == dt.tag) {
                        clearInterval(aggregationOnlineCheckId);
                        log('聚合iframe加载成功');
                        aggregationOnline = true;
                    } else if ("heightChange" == dt.tag) {
                        $('#injectIframe_imageAggregation').css('width', data.iframeWidth);
                        $('#injectIframe_imageAggregation').css('height', data.iframeHeight);
                    }
                }


            })();

        };
        var collectPicsTemplateFunc = function (parseImgsFunc, imgStyleFunc) {
            var id = setInterval(function () {
                if ($) {
                    clearInterval(id);
                    var breakPageLoop = false;
                    var tempIntervalId = setInterval(function () {
                        if (aggregationOnline) {
                            clearInterval(tempIntervalId);
                            POST_2_IFRAME({
                                tag: '创建div去装各自',
                                data: {
                                    len: pageUrls.length
                                }
                            });
                            for (var i = 0, len = pageUrls.length; i < len; i++) {
                                //创建div去装各自
                                $('#c_container').append('<div id="c_' + i + '"></div>');
                                if (!breakPageLoop) {
                                    var pageUrl = startUrl + pageUrls[i];
                                    Alpha_Script.obtainHtml({
                                        url: pageUrl,
                                        headers: Alpha_Script.parseHeaders("Accept:image/webp,image/*,*/*;q=0.8\n" +
                                            "Accept-Encoding:gzip, deflate, sdch\n" +
                                            "Accept-Language:zh-CN,zh;q=0.8\n" +
                                            "Referer:" + window.location.href + "\n" +
                                            "User-Agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
                                        ),
                                        method: 'GET',
                                        onload: function () {
                                            var _i = i;
                                            var _pageUrl = pageUrl;
                                            return function (response) {
                                                log('response pageUrl:', _pageUrl);
                                                if (response && response.status && response.status >= 200 && response.status < 300) {
                                                    var html = response.responseText;
                                                    // log('html==>',html);
                                                    var parser = new DOMParser();
                                                    var doc = parser.parseFromString(html, "text/html");
                                                    var imgObj = parseImgsFunc(doc);
                                                    var imgContainerCssSelector = '#c_' + _i;
                                                    log(imgContainerCssSelector);
                                                    $(imgObj).each(function (index) {
                                                        log(index, ':', $(this).prop('outerHTML'));
                                                        if (imgStyleFunc) {
                                                            imgStyleFunc($(this)[0]);
                                                        } else {
                                                            $(this)[0].style = "width: 100%;height: 100%";
                                                        }
                                                        $(this).attr('label', 'sl');
                                                        var picNode = '<div class="sl-c-pic">' + $(this).prop('outerHTML') + '</div>';
                                                        downloadImg2Blob($(this).attr('src'), function (imgBlob) {
                                                            POST_2_IFRAME({
                                                                tag: '装各自',
                                                                data: {
                                                                    selector: imgContainerCssSelector,
                                                                    imgBlob: imgBlob
                                                                }
                                                            });
                                                        });
                                                        $(imgContainerCssSelector).append(picNode);
                                                    });
                                                }
                                            };
                                        }()
                                    });
                                } else {
                                    break;
                                }
                            }
                        }
                    }, 200);
                }
            }, 100);
        };
        var match = function () {
        };
        var mismatch = function () {
        };
        var meet = function (options) {
            options = options || {};
            options.domain = options.domain || domain;
            options.match = options.match || match;
            options.mismatch = options.mismatch || mismatch;
            log(options.domain);
            var matchDomain = false;
            if (Alpha_Script.isArray(options.domain)) {
                for (var i = 0; i < options.domain.length; i++) {
                    if (options.domain[i] === hostName) {
                        matchDomain = true;
                        break;
                    }
                }
            } else {
                matchDomain = options.domain === hostName || options.domain === '';
            }
            return matchDomain;
        };
        var removeAD = null;

        //热键
        function hotkeys() {
            // GM_registerMenuCommand("图片打包下载", packageAndDownload, "d");
            $(document).keydown(function (e) {
                if (e.ctrlKey && e.shiftKey) {
                    if (e.which == 76) {//L
                        log("触发快捷键");
                    }
                }
            });
        }

        return {
            injectComponent: function (i) {
                if (i) injectComponent = i;
                return this;
            },
            domain: function (d) {
                if (d) domain = d;
                return this;
            },
            removeAD: function (fun) {
                if (fun) removeAD = fun;
                return this;
            },
            match: function (fun) {
                if (fun) match = fun;
                return this;
            },
            mismatch: function (fun) {
                if (fun) mismatch = fun;
                return this;
            },
            injectAggregationRef: function (fun) {
                if (fun) injectAggregationRef = fun;
                return this;
            },
            switchAggregationBtn: function (aggregationDispayFunc, aggregationDispayNoneFunc) {
                switchAggregationBtn = function () {
                    switchAggregationBtnTemplateFunc(aggregationDispayFunc, aggregationDispayNoneFunc);
                };
                return this;
            },
            collectPics: function (parseImgsFunc, imgStyleFunc) {
                collectPics = function () {
                    collectPicsTemplateFunc(parseImgsFunc, imgStyleFunc);
                }
                return this;
            },
            send2Iframe: function () {

            }
            ,
            start: function () {
                //1、匹配当前hostName
                //2、注入操作界面
                //3、聚合多页图片
                //4、显示
                var matchDomain = meet();
                if (matchDomain) {
                    if (removeAD) {
                        removeAD();
                    }
                    if (injectAggregationRef) {
                        injectAggregationRef.apply(this, [injectComponent, pageUrls]);
                        $('#injectaggregatBtn').after('<div id="c_container"></div>');
                        if (switchAggregationBtn) {
                            switchAggregationBtn();
                            if (collectPics) {
                                collectPics();
                                hotkeys();
                            }
                        }
                    }
                } else {

                }
            }
        }
    }

    injectBtns().domain(['www.lsmpx.com', 'www.lsm.me']).switchAggregationBtn(function () {
        $('#thread-pic').hide();
        $('#thread-page').hide();
    }, function () {
        $('#thread-pic').show();
        $('#thread-page').show();
    }).injectAggregationRef(function (injectComponent, pageUrls) {
        var match = window.location.pathname.match(/^\/(thread-\d+-)(\d+)(-\d+\.html)$/im);
        if (match !== null) {
            {
                var totalPageCnt = 5;
                var partPreUrl = match[1];
                var suffixUrl = match[3];

                for (var i = 1; i <= totalPageCnt; i++) {
                    var pageUrl = partPreUrl + i + suffixUrl;
                    log('push pageUrl:', pageUrl);
                    pageUrls.push(pageUrl);
                }
            }
            $('.thread-tr').after(injectComponent);
        }
    }).collectPics(function (doc) {
        return $(doc).find('ul > li > img');
    }, function (imgE) {
        imgE.style = "width: 100%;height: 100%";
    }).start();

    injectBtns().domain('www.umei.cc').switchAggregationBtn(function () {
        $('.ImageBody').hide();
    }, function () {
        $('.ImageBody').show();
    }).injectAggregationRef(function (injectComponent, pageUrls) {
        var currentPathname = window.location.pathname;
        var match = currentPathname.match(/^\/(\w+\/\w+(?:\/\w+)?\/)(\d+)(?:_\d+)?\.htm$/im);
        if (match !== null) {
            {
                var totalPageCnt = 1;
                var partPreUrl = match[1];
                var pageId = match[2];
                var suffixUrl = '.htm';
                var limitPageStr = $('.NewPages li a').html();
                var limitPageMatch = limitPageStr.match(/共(\d+)页/m);
                if (limitPageMatch != null) {
                    totalPageCnt = parseInt(limitPageMatch[1]);
                    log('totalPageCnt', totalPageCnt);
                }
                for (var i = 1; i <= totalPageCnt; i++) {
                    var pageUrl = '';
                    if (i == 1) {
                        pageUrl = partPreUrl + pageId + suffixUrl;
                    } else {
                        pageUrl = partPreUrl + pageId + '_' + i + suffixUrl;
                    }
                    log('push pageUrl:', pageUrl);
                    pageUrls.push(pageUrl);
                }
            }
            $($('.hr10')[0]).after(injectComponent);
        }
    }).collectPics(function (doc) {
        return $(doc).find('.ImageBody p img');
    }, function (imgE) {
        imgE.style = "width: 100%;height: 100%";
    }).start();

    injectBtns().domain('www.meitulu.com').removeAD(function () {
        $("a[id^='__tg_ciw_a__']").remove();
        $("a[id^='__qdd_ciw_a__']").remove();
        removeFrameExcludeInjectIframe_imageAggregationFrame();//移除广告等无必要元素
    }).switchAggregationBtn(function () {
        $('div.content').hide();
        $('body > center').hide();
    }, function () {
        $('div.content').show();
        $('body > center').show();
    }).injectAggregationRef(function (injectComponent, pageUrls) {
        var currentPathname = window.location.pathname;
        var match = currentPathname.match(/^\/(item\/)(\d+)(?:_\d+)?\.html$/im);
        if (match !== null) {
            {
                var totalPageCnt = 1;
                var partPreUrl = match[1];
                var pageId = match[2];
                var suffixUrl = '.html';
                var limitPageStr = $('a.a1:last').prev().html();
                totalPageCnt = parseInt(limitPageStr);
                log('totalPageCnt', totalPageCnt);
                for (var i = 1; i <= totalPageCnt; i++) {
                    var pageUrl = '';
                    if (i == 1) {
                        pageUrl = partPreUrl + pageId + suffixUrl;
                    } else {
                        pageUrl = partPreUrl + pageId + '_' + i + suffixUrl;
                    }
                    log('push pageUrl:', pageUrl);
                    pageUrls.push(pageUrl);
                }
            }
            $('div.bk3').after(injectComponent);
        }
    }).collectPics(function (doc) {
        return $(doc).find('div.content > center  > img');
    }, function (imgE) {
        imgE.style = "width: 100%;height: 100%";
    }).start();

    injectBtns().domain('www.17786.com').switchAggregationBtn(function () {
        $('div.img_box').hide();
        $('div.wt-pagelist').hide();
        $('div#picBody').hide();
        $('.articleV2Page').hide();
    }, function () {
        $('div.img_box').show();
        $('div.wt-pagelist').show();
        $('div#picBody').show();
        $('.articleV2Page').show();
    }).injectAggregationRef(function (injectComponent, pageUrls) {
        var currentPathname = window.location.pathname;
        var match = currentPathname.match(/^\/(\d+)(?:_\d+)?\.html$/im); //http://www.17786.com/7745_1.html
        if (match !== null) {
            {
                var totalPageCnt = 1;
                var partPreUrl = '';
                var pageId = match[1];
                var suffixUrl = '.html';
                var limitPageStr = $('h2').html();
                var limitPageMatch = limitPageStr.match(/\(\d+\/(\d+)\)/im);
                if (limitPageMatch != null) {
                    totalPageCnt = parseInt(limitPageMatch[1]);
                    log('totalPageCnt', totalPageCnt);
                }
                for (var i = 1; i <= totalPageCnt; i++) {
                    var pageUrl = partPreUrl + pageId + '_' + i + suffixUrl;
                    log('push pageUrl:', pageUrl);
                    pageUrls.push(pageUrl);
                }
            }
            $('div.tsmaincont-desc').after(injectComponent);
        } else {
            var match = currentPathname.match(/^\/((?:\w+\/)+)(\d+)(?:_\d+)?\.html$/im);//http://www.17786.com/beautiful/feizhuliutupian/44569.html
            if (match != null) {
                {
                    var totalPageCnt = 50;
                    var partPreUrl = match[1];
                    var pageId = match[2];
                    var suffixUrl = '.html';
                    log('totalPageCnt', totalPageCnt);
                    for (var i = 1; i <= totalPageCnt; i++) {
                        var pageUrl = '';
                        if (i == 1) {
                            pageUrl = partPreUrl + pageId + suffixUrl;
                        } else {
                            pageUrl = partPreUrl + pageId + '_' + i + suffixUrl;
                        }
                        log('push pageUrl:', pageUrl);
                        pageUrls.push(pageUrl);
                    }
                }

                $('div.articleV2Desc').after(injectComponent);
            }
        }
    }).collectPics(function (doc) {
        var imgObj = $(doc).find('img.IMG_show');
        if (imgObj.length == 0) {
            imgObj = $(doc).find('a#RightUrl img');
        }
        return imgObj;
    }, function (imgE) {
        imgE.style = "width: 100%;height: 100%";
    }).start();


    injectBtns().domain('www.nvshens.com').removeAD(function () {
        $('div[id^=mms]').remove();//移除广告等无必要元素
    }).switchAggregationBtn(function () {
        $('div.ck-box-unit').hide();
        $('div.photos').hide();
        $('div#imgwrap').hide();
    }, function () {
        $('div.ck-box-unit').show();
        $('div.photos').show();
        $('div#imgwrap').show();
    }).injectAggregationRef(function (injectComponent, pageUrls) {
        var currentPathname = window.location.pathname;
        var match = currentPathname.match(/^\/(g\/\d+)\/?(?:\d+\.html)?$/im);//https://www.nvshens.com/g/26489/1.html
        if (match !== null) {
            {
                var totalPageCnt = 1;
                var partPreUrl = match[1];
                var pageId = '/';
                var suffixUrl = '.html';
                var limitPageStr = $('div#dinfo span[style="color: #DB0909"]').html();
                var limitPageMatch = limitPageStr.match(/(\d+)张照片/im);
                if (limitPageMatch != null) {
                    var totalPics = parseInt(limitPageMatch[1]);
                    var number = totalPics % 3;
                    totalPageCnt = Math.floor(totalPics / 3);
                    if (number > 0) {
                        totalPageCnt = totalPageCnt + 1;
                    }
                    log('totalPageCnt', totalPageCnt);
                }
                for (var i = 1; i <= totalPageCnt; i++) {
                    var pageUrl = partPreUrl + pageId + i + suffixUrl;
                    log('push pageUrl:', pageUrl);
                    pageUrls.push(pageUrl);
                }
            }
            $('div#dinfo').after(injectComponent);
        }
    }).collectPics(function (doc) {
        return $(doc).find('ul#hgallery img');
    }, function (imgE) {
        imgE.style = "width: 100%;height: 100%";
    }).start();

    injectBtns().domain('www.aitaotu.com').removeAD(function () {
        setInterval(function () {
            $('#lgVshow').remove();
            $('div.gg1002').remove();
        }, 100);
    }).switchAggregationBtn(function () {
        $('div.big-pic').hide();
        $('div.pages').hide();
    }, function () {
        $('div.big-pic').show();
        $('div.pages').show();
    }).injectAggregationRef(function (injectComponent, pageUrls) {
        var currentPathname = window.location.pathname;
        var match = currentPathname.match(/\/(.+?\/)(\d+)(?:_\d+)?\.html/m);//http://www.aitaotu.com/weimei/36129.html
        if (match !== null) {
            {
                var totalPageCnt = 1;
                var partPreUrl = match[1];
                var pageId = match[2];
                var suffixUrl = '.html';
                var limitPageStr = $('div.photo > div.pages > ul > li:last-child > a').attr('href');
                var limitPageMatch = limitPageStr.match(/\/\w+\/(\d+)(?:_(\d+))?\.html/m);
                if (limitPageMatch != null) {
                    totalPageCnt = parseInt(limitPageMatch[2]);
                    log('totalPageCnt', totalPageCnt);
                }
                for (var i = 1; i <= totalPageCnt; i++) {
                    var pageUrl = partPreUrl + pageId + '_' + i + suffixUrl;
                    log('push pageUrl:', pageUrl);
                    pageUrls.push(pageUrl);
                }
            }
            $('div.tsmaincont-desc').after(injectComponent);
        }
    }).collectPics(function (doc) {
        return $(doc).find('#big-pic > p > a  > img');
    }, function (imgE) {
        imgE.style = "width: 100%;height: 100%";
    }).start();


    injectBtns().domain('www.mzitu.com').removeAD(function () {

    }).switchAggregationBtn(function () {
        $('div.main-image').hide();
        $('div.pagenavi').hide();
    }, function () {
        $('div.main-image').show();
        $('div.pagenavi').show();
    }).injectAggregationRef(function (injectComponent, pageUrls) {
        var currentPathname = window.location.pathname;
        var match = currentPathname.match(/\/(\d+)(?:\/\d+)?/m);//http://www.mzitu.com/139218
        if (match !== null) {
            {
                var totalPageCnt = 1;
                var partPreUrl = '';
                var pageId = match[1];
                var suffixUrl = '';
                var limitPageStr = $('div.pagenavi >a').last().prev().find('span').text().trim();
                if (limitPageStr) {
                    totalPageCnt = parseInt(limitPageStr);
                    log('totalPageCnt', totalPageCnt);
                }
                for (var i = 1; i <= totalPageCnt; i++) {
                    var pageUrl = partPreUrl + pageId + '/' + i + suffixUrl;
                    log('push pageUrl:', pageUrl);
                    pageUrls.push(pageUrl);
                }
            }
            $('div.main-meta').after(injectComponent);
        }
    }).collectPics(function (doc) {
        return $(doc).find('div.main-image > p > a > img');
    }, function (imgE) {
        imgE.style = "width: 100%;height: 100%";
    }).start();

    injectBtns().domain('www.beautylegmm.com').removeAD(function () {
        setInterval(function () {
            removeFrameExcludeInjectIframe_imageAggregationFrame();
        }, 100);
    }).switchAggregationBtn(function () {
        $('div.post').hide();
        $('div.archives_page_bar').hide();
    }, function () {
        $('div.post').show();
        $('div.archives_page_bar').show();
    }).injectAggregationRef(function (injectComponent, pageUrls) {
        var currentPathname = window.location.pathname;
        var match = currentPathname.match(/^\/(\w+\/beautyleg-\d+\.html)/im);//http://www.beautylegmm.com/Vanessa/beautyleg-1619.html
        if (match !== null) {
            {
                var totalPageCnt = 1;
                var partPreUrl = '';
                var pageId = match[1];
                var suffixUrl = '';
                var limitPageStr = $('#contents_post > div.post > div > a:not(.next)').last().text().trim();
                if (limitPageStr) {
                    totalPageCnt = parseInt(limitPageStr);
                    log('totalPageCnt', totalPageCnt);
                }
                for (var i = 1; i <= totalPageCnt; i++) {
                    var pageUrl = partPreUrl + pageId + '?page=' + i + suffixUrl;
                    log('push pageUrl:', pageUrl);
                    pageUrls.push(pageUrl);
                }
            }
            $('div.post_title').after(injectComponent);
        }
    }).collectPics(function (doc) {
        return $(doc).find('#contents_post > div.post > a  > img');
    }, function (imgE) {
        imgE.style = "width: 100%;height: 100%";
    }).start();

    injectBtns().domain(['www.xgtaotu.com', 'www.xgtutu.com']).removeAD(function () {
        $('#divStayTopright').remove();
    }).switchAggregationBtn(function () {
        $('div.page').hide();
    }, function () {
        $('div.page').show();
    }).injectAggregationRef(function (injectComponent, pageUrls) {
        var currentPathname = window.location.pathname;
        var match = currentPathname.match(/^\/(rentihtml\/zhaopian\/\d+\/\d+)/im);//http://www.xgtutu.com/rentihtml/zhaopian/20200314/82031.html
        if (match !== null) {
            {
                var totalPageCnt = 1;
                var partPreUrl = '';
                var pageId = match[1];
                var suffixUrl = '.html';
                var limitPageStr = $('p b a').eq(-2).text().replace(/[\]\[]/img, "").trim();
                if (limitPageStr) {
                    totalPageCnt = parseInt(limitPageStr);
                    log('totalPageCnt', totalPageCnt);
                }
                for (var i = 1; i <= totalPageCnt; i++) {
                    var pageUrl = '';
                    if (i == 1) {
                        pageUrl = partPreUrl + pageId + suffixUrl;
                    } else {
                        pageUrl = partPreUrl + pageId + '_' + i + suffixUrl;
                    }

                    log('push pageUrl:', pageUrl);
                    pageUrls.push(pageUrl);
                }
            }
            $('div h1').after(injectComponent);
        }
    }).collectPics(function (doc) {
        return $(doc).find('p a > img');
    }, function (imgE) {
        imgE.style = "max-width: 100%;";
    }).start();

    injectBtns().domain('www.youzi4.cc').removeAD(function () {

    }).switchAggregationBtn(function () {
        $('#picBody').hide();
        $('div.page-tag').hide();
    }, function () {
        $('#picBody').show();
        $('div.page-tag').show();
    }).injectAggregationRef(function (injectComponent, pageUrls) {
        var currentPathname = window.location.pathname;
        var match = currentPathname.match(/^\/(\w+.*\/\d+)/im);//http://www.youzi4.cc/mm/19890/19890_1.html
        if (match !== null) {
            {
                var totalPageCnt = 1;
                var partPreUrl = '';
                var pageId = match[1];
                var suffixUrl = '.html';
                var limitPageStr = $('div.page-tag> ul > div > div > a ').eq(-2).text().trim();
                if (limitPageStr) {
                    totalPageCnt = parseInt(limitPageStr);
                    log('totalPageCnt', totalPageCnt);
                }
                for (var i = 1; i <= totalPageCnt; i++) {
                    var pageUrl = '';
                    if (i == 1) {
                        pageUrl = partPreUrl + pageId + suffixUrl;
                    } else {
                        pageUrl = partPreUrl + pageId + '_' + i + suffixUrl;
                    }

                    log('push pageUrl:', pageUrl);
                    pageUrls.push(pageUrl);
                }
            }
            $('div.articleV4Desc').after(injectComponent);
        }
    }).collectPics(function (doc) {
        return $(doc).find('#picBody p a img');
    }, function (imgE) {
        imgE.style = "max-width: 100%;";
    }).start();

    injectBtns().domain(['www.xiumeim.com', 'www.xmeim.com']).removeAD(function () {

    }).switchAggregationBtn(function () {
        $('div.gallary_wrap').hide();
    }, function () {
        $('div.gallary_wrap').show();
    }).injectAggregationRef(function (injectComponent, pageUrls) {
        var currentPathname = window.location.pathname;
        var match = currentPathname.match(/^\/(photos\/\w+-\d+)/im);//http://www.xiumeim.com/photos/LUGirls-190942.html
        if (match !== null) {
            {
                var totalPageCnt = 1;
                var partPreUrl = '';
                var pageId = match[1];
                var suffixUrl = '.html';
                var limitPageStr = $('div.paginator > span.count').text().trim();
                var limitPageMatch = limitPageStr.match(/\(共(\d+)页\)/m);
                if (limitPageMatch != null) {
                    totalPageCnt = parseInt(limitPageMatch[1]);
                    log('totalPageCnt', totalPageCnt);
                }
                for (var i = 1; i <= totalPageCnt; i++) {
                    var pageUrl = '';
                    if (i == 1) {
                        pageUrl = partPreUrl + pageId + suffixUrl;
                    } else {
                        pageUrl = partPreUrl + pageId + '-' + i + suffixUrl;
                    }

                    log('push pageUrl:', pageUrl);
                    pageUrls.push(pageUrl);
                }
            }
            $('div.album_desc div.inline').after(injectComponent);
        }
    }).collectPics(function (doc) {
        return $(doc).find('table > tbody > tr > td > img');
    }, function (imgE) {
        imgE.style = "max-width: 100%;";
    }).start();

    injectBtns().domain('www.mm131.com').switchAggregationBtn(function () {
        $('.content-pic').hide();
        $('.content-page').hide();
    }, function () {
        $('.content-pic').show();
        $('.content-page').show();
    }).injectAggregationRef(function (injectComponent, pageUrls) {
        var currentPathname = window.location.pathname;
        var match = currentPathname.match(/^\/(\w+\/)(\d+)(?:_\d+)?\.html$/im);
        if (match !== null) {
            {
                var totalPageCnt = 1;
                var partPreUrl = match[1];
                var pageId = match[2];
                var suffixUrl = '.html';
                var limitPageStr = $('span.page-ch:nth-child(1)').text();
                var limitPageMatch = limitPageStr.match(/共(\d+)页/m);
                if (limitPageMatch != null) {
                    totalPageCnt = parseInt(limitPageMatch[1]);
                    log('totalPageCnt', totalPageCnt);
                }
                for (var i = 1; i <= totalPageCnt; i++) {
                    var pageUrl = '';
                    if (i == 1) {
                        pageUrl = partPreUrl + pageId + suffixUrl;
                    } else {
                        pageUrl = partPreUrl + pageId + '_' + i + suffixUrl;
                    }
                    log('push pageUrl:', pageUrl);
                    pageUrls.push(pageUrl);
                }
            }
            $('div.content-msg').after(injectComponent);
        }
    }).collectPics(function (doc) {
        return $(doc).find('div.content-pic a img');
    }, function (imgE) {
        imgE.style = "width: 100%;height: 100%";
    }).start();


    injectBtns().domain('www.win4000.com').removeAD(function () {
        setInterval(function () {
            removeFrameExcludeInjectIframe_imageAggregationFrame();
        }, 100);
    }).switchAggregationBtn(function () {
        $('div.pic-meinv').hide();
    }, function () {
        $('div.pic-meinv').show();
    }).injectAggregationRef(function (injectComponent, pageUrls) {
        var currentPathname = window.location.pathname;
        var match = currentPathname.match(/\/(\w+?\d+)(?:_\d+)?/m);
        if (match !== null) {
            {
                var totalPageCnt = 1;
                var partPreUrl = match[1];
                var pageId = '';
                var suffixUrl = '.html';
                var limitPageStr = $('div.ptitle').text();
                var limitPageMatch = limitPageStr.match(/（\d+\/(\d+)）/m);
                if (limitPageMatch != null) {
                    totalPageCnt = parseInt(limitPageMatch[1]);
                    log('totalPageCnt', totalPageCnt);
                }
                for (var i = 1; i <= totalPageCnt; i++) {
                    var pageUrl = partPreUrl + pageId + '_' + i + suffixUrl;
                    log('push pageUrl:', pageUrl);
                    pageUrls.push(pageUrl);
                }
            }
            $('div.ptitle').after(injectComponent);
        }
    }).collectPics(function (doc) {
        return $(doc).find('div.pic-meinv a  img');
    }, function (imgE) {
        imgE.style = "width: 100%;height: 100%";
        var src = $(imgE).attr('url');
        if (src) {
            $(imgE).attr('src', src);
        }
    }).start();

    injectBtns().domain('www.114tuku.com').removeAD(function () {
        setInterval(function () {
            removeFrameExcludeInjectIframe_imageAggregationFrame();
            $('div[baidu_imageplus_sensitive_judge="true"]').remove();
        }, 100);
    }).switchAggregationBtn(function () {
        $('#picBody').hide();
        $('#pages').hide();
    }, function () {
        $('#picBody').show();
        $('#pages').show();
    }).injectAggregationRef(function (injectComponent, pageUrls) {
        var currentPathname = window.location.pathname;
        var match = currentPathname.match(/\/(\w+?p)\d+\//m);
        if (match !== null) {
            if ($('div.content_body a img').length > 0) {
                {
                    var totalPageCnt = 1;
                    var partPreUrl = match[1];
                    var pageId = '';
                    var suffixUrl = '/';
                    var limitPageStr = $('#pages > a:last-child').prev().text();
                    if (limitPageStr) {
                        totalPageCnt = parseInt(limitPageStr);
                        log('totalPageCnt', totalPageCnt);
                    }
                    for (var i = 1; i <= totalPageCnt; i++) {
                        var pageUrl = partPreUrl + pageId + i + suffixUrl;
                        log('push pageUrl:', pageUrl);
                        pageUrls.push(pageUrl);
                    }
                }
                $('div.tags').after(injectComponent);
            }
        }
    }).collectPics(function (doc) {
        return $(doc).find('div.content_body a img');
    }, function (imgE) {
        imgE.style = "width: 100%;";
    }).start();

    injectBtns().domain(['www.192tt.com', 'www.192tb.com']).removeAD(function () {
        setInterval(function () {
            removeFrameExcludeInjectIframe_imageAggregationFrame();
            $('div[class^=ad]').remove();
        }, 100);
    }).switchAggregationBtn(function () {
        $('#p').hide();
    }, function () {
        $('#p').show();
    }).injectAggregationRef(function (injectComponent, pageUrls) {
        var currentPathname = window.location.pathname;
        var match = currentPathname.match(/\/(\w+(?:\/\w+)?\/\w+?)(?:_\d+)?\.html/m);//https://www.192tt.com/gq/ugirls/ugu349_2.html,https://www.192tt.com/meitu/81896.html
        if (match !== null) {
            {
                var totalPageCnt = 1;
                var partPreUrl = match[1];
                var pageId = '';
                var suffixUrl = '.html';
                var limitPageStr = $('h1').text();
                var limitPageMatch = limitPageStr.match(/\(\d+\/(\d+)\)/m);
                if (limitPageMatch != null) {
                    totalPageCnt = parseInt(limitPageMatch[1]);
                    log('totalPageCnt', totalPageCnt);
                }
                for (var i = 1; i <= totalPageCnt; i++) {
                    var pageUrl = '';
                    if (i == 1) {
                        pageUrl = partPreUrl + pageId + suffixUrl;
                    } else {
                        pageUrl = partPreUrl + pageId + '_' + i + suffixUrl;
                    }
                    log('push pageUrl:', pageUrl);
                    pageUrls.push(pageUrl);
                }
            }
            $('div.pictopline').after(injectComponent);
        }
    }).collectPics(function (doc) {
        return $(doc).find('#p > center   img');
    }, function (imgE) {
        imgE.style = "width: 100%;";
        var src = $(imgE).attr('lazysrc');
        if (src) {
            $(imgE).removeAttr('lazysrc');
            $(imgE).attr('src', src);
        }
    }).start();

    injectBtns().domain('www.meituri.com').removeAD(function () {
        setInterval(function () {
            removeFrameExcludeInjectIframe_imageAggregationFrame();
            $('div.weixin').remove();
            $('div[id^=__jclm_]').remove();
            $('center>a').parent().remove();
        }, 200);
    }).switchAggregationBtn(function () {
        $('#pages').hide();
        $('body > div.content').hide();
    }, function () {
        $('#pages').show();
        $('body > div.content').show();
    }).injectAggregationRef(function (injectComponent, pageUrls) {
        var currentPathname = window.location.pathname;
        var match = currentPathname.match(/^\/(a\/\d+\/)(\d+\.html)?/im);
        if (match !== null) {
            {
                var totalPageCnt = 1;
                var partPreUrl = match[1];
                var pageId = '';
                var suffixUrl = '';
                var limitPageStr = '';
                var text = $('#pages > a').last().text();
                if ('下一页' == text) {
                    limitPageStr = $('#pages > a').last().prev().text();
                }
                if (limitPageStr != '') {
                    totalPageCnt = parseInt(limitPageStr);
                    log('totalPageCnt', totalPageCnt);
                }
                for (var i = 1; i <= totalPageCnt; i++) {
                    var pageUrl = '';
                    if (i == 1) {
                        pageUrl = partPreUrl;
                    } else {
                        pageUrl = partPreUrl + pageId + suffixUrl + i + '.html';
                    }
                    log('push pageUrl:', pageUrl);
                    pageUrls.push(pageUrl);
                }


            }
            $('div.tuji').append(injectComponent);
        }
    }).collectPics(function (doc) {
        return $(doc).find('div.content > img');
    }).start();

    injectBtns().domain('www.xiuren.org').removeAD(function () {
        setInterval(function () {
            removeFrameExcludeInjectIframe_imageAggregationFrame();
        }, 100);
    }).switchAggregationBtn(function () {
        $('div.post').hide();
    }, function () {
        $('div.post').show();
    }).injectAggregationRef(function (injectComponent, pageUrls) {
        var currentPathname = window.location.pathname;
        var match = currentPathname.match(/^\/([\w-]+\.html)\b/im);
        if (match !== null) {
            {
                pageUrls.push(window.location.pathname.substr(1));
            }
            $('#title').after(injectComponent);
        }
    }).collectPics(function (doc) {
        var clone = $(doc).find('div.post span > a').clone();
        return $(clone).find('img');
    }, function (imgE) {
        var src = $(imgE).parent().attr('href');
        $(imgE).attr('src', src);
        imgE.style = "width: 100%;height: 100%";
    }).start();

    injectBtns().domain('www.tuao81.top').removeAD(function () {
        setInterval(function () {
            removeFrameExcludeInjectIframe_imageAggregationFrame();
            $('#v_ads > img').parent().parent().remove();
        }, 100);
    }).switchAggregationBtn(function () {
        $('div.entry').hide();
    }, function () {
        $('div.entry').show();
    }).injectAggregationRef(function (injectComponent, pageUrls) {
        var currentPathname = window.location.pathname;
        var match = currentPathname.match(/\/(post\/\d+.html)\b/i);
        if (match !== null) {
            {
                var totalPageCnt = 1;
                var partPreUrl = match[1];
                var pageId = '';
                var suffixUrl = '';
                var limitPageStr = '';
                var text = $('#dm-fy li').last().text();
                if ('下一頁' == text) {
                    limitPageStr = $('#dm-fy li').last().prev().text();
                }
                if (limitPageStr != '') {
                    totalPageCnt = parseInt(limitPageStr);
                    log('totalPageCnt', totalPageCnt);
                }
                for (var i = 1; i <= totalPageCnt; i++) {
                    var pageUrl = partPreUrl + pageId + suffixUrl + '?page=' + i;
                    log('push pageUrl:', pageUrl);
                    pageUrls.push(pageUrl);
                }
            }
            $('div.postmeta').after(injectComponent);
        }
    }).collectPics(function (doc) {
        return $(doc).find('div.entry > p > a > img');
    }).start();

    injectBtns().domain(['rosim.cc', 'www.rosim.cc']).removeAD(function () {
        setInterval(function () {
            removeFrameExcludeInjectIframe_imageAggregationFrame();
        }, 100);
    }).switchAggregationBtn(function () {
        $('div.container>h4').parent().find('div.col-xs-12:eq(2)').hide();
    }, function () {
        $('div.container>h4').parent().find('div.col-xs-12:eq(2)').show();
    }).injectAggregationRef(function (injectComponent, pageUrls) {
        var currentPathname = window.location.pathname;
        var match = currentPathname.match(/^\/(item-detail-\d+)(?:-\d+)?.html/im);
        if (match !== null) {
            {
                var totalPageCnt = 1;
                var partPreUrl = match[1];
                var pageId = '';
                var suffixUrl = '';
                var limitPageStr = $('ul.pagination > li').last().find('a').attr('name');
                if (limitPageStr != '') {
                    totalPageCnt = parseInt(limitPageStr);
                    log('totalPageCnt', totalPageCnt);
                }
                for (var i = 1; i <= totalPageCnt; i++) {
                    var pageUrl = partPreUrl + pageId + suffixUrl + '-' + i + '.html';
                    log('push pageUrl:', pageUrl);
                    pageUrls.push(pageUrl);
                }
            }
            $('div.container>h4').next().after(injectComponent);
        }
    }).collectPics(function (doc) {
        return $(doc).find('div.col-xs-12> img.img-responsive ');
    }).start();

    if (false && 'www.youtube.com' === window.location.hostname) {
        var vId = "";
        var id = setInterval(function () {
            $('#player-unavailable').not('.hid').addClass('hid');
            var curVId = Alpha_Script.getParam(dest, 'v');
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

function POST_2_IFRAME(data) {
    var postMsg = data;
    if (typeof data == 'object') {
        //postMsg= JSON.stringify(data);
    }
    window.top.document.getElementById("injectIframe_imageAggregation").contentWindow.postMessage(postMsg, "*");
};


function downloadImg2Blob(imgSrc, callBack) {
    Alpha_Script.obtainHtml({
        url: imgSrc,
        method: 'GET',
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
            // "Accept-Encoding": "gzip, deflate, sdch",
            // "Accept-Language": "zh-CN,zh;q=0.8",
            "Referer": window.location.href,
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
        },
        responseType: 'blob',
        onload: function (response) {
            var responseHeaders = Alpha_Script.parseHeaders(response.responseHeaders);
            var contentType = responseHeaders['Content-Type'];
            if (!contentType) {
                contentType = "image/png";
            }
            var blob = new Blob([response.response], {type: contentType});
            callBack(blob);
        }
    });
}

function removeFrameExcludeInjectIframe_imageAggregationFrame() {
    $('iframe').filter(function (index, e) {
        var frameId = $(e).attr("id");
        return 'injectIframe_imageAggregation' != frameId;
    }).remove();
}