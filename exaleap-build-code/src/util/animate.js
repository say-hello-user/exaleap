export default {
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
}