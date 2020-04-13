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
    },
    getPageScrollY: function (top) {

        if (top || Number(top) == 0) { //设置垂直滚动值
            if (self.pageYOffset) {
                self.pageYOffset = Number(top);
            }
            if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
                document.documentElement.scrollTop = Number(top);
            }
            if (document.body) {// all other Explorers
                document.body.scrollTop = Number(top);
            }
            return true;
        } else { //获取垂直滚动值
            var yScroll;
            if (self.pageYOffset) {
                yScroll = self.pageYOffset;
            } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
                yScroll = document.documentElement.scrollTop;
            } else if (document.body) {// all other Explorers
                yScroll = document.body.scrollTop;
            }
            return yScroll;
        }

    }
};


var app = angular.module("myApp", []);
app.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript|magnet):/);
}]);
app.directive('myText', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, iElement, attrs) {
            iElement[0].textContent = $parse(attrs.myText)(scope);
            //监听的数据是一个函数，该函数必须先在父作用域定义
            scope.$watch(attrs.myText, function (newValue, oldValue, scope) {
                if (newValue && newValue != oldValue) {
                    iElement[0].textContent = newValue;
                }
            }, true);
        }
    };
}]);
var hotKeyNum = 1;
app.directive('myHotkey', function () {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, element, attrs) {
            var config = scope.$eval(attrs.myHotkey);
            var self = config.self;
            var value = hotKeyNum;
            self.hotKeyLabel = "热键：" + value;
            angular.element(window).on('keydown', function (e) {
                if (e.key == value) {
                    if (self.hotKey) {
                        log('keypress', e.key);
                        element.trigger(config.event);
                    }
                }
            });
        }
    }
});

// File/Blob对象转DataURL
function fileOrBlobToDataURL(obj, cb) {
    let a = new FileReader();
    a.readAsDataURL(obj);
    a.onload = function (e) {
        cb(e.target.result);
    };
}

