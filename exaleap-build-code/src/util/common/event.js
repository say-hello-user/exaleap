import pTools from '../pTools';

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
}

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
                this.settingPanel.a({
                    ['btn' + i]: undefined,
                    ['mark' + i]: undefined
                });
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
                //adjustDevicePanle.call(this, data, 'escalatorPanel');
            }
            if (displayName.indexOf('电梯-') > -1) {
                //adjustDevicePanle.call(this, data, 'elevatorPanel');
            }
            if (displayName === '闸机') {
                //adjustDevicePanle.call(this, data, 'gatePanel');
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
        if (displayName === '楼层号码') {

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
}

const mp3dEvent = function (e) {
    if (e.property === 'eye') {
        let { g3d, dm3d } = this;
        pTools.sortDm3dData(g3d, dm3d);
    }
}

export default { mi2dEvent, mi3dEvent, mp3dEvent };