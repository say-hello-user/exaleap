var gx = (function () {
'use strict';

function __$styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

class Screen {
    constructor() {

    }
    init2dScreen(listenerMap, callBack) {
        let g3d = this.g3d;
        let dm2d = this.dm2d = new ht.DataModel();
        let g2d = this.g2d = new ht.graph.GraphView(dm2d);
        let g2dView = g2d.getView();
            g2dView.style.left = '0';
            g2dView.style.right = '0';
            g2dView.style.top = '0';
            g2dView.style.bottom = '0'; 
         // 选中边框为0
         g2d.getSelectWidth = function () { return 0; };
         // 禁止鼠标缩放
         g2d.handleScroll = function () { };
         // 禁止 touch 下双指缩放
         g2d.handlePinch = function () { };
         // 禁止平移
         g2d.setPannable(false);
         // 禁止框选
         g2d.setRectSelectable(false);
         // 隐藏滚动条
         g2d.setScrollBarVisible(false);
         // 禁止图元移动
         g2d.setMovableFunc(function () { return false; });
        
        if(g3d) {
            g3d.getView().appendChild(g2d.getView());
        }
        else {
            document.body.appendChild(g2d.getView());
        }
        if(listenerMap) {
            let { downListener, moveListener, upListener, wheelListener, commonListener } = listenerMap;
            if(commonListener) {
                this.commonListener = commonListener;
                g2dView.addEventListener('mousedown', this.commonListener.bind(this, g2d));
                g2dView.addEventListener('mousemove', this.commonListener.bind(this, g2d));
                g2dView.addEventListener('mouseup', this.commonListener.bind(this, g2d));
                g2dView.addEventListener('touchstart', this.commonListener.bind(this, g2d));
                g2dView.addEventListener('touchmove', this.commonListener.bind(this, g2d));
                g2dView.addEventListener('touchend', this.commonListener.bind(this, g2d));
            }
            if(downListener) {
                this.downListener = downListener;
                g2dView.addEventListener('mousedown', this.downListener.bind(this, g2d));
                g2dView.addEventListener('touchstart', this.downListener.bind(this, g2d));
            }
            if(moveListener) {
                this.moveListener = moveListener;
                g2dView.addEventListener('mousemove', this.moveListener.bind(this, g2d));
                g2dView.addEventListener('touchmove', this.moveListener.bind(this, g2d));
            }
            if(upListener) {
                this.upListener = upListener;
                g2dView.addEventListener('mouseup', this.upListener.bind(this, g2d));
                g2dView.addEventListener('touchend', this.upListener.bind(this, g2d));
            }
            if(wheelListener) {
                this.wheelListener = wheelListener;
                g2dView.addEventListener('mousewheel', this.wheelListener.bind(this, g2d));
            }
        }
       
        this.g2dResizeListener = (e) => { g2d.fitContent(false, 0); g2d.iv();  };
        window.addEventListener('resize', this.g2dResizeListener);

        typeof callBack === 'function' && callBack(g2d, dm2d);
    }
    init3dScreen(parentElement = document.body, callBack) {
        let dm3d = this.dm3d = new ht.DataModel();
        let g3d = this.g3d = new ht.graph3d.Graph3dView(dm3d);
        let view = g3d.getView(),
            style = view.style;
        style.left = '0';
        style.right = '0';
        style.top = '0';
        style.bottom = '0';   
        parentElement.appendChild(view);
        
        this.g3dResizeListener = (e) => { g3d.iv();  };
        window.addEventListener('resize', this.g3dResizeListener);

        typeof callBack === 'function' && callBack(g3d, dm3d);
    }
    load2dScreen(g2dUrl, beforeCallBack, afterCallBack) {
        let dm2d = this.dm2d;
        let g2d = this.g2d;
        dm2d.clear();
        typeof beforeCallBack === 'function' && beforeCallBack(g2d, dm2d);
        if(typeof g2dUrl === 'string') {
            ht.Default.xhrLoad(g2dUrl, (json) => {
                if(json) {
                    dm2d.deserialize(json);
                    typeof afterCallBack === 'function' && afterCallBack(g2d, dm2d);
                }
                else {
                    console.log('资源加载失败');
                }
            });
        }
        else if(g2dUrl instanceof ht.Data) {
            let node = g2dUrl;
            g2dUrl = null;
            dm2d.add(node);
            this.addNodeChilds(node, dm2d);
            typeof afterCallBack === 'function' && afterCallBack(g2d, dm2d);
        }
    }
    load3dScreen(g3dUrl, beforeCallBack, afterCallBack) {
        let dm3d = this.dm3d;
        let g3d = this.g3d;
        dm3d.clear();
        typeof beforeCallBack === 'function' && beforeCallBack(g3d, dm3d);
        if(typeof g3dUrl === 'string') {
            ht.Default.xhrLoad(g3dUrl, (json) => {
                if(json) {
                    dm3d.deserialize(json);
                    let screenJson = ht.Default.parse(json);  
                    let screenAttr = ht.Default.clone(screenJson.a);
                    let defaultScene = this.defaultScene = screenJson.scene;
                    if(g3d.isOrtho()) {
                        let { eye, center, orthoWidth } = window.htBuildConfig;
                        g3d.setOrthoWidth(ht.Default.isTouchable ? orthoWidth.mb : orthoWidth.pc);
                        g3d.setEye(ht.Default.isTouchable ? eye.mb : eye.pc);
                        g3d.setCenter(ht.Default.isTouchable ? center.mb : center.pc);
                    }
                    else {
                        g3d.setEye(defaultScene.eye);
                        g3d.setCenter(defaultScene.center);
                    }
                    g3d.setFar(defaultScene.far);
                    g3d.setNear(defaultScene.near);
                    typeof afterCallBack === 'function' && afterCallBack(g3d, dm3d, screenAttr);
                }
                else {
                    console.log('资源加载失败');
                }
            });
        }
        else if(g3dUrl instanceof ht.Data) {
            let node = g3dUrl;
            g3dUrl = null;
            dm3d.add(node);
            this.addNodeChilds(node, dm3d);
            typeof afterCallBack === 'function' && afterCallBack(g3d, dm3d);
        }
    }
    reset2dEvent({miListener, umiListener, mpListener, umpListener, scope}) {
        miListener && this.add2dMiEvent(miListener, scope);
        umiListener && this.remove2dMiEvent(umiListener, scope);
        mpListener && this.add2dMpEvent(mpListener, scope);
        umpListener && this.remove2dMpEvent(umpListener, scope);
    }
    reset3dEvent({miListener, umiListener, mpListener, umpListener, scope}) {
        miListener && this.add3dMiEvent(miListener, scope);
        umiListener && this.remove3dMiEvent(umiListener, scope);
        mpListener && this.add3dMpEvent(mpListener, scope);
        umpListener && this.remove3dMpEvent(umpListener, scope);
    }
    add2dMiEvent(miListener, scope) {
        let { g2d, mi2dEventInfo }= this;
        if(mi2dEventInfo) {
            let { listener, listenerScope } = mi2dEventInfo;
            this.remove2dMiEvent(listener, listenerScope);     
        }
        this.mi2dEventInfo = { listener: miListener, listenerScope: scope }; 
        miListener && g2d.mi(miListener, scope);
    }
    remove2dMiEvent(umiListener, scope) {
        let g2d = this.g2d;
        umiListener && g2d.umi(umiListener, scope);
    }
    add3dMiEvent(miListener, scope) {
        let { g3d, mi3dEventInfo }= this;
        if(mi3dEventInfo) {
            let { listener, listenerScope } = mi3dEventInfo;
            this.remove3dMiEvent(listener, listenerScope);     
        }
        this.mi3dEventInfo = { listener: miListener, listenerScope: scope }; 
        miListener && g3d.mi(miListener, scope);
    }
    remove3dMiEvent(umiListener, scope) {
        let g3d = this.g3d;
        umiListener && g3d.umi(umiListener, scope);
    }
    add2dMpEvent(mpListener, scope) {
        let { g2d, mp2dEventInfo }= this;
        if(mp2dEventInfo) {
            let { listener, listenerScope } = mp2dEventInfo;
            this.remove2dMpEvent(listener, listenerScope);     
        }
        this.mp2dEventInfo = { listener: mpListener, listenerScope: scope };
        mpListener && g2d.mp(mpListener, scope);
    }
    remove2dMpEvent(umpListener, scope) {
        let g2d = this.g2d;
        umpListener && g2d.ump(umpListener, scope);
    }
    add3dMpEvent(mpListener, scope) {
        let { g3d, mp3dEventInfo }= this;
        if(mp3dEventInfo) {
            let { listener, listenerScope } = mp3dEventInfo;
            this.remove3dMpEvent(listener, listenerScope);     
        }
        this.mp3dEventInfo = { listener: mpListener, listenerScope: scope };
        mpListener && g3d.mp(mpListener, scope);
    }
    remove3dMpEvent(umpListener, scope) {
        let g3d = this.g3d;
        umpListener && g3d.ump(umpListener, scope);
    }
    remove2d() {
        let { g2d, dm2d, g3d } = this,
            g2dView = g2d.getView();
        if(g2d) {
            dm2d.clear();
            if(this.g2dResizeListener) {
                window.removeEventListener('resize', this.g2dResizeListener);
            }
            if(this.commonListener) {
                g2dView.removeEventListener('mousedown', this.commonListener);
                g2dView.removeEventListener('mousemove', this.commonListener);
                g2dView.removeEventListener('mouseup', this.commonListener);
        
                g2dView.removeEventListener('touchstart', this.commonListener);
                g2dView.removeEventListener('touchmove', this.commonListener);
                g2dView.removeEventListener('touchend', this.commonListener);
            }
            if(this.downListener) {
                g2dView.removeEventListener('mousedown', this.downListener);
                g2dView.removeEventListener('touchstart', this.downListener);
            }  
            if(this.moveListener) {
                g2dView.removeEventListener('mousemove', this.moveListener);
                g2dView.removeEventListener('touchmove', this.moveListener);
            }
            if(this.upListener) {
                g2dView.removeEventListener('mouseup', this.upListener);
                g2dView.removeEventListener('touchend', this.upListener);
            }
            if(this.wheelListener) {
                g2dView.removeEventListener('mousewheel', this.wheelListener);
            }
            if(this.mi2dEventInfo) {
                this.mi2dEventInfo = null;
            }  
            if(this.mp2dEventInfo) {
                this.mp2dEventInfo = null;
            } 
            if(g3d) {
                g3d.getView().removeChild(g2d.getView());
            }
            else {
                document.body.removeChild(g2d.getView());
            }
        }
    }
    remove3d(parentElement) {
        this.remove2d();
        if(this.mi3dEventInfo) {
            this.mi3dEventInfo = null;
        }
        if(this.mp3dEventInfo) {
            this.mp3dEventInfo = null;
        }
        if(this.g3dResizeListener) {
            window.removeEventListener('resize', this.g3dResizeListener);
        }
        let { g3d, dm3d } = this;
        dm3d.clear();
        parentElement.removeChild(g3d.getView());
    }
    destory(parentElement = document.body) {
        this.remove3d(parentElement);
    }
    addNodeChilds(node, dm) {
        let childs = node.getChildren();
        if(childs && childs.size() > 0) {
            childs.each((child) => {
                dm.add(child);
                let grandSon = child.getChildren();
                if(grandSon && grandSon.size() > 0) {
                    this.addNodeChilds(child, dm);
                }
            });
        }
    }
}

var util = {
	formatDate(date, formatStr) {
		var  str  =  formatStr;
		var  Week  =  ['日', '一', '二', '三', '四', '五', '六'];

		str = str.replace(/yyyy|YYYY/, date.getFullYear());
		str = str.replace(/yy|YY/, (date.getYear()  %  100) > 9 ? (date.getYear()  %  100).toString() : '0'  +  (date.getYear()  %  100));
		var month = date.getMonth() + 1;
		str = str.replace(/MM/, month > 9 ? month.toString() : '0'  +  month);
		str = str.replace(/M/g, month);

		str = str.replace(/w|W/g, Week[date.getDay()]);

		str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : '0'  +  date.getDate());
		str = str.replace(/d|D/g, date.getDate());

		str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0'  +  date.getHours());
		str = str.replace(/h|H/g, date.getHours());
		str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : '0'  +  date.getMinutes());
		str = str.replace(/m/g, date.getMinutes());
		str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : '0'  +  date.getSeconds());
		str = str.replace(/s|S/g, date.getSeconds());

		return  str;
	},
	GetLunarDay(solarYear, solarMonth, solarDay) {
		var CalendarData = new Array(100);
		var madd = new Array(12);
		var numString = "一二三四五六七八九十";
		var monString = "正二三四五六七八九十冬腊";
		var cYear, cMonth, cDay, TheDate;
		CalendarData = new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95);
		madd[0] = 0;
		madd[1] = 31;
		madd[2] = 59;
		madd[3] = 90;
		madd[4] = 120;
		madd[5] = 151;
		madd[6] = 181;
		madd[7] = 212;
		madd[8] = 243;
		madd[9] = 273;
		madd[10] = 304;
		madd[11] = 334;

		function GetBit(m, n) {
			return (m >> n) & 1;
		}
		function e2c() {
			TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
			var total, m, n, k;
			var isEnd = false;
			var tmp = TheDate.getYear();
			if (tmp < 1900) {
				tmp += 1900;
			}
			total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38;

			if (TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) {
				total++;
			}
			for (m = 0;; m++) {
				k = (CalendarData[m] < 0xfff) ? 11 : 12;
				for (n = k; n >= 0; n--) {
					if (total <= 29 + GetBit(CalendarData[m], n)) {
						isEnd = true;
						break;
					}
					total = total - 29 - GetBit(CalendarData[m], n);
				}
				if (isEnd) break;
			}
			cMonth = k - n + 1;
			cDay = total;
			if (k == 12) {
				if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
					cMonth = 1 - cMonth;
				}
				if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
					cMonth--;
				}
			}
		}
		function GetcDateString() {
			var tmp = "";
			// tmp += tgString.charAt((cYear - 4) % 10);
			// tmp += dzString.charAt((cYear - 4) % 12);
			// tmp += "(";
			// tmp += sx.charAt((cYear - 4) % 12);
			// tmp += ")年 ";
			if (cMonth < 1) {
				tmp += "(闰)";
				tmp += monString.charAt( - cMonth - 1);
			} else {
				tmp += monString.charAt(cMonth - 1);
			}
			tmp += "月";
			tmp += (cDay < 11) ? "初": ((cDay < 20) ? "十": ((cDay < 30) ? "廿": "三十"));
			if (cDay % 10 != 0 || cDay == 10) {
				tmp += numString.charAt((cDay - 1) % 10);
			}
			return tmp;
		}

		if (solarYear < 1921 || solarYear > 2020) {
			return "";
		} else {
			solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
			e2c(solarYear, solarMonth, solarDay);
			return GetcDateString();
		}
	},
	prefixInteger (num, n) {
		return (Array(n).join(0) + num).slice(-n);
	},
	randomNumBetween(Min,Max) {
		var Range = Max - Min;
		var Rand = Math.random();
		var num = Min + Math.round(Rand * Range); //四舍五入
		return num;
	},
	getRandomValue(range, maxBits, pointNum) {
		let reg = null;
        if(pointNum !== undefined) {
            reg = new RegExp("(\\d)(?=(?:\\d{" + pointNum + "})+$)", "g");
            return this.prefixInteger(this.randomNumBetween(range[0], range[1]), maxBits).replace(reg, '$1,');
        }
        else {
            return this.prefixInteger(this.randomNumBetween(range[0], range[1]), maxBits);
        }
	},
	getRandomPointInCircle(x, y, r) {
        let randomR = this.randomNumBetween(0, r),
            randomTheta = this.randomNumBetween(0, 360);
        return {
            x: x + randomR * Math.sin(randomTheta),
            y: y + randomR * Math.cos(randomTheta)
        }
	},
	getNodeMat(g3d, node) {
        g3d.getData3dUI(node).validate();
        return g3d.getData3dUI(node).mat;
    },
    toLocalPostion(g3d, node, worldPosition) {
        const Matrix4 = ht.Math.Matrix4,
            Vector3 = ht.Math.Vector3;
        let mat = new Matrix4().fromArray(this.getNodeMat(g3d, node)),
            matInverse = new Matrix4().getInverse(mat),
            position = new Vector3(worldPosition).applyMatrix4(matInverse);
        return position.toArray();
	},
	getP3ByAnchor3d(g3d, node, newAnchor3d) {
        let anchor3d = node.getAnchor3d(),
            xDelta = newAnchor3d.x - anchor3d.x,
            zDelta = newAnchor3d.z - anchor3d.z,
            xSize = xDelta * node.getWidth(),
            zSize = zDelta * node.getHeight(),
            p3 = node.p3();
        return this.toLocalPostion(g3d, node, [p3[0] + xSize, p3[1], p3[2] + zSize]);
	},
	deepTraverseNodes(nodes, callBack) {
        for(let i = 0, l = nodes.length; i < l; i++) {
            let node = nodes[i],
                childs = node.getChildren().toArray();
            callBack(node);
            if(childs.length > 0) {
                this.deepTraverseNodes(childs, callBack);
            }
        }
    }
};

