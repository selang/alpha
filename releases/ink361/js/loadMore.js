var defaultLoadPage = null;


var THRB_LOAD_STRATEGY = {

    /*
     * 根据 参数 thrb_mirror_deadline 加载数据  截止日期
     * 根据 参数 thrb_mirror_maximgs 加载数据   达到数量
     *
     * 条件不满足 setTimeout 1000 递归
     * @param success 条件满足后
     */
    "default": function (success) {
        var thrb_mirror_deadline = THRB.findParamsValue("thrb_mirror_deadline");
        var thrb_mirror_maximgs = Number.parseInt(THRB.findParamsValue("thrb_mirror_maximgs"));

        function loadMore() {
            //loadMore出异常的情况
            try {
                var page = new Ink.PhotoListViewer();
                page.initialize(Ink.IGInterface.prototype._getPageByString("Tag", {
                    after: "",
                    args: {},
                    id: "clothes",
                    m: ["/tag/clothes", "clothes"],
                    uri: "/tag/clothes"
                }));
                page.page.loadMore();
            } catch (err) {
                page = null;
                console.error(err);
                window.location.reload();
            }
        }


        function defaultLoad() {
            document.body.scrollTop = document.body.scrollHeight;
        }

        function load(deadline, maximgs) {
            THRB.stateCnt++;
            if (THRB.allImg().length - THRB.preImgNos > 10) {
                THRB.stateCnt = 0;
            }
            if (THRB.allImg().length != 0) {
                THRB.preImgNos = THRB.allImg().length;
            }

            var imgs = THRB.allImg().length;
            if (deadline) {
                if (THRB.findDate(new Date(Number.parseInt(deadline)))) {
                    success();
                } else if (maximgs && imgs > maximgs) {
                    success();
                } else if (THRB.stateCnt > 20) {
                    success();
                } else {
                    doLoad(deadline, maximgs);
                }
            } else {
                if (maximgs && imgs > maximgs) {
                    success();
                } else if (THRB.stateCnt > 20) {
                    success();
                } else {
                    doLoad(deadline, maximgs);
                }
            }
        }

        function doLoad(deadline, maximgs) {
            try {
                defaultLoad();
            } finally {
                setTimeout(function () {
                    load(deadline, maximgs);
                }, 1000);
            }
        }

        load(thrb_mirror_deadline, thrb_mirror_maximgs);
    },

    /**
     *
     * TODO http status codes 429
     * @param success
     */
    "following": function (success) {
        var retry = 0;
        var preCount = -1;

        function scroll() {

            if (retry === 10) {
                console.warn("[retry === 10] 结束加载");
                success();
                return;
            }
            console.log("scrolling");
            window.scrollTo(0, window.scrollY + window.scrollY + 1000);

            var nodeList = window.document.querySelectorAll("span[itemprop='description']");
            if (nodeList.length < 1) {
                retry++;
                setTimeout(scroll, 2000);
            } else {

                var followingNum = window.document.querySelectorAll(".follow.withFollow .about-user h2 a").length;
                //关注中断现场还原
                {
                    if (THRB.totalCnt != -1 && followingNum == THRB.totalCnt) {
                        success();
                    } else {
                        if (preCount === followingNum) {
                            retry++;
                        } else {
                            retry = 0;
                        }

                        preCount = followingNum;
                        var followers = Number.parseInt(nodeList[0].innerHTML.match(/,\s(\d+)\sfollowing/)[1]);
                        if (followers > followingNum) {
                            setTimeout(scroll, 2000);
                        } else {
                            success();
                        }
                    }
                }
            }
        }

        setTimeout(scroll, 1000);
    }
};


