// ==UserScript==
// @name         外卖商家提取人by SeLang
// @namespace    http://cmsv1.findmd5.com/
// @version      0.1
// @description  目标是提取商家基本信息，有想法的请反馈。QQ群号：455809302,点击链接加入群【油猴脚本私人定制】：https://jq.qq.com/?_wv=1027&k=45p9bea。
// @author       selang
// @include       /https?\:\/\/waimai\.meituan\.com/
// @require       https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require       https://raw.githubusercontent.com/dchester/jsonpath/0.2.10/jsonpath.min.js
// @connect      *
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_getTab
// @grant        GM_getTabs
// @grant        GM_saveTab
// @grant        GM_xmlhttpRequest
// ==/UserScript==

//图灵机器人key,改这里
var tulingKey = '64b194e6e27740fcbee72869d1b8ec81';

(function() {
    'use strict';
    ///geo/geohash?lat=30.796654&lng=106.09299&addr=%25E6%2596%2587%25E5%258C%2596%25E8%25B7%25AF&from=m
    priorityLog('看到这里，你肯定是个老司机了。欢迎老司机进群：455809302交流。一起玩。\r\n如果不是老司机，只要有创意也欢迎加入。点击链接加入群【油猴脚本私人级别定制】：https://jq.qq.com/?_wv=1027&k=460soLy');
    collectoerResult('https://waimai.meituan.com/ajax/poilist');
})();

function collectoerResult(url) {
    var urlFormObj = {
        classify_type: 'cate_all',
        sort_type: '0',
        price_type: '0',
        support_online_pay: '0',
        support_invoice: '0',
        support_logistic: '0',
        page_offset: '21',
        page_size: '20'
    };
    url+='?_token='+Rohr_Opt.reload(urlFormObj);
    log(url);
    obtainHtml_POST(url,
        urlEncode(urlFormObj),
        function(responseText) {
            var json=JSON.parse(responseText);
            log(json);
            var findObj=jsonpath.query(json,'$..wmPoi4Web');
            var filterArr=['name','address','call_center','latitude','longitude','month_sale_num'];
            findObj.forEach( function(element, index) {
            //     log(element.filter(entry){
            //         log('-->'+entry);
            // });
        });
}

function deepFind(obj, path) {
  var paths = path.split('.')
    , current = obj
    , i;

  for (i = 0; i < paths.length; ++i) {
    if (current[paths[i]] == undefined) {
      return undefined;
    } else {
      current = current[paths[i]];
    }
  }
  return current;
}

//获取参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

//日志
function log(c) {
    if (true) {
        console.log(c);
    }
}

function priorityLog(c) {
    console.log(c);
}


/**
 * param 将要转为URL参数字符串的对象
 * key URL参数字符串的前缀
 * encode true/false 是否进行URL编码,默认为true
 * 
 * return URL参数字符串
 */
function urlEncode(param, key, encode) {
    if (param == null) return '';
    var paramStr = '';
    var t = typeof(param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
    }
    else {
        for (var i in param) {
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
            paramStr += urlEncode(param[i], k, encode);
        }
    }
    return paramStr;
};

function obtainHtml_POST(url, str, callback) {
    log(str);
    GM_xmlhttpRequest({
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: str,
        url: url,
        onload: function(response) {
            callback(response.responseText);
        }
    });
}