const leftPanel = {
        lineSymbol: 'symbols/3d-panel/alarm/left/line.json',
        symbolUrl: { alarmPanel: 'symbols/3d-panel/alarm/left/alarm.json',
                    escalatorPanel: 'symbols/3d-panel/escalator-panel/left/panel.json',
                    elevatorPanel: 'symbols/3d-panel/escalator-panel/left/panel.json',
                    gatePanel: 'symbols/3d-panel/escalator-panel/left/panel.json' }
    };
const rightPanel = {
        lineSymbol: 'symbols/3d-panel/alarm/right/line.json',
        symbolUrl: { alarmPanel: 'symbols/3d-panel/alarm/right/alarm.json',
                    escalatorPanel: 'symbols/3d-panel/escalator-panel/right/panel.json',
                    elevatorPanel: 'symbols/3d-panel/escalator-panel/right/panel.json',
                    gatePanel: 'symbols/3d-panel/escalator-panel/right/panel.json' }
    };
var pTools = {
    addDevicePanel(dm3d, type, direction, scale) {
        let panel = new ht.Node();
        panel.setAnchor3d({ x: direction === 'right' ? 0 : 1, y: 0, z: .5 });
        panel.s({
            'shape3d': "billboard",
            'shape3d.image': direction === 'left' ? leftPanel.symbolUrl[type] : rightPanel.symbolUrl[type],
            'shape3d.reverse.flip': true,
            'shape3d.transparent': true,
            'shape3d.vector.dynamic': true,
            'shape3d.alwaysOnTop': true,
            'select.brightness': 1,
            'interactive': true,
            '3d.visible': false,
            '3d.selectable': true,
            '3d.movable': false
        });
        panel.setSize3d([200, 80, 1]);
        panel.setScaleX(scale);
        panel.setScaleTall(scale);

        let line = new ht.Node();
        line.setAnchor3d({ x: direction === 'right' ? 0 : 1, y: 0, z: .5 });
        line.s({
            'shape3d': "billboard",
            'shape3d.image': direction === 'left' ? leftPanel.lineSymbol : rightPanel.lineSymbol,
            'shape3d.reverse.flip': true,
            'shape3d.transparent': true,
            'shape3d.vector.dynamic': true,
            'shape3d.alwaysOnTop': true,
            '3d.visible': false,
            '3d.selectable': false,
            '3d.movable': false
        });
        line.setSize3d([140, 80, 1]);
        line.setScaleTall(scale);

        panel.onPropertyChanged = (e) => {
            let { property, newValue } = e;
            if(property === 's:3d.visible') {
                line.s('3d.visible', newValue);
            }
        };

        line.onPropertyChanged = (e) => {
            let { property, newValue } = e;
            if(property === 'width') {
                let lineP3 = line.p3();
                let panelXDirection = direction === 'right' ? 1 : -1;
                panel.p3([lineP3[0] + panelXDirection * line.getWidth(), lineP3[1], lineP3[2]]);
            }
            if(property === 'position') {
                let { x, y } = newValue;
                let panelXDirection = direction === 'right' ? 1 : -1;
                panel.setPosition({ x: x + panelXDirection * line.getWidth(), y });
            }
            if(property === 'elevation') {
                panel.setElevation(newValue);
            }
        };

        panel.setParent(line);

        dm3d.add(line);
        dm3d.add(panel);

        return panel;
    },
    getFloorByFloorId(floorId, floors, para = {}) {
        let { isUp, isDown } = para;
        if(typeof floorId !== 'string') {
            floorId = floorId.a('info')['ID'];
        }
        for(let i = 0, l = floors.length; i < l; i++) {
            let temp = floors[i];
            if(temp.a('info')['ID'] == floorId) {
                if(isUp) {
                    return floors[i + 1];
                }
                if(isDown) {
                    return floors[i - 1];
                }
                return temp;
            }
        }
        return null;
    },
    sortDm3dData(g3d, dm3d) {
        let eye = g3d.getEye(),
            center = g3d.getCenter(),
            datas = dm3d.getDatas(),
            weight = {},
            isOrtho = g3d.isOrtho(),
            cTOeVector = new ht.Math.Vector3(center).sub(new ht.Math.Vector3(eye));

        datas.forEach(data => {
            let displayName = data.getDisplayName(), id = data.getId(), p3 = data.p3(),
                xSquare = Math.pow(p3[0] - eye[0], 2),
                ySquare = Math.pow(p3[1] - eye[1], 2),
                zSquare = Math.pow(p3[2] - eye[2], 2),
                xzDistance = Math.sqrt(xSquare + zSquare),
                pTOeVector = new ht.Math.Vector3(p3).sub(new ht.Math.Vector3(eye)),
                xyzDistance = isOrtho ? cTOeVector.dot(pTOeVector) : Math.sqrt(xSquare + ySquare + zSquare);
            weight[id] = { xzDistance, xyzDistance, data };
        });
        datas.sort((data1, data2) => {
            let { xzDistance: xzDistance1, xyzDistance: xyzDistance1 } = weight[data1.getId()];
            let { xzDistance: xzDistance2, xyzDistance: xyzDistance2 } = weight[data2.getId()];
            if(Math.abs(xzDistance2 - xzDistance1) > 0.5) {
                return  xzDistance2 - xzDistance1;
            }
            else {
                return xyzDistance2 - xyzDistance1;
            }
        });
        //window.weight = weight;
    },
    setElevatorMoveRange(floors, elevators) {
        let floorElevationArray = [];
        floors.forEach((floorNode) => {
            let floorHalfTall = floorNode.getTall() / 2;
            floorElevationArray.push(floorNode.getElevation() + floorHalfTall);
        });
        if(elevators instanceof Array) {
            elevators.forEach((elevator) => {
                elevator.a('floorElevationArray', floorElevationArray);
            });
        }
        else {
            elevators.a('floorElevationArray', floorElevationArray);
        }
    },
    setElevatorFloor(elevator, measureOflength) { // measureOflength 比例
        let startFloorNum = elevator.a('startFloorNum'),
            endFloorNum = elevator.a('endFloorNum'),
            floorElevationArray = elevator.a('floorElevationArray'),
            floorLength = floorElevationArray.length - 1;
        if(endFloorNum !== undefined && Math.abs(elevator.getElevation() - floorElevationArray[endFloorNum]) > measureOflength) {
            return;
        }
        if(endFloorNum !== undefined) {
            startFloorNum = endFloorNum;
            endFloorNum = util.randomNumBetween(0, floorLength);
        }
        else {
            startFloorNum = util.randomNumBetween(0, floorLength);
            endFloorNum = util.randomNumBetween(0, floorLength);
        }
        elevator.a('startFloorNum', startFloorNum);
        elevator.a('endFloorNum', endFloorNum);
        elevator.setElevation(floorElevationArray[startFloorNum]);
    },
    getBeginAndEndFloorIndex(baseLength, beginFloor, endFloor) {
		let beginIndex, endIndex;
		let bRuler = (floorName) => {
			let floorNum = floorName.replace(/[^0-9]/ig, "");
			return baseLength - parseInt(floorNum);
		};
		let fRuler = (floorName) => {
			let floorNum = floorName.replace(/[^0-9]/ig, "");
			return parseInt(floorNum) + baseLength - 1;
		};
		if(beginFloor.indexOf('B') > -1) {
			beginIndex = bRuler(beginFloor);
		}
		else {
			beginIndex = fRuler(beginFloor);
		}
		if(endFloor.indexOf('B') > -1) {
			endIndex = bRuler(endFloor);
		}
		else {
			endIndex = fRuler(endFloor);
		}
		return { beginIndex, endIndex }
	},
    setNodesStatus(nodes, status, isDeep = true) { // isDeep 是否设置 node 的子节点为相同的 status 状态
        let { visible, selectable } = status;
        const setStatus = (node) => {
            if(visible !== undefined) {
                node.s({ '2d.visible': visible, '3d.visible': visible });
            }
            if(selectable !== undefined) {
                node.s({ '2d.selectable': selectable, '3d.selectable': selectable });
            }
            if(isDeep) {
                let childs = node.getChildren().toArray();
                if(childs.length) {
                    this.setNodesStatus(childs, status);
                }
            }
        };
        if(nodes instanceof Array) {
            nodes.forEach((node) => {
                setStatus(node);
            });
        }
        else {
            setStatus(nodes);
        }
    },
    addAlarmNode(para) {
        const typeSymbolMap = {
            'smoked': 'symbols/3d-alarm/alarm3.json'
        };
        let { dm3d, p3, attr, floorNum } = para,
            alarmType = attr.equipmentCategoryShortName,
            alarmNode = new ht.Node(),
            shapeNode = new ht.Node();

        alarmNode.setRotationX(Math.PI / 2);
        alarmNode.setSize3d([200, 1, 200]);
        alarmNode.setAnchor3d({x: 0.5, y: 0.5, z: 0.5});
        alarmNode.s({
            '2d.movable': false,
            '3d.movable': false,
            '2d.selectable': false,
            '3d.selectable': false,
            'select.brightness': 1,
            'shape3d': "plane",
            'shape3d.fixSizeOnScreen': false,
            'shape3d.image': typeSymbolMap[alarmType] || 'symbols/3d-alarm/alarm5.json',
            'shape3d.opacity': 1,
            'shape3d.reverse.flip': true,
            'shape3d.transparent': true,
            'shape3d.vector.dynamic': false,
            "interactive": true
        });
        alarmNode.p3(p3);
        alarmNode.a(attr);
        alarmNode.a('floorNum', floorNum);

        shapeNode.setSize3d([60, 60, 60]);
        shapeNode.setAnchor3d({x: 0.5, y: 0.5, z: 0.5});
        shapeNode.s({
            '2d.movable': false,
            '2d.selectable': false,
            '3d.movable': false,
            '3d.selectable': false,
            'all.color': "rgba(224,68,3,0.70)",
            'all.reverse.cull': true,
            'all.transparent': true
        });
        shapeNode.p3([p3[0], p3[1], p3[2] - 30]);

        alarmNode.setDisplayName('告警水波');
        shapeNode.setParent(alarmNode);
        dm3d.add(alarmNode);
        dm3d.add(shapeNode);

        return alarmNode;
    },
    setFloorStatus(floor, color, anthorFloor) { // 设置楼层状态
        let setStatus = (floor) => {
                floor.s({ 'shape3d.color': color, 'shape3d.top.color': color, 'shape3d.bottom.color': color });
                floor.getChildren().toArray().forEach((child) => {
                    child.s({ '2d.visible': false, '3d.visible': false });
                });
            };
        if(anthorFloor) {
            setStatus(anthorFloor);
        }
        setStatus(floor);
    },
    restoreFloorStatus(floor, anthorFloor) { // 恢复楼层状态
        const color = 'rgba(255, 255, 255, 0.01)';
        let setStatus = (floor) => {
                floor.s({ 'shape3d.color': color, 'shape3d.top.color': color, 'shape3d.bottom.color': color });
                floor.getChildren().toArray().forEach((child) => {
                    child.s({ '2d.visible': true, '3d.visible': true });
                });
            };
        if(anthorFloor) {
            setStatus(anthorFloor);
        }
        setStatus(floor);
    },
    layout2dPanel(self, maxIndex) {
        let { dm2d, settingPanel } = self,
            settingPanelStatus = {},
            openSymBolUrl = 'symbols/2d-icon/open-btn2.json';
        for(let i = 1; i <= maxIndex; i++ ) {
            if(!settingPanelStatus[i]) settingPanelStatus[i] = {};
            settingPanelStatus[i]['mark'] = settingPanel.a('mark' + i);
            settingPanelStatus[i]['visible'] = settingPanel.a('btn' + i) === openSymBolUrl;
        }
        for(let key in settingPanelStatus) {
            let { mark } = settingPanelStatus[key],
                panelNode = self[mark];
            panelNode.setParent(undefined);
        }
        for(let key in settingPanelStatus) {
            let { mark, visible } = settingPanelStatus[key];
            let panelBlock = dm2d.getDataByTag('panel' + key),
                panelNode = self[mark];
            panelNode.setPosition(panelBlock.getPosition());
            panelNode.setParent(panelBlock);
            panelNode.getChildren().each((panelChild) => { panelChild.s('2d.visible', visible); });
            panelBlock.s('2d.visible', visible);
            panelBlock.a('isVisible', visible);
        }
    },
    showPanel(self, curClickNode, curPanel, execute, restoreFunName) {
        let { preClickInfo } = self,
            restoreFun = {
                '楼层地板': (preClickNode, prePanel) => {
                    this.restoreFloorStatus(preClickNode);
                }
            },
            action = () => {
                execute && execute();
                curPanel.s('3d.visible', true);
                self.preClickInfo = { prePanel: curPanel, preClickNode: curClickNode, preRestoreFunName: restoreFunName };
            };
        if(preClickInfo) {
            let { prePanel, preClickNode, preRestoreFunName } = preClickInfo;
            prePanel.s('3d.visible', false);
            restoreFun[preRestoreFunName] && restoreFun[preRestoreFunName](preClickNode, prePanel);
            if(curClickNode !== preClickNode) {
                action();
            }
            else {
                self.preClickInfo = null;
            }
        }
        else {
            action();
        }
    }
};

