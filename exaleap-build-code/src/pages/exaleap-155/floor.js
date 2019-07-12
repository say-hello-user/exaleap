export default class Floor {
    constructor(notifier) {
        this.notifier = notifier;
    }

    loadScreen(screen, para) {
        Object.assign(this, { g3d: screen.g3d, dm3d: screen.dm3d, g2d: screen.g2d, dm2d: screen.dm2d });
        let { g3d } = this,
        dirBasePath = window.buildURL.dirBasePath;
        g3d.setOrtho(false);
        screen.load3dScreen(dirBasePath + '/' + 'scenes/floor-B1.json', null, (g3d, dm3d) => {
            this.notifier.fire({ kind: 'floorLoaded', para });
        });
        screen.load2dScreen(null, null, (g2d, dm2d) => {
            this.notifier.fire({ kind: 'floorLoaded', para });
        });
    }

    destory() {
        let { dm3d } = this;
        if (this.preClickInfo) {
            this.preClickInfo = null;
        }
        if (this.task3d) {
            dm3d.removeScheduleTask(this.task3d);
            this.task3d = null;
        }
        if (this.floorFill) {
            this.floorFill.destory();
            this.floorFill = null;
        }
    }
}