var haoutil = haoutil || {};
haoutil.version = "2.3",
haoutil.name = "木遥通用常用JS方法类库",
haoutil.author = "木遥（QQ：516584683） https://github.com/muyao1987/haoutil",
haoutil.msg = function(t) {
    window.toastr ? toastr.info(t) : window.layer ? layer.msg(t) : alert(t)
},
haoutil.tip = haoutil.msg,
haoutil.oneMsg = function(t, e) {
    haoutil.storage.get(e) || (haoutil.msg(t), haoutil.storage.add(e, !0))
},
haoutil.alert = function(t, e) {
    window.layer ? layer.alert(t, {
        title: e || "提示",
        skin: "layui-layer-lan layer-mars-dialog",
        closeBtn: 0,
        anim: 0
    }) : alert(t)
},
haoutil.loading = {
    index: -1,
    show: function(t) {
        this.close(),
        window.NProgress ? (t = t || {},
        t.color ? t.template = '<div class="bar ' + (t.className || "") + '" style="background-color:' + t.color + ';" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>': t.template = '<div class="bar ' + (t.className || "") + '" role="bar"></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>', NProgress.configure(t), NProgress.start()) : window.layer && (this.index = layer.load(2, {
            shade: [.3, "#000000"]
        }))
    },
    hide: function() {
        this.close()
    },
    close: function() {
        window.NProgress ? NProgress.done(!0) : window.layer && (this.index != -1 && layer.close(this.index), this.index = -1)
    }
},
window.noArrayPrototype || (Array.prototype.indexOf = Array.prototype.indexOf ||
function(t) {
    for (var e = 0; e < this.length; e++) if (this[e] == t) return e;
    return - 1
},
Array.prototype.remove = Array.prototype.remove ||
function(t) {
    for (var e = 0; e < this.length; e++) if (this[e] == t) {
        this.splice(e, 1);
        break
    }
},
Array.prototype.insert = Array.prototype.insert ||
function(t, e) {
    null == e && (e = 0),
    this.splice(e, 0, t)
}),
String.prototype.startsWith = String.prototype.startsWith ||
function(t) {
    return this.slice(0, t.length) == t
},
String.prototype.endsWith = String.prototype.endsWith ||
function(t) {
    return this.slice( - t.length) == t
},
String.prototype.replaceAll = String.prototype.replaceAll ||
function(t, e) {
    return this.replace(new RegExp(t, "gm"), e)
},
Date.prototype.format = function(t) {
    var e = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        S: this.getMilliseconds()
    },
    n = {
        0 : "日",
        1 : "一",
        2 : "二",
        3 : "三",
        4 : "四",
        5 : "五",
        6 : "六"
    };
    /(y+)/.test(t) && (t = t.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))),
    /(E+)/.test(t) && (t = t.replace(RegExp.$1, (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? "星期": "周": "") + n[this.getDay() + ""]));
    for (var r in e) new RegExp("(" + r + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[r] : ("00" + e[r]).substr(("" + e[r]).length)));
    return t
},
haoutil.color = function() {
    function t() {
        return "#" +
        function(t) {
            return (t += "0123456789abcdef" [Math.floor(16 * Math.random())]) && 6 == t.length ? t: arguments.callee(t)
        } ("")
    }
    return {
        random: t
    }
} (),
haoutil.cookie = function() {
    function t(t) {
        o = t
    }
    function e(t, e, n) {
        var r;
        n > 0 ? (r = new Date, r.setTime(r.getTime + 24 * n * 60 * 60 * 1e3)) : r = new Date(2147483647e3);
        var i = t + "=" + escape(e) + "; expires=" + r.toGMTString();
        o && null != window.plus ? plus.navigator.setCookie(t, i) : document.cookie = i
    }
    function n(t) {
        var e;
        if (o && null != window.plus) {
            if (e = plus.navigator.getCookie(t), null == e) return null
        } else e = document.cookie;
        for (var n = e.split("; "), r = 0; r < n.length; r++) {
            var i = n[r].split("=");
            if (i[0] == t) return unescape(i[1])
        }
        return null
    }
    function r(t) {
        if (o && null != window.plus) plus.navigator.removeCookie(t);
        else {
            var e = new Date;
            e.setTime(e.getTime() - 1e4),
            document.cookie = t + "=v; expires=" + e.toGMTString()
        }
    }
    var o;
    return {
        isH5Mobile: t,
        add: e,
        get: n,
        del: r
    }
} (),
haoutil.file = function() {
    function t(t, e) {
        var n = document.createElement("a");
        n.download = t,
        n.href = URL.createObjectURL(e),
        document.body.appendChild(n),
        n.click(),
        document.body.removeChild(n)
    }
    function e(e, n) {
        var r = new Blob([n]);
        t(e, r)
    }
    function n(e, n) {
        var o = n.toDataURL("image/png"),
        i = r(o);
        t(e + ".png", i)
    }
    function r(t) {
        for (var e = t.split(";base64,"), n = e[0].split(":")[1], r = window.atob(e[1]), o = r.length, i = new Uint8Array(o), a = 0; a < o; ++a) i[a] = r.charCodeAt(a);
        return new Blob([i], {
            type: n
        })
    }
    return {
        download: t,
        downloadFile: e,
        downloadImage: n,
        base64Img2Blob: r
    }
} (),
haoutil.isutil = function() {
    function t(t) {
        return "object" == typeof t && t.constructor == Array
    }
    function e(t) {
        return "string" == typeof t && t.constructor == String
    }
    function n(t) {
        return "number" == typeof t && t.constructor == Number
    }
    function r(t) {
        return "object" == typeof t && t.constructor == Date
    }
    function o(t) {
        return "function" == typeof t && t.constructor == Function
    }
    function i(t) {
        return "object" == typeof t && t.constructor == Object
    }
    function a(t) {
        return null == t || (!(!e(t) || "" != t) || !(!n(t) || !isNaN(t)))
    }
    function u(t) {
        return ! a(t)
    }
    return {
        isNull: a,
        isNotNull: u,
        isArray: t,
        isString: e,
        isNumber: n,
        isDate: r,
        isFunction: o,
        isObject: i
    }
} (),
haoutil.math = function() {
    function t(t, e) {
        return Math.floor(Math.random() * (e - t + 1) + t)
    }
    function e(e) {
        var n = t(0, e.length - 1);
        return e[n]
    }
    function r(t, e) {
        t = String(t);
        for (var e = t.length; e < n;) t = "0" + t,
        e++;
        return t
    }
    return {
        getArrayRandomOne: e,
        random: t,
        padLeft0: r
    }
} (),
haoutil.storage = function() {
    function t(t, e) {
        r = window.localStorage,
        r.setItem(t, e)
    }
    function e(t) {
        r = window.localStorage;
        var e = r.getItem(t);
        return e
    }
    function n(t) {
        r = window.localStorage,
        r.removeItem(t)
    }
    var r;
    return {
        add: t,
        get: e,
        del: n
    }
} (),
haoutil.str = function() {
    function t(t) {
        var e = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
        return !! e.exec(t)
    }
    function e(t) {
        var e = Number(t);
        return e < 1e3 ? e.toFixed(2) + "米": (e / 1e3).toFixed(2) + "千米"
    }
    function n(t) {
        Number(t);
        return t < 1e6 ? t.toFixed(2) + "平方米": (t / 1e6).toFixed(2) + "平方公里"
    }
    function r(t) {
        Number(t);
        return t < 60 ? t.toFixed(0) + "秒": t >= 60 && t < 3600 ? Math.floor(t / 60) + "分钟" + Math.floor(t % 60) + "秒": (t = Math.floor(t / 60), Math.floor(t / 60) + "小时" + Math.floor(t % 60) + "分钟")
    }
    function o(t) {
        for (var e = "",
        n = t.length % 6,
        r = t.substr(0, t.length - n), o = t.substr(t.length - n, n), i = 0; i < r.length; i += 6) {
            var a = parseInt(r.substr(i, 6), 2);
            e += c[a]
        }
        return o += new Array(7 - n).join("0"),
        n && (e += c[parseInt(o, 2)], e += new Array((6 - n) / 2 + 1).join("=")),
        e
    }
    function i(t) {
        for (var e = "",
        n = 0,
        r = 0; r < t.length; r++) if ("=" != t[r]) {
            var o = c.indexOf(t[r]).toString(2);
            e += new Array(7 - o.length).join("0") + o
        } else n++;
        return e.substr(0, e.length - 2 * n)
    }
    function a(t) {
        for (var e = "",
        n = 0; n < t.length; n++) {
            var r = t.charCodeAt(n).toString(2);
            e += new Array(9 - r.length).join("0") + r
        }
        return e
    }
    function u(t) {
        for (var e = "",
        n = 0; n < t.length; n += 8) e += String.fromCharCode(parseInt(t.substr(n, 8), 2));
        return e
    }
    function s(t) {
        return o(a(t))
    }
    function l(t) {
        return u(i(t))
    }
    var c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
    return {
        isChinese: t,
        formatLength: e,
        formatArea: n,
        formatTime: r,
        base64: s,
        decodeBase64: l
    }
} (),
haoutil.system = function() {
    function t() {
        var t = location.search,
        e = new Object;
        if (t.indexOf("?") != -1) for (var n = t.substr(1), r = n.split("&"), o = 0; o < r.length; o++) e[r[o].split("=")[0]] = decodeURI(r[o].split("=")[1]);
        return e
    }
    function e(t, e) {
        var n = new RegExp("(^|&)" + t + "=([^&]*)(&|$)", "i"),
        r = window.location.search.substr(1).match(n);
        return null != r ? decodeURI(r[2]) : e
    }
    function n() {
        return "undefined" != typeof window.innerWidth ? {
            width: window.innerWidth,
            height: window.innerHeight
        }: {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }
    }
    function r() {
        var t = window.navigator.userAgent.toLowerCase();
        if (t.indexOf("msie") >= 0) {
            var e = Number(t.match(/msie ([\d]+)/)[1]);
            return {
                type: "IE",
                version: e
            }
        }
        if (t.indexOf("firefox") >= 0) {
            var e = Number(t.match(/firefox\/([\d]+)/)[1]);
            return {
                type: "Firefox",
                version: e
            }
        }
        if (t.indexOf("chrome") >= 0) {
            var e = Number(t.match(/chrome\/([\d]+)/)[1]);
            return {
                type: "Chrome",
                version: e
            }
        }
        if (t.indexOf("opera") >= 0) {
            var e = Number(t.match(/opera.([\d]+)/)[1]);
            return {
                type: "Opera",
                version: e
            }
        }
        if (t.indexOf("Safari") >= 0) {
            var e = Number(t.match(/version\/([\d]+)/)[1]);
            return {
                type: "Safari",
                version: e
            }
        }
        return {
            type: t,
            version: -1
        }
    }
    function o() {
        var t = navigator.userAgent.toLowerCase(),
        e = "ipad" == t.match(/ipad/i),
        n = "iphone" == t.match(/iphone/i),
        r = "midp" == t.match(/midp/i),
        o = "rv:1.2.3.4" == t.match(/rv:1.2.3.4/i),
        i = "ucweb" == t.match(/ucweb/i),
        a = "android" == t.match(/android/i),
        u = "windows ce" == t.match(/windows ce/i),
        s = "windows mobile" == t.match(/windows mobile/i);
        return ! (e || n || r || o || i || a || u || s)
    }
    function i(t) {
        if (null == t || "object" != typeof t) return t;
        if (t instanceof Date) {
            var e = new Date;
            return e.setTime(t.getTime()),
            e
        }
        if (t instanceof Array) {
            for (var e = [], n = 0, r = t.length; n < r; ++n) e[n] = i(t[n]);
            return e
        }
        if ("object" == typeof t) {
            var e = {};
            for (var o in t)"_layer" != o && "_layers" != o && "_parent" != o && t.hasOwnProperty(o) && (e[o] = i(t[o]));
            return e
        }
        return t
    }
    function a(t, e, n) {
        var r = function(t, e, n) {
            var r = Math.random().toString().replace(".", ""),
            o = "my_json_cb_" + r;
            window[o] = n;
            var i = t.indexOf("?") == -1 ? "?": "&";
            for (var a in e) i += a + "=" + e[a] + "&";
            i += "callback=" + o;
            var u = document.createElement("script");
            u.src = t + i,
            document.body.appendChild(u)
        };
        window.$jsonp = r
    }
    function u(t, e) {
        $.ajax({
            url: t,
            type: "GET",
            dataType: "html",
            timeout: 0,
            success: function(t) {
                e(t)
            }
        })
    }
    function s(t, e) {
        var n = document.createElement("link");
        n.rel = "stylesheet",
        n.async = e,
        n.href = t,
        d.appendChild(n)
    }
    function l(t, e) {
        var n = document.createElement("script");
        n.charset = "utf-8",
        n.async = e,
        n.src = t,
        d.appendChild(n)
    }
    function c(t, e) {
        f.test(t) ? s(t, e) : l(t, e)
    }
    var d = document.head || document.getElementsByTagName("head")[0],
    f = new RegExp("\\.css");
    return {
        getRequest: t,
        getRequestByName: e,
        getExplorerInfo: r,
        isPCBroswer: o,
        clone: i,
        jsonp: a,
        getWindowSize: n,
        getHtml: u,
        loadCss: s,
        loadJs: l,
        loadResource: c
    }
} ();