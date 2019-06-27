import pTools from '../pTools';
import util from '../util';
import animate from '../animate';

const notifyCb = function(btnArray = [], e) {
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
}

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
}

const startAnimate = function() {
    let { g2d, dm3d, weatherPanel, timePanel, all } = this,
        elevators = all.elevators,
        randomElevatorFloor = () => { elevators.forEach((elevator) => { pTools.setElevatorFloor(elevator, 5); }); };
    randomElevatorFloor();
    this.randomElevatorFloorInterval = setInterval(() => { randomElevatorFloor() }, 1000);
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
}

export default { notifyCb, showBuildByType, executeBtnAction, startAnimate };