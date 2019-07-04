import util from './util';
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
export default {
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
		}
		let fRuler = (floorName) => {
			let floorNum = floorName.replace(/[^0-9]/ig, "");
			return parseInt(floorNum) + baseLength - 1;
		}
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
            settingPanelStatus[i]['visible'] = settingPanel.a('btn' + i) === openSymBolUrl
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