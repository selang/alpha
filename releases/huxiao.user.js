// ==UserScript==
// @name         huke88
// @namespace    google.com
// @version      0.1
// @description  就是看视频
// @author       有问题找售后
// @match        https://huke88.com/course/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==
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

function toLogin() {
    $('#loginModal').removeClass('hide');
}

function login() {
    if (0 == Param.uid) {
        toLogin();
        return false;
    } else {
        return true;
    }
}

$("#huke88-video").unbind('click');

function videoPlay(confirm) {
    var pass = login();
    if (!pass) {
        return;
    }
    var clickTime = (new Date()).valueOf();
    var sendAlready = false;
    $.when(Alpha_Script.obtainHtml({
        url: "http://125.66.97.204:9999/playUrl",
        method: 'POST',
        headers: {
            "Accept": "application/*",
            "Content-Type": "application/json;charset=UTF-8",
            "Referer": window.location.origin
        },
        data: JSON.stringify({
            src: window.location.href,
            id: Param.video_id,
            exposure: Param.exposure,
            studySourceId: Param.studySourceId,
            confirm: confirm,
            async: false,
            "_csrf-frontend": $('meta[name="csrf-token"]').attr("content")
        }),
        responseType: 'json',
        onload: function (response) {
            response = response.response;
            console.log("patch ok");
            var aa = document.getElementsByClassName("app-gz")[0];
            aa.innerText = "显示M3U8链接";
            aa.onclick = function () {
                prompt("请手动复制M3U8链接", response.video_url);
            };
            if ($.inArray(response.code, [1, 2, 3, 4, 5, 6]) !== -1 || (response.code && response.confirm === 1)) {
                $('#huke88-video').unbind('click');
                $('#no-learn-reply-win-js').remove();
                $('#reply-publish-js').removeClass('hide');
                course.hasStudy = 1;
                $('#huke88-video img').remove();
                $("#huke88-video").hkPlayer({
                    'playerVideoUrl': response.video_url,
                    'error': function () {
                        sendVideoPlayError(playerTypeForSend, (new Date()).valueOf());
                        console.log('错误，请联系管理员');
                    },
                    'play': function () {
                        $('#huke88-video-play').remove();
                        $('#reply-tip').addClass('hide');
                        if (playerTypeForSend == 'html5') {
                            var nowstate = playerCopyForSend.state();
                            if (nowstate == 1) {
                                if (!sendAlready) {
                                    sendAlready = true;
                                    sendStatisticTime(playerTypeForSend, (new Date()).valueOf() - clickTime);
                                }
                            }
                        } else {
                            if (!sendAlready) {
                                sendAlready = true;
                                sendStatisticTime(playerTypeForSend, (new Date()).valueOf() - clickTime);
                            }
                        }
                    }, 'pause': function () {
                        $('#reply-tip').removeClass('hide');
                    },
                    'lastTenSeconds': function () {
                        newToNextVideo();
                    }
                });
                if (Param.key.length) {
                    var data = {
                        uv: Param.uv_id,
                        keyword: Param.key,
                        videoId: Param.video_id
                    };
                    $.get(Config.searchPlayUrl, data);
                }
            } else {
                iThink = 1;
                if (response.class === Param.lesssonLimitClass) {
                    $(".qz-win").show();
                    return false;
                }
                $("div[data-video-modal-id=" + response.code + "]").removeClass('hide');
            }
        }
    }));
}

$("#huke88-video").bind('click', function () {
    videoPlay(1);
});
$("#download-case-js").unbind('click');
$("#download-source-js").unbind('click');

function download(type, confirm) {
    if (Param.uid) {
        $.ajax({
            'url': Url.download,
            data: {
                id: Param.video_id,
                type: type,
                studySourceId: Param.studySourceId,
                confirm: 0,
                "_csrf-frontend": $('meta[name="csrf-token"]').attr("content")
            },
            method: 'post',
            'dataType': 'JSON',
            'success': function (response) {
                if ($.inArray(response.code, [1, 2, 3, 4, 5]) !== -1 || (response.code && response.confirm === 1)) {
                    new downloadFiles(response.download_url);
                    course.hasStudy = 1;
                    $('#no-learn-reply-win-js').remove();
                    $('#reply-publish-js').removeClass('hide');
                } else {
                    iThink = type + 1;
                    $("div[data-video-modal-id=" + response.code + "]").removeClass('hide');
                }
            }
        });
    }
}

function downloadFile(url) {
    try {
        if (isIE()) {
            var a = document.createElement("a");
            a.setAttribute("href", url);
            a.setAttribute("target", "_blank");
            document.body.appendChild(a);
            a.click();
        } else {
            var elemIF = document.createElement("iframe");
            elemIF.src = url;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }
    } catch (e) {
    }
}

function isIE() {
    if (!!window.ActiveXobject || "ActiveXObject" in window) {
        return true;
    } else {
        return false;
    }
}

$("#download-source-js").on('click', function () {
    var pass = login();
    if (!pass) {
        return;
    }
    download(1, 0);
});
$("#download-case-js").on('click', function () {
    var pass = login();
    if (!pass) {
        return;
    }
    download(2, 0);
});