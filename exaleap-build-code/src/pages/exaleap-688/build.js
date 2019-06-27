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
        this.buildPanelStatus = null;
        this.editBuildName = null;
        this.preClickInfo = null;
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
        let { basement, office } = this, { ID, Building } = dimensionInfo,
            basementFloorIds = Building[0].Floor,
            officeFloorIds = Building[1].Floor;
    
        basement.floorNodes.forEach((floor, index) => {
            floor.a('info', basementFloorIds[index]);
        });
        office.floorNodes.forEach((floor, index) => {
            floor.a('info', officeFloorIds[index]);
        });
    }
    init2dNodes() {
        let { g2d, dm2d, notifier } = this;
        this.editBuildName = 'all';
        this.buildPanelStatus = { 
            all: { 'zj': true, 'dt': true, 'ft': false, 'jb': true, 'kl': true }, 
            basement: { 'zj': true, 'dt': true, 'ft': false, 'jb': true, 'kl': true }, 
            office: { 'zj': true, 'dt': true, 'ft': false, 'jb': true, 'kl': true }
        };
        dm2d.each((node) => {
            let displayName = node.getDisplayName();
            if (displayName === '工单面板') {
                this.panel1 = node;
                node.a('notifier', notifier);
            }
            if (displayName === '客流量面板') {
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
        g2d.addPropertyChangeListener((e) => {
            if (e.property === "videoLayout") {
                if (!this.player) {
                    this.dataFill.getFlowVedioToken(result => {
                        if (result.token) {
                            let token = result.token;
                            videojs.Hls.xhr.beforeRequest = function(options) {
                                options.headers = { "Authorization": "Bearer " + token }
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
    }
    init3dNodes() {
        let { g3d, dm3d } = this;
        let basement = this.basement = { gates: [], gateBlinks: [], elevators: [], elevatorLines: [], floorNodes: [],
                                         escalators: [], alarms: [] }, // 地下室
            office = this.office = { gates: [], gateBlinks: [], elevators: [], elevatorLines: [], floorNodes: [],
                                     escalators: [], alarms: [] }, // 办公楼层
            all = this.all = { gates: [], gateBlinks: [], elevators: [], elevatorLines: [], floorNodes: [],
                               escalators: [], alarms: [] }; //全楼

        this.makeBuilding();
        this.initBuildSpaceId();
        
        dm3d.each((node) => {
           let displayName = node.getDisplayName();
           if(displayName === '地-办') {
               let childs = node.getChildren();
               childs.each((child) => {
                   let displayName = child.getDisplayName();
                   if(displayName === '电梯线集合') {
                       let elevatorLines = child.getChildren().toArray();
                       basement.elevatorLines.push(...elevatorLines);
                       office.elevatorLines.push(...elevatorLines);
                       all.elevatorLines.push(...elevatorLines);
                   }
               });
           }
           if(displayName === '办') {
                let childs = node.getChildren();
                childs.each((child) => {
                    let displayName = child.getDisplayName();
                    if(displayName === '扶梯集合') {
                        let escalators = child.getChildren().toArray();
                        office.escalators.push(...escalators);
                        all.escalators.push(...escalators);
                    }
                    if(displayName === '闸机集合') {
                        let gates = child.getChildren().toArray();
                        office.gates.push(...gates);
                        all.gates.push(...gates);
                    }
                    if(displayName === '电梯线集合') {
                        let elevatorLines = child.getChildren().toArray();
                        office.elevatorLines.push(...elevatorLines);
                        all.elevatorLines.push(...elevatorLines);
                    }
                });
           }
           if(displayName === '楼层面板') {
               this.floorPanel = node;
           }
        });
        all.floorNodes = basement.floorNodes.concat(office.floorNodes);

         // 设置电梯的运行范围。 3d 编辑器中电梯名称命名规则 电梯-B4-22F 即 电梯-起始楼层-结束楼层 否则解析错误
         all.elevators.forEach((elevator) => {
            let splitDisplayName = elevator.getDisplayName().split('-'),
                { beginIndex, endIndex } = pTools.getBeginAndEndFloorIndex(3, splitDisplayName[1], splitDisplayName[2]);
            pTools.setElevatorMoveRange(all.floorNodes.slice(beginIndex, endIndex + 1), elevator);
        });
        // 设置电梯线的长度与高度。 3d 编辑器中电梯线名称命名规则 电梯线-B4-22F 即 电梯线-起始楼层-结束楼层 否则解析错误
        all.elevatorLines.forEach((elevatorLine) => {
            let splitDisplayName = elevatorLine.getDisplayName().split('-'),
                { beginIndex, endIndex } = pTools.getBeginAndEndFloorIndex(3, splitDisplayName[1], splitDisplayName[2]);
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
        let { g3d, dm3d, basement, office } = this,
            first1 = dm3d.getDataByTag('first1'), last1 = dm3d.getDataByTag('last1'), 
            first2 = dm3d.getDataByTag('first2'), 
            first3 = dm3d.getDataByTag('first3'), 
            first4 = dm3d.getDataByTag('first4'), last4 = dm3d.getDataByTag('last4'), 
            first5 = dm3d.getDataByTag('first5'), last5 = dm3d.getDataByTag('last5'),
            first6 = dm3d.getDataByTag('first6'), last6 = dm3d.getDataByTag('last6');
        const defXZ = { x: 200, z: 344 };
        architecture.makeBuilding(g3d, first1, last1, 3, {
            getColor: (floorNum) => '0, 164, 152', 
            getOpacity: (floorNum) => 0.43,
            getTall: (floorNum) => 20,
            getThickness: (floorNum) => 10,
            floorCall: (floorNum, floorNode, wireNode) => {
                const floorNums = ['B3', 'B2', 'B1'];
                floorNode.setDisplayName('楼层地板');
                floorNode.a('floorNum', floorNums[floorNum - 1]);
                floorNode.a('floorType', 'basement');
                floorNode.a('panelAnchor', { x: 0.35, y: 0.5, z: 0.88 });
                basement.floorNodes.push(floorNode);
            }
        }, defXZ);
        architecture.makeBuilding(g3d, first2, first2, 1, {
            getColor: (floorNum) => '0, 255, 255', 
            getOpacity: (floorNum) => 1,
            getTall: (floorNum) => 20,
            getThickness: (floorNum) => 10,
            floorCall: (floorNum, floorNode, wireNode) => {
                const floorNums = ['1F'];
                floorNode.setDisplayName('楼层地板');
                floorNode.a('floorNum', floorNums[floorNum - 1]);
                floorNode.a('floorType', 'office');
                floorNode.a('panelAnchor', { x: 0.3, y: 0.5, z: 1 });
                office.floorNodes.push(floorNode);
            }
        }, defXZ);
        architecture.makeBuilding(g3d, first3, first3, 1, {
            getColor: (floorNum) => '0, 255, 255', 
            getOpacity: (floorNum) => 1,
            getTall: (floorNum) => 20,
            getThickness: (floorNum) => 10,
            floorCall: (floorNum, floorNode, wireNode) => {
                const floorNums = ['2F'];
                floorNode.setDisplayName('楼层地板');
                floorNode.a('floorNum', floorNums[floorNum - 1]);
                floorNode.a('floorType', 'office');
                floorNode.a('panelAnchor', { x: 0.2, y: 0.5, z: 1 });
                office.floorNodes.push(floorNode);
            }
        }, defXZ);
        architecture.makeBuilding(g3d, first4, last4, 9, {
            getColor: (floorNum) => '37, 168, 219', 
            getOpacity: (floorNum) => 0.8,
            getTall: (floorNum) => 20,
            getThickness: (floorNum) => 10,
            floorCall: (floorNum, floorNode, wireNode) => {
                const floorNums = ['3F', '4F', '5F', '6F', '7F', '8F', '9F', '10F', '11F'];
                floorNode.setDisplayName('楼层地板');
                floorNode.a('floorNum', floorNums[floorNum - 1]);
                floorNode.a('floorType', 'office');
                floorNode.a('panelAnchor', { x: 0.25, y: 0.5, z: 1 });
                office.floorNodes.push(floorNode);
            }
        }, defXZ);
        architecture.makeBuilding(g3d, first5, last5, 9, {
            getColor: (floorNum) => {
                if(floorNum === 9) return '214, 43, 149';
                return '103, 46, 140';
            }, 
            getOpacity: (floorNum) => {
                if(floorNum === 9) return 1;
                return 0.7;
            },
            getTall: (floorNum) => 20,
            getThickness: (floorNum) => 10,
            floorCall: (floorNum, floorNode, wireNode) => {
                const floorNums = ['12F', '15F', '16F', '17F', '18F', '19F', '20F', '21F', '22F'];
                floorNode.setDisplayName('楼层地板');
                floorNode.a('floorNum', floorNums[floorNum - 1]);
                floorNode.a('floorType', 'office');
                floorNode.a('panelAnchor', { x: 0.25, y: 0.5, z: 1 });
                office.floorNodes.push(floorNode);
            }
        }, defXZ);
        architecture.makeBuilding(g3d, first6, last6, 4, {
            getColor: (floorNum) => '108, 128, 228', 
            getOpacity: (floorNum) => 0.8,
            getTall: (floorNum) => 20,
            getThickness: (floorNum) => 10,
            floorCall: (floorNum, floorNode, wireNode) => {
                const floorNums = ['23F', '25F', '26F', '27F'];
                floorNode.setDisplayName('楼层地板');
                floorNode.a('floorNum', floorNums[floorNum - 1]);
                floorNode.a('floorType', 'office');
                floorNode.a('panelAnchor', { x: 0.25, y: 0.5, z: 1 });
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
        dataFill.initVisitors(panel2);
        dataFill.initInsidePassengers(bottomPanel);
        dataFill.initParkingPlaceStatus(bottomPanel);
        dataFill.initParkingPlaceStatistics(panel5);
        dataFill.initFireAlarm(panel3);
        //dataFill.initEquipmentAlarm(this);
    }
    refreshAlarmData() {
        let { dataFill, bottomPanel } = this;
        dataFill.initEmergencyAlarm(bottomPanel);
    }
}