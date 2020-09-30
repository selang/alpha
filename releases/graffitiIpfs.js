// ==UserScript==
// @name         聚合网页(美女图聚合展示演化而来)by SeLang
// @namespace    http://cmsv1.findmd5.com/
// @version      0.04
// @description  目标是聚合网页，省去翻页烦恼。有需要聚合的网址请反馈。 QQ群号：455809302,点击链接加入群【油猴脚本私人定制】：https://jq.qq.com/?_wv=1027&k=45p9bea
// @author       selang
// @include      /https?\:\/\/*/
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/ipfs/0.50.2/index.min.js
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

(async function () {
    if (window.top === window.self) {
        const node = await Ipfs.create();

        //日志
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

        const AsyncFunction = Object.getPrototypeOf(async function () {
        }).constructor;

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
            priorityLog('欢迎进群：455809302交流。一起玩。');
            priorityLog('一起玩不论是不是技术人员都欢迎。只要有创意也欢迎加入。点击链接加入群【油猴脚本私人级别定制】：https://jq.qq.com/?_wv=1027&k=460soLy。');
            priorityLog('未实现：');

            function validateUrl(url) {
                let validate = true;
                let lowerCaseUrl = url.toLowerCase();
                if (url.startsWith('#')) {
                    validate = false;
                } else if (lowerCaseUrl.startsWith('//')) {
                    url = `${window.location.protocol}${url}`;
                } else if (lowerCaseUrl.startsWith("/")) {
                    url = `${window.location.protocol}//${window.location.hostname}${url}`;
                } else if (lowerCaseUrl.startsWith('https://') || lowerCaseUrl.startsWith('http://')) {

                } else {
                    let prefixRegex = /(.*?\/)[^\/]*$/i;
                    let __matched = prefixRegex.exec(window.location.href);
                    if (__matched != null) {
                        url = `${__matched[1]}${url}`;
                    } else {
                        url = `${window.location.protocol}//${window.location.hostname}/${url}`;
                    }
                }

                return {validate, url};
            }

            async function parseNextPages(nextSelector = 'a:contains("下一页")') {
                let nextPages = [];
                let existNextPage = false;
                nextPages.push({
                    url: window.location.href,
                    html: $('html').prop("outerHTML")
                });
                let nextEs = $(nextSelector);
                log('解析下一页开始...');
                while (nextEs.length > 0) {
                    existNextPage = true;
                    let nextPageUrl = nextEs.attr('href');
                    let validateUrlResult = validateUrl(nextPageUrl);
                    if (!validateUrlResult.validate) {
                        break;
                    }
                    nextPageUrl = validateUrlResult.url;
                    log(nextPageUrl);
                    let html = await Alpha_Script.obtainHtmlAsync({url: nextPageUrl});
                    nextPages.push({
                        url: nextPageUrl,
                        html
                    });
                    let parseHTML = $.parseHTML(html);
                    nextEs = $(parseHTML).find(nextSelector);
                    // await Alpha_Script.sleep(1000);
                }
                log('解析下一页结束...');
                return {existNextPage, nextPages};
            }

            /**
             * 插件图片聚合例子
             * @param parseNextPages 解析下一页的公用方法
             * @param $  jquery
             * @param log 日志输出
             * @param Alpha_Script 公用对象
             * @returns {Promise<*[]>} 图片合集
             */
            async function example(parseNextPages, $, log, Alpha_Script) {
                //下一页css选择器
                let nextPageSelector = 'a:contains("下一页")';
                //要聚合的图片css选择器
                let imgSelector = 'img';
                let {existNextPage, nextPages} = await parseNextPages(nextPageSelector);
                if (existNextPage) {
                    nextPages.map(nextPage => {
                        let images = Array.from($($(nextPage.html)).find(imgSelector)).map(e => {
                            let src = e.src;
                            let dataOriginal = $(e).attr('data-original');
                            if (dataOriginal) {
                                src = dataOriginal;
                            }
                            return src;
                        });
                        nextPage.imgs = images;
                    });
                    let imgs = nextPages.flatMap(page => page.imgs);
                    return imgs;
                } else {
                    return [];
                }
            }

            /**
             * 校验cid是否符合rule
             * @param cid
             * @returns {Promise<{validate: boolean}|{date: *, parseRule: *, url: *, validate: boolean, desc: *}>}
             */
            async function parseRuleFromIPFS(cid) {
                const {date, desc, parseRule, url, pre, excludeWebsites} = (await node.dag.get(cid)).value;
                if (parseRule && url && desc && date) {
                    return {validate: true, date, desc, parseRule, url, pre, excludeWebsites};
                } else {
                    return {validate: false};
                }
            }

            /**
             * 获取cid下所有的规则
             * @param cid
             * @returns {Promise<[]>}
             */
            async function obtainRulesFromIPFS(cid) {
                let rules = [];
                let cids = [];
                while (true) {
                    try {
                        let rule = await parseRuleFromIPFS(cid);
                        if (rule.validate) {
                            rules.push(rule);
                            if (rule.pre) {
                                cid = rule.pre;
                                if (cids.includes(cid)) {
                                    err('闭环了');
                                    break;
                                } else {
                                    cids.push(cid);
                                }
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    } catch (e) {
                        err(e);
                        break;
                    }
                }
                return rules;
            }

            (async () => {
                // let cidStr;
                {
                    //这里是一个插件的例子
                    let cid = await node.dag.put(
                        {
                            url: '通用',
                            desc: '通用聚合',
                            parseRule: `return await (${example.toString()})(parseNextPages,$,log,Alpha_Script)`,
                            excludeWebsites: ['https://xxxxx需要排除的网站'],
                            date: '2020年9月30日'
                        }
                    );
                    cid = await node.dag.put(
                        {
                            url: '这里可以写书写规则的网址',
                            desc: '第二个通用聚合',
                            parseRule: `return await (${example.toString()})(parseNextPages,$,log,Alpha_Script)`,
                            excludeWebsites: ['https://xxxxx需要排除的网站'],
                            date: '2020年9月30日',
                            pre: cid.toString()
                        }
                    );
                    let cidStr = cid.toLocaleString();
                    // cidStr = cid.toLocaleString();
                    console.log('你的插件分享的地址为：', cidStr);
                }
                // 你自己写的或者他人分享的cidPath;
                let cidStr = "bafyreicfn763eq4qmjq4icgt6nwrcot7pu6otsiizowddeb3h7fassbo5y";
                let rules = await obtainRulesFromIPFS(cidStr);
                log('当前规则总数：', rules.length);
                for (let rule of rules) {
                    log('当前执行规则>> %s 编写规则参考地址：%s\r\n 规则内容：%s', rule.desc, rule.url, rule.parseRule);
                    let excludeWebsites = rule.excludeWebsites;
                    if (Alpha_Script.isArray(excludeWebsites)) {
                        let findAnyOnes = excludeWebsites.filter(excludeWebsite => window.location.href.startsWith(excludeWebsite));
                        if (findAnyOnes.length > 0) {
                            log('当前规则被排除');
                            continue;
                        }
                    }
                    let ruleFunc = rule.parseRule;
                    let imgs = await (new AsyncFunction('parseNextPages', '$', 'log', 'Alpha_Script', ruleFunc))(parseNextPages, $, log, Alpha_Script);
                    imgs = imgs.distinct();
                    if (imgs.length > 0) {
                        log('规则找到图片');
                        let containerHtml = imgs.map((e, i) => `<div id="c_${i}"></div>`).join("");
                        let inject = `<html><head></head><body><div>${containerHtml}</div><script type="application/javascript">${imageWidth.toString()}${loadHidden.toString()}</script></body></html>`;
                        $('html').html(inject);
                        await Alpha_Script.asyncPool(10, imgs, async function (src, i) {
                            let blob = await downloadImg2Blob(src);
                            let url = URL.createObjectURL(blob);
                            $(`#c_${i}`).append(`<img src="${url}" onload="loadHidden(this)"/>`);
                        });
                        log('规则执行完毕');
                        break;
                        // await Alpha_Script.sleep(5000);
                    }
                }

                log('执行完毕');
            })();

            async function downloadImg2Blob(imgSrc) {
                let response = await Alpha_Script.obtainHtmlAsync({
                    url: imgSrc,
                    method: 'GET',
                    headers: {
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                        // "Accept-Encoding": "gzip, deflate, sdch",
                        // "Accept-Language": "zh-CN,zh;q=0.8",
                        "Referer": window.location.href,
                        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
                    },
                    responseType: 'blob'
                });
                let responseHeaders = Alpha_Script.parseHeaders(response.responseHeaders);
                let contentType = responseHeaders['Content-Type'];
                if (!contentType) {
                    contentType = "image/png";
                }
                let blob = new Blob([response.response], {type: contentType});
                return blob;
            }

            async function loadHidden(e) {
                let {height, width} = await imageWidth(e);
                if (!(height > 500 && width > 500)) {
                    e.style.display = 'none';
                }
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

            GM_registerMenuCommand("规则列表", ruleListFunc, "R");

            function ruleListFunc() {
                log("我是规则列表");
            }
        })();
    }
})
();
