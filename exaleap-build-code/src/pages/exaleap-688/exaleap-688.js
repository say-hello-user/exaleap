import Screen from "../../util/screen";
import Build from './build';
import Floor from './floor';

class Main {
    constructor() {
        let notifier = this.notifier = new ht.Notifier();
        this.build = new Build(notifier);
        this.floor = new Floor(notifier);
        this.notifier.add((e) => {
            let { kind, para } = e;
            if (kind === 'loadBuildScreen') {
                this.floor.destory();
                this.build.loadScreen(this.screen);
            }
            if (kind === 'loadFloorScreen') {
                this.build.destory();
                this.floor.loadScreen(this.screen, para);
            }
        });
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

export default m;