var THRB = {

        preImgNos: 0, //上一次的图片数
        stateCnt: 0, //loadMore的一个状态控制用于避免卡死
        totalCnt: -1, //用于标识总数
        imgAttr: "data-low",
        tagAttr: "data-tag",
        JSONP: [],
        mirrorTaskFinished: false,
        stopLoadEvent: [],
        urlParams: window.location.search.replace("?", "").split("&").map(function (item) {
            var arr = item.split("=");
            return {key: arr[0], value: arr[1]}
        }),

        pageType: function () {
            if (!THRB.pageTypeValue) {
                var type = "default";
                if (window.location.href.match(/ink361\.com\/app\/users\/[\w-]+\/[\w]+\/following/)) {
                    type = "following";
                }
                THRB.pageTypeValue = {
                    value: type,
                    isDefault: type == "default",
                    isFollowing: type == "following"
                };
            }
            return THRB.pageTypeValue;
        },

        findDate: function (date) {
            var items = window.document.getElementsByTagName("time");
            {
                //拿最后一个日期比较
                var item = items[items.length - 1];
                var itemDate = new Date(item.attributes.getNamedItem("datetime").value);
                if (date > itemDate) {
                    console.log("findDate");
                    console.log(itemDate, items[i]);
                    return true;
                }
            }
            // {
            //     for (var i = 0; i < items.length; i++) {
            //         var itemDate = new Date(items[i].attributes.getNamedItem("datetime").value);
            //         if (date > itemDate) {
            //             console.log("findDate");
            //             console.log(itemDate, items[i]);
            //             return true;
            //         }
            //     }
            // }

            return false;
        },

        findParamsValue: function (key) {
            for (var i = 0; i < THRB.urlParams.length; i++) {
                if (THRB.urlParams[i].key === key) {
                    return THRB.urlParams[i].value;
                }
            }
            return null;
        },

        allImg: function () {
            var imgs = [];
            var photo = document.querySelectorAll("div.photo");
            for (var i = 0; i < photo.length; i++) {
                var item = photo[i];
                var imgAttr = item.getAttribute(THRB.imgAttr);
                imgs.push(imgAttr);
            }
            return imgs;
        },


        /**
         *
         */
        loadAll: function (success) {
            THRB_LOAD_STRATEGY[THRB.pageType().value](success);
        },

        stopLoad: function () {
            IGCache = null;
            Asset = null;

            if (document.getElements(".photoloader").length > 0) {
                document.getElements(".photoloader")[0].remove();
            }
            for (var i = 0; i < THRB.stopLoadEvent.length; i++) {
                THRB.stopLoadEvent[i]();
            }
        }
        ,

        loadTagJs: function () {
            var script = document.createElement("script");
            if (THRB.pageType().isDefault) {
                script.src = "https://github.com/selang/alpha/raw/master/releases/ink361/js/tag.js";
            } else if (THRB.pageType().isFollowing) {
                script.src = "https://github.com/selang/alpha/raw/master/releases/ink361/js/tag3.js";
            }
            script.type = "text/javascript";
            script.charset = "utf-8";
            document.body.appendChild(script);
        }
        ,
        jsonp: function (options) {
            //格式化参数
            function formatParams(data) {
                var arr = [];
                if (data) {
                    for (var name in data) {
                        if (data[name] instanceof Array) {
                            for (var i = 0; i < data[name].length; i++) {
                                arr.push(window.encodeURIComponent(name) + "=" + window.encodeURIComponent(data[name][i]));
                            }
                        } else {
                            arr.push(window.encodeURIComponent(name) + "=" + window.encodeURIComponent(data[name]));
                        }
                    }
                }
                return arr.join('&');
            }
            options = options || {};
            if (!options.url || !options.callback) {
                throw new Error("参数不合法");
            }
            //创建 script 标签并加入到页面中
            var callbackName = 'THRB_JSONP_call_' + ('' + Math.random()).replace(".", "");
            var oHead = document.getElementsByTagName('head')[0];
            options.data[options.callback] = callbackName;
            var params = formatParams(options.data);
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.charset = "utf-8";
            oHead.appendChild(script);

            //创建jsonp回调函数
            window[callbackName] = function (json) {
                oHead.removeChild(script);
                clearTimeout(script.timer);
                window[callbackName] = null;
                options.success && options.success(json);
            };

            //发送请求
            script.src = options.url + '?' + params;

            //超时处理
            if (options.time) {
                script.timer = setTimeout(function () {
                    window[callbackName] = null;
                    oHead.removeChild(script);
                    options.fail && options.fail({message: "超时"});
                }, options.time);
            }
        }
        ,

        request: function (path, params, callback) {
            THRB.jsonp({
                url: "http://119.23.210.38:9090" + path,
                data: params,
                callback: 'callback',
                time: 15000,
                success: function (json) {
                    callback(json);
                },
                fail: function (json) {
                    callback(json);
                }
            });
        }
        ,

        mirrorTaskFinish: function () {
            THRB.mirrorTaskFinished = true;
            THRB.request("/mirrorTaskFinish", {
                id: THRB.findParamsValue("thrb_mirror_id")
            }, function (data) {
                if (data.error == 0) {
                    console.log("mirrorTaskFinish");
                } else {
                    console.error("镜像完成状态修改失败");
                }
            });
        }
        ,

        mirrorWorking: function () {
            function working() {
                if (!THRB.mirrorTaskFinished) {
                    THRB.request("/mirrorWorking", {
                        id: THRB.findParamsValue("thrb_mirror_id")
                    }, function (data) {
                        console.log("mirrorWorking");
                        // TODO 定时更新数据
                        setTimeout(working, 5000);
                    });
                }
            }

            working();
        }
        ,
        mirrorImgNos: function (_imgNo) {
            THRB.request("/mirrorImgNos", {
                id: THRB.findParamsValue("thrb_mirror_id"),
                imgNo: _imgNo
            }, function (data) {
                console.log("已更新 mirrorImgNos");
            });
        }
        ,
        queryMirrorImgNos: function () {
            THRB.request("/queryMirrorImgNos", {
                id: THRB.findParamsValue("thrb_mirror_id")
            }, function (data) {
                console.log('加载总数');
                THRB.totalCnt = data.content;
            });
        }
        ,
        onStopLoad: function (call) {
            THRB.stopLoadEvent.push(call);
        }
    }
