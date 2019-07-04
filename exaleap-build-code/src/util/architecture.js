export default {
    getWireNode(color, opacity, tall, thickness) {
        let node = new ht.Shape();
        node.s({
            "all.color": "rgba(" + color + ',' + opacity + ")",
            "top.color": "rgba(" + color + ',' + opacity + ")",
            "all.transparent": true,
            "all.reverse.cull": true,
            "all.reverse.flip": true,
            "left.visible": false,
            "right.visible": false,
            "2d.movable": false,
            "3d.movable": false,
            "2d.selectable": false,
            "3d.selectable": false
        });
        node.setTall(tall);
        node.setThickness(thickness);
        node.setAnchor3d([.5, .5, .5]);
        return node;
    },
    getFloorNode(tall) {
        let node = new ht.Shape();
        node.s({
            "shape3d.color": "rgba(255, 255, 255, 0.01)",
            "shape3d.top.color": "rgba(255, 255, 255, 0.01)",
            "shape3d.bottom.color": "rgba(255, 255, 255, 0.01)",
            "shape3d.transparent": true,
            "shape3d.reverse.flip": true,
            "shape3d.reverse.cull": true,
            "select.brightness": 1,
            "2d.movable": false,
            "3d.movable": false
        });
        node.setTall(tall);
        node.setThickness(-1);
        node.setAnchor3d([.5, .5, .5]);
        node.setScaleX(0.98);
        node.setScaleY(0.98);
        return node;
    },
    setDecStatus(g3d, node, points) {
        const Vector3 = ht.Math.Vector3,
            Matrix4 = ht.Math.Matrix4,
            Euler = ht.Math.Euler;
        let va = new Vector3(points[0]),
            vb = new Vector3(points[1]),
            vc = new Vector3(points[2]);
        // 确保新生成的 shape 的旋转角度 看向 shape 面的法向量 
        node.p3(va.toArray());
        node.lookAtX(vb.clone().sub(va).cross(vc.clone().sub(va)), 'top');

        let euler = new Euler(node.r3(), node.getRotationMode(), true),
            mat = new Matrix4(),
            matInv = new Matrix4();
        mat.makeRotationFromEuler(euler);
        matInv.getInverse(mat);

        let shapePoints = [];
        for (let i = 0, l = points.length; i < l; i++) {
            let vec = new Vector3(points[i]).applyMatrix4(matInv);
            shapePoints.push({ x: vec.x, y: vec.z });
        }
        let endVec = new Vector3(points[0]).applyMatrix4(matInv);
        shapePoints.push({ x: endVec.x, y: endVec.z });
        node.setPoints(shapePoints);

        // 上一步旋转应用逆矩阵之后 node 位置会和原来偏离 转换之后重新计算偏移值 确保位置
        let ui = g3d.getData3dUI(node);
        ui.validate();
        mat.fromArray(ui.mat);
        let point0 = node.getPoints().get(0),
            delta = va.clone().sub(new Vector3(point0.x, node.getElevation(), point0.y).applyMatrix4(mat)),
            np3 = node.p3();
        node.p3(np3[0] + delta.x, np3[1] + delta.y, np3[2] + delta.z);
    },
    getDecNode() {
        let node = new ht.Shape();
        node.s({
            "shape3d.color": "rgb(3, 50, 109)",
            "shape3d.transparent": true,
            "shape3d.opacity": 0.4,
            "shape3d.reverse.flip": true,
            "shape3d.reverse.cull": true,
            "2d.movable": false,
            "3d.movable": false,
            "2d.selectable": false,
            "3d.selectable": false
        });
        node.setThickness(-1);
        node.setTall(0.1);
        node.setAnchor3d([0.5, 0.5, 0.5]);
        node.setDisplayName('装饰多边形');
        return node;
    },
    getDecBorderNode() {
        let node = new ht.Shape();
        node.s({
            "all.color": "rgb(66, 180, 218)",
            "all.transparent": true,
            "all.opacity": 0.4,
            "all.reverse.flip": true,
            "all.reverse.cull": true,
            "2d.movable": false,
            "3d.movable": false,
            "2d.selectable": false,
            "3d.selectable": false
        });
        node.setThickness(0.3);
        node.setTall(0.1);
        node.setAnchor3d([0.5, 0.5, 0.5]);
        node.setDisplayName('装饰多边形框');
        return node;
    },
    pointTransform(g3d, node, point) {
        const Vector3 = ht.Math.Vector3,
            Matrix4 = ht.Math.Matrix4;
        let ui = g3d.getData3dUI(node),
            mat = new Matrix4();
        ui.validate();
        mat.fromArray(ui.mat);
        return new Vector3(point.x, node.getElevation(), point.y).applyMatrix4(mat);
    },
    getNodeMat(g3d, node) {
        g3d.getData3dUI(node).validate();
        return g3d.getData3dUI(node).mat;
    },
    toLocalPostion(g3d, node, worldPosition) {
        const Matrix4 = ht.Math.Matrix4,
            Vector3 = ht.Math.Vector3;
        let mat = new Matrix4().fromArray(this.getNodeMat(g3d, node)),
            matInverse = new Matrix4().getInverse(mat),
            position = new Vector3(worldPosition).applyMatrix4(matInverse);
        return position.toArray();
    },
    setNodeAnchor3d(g3d, node, defXZ) {
        let p3 = node.p3(),
            newP3 = this.toLocalPostion(g3d, node, [defXZ.x, node.getElevation(), defXZ.z]),
            xDelta = newP3[0] - p3[0],
            zDelta = newP3[2] - p3[2],
            xAnchorDelta = xDelta / node.getWidth(),
            zAnchorDelta = zDelta / node.getHeight(),
            anchor3d = node.getAnchor3d();
        node.setAnchor3d({ x: anchor3d.x + xAnchorDelta, y: anchor3d.y, z: anchor3d.z + zAnchorDelta }, true);
    },
    makeBuilding(g3d, firstFloor, lastFloor, maxFloorIndex, callBacks, defXZ) {
        let firstFloorVector3 = [],
            lastFloorVector3 = [],
            dm3d = g3d.dm();
        const { getColor = () => '222,222,222', getOpacity = () => 1, getTall = () => 1, getThickness = () => 0.5, floorCall = () => {} } = callBacks;
        const Vector3 = ht.Math.Vector3,
            floorPointLength = firstFloor.getPoints().length,
            segments = firstFloor.getSegments();
        const getFloor = (points, elevation, floorNum) => {
            let floorNode = this.getFloorNode(getTall(floorNum));
            floorNode.setPoints(points);
            floorNode.setSegments(segments);
            floorNode.setElevation(elevation);
            return floorNode;
        };
        const getWire = (points, elevation, floorNum) => {
            let wireNode = this.getWireNode(getColor(floorNum), getOpacity(floorNum), getTall(floorNum), getThickness(floorNum));
            wireNode.setPoints(points);
            wireNode.setSegments(segments);
            wireNode.setElevation(elevation);
            return wireNode;
        };
        const addOneFloor = (points, elevation, floorNum) => {
            let wireNode = getWire(points, elevation, floorNum);
            dm3d.add(wireNode);

            let floorNode = getFloor(points, elevation, floorNum);
            dm3d.add(floorNode);

            if (defXZ) {
                this.setNodeAnchor3d(g3d, wireNode, defXZ);
                this.setNodeAnchor3d(g3d, floorNode, defXZ);
            }

            wireNode.setParent(floorNode);

            floorCall(floorNum, floorNode, wireNode);
        };

        firstFloor.getPoints().each((point) => {
            firstFloorVector3.push(this.pointTransform(g3d, firstFloor, point));
        });
        lastFloor.getPoints().each((point) => {
            lastFloorVector3.push(this.pointTransform(g3d, lastFloor, point));
        });

        if (maxFloorIndex === 1) {
            let points = [],
                elevation = firstFloorVector3[0].y;
            firstFloorVector3.forEach((point) => {
                points.push({ x: point.x, y: point.z });
            });
            addOneFloor(points, elevation, 1);
        } else {
            for (let i = 0; i < maxFloorIndex; i++) {
                let percent = i / (maxFloorIndex - 1),
                    curFloorPoints = [];
                for (let j = 0; j < floorPointLength; j++) {
                    let v3 = new Vector3();
                    v3.lerpVectors(firstFloorVector3[j], lastFloorVector3[j], percent);
                    curFloorPoints.push(v3);
                }
                let points = [],
                    elevation = curFloorPoints[0].y;
                curFloorPoints.forEach((point) => {
                    points.push({ x: point.x, y: point.z });
                });

                addOneFloor(points, elevation, i + 1);
            }
        }
    },
    makeDecShape(g3d, firstFloor, lastFloor, pointIndexMap, callBacks) {
        let { faceCall = () => {} } = callBacks;
        let firstFloorWorldPoints = [],
            lastFloorWorldPoints = [],
            dm3d = g3d.dm();

        firstFloor.getPoints().forEach((point) => {
            firstFloorWorldPoints.push(this.pointTransform(g3d, firstFloor, point));
        });
        lastFloor.getPoints().forEach((point) => {
            lastFloorWorldPoints.push(this.pointTransform(g3d, lastFloor, point));
        });

        for (let key in pointIndexMap) {
            let { first, last } = pointIndexMap[key],
                decNode = this.getDecNode(),
                decBorderNode = this.getDecBorderNode(),
                points = [];

            first.forEach((index) => {
                points.push(firstFloorWorldPoints[index]);
            });
            last.forEach((index) => {
                points.push(lastFloorWorldPoints[index]);
            });

            this.setDecStatus(g3d, decNode, points);
            this.setDecStatus(g3d, decBorderNode, points);

            decNode.a('worldPoint', points);
            decBorderNode.a('worldPoint', points);

            faceCall(key, decNode, decBorderNode);

            dm3d.add(decNode);
            dm3d.add(decBorderNode);
        }
    }
}