import DataFill from '../../util/common/dataFill';

export default class Floor {
    constructor(notifier) {
        this.dataFill = new DataFill();
        this.notifier = notifier;
        this.timeInterval = null;
    }

    loadScreen(screen, para) {
        Object.assign(this, { g3d: screen.g3d, dm3d: screen.dm3d, g2d: screen.g2d, dm2d: screen.dm2d });
        let { g3d } = this,
        dirBasePath = window.buildURL.dirBasePath;
        g3d.setOrtho(false);
        screen.load3dScreen(dirBasePath + '/' + 'scenes/floor-B1.json', null, (g3d, dm3d) => {
            this.notifier.fire({ kind: 'floorLoaded', para });
        });
        screen.load2dScreen(dirBasePath + '/' + 'displays/floor.json', null, (g2d, dm2d) => {
            this.init2dNodes();
            screen.add2dMiEvent(this.mi2dEvent, this);
            this.initFloorInfoPanel(para);
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

    init2dNodes() {
        let { dm2d } = this;
        dm2d.each((node) => {
            let displayName = node.getDisplayName();
            if (displayName === '楼层信息面板') {
                this.floorInfoPanel = node;
            }
            if (displayName === '车位信息面板') {
                this.parkingInfoPanel = node;
            }
        });
    }

    mi2dEvent(e) {
        let { kind, data, type, comp } = e;
        if (kind === 'clickData') {
            let displayName = data.getDisplayName();
            if (displayName === '切换至建筑') {
                clearInterval(this.timeInterval);
                this.notifier.fire({ kind: 'loadBuildScreen' });
            }
        }
    }

    initFloorInfoPanel(para = {}) {
        this.dataFill.initFloorInfoPanel(para.floorID, this.floorInfoPanel);
        this.dataFill.getParkingStatus(this.parkingInfoPanel);
        this.timeInterval = setInterval(() => {
            this.dataFill.getParkingStatus(this.parkingInfoPanel);
        }, 60 * 1000);
    }
}