;


var thrb_mirror = THRB.findParamsValue("thrb_mirror");
var thrb_mirror_deadline = THRB.findParamsValue("thrb_mirror_deadline");
if ("start" === thrb_mirror) {
    THRB.mirrorWorking();
    //镜像进度
    coverPage();
    listenFindDate(new Date(Number.parseInt(thrb_mirror_deadline)));
} else if ("restart" === thrb_mirror) {
    THRB.mirrorWorking();
    //镜像进度
    coverPage();
    listenFindDate(new Date(Number.parseInt(thrb_mirror_deadline)));
} else if ("open" === thrb_mirror) {
    THRB.loadTagJs();
    THRB.queryMirrorImgNos();
    //镜像加载进度
    coverPage();
    loadMirror();
    {//除掉遮挡界面
        THRB.onStopLoad(uncoverPage);
    }
}

if ("start" === thrb_mirror || "restart" === thrb_mirror || "open" === thrb_mirror) { //防止其他页面被无限刷新
    setTimeout(function () {
        THRB.loadAll(function () {
            THRB.stopLoad();
            THRB.mirrorTaskFinish();
        });
    }, 2000);
}


//进度
function coverPage() {
    var alertPart = document.createElement("div");
    alertPart.id = "alert";
    alertPart.style.display = "block";
    alertPart.style.position = "fixed";
    alertPart.style.top = "50%";
    alertPart.style.left = "50%";
    alertPart.style.marginTop = "-75px";
    alertPart.style.marginLeft = "-150px";
    alertPart.style.background = "#90990a";
    alertPart.style.width = "450px";
    alertPart.style.height = "200px";
    alertPart.style.zIndex = "501";
    alertPart.style.opacity = "0.9";
    document.body.appendChild(alertPart);


    var mybg = document.createElement("div");
    mybg.setAttribute("id", "mybg");
    mybg.style.background = "#000";
    mybg.style.position = "fixed";
    mybg.style.width = "100%";
    mybg.style.height = "100%";
    mybg.style.top = "0";
    mybg.style.left = "0";
    mybg.style.zIndex = "500";
    mybg.style.opacity = "0.3";
    mybg.style.filter = "Alpha(opacity=30)";
    document.body.appendChild(mybg);

    document.body.style.overflow = "hidden";
}

