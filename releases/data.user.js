// ==UserScript==
// @name         Price Data
// @namespace    http://cmsv1.findmd5.com
// @version      0.0.1
// @description  1123
// @author       selang
// @include      /https?:\/\/www\.c5game\.com/
// @include      /https?:\/\/steamcommunity\.com/
// @require       https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @connect      *
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==
(function () {
    var domainAndPathNameRegExp = '/.*?' + window.location.pathname.replace(/\//g, '\\\/') + '/';
    if (/item_id=\d+&type=\w/m.test(window.location.search.substr(1)) || /\/dota\/[\w-]+\.html/m.test(location.pathname) || /\/market\/[\w-]+\.html/m.test(location.pathname) || /\/csgo\/\d+\/\w\.html/m.test(location.pathname) || /\/csgo\/item\/index\.html/m.test(location.pathname)) {
        log('匹配');
        var steamHref = $('div.hero > div > a').attr('href');
        log(steamHref);
        obtainHtml(steamHref, function (html) {
            var myregexp = /Market_LoadOrderSpread\(\s*(\d+)\s*\);/m;
            var match = myregexp.exec(html);
            if (match != null) {
                var itemId = match[1];
                log(itemId);
                //http://steamcommunity.com/market/itemordershistogram?country=CN&language=schinese&currency=1&item_nameid=7178705&two_factor=0
                var steamBuyInfoUrl = 'http://steamcommunity.com/market/itemordershistogram?country=CN&language=schinese&currency=23&item_nameid=' + itemId + '&two_factor=0';
                obtainHtml(steamBuyInfoUrl, function (jsonstr) {
                    var json = JSON.parse(jsonstr);
                    var buyOrderSummary = json.buy_order_summary;
                    log(buyOrderSummary);
                    var steamMaxBuyPriceRegexp = />¥\s*([\d,.]+)\s*<\/span>\s*或更低的价格购买/m;
                    var match = steamMaxBuyPriceRegexp.exec(buyOrderSummary);
                    if (match != null) {
                        var steamMaxBuyPrice = parseFloat(match[1].replace(',', ''));
                        log(steamMaxBuyPrice);
                        var cssSelector;
                        if (location.pathname.indexOf('/csgo/') != -1) {
                            cssSelector = '#sale > table > tbody > tr[class]';
                        } else {
                            cssSelector = '#sale-table > tr';
                        }
                        $(cssSelector).each(function (index) {
                            var priceText = $(this).find('td:nth-child(3) > span').text();
                            var priceMatch = priceText.match(/￥([\d.]+)/m);
                            if (priceMatch != null) {
                                var itemPrice = parseFloat(priceMatch[1]);
                                log(itemPrice);
                                var obtainMoney = cmp(steamMaxBuyPrice, itemPrice, 1);
                                log(obtainMoney);
                                if (obtainMoney > 0) {
                                    log('可买入！');
                                    $(this).find('td:nth-child(3)').append('<div class="sale-discount-tag increase">+' + obtainMoney.toFixed(2) + '</div>');
                                } else {
                                    $(this).find('td:nth-child(3)').append('<div class="sale-discount-tag decrease">' + obtainMoney.toFixed(2) + '</div>');
                                }
                            } else {
                                // Match attempt failed
                                err(' Match attempt failed');
                            }

                        });
                    } else {
                        // Match attempt failed
                        err(' Match attempt failed');
                    }
                });
            } else {
                // Match attempt failed
                err(' Match attempt failed');
            }

        });

    } else if (window.location.href.replace(eval(domainAndPathNameRegExp), '') === '#730') {
        steamcommunitySale();
    } else {
        err('不匹配');
    }
})();

//日志
function log(c) {
    if (true) {
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

//解析头
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

//获取网页
function obtainHtml(url, sucess) {
    var headers = parseHeaders("Accept:image/webp,image/*,*/*;q=0.8\n" +
        "Accept-Encoding:gzip, deflate, sdch\n" +
        "Accept-Language:zh-CN,zh;q=0.8\n" +
        //"Referer:" + window.location.href + "\n" +
        "User-Agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
    );
    GM_xmlhttpRequest({
        method: 'GET',
        headers: headers,
        url: url,
        onload: function (response) {
            sucess(response.responseText);
        }
    });
}

function cmp(steamMaxBuyPrice, c5MinSalePrice, exchangeRate) {
    var balancePrice = steamMaxBuyPrice * 0.87 * (1 - 0.15);
    log('平衡价：' + balancePrice);
    var obtainMoney = (balancePrice - c5MinSalePrice);
    if (obtainMoney > 0) {
        priorityLog('可以购买，预计赚：' + obtainMoney);
    }
    return obtainMoney;
}

function steamcommunitySale() {
    waitDo('#iteminfo1_item_market_actions > a',function () {
        unsafeWindow.SellCurrentSelection();
    });
    waitDo('#market_sell_dialog_accept_ssa',function () {
        $('#market_sell_dialog_accept_ssa').attr("checked", true);
    })
}

function waitDo(cssSelector,func) {
    var id = setInterval(function () {
        var saleBtn = $(cssSelector);
        if(saleBtn.length==1){
            func();
            clearInterval(id);
        }
    }, 100);
}