var animate = {
    oneWaterWaveAnimate(node, para) {
        let { rectAttrName, colorAttrName, initRect, maxHeight } = para;
        let rectAttr = node.a(rectAttrName);
        let borderColor = node.a('alarmLevel') === 0 ? 'rgb(217,46,32)' : 'rgb(255,183,28)';
        if(rectAttr) {
            let curHeight = rectAttr[3],
                nextHeight = curHeight + 7;
            let curY = rectAttr[1],
                nextY = curY - 7 / 2;
            let borderColorRgb = borderColor.slice(4, borderColor.length - 1);
            
            if(nextHeight < maxHeight) {
                rectAttr[1] = nextY;
                rectAttr[3] = nextHeight;
                node.a(rectAttrName, rectAttr);
                node.a(colorAttrName, 'rgba('+ borderColorRgb +', ' + (1 - (nextHeight - initRect[3]) / (maxHeight - initRect[3])) + ')');
            }
            else {
                node.a(rectAttrName, initRect);
                node.a(colorAttrName, 'rgb(' + borderColorRgb + ')');
            }
        }
        else {
            node.a(rectAttrName, initRect);
        }
    },
    waterWaveAction(node, attrArray) {
        attrArray.forEach((attrs) => {
            this.oneWaterWaveAnimate(node, attrs);
        });
    },
    breathLightAnimate(lightNode, opacityAttr, deep = 0.05) {
        let childs = lightNode.getChildren(),
            opacity = lightNode.s(opacityAttr) || 0,
            direction = lightNode.a('direction') || deep,
            nextOpacity = opacity + direction;
        if(nextOpacity >= 1) {
            lightNode.a('direction', -deep);
        }
        if(nextOpacity <= 0) {
            lightNode.a('direction', deep);
        }
        if(childs && childs.size() > 0) {
            childs.each((child) => {
                child.s('all.opacity', nextOpacity);
            });
        }
        lightNode.s(opacityAttr, nextOpacity);
    },
    elevatorAnimate(elevator, measureOflength) { // measureOflength 比例
        let floorElevationArray = elevator.a('floorElevationArray'),
            curElevation = elevator.getElevation(),
            startFloorElevation = floorElevationArray[elevator.a('startFloorNum')],
            endFloorElevation = floorElevationArray[elevator.a('endFloorNum')],
            direction = 0;
        if(startFloorElevation < endFloorElevation) {
            direction = 1;
        }
        else {
            direction = -1;
        }
        if(Math.abs(curElevation - endFloorElevation) > measureOflength) {
            let nextElevation = curElevation + (direction * measureOflength);
            elevator.setElevation(nextElevation);
        }
    },
    scrollAlarmTable(bottomPanel) {
        this.scrollAnimate && this.scrollAnimate.stop();

        let curTableData = bottomPanel.a('ht.dataSource'),
            dataSource = bottomPanel.a('dataSource'),
            tdHeight = bottomPanel.a('ht.tdHeight') || 25,
            tableRowIndex = bottomPanel.a('tableRowIndex');
        let nextTableData = dataSource.slice(tableRowIndex, tableRowIndex + 4),
            nextTableLength = nextTableData.length;

        if(nextTableLength < 4) {
            nextTableData = nextTableData.concat(dataSource.slice(0, 4 - nextTableLength));
            bottomPanel.a('tableRowIndex', 0);
        }
        else {
            bottomPanel.a('tableRowIndex', tableRowIndex + 4);
        }

        if(curTableData) {
            nextTableData = nextTableData.concat(curTableData);
        }
        let offsetY = 4 * tdHeight;
        bottomPanel.a('ht.dataSource', nextTableData);
        bottomPanel.a('ht.translateY', -offsetY);

        this.scrollAnimate = ht.Default.startAnim({
            frames: 80,
            interval: 10, 
            easing: (t) => t, 
            action: (v, t) => { 
                bottomPanel.a('ht.translateY', -offsetY + offsetY * v);
            }
        });
    },
};