function uncoverPage() {
    document.getElementById("alert").remove();
    document.getElementById("mybg").remove();
    document.body.style.overflow = "scroll";
}

//日志
function log(c) {
    if (false) {
        console.log(c);
    }
}

/*
 * 获得时间差,时间格式为 年-月-日 小时:分钟:秒 或者 年/月/日 小时：分钟：秒
 * 其中，年月日为全格式，例如 ： 2010-10-12 01:00:00
 * 返回精度为：秒，分，小时，天
 */

function GetDateDiff(sTime, eTime, diffType) {
    //作为除数的数字
    var divNum = 1;
    switch (diffType) {
        case "second":
            divNum = 1000;
            break;
        case "minute":
            divNum = 1000 * 60;
            break;
        case "hour":
            divNum = 1000 * 3600;
            break;
        case "day":
            divNum = 1000 * 3600 * 24;
            break;
        default:
            break;
    }
    return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
}

function listenFindDate(deadline) {
    var startDate = new Date();
    var id = window.setInterval(function () {
        var diplayData = '<p style="font-size:18px;line-height:110%;padding:20px;font-color:black;">';
        //diplayData += '当前镜像的截止时间：' + deadline.Format("yyyy年MM月dd日 hh:mm:ss");
        var photoDivEs;
        if (THRB.pageType().isDefault) {
            photoDivEs = window.document.querySelectorAll("div[class*=photoCount]");
        } else if (THRB.pageType().isFollowing) {
            photoDivEs = window.document.querySelectorAll(".follow.withFollow .about-user h2 a");
        }
        THRB.mirrorImgNos(photoDivEs.length);

        diplayData += '</br>';
        diplayData += '</br>镜像中:';
        diplayData += '</br>';
        if (THRB.pageType().isDefault) {
            diplayData += '</br>已镜像图片数:' + photoDivEs.length;
        } else if (THRB.pageType().isFollowing) {
            diplayData += '</br>已镜像用户ID数:' + photoDivEs.length;
        }
        diplayData += '</br>';
        diplayData += '</br>' + '用时：' + GetDateDiff(startDate, new Date(), "second") + '秒';
        // diplayData += '</br>' + lastPicDateStr(photoDivEs);
        diplayData += '</p>';
        log(diplayData);
        // $('#alert').html(diplayData);
        document.getElementById("alert").innerHTML = diplayData;
    }, 500);


    THRB.onStopLoad(function () {
        //TODO,自检需要检查数据是否已成功保存到服务器硬盘
        var mirrorState = 0;
        var checkMirrorStateId = window.setInterval(function () {
            if (mirrorState != 3) {
                if ("restart" === thrb_mirror) {
                    THRB.request("/checkMirrorState", {
                        mirrorId: THRB.findParamsValue("thrb_mirror_id"),
                        forceCheck: true
                    }, function (data) {
                        console.log("forceCheck checkMirrorState");
                        mirrorState = data.content.checkState;
                    });
                } else {
                    THRB.request("/checkMirrorState", {
                        mirrorId: THRB.findParamsValue("thrb_mirror_id")
                    }, function (data) {
                        console.log("checkMirrorState");
                        mirrorState = data.content.checkState;
                    });
                }

            } else {
                clearInterval(checkMirrorStateId);
                clearInterval(id);
                var diplayData = '<p style="font-size:18px;line-height:110%;padding:20px;font-color:black;">';
                var photoDivEs;
                if (THRB.pageType().isDefault) {
                    photoDivEs = window.document.querySelectorAll("div[class*=photoCount]");
                } else if (THRB.pageType().isFollowing) {
                    photoDivEs = window.document.querySelectorAll(".follow.withFollow .about-user h2 a");
                }
                diplayData += '</br>';
                diplayData += '</br>镜像完成:';
                diplayData += '</br>';
                if (THRB.pageType().isDefault) {
                    diplayData += '</br>已镜像图片数:' + photoDivEs.length;
                } else if (THRB.pageType().isFollowing) {
                    diplayData += '</br>已镜像用户ID数:' + photoDivEs.length;
                }
                diplayData += '</br>';
                diplayData += '</br>' + '用时：' + GetDateDiff(startDate, new Date(), "second") + '秒';
                diplayData += '</p>';
                // diplayData +=  '</br>'+lastPicDateStr(photoDivEs);
                log(diplayData);
                document.getElementById("alert").innerHTML = diplayData;
                // $('#alert').html(diplayData);
            }
        }, 2000);
    });


}


