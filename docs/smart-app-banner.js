(function(u) {
    "object" === typeof exports && "undefined" !== typeof module ? module.exports = u() : "function" === typeof define && define.amd ? define([], u) : ("undefined" !== typeof window ? window : "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : this).SmartBanner = u()
})(function() {
    return function c(f, h, e) {
        function b(d, v) {
            if (!h[d]) {
                if (!f[d]) {
                    var g = "function" == typeof require && require;
                    if (!v && g) return g(d, !0);
                    if (a) return a(d, !0);
                    g = Error("Cannot find module '" + d + "'");
                    throw g.code = "MODULE_NOT_FOUND", g;
                }
                g = h[d] = {
                    exports: {}
                };
                f[d][0].call(g.exports, function(a) {
                    var e = f[d][1][a];
                    return b(e ? e : a)
                }, g, g.exports, c, f, h, e)
            }
            return h[d].exports
        }
        for (var a = "function" == typeof require && require, d = 0; d < e.length; d++) b(e[d]);
        return b
    }({
        1: [function(c, f, h) {
            var e = c("xtend/mutable"),
                b = c("component-query"),
                a = c("get-doc"),
                d = c("cookie-cutter"),
                g = c("ua-parser-js"),
                v = (navigator.language || navigator.userLanguage || navigator.browserLanguage).slice(-2) || "us",
                p = a && a.documentElement,
                l = {
                    ios: {
                        appMeta: "apple-itunes-app",
                        iconRels: ["apple-touch-icon-precomposed",
                            "apple-touch-icon"
                        ],
                        getStoreLink: function() {
                            return "https://itunes.apple.com/" + this.options.appStoreLanguage + "/app/id" + this.appId + "?mt=8"
                        }
                    },
                    android: {
                        appMeta: "google-play-app",
                        iconRels: ["android-touch-icon", "apple-touch-icon-precomposed", "apple-touch-icon"],
                        getStoreLink: function() {
                            return "http://play.google.com/store/apps/details?id=" + this.appId
                        }
                    },
                    windows: {
                        appMeta: "msApplication-ID",
                        iconRels: ["windows-touch-icon", "apple-touch-icon-precomposed", "apple-touch-icon"],
                        getStoreLink: function() {
                            return "http://www.windowsphone.com/s?appid=" +
                                this.appId
                        }
                    }
                };
            c = function(a) {
                var b = g(navigator.userAgent);
                this.options = e({}, {
                    daysHidden: 15,
                    daysReminder: 90,
                    appStoreLanguage: v,
                    button: "OPEN",
                    store: {
                        ios: "On the App Store",
                        android: "In Google Play",
                        windows: "In the Windows Store"
                    },
                    price: {
                        ios: "FREE",
                        android: "FREE",
                        windows: "FREE"
                    },
                    theme: "",
                    icon: "",
                    force: ""
                }, a || {});
                this.options.force ? this.type = this.options.force : "Windows Phone" === b.os.name || "Windows Mobile" === b.os.name ? this.type = "windows" : "iOS" === b.os.name ? this.type = "ios" : "Android" === b.os.name && (this.type =
                    "android");
                a = !this.type || !this.options.store[this.type];
                var m = "ios" === this.type && "Mobile Safari" === b.browser.name && 6 <= parseInt(b.os.version, 10),
                    r = navigator.standalone,
                    w = d.get("smartbanner-closed"),
                    q = d.get("smartbanner-installed");
                a || m || r || w || q || (e(this, l[this.type]), !this.parseAppId() && "IOS" === b.os.name && "Safari" === b.browser.name) || (this.create(), this.show())
            };
            c.prototype = {
                constructor: c,
                create: function() {
                    var d = this.getStoreLink(),
                        e = this.options.price[this.type] + " - " + this.options.store[this.type],
                        m;
                    if (this.options.icon) m = this.options.icon;
                    else
                        for (var r = 0; r < this.iconRels.length; r++) {
                            var g = b('link[rel="' + this.iconRels[r] + '"]');
                            if (g) {
                                m = g.getAttribute("href");
                                break
                            }
                        }
                    var q = a.createElement("div");
                    q.className = "smartbanner smartbanner-" + (this.options.theme || this.type);
                    q.innerHTML = '<div class="smartbanner-container"><a href="javascript:void(0);" class="smartbanner-close">&times;</a><span class="smartbanner-icon" style="background-image: url(' + m + ')"></span><div class="smartbanner-info"><div class="smartbanner-title">' +
                        this.options.title + "</div><div>" + this.options.author + "</div><span>" + e + '</span></div><a onclick=' +
                    'gotomobileapp()'
                     +'class="smartbanner-button"><span class="smartbanner-button-text">' + this.options.button + "</span></a></div>";
                    a.body ? a.body.appendChild(q) : a && a.addEventListener("DOMContentLoaded", function() {
                        a.body.appendChild(q)
                    });
                    b(".smartbanner-button", q).addEventListener("click", this.install.bind(this), !1);
                    b(".smartbanner-close", q).addEventListener("click", this.close.bind(this), !1)
                },
                hide: function() {
                    p.classList.remove("smartbanner-show");
                    if ("function" === typeof this.options.close) return this.options.close()
                },
                show: function() {
                    p.classList.add("smartbanner-show");
                    if ("function" === typeof this.options.show) return this.options.show()
                },
                close: function() {
                    this.hide();
                    d.set("smartbanner-closed", "true", {
                        path: "/",
                        expires: new Date(Number(new Date) + 864E5 * this.options.daysHidden)
                    });
                    if ("function" === typeof this.options.close) return this.options.close()
                },
                install: function() {
                    this.hide();
                    d.set("smartbanner-installed", "true", {
                        path: "/",
                        expires: new Date(Number(new Date) +
                            864E5 * this.options.daysReminder)
                    });
                    if ("function" === typeof this.options.close) return this.options.close()
                },
                parseAppId: function() {
                    var a = b('meta[name="' + this.appMeta + '"]');
                    if (a) return this.appId = "windows" === this.type ? a.getAttribute("content") : /app-id=([^\s,]+)/.exec(a.getAttribute("content"))[1]
                }
            };
            f.exports = c
        }, {
            "component-query": 2,
            "cookie-cutter": 3,
            "get-doc": 4,
            "ua-parser-js": 6,
            "xtend/mutable": 7
        }],
        2: [function(c, f, h) {
            function e(b, a) {
                return a.querySelector(b)
            }
            h = f.exports = function(b, a) {
                a = a || document;
                return e(b,
                    a)
            };
            h.all = function(b, a) {
                a = a || document;
                return a.querySelectorAll(b)
            };
            h.engine = function(b) {
                if (!b.one) throw Error(".one callback required");
                if (!b.all) throw Error(".all callback required");
                e = b.one;
                h.all = b.all;
                return h
            }
        }, {}],
        3: [function(c, f, h) {
            h = f.exports = function(e) {
                e || (e = {});
                "string" === typeof e && (e = {
                    cookie: e
                });
                void 0 === e.cookie && (e.cookie = "");
                return {
                    get: function(b) {
                        for (var a = e.cookie.split(/;\s*/), d = 0; d < a.length; d++) {
                            var g = a[d].split("=");
                            if (unescape(g[0]) === b) return unescape(g[1])
                        }
                    },
                    set: function(b,
                        a, d) {
                        d || (d = {});
                        b = escape(b) + "=" + escape(a);
                        d.expires && (b += "; expires=" + d.expires);
                        d.path && (b += "; path=" + escape(d.path));
                        return e.cookie = b
                    }
                }
            };
            "undefined" !== typeof document && (c = h(document), h.get = c.get, h.set = c.set)
        }, {}],
        4: [function(c, f, h) {
            c = c("has-dom");
            f.exports = c() ? document : null
        }, {
            "has-dom": 5
        }],
        5: [function(c, f, h) {
            f.exports = function() {
                return "undefined" !== typeof window && "undefined" !== typeof document && "function" === typeof document.createElement
            }
        }, {}],
        6: [function(c, f, h) {
            (function(e, b) {
                var a = {
                        extend: function(a,
                            b) {
                            var d = {},
                                m;
                            for (m in a) d[m] = b[m] && 0 === b[m].length % 2 ? b[m].concat(a[m]) : a[m];
                            return d
                        },
                        has: function(a, b) {
                            return "string" === typeof a ? -1 !== b.toLowerCase().indexOf(a.toLowerCase()) : !1
                        },
                        lowerize: function(a) {
                            return a.toLowerCase()
                        },
                        major: function(a) {
                            return "string" === typeof a ? a.split(".")[0] : b
                        },
                        trim: function(a) {
                            return a.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
                        }
                    },
                    d = function() {
                        for (var a, d = 0, e, g, c, k, h, f, l = arguments; d < l.length && !h;) {
                            var p = l[d],
                                n = l[d + 1];
                            if ("undefined" === typeof a)
                                for (c in a = {}, n) n.hasOwnProperty(c) &&
                                    (k = n[c], "object" === typeof k ? a[k[0]] = b : a[k] = b);
                            for (e = g = 0; e < p.length && !h;)
                                if (h = p[e++].exec(this.getUA()))
                                    for (c = 0; c < n.length; c++) f = h[++g], k = n[c], "object" === typeof k && 0 < k.length ? 2 == k.length ? a[k[0]] = "function" == typeof k[1] ? k[1].call(this, f) : k[1] : 3 == k.length ? a[k[0]] = "function" !== typeof k[1] || k[1].exec && k[1].test ? f ? f.replace(k[1], k[2]) : b : f ? k[1].call(this, f, k[2]) : b : 4 == k.length && (a[k[0]] = f ? k[3].call(this, f.replace(k[1], k[2])) : b) : a[k] = f ? f : b;
                            d += 2
                        }
                        return a
                    },
                    g = function(d, e) {
                        for (var c in e)
                            if ("object" === typeof e[c] &&
                                0 < e[c].length)
                                for (var g = 0; g < e[c].length; g++) {
                                    if (a.has(e[c][g], d)) return "?" === c ? b : c
                                } else if (a.has(e[c], d)) return "?" === c ? b : c;
                        return d
                    },
                    c = {
                        ME: "4.90",
                        "NT 3.11": "NT3.51",
                        "NT 4.0": "NT4.0",
                        2E3: "NT 5.0",
                        XP: ["NT 5.1", "NT 5.2"],
                        Vista: "NT 6.0",
                        7: "NT 6.1",
                        8: "NT 6.2",
                        "8.1": "NT 6.3",
                        10: ["NT 6.4", "NT 10.0"],
                        RT: "ARM"
                    },
                    p = {
                        browser: [
                            [/(opera\smini)\/([\w\.-]+)/i, /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i, /(opera).+version\/([\w\.]+)/i, /(opera)[\/\s]+([\w\.]+)/i],
                            ["name", "version"],
                            [/(OPiOS)[\/\s]+([\w\.]+)/i],
                            [
                                ["name",
                                    "Opera Mini"
                                ], "version"
                            ],
                            [/\s(opr)\/([\w\.]+)/i],
                            [
                                ["name", "Opera"], "version"
                            ],
                            [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i, /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i, /(?:ms|\()(ie)\s([\w\.]+)/i, /(rekonq)\/([\w\.]+)*/i, /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs)\/([\w\.-]+)/i],
                            ["name", "version"],
                            [/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i],
                            [
                                ["name", "IE"], "version"
                            ],
                            [/(edge)\/((\d+)?[\w\.]+)/i],
                            ["name", "version"],
                            [/(yabrowser)\/([\w\.]+)/i],
                            [
                                ["name", "Yandex"], "version"
                            ],
                            [/(comodo_dragon)\/([\w\.]+)/i],
                            [
                                ["name", /_/g, " "], "version"
                            ],
                            [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i],
                            ["name", "version"],
                            [/(MicroMessenger)\/([\w\.]+)/i],
                            [
                                ["name", "WeChat"], "version"
                            ],
                            [/(qqbrowser)[\/\s]?([\w\.]+)/i],
                            ["name", "version"],
                            [/(uc\s?browser)[\/\s]?([\w\.]+)/i, /ucweb.+(ucbrowser)[\/\s]?([\w\.]+)/i, /JUC.+(ucweb)[\/\s]?([\w\.]+)/i],
                            [
                                ["name", "UCBrowser"], "version"
                            ],
                            [/(dolfin)\/([\w\.]+)/i],
                            [
                                ["name", "Dolphin"], "version"
                            ],
                            [/((?:android.+)crmo|crios)\/([\w\.]+)/i],
                            [
                                ["name", "Chrome"], "version"
                            ],
                            [/XiaoMi\/MiuiBrowser\/([\w\.]+)/i],
                            ["version", ["name", "MIUI Browser"]],
                            [/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)/i],
                            ["version", ["name", "Android Browser"]],
                            [/FBAV\/([\w\.]+);/i],
                            ["version", ["name", "Facebook"]],
                            [/fxios\/([\w\.-]+)/i],
                            ["version", ["name", "Firefox"]],
                            [/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i],
                            ["version", ["name", "Mobile Safari"]],
                            [/version\/([\w\.]+).+?(mobile\s?safari|safari)/i],
                            ["version", "name"],
                            [/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],
                            ["name", ["version", g, {
                                "1.0": "/8",
                                "1.2": "/1",
                                "1.3": "/3",
                                "2.0": "/412",
                                "2.0.2": "/416",
                                "2.0.3": "/417",
                                "2.0.4": "/419",
                                "?": "/"
                            }]],
                            [/(konqueror)\/([\w\.]+)/i, /(webkit|khtml)\/([\w\.]+)/i],
                            ["name", "version"],
                            [/(navigator|netscape)\/([\w\.-]+)/i],
                            [
                                ["name", "Netscape"], "version"
                            ],
                            [/(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i, /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,
                                /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i, /(links)\s\(([\w\.]+)/i, /(gobrowser)\/?([\w\.]+)*/i, /(ice\s?browser)\/v?([\w\._]+)/i, /(mosaic)[\/\s]([\w\.]+)/i
                            ],
                            ["name", "version"]
                        ],
                        cpu: [
                            [/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],
                            [
                                ["architecture", "amd64"]
                            ],
                            [/(ia32(?=;))/i],
                            [
                                ["architecture", a.lowerize]
                            ],
                            [/((?:i[346]|x)86)[;\)]/i],
                            [
                                ["architecture", "ia32"]
                            ],
                            [/windows\s(ce|mobile);\sppc;/i],
                            [
                                ["architecture", "arm"]
                            ],
                            [/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],
                            [
                                ["architecture", /ower/, "", a.lowerize]
                            ],
                            [/(sun4\w)[;\)]/i],
                            [
                                ["architecture", "sparc"]
                            ],
                            [/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i],
                            [
                                ["architecture", a.lowerize]
                            ]
                        ],
                        device: [
                            [/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i],
                            [
                                ["vendor", a.trim],
                                ["model", a.trim],
                                ["type", "smarttv"]
                            ],
                            [/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i],
                            ["model", "vendor", ["type", "tablet"]],
                            [/applecoremedia\/[\w\.]+ \((ipad)/],
                            ["model", ["vendor", "Apple"],
                                ["type",
                                    "tablet"
                                ]
                            ],
                            [/(apple\s{0,1}tv)/i],
                            [
                                ["model", "Apple TV"],
                                ["vendor", "Apple"]
                            ],
                            [/(archos)\s(gamepad2?)/i, /(hp).+(touchpad)/i, /(hp).+(tablet)/i, /(kindle)\/([\w\.]+)/i, /\s(nook)[\w\s]+build\/(\w+)/i, /(dell)\s(strea[kpr\s\d]*[\dko])/i],
                            ["vendor", "model", ["type", "tablet"]],
                            [/(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i],
                            ["model", ["vendor", "Amazon"],
                                ["type", "tablet"]
                            ],
                            [/(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i],
                            [
                                ["model", g, {
                                    "Fire Phone": ["SD", "KF"]
                                }],
                                ["vendor", "Amazon"],
                                ["type", "mobile"]
                            ],
                            [/\((ip[honed|\s\w*]+);.+(apple)/i],
                            ["model", "vendor", ["type", "mobile"]],
                            [/\((ip[honed|\s\w*]+);/i],
                            ["model", ["vendor", "Apple"],
                                ["type", "mobile"]
                            ],
                            [/(blackberry)[\s-]?(\w+)/i, /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i, /(hp)\s([\w\s]+\w)/i, /(asus)-?(\w+)/i],
                            ["vendor", "model", ["type", "mobile"]],
                            [/\(bb10;\s(\w+)/i],
                            ["model", ["vendor", "BlackBerry"],
                                ["type", "mobile"]
                            ],
                            [/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7)/i],
                            ["model", ["vendor", "Asus"],
                                ["type", "tablet"]
                            ],
                            [/(sony)\s(tablet\s[ps])\sbuild\//i, /(sony)?(?:sgp.+)\sbuild\//i],
                            [
                                ["vendor", "Sony"],
                                ["model", "Xperia Tablet"],
                                ["type", "tablet"]
                            ],
                            [/(?:sony)?(?:(?:(?:c|d)\d{4})|(?:so[-l].+))\sbuild\//i],
                            [
                                ["vendor", "Sony"],
                                ["model", "Xperia Phone"],
                                ["type", "mobile"]
                            ],
                            [/\s(ouya)\s/i, /(nintendo)\s([wids3u]+)/i],
                            ["vendor", "model", ["type", "console"]],
                            [/android.+;\s(shield)\sbuild/i],
                            ["model", ["vendor", "Nvidia"],
                                ["type", "console"]
                            ],
                            [/(playstation\s[34portablevi]+)/i],
                            ["model", ["vendor", "Sony"],
                                ["type", "console"]
                            ],
                            [/(sprint\s(\w+))/i],
                            [
                                ["vendor", g, {
                                    HTC: "APA",
                                    Sprint: "Sprint"
                                }],
                                ["model", g, {
                                    "Evo Shift 4G": "7373KT"
                                }],
                                ["type", "mobile"]
                            ],
                            [/(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i],
                            ["vendor", "model", ["type", "tablet"]],
                            [/(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i, /(zte)-(\w+)*/i, /(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i],
                            ["vendor", ["model", /_/g, " "],
                                ["type", "mobile"]
                            ],
                            [/(nexus\s9)/i],
                            ["model", ["vendor", "HTC"],
                                ["type", "tablet"]
                            ],
                            [/[\s\(;](xbox(?:\sone)?)[\s\);]/i],
                            ["model", ["vendor", "Microsoft"],
                                ["type",
                                    "console"
                                ]
                            ],
                            [/(kin\.[onetw]{3})/i],
                            [
                                ["model", /\./g, " "],
                                ["vendor", "Microsoft"],
                                ["type", "mobile"]
                            ],
                            [/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i, /mot[\s-]?(\w+)*/i, /(XT\d{3,4}) build\//i, /(nexus\s[6])/i],
                            ["model", ["vendor", "Motorola"],
                                ["type", "mobile"]
                            ],
                            [/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],
                            ["model", ["vendor", "Motorola"],
                                ["type", "tablet"]
                            ],
                            [/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n8000|sgh-t8[56]9|nexus 10))/i, /((SM-T\w+))/i],
                            [
                                ["vendor", "Samsung"],
                                "model", ["type", "tablet"]
                            ],
                            [/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i, /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i, /sec-((sgh\w+))/i],
                            [
                                ["vendor", "Samsung"], "model", ["type", "mobile"]
                            ],
                            [/hbbtv.+maple;(\d+)/i],
                            [
                                ["model", /^/, "SmartTV"],
                                ["vendor", "Samsung"],
                                ["type", "smarttv"]
                            ],
                            [/\(dtv[\);].+(aquos)/i],
                            ["model", ["vendor", "Sharp"],
                                ["type", "smarttv"]
                            ],
                            [/sie-(\w+)*/i],
                            ["model", ["vendor", "Siemens"],
                                ["type", "mobile"]
                            ],
                            [/(maemo|nokia).*(n900|lumia\s\d+)/i, /(nokia)[\s_-]?([\w-]+)*/i],
                            [
                                ["vendor", "Nokia"], "model", ["type", "mobile"]
                            ],
                            [/android\s3\.[\s\w;-]{10}(a\d{3})/i],
                            ["model", ["vendor", "Acer"],
                                ["type", "tablet"]
                            ],
                            [/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i],
                            [
                                ["vendor", "LG"], "model", ["type", "tablet"]
                            ],
                            [/(lg) netcast\.tv/i],
                            ["vendor", "model", ["type", "smarttv"]],
                            [/(nexus\s[45])/i, /lg[e;\s\/-]+(\w+)*/i],
                            ["model", ["vendor", "LG"],
                                ["type", "mobile"]
                            ],
                            [/android.+(ideatab[a-z0-9\-\s]+)/i],
                            ["model", ["vendor", "Lenovo"],
                                ["type", "tablet"]
                            ],
                            [/linux;.+((jolla));/i],
                            ["vendor", "model", ["type", "mobile"]],
                            [/((pebble))app\/[\d\.]+\s/i],
                            ["vendor", "model", ["type", "wearable"]],
                            [/android.+;\s(glass)\s\d/i],
                            ["model", ["vendor", "Google"],
                                ["type", "wearable"]
                            ],
                            [/android.+(\w+)\s+build\/hm\1/i, /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i, /android.+(mi[\s\-_]*(?:one|one[\s_]plus)?[\s_]*(?:\d\w)?)\s+build/i],
                            [
                                ["model", /_/g, " "],
                                ["vendor", "Xiaomi"],
                                ["type", "mobile"]
                            ],
                            [/\s(tablet)[;\/]/i, /\s(mobile)[;\/]/i],
                            [
                                ["type", a.lowerize], "vendor", "model"
                            ]
                        ],
                        engine: [
                            [/windows.+\sedge\/([\w\.]+)/i],
                            ["version", ["name", "EdgeHTML"]],
                            [/(presto)\/([\w\.]+)/i,
                                /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i, /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, /(icab)[\/\s]([23]\.[\d\.]+)/i
                            ],
                            ["name", "version"],
                            [/rv\:([\w\.]+).*(gecko)/i],
                            ["version", "name"]
                        ],
                        os: [
                            [/microsoft\s(windows)\s(vista|xp)/i],
                            ["name", "version"],
                            [/(windows)\snt\s6\.2;\s(arm)/i, /(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],
                            ["name", ["version", g, c]],
                            [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],
                            [
                                ["name", "Windows"],
                                ["version", g, c]
                            ],
                            [/\((bb)(10);/i],
                            [
                                ["name",
                                    "BlackBerry"
                                ], "version"
                            ],
                            [/(blackberry)\w*\/?([\w\.]+)*/i, /(tizen)[\/\s]([\w\.]+)/i, /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i, /linux;.+(sailfish);/i],
                            ["name", "version"],
                            [/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i],
                            [
                                ["name", "Symbian"], "version"
                            ],
                            [/\((series40);/i],
                            ["name"],
                            [/mozilla.+\(mobile;.+gecko.+firefox/i],
                            [
                                ["name", "Firefox OS"], "version"
                            ],
                            [/(nintendo|playstation)\s([wids34portablevu]+)/i, /(mint)[\/\s\(]?(\w+)*/i, /(mageia|vectorlinux)[;\s]/i,
                                /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i, /(hurd|linux)\s?([\w\.]+)*/i, /(gnu)\s?([\w\.]+)*/i
                            ],
                            ["name", "version"],
                            [/(cros)\s[\w]+\s([\w\.]+\w)/i],
                            [
                                ["name", "Chromium OS"], "version"
                            ],
                            [/(sunos)\s?([\w\.]+\d)*/i],
                            [
                                ["name", "Solaris"], "version"
                            ],
                            [/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i],
                            ["name", "version"],
                            [/(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i],
                            [
                                ["name", "iOS"],
                                ["version", /_/g,
                                    "."
                                ]
                            ],
                            [/(mac\sos\sx)\s?([\w\s\.]+\w)*/i, /(macintosh|mac(?=_powerpc)\s)/i],
                            [
                                ["name", "Mac OS"],
                                ["version", /_/g, "."]
                            ],
                            [/((?:open)?solaris)[\/\s-]?([\w\.]+)*/i, /(haiku)\s(\w+)/i, /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i, /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i, /(unix)\s?([\w\.]+)*/i],
                            ["name", "version"]
                        ]
                    },
                    l = function(b, c) {
                        if (!(this instanceof l)) return (new l(b, c)).getResult();
                        var g = b || (e && e.navigator && e.navigator.userAgent ? e.navigator.userAgent : ""),
                            f = c ? a.extend(p, c) : p;
                        this.getBrowser = function() {
                            var b =
                                d.apply(this, f.browser);
                            b.major = a.major(b.version);
                            return b
                        };
                        this.getCPU = function() {
                            return d.apply(this, f.cpu)
                        };
                        this.getDevice = function() {
                            return d.apply(this, f.device)
                        };
                        this.getEngine = function() {
                            return d.apply(this, f.engine)
                        };
                        this.getOS = function() {
                            return d.apply(this, f.os)
                        };
                        this.getResult = function() {
                            return {
                                ua: this.getUA(),
                                browser: this.getBrowser(),
                                engine: this.getEngine(),
                                os: this.getOS(),
                                device: this.getDevice(),
                                cpu: this.getCPU()
                            }
                        };
                        this.getUA = function() {
                            return g
                        };
                        this.setUA = function(a) {
                            g = a;
                            return this
                        };
                        return this
                    };
                l.VERSION = "0.7.11";
                l.BROWSER = {
                    NAME: "name",
                    MAJOR: "major",
                    VERSION: "version"
                };
                l.CPU = {
                    ARCHITECTURE: "architecture"
                };
                l.DEVICE = {
                    MODEL: "model",
                    VENDOR: "vendor",
                    TYPE: "type",
                    CONSOLE: "console",
                    MOBILE: "mobile",
                    SMARTTV: "smarttv",
                    TABLET: "tablet",
                    WEARABLE: "wearable",
                    EMBEDDED: "embedded"
                };
                l.ENGINE = {
                    NAME: "name",
                    VERSION: "version"
                };
                l.OS = {
                    NAME: "name",
                    VERSION: "version"
                };
                "undefined" !== typeof h ? ("undefined" !== typeof f && f.exports && (h = f.exports = l), h.UAParser = l) : e.UAParser = l;
                var n = e.jQuery || e.Zepto;
                if ("undefined" !==
                    typeof n) {
                    var t = new l;
                    n.ua = t.getResult();
                    n.ua.get = function() {
                        return t.getUA()
                    };
                    n.ua.set = function(a) {
                        t.setUA(a);
                        a = t.getResult();
                        for (var b in a) n.ua[b] = a[b]
                    }
                }
            })("object" === typeof window ? window : this)
        }, {}],
        7: [function(c, f, h) {
            f.exports = function(b) {
                for (var a = 1; a < arguments.length; a++) {
                    var d = arguments[a],
                        c;
                    for (c in d) e.call(d, c) && (b[c] = d[c])
                }
                return b
            };
            var e = Object.prototype.hasOwnProperty
        }, {}]
    }, {}, [1])(1)
});