var architecture = {
    getWireNode(color, opacity, tall, thickness) {
        let node = new ht.Shape();
        node.s({
            "all.color": "rgba(" + color + ',' + opacity + ")",
            "top.color": "rgba(" + color + ',' + opacity + ")",
            "all.transparent": true,
            "all.reverse.cull": true,
            "all.reverse.flip": true,
            "left.visible": false,
            "right.visible": false,
            "2d.movable": false,
            "3d.movable": false,
            "2d.selectable": false,
            "3d.selectable": false
        });
        node.setTall(tall);
        node.setThickness(thickness);
        node.setAnchor3d([.5, .5, .5]);
        return node;
    },
    getFloorNode(tall) {
        let node = new ht.Shape();
        node.s({
            "shape3d.color": "rgba(255, 255, 255, 0.01)",
            "shape3d.top.color": "rgba(255, 255, 255, 0.01)",
            "shape3d.bottom.color": "rgba(255, 255, 255, 0.01)",
            "shape3d.transparent": true,
            "shape3d.reverse.flip": true,
            "shape3d.reverse.cull": true,
            "select.brightness": 1,
            "2d.movable": false,
            "3d.movable": false
        });
        node.setTall(tall);
        node.setThickness(-1);
        node.setAnchor3d([.5, .5, .5]);
        node.setScaleX(0.98);
        node.setScaleY(0.98);
        return node;
    },
    setDecStatus(g3d, node, points) {
        const Vector3 = ht.Math.Vector3,
            Matrix4 = ht.Math.Matrix4,
            Euler = ht.Math.Euler;
        let va = new Vector3(points[0]),
            vb = new Vector3(points[1]),
            vc = new Vector3(points[2]);
        // 确保新生成的 shape 的旋转角度 看向 shape 面的法向量 
        node.p3(va.toArray());
        node.lookAtX(vb.clone().sub(va).cross(vc.clone().sub(va)), 'top');

        let euler = new Euler(node.r3(), node.getRotationMode(), true),
            mat = new Matrix4(),
            matInv = new Matrix4();
        mat.makeRotationFromEuler(euler);
        matInv.getInverse(mat);

        let shapePoints = [];
        for (let i = 0, l = points.length; i < l; i++) {
            let vec = new Vector3(points[i]).applyMatrix4(matInv);
            shapePoints.push({ x: vec.x, y: vec.z });
        }
        let endVec = new Vector3(points[0]).applyMatrix4(matInv);
        shapePoints.push({ x: endVec.x, y: endVec.z });
        node.setPoints(shapePoints);

        // 上一步旋转应用逆矩阵之后 node 位置会和原来偏离 转换之后重新计算偏移值 确保位置
        let ui = g3d.getData3dUI(node);
        ui.validate();
        mat.fromArray(ui.mat);
        let point0 = node.getPoints().get(0),
            delta = va.clone().sub(new Vector3(point0.x, node.getElevation(), point0.y).applyMatrix4(mat)),
            np3 = node.p3();
        node.p3(np3[0] + delta.x, np3[1] + delta.y, np3[2] + delta.z);
    },
    getDecNode() {
        let node = new ht.Shape();
        node.s({
            "shape3d.color": "rgb(3, 50, 109)",
            "shape3d.transparent": true,
            "shape3d.opacity": 0.4,
            "shape3d.reverse.flip": true,
            "shape3d.reverse.cull": true,
            "2d.movable": false,
            "3d.movable": false,
            "2d.selectable": false,
            "3d.selectable": false
        });
        node.setThickness(-1);
        node.setTall(0.1);
        node.setAnchor3d([0.5, 0.5, 0.5]);
        node.setDisplayName('装饰多边形');
        return node;
    },
    getDecBorderNode() {
        let node = new ht.Shape();
        node.s({
            "all.color": "rgb(66, 180, 218)",
            "all.transparent": true,
            "all.opacity": 0.4,
            "all.reverse.flip": true,
            "all.reverse.cull": true,
            "2d.movable": false,
            "3d.movable": false,
            "2d.selectable": false,
            "3d.selectable": false
        });
        node.setThickness(0.3);
        node.setTall(0.1);
        node.setAnchor3d([0.5, 0.5, 0.5]);
        node.setDisplayName('装饰多边形框');
        return node;
    },
    pointTransform(g3d, node, point) {
        const Vector3 = ht.Math.Vector3,
            Matrix4 = ht.Math.Matrix4;
        let ui = g3d.getData3dUI(node),
            mat = new Matrix4();
        ui.validate();
        mat.fromArray(ui.mat);
        return new Vector3(point.x, node.getElevation(), point.y).applyMatrix4(mat);
    },
    getNodeMat(g3d, node) {
        g3d.getData3dUI(node).validate();
        return g3d.getData3dUI(node).mat;
    },
    toLocalPostion(g3d, node, worldPosition) {
        const Matrix4 = ht.Math.Matrix4,
            Vector3 = ht.Math.Vector3;
        let mat = new Matrix4().fromArray(this.getNodeMat(g3d, node)),
            matInverse = new Matrix4().getInverse(mat),
            position = new Vector3(worldPosition).applyMatrix4(matInverse);
        return position.toArray();
    },
    setNodeAnchor3d(g3d, node, defXZ) {
        let p3 = node.p3(),
            newP3 = this.toLocalPostion(g3d, node, [defXZ.x, node.getElevation(), defXZ.z]),
            xDelta = newP3[0] - p3[0],
            zDelta = newP3[2] - p3[2],
            xAnchorDelta = xDelta / node.getWidth(),
            zAnchorDelta = zDelta / node.getHeight(),
            anchor3d = node.getAnchor3d();
        node.setAnchor3d({ x: anchor3d.x + xAnchorDelta, y: anchor3d.y, z: anchor3d.z + zAnchorDelta }, true);
    },
    makeBuilding(g3d, firstFloor, lastFloor, maxFloorIndex, callBacks, defXZ) {
        let firstFloorVector3 = [],
            lastFloorVector3 = [],
            dm3d = g3d.dm();
        const { getColor = () => '222,222,222', getOpacity = () => 1, getTall = () => 1, getThickness = () => 0.5, floorCall = () => {} } = callBacks;
        const Vector3 = ht.Math.Vector3,
            floorPointLength = firstFloor.getPoints().length,
            segments = firstFloor.getSegments();
        const getFloor = (points, elevation, floorNum) => {
            let floorNode = this.getFloorNode(getTall(floorNum));
            floorNode.setPoints(points);
            floorNode.setSegments(segments);
            floorNode.setElevation(elevation);
            return floorNode;
        };
        const getWire = (points, elevation, floorNum) => {
            let wireNode = this.getWireNode(getColor(floorNum), getOpacity(floorNum), getTall(floorNum), getThickness(floorNum));
            wireNode.setPoints(points);
            wireNode.setSegments(segments);
            wireNode.setElevation(elevation);
            return wireNode;
        };
        const addOneFloor = (points, elevation, floorNum) => {
            let wireNode = getWire(points, elevation, floorNum);
            dm3d.add(wireNode);

            let floorNode = getFloor(points, elevation, floorNum);
            dm3d.add(floorNode);

            if (defXZ) {
                this.setNodeAnchor3d(g3d, wireNode, defXZ);
                this.setNodeAnchor3d(g3d, floorNode, defXZ);
            }

            wireNode.setParent(floorNode);

            floorCall(floorNum, floorNode, wireNode);
        };

        firstFloor.getPoints().each((point) => {
            firstFloorVector3.push(this.pointTransform(g3d, firstFloor, point));
        });
        lastFloor.getPoints().each((point) => {
            lastFloorVector3.push(this.pointTransform(g3d, lastFloor, point));
        });

        if (maxFloorIndex === 1) {
            let points = [],
                elevation = firstFloorVector3[0].y;
            firstFloorVector3.forEach((point) => {
                points.push({ x: point.x, y: point.z });
            });
            addOneFloor(points, elevation, 1);
        } else {
            for (let i = 0; i < maxFloorIndex; i++) {
                let percent = i / (maxFloorIndex - 1),
                    curFloorPoints = [];
                for (let j = 0; j < floorPointLength; j++) {
                    let v3 = new Vector3();
                    v3.lerpVectors(firstFloorVector3[j], lastFloorVector3[j], percent);
                    curFloorPoints.push(v3);
                }
                let points = [],
                    elevation = curFloorPoints[0].y;
                curFloorPoints.forEach((point) => {
                    points.push({ x: point.x, y: point.z });
                });

                addOneFloor(points, elevation, i + 1);
            }
        }
    },
    makeDecShape(g3d, firstFloor, lastFloor, pointIndexMap, callBacks) {
        let { faceCall = () => {} } = callBacks;
        let firstFloorWorldPoints = [],
            lastFloorWorldPoints = [],
            dm3d = g3d.dm();

        firstFloor.getPoints().forEach((point) => {
            firstFloorWorldPoints.push(this.pointTransform(g3d, firstFloor, point));
        });
        lastFloor.getPoints().forEach((point) => {
            lastFloorWorldPoints.push(this.pointTransform(g3d, lastFloor, point));
        });

        for (let key in pointIndexMap) {
            let { first, last } = pointIndexMap[key],
                decNode = this.getDecNode(),
                decBorderNode = this.getDecBorderNode(),
                points = [];

            first.forEach((index) => {
                points.push(firstFloorWorldPoints[index]);
            });
            last.forEach((index) => {
                points.push(lastFloorWorldPoints[index]);
            });

            this.setDecStatus(g3d, decNode, points);
            this.setDecStatus(g3d, decBorderNode, points);

            decNode.a('worldPoint', points);
            decBorderNode.a('worldPoint', points);

            faceCall(key, decNode, decBorderNode);

            dm3d.add(decNode);
            dm3d.add(decBorderNode);
        }
    }
};

const notifyCb = function (btnArray = [], e) {
    let { kind, data, nextStatus } = e;
    if (btnArray.indexOf(kind) > -1) {
        let { editBuildName, buildPanelStatus } = this;
        if (editBuildName) {
            buildPanelStatus[editBuildName][kind] = nextStatus;
            this.executeBtnAction(kind, nextStatus);
        }
    }
    if (kind === 'changeEditBuild') {
        const nameMap = { '全楼': 'all', '商   场': 'business', '办公楼': 'office', '停车场': 'basement' };
        this.editBuildName = nameMap[data.a('editBuild1')];
        this.showBuildByType();
    }
    if (kind === 'leftToggle') {
        let { dm2d } = this, panelTag = ['panel1', 'panel2', 'panel3'], leftPanel = [];
        panelTag.forEach((tag) => {
            let panel = dm2d.getDataByTag(tag);
            if (panel) {
                let isVisible = panel.a('isVisible');
                if (isVisible || isVisible === undefined) {
                    leftPanel.push(panel);
                }
            }
        });
        pTools.setNodesStatus(leftPanel, { visible: nextStatus === 'open' });
    }
    if (kind === 'rightToggle') {
        let { dm2d } = this, panelTag = ['panel4', 'panel5', 'panel6'], rightPanel = [];
        panelTag.forEach((tag) => {
            let panel = dm2d.getDataByTag(tag);
            if (panel) {
                let isVisible = panel.a('isVisible');
                if (isVisible || isVisible === undefined) {
                    rightPanel.push(panel);
                }
            }
        });
        pTools.setNodesStatus(rightPanel, { visible: nextStatus === 'open' });
    }
    if (kind === 'buildLoaded') {
        let { dm2d, dm3d } = this;
        if (dm2d.size() > 0 && dm3d.size() > 0) {
            this.startAnimate();
            this.refresh();
            this.addPropertyChangeListener();
        }
    }
};

const showBuildByType = function () {
    const openIcon = 'symbols/2d-icon/open-btn.json',
        closeIcon = 'symbols/2d-icon/close-btn.json';
    let { editBuildName, all, panel6, buildPanelStatus, preClickInfo } = this,
        build3dNodes = this[editBuildName], { gates, gateBlinks, elevators, elevatorLines, floorNodes, escalators, alarms } = all, 
        { floorNodes: showFloorNodes } = build3dNodes;
    if (preClickInfo) {
        let { prePanel, preClickNode } = preClickInfo;
        pTools.showPanel(this, preClickNode, prePanel);
    }
    let allBlinkNodes = gates.concat(gateBlinks, elevators, elevatorLines, escalators, alarms);
    util.deepTraverseNodes(allBlinkNodes, (node) => {
        node.a('hideBlinkTimes', 0);
    });
    pTools.setNodesStatus(allBlinkNodes.concat(floorNodes), { visible: false });
    pTools.setNodesStatus(showFloorNodes, { visible: true });

    let panelStatus = buildPanelStatus[editBuildName];
    for (let key in panelStatus) {
        panel6.a(key + '-btn', panelStatus[key] ? openIcon : closeIcon);
        this.executeBtnAction(key, panelStatus[key], false);
    }
};

