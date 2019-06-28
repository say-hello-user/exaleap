import pTools from '../../util/pTools';
import animate from '../../util/animate';
import architecture from '../../util/architecture';
import common from '../../util/common/common';
import event from '../../util/common/event';
import DataFill from '../../util/common/dataFill';

export default class Build {
    constructor(notifier) {
        this.dataFill = new DataFill();
        this.notifier = notifier;
        this.notifier.add(common.notifyCb.bind(this, ['zj', 'dt', 'ft', 'jb', 'kl']));
        this.showBuildByType = common.showBuildByType;
        this.executeBtnAction = common.executeBtnAction;
        this.startAnimate = common.startAnimate;
        this.addPropertyChangeListener = common.addPropertyChangeListener;
        this.allPanelStatus = {
            alarmPanel: { scale: 3, leftX: -1100, rightX: 1350 },
            escalatorPanel: { scale: 3, leftX: -1100, rightX: 1350 },
            elevatorPanel: { scale: 3, leftX: -1100, rightX: 1350 },
            gatePanel: { scale: 3, leftX: -1100, rightX: 1350 }
        };
    }
    loadScreen(screen) {
        Object.assign(this, { g3d: screen.g3d, dm3d: screen.dm3d, g2d: screen.g2d, dm2d: screen.dm2d });
        let { g3d } = this, { pc2d, pc3d } = window.htBuildConfig.screen,
            dirBasePath = window.wfcUrl.dirBasePath;
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
        if(this.right_alarmPanel) this.right_alarmPanel = null;
        if(this.left_alarmPanel) this.left_alarmPanel = null;
        if(this.right_escalatorPanel) this.right_escalatorPanel = null;
        if(this.left_escalatorPanel) this.left_escalatorPanel = null;
        if(this.right_elevatorPanel) this.right_elevatorPanel = null;
        if(this.left_elevatorPanel) this.left_elevatorPanel = null;
        if(this.right_gatePanel) this.right_gatePanel = null;
        if(this.left_gatePanel) this.left_gatePanel = null;
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
        if(this.nodeBlinkTask) {
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
        let { dimensionInfo } = window.wfcUrl;
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
                    if (displayName === '电梯线集合') {
                        let elevatorLines = child.getChildren().toArray();
                        business.elevatorLines.push(...elevatorLines);
                        all.elevatorLines.push(...elevatorLines);
                    }
                    if (displayName === '电梯集合') {
                        let elevators = child.getChildren().toArray();
                        business.elevators.push(...elevators);
                        all.elevators.push(...elevators);
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
            elevatorLine.setAnchor3d({x: 0.5, y: 0, z: 0.5}, true);
            let beginFloor = all.floorNodes[beginIndex],
                endFloor = all.floorNodes[endIndex],
                endFloorDown = endFloor.getElevation() - endFloor.getTall() / 2,
                endFloorUp = endFloor.getElevation() + endFloor.getTall() / 2,
                beginFloorUp = beginFloor.getElevation() + beginFloor.getTall() / 2,
                tall = endFloorUp - beginFloorUp,
                elevation = beginFloorUp;
            let endNextFloor = all.floorNodes[endIndex + 1];
            if(endNextFloor) {
                tall += endNextFloor.getElevation() - endNextFloor.getTall() / 2 - endFloorUp;
            }
            else {
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
            first3 = dm3d.getDataByTag('first3'), last3 = dm3d.getDataByTag('last3');

        const defXZ = { x: 1000, z: 400 };
        architecture.makeBuilding(g3d, first1, last1, 2, {
            getColor: (floorNum) => '51, 153, 255',
            getOpacity: (floorNum) => 0.43,
            getTall: (floorNum) => 18,
            getThickness: (floorNum) => 6,
            floorCall: (floorNum, floorNode, wireNode) => {
                const floorNums = ['B2', 'B1'];
                floorNode.setDisplayName('楼层地板');
                floorNode.a('floorNum', floorNums[floorNum - 1]);
                floorNode.a('floorType', 'basement');
                floorNode.a('panelAnchor', { x: 0.05, y: 0.5, z: 0.45 });
                basement.floorNodes.push(floorNode);
            }
        }, defXZ);
        architecture.makeBuilding(g3d, first2, last2, 3, {
            getColor: (floorNum) => {
                if (floorNum === 3) return '186, 17, 90';
                return '96, 172, 252';
            },
            getOpacity: (floorNum) => {
                if (floorNum === 3) return 0.89;
                return 0.56;
            },
            getTall: (floorNum) => 18,
            getThickness: (floorNum) => 6,
            floorCall: (floorNum, floorNode, wireNode) => {
                const floorNums = ['1F', '2F', '3F'];
                floorNode.setDisplayName('楼层地板');
                floorNode.a('floorNum', floorNums[floorNum - 1]);
                floorNode.a('floorType', 'business');
                floorNode.a('panelAnchor', { x: 0.04, y: 0.5, z: 0.48 });
                business.floorNodes.push(floorNode);
            }
        }, defXZ);
        architecture.makeBuilding(g3d, first3, last3, 22, {
            getColor: (floorNum) => {
                if(floorNum >= 1 && floorNum <= 11) {
                    return '110, 173, 240';
                }
                if(floorNum === 22) {
                    return '49, 210, 235';
                }
                return '134, 204, 124';
            },
            getOpacity: (floorNum) => {
                if(floorNum >= 1 && floorNum <= 11) {
                    return 0.43;
                }
                if(floorNum === 22) {
                    return 0.83;
                }
                return 0.35;
            },
            getTall: (floorNum) => 18,
            getThickness: (floorNum) => 6,
            floorCall: (floorNum, floorNode, wireNode) => {
                const floorNums = ['4F', '5F', '6F', '7F', '8F', '9F', '10F', '11F', '12F', '15F', '16F', '17F', '18F', '19F', '20F', '21F', '22F', '23F', '25F', '26F', '27F', '28F'];
                floorNode.setDisplayName('楼层地板');
                floorNode.a('floorNum', floorNums[floorNum - 1]);
                floorNode.a('floorType', 'office');
                floorNode.a('panelAnchor', { x: 0.04, y: 0.5, z: 0.6 });
                office.floorNodes.push(floorNode);
            }
        }, defXZ);
    }
    refresh() {
        let { normalRefreshTime, alarmRefreshTime, emergencyAlarmRefreshTime } = window.wfcUrl,
            { dataFill, timePanel, bottomPanel } = this;
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
        if(type === 'office') { // 办公楼
            if(num >= 0 && num < 100) return { color: 'rgb(0, 180, 81)', level: 5 };
            if(num >= 100 && num < 200) return { color: 'rgb(115, 204, 52)', level: 4 };
            if(num >= 200 && num < 300) return { color: 'rgb(66, 180, 218)', level: 3 };
            if(num >= 300 && num < 400) return { color: 'rgb(255, 183, 27)', level: 2 };
            if(num >= 400) return { color: 'rgb(224, 68, 3)', level: 1 };
        }
        if(type === 'business') { // 商业楼层
            if(num >= 0 && num < 160) return { color: 'rgb(0, 180, 81)', level: 5 };
            if(num >= 160 && num < 320) return { color: 'rgb(115, 204, 52)', level: 4 };
            if(num >= 320 && num < 480) return { color: 'rgb(66, 180, 218)', level: 3 };
            if(num >= 480 && num < 640) return { color: 'rgb(255, 183, 27)', level: 2 };
            if(num >= 640) return { color: 'rgb(224, 68, 3)', level: 1 };
        }
        if(type === 'basement') { // 地下室
            if(num >= 0 && num < 40) return { color: 'rgb(0, 180, 81)', level: 5 };
            if(num >= 40 && num < 80) return { color: 'rgb(115, 204, 52)', level: 4 };
            if(num >= 80 && num < 120) return { color: 'rgb(66, 180, 218)', level: 3 };
            if(num >= 120 && num < 160) return { color: 'rgb(255, 183, 27)', level: 2 };
            if(num >= 160) return { color: 'rgb(224, 68, 3)', level: 1 };
        }
    }
}