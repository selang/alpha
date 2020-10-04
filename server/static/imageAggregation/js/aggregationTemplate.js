Array.prototype.distinct = function () {
    let arr = this;
    let result = [];
    let obj = {};

    for (let i of arr) {
        if (!obj[i]) {
            result.push(i);
            obj[i] = 1;
        }
    }
    return result;
}

const resizeObserver = new ResizeObserver(entries => {
    let scrollHeight = Math.ceil(window.document.body.querySelector('.container-fluid').scrollHeight);
    window.top.document.getElementById("aggregationIFRAME").style.height = `${scrollHeight}px`;
});

resizeObserver.observe(window.document.querySelector('#c_container'));

function postMsg(msg) {
    return new Promise((res, rej) => {
        const {port1, port2} = new MessageChannel();

        port1.onmessage = ({data}) => {
            if (data.from == 'monkey') {
                port1.close();
                if (data.error) {
                    rej(data);
                } else {
                    res(data);
                }
            }
        };
        msg.from = 'page';
        window.top.postMessage(msg, window.location.origin, [port2]);
    });
}

//热键
function aggregationDisplaySwitchHotkeys() {
    $(document).keydown(async function (e) {
        if (e.ctrlKey && e.shiftKey) {
            if (e.which == 76) {//L
                log("触发快捷键");
                await postMsg({method: '聚合切换'});
            }
        }
    });
}

aggregationDisplaySwitchHotkeys();