let maxWidth = 0;
var blobCache = [];
app.controller("myCtrl", function ($scope) {
    $scope.hotKey = {};

    var crossWindow;
    var receiveMessage = function (event) {
        crossWindow = event.source.top;
        var dt = event.data;
        var host = location.host;
        if (!dt.tag || event.origin.indexOf(host) != -1) {
            return;
        } else {
        }
        var data = dt.data;
        if (typeof data == 'string') {
            data = JSON.parse(data);
        }
        if ("创建div去装各自" == dt.tag) {
            for (var i = 0, len = data.len; i < len; i++) {
                //创建div去装各自
                $('#c_container').append('<div id="c_' + i + '"></div>');
            }
        } else if ("装各自" == dt.tag) {
            var selector = data.selector;
            var objectURL = URL.createObjectURL(data.imgBlob);
            var picNode = '<div class="sl-c-pic"><img src="' + objectURL + '"></div>';

            {
                var numExp = /(\d+)/i;
                var match = numExp.exec(selector);
                if (match != null) {
                    var index = parseInt(match[1]);
                    if (!blobCache[index]) {
                        blobCache[index] = [];
                    }
                    blobCache[index].push(data.imgBlob);
                }
            }
            if (data.imgBlob.size > 2000) {

                fileOrBlobToDataURL(data.imgBlob, dataUrl => {
                    var img = new Image();
                    img.src = dataUrl;
                    img.onload = function () {
                        if (maxWidth < img.width) {
                            maxWidth = img.width;
                        }
                        POST_2_WEB_PAGE({
                            tag: 'heightChange',
                            data: {
                                iframeHeight: Math.max(document.body.scrollHeight, document.body.clientHeight),
                                iframeWidth: maxWidth
                            }
                        });
                    };
                })
                $(selector).append(picNode);
            }
        } else if ("online" == dt.tag) {
            POST_2_WEB_PAGE({
                tag: 'back_online'
            })
        }
    };
    window.addEventListener("message", receiveMessage, false);

    function POST_2_WEB_PAGE(data) {
        var postMsg = data;
        if (typeof data == 'object') {
            //postMsg= JSON.stringify(data);
        }
        crossWindow.postMessage(postMsg, "*");
    };

    $scope.aggregatonBtnSwitchDisplay = '聚合隐藏';
    $scope.aggregatonBtnSwitch = function () {
        if ($scope.aggregatonBtnSwitchDisplay === '聚合显示') {
            $scope.aggregatonBtnSwitchDisplay = '聚合隐藏';
            $('#c_container').show();
        } else {
            $('#c_container').hide();
            $scope.aggregatonBtnSwitchDisplay = '聚合显示';
        }
        POST_2_WEB_PAGE({
            tag: '聚合切换',
            data: {
                aggregationBtnTxt: $scope.aggregatonBtnSwitchDisplay,
                iframeHeight: Math.max(document.body.scrollHeight, document.body.clientHeight),
                iframeWidth: maxWidth
            }
        });
    }

    var zip = new JSZip();
    var readyPack = false;

    $scope.pack = function () {
        if (!readyPack) {
            zip.file("readme.txt", "感谢使用selang提供的插件。欢迎进群：455809302交流。一起玩不论是不是技术人员都欢迎。\r\n只要有创意也欢迎加入。点击链接加入群【油猴脚本私人级别定制】：https://jq.qq.com/?_wv=1027&k=460soLy\n");
            var img = zip.folder("images");
            var keys = Object.keys(blobCache);
            var cnt = 0;
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var blobCacheElement = blobCache[key];
                for (var j = 0; j < blobCacheElement.length; j++) {
                    var blobCacheElementElement = blobCacheElement[j];
                    //1227是无图
                    if (blobCacheElementElement.size > 2000) {
                        img.file(cnt++ + ".jpg", blobCacheElementElement, {base64: false});
                    }
                }
            }
            readyPack = true;
        }
    }

    $scope.packageAndDownload = function () {
        $scope.pack();
        zip.generateAsync({type: "blob"})
            .then(function (content) {
                saveAs(content, "PackageSL.zip");
            });
    }

    $scope.makeAggregatonTorrent = function () {
        $scope.pack();
        zip.generateAsync({type: "blob"})
            .then(function (content) {
                $scope.seedSource(content);
            });
    }

    $scope.captureAndDownload = function () {
        var cContainner = $('#c_container').get(0);
        domtoimage.toBlob(cContainner)
            .then(function (blob) {
                if (blob) {
                    saveAs(blob, "captureSL.png");
                } else {
                    err('截图太大不能保存!');
                }
            })
            .catch(function (error) {
                err('截图太大不能保存!');
            });
    }


    var trackers = ['wss://tracker.btorrent.xyz', 'wss://tracker.openwebtorrent.com', 'wss://tracker.fastcast.nz', 'wss://tracker.webtorrent.io']

    var rtcConfig = {
        'iceServers': [
            {'urls': 'stun:stun.l.google.com:19305'},
            {'urls': 'stun:stun01.sipphone.com'},
            {'urls': 'stun:stun.ekiga.net'},
            {'urls': 'stun:stun.fwdnet.net'},
            {'urls': 'stun:stun.ideasip.com'},
            {'urls': 'stun:stun.iptel.org'}
        ]
    }

    var torrentOpts = {
        announce: trackers
    }

    var trackerOpts = {
        announce: trackers,
        rtcConfig: rtcConfig
    }

    $scope.seedSource = function (blob) {
        if (WebTorrent.WEBRTC_SUPPORT) {
            var client = new WebTorrent({
                tracker: trackerOpts
            });
            var files = new window.File([blob], "PackageSL.zip", {type: 'zip'});
            client.seed(files, torrentOpts, function (torrent) {
                $scope.infoHash = torrent.infoHash;
                $scope.$apply();
            })
        } else {
            priorityLog('不支持！')
        }
    }

});