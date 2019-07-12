export default class Screen {
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
        g2d.getSelectWidth = function() { return 0; };
        // 禁止鼠标缩放
        g2d.handleScroll = function() {};
        // 禁止 touch 下双指缩放
        g2d.handlePinch = function() {};
        // 禁止平移
        g2d.setPannable(false);
        // 禁止框选
        g2d.setRectSelectable(false);
        // 隐藏滚动条
        g2d.setScrollBarVisible(false);
        // 禁止图元移动
        g2d.setMovableFunc(function() { return false; });

        if (g3d) {
            g3d.getView().appendChild(g2d.getView());
        } else {
            document.body.appendChild(g2d.getView());
        }
        if (listenerMap) {
            let { downListener, moveListener, upListener, wheelListener, commonListener } = listenerMap;
            if (commonListener) {
                this.commonListener = commonListener;
                g2dView.addEventListener('mousedown', this.commonListener.bind(this, g2d));
                g2dView.addEventListener('mousemove', this.commonListener.bind(this, g2d));
                g2dView.addEventListener('mouseup', this.commonListener.bind(this, g2d));
                g2dView.addEventListener('touchstart', this.commonListener.bind(this, g2d));
                g2dView.addEventListener('touchmove', this.commonListener.bind(this, g2d));
                g2dView.addEventListener('touchend', this.commonListener.bind(this, g2d));
            }
            if (downListener) {
                this.downListener = downListener;
                g2dView.addEventListener('mousedown', this.downListener.bind(this, g2d));
                g2dView.addEventListener('touchstart', this.downListener.bind(this, g2d));
            }
            if (moveListener) {
                this.moveListener = moveListener;
                g2dView.addEventListener('mousemove', this.moveListener.bind(this, g2d));
                g2dView.addEventListener('touchmove', this.moveListener.bind(this, g2d));
            }
            if (upListener) {
                this.upListener = upListener;
                g2dView.addEventListener('mouseup', this.upListener.bind(this, g2d));
                g2dView.addEventListener('touchend', this.upListener.bind(this, g2d));
            }
            if (wheelListener) {
                this.wheelListener = wheelListener;
                g2dView.addEventListener('mousewheel', this.wheelListener.bind(this, g2d));
            }
        }

        this.g2dResizeListener = (e) => { g2d.fitContent(false, 0);
            g2d.iv(); };
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

        this.g3dResizeListener = (e) => { g3d.iv(); };
        window.addEventListener('resize', this.g3dResizeListener);

        typeof callBack === 'function' && callBack(g3d, dm3d);
    }
    load2dScreen(g2dUrl, beforeCallBack, afterCallBack) {
        let dm2d = this.dm2d;
        let g2d = this.g2d;
        dm2d.clear();
        typeof beforeCallBack === 'function' && beforeCallBack(g2d, dm2d);
        if (typeof g2dUrl === 'string') {
            ht.Default.xhrLoad(g2dUrl, (json) => {
                if (json) {
                    dm2d.deserialize(json);
                    typeof afterCallBack === 'function' && afterCallBack(g2d, dm2d);
                } else {
                    console.log('资源加载失败');
                }
            });
        } else if (g2dUrl instanceof ht.Data) {
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
        if (typeof g3dUrl === 'string') {
            ht.Default.xhrLoad(g3dUrl, (json) => {
                if (json) {
                    dm3d.deserialize(json);
                    let screenJson = ht.Default.parse(json);
                    let screenAttr = ht.Default.clone(screenJson.a);
                    let defaultScene = this.defaultScene = screenJson.scene;
                    if (g3d.isOrtho()) {
                        let { eye, center, orthoWidth } = window.htBuildConfig;
                        g3d.setOrthoWidth(ht.Default.isTouchable ? orthoWidth.mb : orthoWidth.pc);
                        g3d.setEye(ht.Default.isTouchable ? eye.mb : eye.pc);
                        g3d.setCenter(ht.Default.isTouchable ? center.mb : center.pc);
                    } else {
                        g3d.setEye(defaultScene.eye);
                        g3d.setCenter(defaultScene.center);
                    }
                    g3d.setFar(defaultScene.far);
                    g3d.setNear(defaultScene.near);
                    typeof afterCallBack === 'function' && afterCallBack(g3d, dm3d, screenAttr);
                } else {
                    console.log('资源加载失败');
                }
            });
        } else if (g3dUrl instanceof ht.Data) {
            let node = g3dUrl;
            g3dUrl = null;
            dm3d.add(node);
            this.addNodeChilds(node, dm3d);
            typeof afterCallBack === 'function' && afterCallBack(g3d, dm3d);
        }
    }
    reset2dEvent({ miListener, umiListener, mpListener, umpListener, scope }) {
        miListener && this.add2dMiEvent(miListener, scope);
        umiListener && this.remove2dMiEvent(umiListener, scope);
        mpListener && this.add2dMpEvent(mpListener, scope);
        umpListener && this.remove2dMpEvent(umpListener, scope);
    }
    reset3dEvent({ miListener, umiListener, mpListener, umpListener, scope }) {
        miListener && this.add3dMiEvent(miListener, scope);
        umiListener && this.remove3dMiEvent(umiListener, scope);
        mpListener && this.add3dMpEvent(mpListener, scope);
        umpListener && this.remove3dMpEvent(umpListener, scope);
    }
    add2dMiEvent(miListener, scope) {
        let { g2d, mi2dEventInfo } = this;
        if (mi2dEventInfo) {
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
        let { g3d, mi3dEventInfo } = this;
        if (mi3dEventInfo) {
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
        let { g2d, mp2dEventInfo } = this;
        if (mp2dEventInfo) {
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
        let { g3d, mp3dEventInfo } = this;
        if (mp3dEventInfo) {
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
        if (g2d) {
            dm2d.clear();
            if (this.g2dResizeListener) {
                window.removeEventListener('resize', this.g2dResizeListener);
            }
            if (this.commonListener) {
                g2dView.removeEventListener('mousedown', this.commonListener);
                g2dView.removeEventListener('mousemove', this.commonListener);
                g2dView.removeEventListener('mouseup', this.commonListener);

                g2dView.removeEventListener('touchstart', this.commonListener);
                g2dView.removeEventListener('touchmove', this.commonListener);
                g2dView.removeEventListener('touchend', this.commonListener);
            }
            if (this.downListener) {
                g2dView.removeEventListener('mousedown', this.downListener);
                g2dView.removeEventListener('touchstart', this.downListener);
            }
            if (this.moveListener) {
                g2dView.removeEventListener('mousemove', this.moveListener);
                g2dView.removeEventListener('touchmove', this.moveListener);
            }
            if (this.upListener) {
                g2dView.removeEventListener('mouseup', this.upListener);
                g2dView.removeEventListener('touchend', this.upListener);
            }
            if (this.wheelListener) {
                g2dView.removeEventListener('mousewheel', this.wheelListener);
            }
            if (this.mi2dEventInfo) {
                this.mi2dEventInfo = null;
            }
            if (this.mp2dEventInfo) {
                this.mp2dEventInfo = null;
            }
            if (g3d) {
                g3d.getView().removeChild(g2d.getView());
            } else {
                document.body.removeChild(g2d.getView());
            }
        }
    }
    remove3d(parentElement) {
        this.remove2d();
        if (this.mi3dEventInfo) {
            this.mi3dEventInfo = null;
        }
        if (this.mp3dEventInfo) {
            this.mp3dEventInfo = null;
        }
        if (this.g3dResizeListener) {
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
        if (childs && childs.size() > 0) {
            childs.each((child) => {
                dm.add(child);
                let grandSon = child.getChildren();
                if (grandSon && grandSon.size() > 0) {
                    this.addNodeChilds(child, dm);
                }
            });
        }
    }
}