function log() {
    if (true) {
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

/**
 * 如果图片长宽小于500像素则隐藏
 * @param e
 * @returns {Promise<void>}
 */
async function loadHidden(e) {
    let {height, width} = await imageWidth(e);
    if (!(height > 500 && width > 500)) {
        e.style.display = 'none';
    } else {
        e.style.display = 'block';
    }
}

function imgHidden(e) {
    let {height, width} = e;
    if (!(height > 500 && width > 500)) {
        e.style.display = 'none';
    } else {
        e.style.display = 'block';
    }
    let display = e.style.display;
    return {display}
}

function getImageWidth(url) {
    let img = new Image();
    img.src = url;
    return imageWidth(img);
}

function imageWidth(img) {
    return new Promise(resolve => {
        // 如果图片被缓存，则直接返回缓存数据
        if (img.complete) {
            resolve(img);
        } else {
            // 完全加载完毕的事件
            img.onload = function () {
                resolve(img);
            }
        }

    });
}

// for (; ;) {
//     if (typeof angular !== 'undefined') {
//         break
//     }
// }
(async () => {

    if (typeof angular !== 'undefined') {
        await postMsg({method: 'pageResLoadComplete'});
    }

})();
if (typeof angular !== 'undefined') {

    // const NODE = await Ipfs.create();

    const Alpha_Script = {
        sleep: function (time = 100) {
            return new Promise(resolve => {
                setTimeout(function () {
                    resolve();
                }, time);
            })
        },
        obtainHtmlAsync: function (options) {
            options = options || {};
            if (!options.url) {
                throw new Error("参数不合法");
            }
            return new Promise(resolve => {
                options.headers = options.headers || Alpha_Script.parseHeaders("Accept:image/webp,image/*,*/*;q=0.8\n" +
                    "Accept-Encoding:gzip, deflate, sdch\n" +
                    "Accept-Language:zh-CN,zh;q=0.8\n" +
                    "Referer:" + window.location.href + "\n" +
                    "User-Agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
                );
                options.method = options.method || 'GET';
                let responseType = options.responseType;
                switch (responseType) {
                    case "blob":
                        options.onload = options.onload || function (response) {
                            if (response && response.status && response.status >= 200 && response.status < 300) {
                                resolve(response);
                            }
                        }
                        break;
                    default:
                        options.onload = options.onload || function (response) {
                            if (response && response.status && response.status >= 200 && response.status < 300) {
                                let html = response.responseText;
                                resolve(html);
                            }
                        }
                }

                GM_xmlhttpRequest(options);
            });
        },
        asyncPool: function (poolLimit, array, iteratorFn) {
            let i = 0;
            const ret = [];
            const executing = [];
            const enqueue = function () {
                //Boundary processing, array is an empty array
                if (i === array.length) {
                    return Promise.resolve();
                }
                //Initialize a promise every enqueue
                const item = array[i];
                const p = Promise.resolve(i).then((i) => iteratorFn(item, i, array));
                i++;
                //Put into promises array
                ret.push(p);
                //After the promise is executed, remove it from the executing array
                const e = p.then(() => executing.splice(executing.indexOf(e), 1));
                //Insert the executing number to indicate the executing promise
                executing.push(e);
                //Using promise.rece, whenever the number of promises in the executing array is less than poollimit, the new promise is instantiated and executed
                let r = Promise.resolve();
                if (executing.length >= poolLimit) {
                    r = Promise.race(executing);
                }
                //Recursion until array is traversed
                return r.then(() => enqueue());
            };
            return enqueue().then(() => Promise.allSettled(ret));
        },
        obtainHtml: function (options) {
            options = options || {};
            if (!options.url || !options.method) {
                throw new Error("参数不合法");
            }
            GM_xmlhttpRequest(options);
        },
        parseHeaders: function (headStr) {
            let o = {};
            let myregexp = /^([^:]+):(.*)$/img;
            let match = /^([^:]+):(.*)$/img.exec(headStr);
            while (match != null) {
                o[match[1].trim()] = match[2].trim();
                match = myregexp.exec(headStr);
            }
            return o;
        },
        //获取参数
        getParam: function (dest, name) {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            let r = dest.match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        },
        isArray: function (value) {
            return Object.prototype.toString.apply(value) === '[object Array]';
        }
    };


    let app = angular.module("myApp", []);
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
    app.directive('myResizeObserver', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, iElement, attrs) {
                const _resizeObserver = new ResizeObserver(async entries => {
                    let img = entries[0].target.querySelector('img');
                    // console.log('img.width, img.height', img.width, img.height);
                    let {display} = imgHidden(img);
                    _resizeObserver.unobserve(entries[0].target);
                })
                _resizeObserver.observe(iElement[0]);
            }
        };
    }]);
    let hotKeyNum = 1;
    app.directive('myHotkey', function () {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                let config = scope.$eval(attrs.myHotkey);
                let self = config.self;
                let value = hotKeyNum;
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

    const blobCache = [];
    app.controller("myCtrl", function ($scope) {
        $scope.hotKey = {};
        $scope.images = [];

        const receiveMessage = function (event) {
            let data = event.data;
            let host = location.host;
            let origin = event.origin;
            log('我在页面上：', data, data.from == 'monkey');
            if (data.from == 'monkey' && origin.indexOf(host) != -1) {

                let result = data.result;
                if (typeof result == 'string') {
                    result = JSON.parse(result);
                }
                if ("images" == data.method) {
                    let blobs = result.map(r => r.blob);
                    blobCache.push(...blobs);
                    let images = result.map(r => r.url);
                    $scope.$apply(() => $scope.images = images);
                }

                let message = {result: '我在页面上收到了', from: 'page'};
                event.ports[0].postMessage(message);

            }
        };


        window.addEventListener("message", receiveMessage, false);

        $scope.aggregatonBtnSwitchDisplay = '聚合隐藏';
        $scope.aggregatonBtnSwitch = async function () {
            if ($scope.aggregatonBtnSwitchDisplay === '聚合显示') {
                $scope.aggregatonBtnSwitchDisplay = '聚合隐藏';
            } else {
                $scope.aggregatonBtnSwitchDisplay = '聚合显示';
            }
            await postMsg({method: '聚合切换'});
        }


        const zip = new JSZip();
        let readyPack = false;

        $scope.pack = function () {
            if (!readyPack) {
                zip.file("readme.txt", "感谢使用selang提供的插件。欢迎进群：455809302交流。一起玩不论是不是技术人员都欢迎。\r\n只要有创意也欢迎加入。点击链接加入群【油猴脚本私人级别定制】：https://jq.qq.com/?_wv=1027&k=460soLy\n");
                let img = zip.folder("images");
                let keys = Object.keys(blobCache);
                let cnt = 0;
                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    let blobCacheElement = blobCache[key];
                    //硬编码假设小于2000的是不需要的图
                    if (blobCacheElement.size > 2000) {
                        img.file(cnt++ + ".jpg", blobCacheElement, {base64: false});
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
            let cContainner = $('#c_container').get(0);
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


        let trackers = ['wss://tracker.btorrent.xyz', 'wss://tracker.openwebtorrent.com', 'wss://tracker.fastcast.nz', 'wss://tracker.webtorrent.io']

        let rtcConfig = {
            'iceServers': [
                {'urls': 'stun:stun.l.google.com:19305'},
                {'urls': 'stun:stun01.sipphone.com'},
                {'urls': 'stun:stun.ekiga.net'},
                {'urls': 'stun:stun.fwdnet.net'},
                {'urls': 'stun:stun.ideasip.com'},
                {'urls': 'stun:stun.iptel.org'}
            ]
        }

        let torrentOpts = {
            announce: trackers
        }

        let trackerOpts = {
            announce: trackers,
            rtcConfig: rtcConfig
        }

        $scope.seedSource = function (blob) {
            if (WebTorrent.WEBRTC_SUPPORT) {
                let client = new WebTorrent({
                    tracker: trackerOpts
                });
                let files = new window.File([blob], "PackageSL.zip", {type: 'zip'});
                client.seed(files, torrentOpts, function (torrent) {
                    $scope.infoHash = torrent.infoHash;
                    $scope.$apply();
                })
            } else {
                priorityLog('不支持！')
            }
        }

    });
}