const executeBtnAction = function (btnName, nextStatus, needAnimate = true) {
    let { editBuildName, preClickInfo } = this,
        build3dNodes = this[editBuildName];
    const hidePrePanelByName = (name, restoreFunName) => {
        if (preClickInfo) {
            let { prePanel, preClickNode } = preClickInfo,
            displayName = preClickNode.getDisplayName();
            if (displayName === name) {
                pTools.showPanel(this, preClickNode, prePanel, null, restoreFunName);
            }
        }
    };
    const hideNodes = (nodes) => {
        if(needAnimate) {
            util.deepTraverseNodes(nodes, (node) => {
                node.a('hideBlinkTimes', 3);
            });
        }
        else {
            pTools.setNodesStatus(nodes, { visible: false });
        }
    };
    const showNodes = (nodes) => {
        util.deepTraverseNodes(nodes, (node) => {
            node.a('hideBlinkTimes', 0);
        });
        pTools.setNodesStatus(nodes, { visible: true });
    };
    let btnAction = {
        'zj': {
            onOpen: () => {
                let { gates, gateBlinks } = build3dNodes;
                showNodes(gates.concat(gateBlinks));
            },
            onClose: () => {
                let { gates, gateBlinks } = build3dNodes;
                hideNodes(gates.concat(gateBlinks));
                hidePrePanelByName('闸机');
            }
        },
        'dt': {
            onOpen: () => {
                let { elevators, elevatorLines } = build3dNodes;
                showNodes(elevators.concat(elevatorLines));
            },
            onClose: () => {
                let { elevators, elevatorLines } = build3dNodes;
                hideNodes(elevators.concat(elevatorLines));
                hidePrePanelByName('电梯');
            }
        },
        'ft': {
            onOpen: () => {
                let { escalators } = build3dNodes;
                showNodes(escalators);
            },
            onClose: () => {
                let { escalators } = build3dNodes;
                hideNodes(escalators);
                hidePrePanelByName('扶梯');
            }
        },
        'jb': {
            onOpen: () => {
                let { alarms } = build3dNodes;
                showNodes(alarms);
            },
            onClose: () => {
                let { alarms } = build3dNodes;
                hideNodes(alarms);
                hidePrePanelByName('告警水波');
            }
        },
        'kl': {
            onOpen: () => {
                let { gates, elevators, alarms, floorNodes, escalators } = build3dNodes;
                pTools.setNodesStatus(gates.concat(elevators, alarms, escalators), { selectable: false });
                pTools.setNodesStatus(floorNodes, { selectable: true }, false);
            },
            onClose: () => {
                let { gates, elevators, alarms, floorNodes, escalators } = build3dNodes;
                pTools.setNodesStatus(gates.concat(elevators, alarms, escalators), { selectable: true }, false);
                pTools.setNodesStatus(floorNodes, { selectable: false });
                hidePrePanelByName('楼层地板', '楼层地板');
            }
        }
    };
    nextStatus ? btnAction[btnName].onOpen() : btnAction[btnName].onClose();
};

const startAnimate = function () {
    let { g2d, dm3d, weatherPanel, timePanel, all } = this,
        elevators = all.elevators,
        randomElevatorFloor = () => { elevators.forEach((elevator) => { pTools.setElevatorFloor(elevator, 5); }); };
    randomElevatorFloor();
    this.randomElevatorFloorInterval = setInterval(() => { randomElevatorFloor(); }, 1000);
    // 页面 3d 动画
    let task3d = this.task3d = {
        interval: 100,
        action: (data) => {
            // 告警水波动画
            if (all.alarms.indexOf(data) > -1) {
                animate.waterWaveAction(data, [{
                        rectAttrName: 'warnRect1',
                        colorAttrName: 'borderColor1',
                        initRect: [4, 99, 292, 102],
                        maxHeight: 254
                    },
                    {
                        rectAttrName: 'warnRect2',
                        colorAttrName: 'borderColor2',
                        initRect: [1.5, 80, 297, 140],
                        maxHeight: 292
                    }
                ]);
            }
            // 电梯运行动画
            if (elevators.indexOf(data) > -1) {
                animate.elevatorAnimate(data, 5);
            }
            // 加载动画
            if (data.a('isLoading')) {
                let PI = Math.PI * 5,
                    speed = PI / 180,
                    angle = data.a('angle') || 0;
                data.a('angle', (angle + speed) % (2 * PI));
            }
        }
    };
    dm3d.addScheduleTask(task3d);
    // 隐藏或显示节点闪烁动画
    let nodeBlinkTask = this.nodeBlinkTask = {
        interval: 400,
        action: (data) => {
           let hideBlinkTimes = data.a('hideBlinkTimes');
           if(hideBlinkTimes) {
               let nextVisible3d = !data.s('3d.visible');
               data.s('3d.visible', nextVisible3d);
               if(nextVisible3d === false) {
                    hideBlinkTimes -= 1;
                    data.a('hideBlinkTimes', hideBlinkTimes);
               }
           }
        }
    };
    dm3d.addScheduleTask(nodeBlinkTask);
    // 天气时间面板切换动画
    this.weatherTimeChangeInterval = setInterval(() => {
        weatherPanel.s('2d.visible', !g2d.isVisible(weatherPanel));
        timePanel.s('2d.visible', !g2d.isVisible(timePanel));
    }, 5000);
};

const addPropertyChangeListener = function () {
    this.g2d.addPropertyChangeListener((e) => {
        if (e.property === "videoLayout") {
            if (!this.player) {
                this.dataFill.getFlowVedioToken(result => {
                    if (result.token) {
                        let token = result.token;
                        videojs.Hls.xhr.beforeRequest = function(options) {
                            options.headers = { "Authorization": "Bearer " + token };
                            return options;
                        };
                        this.player = videojs('robot-video-flow');
                        this.player.src({
                            src: 'https://exaleap.net/videos/robot_dog_sr_20004/index.m3u8?token=' + encodeURIComponent(token),
                            type: 'application/x-mpegURL',
                        });
                        this.player.play();
                    }
                });
            }
        }
    });
};

var common = { notifyCb, showBuildByType, executeBtnAction, startAnimate, addPropertyChangeListener };

const adjustDevicePanle = function(data, devicePanelName) {
    let { dm3d, allPanelStatus } = this,
        { scale, leftX, rightX } = allPanelStatus[devicePanelName],
        xNum, direction;
    if(data.getX() <= (leftX + rightX) / 2) {
        xNum = leftX;
        direction = 'left';
    }
    else {
        xNum = rightX;
        direction = 'right';
    }
    let devicePanel = this[direction + '_' + devicePanelName];
    if (!devicePanel) {
        devicePanel = this[direction + '_' + devicePanelName] = pTools.addDevicePanel(dm3d, devicePanelName, direction, scale);
    }
    let line = devicePanel.getParent(),
        dataP3 = data.p3();
    line.p3(dataP3);
    line.setSize({ width: Math.abs(xNum - data.getX()) });
    pTools.showPanel(this, data, devicePanel);
};

const mi2dEvent = function (e) {
    let { kind, data, type, comp } = e;
    if (kind === 'clickData') {
        let displayName = data.getDisplayName(),
            { notifier } = this;
        if (displayName === '设置') {
            let { g2d, settingPanel } = this;
            settingPanel.s('2d.visible', !g2d.isVisible(settingPanel));
        }
        if (displayName === '还原') {
            let { g3d } = this, { eye, center, orthoWidth } = window.htBuildConfig;
            g3d.setOrthoWidth(ht.Default.isTouchable ? orthoWidth.mb : orthoWidth.pc);
            g3d.setEye(ht.Default.isTouchable ? eye.mb : eye.pc);
            g3d.setCenter(ht.Default.isTouchable ? center.mb : center.pc);
        }
        if (displayName === '详情') notifier.fire({ kind: 'detail' });
        if (displayName === '切换') notifier.fire({ kind: 'switch' });
        if (displayName === '工单面板') notifier.fire({ kind: 'workSheetPanel' });
        if (displayName === '客流量面板') notifier.fire({ kind: 'visitFlowPanel' });
        if (displayName === '设备检修面板') notifier.fire({ kind: 'equipmentOverhaulPanel' });
        if (displayName === '消防报警面板') notifier.fire({ kind: 'firePanel' });
        if (displayName === '重点区域监控面板') notifier.fire({ kind: 'monitorPanel' });
        if (displayName === '投屏') notifier.fire({ kind: 'screening' });
    }
    if (kind === 'onDown' && comp) {
        let { displayName } = comp;
        if (displayName === '还原') {
            for (let i = 1; i <= 6; i++) {
                this.settingPanel.a('btn' + i, undefined);
                this.settingPanel.a('mark' + i, undefined);
            }
            pTools.layout2dPanel(this, 6);
            data.s('2d.visible', false);
        }
        if (displayName === '确认') {
            pTools.layout2dPanel(this, 6);
            data.s('2d.visible', false);
        }
    }
};

const mi3dEvent = function (e) {
    let { kind, event, data, type, comp } = e;
    if (kind === 'clickBackground') {
        if (ht.Default.isLeftButton(event)) {
            let { preClickInfo, floorPanel } = this, { preClickNode } = preClickInfo || {};
            if (preClickNode) {
                if (preClickNode.getDisplayName() === '楼层地板') {
                    pTools.showPanel(this, preClickNode, floorPanel, null, '楼层地板');
                }
            }
            this.g3d.setRotatable(false);
        } else {
            this.g3d.setRotatable(true);
        }
    }
    if (kind === 'clickData') {
        this.g3d.isRotatable() && this.g3d.setRotatable(false);
        let displayName = data.getDisplayName();
        if (displayName) {
            if (displayName.indexOf('楼层地板') > -1) {
                let { preClickInfo, floorPanel } = this, { preClickNode } = preClickInfo || {};
                if (preClickNode !== data) {
                    this.dataFill.initFloorPassengers(this, data, floorPanel);
                } else {
                    pTools.showPanel(this, data, floorPanel, null, '楼层地板');
                }
            }
            if (displayName === '扶梯') {
                adjustDevicePanle.call(this, data, 'escalatorPanel');
            }
            if (displayName.indexOf('电梯-') > -1) {
                // adjustDevicePanle.call(this, data, 'elevatorPanel');
            }
            if (displayName === '闸机') {
                adjustDevicePanle.call(this, data, 'gatePanel');
            }
        }
    }
    if (kind === 'onDown' && comp) {
        let { displayName } = comp;
        if (displayName === '删除') {
            let { dm3d, preClickInfo } = this;
            if (preClickInfo) {
                let { prePanel, preClickNode } = preClickInfo;
                if (preClickNode === data) {
                    pTools.showPanel(this, preClickNode, prePanel);
                }
            }
            dm3d.remove(data);
        }
        if (displayName === '警报图标') {
            adjustDevicePanle.call(this, data, 'alarmPanel');
        }
        if (displayName === 'floorUp') {
            let { preClickInfo, editBuildName, floorPanel } = this, { floorNodes } = this[editBuildName],
                floorNode = pTools.getFloorByFloorId(preClickInfo.preClickNode, floorNodes, { isUp: true });
            this.dataFill.initFloorPassengers(this, floorNode, floorPanel);
        }
        if (displayName === 'floorDown') {
            let { preClickInfo, editBuildName, floorPanel } = this, { floorNodes } = this[editBuildName],
                floorNode = pTools.getFloorByFloorId(preClickInfo.preClickNode, floorNodes, { isDown: true });
            this.dataFill.initFloorPassengers(this, floorNode, floorPanel);
        }
        
    }
    if (kind === 'onEnter' && type === 'data') {
        let displayName = data.getDisplayName();
        if (displayName) {
            if (displayName.indexOf('告警水波') > -1) {
                data.a('delete-icon-visible', true);
            }
            if (displayName.indexOf('楼层地板') > -1) {
                let floorNumNode = this.dm3d.getDataByTag('buildFloorNum'),
                    wireNode = data.getChildAt(0);
                pTools.setNodesStatus(floorNumNode, { visible: true });
                floorNumNode.setElevation(data.getElevation());
                floorNumNode.a('floorNum', data.a('floorNum'));
                if (wireNode) {
                    floorNumNode.a('floorNumColor', wireNode.s('all.color'));
                }
            }
        }
    }
    if (kind === 'onLeave' && type === 'data') {
        let displayName = data.getDisplayName();
        if (displayName) {
            if (displayName.indexOf('告警水波') > -1) {
                data.a('delete-icon-visible', false);
            }
            if (displayName.indexOf('楼层地板') > -1) {
                let floorNumNode = this.dm3d.getDataByTag('buildFloorNum');
                pTools.setNodesStatus(floorNumNode, { visible: false });
            }
        }
    }
    if (kind === 'onEnter' && type === 'comp') {
        let { displayName } = comp;
        if (displayName === '楼层号码') {
            this.g2d.getView().style.cursor = 'pointer';
        }
    }
    if (kind === 'onLeave' && type === 'comp') {
        let { displayName } = comp;
        if (displayName === '楼层号码') {
            this.g2d.getView().style.cursor = 'default';
        }
    }
};

const mp3dEvent = function (e) {
    if (e.property === 'eye') {
        let { g3d, dm3d } = this;
        pTools.sortDm3dData(g3d, dm3d);
    }
};

var event = { mi2dEvent, mi3dEvent, mp3dEvent };

