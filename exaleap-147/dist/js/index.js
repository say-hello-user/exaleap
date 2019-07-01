var gx = function() { "use strict"; "function" == typeof Symbol && Symbol.asyncIterator && (e.prototype[Symbol.asyncIterator] = function() { return this }), e.prototype.next = function(e) { return this._invoke("next", e) }, e.prototype.throw = function(e) { return this._invoke("throw", e) }, e.prototype.return = function(e) { return this._invoke("return", e) };

    function d(e) { this.value = e }

    function e(i) { var r, o;

        function s(e, t) { try { var n = i[e](t),
                    a = n.value;
                a instanceof d ? Promise.resolve(a.value).then(function(e) { s("next", e) }, function(e) { s("throw", e) }) : l(n.done ? "return" : "normal", n.value) } catch (e) { l("throw", e) } }

        function l(e, t) { switch (e) {
                case "return":
                    r.resolve({ value: t, done: !0 }); break;
                case "throw":
                    r.reject(t); break;
                default:
                    r.resolve({ value: t, done: !1 }) }(r = r.next) ? s(r.key, r.arg): o = null }
        this._invoke = function(a, i) { return new Promise(function(e, t) { var n = { key: a, arg: i, resolve: e, reject: t, next: null };
                o ? o = o.next = n : (r = o = n, s(a, i)) }) }, "function" != typeof i.return && (this.return = void 0) }

    function i(e, t) { if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function") } var t = function(e, t, n) { return t && a(e.prototype, t), n && a(e, n), e };

    function a(e, t) { for (var n = 0; n < t.length; n++) { var a = t[n];
            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a) } }

    function g(e) { if (Array.isArray(e)) { for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t]; return n } return Array.from(e) } var r = (t(n, [{ key: "init2dScreen", value: function(e, t) { var n = this.g3d,
                a = this.dm2d = new ht.DataModel,
                i = this.g2d = new ht.graph.GraphView(a),
                r = i.getView(); if (r.style.left = "0", r.style.right = "0", r.style.top = "0", r.style.bottom = "0", i.getSelectWidth = function() { return 0 }, i.handleScroll = function() {}, i.handlePinch = function() {}, i.setPannable(!1), i.setRectSelectable(!1), i.setScrollBarVisible(!1), i.setMovableFunc(function() { return !1 }), n ? n.getView().appendChild(i.getView()) : document.body.appendChild(i.getView()), e) { var o = e.downListener,
                    s = e.moveListener,
                    l = e.upListener,
                    d = e.wheelListener,
                    h = e.commonListener;
                h && (this.commonListener = h, r.addEventListener("mousedown", this.commonListener.bind(this, i)), r.addEventListener("mousemove", this.commonListener.bind(this, i)), r.addEventListener("mouseup", this.commonListener.bind(this, i)), r.addEventListener("touchstart", this.commonListener.bind(this, i)), r.addEventListener("touchmove", this.commonListener.bind(this, i)), r.addEventListener("touchend", this.commonListener.bind(this, i))), o && (this.downListener = o, r.addEventListener("mousedown", this.downListener.bind(this, i)), r.addEventListener("touchstart", this.downListener.bind(this, i))), s && (this.moveListener = s, r.addEventListener("mousemove", this.moveListener.bind(this, i)), r.addEventListener("touchmove", this.moveListener.bind(this, i))), l && (this.upListener = l, r.addEventListener("mouseup", this.upListener.bind(this, i)), r.addEventListener("touchend", this.upListener.bind(this, i))), d && (this.wheelListener = d, r.addEventListener("mousewheel", this.wheelListener.bind(this, i))) }
            this.g2dResizeListener = function(e) { i.fitContent(!1, 0), i.iv() }, window.addEventListener("resize", this.g2dResizeListener), "function" == typeof t && t(i, a) } }, { key: "init3dScreen", value: function(e, t) { var n = 0 < arguments.length && void 0 !== e ? e : document.body,
                a = t,
                i = this.dm3d = new ht.DataModel,
                r = this.g3d = new ht.graph3d.Graph3dView(i),
                o = r.getView(),
                s = o.style;
            s.left = "0", s.right = "0", s.top = "0", s.bottom = "0", n.appendChild(o), this.g3dResizeListener = function(e) { r.iv() }, window.addEventListener("resize", this.g3dResizeListener), "function" == typeof a && a(r, i) } }, { key: "load2dScreen", value: function(e, t, n) { var a = this.dm2d,
                i = this.g2d; if (a.clear(), "function" == typeof t && t(i, a), "string" == typeof e) ht.Default.xhrLoad(e, function(e) { e ? (a.deserialize(e), "function" == typeof n && n(i, a)) : console.log("资源加载失败") });
            else if (e instanceof ht.Data) { var r = e;
                e = null, a.add(r), this.addNodeChilds(r, a), "function" == typeof n && n(i, a) } } }, { key: "load3dScreen", value: function(e, t, l) { var d = this,
                h = this.dm3d,
                c = this.g3d; if (h.clear(), "function" == typeof t && t(c, h), "string" == typeof e) ht.Default.xhrLoad(e, function(e) { if (e) { h.deserialize(e); var t = ht.Default.parse(e),
                        n = ht.Default.clone(t.a),
                        a = d.defaultScene = t.scene; if (c.isOrtho()) { var i = window.htBuildConfig,
                            r = i.eye,
                            o = i.center,
                            s = i.orthoWidth;
                        c.setOrthoWidth(ht.Default.isTouchable ? s.mb : s.pc), c.setEye(ht.Default.isTouchable ? r.mb : r.pc), c.setCenter(ht.Default.isTouchable ? o.mb : o.pc) } else c.setEye(a.eye), c.setCenter(a.center);
                    c.setFar(a.far), c.setNear(a.near), "function" == typeof l && l(c, h, n) } else console.log("资源加载失败") });
            else if (e instanceof ht.Data) { var n = e;
                e = null, h.add(n), this.addNodeChilds(n, h), "function" == typeof l && l(c, h) } } }, { key: "reset2dEvent", value: function(e) { var t = e.miListener,
                n = e.umiListener,
                a = e.mpListener,
                i = e.umpListener,
                r = e.scope;
            t && this.add2dMiEvent(t, r), n && this.remove2dMiEvent(n, r), a && this.add2dMpEvent(a, r), i && this.remove2dMpEvent(i, r) } }, { key: "reset3dEvent", value: function(e) { var t = e.miListener,
                n = e.umiListener,
                a = e.mpListener,
                i = e.umpListener,
                r = e.scope;
            t && this.add3dMiEvent(t, r), n && this.remove3dMiEvent(n, r), a && this.add3dMpEvent(a, r), i && this.remove3dMpEvent(i, r) } }, { key: "add2dMiEvent", value: function(e, t) { var n = this.g2d,
                a = this.mi2dEventInfo; if (a) { var i = a.listener,
                    r = a.listenerScope;
                this.remove2dMiEvent(i, r) }
            this.mi2dEventInfo = { listener: e, listenerScope: t }, e && n.mi(e, t) } }, { key: "remove2dMiEvent", value: function(e, t) { var n = this.g2d;
            e && n.umi(e, t) } }, { key: "add3dMiEvent", value: function(e, t) { var n = this.g3d,
                a = this.mi3dEventInfo; if (a) { var i = a.listener,
                    r = a.listenerScope;
                this.remove3dMiEvent(i, r) }
            this.mi3dEventInfo = { listener: e, listenerScope: t }, e && n.mi(e, t) } }, { key: "remove3dMiEvent", value: function(e, t) { var n = this.g3d;
            e && n.umi(e, t) } }, { key: "add2dMpEvent", value: function(e, t) { var n = this.g2d,
                a = this.mp2dEventInfo; if (a) { var i = a.listener,
                    r = a.listenerScope;
                this.remove2dMpEvent(i, r) }
            this.mp2dEventInfo = { listener: e, listenerScope: t }, e && n.mp(e, t) } }, { key: "remove2dMpEvent", value: function(e, t) { var n = this.g2d;
            e && n.ump(e, t) } }, { key: "add3dMpEvent", value: function(e, t) { var n = this.g3d,
                a = this.mp3dEventInfo; if (a) { var i = a.listener,
                    r = a.listenerScope;
                this.remove3dMpEvent(i, r) }
            this.mp3dEventInfo = { listener: e, listenerScope: t }, e && n.mp(e, t) } }, { key: "remove3dMpEvent", value: function(e, t) { var n = this.g3d;
            e && n.ump(e, t) } }, { key: "remove2d", value: function() { var e = this.g2d,
                t = this.dm2d,
                n = this.g3d,
                a = e.getView();
            e && (t.clear(), this.g2dResizeListener && window.removeEventListener("resize", this.g2dResizeListener), this.commonListener && (a.removeEventListener("mousedown", this.commonListener), a.removeEventListener("mousemove", this.commonListener), a.removeEventListener("mouseup", this.commonListener), a.removeEventListener("touchstart", this.commonListener), a.removeEventListener("touchmove", this.commonListener), a.removeEventListener("touchend", this.commonListener)), this.downListener && (a.removeEventListener("mousedown", this.downListener), a.removeEventListener("touchstart", this.downListener)), this.moveListener && (a.removeEventListener("mousemove", this.moveListener), a.removeEventListener("touchmove", this.moveListener)), this.upListener && (a.removeEventListener("mouseup", this.upListener), a.removeEventListener("touchend", this.upListener)), this.wheelListener && a.removeEventListener("mousewheel", this.wheelListener), this.mi2dEventInfo && (this.mi2dEventInfo = null), this.mp2dEventInfo && (this.mp2dEventInfo = null), n ? n.getView().removeChild(e.getView()) : document.body.removeChild(e.getView())) } }, { key: "remove3d", value: function(e) { this.remove2d(), this.mi3dEventInfo && (this.mi3dEventInfo = null), this.mp3dEventInfo && (this.mp3dEventInfo = null), this.g3dResizeListener && window.removeEventListener("resize", this.g3dResizeListener); var t = this.g3d;
            this.dm3d.clear(), e.removeChild(t.getView()) } }, { key: "destory", value: function(e) { var t = 0 < arguments.length && void 0 !== e ? e : document.body;
            this.remove3d(t) } }, { key: "addNodeChilds", value: function(e, n) { var a = this,
                t = e.getChildren();
            t && 0 < t.size() && t.each(function(e) { n.add(e); var t = e.getChildren();
                t && 0 < t.size() && a.addNodeChilds(e, n) }) } }]), n);

    function n() { i(this, n) } var b = { formatDate: function(e, t) { var n = t;
                n = (n = n.replace(/yyyy|YYYY/, e.getFullYear())).replace(/yy|YY/, 9 < e.getYear() % 100 ? (e.getYear() % 100).toString() : "0" + e.getYear() % 100); var a = e.getMonth() + 1; return n = (n = (n = (n = (n = (n = (n = (n = (n = (n = (n = n.replace(/MM/, 9 < a ? a.toString() : "0" + a)).replace(/M/g, a)).replace(/w|W/g, ["日", "一", "二", "三", "四", "五", "六"][e.getDay()])).replace(/dd|DD/, 9 < e.getDate() ? e.getDate().toString() : "0" + e.getDate())).replace(/d|D/g, e.getDate())).replace(/hh|HH/, 9 < e.getHours() ? e.getHours().toString() : "0" + e.getHours())).replace(/h|H/g, e.getHours())).replace(/mm/, 9 < e.getMinutes() ? e.getMinutes().toString() : "0" + e.getMinutes())).replace(/m/g, e.getMinutes())).replace(/ss|SS/, 9 < e.getSeconds() ? e.getSeconds().toString() : "0" + e.getSeconds())).replace(/s|S/g, e.getSeconds()) }, GetLunarDay: function(e, t, n) { var d, h, c, a, u = new Array(100),
                    f = new Array(12),
                    i = "正二三四五六七八九十冬腊";

                function v(e, t) { return e >> t & 1 } return u = new Array(2635, 333387, 1701, 1748, 267701, 694, 2391, 133423, 1175, 396438, 3402, 3749, 331177, 1453, 694, 201326, 2350, 465197, 3221, 3402, 400202, 2901, 1386, 267611, 605, 2349, 137515, 2709, 464533, 1738, 2901, 330421, 1242, 2651, 199255, 1323, 529706, 3733, 1706, 398762, 2741, 1206, 267438, 2647, 1318, 204070, 3477, 461653, 1386, 2413, 330077, 1197, 2637, 268877, 3365, 531109, 2900, 2922, 398042, 2395, 1179, 267415, 2635, 661067, 1701, 1748, 398772, 2742, 2391, 330031, 1175, 1611, 200010, 3749, 527717, 1452, 2742, 332397, 2350, 3222, 268949, 3402, 3493, 133973, 1386, 464219, 605, 2349, 334123, 2709, 2890, 267946, 2773, 592565, 1210, 2651, 395863, 1323, 2707, 265877), f[0] = 0, f[1] = 31, f[2] = 59, f[3] = 90, f[4] = 120, f[5] = 151, f[6] = 181, f[7] = 212, f[8] = 243, f[9] = 273, f[10] = 304, f[11] = 334, e < 1921 || 2020 < e ? "" : (function(e, t, n) { var a, i, r, o, s = !1,
                        l = (c = 3 != arguments.length ? new Date : new Date(e, t, n)).getYear(); for (l < 1900 && (l += 1900), a = 365 * (l - 1921) + Math.floor((l - 1921) / 4) + f[c.getMonth()] + c.getDate() - 38, c.getYear() % 4 == 0 && 1 < c.getMonth() && a++, i = 0;; i++) { for (r = o = u[i] < 4095 ? 11 : 12; 0 <= r; r--) { if (a <= 29 + v(u[i], r)) { s = !0; break }
                            a = a - 29 - v(u[i], r) } if (s) break }
                    d = o - r + 1, h = a, 12 == o && (d == Math.floor(u[i] / 65536) + 1 && (d = 1 - d), d > Math.floor(u[i] / 65536) + 1 && d--) }(e, t = 0 < parseInt(t) ? t - 1 : 11, n), a = "", d < 1 ? (a += "(闰)", a += i.charAt(-d - 1)) : a += i.charAt(d - 1), a += "月", a += h < 11 ? "初" : h < 20 ? "十" : h < 30 ? "廿" : "三十", h % 10 == 0 && 10 != h || (a += "一二三四五六七八九十".charAt((h - 1) % 10)), a) }, prefixInteger: function(e, t) { return (Array(t).join(0) + e).slice(-t) }, randomNumBetween: function(e, t) { var n = t - e,
                    a = Math.random(); return e + Math.round(a * n) }, getRandomValue: function(e, t, n) { var a = null; return void 0 !== n ? (a = new RegExp("(\\d)(?=(?:\\d{" + n + "})+$)", "g"), this.prefixInteger(this.randomNumBetween(e[0], e[1]), t).replace(a, "$1,")) : this.prefixInteger(this.randomNumBetween(e[0], e[1]), t) }, getRandomPointInCircle: function(e, t, n) { var a = this.randomNumBetween(0, n),
                    i = this.randomNumBetween(0, 360); return { x: e + a * Math.sin(i), y: t + a * Math.cos(i) } }, getNodeMat: function(e, t) { return e.getData3dUI(t).validate(), e.getData3dUI(t).mat }, toLocalPostion: function(e, t, n) { var a = ht.Math.Matrix4,
                    i = ht.Math.Vector3,
                    r = (new a).fromArray(this.getNodeMat(e, t)),
                    o = (new a).getInverse(r); return new i(n).applyMatrix4(o).toArray() }, getP3ByAnchor3d: function(e, t, n) { var a = t.getAnchor3d(),
                    i = n.x - a.x,
                    r = n.z - a.z,
                    o = i * t.getWidth(),
                    s = r * t.getHeight(),
                    l = t.p3(); return this.toLocalPostion(e, t, [l[0] + o, l[1], l[2] + s]) }, deepTraverseNodes: function(e, t) { for (var n = 0, a = e.length; n < a; n++) { var i = e[n],
                        r = i.getChildren().toArray();
                    t(i), 0 < r.length && this.deepTraverseNodes(r, t) } } },
        o = { lineSymbol: "symbols/3d-panel/alarm/left/line.json", symbolUrl: { alarmPanel: "symbols/3d-panel/alarm/left/alarm.json", escalatorPanel: "symbols/3d-panel/alarm/left/alarm.json", elevatorPanel: "symbols/3d-panel/alarm/left/alarm.json", gatePanel: "symbols/3d-panel/alarm/left/alarm.json" } },
        s = { lineSymbol: "symbols/3d-panel/alarm/right/line.json", symbolUrl: { alarmPanel: "symbols/3d-panel/alarm/right/alarm.json", escalatorPanel: "symbols/3d-panel/alarm/right/alarm.json", elevatorPanel: "symbols/3d-panel/alarm/right/alarm.json", gatePanel: "symbols/3d-panel/alarm/right/alarm.json" } },
        C = { addDevicePanel: function(e, t, l, n) { var d = new ht.Node;
                d.setAnchor3d({ x: "right" === l ? 0 : 1, y: 0, z: .5 }), d.s({ shape3d: "billboard", "shape3d.image": "left" === l ? o.symbolUrl[t] : s.symbolUrl[t], "shape3d.reverse.flip": !0, "shape3d.transparent": !0, "shape3d.vector.dynamic": !0, "shape3d.alwaysOnTop": !0, "select.brightness": 1, interactive: !0, "3d.visible": !1, "3d.selectable": !0, "3d.movable": !1 }), d.setSize3d([200, 80, 1]), d.setScaleX(n), d.setScaleTall(n); var h = new ht.Node; return h.setAnchor3d({ x: "right" === l ? 0 : 1, y: 0, z: .5 }), h.s({ shape3d: "billboard", "shape3d.image": "left" === l ? o.lineSymbol : s.lineSymbol, "shape3d.reverse.flip": !0, "shape3d.transparent": !0, "shape3d.vector.dynamic": !0, "shape3d.alwaysOnTop": !0, "3d.visible": !1, "3d.selectable": !1, "3d.movable": !1 }), h.setSize3d([140, 80, 1]), h.setScaleTall(n), d.onPropertyChanged = function(e) { var t = e.property,
                        n = e.newValue; "s:3d.visible" === t && h.s("3d.visible", n) }, h.onPropertyChanged = function(e) { var t = e.property,
                        n = e.newValue; if ("width" === t) { var a = h.p3(),
                            i = "right" === l ? 1 : -1;
                        d.p3([a[0] + i * h.getWidth(), a[1], a[2]]) } if ("position" === t) { var r = n.x,
                            o = n.y,
                            s = "right" === l ? 1 : -1;
                        d.setPosition({ x: r + s * h.getWidth(), y: o }) } "elevation" === t && d.setElevation(n) }, d.setParent(h), e.add(h), e.add(d), d }, getFloorByFloorId: function(e, t, n) { var a = 2 < arguments.length && void 0 !== n ? n : {},
                    i = a.isUp,
                    r = a.isDown; "string" != typeof e && (e = e.a("info").ID); for (var o = 0, s = t.length; o < s; o++) { var l = t[o]; if (l.a("info").ID == e) return i ? t[o + 1] : r ? t[o - 1] : l } return null }, sortDm3dData: function(e, t) { var d = e.getEye(),
                    n = e.getCenter(),
                    a = t.getDatas(),
                    h = {},
                    c = e.isOrtho(),
                    u = new ht.Math.Vector3(n).sub(new ht.Math.Vector3(d));
                a.forEach(function(e) { e.getDisplayName(); var t = e.getId(),
                        n = e.p3(),
                        a = Math.pow(n[0] - d[0], 2),
                        i = Math.pow(n[1] - d[1], 2),
                        r = Math.pow(n[2] - d[2], 2),
                        o = Math.sqrt(a + r),
                        s = new ht.Math.Vector3(n).sub(new ht.Math.Vector3(d)),
                        l = c ? u.dot(s) : Math.sqrt(a + i + r);
                    h[t] = { xzDistance: o, xyzDistance: l, data: e } }), a.sort(function(e, t) { var n = h[e.getId()],
                        a = n.xzDistance,
                        i = n.xyzDistance,
                        r = h[t.getId()],
                        o = r.xzDistance,
                        s = r.xyzDistance; return .5 < Math.abs(o - a) ? o - a : s - i }) }, setElevatorMoveRange: function(e, t) { var n = [];
                e.forEach(function(e) { var t = e.getTall() / 2;
                    n.push(e.getElevation() + t) }), t instanceof Array ? t.forEach(function(e) { e.a("floorElevationArray", n) }) : t.a("floorElevationArray", n) }, setElevatorFloor: function(e, t) { var n = e.a("startFloorNum"),
                    a = e.a("endFloorNum"),
                    i = e.a("floorElevationArray"),
                    r = i.length - 1;
                void 0 !== a && Math.abs(e.getElevation() - i[a]) > t || (a = (n = void 0 !== a ? a : b.randomNumBetween(0, r), b.randomNumBetween(0, r)), e.a("startFloorNum", n), e.a("endFloorNum", a), e.setElevation(i[n])) }, getBeginAndEndFloorIndex: function(n, e, t) {
                function a(e) { var t = e.replace(/[^0-9]/gi, ""); return n - parseInt(t) }

                function i(e) { var t = e.replace(/[^0-9]/gi, ""); return parseInt(t) + n - 1 } return { beginIndex: -1 < e.indexOf("B") ? a(e) : i(e), endIndex: -1 < t.indexOf("B") ? a(t) : i(t) } }, setNodesStatus: function(e, n, t) {
                function a(e) { if (void 0 !== o && e.s({ "2d.visible": o, "3d.visible": o }), void 0 !== s && e.s({ "2d.selectable": s, "3d.selectable": s }), r) { var t = e.getChildren().toArray();
                        t.length && i.setNodesStatus(t, n) } } var i = this,
                    r = !(2 < arguments.length && void 0 !== t) || t,
                    o = n.visible,
                    s = n.selectable;
                e instanceof Array ? e.forEach(function(e) { a(e) }) : a(e) }, addAlarmNode: function(e) { var t = e.dm3d,
                    n = e.p3,
                    a = e.attr,
                    i = e.floorNum,
                    r = a.equipmentCategoryShortName,
                    o = new ht.Node,
                    s = new ht.Node; return o.setRotationX(Math.PI / 2), o.setSize3d([200, 1, 200]), o.setAnchor3d({ x: .5, y: .5, z: .5 }), o.s({ "2d.movable": !1, "3d.movable": !1, "2d.selectable": !1, "3d.selectable": !1, "select.brightness": 1, shape3d: "plane", "shape3d.fixSizeOnScreen": !1, "shape3d.image": { smoked: "symbols/3d-alarm/alarm3.json" }[r] || "symbols/3d-alarm/alarm5.json", "shape3d.opacity": 1, "shape3d.reverse.flip": !0, "shape3d.transparent": !0, "shape3d.vector.dynamic": !1, interactive: !0 }), o.p3(n), o.a(a), o.a("floorNum", i), s.setSize3d([60, 60, 60]), s.setAnchor3d({ x: .5, y: .5, z: .5 }), s.s({ "2d.movable": !1, "2d.selectable": !1, "3d.movable": !1, "3d.selectable": !1, "all.color": "rgba(224,68,3,0.70)", "all.reverse.cull": !0, "all.transparent": !0 }), s.p3([n[0], n[1], n[2] - 30]), o.setDisplayName("告警水波"), s.setParent(o), t.add(o), t.add(s), o }, setFloorStatus: function(e, t, n) {
                function a(e) { e.s({ "shape3d.color": t, "shape3d.top.color": t, "shape3d.bottom.color": t }), e.getChildren().toArray().forEach(function(e) { e.s({ "2d.visible": !1, "3d.visible": !1 }) }) }
                n && a(n), a(e) }, restoreFloorStatus: function(e, t) {
                function n(e) { e.s({ "shape3d.color": a, "shape3d.top.color": a, "shape3d.bottom.color": a }), e.getChildren().toArray().forEach(function(e) { e.s({ "2d.visible": !0, "3d.visible": !0 }) }) } var a = "rgba(255, 255, 255, 0.01)";
                t && n(t), n(e) }, layout2dPanel: function(o, e) { for (var s = o.dm2d, t = o.settingPanel, l = {}, n = 1; n <= e; n++) l[n] || (l[n] = {}), l[n].mark = t.a("mark" + n), l[n].visible = "symbols/2d-icon/open-btn2.json" === t.a("btn" + n); for (var a in l) { var i = l[a].mark;
                    o[i].setParent(void 0) }

                function r(e) { var t = l[e],
                        n = t.mark,
                        a = t.visible,
                        i = s.getDataByTag("panel" + e),
                        r = o[n];
                    r.setPosition(i.getPosition()), r.setParent(i), r.getChildren().each(function(e) { e.s("2d.visible", a) }), i.s("2d.visible", a), i.a("isVisible", a) } for (var d in l) r(d) }, showPanel: function(e, t, n, a, i) {
                function r() { a && a(), n.s("3d.visible", !0), e.preClickInfo = { prePanel: n, preClickNode: t, preRestoreFunName: i } } var o = this,
                    s = e.preClickInfo,
                    l = { "楼层地板": function(e, t) { o.restoreFloorStatus(e) } }; if (s) { var d = s.prePanel,
                        h = s.preClickNode,
                        c = s.preRestoreFunName;
                    d.s("3d.visible", !1), l[c] && l[c](h, d), t !== h ? r() : e.preClickInfo = null } else r() } },
        u = { oneWaterWaveAnimate: function(e, t) { var n = t.rectAttrName,
                    a = t.colorAttrName,
                    i = t.initRect,
                    r = t.maxHeight,
                    o = e.a(n),
                    s = 0 === e.a("alarmLevel") ? "rgb(217,46,32)" : "rgb(255,183,28)"; if (o) { var l = o[3] + 7,
                        d = o[1] - 3.5,
                        h = s.slice(4, s.length - 1);
                    l < r ? (o[1] = d, o[3] = l, e.a(n, o), e.a(a, "rgba(" + h + ", " + (1 - (l - i[3]) / (r - i[3])) + ")")) : (e.a(n, i), e.a(a, "rgb(" + h + ")")) } else e.a(n, i) }, waterWaveAction: function(t, e) { var n = this;
                e.forEach(function(e) { n.oneWaterWaveAnimate(t, e) }) }, breathLightAnimate: function(e, t, n) { var a = 2 < arguments.length && void 0 !== n ? n : .05,
                    i = e.getChildren(),
                    r = (e.s(t) || 0) + (e.a("direction") || a);
                1 <= r && e.a("direction", -a), r <= 0 && e.a("direction", a), i && 0 < i.size() && i.each(function(e) { e.s("all.opacity", r) }), e.s(t, r) }, elevatorAnimate: function(e, t) { var n = e.a("floorElevationArray"),
                    a = e.getElevation(),
                    i = n[e.a("startFloorNum")],
                    r = n[e.a("endFloorNum")],
                    o = 0; if (o = i < r ? 1 : -1, Math.abs(a - r) > t) { var s = a + o * t;
                    e.setElevation(s) } }, scrollAlarmTable: function(n) { this.scrollAnimate && this.scrollAnimate.stop(); var e = n.a("ht.dataSource"),
                    t = n.a("dataSource"),
                    a = n.a("ht.tdHeight") || 25,
                    i = n.a("tableRowIndex"),
                    r = t.slice(i, i + 4),
                    o = r.length;
                o < 4 ? (r = r.concat(t.slice(0, 4 - o)), n.a("tableRowIndex", 0)) : n.a("tableRowIndex", i + 4), e && (r = r.concat(e)); var s = 4 * a;
                n.a("ht.dataSource", r), n.a("ht.translateY", -s), this.scrollAnimate = ht.Default.startAnim({ frames: 80, interval: 10, easing: function(e) { return e }, action: function(e, t) { n.a("ht.translateY", s * e - s) } }) } },
        f = { getWireNode: function(e, t, n, a) { var i = new ht.Shape; return i.s({ "all.color": "rgba(" + e + "," + t + ")", "top.color": "rgba(" + e + "," + t + ")", "all.transparent": !0, "all.reverse.cull": !0, "all.reverse.flip": !0, "left.visible": !1, "right.visible": !1, "2d.movable": !1, "3d.movable": !1, "2d.selectable": !1, "3d.selectable": !1 }), i.setTall(n), i.setThickness(a), i.setAnchor3d([.5, .5, .5]), i }, getFloorNode: function(e) { var t = new ht.Shape; return t.s({ "shape3d.color": "rgba(255, 255, 255, 0.01)", "shape3d.top.color": "rgba(255, 255, 255, 0.01)", "shape3d.bottom.color": "rgba(255, 255, 255, 0.01)", "shape3d.transparent": !0, "shape3d.reverse.flip": !0, "shape3d.reverse.cull": !0, "select.brightness": 1, "2d.movable": !1, "3d.movable": !1 }), t.setTall(e), t.setThickness(-1), t.setAnchor3d([.5, .5, .5]), t.setScaleX(.98), t.setScaleY(.98), t }, setDecStatus: function(e, t, n) { var a = ht.Math.Vector3,
                    i = ht.Math.Matrix4,
                    r = ht.Math.Euler,
                    o = new a(n[0]),
                    s = new a(n[1]),
                    l = new a(n[2]);
                t.p3(o.toArray()), t.lookAtX(s.clone().sub(o).cross(l.clone().sub(o)), "top"); var d = new r(t.r3(), t.getRotationMode(), !0),
                    h = new i,
                    c = new i;
                h.makeRotationFromEuler(d), c.getInverse(h); for (var u = [], f = 0, v = n.length; f < v; f++) { var m = new a(n[f]).applyMatrix4(c);
                    u.push({ x: m.x, y: m.z }) } var g = new a(n[0]).applyMatrix4(c);
                u.push({ x: g.x, y: g.z }), t.setPoints(u); var p = e.getData3dUI(t);
                p.validate(), h.fromArray(p.mat); var y = t.getPoints().get(0),
                    b = o.clone().sub(new a(y.x, t.getElevation(), y.y).applyMatrix4(h)),
                    w = t.p3();
                t.p3(w[0] + b.x, w[1] + b.y, w[2] + b.z) }, getDecNode: function() { var e = new ht.Shape; return e.s({ "shape3d.color": "rgb(3, 50, 109)", "shape3d.transparent": !0, "shape3d.opacity": .4, "shape3d.reverse.flip": !0, "shape3d.reverse.cull": !0, "2d.movable": !1, "3d.movable": !1, "2d.selectable": !1, "3d.selectable": !1 }), e.setThickness(-1), e.setTall(.1), e.setAnchor3d([.5, .5, .5]), e.setDisplayName("装饰多边形"), e }, getDecBorderNode: function() { var e = new ht.Shape; return e.s({ "all.color": "rgb(66, 180, 218)", "all.transparent": !0, "all.opacity": .4, "all.reverse.flip": !0, "all.reverse.cull": !0, "2d.movable": !1, "3d.movable": !1, "2d.selectable": !1, "3d.selectable": !1 }), e.setThickness(.3), e.setTall(.1), e.setAnchor3d([.5, .5, .5]), e.setDisplayName("装饰多边形框"), e }, pointTransform: function(e, t, n) { var a = ht.Math.Vector3,
                    i = ht.Math.Matrix4,
                    r = e.getData3dUI(t),
                    o = new i; return r.validate(), o.fromArray(r.mat), new a(n.x, t.getElevation(), n.y).applyMatrix4(o) }, getNodeMat: function(e, t) { return e.getData3dUI(t).validate(), e.getData3dUI(t).mat }, toLocalPostion: function(e, t, n) { var a = ht.Math.Matrix4,
                    i = ht.Math.Vector3,
                    r = (new a).fromArray(this.getNodeMat(e, t)),
                    o = (new a).getInverse(r); return new i(n).applyMatrix4(o).toArray() }, setNodeAnchor3d: function(e, t, n) { var a = t.p3(),
                    i = this.toLocalPostion(e, t, [n.x, t.getElevation(), n.z]),
                    r = i[0] - a[0],
                    o = i[2] - a[2],
                    s = r / t.getWidth(),
                    l = o / t.getHeight(),
                    d = t.getAnchor3d();
                t.setAnchor3d({ x: d.x + s, y: d.y, z: d.z + l }, !0) }, makeBuilding: function(r, t, n, s, e, o) {
                function l(e, t, n) { var a = function(e, t, n) { var a = d.getWireNode(f(n), v(n), g(n), y(n)); return a.setPoints(e), a.setSegments(N), a.setElevation(t), a }(e, t, n);
                    u.add(a); var i = function(e, t, n) { var a = d.getFloorNode(g(n)); return a.setPoints(e), a.setSegments(N), a.setElevation(t), a }(e, t, n);
                    u.add(i), o && (d.setNodeAnchor3d(r, a, o), d.setNodeAnchor3d(r, i, o)), a.setParent(i), w(n, i, a) } var d = this,
                    h = [],
                    c = [],
                    u = r.dm(),
                    a = e.getColor,
                    f = void 0 === a ? function() { return "222,222,222" } : a,
                    i = e.getOpacity,
                    v = void 0 === i ? function() { return 1 } : i,
                    m = e.getTall,
                    g = void 0 === m ? function() { return 1 } : m,
                    p = e.getThickness,
                    y = void 0 === p ? function() { return .5 } : p,
                    b = e.floorCall,
                    w = void 0 === b ? function() {} : b,
                    k = ht.Math.Vector3,
                    P = t.getPoints().length,
                    N = t.getSegments(); if (t.getPoints().each(function(e) { h.push(d.pointTransform(r, t, e)) }), n.getPoints().each(function(e) { c.push(d.pointTransform(r, n, e)) }), 1 === s) { var E = [],
                        S = h[0].y;
                    h.forEach(function(e) { E.push({ x: e.x, y: e.z }) }), l(E, S, 1) } else
                    for (var I = function(e) { for (var t = e / (s - 1), n = [], a = 0; a < P; a++) { var i = new k;
                                i.lerpVectors(h[a], c[a], t), n.push(i) } var r = [],
                                o = n[0].y;
                            n.forEach(function(e) { r.push({ x: e.x, y: e.z }) }), l(r, o, e + 1) }, L = 0; L < s; L++) I(L) }, makeDecShape: function(s, t, n, l, e) { var d = this,
                    a = e.faceCall,
                    h = void 0 === a ? function() {} : a,
                    c = [],
                    u = [],
                    f = s.dm();
                t.getPoints().forEach(function(e) { c.push(d.pointTransform(s, t, e)) }), n.getPoints().forEach(function(e) { u.push(d.pointTransform(s, n, e)) });

                function i(e) { var t = l[e],
                        n = t.first,
                        a = t.last,
                        i = d.getDecNode(),
                        r = d.getDecBorderNode(),
                        o = [];
                    n.forEach(function(e) { o.push(c[e]) }), a.forEach(function(e) { o.push(u[e]) }), d.setDecStatus(s, i, o), d.setDecStatus(s, r, o), i.a("worldPoint", o), r.a("worldPoint", o), h(e, i, r), f.add(i), f.add(r) } for (var r in l) i(r) } },
        l = { notifyCb: function(e, t) { var n = 0 < arguments.length && void 0 !== e ? e : [],
                    a = t,
                    i = a.kind,
                    r = a.data,
                    o = a.nextStatus; if (-1 < n.indexOf(i)) { var s = this.editBuildName,
                        l = this.buildPanelStatus;
                    s && (l[s][i] = o, this.executeBtnAction(i, o)) } if ("changeEditBuild" === i) { this.editBuildName = { "全楼": "all", "商   场": "business", "办公楼": "office", "停车场": "basement" }[r.a("editBuild1")], this.showBuildByType() } if ("leftToggle" === i) { var d = this.dm2d,
                        h = [];
                    ["panel1", "panel2", "panel3"].forEach(function(e) { var t = d.getDataByTag(e); if (t) { var n = t.a("isVisible");!n && void 0 !== n || h.push(t) } }), C.setNodesStatus(h, { visible: "open" === o }) } if ("rightToggle" === i) { var c = this.dm2d,
                        u = [];
                    ["panel4", "panel5", "panel6"].forEach(function(e) { var t = c.getDataByTag(e); if (t) { var n = t.a("isVisible");!n && void 0 !== n || u.push(t) } }), C.setNodesStatus(u, { visible: "open" === o }) } if ("buildLoaded" === i) { var f = this.dm2d,
                        v = this.dm3d;
                    0 < f.size() && 0 < v.size() && (this.startAnimate(), this.refresh(), this.addPropertyChangeListener()) } }, showBuildByType: function() { var e = this.editBuildName,
                    t = this.all,
                    n = this.panel6,
                    a = this.buildPanelStatus,
                    i = this.preClickInfo,
                    r = this[e],
                    o = t.gates,
                    s = t.gateBlinks,
                    l = t.elevators,
                    d = t.elevatorLines,
                    h = t.floorNodes,
                    c = t.escalators,
                    u = t.alarms,
                    f = r.floorNodes; if (i) { var v = i.prePanel,
                        m = i.preClickNode;
                    C.showPanel(this, m, v) } var g = o.concat(s, l, d, c, u);
                b.deepTraverseNodes(g, function(e) { e.a("hideBlinkTimes", 0) }), C.setNodesStatus(g.concat(h), { visible: !1 }), C.setNodesStatus(f, { visible: !0 }); var p = a[e]; for (var y in p) n.a(y + "-btn", p[y] ? "symbols/2d-icon/open-btn.json" : "symbols/2d-icon/close-btn.json"), this.executeBtnAction(y, p[y], !1) }, executeBtnAction: function(e, t, n) {
                function r(e, t) { if (d) { var n = d.prePanel,
                            a = d.preClickNode;
                        a.getDisplayName() === e && C.showPanel(o, a, n, null, t) } }

                function a(e) { s ? b.deepTraverseNodes(e, function(e) { e.a("hideBlinkTimes", 3) }) : C.setNodesStatus(e, { visible: !1 }) }

                function i(e) { b.deepTraverseNodes(e, function(e) { e.a("hideBlinkTimes", 0) }), C.setNodesStatus(e, { visible: !0 }) } var o = this,
                    s = !(2 < arguments.length && void 0 !== n) || n,
                    l = this.editBuildName,
                    d = this.preClickInfo,
                    h = this[l],
                    c = { zj: { onOpen: function() { var e = h.gates,
                                    t = h.gateBlinks;
                                i(e.concat(t)) }, onClose: function() { var e = h.gates,
                                    t = h.gateBlinks;
                                a(e.concat(t)), r("闸机") } }, dt: { onOpen: function() { var e = h.elevators,
                                    t = h.elevatorLines;
                                i(e.concat(t)) }, onClose: function() { var e = h.elevators,
                                    t = h.elevatorLines;
                                a(e.concat(t)), r("电梯") } }, ft: { onOpen: function() { var e = h.escalators;
                                i(e) }, onClose: function() { var e = h.escalators;
                                a(e), r("扶梯") } }, jb: { onOpen: function() { var e = h.alarms;
                                i(e) }, onClose: function() { var e = h.alarms;
                                a(e), r("告警水波") } }, kl: { onOpen: function() { var e = h.gates,
                                    t = h.elevators,
                                    n = h.alarms,
                                    a = h.floorNodes,
                                    i = h.escalators;
                                C.setNodesStatus(e.concat(t, n, i), { selectable: !1 }), C.setNodesStatus(a, { selectable: !0 }, !1) }, onClose: function() { var e = h.gates,
                                    t = h.elevators,
                                    n = h.alarms,
                                    a = h.floorNodes,
                                    i = h.escalators;
                                C.setNodesStatus(e.concat(t, n, i), { selectable: !0 }, !1), C.setNodesStatus(a, { selectable: !1 }), r("楼层地板", "楼层地板") } } };
                t ? c[e].onOpen() : c[e].onClose() }, startAnimate: function() {
                function e() { o.forEach(function(e) { C.setElevatorFloor(e, 5) }) } var t = this.g2d,
                    n = this.dm3d,
                    a = this.weatherPanel,
                    i = this.timePanel,
                    r = this.all,
                    o = r.elevators;
                e(), this.randomElevatorFloorInterval = setInterval(function() { e() }, 1e3); var s = this.task3d = { interval: 100, action: function(e) { if (-1 < r.alarms.indexOf(e) && u.waterWaveAction(e, [{ rectAttrName: "warnRect1", colorAttrName: "borderColor1", initRect: [4, 99, 292, 102], maxHeight: 254 }, { rectAttrName: "warnRect2", colorAttrName: "borderColor2", initRect: [1.5, 80, 297, 140], maxHeight: 292 }]), -1 < o.indexOf(e) && u.elevatorAnimate(e, 5), e.a("isLoading")) { var t = 5 * Math.PI,
                                n = t / 180,
                                a = e.a("angle") || 0;
                            e.a("angle", (a + n) % (2 * t)) } } };
                n.addScheduleTask(s); var l = this.nodeBlinkTask = { interval: 400, action: function(e) { var t = e.a("hideBlinkTimes"); if (t) { var n = !e.s("3d.visible");
                            e.s("3d.visible", n), !1 == n && (t -= 1, e.a("hideBlinkTimes", t)) } } };
                n.addScheduleTask(l), this.weatherTimeChangeInterval = setInterval(function() { a.s("2d.visible", !t.isVisible(a)), i.s("2d.visible", !t.isVisible(i)) }, 5e3) }, addPropertyChangeListener: function() { var n = this;
                this.g2d.addPropertyChangeListener(function(e) { "videoLayout" === e.property && (n.player || n.dataFill.getFlowVedioToken(function(e) { if (e.token) { var t = e.token;
                            videojs.Hls.xhr.beforeRequest = function(e) { return e.headers = { Authorization: "Bearer " + t }, e }, n.player = videojs("robot-video-flow"), n.player.src({ src: "https://exaleap.net/videos/robot_dog_sr_20004/index.m3u8?token=" + encodeURIComponent(t), type: "application/x-mpegURL" }), n.player.play() } })) }) } },
        h = function(e) { var t = e.kind,
                n = e.data,
                a = (e.type, e.comp); if ("clickData" === t) { var i = n.getDisplayName(),
                    r = this.notifier; if ("设置" === i) { var o = this.g2d,
                        s = this.settingPanel;
                    s.s("2d.visible", !o.isVisible(s)) } if ("还原" === i) { var l = this.g3d,
                        d = window.htBuildConfig,
                        h = d.eye,
                        c = d.center,
                        u = d.orthoWidth;
                    l.setOrthoWidth(ht.Default.isTouchable ? u.mb : u.pc), l.setEye(ht.Default.isTouchable ? h.mb : h.pc), l.setCenter(ht.Default.isTouchable ? c.mb : c.pc) } "详情" === i && r.fire({ kind: "detail" }), "切换" === i && r.fire({ kind: "switch" }), "工单面板" === i && r.fire({ kind: "workSheetPanel" }), "客流量面板" === i && r.fire({ kind: "visitFlowPanel" }), "设备检修面板" === i && r.fire({ kind: "equipmentOverhaulPanel" }), "消防报警面板" === i && r.fire({ kind: "firePanel" }), "重点区域监控面板" === i && r.fire({ kind: "monitorPanel" }), "投屏" === i && r.fire({ kind: "screening" }) } if ("onDown" === t && a) { var f = a.displayName; if ("还原" === f) { for (var v = 1; v <= 6; v++) this.settingPanel.a("btn" + v, void 0), this.settingPanel.a("mark" + v, void 0);
                    C.layout2dPanel(this, 6), n.s("2d.visible", !1) } "确认" === f && (C.layout2dPanel(this, 6), n.s("2d.visible", !1)) } },
        c = function(e) { var t = e.kind,
                n = e.event,
                a = e.data,
                i = e.type,
                r = e.comp; if ("clickBackground" === t)
                if (ht.Default.isLeftButton(n)) { var o = this.preClickInfo,
                        s = this.floorPanel,
                        l = (o || {}).preClickNode;
                    l && "楼层地板" === l.getDisplayName() && C.showPanel(this, l, s, null, "楼层地板"), this.g3d.setRotatable(!1) } else this.g3d.setRotatable(!0);
            if ("clickData" === t) { this.g3d.isRotatable() && this.g3d.setRotatable(!1); var d = a.getDisplayName(); if (d) { if (-1 < d.indexOf("楼层地板")) { var h = this.preClickInfo,
                            c = this.floorPanel;
                        (h || {}).preClickNode !== a ? this.dataFill.initFloorPassengers(this, a, c) : C.showPanel(this, a, c, null, "楼层地板") }
                    d.indexOf("电梯-") } } if ("onDown" === t && r) { var u = r.displayName; if ("删除" === u) { var f = this.dm3d,
                        v = this.preClickInfo; if (v) { var m = v.prePanel,
                            g = v.preClickNode;
                        g === a && C.showPanel(this, g, m) }
                    f.remove(a) } if ("警报图标" === u && function(e, t) { var n = this.dm3d,
                            a = this.allPanelStatus[t],
                            i = a.scale,
                            r = a.leftX,
                            o = a.rightX,
                            s = void 0,
                            l = void 0,
                            d = this[(l = e.getX() <= (r + o) / 2 ? (s = r, "left") : (s = o, "right")) + "_" + t],
                            h = (d = d || (this[l + "_" + t] = C.addDevicePanel(n, t, l, i))).getParent(),
                            c = e.p3();
                        h.p3(c), h.setSize({ width: Math.abs(s - e.getX()) }), C.showPanel(this, e, d) }.call(this, a, "alarmPanel"), "floorUp" === u) { var p = this.preClickInfo,
                        y = this.editBuildName,
                        b = this.floorPanel,
                        w = this[y].floorNodes,
                        k = C.getFloorByFloorId(p.preClickNode, w, { isUp: !0 });
                    this.dataFill.initFloorPassengers(this, k, b) } if ("floorDown" === u) { var P = this.preClickInfo,
                        N = this.editBuildName,
                        E = this.floorPanel,
                        S = this[N].floorNodes,
                        I = C.getFloorByFloorId(P.preClickNode, S, { isDown: !0 });
                    this.dataFill.initFloorPassengers(this, I, E) } } if ("onEnter" === t && "data" === i) { var L = a.getDisplayName(); if (L && (-1 < L.indexOf("告警水波") && a.a("delete-icon-visible", !0), -1 < L.indexOf("楼层地板"))) { var A = this.dm3d.getDataByTag("buildFloorNum"),
                        D = a.getChildAt(0);
                    C.setNodesStatus(A, { visible: !0 }), A.setElevation(a.getElevation()), A.a("floorNum", a.a("floorNum")), D && A.a("floorNumColor", D.s("all.color")) } } if ("onLeave" === t && "data" === i) { var x = a.getDisplayName(); if (x && (-1 < x.indexOf("告警水波") && a.a("delete-icon-visible", !1), -1 < x.indexOf("楼层地板"))) { var T = this.dm3d.getDataByTag("buildFloorNum");
                    C.setNodesStatus(T, { visible: !1 }) } } "onEnter" === t && "comp" === i && "楼层号码" === r.displayName && (this.g2d.getView().style.cursor = "pointer"); "onLeave" === t && "comp" === i && "楼层号码" === r.displayName && (this.g2d.getView().style.cursor = "default") },
        v = function(e) { if ("eye" === e.property) { var t = this.g3d,
                    n = this.dm3d;
                C.sortDm3dData(t, n) } }; var m = function(e) { return 0 <= e && e <= 50 ? "rgb(1, 142, 91)" : 51 <= e && e <= 100 ? "rgb(255, 216, 45)" : 101 <= e && e <= 150 ? "rgb(255, 142, 45)" : 151 <= e && e <= 200 ? "rgb(197, 16, 45)" : 201 <= e && e <= 300 ? "rgb(91, 4, 142)" : 301 <= e ? "rgb(115, 6, 32)" : void 0 },
        p = (t(y, [{ key: "getWeather", value: function(t) { var e = this.methodGetSettings("weather");
                this.sendAjax(e, function(e) { "function" == typeof t && t(e) }, function(e) { console.error(e) }) } }, { key: "getWorkOrder", value: function(t) { this.sendAjax(this.methodGetSettings("workOrder", { siteId: this.siteId }), function(e) { "function" == typeof t && t(e) }, function(e) { console.error(e) }) } }, { key: "getVisitors", value: function(t) { this.sendAjax(this.methodGetSettings("visitors", { siteId: this.siteId }), function(e) { "function" == typeof t && t(e) }, function(e) { console.error(e) }) } }, { key: "getInsidePassengers", value: function(t) { this.sendAjax(this.methodGetSettings("insidePassengers", { siteId: this.siteId }), function(e) { "function" == typeof t && t(e) }, function(e) { console.error(e) }) } }, { key: "getParkingPlaceStatus", value: function(t) { this.sendAjax(this.methodGetSettings("parkingPlaceStatus", { siteId: this.siteId }), function(e) { "function" == typeof t && t(e) }, function(e) { console.error(e) }) } }, { key: "getEmergencyAlarm", value: function(t) { this.sendAjax(this.methodGetSettings("emergencyAlarm", { siteId: this.siteId }), function(e) { "function" == typeof t && t(e) }, function(e) { console.error(e) }) } }, { key: "getFloorPassengers", value: function(e, t) { this.sendAjax(this.methodGetSettings("floorPassengers", { floorId: e }), function(e) { "function" == typeof t && t(e) }, function(e) { console.error(e) }) } }, { key: "getEquipmentAlarm", value: function(t) { this.sendAjax(this.methodGetSettings("equipmentAlarm", { siteId: this.siteId }), function(e) { "function" == typeof t && t(e) }, function(e) { console.error(e) }) } }, { key: "getParkingPlaceStatistics", value: function(t) { this.sendAjax(this.methodGetSettings("parkingPlaceStatistics", { siteId: this.siteId }), function(e) { "function" == typeof t && t(e) }, function(e) { console.error(e) }) } }, { key: "getFireAlarm", value: function(t) { this.sendAjax(this.methodGetSettings("fireAlarm", { siteId: this.siteId }), function(e) { "function" == typeof t && t(e) }, function(e) { console.error(e) }) } }, { key: "getFlowVideoToken", value: function(n) { this.sendAjax({ url: "https://dm-api.exaleap.net/weather/turing/robot_dog_sr_20004", method: "GET" }, function(e) { "function" == typeof n && n(e) }, function(e, t) { n("The robox is not connected. Please turn on the power and connect with the Internet. (offline)") }) } }, { key: "methodGetSettings", value: function(e, t) { var n = this.baseurl,
                    a = this.ajax[e],
                    i = a.url,
                    r = a.method; if (t)
                    for (var o in t) i = i.replace("{" + o + "}", t[o]); return { url: window.buildURL.debug ? n + "/console" + i + ".json" : n + "/console" + i, method: r, headers: window.buildURL.headers } } }, { key: "sendAjax", value: function(e, t, n) { var a = e.method,
                    i = e.url,
                    r = e.headers,
                    o = e.body,
                    s = new XMLHttpRequest; for (var l in s.open(a, i), r) s.setRequestHeader(l, r[l]);
                s.onreadystatechange = function() { 4 === s.readyState && (200 <= s.status && s.status < 400 ? "function" == typeof t && t(JSON.parse(s.responseText)) : "function" == typeof n && n(s.status)) }, s.send(o) } }, { key: "destory", value: function() { this.ajax = null, this.baseurl = null, this.siteId = null } }]), y);

    function y() { i(this, y); var e = window.buildURL,
            t = e.baseurl,
            n = e.siteId,
            a = e.ajax;
        this.baseurl = t, this.siteId = n, this.ajax = a } var w = (t(k, [{ key: "initFloorPassengers", value: function(r, o, s) { var l = o.a("floorNum"),
                d = o.a("floorType"),
                e = o.a("info").ID;
            window.buildURL.debug && (e = b.randomNumBetween(0, 1)), s.s("shape3d.image", "symbols/3d-icon/loading.json"), s.a("isLoading", !0), s.p3(b.getP3ByAnchor3d(r.g3d, o, o.a("panelAnchor") ? o.a("panelAnchor") : { x: 0, y: .5, z: 1 })), this.dataSource.getFloorPassengers(e, function(e) { if (!r.preClickInfo || r.preClickInfo.preClickNode === o) { s.s("shape3d.image", "symbols/3d-panel/build-panel/mr-build-panel.json"), s.a("isLoading", !1); var t = (e || {}).totalPassengers;
                    t = t || 0; var n = r.getInfoByNum(d, t),
                        a = n.color,
                        i = n.level;
                    s.s("state", "level" + i), s.a({ floorNum: l, totalPassengers: t }), C.setFloorStatus(o, a) } }), C.showPanel(r, o, s, null, "楼层地板") } }, { key: "initWeather", value: function(o) { this.dataSource.getWeather(function(e) { var t = e.data || {},
                    n = t.city,
                    a = t.pm25,
                    i = e.data.futures[0].desc,
                    r = e.data.futures[0].minTemperature + "° / " + e.data.futures[0].maxTemperature + "°";
                o.a({ temperature: 22, temperature1: r, city: n, pm25Des: i, pm25: a, pm25Color: m(a) }) }) } }, { key: "initWorkOrder", value: function(l) { this.dataSource.getWorkOrder(function(e) { var t = e.data || {},
                    n = t.today,
                    a = t.week,
                    i = n || {},
                    r = i.totalWork,
                    o = i.unhandled,
                    s = [];
                a instanceof Array && 0 < a.length && a.forEach(function(e, t) { e.timePoint; var n = e.totalWork;
                    s.push(n), s.push(0) }), r = r || 0, o = o || 0, l.a({ "chart.values": s, totalWork: r, unhandled: o }) }) } }, { key: "initVisitors", value: function(f) { this.dataSource.getVisitors(function(e) { var t = e.data || {},
                    n = t.dayVisitors,
                    a = t.syncRatio,
                    i = t.temporary,
                    r = t.unsuccessful,
                    o = t.dayPeak; if (o instanceof Array && 0 < o.length) { var s = o[0],
                        l = s.begin,
                        d = s.end,
                        h = o[1],
                        c = h.begin,
                        u = h.end;
                    f.a({ begin1: l, end1: d, begin2: c, end2: u }) }
                n = n || 0, a = a || 0, i = i || 0, r = r || 0, f.a({ dayVisitors: n, syncRatio: a, temporary: i, unsuccessful: r, syncRatioColor: 0 < a ? "rgb(212, 0, 0)" : "rgb(111, 212, 74)", upShapeVisible: 0 < a, downShapeVisible: a <= 0 }) }) } }, { key: "initInsidePassengers", value: function(i) { this.dataSource.getInsidePassengers(function(e) { var t = e || {},
                    n = t.totalEmployees,
                    a = t.totalVisitors;
                n = n || 0, a = a || 0, i.a({ totalEmployees: n, totalVisitors: a }) }) } }, { key: "initParkingPlaceStatus", value: function(i) { this.dataSource.getParkingPlaceStatus(function(e) { var t = e || {},
                    n = t.totalParkingPlace,
                    a = t.emptyParkingPlace;
                n = n || 0, a = a || 0, i.a({ totalParkingPlace: n, emptyParkingPlace: a }) }) } }, { key: "initTime", value: function(e) { var t = new Date,
                n = b.formatDate(t, "yyyy"),
                a = b.formatDate(t, "MM"),
                i = b.formatDate(t, "dd"),
                r = b.formatDate(t, "周w"),
                o = b.formatDate(new Date, "hh: mm"),
                s = b.GetLunarDay(t.getFullYear(), t.getMonth() + 1, t.getDate());
            e.a({ year: n, month: a, day: i, week: r, time: o, lunarDay: s }) } }, { key: "initEquipmentAlarm", value: function(e) {
            function n(e) { var t = e.alarms; if (0 < t.length) { for (var n = t.length - 1; 0 <= n; n--) l.remove(t[n]);
                    t.length = 0 } } var a = e.g3d,
                l = e.dm3d,
                d = e.basement,
                h = e.business,
                c = e.office,
                u = e.all;
            this.dataSource.getEquipmentAlarm(function(e) { var t = e.data || [];
                u.alarms.length = 0, n(d), n(h), n(c), t instanceof Array && 0 < t.length && (t.forEach(function(e) { var t = e.floorId,
                        n = C.getFloorByFloorId(t, u.floorNodes); if (n) { var a = n.p3(),
                            i = n.a("floorNum"),
                            r = n.a("floorType"),
                            o = b.getRandomPointInCircle(a[0], a[2], n.getWidth() / 4),
                            s = C.addAlarmNode({ dm3d: l, floorNum: i, floorType: r, attr: e, p3: [o.x, a[1], o.y] }); "basement" === r && d.alarms.push(s), "business" === r && h.alarms.push(s), "office" === r && c.alarms.push(s), u.alarms.push(s) } }), C.sortDm3dData(a, l)) }) } }, { key: "initEmergencyAlarm", value: function(h) { var c = [];
            this.dataSource.getEmergencyAlarm(function(e) { var t = e.data || []; if (t instanceof Array && 0 < t.length) { for (var n = 0, a = t.length; n < a; n++) { var i = t[n],
                            r = i.type,
                            o = i.latestTime,
                            s = i.buildingName,
                            l = i.spaceName,
                            d = i.faultName;
                        c.push({ time: o, alarmDetail: s + " " + l, name: d, type: r }) }
                    h.a("dataSource", c), h.a("tableRowIndex", 0), u.scrollAlarmTable(h) } }) } }, { key: "initParkingPlaceStatistics", value: function(n) { this.dataSource.getParkingPlaceStatistics(function(e) { var t = e.data || {};
                n.a("openingTime", t.startTime + " - " + t.endTime), n.a("usedPark", t.usedPark), n.a("usualParkingLot", t.usualParkingLot), n.a("seldomParkingLot", t.seldomParkingLot) }) } }, { key: "initFireAlarm", value: function(n) { this.dataSource.getFireAlarm(function(e) { var t = e.data || {};
                n.a("alarmNum", t.alarmNum), n.a("unhandled", t.unhandled), n.a("handled", t.handled) }) } }, { key: "getFlowVedioToken", value: function(t) { this.dataSource.getFlowVideoToken(function(e) { "function" == typeof t && t(e) }) } }, { key: "destory", value: function() { this.dataSource.destory(), this.dataSource = null } }]), k);

    function k() { i(this, k), this.dataSource = new p } var P = (t(N, [{ key: "loadScreen", value: function(n) { var a = this;
            Object.assign(this, { g3d: n.g3d, dm3d: n.dm3d, g2d: n.g2d, dm2d: n.dm2d }); var e = this.g3d,
                t = window.htBuildConfig.screen,
                i = t.pc2d,
                r = t.pc3d,
                o = window.buildURL.dirBasePath;
            e.setOrtho(!0), n.load3dScreen(o + "/" + r, null, function(e, t) { a.init3dNodes(), n.add3dMiEvent(c, a), n.add3dMpEvent(v, a), a.notifier.fire({ kind: "buildLoaded" }) }), n.load2dScreen(o + "/" + i, null, function(e, t) { a.init2dNodes(), n.add2dMiEvent(h, a), a.notifier.fire({ kind: "buildLoaded" }) }) } }, { key: "destory", value: function() { var e = this.dm3d;
            this.basement = null, this.business = null, this.office = null, this.all = null, this.floorPanel = null, this.escalatorPanel = null, this.elevatorPanel = null, this.gatePanel = null, this.alarmPanel = null, this.panel1 = null, this.panel2 = null, this.panel3 = null, this.panel4 = null, this.panel5 = null, this.panel6 = null, this.weatherPanel = null, this.timePanel = null, this.bottomPanel = null, this.settingPanel = null, this.preClickInfo = null, this.buildPanelStatus = null, this.editBuildName = null, this.right_alarmPanel && (this.right_alarmPanel = null), this.left_alarmPanel && (this.left_alarmPanel = null), this.right_escalatorPanel && (this.right_escalatorPanel = null), this.left_escalatorPanel && (this.left_escalatorPanel = null), this.right_elevatorPanel && (this.right_elevatorPanel = null), this.left_elevatorPanel && (this.left_elevatorPanel = null), this.right_gatePanel && (this.right_gatePanel = null), this.left_gatePanel && (this.left_gatePanel = null), this.player && (this.player.dispose(), this.player = null), this.task3d && (e.removeScheduleTask(this.task3d), this.task3d = null), this.nodeBlinkTask && (e.removeScheduleTask(this.nodeBlinkTask), this.nodeBlinkTask = null), this.randomElevatorFloorInterval && (clearInterval(this.randomElevatorFloorInterval), this.randomElevatorFloorInterval = null), this.weatherTimeChangeInterval && (clearInterval(this.weatherTimeChangeInterval), this.weatherTimeChangeInterval = null), this.normalRefreshInterval && (clearInterval(this.normalRefreshInterval), this.normalRefreshInterval = null), this.alarmRefreshInterval && (clearInterval(this.alarmRefreshInterval), this.alarmRefreshInterval = null), this.timeInterval && (clearInterval(this.timeInterval), this.timeInterval = null), this.emergencyAlarmInterval && (clearInterval(this.emergencyAlarmInterval), this.emergencyAlarmInterval = null), C.scrollAnimate && (C.scrollAnimate = null) } }, { key: "initBuildSpaceId", value: function() { var e = window.buildURL.dimensionInfo,
                t = this.basement,
                n = this.business,
                a = this.office,
                i = (e.ID, e.Building),
                r = i[0].Floor,
                o = i[1].Floor,
                s = i[2].Floor;
            t.floorNodes.forEach(function(e, t) { e.a("info", r[t]) }), n.floorNodes.forEach(function(e, t) { e.a("info", o[t]) }), a.floorNodes.forEach(function(e, t) { e.a("info", s[t]) }) } }, { key: "init2dNodes", value: function() { var n = this,
                e = this.dm2d,
                a = this.notifier;
            this.editBuildName = "all", this.buildPanelStatus = { all: { zj: !0, dt: !0, ft: !1, jb: !0, kl: !0 }, basement: { zj: !0, dt: !0, ft: !1, jb: !0, kl: !0 }, business: { zj: !0, dt: !0, ft: !1, jb: !0, kl: !0 }, office: { zj: !0, dt: !0, ft: !1, jb: !0, kl: !0 } }, e.each(function(e) { var t = e.getDisplayName(); "工单面板" === t && (n.panel1 = e).a("notifier", a), "设备检修面板" === t && (n.panel2 = e).a("notifier", a), "消防报警面板" === t && (n.panel3 = e).a("notifier", a), "重点区域监控面板" === t && (n.panel4 = e).a("notifier", a), "车位统计面板" === t && (n.panel5 = e).a("notifier", a), "功能面板" === t && (n.panel6 = e).a("notifier", a), "天气面板" === t && (n.weatherPanel = e), "时间面板" === t && (n.timePanel = e), "底部面板" === t && (n.bottomPanel = e), "设置面板" === t && (n.settingPanel = e), "投屏" === t && e.a("notifier", a), "左侧toggle" === t && e.a("notifier", a), "右侧toggle" === t && e.a("notifier", a) }) } }, { key: "init3dNodes", value: function() { var n = this,
                e = this.g3d,
                t = this.dm3d,
                u = this.basement = { gates: [], gateBlinks: [], elevators: [], elevatorLines: [], floorNodes: [], escalators: [], alarms: [] },
                f = this.business = { gates: [], gateBlinks: [], elevators: [], elevatorLines: [], floorNodes: [], escalators: [], alarms: [] },
                v = this.office = { gates: [], gateBlinks: [], elevators: [], elevatorLines: [], floorNodes: [], escalators: [], alarms: [] },
                m = this.all = { gates: [], gateBlinks: [], elevators: [], elevatorLines: [], floorNodes: [], escalators: [], alarms: [] };
            this.makeBuilding(), this.initBuildSpaceId(), t.each(function(e) { var t = e.getDisplayName(); "地-商-办" === t && e.getChildren().each(function(e) { var t = e.getDisplayName(); if ("电梯线集合" === t) { var n, a, i, r, o = e.getChildren().toArray();
                        (n = u.elevatorLines).push.apply(n, g(o)), (a = f.elevatorLines).push.apply(a, g(o)), (i = v.elevatorLines).push.apply(i, g(o)), (r = m.elevatorLines).push.apply(r, g(o)) } if ("电梯集合" === t) { var s, l, d, h, c = e.getChildren().toArray();
                        (s = u.elevators).push.apply(s, g(c)), (l = f.elevators).push.apply(l, g(c)), (d = v.elevators).push.apply(d, g(c)), (h = m.elevators).push.apply(h, g(c)) } }), "商-办" === t && e.getChildren().each(function(e) { var t = e.getDisplayName(); if ("电梯线集合" === t) { var n, a, i, r = e.getChildren().toArray();
                        (n = f.elevatorLines).push.apply(n, g(r)), (a = v.elevatorLines).push.apply(a, g(r)), (i = m.elevatorLines).push.apply(i, g(r)) } if ("电梯集合" === t) { var o, s, l, d = e.getChildren().toArray();
                        (o = f.elevators).push.apply(o, g(d)), (s = v.elevators).push.apply(s, g(d)), (l = m.elevators).push.apply(l, g(d)) } }), "商" === t && e.getChildren().each(function(e) { var t = e.getDisplayName(); if ("扶梯集合" === t) { var n, a, i = e.getChildren().toArray();
                        (n = f.escalators).push.apply(n, g(i)), (a = m.escalators).push.apply(a, g(i)) } if ("电梯线集合" === t) { var r, o, s = e.getChildren().toArray();
                        (r = f.elevatorLines).push.apply(r, g(s)), (o = m.elevatorLines).push.apply(o, g(s)) } if ("电梯集合" === t) { var l, d, h = e.getChildren().toArray();
                        (l = f.elevators).push.apply(l, g(h)), (d = m.elevators).push.apply(d, g(h)) } }), "楼层面板" === t && (n.floorPanel = e) }), m.floorNodes = u.floorNodes.concat(f.floorNodes, v.floorNodes), m.elevators.forEach(function(e) { var t = e.getDisplayName().split("-"),
                    n = C.getBeginAndEndFloorIndex(2, t[1], t[2]),
                    a = n.beginIndex,
                    i = n.endIndex;
                C.setElevatorMoveRange(m.floorNodes.slice(a, i + 1), e) }), m.elevatorLines.forEach(function(e) { var t = e.getDisplayName().split("-"),
                    n = C.getBeginAndEndFloorIndex(2, t[1], t[2]),
                    a = n.beginIndex,
                    i = n.endIndex;
                e.setAnchor3d({ x: .5, y: 0, z: .5 }, !0); var r = m.floorNodes[a],
                    o = m.floorNodes[i],
                    s = o.getElevation() - o.getTall() / 2,
                    l = o.getElevation() + o.getTall() / 2,
                    d = r.getElevation() + r.getTall() / 2,
                    h = l - d,
                    c = d,
                    u = m.floorNodes[i + 1]; if (u) h += u.getElevation() - u.getTall() / 2 - l;
                else { var f = m.floorNodes[i - 1];
                    h += s - (f.getElevation() + f.getTall() / 2) }
                e.setTall(h), e.setElevation(c) }), C.sortDm3dData(e, t) } }, { key: "makeBuilding", value: function() { var e = this.g3d,
                t = this.dm3d,
                a = this.basement,
                i = this.business,
                r = this.office,
                n = t.getDataByTag("first1"),
                o = t.getDataByTag("last1"),
                s = t.getDataByTag("first2"),
                l = t.getDataByTag("last2"),
                d = t.getDataByTag("first3"),
                h = t.getDataByTag("last3"),
                c = { x: 1e3, z: 400 };
            f.makeBuilding(e, n, o, 2, { getColor: function(e) { return "51, 153, 255" }, getOpacity: function(e) { return .43 }, getTall: function(e) { return 18 }, getThickness: function(e) { return 6 }, floorCall: function(e, t, n) { t.setDisplayName("楼层地板"), t.a("floorNum", ["B2", "B1"][e - 1]), t.a("floorType", "basement"), t.a("panelAnchor", { x: .05, y: .5, z: .45 }), a.floorNodes.push(t) } }, c), f.makeBuilding(e, s, l, 3, { getColor: function(e) { return 3 === e ? "186, 17, 90" : "96, 172, 252" }, getOpacity: function(e) { return 3 === e ? .89 : .56 }, getTall: function(e) { return 18 }, getThickness: function(e) { return 6 }, floorCall: function(e, t, n) { t.setDisplayName("楼层地板"), t.a("floorNum", ["1F", "2F", "3F"][e - 1]), t.a("floorType", "business"), t.a("panelAnchor", { x: .04, y: .5, z: .48 }), i.floorNodes.push(t) } }, c), f.makeBuilding(e, d, h, 22, { getColor: function(e) { return 1 <= e && e <= 11 ? "110, 173, 240" : 22 === e ? "49, 210, 235" : "134, 204, 124" }, getOpacity: function(e) { return 1 <= e && e <= 11 ? .43 : 22 === e ? .83 : .35 }, getTall: function(e) { return 18 }, getThickness: function(e) { return 6 }, floorCall: function(e, t, n) { t.setDisplayName("楼层地板"), t.a("floorNum", ["4F", "5F", "6F", "7F", "8F", "9F", "10F", "11F", "12F", "15F", "16F", "17F", "18F", "19F", "20F", "21F", "22F", "23F", "25F", "26F", "27F", "28F"][e - 1]), t.a("floorType", "office"), t.a("panelAnchor", { x: .04, y: .5, z: .6 }), r.floorNodes.push(t) } }, c) } }, { key: "refresh", value: function() { var e = this,
                t = window.buildURL,
                n = t.normalRefreshTime,
                a = t.alarmRefreshTime,
                i = t.emergencyAlarmRefreshTime,
                r = this.dataFill,
                o = this.timePanel,
                s = this.bottomPanel;
            r.initTime(o), this.refreshNormalData(), this.refreshAlarmData(), this.normalRefreshInterval = setInterval(function() { e.refreshNormalData() }, n), this.alarmRefreshInterval = setInterval(function() { e.refreshAlarmData() }, a), this.timeInterval = setInterval(function() { r.initTime(o) }, 6e4), this.emergencyAlarmInterval = setInterval(function() { var e = s.a("dataSource");
                e instanceof Array && 4 < e.length && u.scrollAlarmTable(s) }, i) } }, { key: "refreshNormalData", value: function() { var e = this.dataFill,
                t = this.weatherPanel,
                n = this.panel1,
                a = (this.panel2, this.bottomPanel),
                i = this.panel5,
                r = this.panel3;
            e.initWeather(t), e.initWorkOrder(n), e.initParkingPlaceStatus(a), e.initParkingPlaceStatistics(i), e.initFireAlarm(r) } }, { key: "refreshAlarmData", value: function() { var e = this.dataFill,
                t = this.bottomPanel;
            e.initEmergencyAlarm(t) } }, { key: "getInfoByNum", value: function(e, t) { if ("office" === e) { if (0 <= t && t < 100) return { color: "rgb(0, 180, 81)", level: 5 }; if (100 <= t && t < 200) return { color: "rgb(115, 204, 52)", level: 4 }; if (200 <= t && t < 300) return { color: "rgb(66, 180, 218)", level: 3 }; if (300 <= t && t < 400) return { color: "rgb(255, 183, 27)", level: 2 }; if (400 <= t) return { color: "rgb(224, 68, 3)", level: 1 } } if ("business" === e) { if (0 <= t && t < 160) return { color: "rgb(0, 180, 81)", level: 5 }; if (160 <= t && t < 320) return { color: "rgb(115, 204, 52)", level: 4 }; if (320 <= t && t < 480) return { color: "rgb(66, 180, 218)", level: 3 }; if (480 <= t && t < 640) return { color: "rgb(255, 183, 27)", level: 2 }; if (640 <= t) return { color: "rgb(224, 68, 3)", level: 1 } } if ("basement" === e) { if (0 <= t && t < 40) return { color: "rgb(0, 180, 81)", level: 5 }; if (40 <= t && t < 80) return { color: "rgb(115, 204, 52)", level: 4 }; if (80 <= t && t < 120) return { color: "rgb(66, 180, 218)", level: 3 }; if (120 <= t && t < 160) return { color: "rgb(255, 183, 27)", level: 2 }; if (160 <= t) return { color: "rgb(224, 68, 3)", level: 1 } } } }]), N);

    function N(e) { i(this, N), this.dataFill = new w, this.notifier = e, this.notifier.add(l.notifyCb.bind(this, ["zj", "dt", "ft", "jb", "kl"])), this.showBuildByType = l.showBuildByType, this.executeBtnAction = l.executeBtnAction, this.startAnimate = l.startAnimate, this.addPropertyChangeListener = l.addPropertyChangeListener, this.allPanelStatus = { alarmPanel: { scale: 3, leftX: -1100, rightX: 1350 }, escalatorPanel: { scale: 3, leftX: -1100, rightX: 1350 }, elevatorPanel: { scale: 3, leftX: -1100, rightX: 1350 }, gatePanel: { scale: 3, leftX: -1100, rightX: 1350 } } }

    function E() { i(this, E); var e = this.notifier = new ht.Notifier;
        this.build = new P(e) } return new(t(E, [{ key: "setScreenLang", value: function(e, n) { var a = this; - 1 < ["en", "tw", "zh"].indexOf(e) ? ht.Default.loadJS([window.buildURL.dirBasePath + "/js/locales/" + e + ".js"], function() { var e = a.g2d,
                    t = a.g3d;
                e && e.redraw(), t && t.iv(), "function" == typeof n && n() }) : console.warn("请传入正确的 language 枚举类型：en, tw, zh") } }, { key: "loadScreen", value: function(t) { var n = this;
            this.setScreenLang(window.buildURL.defaultLang || "zh", function() { var e = n.screen = new r;
                e.init3dScreen(t), e.init2dScreen({ commonListener: function(e, t) { var n = e.getDataAt(t);
                        n && "video1" === n.getDisplayName() && t.stopPropagation() } }), Object.assign(n, { g3d: e.g3d, dm3d: e.dm3d, g2d: e.g2d, dm2d: e.dm2d }), n.build.loadScreen(e) }) } }, { key: "removeScreen", value: function(e) { this.build && this.build.destory(), this.screen.destory(e), this.screen = null } }]), E) }();