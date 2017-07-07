// ==UserScript==
// @name         IGXE-CSGO助手
// @namespace    http://www.ragnaroks.org/
// @version      0.2.3
// @description  为IGXE-CSGO提供价格比例等功能 修复了BUG
// @author       Ragnaroks
// @include      /https?:\/\/www\.igxe\.cn/
// @run-at       document-end
// ==/UserScript==
var igxecsgo_Name = 'IGXE-CSGO助手 v0.2.3';
var buyer_name = (jQuery('.com-menu a:nth-child(2)').text() === '') ? '无名氏' : jQuery('.com-menu a:nth-child(2)').text();
sessionStorage.setItem('buyer_name', buyer_name);

function igxecsgo_ChechItemPriceRatio() {//列表页方法
    var igxecsgo_ItemPrice = jQuery("div.s2 span b");//市场价
    var igxecsgo_ItemPrice2 = jQuery("div.s3 span strong");//卖家价
    var igxecsgo_ItemCount2 = 1;
    igxecsgo_ItemPrice2.each(function () {
        var _ratio = (Number(igxecsgo_ItemPrice2[igxecsgo_ItemCount2 - 1].innerText) / Number(igxecsgo_ItemPrice[igxecsgo_ItemCount2 - 1].innerText)).toFixed(4);
        if (_ratio <= 0.5) {
            jQuery(this).parent().parent().after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#fff;\">' + _ratio + '</strong> ->先下手为强</p>');
            jQuery(this).parent().parent().parent().parent().css({"border": "2px solid #fff"});
            layer.open({title: igxecsgo_Name, content: '本页有低于0.5比例的饰品!'});
        } else if (0.5 < _ratio && _ratio <= 0.65) {
            jQuery(this).parent().parent().after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#09f;\">' + _ratio + '</strong> ->好价速秒</p>');
            jQuery(this).parent().parent().parent().parent().css({"border": "2px solid #09f"});
        } else if (0.65 < _ratio && _ratio <= 0.75) {
            jQuery(this).parent().parent().after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#080;\">' + _ratio + '</strong> ->大商出货</p>');
            jQuery(this).parent().parent().parent().parent().css({"border": "2px solid #080"});
        } else if (0.75 < _ratio && _ratio <= 0.85) {
            jQuery(this).parent().parent().after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#a0ff58;\">' + _ratio + '</strong> ->正常贸易</p>');
            jQuery(this).parent().parent().parent().parent().css({"border": "2px solid #a0ff58"});
        } else if (0.85 < _ratio && _ratio <= 1) {
            jQuery(this).parent().parent().after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#f0ad4e;\">' + _ratio + '</strong> ->建议去Steam市场</p>');
            jQuery(this).parent().parent().parent().parent().css({"border": "2px solid #f0ad4e"});
        } else {
            jQuery(this).parent().parent().after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#c43f0f;\">' + _ratio + '</strong> ->玄学,静待有缘人</p>');
            jQuery(this).parent().parent().parent().parent().css({"border": "2px solid #c43f0f"});
        }
        igxecsgo_ItemCount2 += 1;
    });
    igxecsgo_ItemPrice.parent().attr('title', '非Steam市场均价!');
}
function igxecsgo_ChechItemPriceRatio2() {//详情页方法
    var igxecsgo_ItemPrice = Number(jQuery("div.s2 span b").text().replace('￥', '').trim());//市场价
    var igxecsgo_ItemPrice2 = Number(jQuery("div.s3 span strong").text().replace('￥', '').trim());//卖家价
    var _ratio = (igxecsgo_ItemPrice2 / igxecsgo_ItemPrice).toFixed(4);
    if (_ratio <= 0.5) {
        jQuery("div.s3 span strong").parent().after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#fff;\">' + _ratio + '</strong> ->先下手为强</p>');
        layer.open({title: igxecsgo_Name, content: '本页有低于0.5比例的饰品!'});
    } else if (0.5 < _ratio && _ratio <= 0.65) {
        jQuery("div.s3 span strong").parent().after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#09f;\">' + _ratio + '</strong> ->好价速秒</p>');
    } else if (0.65 < _ratio && _ratio <= 0.75) {
        jQuery("div.s3 span strong").parent().after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#080;\">' + _ratio + '</strong> ->大商出货</p>');
    } else if (0.75 < _ratio && _ratio <= 0.85) {
        jQuery("div.s3 span strong").parent().after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#a0ff58;\">' + _ratio + '</strong> ->正常贸易</p>');
    } else if (0.85 < _ratio && _ratio <= 1) {
        jQuery("div.s3 span strong").parent().after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#f0ad4e;\">' + _ratio + '</strong> ->建议去Steam市场看看</p>');
    } else {
        jQuery("div.s3 span strong").parent().after('<p style=\"font-size:14px;\">比例: <strong style=\"color:#c43f0f;\">' + _ratio + '</strong> ->玄学,静待有缘人</p>');
    }
}
function igxecsgo_SetOrder() {//订单页方法
    documnet.getElementById('buyer_name').value = (sessionStorage.getItem('buyer_name') === null) ? '' : sessionStorage.getItem('buyer_name');
    layer.msg('已自动填写购买者名称', {offset: ['24px', '24px'], shift: 4});
}

(function () {
    document.title += ' | ' + igxecsgo_Name + '已载入';
    if (location.pathname.indexOf('/category') > -1 || location.pathname.indexOf('/productlist') > -1 || location.pathname.indexOf('/shop') > -1 || location.pathname.indexOf('/search') > -1) {
        igxecsgo_ChechItemPriceRatio();
    }
    else if (location.pathname.indexOf('/product') > -1 && location.pathname.indexOf('/productlist') < 0) {
        igxecsgo_ChechItemPriceRatio2();
    }
    else if (location.pathname.indexOf('/payment_order') > -1) {
        igxecsgo_SetOrder();
    }
    else {
        layer.msg(igxecsgo_Name + '已载入', {offset: ['24px', '24px'], shift: 4});
    }
})();