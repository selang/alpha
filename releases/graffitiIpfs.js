// ==UserScript==
// @name         聚合网页(美女图聚合展示演化而来)by SeLang
// @namespace    http://cmsv1.findmd5.com/
// @version      0.02
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
                    options.onload = options.onload || function (response) {
                        if (response && response.status && response.status >= 200 && response.status < 300) {
                            let html = response.responseText;
                            resolve(html);
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
                    const item = array[i++];
                    const p = Promise.resolve().then(() => iteratorFn(item, array));
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
                if (url.startsWith('#')) {
                    validate = false;
                } else {
                    if (!url.toLowerCase().startsWith('//')) {
                        if (url.startsWith("/")) {
                            url = `${window.location.protocol}//${window.location.hostname}${url}`;
                        } else {
                            url = `${window.location.protocol}//${window.location.hostname}/${url}`;
                        }

                    } else {
                        url = `${window.location.protocol}${url}`;
                    }
                }
                return {validate, url};
            }

            async function parseNextPages(nextSelector = 'a:contains("下一页")') {
                let ret = [];
                ret.push({
                    url: window.location.href,
                    html: $('html').prop("outerHTML")
                });
                let nextEs = $(nextSelector);
                log('解析下一页开始...');
                while (nextEs.length > 0) {
                    let nextPageUrl = nextEs.attr('href');
                    let validateUrlResult = validateUrl(nextPageUrl);
                    if (!validateUrlResult.validate) {
                        break;
                    }
                    nextPageUrl = validateUrlResult.url;
                    log(nextPageUrl);
                    let html = await Alpha_Script.obtainHtmlAsync({url: nextPageUrl});
                    ret.push({
                        url: nextPageUrl,
                        html
                    });
                    let parseHTML = $.parseHTML(html);
                    nextEs = $(parseHTML).find(nextSelector);
                    // await Alpha_Script.sleep(1000);
                }
                log('解析下一页结束...');
                return ret;
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
                let imgSelector = 'ul > li > img';
                let nextPages = await parseNextPages(nextPageSelector);
                nextPages.map(nextPage => {
                    let images = Array.from($($(nextPage.html)).find(imgSelector)).map(e => e.src);
                    nextPage.imgs = images;
                });
                let imgs = nextPages.flatMap(page => page.imgs);
                return imgs;
            }

            /**
             * 校验cid是否符合rule
             * @param cid
             * @returns {Promise<{validate: boolean}|{date: *, parseRule: *, url: *, validate: boolean, desc: *}>}
             */
            async function parseRuleFromIPFS(cid) {
                const {date, desc, parseRule, url, pre} = (await node.dag.get(cid)).value;
                if (parseRule && url && desc && date) {
                    return {validate: true, date, desc, parseRule, url, pre};
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

                {
                    //这里是一个插件的例子
                    let cid = await node.dag.put(
                        {
                            url: 'https://www.lesmao.org/thread-24812-1-1.html',
                            desc: '蕾丝猫聚合',
                            parseRule: `return await (${example.toString()})(parseNextPages,$,log,Alpha_Script)`,
                            date: '2020年9月30日'
                        }
                    );
                    let cidStr = cid.toLocaleString();
                    console.log('你需要分享的地址为：', cidStr);
                }
                // 你自己写的或者他人分享的cidPath;
                let cidStr = "bafyreia76orynqjjqitqqiakg7bw444qbmedqxriqz2rzkagzccnt5js4u";
                let rules = await obtainRulesFromIPFS(cidStr);
                for (let rule of rules) {
                    log('当前执行规则>> %s 编写规则参考地址：%s 规则内容：%s', rule.desc, rule.url, rule.parseRule);
                    let ruleFunc = rule.parseRule;
                    let imgs = await (new AsyncFunction('parseNextPages', '$', 'log', 'Alpha_Script', ruleFunc))(parseNextPages, $, log, Alpha_Script);
                    if (imgs.length > 0) {
                        log('规则找到图片');
                        let containerHtml = imgs.map((e, i) => `<div id="c_${i}"><img src="${e}"/></div>`).join("");
                        let inject = `<html><head></head><body><div>${containerHtml}</div></body></html>`;
                        $('html').html(inject);
                        log('规则执行完毕');
                        break;
                        // await Alpha_Script.sleep(5000);
                    }
                }

                log('执行完毕');
            })();

            GM_registerMenuCommand("规则列表", ruleListFunc, "R");

            function ruleListFunc() {
                log("我是规则列表");
            }
        })();
    }
})
();
