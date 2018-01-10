var THRB_TAG = {
    list: [],
    id: null,

    setId: function (id) {
        THRB_TAG.id = id;
    },

    loadAllTag: function () {
        THRB.request("/tagList", {}, function (data) {
            if (data.error == 0) {
                THRB_TAG.list = data.content;
                console.log(THRB_TAG.list);
            } else {
                console.error("tags 加载失败！");
            }
        });
    },

    findTag: function (tagName) {
        for (var i = 0; i < THRB_TAG.list.length; i++) {
            var item = THRB_TAG.list[i];
            if (tagName === item.name) {
                return item;
            }
        }
        return null;
    },

    loadMirrorTag: function (imgs) {
        var index = 0;
        while (true) {
            var i = index;
            index += 4;
            var ts = imgs.slice(i, index);
            if (ts && ts.length > 0) {
                THRB.request("/mirrorTags", {imgs: ts,mirrorId:THRB_TAG.id}, function (data) {
                    if (data.error == 0) {
                        for (var i = 0; i < data.content.length; i++) {
                            var item = data.content[i];
                            THRB_TAG.markTag(item.tag, item.img);
                        }
                    }
                })
            } else {
                return;
            }
        }
    },


    mark: function (tagName, href, element) {

        var tag = THRB_TAG.findTag(tagName);
        if (tag) {
            THRB.request("/addTag", {tagName: tagName, img: href, mirrorId: THRB_TAG.id}, function (data) {
                if (data.error == 0) {
                    THRB_TAG.markTag(tag, href);
                }
            });

            var nextTag = THRB_TAG.findTag("查看到此");
            // TODO 查看到此.‘查看到此’标签必须存在
            if (nextTag) {
                var photo = document.querySelectorAll(".follow.withFollow .about-user h2 a");
                for (var i = 0; i < photo.length; i++) {
                    var item = photo[i];

                    var hrefAttr = item.getAttribute("href");
                    if (hrefAttr == href) {
                        break;
                    }
                    if (this.checkImgTag(hrefAttr) == null) {
                        // fix : Mutable variable is accessible from closure
                        (function (img, tag) {
                            THRB.request("/addTag", {
                                tagName: "查看到此",
                                img: img,
                                mirrorId: THRB_TAG.id
                            }, function (data) {
                                if (data.error == 0) {
                                    THRB_TAG.markTag(tag, img);
                                }
                            });
                        })(hrefAttr, nextTag);
                    }
                }
            }
        } else {
            console.log("标签不存在 " + tagName);
        }
    },

    markTag: function (tag, href) {
        console.log(tag.name, href);
        var items = this.findAElement(href);
        console.log(tag.name, items);
        items.forEach(function (item) {
            var color = tag.color;
            var parentNode = item.parentNode.parentNode.parentNode;
            parentNode.setAttribute(THRB.tagAttr, tag.name);
            parentNode.style = "border: solid;border-bottom-color: " + color + ";border-top-color: " + color + ";border-left-color: " + color + ";border-right-color: " + color + ";";
        })
    },

    checkImgTag: function (img) {
        var items = this.findAElement(img);
        if (items && items.length > 0) {
            var attribute = items[0].parentNode.parentNode.parentNode.getAttribute(THRB.tagAttr);
            var tag = THRB_TAG.findTag(attribute);
            if (tag) {
                return tag;
            }
        }
        return null;
    },

    findAElement: function (img) {
        var items = [];
        if (img) {
            var a = document.querySelectorAll(".follow.withFollow .about-user h2 a");
            for (var i = 0; i < a.length; i++) {
                var item = a[i];
                var imgAttr = item.getAttribute("href");
                if (img === imgAttr) {
                    items.push(item);
                }
            }
        }
        return items;
    },

    setAllTagButton: function () {

        var following = document.querySelectorAll(".follow.withFollow .about-user h2 a");
        for (var i = 0; i < following.length; i++) {
            var item = following[i];

            var div = document.createElement("div");
            div.style = "padding-left: 272px;margin-top: 27px;";
            var id = item.getAttribute("href");
            for (var j = 0; j < this.list.length; j++) {
                var tag = this.list[j];

                var button = document.createElement("button");
                button.name = tag.name;
                button.style = "color: #FFF;background-color: " + tag.color + ";border-radius: 4px;border: 1px solid transparent;margin: 3px;font-weight:700;";
                button.setAttribute("onclick", "THRB_TAG.mark('" + tag.name + "','" + id + "',this)");
                button.innerHTML = tag.name;
                div.appendChild(button);
            }

            item.parentNode.parentNode.appendChild(div);
        }
    },
    allHref: function () {
        var imgs = [];
        var a = document.querySelectorAll(".follow.withFollow .about-user h2 a");
        for (var i = 0; i < a.length; i++) {
            var item = a[i];
            var href = item.getAttribute("href");
            imgs.push(href);
        }
        return imgs;
    }

};


var thrb_mirror_id = THRB.findParamsValue("thrb_mirror_id");
if (thrb_mirror_id) {
    THRB.onStopLoad(function () {
        setTimeout(function () {
            console.log("thrb_mirror_stop_load");
            THRB_TAG.setAllTagButton();
            THRB_TAG.loadMirrorTag(THRB_TAG.allHref());
        }, 500);
    });

    THRB_TAG.setId(thrb_mirror_id);
    THRB_TAG.loadAllTag();
}

console.log("tag.js");
