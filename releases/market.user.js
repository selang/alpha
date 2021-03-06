// ==UserScript==
// @name         IG-XE-CS-GO
// @namespace    http://cmsv1.findmd5.com
// @version      0.0.16
// @description
// @author       clownfish
// @include      /https?:\/\/www\.igxe\.cn/
// @connect      *
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==

var igxecsgo_Name = 'IG-XE-CS-GO';
var $ = jQuery;
var buyer_name = $('#js-show-user-pane > a.s.vam.omit.dib').text();
var putwayPWD = '你的上架密码';
var payPWD = '你的支付密码';
if (buyer_name) {
    sessionStorage.setItem('buyer_name', buyer_name);
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
    }
}

function igxecsgo_ChechItemPriceRatio() {//列表页方法
    var igxecsgo_ItemPrice = $("div.s2 span b");//市场价
    var igxecsgo_ItemPrice2 = $("div.s3 span strong");//卖家价
    var delayTimeArr = $("div.s1 div.fr");//延时
    var igxecsgo_ItemCount2 = 1;
    igxecsgo_ItemPrice2.each(function () {
        var _ratio = (Number(igxecsgo_ItemPrice2[igxecsgo_ItemCount2 - 1].innerText) / Number(igxecsgo_ItemPrice[igxecsgo_ItemCount2 - 1].innerText)).toFixed(4);
        var parent = $(this).parent().parent();
        var delayTimeE = delayTimeArr[igxecsgo_ItemCount2 - 1];
        $(delayTimeE).css("display", "none");
        var delayTimeTxt = delayTimeE.innerText;
        if ('可立即取回' === delayTimeTxt) {
            parent.after('<p style=\"font-size:14px;color:red;\">' + delayTimeTxt + '</p>');
        } else {
            parent.after('<p style=\"font-size:14px;color:green;\">' + delayTimeTxt + '</p>');
        }
        if (_ratio <= 0.5) {
            parent.after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#fff;\">' + _ratio + '</strong> ->先下手为强</p>');
            parent.parent().parent().css({"border": "2px solid #fff"});
            //layer.open({title: igxecsgo_Name, content: '本页有低于0.5比例的饰品!'});
        } else if (0.5 < _ratio && _ratio <= 0.6) {
            parent.after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#09f;\">' + _ratio + '</strong> ->好价速秒</p>');
            parent.parent().parent().css({"border": "2px solid #09f"});
        } else if (0.6 < _ratio && _ratio <= 0.7) {
            parent.after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#080;\">' + _ratio + '</strong> ->大商出货</p>');
            parent.parent().parent().css({"border": "2px solid #080"});
        } else if (0.7 < _ratio && _ratio <= 0.8) {
            parent.after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#a0ff58;\">' + _ratio + '</strong> ->正常贸易</p>');
            parent.parent().parent().css({"border": "2px solid #a0ff58"});
        } else if (0.8 < _ratio && _ratio <= 1) {
            parent.after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#f0ad4e;\">' + _ratio + '</strong> ->建议去Steam市场</p>');
            parent.parent().parent().css({"border": "2px solid #f0ad4e"});
            // $(this).parent().parent().parent().parent().remove();
        } else {
            parent.after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#c43f0f;\">' + _ratio + '</strong> ->玄学,静待有缘人</p>');
            parent.parent().parent().css({"border": "2px solid #c43f0f"});
            // $(this).parent().parent().parent().parent().remove();
        }
        igxecsgo_ItemCount2 += 1;
    });
    igxecsgo_ItemPrice.parent().attr('title', '非Steam市场均价!');

    //迅速标记
    {
        var salePriceStr = $($('.s3 strong')[0]).text();
        var miniSalePrice = parseFloat(salePriceStr);
        var match = window.location.href.match(/#([^#]+)$/im);
        if (match != null) {
            var suffixLogic = match[1];
            var salePriceStr = Alpha_Script.getParam(suffixLogic, 'salePrice');
            if (salePriceStr != null) {
                var salePrice = parseFloat(salePriceStr);
                if (miniSalePrice >= salePrice) {
                    $('ul.widget-filter > li:nth-child(1)').prepend('<strong style=\"color:#c43f0f;\">可赚：' + (miniSalePrice - salePrice).toFixed(2) + '</strong>');
                }
            }
        } else {
            // Match attempt failed
        }
    }

    {
        var clickFlag = false;
        var _id = setInterval(function () {
            var popSuc = $('.layui-layer-wrap');
            var display = $(popSuc).css('display');
            if (display === 'block' && !clickFlag) {
                var payOrder = $(popSuc).find('a')[0];
                $(payOrder).attr('target', '_blank');
                $(popSuc).find('a')[0].click();
                clickFlag = true;
            }
            if (display === 'none') {
                clickFlag = false;
            }
        }, 300);
    }

    {
        $('.mod-hotEquipment').each(function (index) {
            $(this).find('div.mod-hotEquipment-ft > a.com-btn.com-green.add-cart.category').before('<div style="display: flex;margin-left: 134px;"><input type="button" onclick="alipay();" class="payWays com-btn com-red" value="打开"/></div> ');
        });
    }
}

unsafeWindow.alipay = function () {
    if (sessionStorage.getItem('payWays') === 'alipay') {
        sessionStorage.setItem('payWays', 'normal');
    } else {
        sessionStorage.setItem('payWays', 'alipay');
    }
}

unsafeWindow.autoSure = function () {
    {
        if (sessionStorage.getItem('autoSure') === "true") {
            sessionStorage.setItem('autoSure', "false");//自动确定
        } else {
            sessionStorage.setItem('autoSure', "true");//自动确定
        }
    }
}

{
    var _id = setInterval(function () {
        var payWays = sessionStorage.getItem('payWays');
        if (payWays === 'alipay') {
            $('.payWays').val('关闭');
        } else {
            $('.payWays').val('打开');
        }

        var autoSure = sessionStorage.getItem('autoSure');
        if (autoSure === "true") {
            $('.autoSure').val('关闭');
        } else {
            $('.autoSure').val('打开');
        }

    }, 300);
}


function igxecsgo_ChechItemPriceRatio2() {//详情页方法
    var igxecsgo_ItemPrice = Number($('div.mod-equipmentDetail-bd > div.s2').last().find('b').text().replace('￥', '').trim());//市场价
    var igxecsgo_ItemPrice2 = Number($("div.s3 span strong").text().replace('￥', '').trim());//卖家价
    var _ratio = (igxecsgo_ItemPrice2 / igxecsgo_ItemPrice).toFixed(4);
    if (_ratio <= 0.5) {
        $("div.s3 span strong").parent().after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#fff;\">' + _ratio + '</strong> ->先下手为强</p>');
        //layer.open({title: igxecsgo_Name, content: '本页有低于0.5比例的饰品!'});
    } else if (0.5 < _ratio && _ratio <= 0.6) {
        $("div.s3 span strong").parent().after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#09f;\">' + _ratio + '</strong> ->好价速秒</p>');
    } else if (0.6 < _ratio && _ratio <= 0.7) {
        $("div.s3 span strong").parent().after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#080;\">' + _ratio + '</strong> ->大商出货</p>');
    } else if (0.7 < _ratio && _ratio <= 0.8) {
        $("div.s3 span strong").parent().after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#a0ff58;\">' + _ratio + '</strong> ->正常贸易</p>');
    } else if (0.8 < _ratio && _ratio <= 1) {
        $("div.s3 span strong").parent().after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#f0ad4e;\">' + _ratio + '</strong> ->建议去Steam市场看看</p>');
    } else {
        $("div.s3 span strong").parent().after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#c43f0f;\">' + _ratio + '</strong> ->玄学,静待有缘人</p>');
    }

    {
        var sName = $('.mod-equipmentDetail-bd h3').text().trim();
        var salePrice = $('.mod-equipmentDetail-bd .s3 span strong').text().trim().replace("￥", "");
        var exteriorIndex = $('.s1 span').text().trim().replace("外观: ", "");
        var rarityIndex = $('.s1 b').text().trim();
        var suffixLogic = '#salePrice=' + salePrice;
        //加入列表查询按钮
        $('.s4.js-add-cart-parent').append('<a href="https://www.igxe.cn/csgo/search/0_0?keyword=' +
            encodeURI(sName) +
            '&search_page_no=1&search_relate_price=&search_is_sticker=0&search_price_gte=&search_price_lte=&search_rarity_id=' +
            rarity(rarityIndex) +
            '&search_exterior_id=' +
            exterior(exteriorIndex) +
            '&search_is_stattrak=0&search_sort_key=2&search_sort_rule=0' +
            suffixLogic +
            '" target="_blank" class="com-btn com-red" style="overflow: visible;margin-bottom: 20px;" rel="nofollow">查看最低价</a>');
    }

    {
    }

}

var rarityArray = [];
rarityArray['588'] = '军规级';
rarityArray['600'] = '消费级';
rarityArray['608'] = '受限';
rarityArray['621'] = '隐秘';
rarityArray['627'] = '保密';
rarityArray['654'] = '非凡';
rarityArray['666'] = '工业级';
rarityArray['750'] = '违禁';
rarityArray['军规级'] = '588';
rarityArray['消费级'] = '600';
rarityArray['受限'] = '608';
rarityArray['隐秘'] = '621';
rarityArray['保密'] = '627';
rarityArray['非凡'] = '654';
rarityArray['工业级'] = '666';
rarityArray['违禁'] = '750';

function rarity(index) {
    return rarityArray[index];
}

var exteriorArray = [];
exteriorArray['589'] = '崭新出厂';
exteriorArray['595'] = '破损不堪';
exteriorArray['601'] = '久经沙场';
exteriorArray['609'] = '战痕累累';
exteriorArray['615'] = '略有磨损';
exteriorArray['728'] = '无涂装';

exteriorArray['崭新出厂'] = '589';
exteriorArray['破损不堪'] = '595';
exteriorArray['久经沙场'] = '601';
exteriorArray['战痕累累'] = '609';
exteriorArray['略有磨损'] = '615';
exteriorArray['无涂装'] = '728';

function exterior(index) {
    return exteriorArray[index];
}

function igxecsgo_SetOrder() {//订单页方法
    document.getElementById('buyer_name').value = (sessionStorage.getItem('buyer_name') === null) ? '' : sessionStorage.getItem('buyer_name');
    document.getElementById('pay-pwd').value = payPWD;
    layer.msg('已自动填写购买者名称', {offset: ['24px', '24px'], shift: 4});
    {
        var _id1 = setInterval(function () {
            var payWays = sessionStorage.getItem('payWays');
            if (payWays === 'alipay') {
                var radio = $('ul > li:nth-child(3) > label > input[type="radio"]');
                if (radio.length == 1) {
                    $(radio).attr("checked", 'checked');
                    {
                        if (!$('#pay_order').is(':disabled')) {
                            $('#pay_order').click();
                        }
                    }
                    clearInterval(_id1);
                }
            } else {

            }
        }, 300);
    }

    {
        var _id2 = setInterval(function () {
            var autoSure = sessionStorage.getItem('autoSure');
            if (autoSure === "true") {
                {
                    if (!$('#pay_order').is(':disabled')) {
                        $('#pay_order').click();
                        clearInterval(_id2);

                    }
                }
            } else {

            }
        }, 300);
    }

    {
        var _id3 = setInterval(function () {
            var autoSure = sessionStorage.getItem('autoSure');
            if (autoSure === "true") {
                {
                    if ($('div.layui-layer-btn > a.layui-layer-btn0').is(':visible')) {
                        $('div.layui-layer-btn > a.layui-layer-btn0').click();
                        clearInterval(_id3);

                    }
                }

            } else {

            }
        }, 300);
    }

    $('#pay_order').after('<input type="button" onclick="autoSure();" class="autoSure com-btn com-red" value="打开"/>');
}


function igxecsgo_SetOn() {//上架
    setInterval(function () {
        var spwd = document.getElementById('sale-trade-pwd');
        if (spwd) {
            if (spwd.value != putwayPWD) {
                spwd.value = putwayPWD;
            }
        }
    }, 100);
}

function igxecsgo_SetOn2() {//上架
    setInterval(function () {
        var spwd = document.getElementById('password');
        if (spwd) {
            if (spwd.value != putwayPWD) {
                spwd.value = putwayPWD;
            }
        }
    }, 100);
}

function igxecsgo_SetOn3() {//上架
    setInterval(function () {
        var spwd = document.getElementById('trade-pwd');
        if (spwd) {
            if (spwd.value != putwayPWD) {
                spwd.value = putwayPWD;
            }
        }
    }, 100);
}

(function () {
    if (location.pathname.indexOf('/category') > -1 || location.pathname.indexOf('/productlist') > -1 || location.pathname.indexOf('/shop') > -1 || location.pathname.indexOf('/search') > -1) {
        igxecsgo_ChechItemPriceRatio();
    }
    else if (location.pathname.indexOf('/product') > -1 && location.pathname.indexOf('/productlist') < 0) {
        igxecsgo_ChechItemPriceRatio2();
    }
    else if (location.pathname.indexOf('/payment_order') > -1) {
        igxecsgo_SetOrder();
    } else if (location.pathname.indexOf('/inventory/igxe/') > -1) {
        igxecsgo_SetOn();
    } else if (location.pathname.indexOf('/igxe_inventory') > -1) {
        igxecsgo_SetOn3();
    } else if (location.pathname.indexOf('/purchase/sell_') > -1) {
        igxecsgo_SetOn2();
    }
    else {
        layer.msg(igxecsgo_Name + '已载入', {offset: ['24px', '24px'], shift: 4});
    }
})();


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