function loadMirror() {
    var startDate = new Date();
    var id = window.setInterval(function () {
        var diplayData = '<p style="font-size:18px;line-height:110%;padding:20px;font-color:black;">';
        //diplayData += '当前镜像的截止时间：' + deadline.Format("yyyy年MM月dd日 hh:mm:ss");
        var photoDivEs;
        if (THRB.pageType().isDefault) {
            photoDivEs = window.document.querySelectorAll("div[class*=photoCount]");
        } else if (THRB.pageType().isFollowing) {
            photoDivEs = window.document.querySelectorAll(".follow.withFollow .about-user h2 a");
        }

        diplayData += '</br>';
        diplayData += '</br>加载镜像中:';
        diplayData += '</br>总数：' + THRB.totalCnt;
        if (THRB.pageType().isDefault) {
            diplayData += '</br>已加载镜像图片数:' + photoDivEs.length;
        } else if (THRB.pageType().isFollowing) {
            diplayData += '</br>已加载用户ID数:' + photoDivEs.length;
        }
        diplayData += '</br>';
        diplayData += '</br>' + '用时：' + GetDateDiff(startDate, new Date(), "second") + '秒';
        // diplayData += '</br>' + lastPicDateStr(photoDivEs);
        diplayData += '</p>';
        log(diplayData);
        // $('#alert').html(diplayData);
        document.getElementById("alert").innerHTML = diplayData;

    }, 500);


    THRB.onStopLoad(function () {
        //TODO,需要检查数据是否已成功保存到服务器硬盘
        clearInterval(id);
        var diplayData = '<p style="font-size:18px;line-height:110%;padding:20px;font-color:black;">';
        var photoDivEs;
        if (THRB.pageType().isDefault) {
            photoDivEs = window.document.querySelectorAll("div[class*=photoCount]");
        } else if (THRB.pageType().isFollowing) {
            photoDivEs = window.document.querySelectorAll(".follow.withFollow .about-user h2 a");
        }

        diplayData += '</br>';
        diplayData += '</br>镜像加载完成:';
        diplayData += '</br>总数：' + THRB.totalCnt;
        if (THRB.pageType().isDefault) {
            diplayData += '</br>已加载镜像图片数:' + photoDivEs.length;
        } else if (THRB.pageType().isFollowing) {
            diplayData += '</br>已加载用户ID数:' + photoDivEs.length;
        }
        diplayData += '</br>';
        diplayData += '</br>' + '用时：' + GetDateDiff(startDate, new Date(), "second") + '秒';
        diplayData += '</p>';
        // diplayData +=  '</br>'+lastPicDateStr(photoDivEs);
        log(diplayData);

        try {
            document.getElementById("alert").innerHTML = diplayData;
        } catch (e) {

        }
        // $('#alert').html(diplayData);

    });
}


console.log("loadMore.js");