function gradientColor(startColor,endColor,step){
    var startRGB = this.colorRgb(startColor);//转换为rgb数组模式
    var startR = startRGB[0];
    var startG = startRGB[1];
    var startB = startRGB[2];

    var endRGB = this.colorRgb(endColor);
    var endR = endRGB[0];
    var endG = endRGB[1];
    var endB = endRGB[2];

    var sR = (endR-startR)/step;//总差值
    var sG = (endG-startG)/step;
    var sB = (endB-startB)/step;

    var colorArr = [];
    for(var i=0;i<step;i++){
        //计算每一步的hex值
        var hex = this.colorHex('rgb('+parseInt((sR*i+startR))+','+parseInt((sG*i+startG))+','+parseInt((sB*i+startB))+')');
        colorArr.push(hex);
    }
    return colorArr;
}

// 将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
gradientColor.prototype.colorRgb = function(sColor){
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var sColor = sColor.toLowerCase();
    if(sColor && reg.test(sColor)){
        if(sColor.length === 4){
            var sColorNew = "#";
            for(var i=1; i<4; i+=1){
                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for(var i=1; i<7; i+=2){
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
        }
        return sColorChange;
    }else{
        return sColor;
    }
};

// 将rgb表示方式转换为hex表示方式
gradientColor.prototype.colorHex = function(rgb){
    var _this = rgb;
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if(/^(rgb|RGB)/.test(_this)){
        var aColor = _this.replace(/(?:(|)|rgb|RGB)*/g,"").split(",");
        var strHex = "#";
        for(var i=0; i<aColor.length; i++){
            var hex = Number(aColor[i]).toString(16);
            hex = hex<10 ? 0+''+hex :hex;// 保证每个rgb的值为2位
            if(hex === "0"){
                hex += hex;
            }
            strHex += hex;
        }
        if(strHex.length !== 7){
            strHex = _this;
        }
        return strHex;
    }else if(reg.test(_this)){
        var aNum = _this.replace(/#/,"").split("");
        if(aNum.length === 6){
            return _this;
        }else if(aNum.length === 3){
            var numHex = "#";
            for(var i=0; i<aNum.length; i+=1){
                numHex += (aNum[i]+aNum[i]);
            }
            return numHex;
        }
    }else{
        return _this;
    }
};

var config = {
    // 根据空气质量指数获取相应颜色值
    getColorByAirQualityIndex(airQualityIndex) {
        if(airQualityIndex >= 0 && airQualityIndex <= 50) return 'rgb(1, 142, 91)';
        if(airQualityIndex >= 51 && airQualityIndex <= 100) return 'rgb(255, 216, 45)';
        if(airQualityIndex >= 101 && airQualityIndex <= 150) return 'rgb(255, 142, 45)';
        if(airQualityIndex >= 151 && airQualityIndex <= 200) return 'rgb(197, 16, 45)';
        if(airQualityIndex >= 201 && airQualityIndex <= 300) return 'rgb(91, 4, 142)';
        if(airQualityIndex >= 301) return 'rgb(115, 6, 32)';
    },
    // 根据热力值获取滑块的颜色
    getSliderColorByThermal(thermal) {
        let thermalMultiply = Math.floor(thermal * 100);
        if(thermal >=0 && thermal < 0.35) {
            let color = new gradientColor('#6bb831', '#00f', 35);
            return color[thermalMultiply];
        }
        else if(thermal >= 0.35 && thermal < 0.45) {
            let color = new gradientColor('#00f', '#ff9a00', 10);
            return color[thermalMultiply - 35];
        }
        else if(thermal >= 0.45 && thermal < 1) {
            let color = new gradientColor('#ff9a00', '#dd1009', 55);
            return color[thermalMultiply - 45];
        }
        else {
            return '#dd1009';
        }
    }
};

class DataSource {
    constructor() {
        let { baseurl, siteId, ajax } = window.buildURL;
        this.baseurl = baseurl;
        this.siteId = siteId;
        this.ajax = ajax;
    }

    // 获取天气
    getWeather(callBack) {
        let ajaxObj = this.methodGetSettings('weather');
        this.sendAjax(ajaxObj, (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (errorMsg) => {
            console.error(errorMsg);
        });
    }

    // 获取工单数据
    getWorkOrder(callBack) {
        this.sendAjax(this.methodGetSettings('workOrder', { siteId: this.siteId }), (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (errorMsg) => {
            console.error(errorMsg);
        });
    }

    // 获取访客数据
    getVisitors(callBack) {
        this.sendAjax(this.methodGetSettings('visitors', { siteId: this.siteId }), (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (errorMsg) => {
            console.error(errorMsg);
        });
    }

    // 获取场内人员统计
    getInsidePassengers(callBack) {
        this.sendAjax(this.methodGetSettings('insidePassengers', { siteId: this.siteId }), (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (errorMsg) => {
            console.error(errorMsg);
        });
    }

    // 获取车位统计数据
    getParkingPlaceStatus(callBack) {
        this.sendAjax(this.methodGetSettings('parkingPlaceStatus', { siteId: this.siteId }), (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (errorMsg) => {
            console.error(errorMsg);
        });
    }

    // 获取紧急警报列表
    getEmergencyAlarm(callBack) {
        this.sendAjax(this.methodGetSettings('emergencyAlarm', { siteId: this.siteId }), (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (errorMsg) => {
            console.error(errorMsg);
        });
    }

    // 获取根据客流设备获取的单个楼层客流统计数据
    getFloorPassengers(floorId, callBack) {
        this.sendAjax(this.methodGetSettings('floorPassengers', { floorId }), (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (errorMsg) => {
            console.error(errorMsg);
        });
    }

    // 获取设备报警列表
    getEquipmentAlarm(callBack) {
        this.sendAjax(this.methodGetSettings('equipmentAlarm', { siteId: this.siteId }), (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (errorMsg) => {
            console.error(errorMsg);
        });
    }

    // 停车场车位统计
    getParkingPlaceStatistics(callBack) {
        this.sendAjax(this.methodGetSettings('parkingPlaceStatistics', { siteId: this.siteId }), (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (errorMsg) => {
            console.error(errorMsg);
        });
    }

    // 消防报警
    getFireAlarm(callBack) {
        this.sendAjax(this.methodGetSettings('fireAlarm', { siteId: this.siteId }), (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (errorMsg) => {
            console.error(errorMsg);
        });
    }

    // 获取视频流的token
    getFlowVideoToken(callBack) {
        let ajaxObj = {
            url: "https://dm-api.exaleap.net/weather/turing/robot_dog_sr_20004",
            method: "GET",
        };
        this.sendAjax(ajaxObj, (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (status, errorMsg) => {
            callBack('The robox is not connected. Please turn on the power and connect with the Internet. (offline)');
        });
    }

    methodGetSettings(name, replaceData) {
        let { baseurl, ajax } = this, { url: subPath, method } = ajax[name];
        if (replaceData) {
            for (let key in replaceData) {
                subPath = subPath.replace('{' + key + '}', replaceData[key]);
            }
        }
        let reqUrl = window.buildURL.debug ? baseurl + '/console' + subPath + '.json' : baseurl + '/console' + subPath;
        return {
            url: reqUrl,
            method: method,
            headers: window.buildURL.headers
        }
    }

    sendAjax({ method, url, headers, body }, success, error) {
        let request = new XMLHttpRequest();
        request.open(method, url);
        for (let key in headers) {
            request.setRequestHeader(key, headers[key]);
        }
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status >= 200 && request.status < 400) {
                    typeof success === 'function' && success(JSON.parse(request.responseText));
                } else {
                    typeof error === 'function' && error(request.status);
                }
            }
        };
        request.send(body);
    }

    destory() {
        this.ajax = null;
        this.baseurl = null;
        this.siteId = null;
    }
}

class DataFill {
    constructor() {
        this.dataSource = new DataSource();
    }

    // 初始化楼层客流统计数据
    initFloorPassengers(build, floor, panel) {
        const symbolUrl = 'symbols/3d-panel/build-panel/mr-build-panel.json';
        let floorNum = floor.a('floorNum'),
            floorType = floor.a('floorType'),
            { ID } = floor.a('info');

        if (window.buildURL.debug) {
            ID = util.randomNumBetween(0, 1);
        }

        panel.s('shape3d.image', 'symbols/3d-icon/loading.json');
        panel.a('isLoading', true);
        panel.p3(util.getP3ByAnchor3d(build.g3d, floor, floor.a('panelAnchor') ? floor.a('panelAnchor') : { x: 0, y: 0.5, z: 1 }));

        this.dataSource.getFloorPassengers(ID, (result) => {
            if (build.preClickInfo && build.preClickInfo.preClickNode !== floor) return;
            panel.s('shape3d.image', symbolUrl);
            panel.a('isLoading', false);

            let { totalPassengers } = result || {};
            totalPassengers = totalPassengers || 0;

            let { color, level } = build.getInfoByNum(floorType, totalPassengers);
            panel.s('state', 'level' + level);
            panel.a({
                floorNum: floorNum,
                totalPassengers: totalPassengers
            });

            pTools.setFloorStatus(floor, color);
        });
        pTools.showPanel(build, floor, panel, null, '楼层地板');
    }

    // 初始化天气数据
    initWeather(panel) {
        this.dataSource.getWeather((result) => {
            let { city, pm25, weatherImg } = result.data || {};
            let pm25Des = result.data.futures[0].desc;
            let temperature = 22;
            let temperature1 = `${result.data.futures[0].minTemperature}° / ${result.data.futures[0].maxTemperature}°`;
            panel.a({
                temperature,
                temperature1,
                city,
                pm25Des,
                pm25,
                pm25Color: config.getColorByAirQualityIndex(pm25)
            });
        });
    }

    // 初始化工单数据
    initWorkOrder(panel) {
        this.dataSource.getWorkOrder((result) => {
            let { today, week } = result.data || {}, { totalWork, unhandled } = today || {},
                xData = [];
            if (week instanceof Array && week.length > 0) {
                week.forEach((day, index) => {
                    let { timePoint = '2019-01-01', totalWork } = day;
                    xData.push(totalWork);
                    xData.push(0);
                    //panel.a('label_' + index, timePoint.match(/\d{2}-\d{2}$/)[0]);
                });
            }
            totalWork = totalWork || 0;
            unhandled = unhandled || 0;
            panel.a({
                'chart.values': xData,
                totalWork,
                unhandled
            });
        });
    }

    // 初始化访客数据
    initVisitors(panel) {
        this.dataSource.getVisitors((result) => {
            let { dayVisitors, syncRatio, temporary, unsuccessful, dayPeak } = result.data || {};
            if (dayPeak instanceof Array && dayPeak.length > 0) {
                let { begin: begin1, end: end1 } = dayPeak[0], { begin: begin2, end: end2 } = dayPeak[1];
                panel.a({ begin1, end1, begin2, end2 });
            }
            dayVisitors = dayVisitors || 0;
            syncRatio = syncRatio || 0;
            temporary = temporary || 0;
            unsuccessful = unsuccessful || 0;

            panel.a({
                dayVisitors,
                syncRatio,
                temporary,
                unsuccessful,
                syncRatioColor: syncRatio > 0 ? 'rgb(212, 0, 0)' : 'rgb(111, 212, 74)',
                upShapeVisible: syncRatio > 0,
                downShapeVisible: syncRatio <= 0
            });
        });
    }

    // 初始化场内人员统计
    initInsidePassengers(panel) {
        this.dataSource.getInsidePassengers((result) => {
            let { totalEmployees, totalVisitors } = result || {};
            totalEmployees = totalEmployees || 0;
            totalVisitors = totalVisitors || 0;
            panel.a({ totalEmployees, totalVisitors });
        });
    }

    // 初始化车位统计数据
    initParkingPlaceStatus(panel) {
        this.dataSource.getParkingPlaceStatus((result) => {
            let { totalParkingPlace, emptyParkingPlace } = result || {};
            totalParkingPlace = totalParkingPlace || 0;
            emptyParkingPlace = emptyParkingPlace || 0;
            panel.a({ totalParkingPlace, emptyParkingPlace });
        });
    }

    // 初始化时间数据
    initTime(panel) {
        let date = new Date(),
            year = util.formatDate(date, 'yyyy'),
            month = util.formatDate(date, 'MM'),
            day = util.formatDate(date, 'dd'),
            week = util.formatDate(date, '周w'),
            time = util.formatDate(new Date(), 'hh: mm'),
            lunarDay = util.GetLunarDay(date.getFullYear(), date.getMonth() + 1, date.getDate());
        panel.a({ year, month, day, week, time, lunarDay });
    }

    // 初始化设备报警
    initEquipmentAlarm(build) {
        let { g3d, dm3d, basement, business, office, all } = build;
        const clearAlarms = (buildNodes) => {
            let { alarms } = buildNodes;
            if (alarms.length > 0) {
                for (let i = alarms.length - 1; i >= 0; i--) {
                    dm3d.remove(alarms[i]);
                }
                alarms.length = 0;
            }
        };
        this.dataSource.getEquipmentAlarm((result) => {
            let data = result.data || [];
            all.alarms.length = 0;
            clearAlarms(basement);
            clearAlarms(business);
            clearAlarms(office);
            if (data instanceof Array && data.length > 0) {
                data.forEach((info) => {
                    let floorId = info.floorId,
                        floorNode = pTools.getFloorByFloorId(floorId, all.floorNodes);
                    if (floorNode) {
                        let p3 = floorNode.p3(),
                            floorNum = floorNode.a('floorNum'),
                            floorType = floorNode.a('floorType'),
                            randomPointInCircle = util.getRandomPointInCircle(p3[0], p3[2], floorNode.getWidth() / 4);
                        let alarmNode = pTools.addAlarmNode({
                            dm3d,
                            floorNum,
                            floorType,
                            attr: info,
                            p3: [randomPointInCircle.x, p3[1], randomPointInCircle.y]
                        });
                        floorType === 'basement' && basement.alarms.push(alarmNode);
                        floorType === 'business' && business.alarms.push(alarmNode);
                        floorType === 'office' && office.alarms.push(alarmNode);
                        all.alarms.push(alarmNode);
                    }
                });
                pTools.sortDm3dData(g3d, dm3d);
            }
        });
    }

    // 初始化紧急警报列表
    initEmergencyAlarm(panel) {
        let dataSource = [];
        this.dataSource.getEmergencyAlarm((result) => {
            let data = result.data || [];
            if (data instanceof Array && data.length > 0) {
                for (let i = 0, l = data.length; i < l; i++) {
                    let { type, latestTime, buildingName, spaceName, faultName } = data[i];
                    dataSource.push({
                        time: latestTime,
                        alarmDetail: buildingName + ' ' + spaceName,
                        name: faultName,
                        type
                    });
                }
                panel.a('dataSource', dataSource);
                panel.a('tableRowIndex', 0);
                animate.scrollAlarmTable(panel);
            }
        });
    }

    // 初始化停车场车位统计
    initParkingPlaceStatistics(panel) {
        this.dataSource.getParkingPlaceStatistics(result => {
            let data = result.data || {};
            panel.a("openingTime", `${data.startTime} - ${data.endTime}`);
            panel.a("usedPark", data.usedPark);
            panel.a("usualParkingLot", data.usualParkingLot);
            panel.a("seldomParkingLot", data.seldomParkingLot);
        });
    }

    // 初始化消防报警
    initFireAlarm(panel) {
        this.dataSource.getFireAlarm(result => {
            let data = result.data || {};
            panel.a("alarmNum", data.alarmNum);
            panel.a("unhandled", data.unhandled);
            panel.a("handled", data.handled);
        });
    }

    // 获取视频流 token
    getFlowVedioToken(callBack) {
        this.dataSource.getFlowVideoToken(response => {
            typeof callBack === 'function' && callBack(response);
        });
    }

    // 销毁函数
    destory() {
        this.dataSource.destory();
        this.dataSource = null;
    }
}

class Build {
    constructor(notifier) {
        this.dataFill = new DataFill();
        this.notifier = notifier;
        this.notifier.add(common.notifyCb.bind(this, ['zj', 'dt', 'ft', 'jb', 'kl']));
        this.showBuildByType = common.showBuildByType;
        this.executeBtnAction = common.executeBtnAction;
        this.startAnimate = common.startAnimate;
        this.addPropertyChangeListener = common.addPropertyChangeListener;
        this.allPanelStatus = {
            alarmPanel: { scale: 3, leftX: -600, rightX: 1350 },
            escalatorPanel: { scale: 3, leftX: -600, rightX: 1350 },
            elevatorPanel: { scale: 3, leftX: -600, rightX: 1350 },
            gatePanel: { scale: 3, leftX: -600, rightX: 1350 }
        };
    }
    loadScreen(screen) {
        Object.assign(this, { g3d: screen.g3d, dm3d: screen.dm3d, g2d: screen.g2d, dm2d: screen.dm2d });
        let { g3d } = this, { pc2d, pc3d } = window.htBuildConfig.screen,
            dirBasePath = window.buildURL.dirBasePath;
        g3d.setOrtho(true);
        screen.load3dScreen(dirBasePath + '/' + pc3d, null, (g3d, dm3d) => {
            this.init3dNodes();
            screen.add3dMiEvent(event.mi3dEvent, this);
            screen.add3dMpEvent(event.mp3dEvent, this);
            this.notifier.fire({ kind: 'buildLoaded' });
        });
        screen.load2dScreen(dirBasePath + '/' + pc2d, null, (g2d, dm2d) => {
            this.init2dNodes();
            screen.add2dMiEvent(event.mi2dEvent, this);
            this.notifier.fire({ kind: 'buildLoaded' });
        });
    }
    destory() {
        let { dm3d } = this;
        this.basement = null;
        this.business = null;
        this.office = null;
        this.all = null;
        this.floorPanel = null; // 楼层面板
        this.escalatorPanel = null; // 扶梯面板
        this.elevatorPanel = null; // 电梯面板
        this.gatePanel = null; // 闸机面板
        this.alarmPanel = null; // 告警面板
        this.panel1 = null;
        this.panel2 = null;
        this.panel3 = null;
        this.panel4 = null;
        this.panel5 = null;
        this.panel6 = null;
        this.weatherPanel = null;
        this.timePanel = null;
        this.bottomPanel = null;
        this.settingPanel = null;
        this.preClickInfo = null;
        this.buildPanelStatus = null;
        this.editBuildName = null;
        if (this.right_alarmPanel) this.right_alarmPanel = null;
        if (this.left_alarmPanel) this.left_alarmPanel = null;
        if (this.right_escalatorPanel) this.right_escalatorPanel = null;
        if (this.left_escalatorPanel) this.left_escalatorPanel = null;
        if (this.right_elevatorPanel) this.right_elevatorPanel = null;
        if (this.left_elevatorPanel) this.left_elevatorPanel = null;
        if (this.right_gatePanel) this.right_gatePanel = null;
        if (this.left_gatePanel) this.left_gatePanel = null;
        if (this.player) {
            this.player.dispose();
            this.player = null;
        }
        // 3d 动画调度
        if (this.task3d) {
            dm3d.removeScheduleTask(this.task3d);
            this.task3d = null;
        }
        // 3d 隐藏闪烁调度
        if (this.nodeBlinkTask) {
            dm3d.removeScheduleTask(this.nodeBlinkTask);
            this.nodeBlinkTask = null;
        }
        // 随机电梯楼层 interval
        if (this.randomElevatorFloorInterval) {
            clearInterval(this.randomElevatorFloorInterval);
            this.randomElevatorFloorInterval = null;
        }
        // 时间天气切换 interval
        if (this.weatherTimeChangeInterval) {
            clearInterval(this.weatherTimeChangeInterval);
            this.weatherTimeChangeInterval = null;
        }
        // 正常数据刷新 interval
        if (this.normalRefreshInterval) {
            clearInterval(this.normalRefreshInterval);
            this.normalRefreshInterval = null;
        }
        // 紧急数据刷新 interval
        if (this.alarmRefreshInterval) {
            clearInterval(this.alarmRefreshInterval);
            this.alarmRefreshInterval = null;
        }
        // 时间刷新 interval
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
            this.timeInterval = null;
        }
        // 底部告警列表滚动 interval
        if (this.emergencyAlarmInterval) {
            clearInterval(this.emergencyAlarmInterval);
            this.emergencyAlarmInterval = null;
        }
        // 底部告警列表动画调度
        if (pTools.scrollAnimate) {
            pTools.scrollAnimate = null;
        }
    }
    initBuildSpaceId() {
        let { dimensionInfo } = window.buildURL;
        let { basement, business, office } = this, { ID, Building } = dimensionInfo,
        basementFloorIds = Building[0].Floor,
            businessFloorIds = Building[1].Floor,
            officeFloorIds = Building[2].Floor;
        basement.floorNodes.forEach((floor, index) => {
            floor.a('info', basementFloorIds[index]);
        });
        business.floorNodes.forEach((floor, index) => {
            floor.a('info', businessFloorIds[index]);
        });
        office.floorNodes.forEach((floor, index) => {
            floor.a('info', officeFloorIds[index]);
        });
    }
    init2dNodes() {
        let { dm2d, notifier } = this;
        this.editBuildName = 'all';
        this.buildPanelStatus = {
            all: { 'zj': true, 'dt': true, 'ft': false, 'jb': true, 'kl': true },
            basement: { 'zj': true, 'dt': true, 'ft': false, 'jb': true, 'kl': true },
            business: { 'zj': true, 'dt': true, 'ft': false, 'jb': true, 'kl': true },
            office: { 'zj': true, 'dt': true, 'ft': false, 'jb': true, 'kl': true }
        };
        dm2d.each((node) => {
            let displayName = node.getDisplayName();
            if (displayName === '工单面板') {
                this.panel1 = node;
                node.a('notifier', notifier);
            }
            if (displayName === '设备检修面板') {
                this.panel2 = node;
                node.a('notifier', notifier);
            }
            if (displayName === '消防报警面板') {
                this.panel3 = node;
                node.a('notifier', notifier);
            }
            if (displayName === '重点区域监控面板') {
                this.panel4 = node;
                node.a('notifier', notifier);
            }
            if (displayName === '车位统计面板') {
                this.panel5 = node;
                node.a('notifier', notifier);
            }
            if (displayName === '功能面板') {
                this.panel6 = node;
                node.a('notifier', notifier);
            }
            if (displayName === '天气面板') this.weatherPanel = node;
            if (displayName === '时间面板') this.timePanel = node;
            if (displayName === '底部面板') this.bottomPanel = node;
            if (displayName === '设置面板') this.settingPanel = node;
            if (displayName === '投屏') node.a('notifier', notifier);
            if (displayName === '左侧toggle') node.a('notifier', notifier);
            if (displayName === '右侧toggle') node.a('notifier', notifier);
        });
    }
    init3dNodes() {
        let { g3d, dm3d } = this;
        let basement = this.basement = {
                gates: [],
                gateBlinks: [],
                elevators: [],
                elevatorLines: [],
                floorNodes: [],
                escalators: [],
                alarms: []
            }, // 地下室
            business = this.business = {
                gates: [],
                gateBlinks: [],
                elevators: [],
                elevatorLines: [],
                floorNodes: [],
                escalators: [],
                alarms: []
            }, // 商业楼层
            office = this.office = {
                gates: [],
                gateBlinks: [],
                elevators: [],
                elevatorLines: [],
                floorNodes: [],
                escalators: [],
                alarms: []
            }, // 办公楼层
            all = this.all = {
                gates: [],
                gateBlinks: [],
                elevators: [],
                elevatorLines: [],
                floorNodes: [],
                escalators: [],
                alarms: []
            }; //全楼
        this.makeBuilding();
        this.initBuildSpaceId();

        dm3d.each((node) => {
            let displayName = node.getDisplayName();
            if (displayName === '地-商-办') {
                let childs = node.getChildren();
                childs.each((child) => {
                    let displayName = child.getDisplayName();
                    if (displayName === '电梯线集合') {
                        let elevatorLines = child.getChildren().toArray();
                        basement.elevatorLines.push(...elevatorLines);
                        business.elevatorLines.push(...elevatorLines);
                        office.elevatorLines.push(...elevatorLines);
                        all.elevatorLines.push(...elevatorLines);
                    }
                    if (displayName === '电梯集合') {
                        let elevators = child.getChildren().toArray();
                        basement.elevators.push(...elevators);
                        business.elevators.push(...elevators);
                        office.elevators.push(...elevators);
                        all.elevators.push(...elevators);
                    }
                });
            }
            if (displayName === '地-商') {
                let childs = node.getChildren();
                childs.each((child) => {
                    let displayName = child.getDisplayName();
                    if (displayName === '电梯线集合') {
                        let elevatorLines = child.getChildren().toArray();
                        basement.elevatorLines.push(...elevatorLines);
                        business.elevatorLines.push(...elevatorLines);
                        all.elevatorLines.push(...elevatorLines);
                    }
                    if (displayName === '电梯集合') {
                        let elevators = child.getChildren().toArray();
                        basement.elevators.push(...elevators);
                        business.elevators.push(...elevators);
                        all.elevators.push(...elevators);
                    }
                });
            }
            if (displayName === '商-办') {
                let childs = node.getChildren();
                childs.each((child) => {
                    let displayName = child.getDisplayName();
                    if (displayName === '电梯线集合') {
                        let elevatorLines = child.getChildren().toArray();
                        business.elevatorLines.push(...elevatorLines);
                        office.elevatorLines.push(...elevatorLines);
                        all.elevatorLines.push(...elevatorLines);
                    }
                    if (displayName === '电梯集合') {
                        let elevators = child.getChildren().toArray();
                        business.elevators.push(...elevators);
                        office.elevators.push(...elevators);
                        all.elevators.push(...elevators);
                    }
                });
            }
            if (displayName === '商') {
                let childs = node.getChildren();
                childs.each((child) => {
                    let displayName = child.getDisplayName();
                    if (displayName === '扶梯集合') {
                        let escalators = child.getChildren().toArray();
                        business.escalators.push(...escalators);
                        all.escalators.push(...escalators);
                    }
                });
            }
            if (displayName === '楼层面板') {
                this.floorPanel = node;
            }
        });
        all.floorNodes = basement.floorNodes.concat(business.floorNodes, office.floorNodes);

        // 设置电梯的运行范围。 3d 编辑器中电梯名称命名规则 电梯-B4-22F 即 电梯-起始楼层-结束楼层 否则解析错误
        all.elevators.forEach((elevator) => {
            let splitDisplayName = elevator.getDisplayName().split('-'),
                { beginIndex, endIndex } = pTools.getBeginAndEndFloorIndex(2, splitDisplayName[1], splitDisplayName[2]);
            pTools.setElevatorMoveRange(all.floorNodes.slice(beginIndex, endIndex + 1), elevator);
        });
        // 设置电梯线的长度与高度。 3d 编辑器中电梯线名称命名规则 电梯线-B4-22F 即 电梯线-起始楼层-结束楼层 否则解析错误
        all.elevatorLines.forEach((elevatorLine) => {
            let splitDisplayName = elevatorLine.getDisplayName().split('-'),
                { beginIndex, endIndex } = pTools.getBeginAndEndFloorIndex(2, splitDisplayName[1], splitDisplayName[2]);
            elevatorLine.setAnchor3d({ x: 0.5, y: 0, z: 0.5 }, true);
            let beginFloor = all.floorNodes[beginIndex],
                endFloor = all.floorNodes[endIndex],
                endFloorDown = endFloor.getElevation() - endFloor.getTall() / 2,
                endFloorUp = endFloor.getElevation() + endFloor.getTall() / 2,
                beginFloorUp = beginFloor.getElevation() + beginFloor.getTall() / 2,
                tall = endFloorUp - beginFloorUp,
                elevation = beginFloorUp;
            let endNextFloor = all.floorNodes[endIndex + 1];
            if (endNextFloor) {
                tall += endNextFloor.getElevation() - endNextFloor.getTall() / 2 - endFloorUp;
            } else {
                let endPreFloor = all.floorNodes[endIndex - 1];
                tall += endFloorDown - (endPreFloor.getElevation() + endPreFloor.getTall() / 2);
            }
            elevatorLine.setTall(tall);
            elevatorLine.setElevation(elevation);
        });

        pTools.sortDm3dData(g3d, dm3d);
    }
    makeBuilding() {
        let { g3d, dm3d, basement, business, office } = this,
        first1 = dm3d.getDataByTag('first1'), last1 = dm3d.getDataByTag('last1'),
            first2 = dm3d.getDataByTag('first2'), last2 = dm3d.getDataByTag('last2'),
            first3 = dm3d.getDataByTag('first3'), last3 = dm3d.getDataByTag('last3'),
            first4 = dm3d.getDataByTag('first4'), last4 = dm3d.getDataByTag('last4');

        const defXZ = { x: -200, z: 500 };
        architecture.makeBuilding(g3d, first1, last1, 2, {
            getColor: (floorNum) => '41, 166, 221',
            getOpacity: (floorNum) => 0.3,
            getTall: (floorNum) => 20,
            getThickness: (floorNum) => 10,
            floorCall: (floorNum, floorNode, wireNode) => {
                const floorNums = ['B2', 'B1'];
                floorNode.setDisplayName('楼层地板');
                floorNode.a('floorNum', floorNums[floorNum - 1]);
                floorNode.a('floorType', 'basement');
                basement.floorNodes.push(floorNode);
            }
        }, defXZ);
        architecture.makeBuilding(g3d, first2, last2, 3, {
            getColor: (floorNum) => {
                if (floorNum === 3) return '186, 17, 90';
                return '145, 145, 145';
            },
            getOpacity: (floorNum) => {
                if (floorNum === 3) return 0.89;
                return 0.71;
            },
            getTall: (floorNum) => 20,
            getThickness: (floorNum) => 10,
            floorCall: (floorNum, floorNode, wireNode) => {
                const floorNums = ['1F', '2F', '3F'];
                floorNode.setDisplayName('楼层地板');
                floorNode.a('floorNum', floorNums[floorNum - 1]);
                floorNode.a('floorType', 'business');
                business.floorNodes.push(floorNode);
            }
        }, defXZ);
        architecture.makeBuilding(g3d, first3, last3, 11, {
            getColor: (floorNum) => '53, 155, 219',
            getOpacity: (floorNum) => {
                if (floorNum === 11) return 0.75;
                return 0.35;
            },
            getTall: (floorNum) => 20,
            getThickness: (floorNum) => 10,
            floorCall: (floorNum, floorNode, wireNode) => {
                const floorNums = ['4F', '5F', '6F', '7F', '8F', '9F', '10F', '11F', '12F', '15F', '16F'];
                floorNode.setDisplayName('楼层地板');
                floorNode.a('floorNum', floorNums[floorNum - 1]);
                floorNode.a('floorType', 'office');
                office.floorNodes.push(floorNode);
            }
        }, defXZ);
        architecture.makeBuilding(g3d, first4, last4, 11, {
            getColor: (floorNum) => {
                if (floorNum === 11) return '30, 187, 212';
                return '49, 210, 235'
            },
            getOpacity: (floorNum) => {
                if (floorNum === 11) return 0.9;
                return 0.64
            },
            getTall: (floorNum) => 20,
            getThickness: (floorNum) => 10,
            floorCall: (floorNum, floorNode, wireNode) => {
                const floorNums = ['17F', '18F', '19F', '20F', '21F', '22F', '23F', '25F', '26F', '27F', '28F'];
                floorNode.setDisplayName('楼层地板');
                floorNode.a('floorNum', floorNums[floorNum - 1]);
                floorNode.a('floorType', 'office');
                office.floorNodes.push(floorNode);
            }
        }, defXZ);
    }
    refresh() {
        let { normalRefreshTime, alarmRefreshTime, emergencyAlarmRefreshTime } = window.buildURL, { dataFill, timePanel, bottomPanel } = this;
        dataFill.initTime(timePanel);
        this.refreshNormalData();
        this.refreshAlarmData();
        this.normalRefreshInterval = setInterval(() => {
            this.refreshNormalData();
        }, normalRefreshTime);
        this.alarmRefreshInterval = setInterval(() => {
            this.refreshAlarmData();
        }, alarmRefreshTime);
        this.timeInterval = setInterval(() => {
            dataFill.initTime(timePanel);
        }, 60 * 1000);
        this.emergencyAlarmInterval = setInterval(() => {
            let dataSource = bottomPanel.a('dataSource');
            if (dataSource instanceof Array && dataSource.length > 4) {
                animate.scrollAlarmTable(bottomPanel);
            }
        }, emergencyAlarmRefreshTime);
    }
    refreshNormalData() {
        let { dataFill, weatherPanel, panel1, panel2, bottomPanel, panel5, panel3 } = this;
        dataFill.initWeather(weatherPanel);
        dataFill.initWorkOrder(panel1);
        dataFill.initParkingPlaceStatus(bottomPanel);
        dataFill.initParkingPlaceStatistics(panel5);
        dataFill.initFireAlarm(panel3);
        //dataFill.initEquipmentAlarm(this);
    }
    refreshAlarmData() {
            let { dataFill, bottomPanel } = this;
            dataFill.initEmergencyAlarm(bottomPanel);
        }
        // 根据楼层类别以及楼层人数获取楼层颜色以及等级信息
    getInfoByNum(type, num) {
        if (type === 'office') { // 办公楼
            if (num >= 0 && num < 100) return { color: 'rgb(0, 180, 81)', level: 5 };
            if (num >= 100 && num < 200) return { color: 'rgb(115, 204, 52)', level: 4 };
            if (num >= 200 && num < 300) return { color: 'rgb(66, 180, 218)', level: 3 };
            if (num >= 300 && num < 400) return { color: 'rgb(255, 183, 27)', level: 2 };
            if (num >= 400) return { color: 'rgb(224, 68, 3)', level: 1 };
        }
        if (type === 'business') { // 商业楼层
            if (num >= 0 && num < 160) return { color: 'rgb(0, 180, 81)', level: 5 };
            if (num >= 160 && num < 320) return { color: 'rgb(115, 204, 52)', level: 4 };
            if (num >= 320 && num < 480) return { color: 'rgb(66, 180, 218)', level: 3 };
            if (num >= 480 && num < 640) return { color: 'rgb(255, 183, 27)', level: 2 };
            if (num >= 640) return { color: 'rgb(224, 68, 3)', level: 1 };
        }
        if (type === 'basement') { // 地下室
            if (num >= 0 && num < 40) return { color: 'rgb(0, 180, 81)', level: 5 };
            if (num >= 40 && num < 80) return { color: 'rgb(115, 204, 52)', level: 4 };
            if (num >= 80 && num < 120) return { color: 'rgb(66, 180, 218)', level: 3 };
            if (num >= 120 && num < 160) return { color: 'rgb(255, 183, 27)', level: 2 };
            if (num >= 160) return { color: 'rgb(224, 68, 3)', level: 1 };
        }
    }
}

class Main {
    constructor() {
        let notifier = this.notifier = new ht.Notifier();
        this.build = new Build(notifier);
    }
    setScreenLang(lang, callBack) {
        let langTypes = ['en', 'tw', 'zh'];
        if (langTypes.indexOf(lang) > -1) {
            ht.Default.loadJS([`${window.buildURL.dirBasePath}/js/locales/${lang}.js`], () => {
                let { g2d, g3d } = this;
                g2d && g2d.redraw();
                g3d && g3d.iv();
                typeof callBack === 'function' && callBack();
            });
        } else {
            console.warn('请传入正确的 language 枚举类型：en, tw, zh');
        }
    }
    loadScreen(parentElement) {
        this.setScreenLang(window.buildURL.defaultLang || 'zh', () => {
            let screen = this.screen = new Screen();
            screen.init3dScreen(parentElement);
            screen.init2dScreen({
                commonListener: (g2d, e) => {
                    let node = g2d.getDataAt(e);
                    if (node) {
                        let displayName = node.getDisplayName();
                        if (displayName === 'video1') {
                            e.stopPropagation();
                        }
                    }
                }
            });
            Object.assign(this, { g3d: screen.g3d, dm3d: screen.dm3d, g2d: screen.g2d, dm2d: screen.dm2d });

            this.build.loadScreen(screen);
        });
    }
    removeScreen(parentElement) {
        if (this.build) {
            this.build.destory();
        }
        this.screen.destory(parentElement);
        this.screen = null;
    }
}

var m = new Main();

return m;

}());
