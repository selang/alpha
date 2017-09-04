// ==UserScript==
// @name         ink361集成组件
// @namespace    https://www.44bz.com/
// @version      0.4
// @description  为ink361镜像服务的组件!
// @author       David
// @include      /https?:\/\/ink361\.com/
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-body
// ==/UserScript==

(function () {
    'use strict';
    if(typeof unsafeWindow.THRB == "undefined") {
        var script =  document.createElement("script");
        script.src="http://119.23.210.38:9090/js/loadMore.js";
        script.type="text/javascript";
        document.body.appendChild(script);
    }
    var urlParams = getUrlParams();
    if (urlParams.hasOwnProperty("thrb_mirror") && urlParams.hasOwnProperty("thrb_mirror_deadline") && urlParams.hasOwnProperty("thrb_mirror_id")) {
        var thrb_mirror = getUrlParam("thrb_mirror");
        var thrb_mirror_deadline = getUrlParam("thrb_mirror_deadline");
        var thrb_mirror_id = getUrlParam("thrb_mirror_id");
        if ('open' == thrb_mirror) {

        } else if ('start' == thrb_mirror) {

        } else {
        }

    }

    {
        var id = setInterval(function () {
            var photoMetas = $('div.photo-meta');
            $.each($(photoMetas), function (index, value) {

                var parent = $(value).parent();
                var dataSrc = parent.find("div.img").attr('data-src');
                {//移除视频
                    var videoE = $(parent).find("span.icon-video");
                    if (videoE.length > 0) {
                        log('发现视频，移除');
                        $(parent).parent().remove();
                    }else {
                        {//加下载
                            var _downloads = $(value).find('a.user._download');
                            if (_downloads.length == 0) {

                                if (dataSrc) {
                                    var regExp = /\.com\/.*?\/([\w]+\.jpg)/im;
                                    var match = regExp.exec(dataSrc);
                                    var imgName = "";
                                    if (match != null) {
                                        imgName = match[1];
                                        dataSrc = dataSrc.replace(regExp, ".com/e35/$1");
                                        log(dataSrc);
                                        $(value).find('a.user').after("<a download=\"" + imgName + "\" class=\"user _download\" style=\"float: right;\" href=\"" + dataSrc + "\">下载</a>");
                                    } else {

                                    }
                                }

                            }
                        }
                    }
                }
                {//移除队列旋转图标
                    parent.find("a.photolink.queued").removeClass("queued");
                }

            });
        }, 100);
    }
    {
        var id = setInterval(function () {
            var photoMetas = $('div.photoFullDesktop');
            $.each($(photoMetas), function (index, value) {
                var _downloads = $(value).find('a.user._download');
                var imgSrc = $(value).find("div.imagewrapper img").attr('src');
                log(imgSrc);
                if (_downloads.length == 0) {
                    if (imgSrc) {
                        var regExp = /\.com\/.*?\/([\w]+\.jpg)/im;
                        var match = regExp.exec(imgSrc);
                        var imgName = "";
                        if (match != null) {
                            imgName = match[1];
                            imgSrc = imgSrc.replace(regExp, ".com/e35/$1");
                            log(imgSrc);
                            $(value).find('#photoHeader  h1 > a:nth-child(2)').after("<a download=\"" + imgName + "\" class=\"user _download\" style=\"float: right;\" href=\"" + imgSrc + "\">下载</a>");
                        } else {

                        }
                    }

                }
            });
        }, 100);
    }

    // {
    //     var id = setInterval(function () {
    //         var _THRB_Stop = $('#_THRB_Stop');
    //         if(_THRB_Stop.length==1){
    //             uncoverPage();
    //             clearInterval(id);
    //         }
    //     }, 100);
    // }

})();


//获取参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var search = window.location.search;
    if (search.startsWith("?")) {
        var r = search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
    }
    return null;
}

//日志
function log(c) {
    if (false) {
        console.log(c);
    }
}

function err(c) {
    if (true) {
        console.error(c);
    }
}

function priorityLog(c) {
    console.log(c);
}

function getUrlParams() {
    var url = window.location.search;
    var urlParam = {};
    if (url.startsWith("?")) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            urlParam[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    return urlParam;
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

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};


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