import util from '../../util/util';
import pTools from "../../util/pTools";
import animate from "../../util/animate";
import config from '../../util/config';
import DataSource from './dataSource';

export default class DataFill {
    constructor() {
        this.dataSource = new DataSource();
    }

    // 初始化楼层客流统计数据
    initFloorPassengers(build, floor, panel) {
        const symbolUrl = 'symbols/3d-panel/build-panel/mr-build-panel.json';
        let floorNum = floor.a('floorNum'),
            floorType = floor.a('floorType'),
            { ID } = floor.a('info');

        if (window.buildURL.debug) {
            ID = util.randomNumBetween(0, 1);
        }
        panel.s('shape3d.image', 'symbols/3d-icon/loading.json');
        panel.a('isLoading', true);
        panel.p3(util.getP3ByAnchor3d(build.g3d, floor, floor.a('panelAnchor') ? floor.a('panelAnchor') : { x: 0, y: 0.5, z: 1 }));

        this.dataSource.getFloorPassengers(ID, (result) => {
            if (build.preClickInfo && build.preClickInfo.preClickNode !== floor) return;
            panel.s('shape3d.image', symbolUrl);
            panel.a('isLoading', false);

            let { totalPassengers } = result || {};
            totalPassengers = totalPassengers || 0;

            let { color, level } = build.getInfoByNum(floorType, totalPassengers);
            panel.s('state', 'level' + level);
            panel.a({
                floorNum: floorNum,
                totalPassengers: totalPassengers
            });

            pTools.setFloorStatus(floor, color);
        });
        pTools.showPanel(build, floor, panel, null, '楼层地板');
    }

    // 初始化天气数据
    initWeather(panel) {
        this.dataSource.getWeather((result) => {
            let { city, pm25, weatherImg } = result.data || {};
            let pm25Des = result.data.futures[0].desc
            let temperature = 22;
            let temperature1 = `${result.data.futures[0].minTemperature}° / ${result.data.futures[0].maxTemperature}°`;
            panel.a({
                temperature,
                temperature1,
                city,
                pm25Des,
                pm25,
                pm25Color: config.getColorByAirQualityIndex(pm25)
            });
        });
    }

    // 初始化工单数据
    initWorkOrder(panel) {
        this.dataSource.getWorkOrder((result) => {
            let { today, week } = result.data || {}, { totalWork, unhandled } = today || {},
                xData = [];
            if (week instanceof Array && week.length > 0) {
                week.forEach((day, index) => {
                    let { timePoint = '2019-01-01', totalWork } = day;
                    xData.push(totalWork);
                    xData.push(0);
                    //panel.a('label_' + index, timePoint.match(/\d{2}-\d{2}$/)[0]);
                });
            }
            totalWork = totalWork || 0;
            unhandled = unhandled || 0;
            panel.a({
                'chart.values': xData,
                totalWork,
                unhandled
            });
        });
    }

    // 初始化访客数据
    initVisitors(panel) {
        this.dataSource.getVisitors((result) => {
            let { dayVisitors, syncRatio, temporary, unsuccessful, dayPeak } = result.data || {};
            if (dayPeak instanceof Array && dayPeak.length > 0) {
                let { begin: begin1, end: end1 } = dayPeak[0], { begin: begin2, end: end2 } = dayPeak[1];
                panel.a({ begin1, end1, begin2, end2 });
            }
            dayVisitors = dayVisitors || 0;
            syncRatio = syncRatio || 0;
            temporary = temporary || 0;
            unsuccessful = unsuccessful || 0;

            panel.a({
                dayVisitors,
                syncRatio,
                temporary,
                unsuccessful,
                syncRatioColor: syncRatio > 0 ? 'rgb(212, 0, 0)' : 'rgb(111, 212, 74)',
                upShapeVisible: syncRatio > 0,
                downShapeVisible: syncRatio <= 0
            });
        });
    }

    // 初始化场内人员统计
    initInsidePassengers(panel) {
        this.dataSource.getInsidePassengers((result) => {
            let { totalEmployees, totalVisitors } = result || {};
            totalEmployees = totalEmployees || 0;
            totalVisitors = totalVisitors || 0;
            panel.a({ totalEmployees, totalVisitors });
        });
    }

    // 初始化车位统计数据
    initParkingPlaceStatus(panel) {
        this.dataSource.getParkingPlaceStatus((result) => {
            let { totalParkingPlace, emptyParkingPlace } = result || {};
            totalParkingPlace = totalParkingPlace || 0;
            emptyParkingPlace = emptyParkingPlace || 0;
            panel.a({ totalParkingPlace, emptyParkingPlace });
        });
    }

    // 初始化时间数据
    initTime(panel) {
        let date = new Date(),
            year = util.formatDate(date, 'yyyy'),
            month = util.formatDate(date, 'MM'),
            day = util.formatDate(date, 'dd'),
            week = util.formatDate(date, '周w'),
            time = util.formatDate(new Date(), 'hh: mm'),
            lunarDay = util.GetLunarDay(date.getFullYear(), date.getMonth() + 1, date.getDate());
        panel.a({ year, month, day, week, time, lunarDay });
    }

    // 初始化设备报警
    initEquipmentAlarm(build) {
        let { g3d, dm3d, basement, business, office, all } = build;
        const clearAlarms = (buildNodes) => {
            let { alarms } = buildNodes;
            if (alarms.length > 0) {
                for (let i = alarms.length - 1; i >= 0; i--) {
                    dm3d.remove(alarms[i]);
                }
                alarms.length = 0;
            }
        };
        this.dataSource.getEquipmentAlarm((result) => {
            let data = result.data || [];
            all.alarms.length = 0;
            clearAlarms(basement);
            clearAlarms(business);
            clearAlarms(office);
            if (data instanceof Array && data.length > 0) {
                data.forEach((info) => {
                    let floorId = info.floorId,
                        floorNode = pTools.getFloorByFloorId(floorId, all.floorNodes);
                    if (floorNode) {
                        let p3 = floorNode.p3(),
                            floorNum = floorNode.a('floorNum'),
                            floorType = floorNode.a('floorType'),
                            randomPointInCircle = util.getRandomPointInCircle(p3[0], p3[2], floorNode.getWidth() / 4);
                        let alarmNode = pTools.addAlarmNode({
                            dm3d,
                            floorNum,
                            floorType,
                            attr: info,
                            p3: [randomPointInCircle.x, p3[1], randomPointInCircle.y]
                        });
                        floorType === 'basement' && basement.alarms.push(alarmNode);
                        floorType === 'business' && business.alarms.push(alarmNode);
                        floorType === 'office' && office.alarms.push(alarmNode);
                        all.alarms.push(alarmNode);
                    }
                });
                pTools.sortDm3dData(g3d, dm3d);
            }
        });
    }

    // 初始化紧急警报列表
    initEmergencyAlarm(panel) {
        let dataSource = [];
        this.dataSource.getEmergencyAlarm((result) => {
            let data = result.data || [];
            if (data instanceof Array && data.length > 0) {
                for (let i = 0, l = data.length; i < l; i++) {
                    let { type, latestTime, buildingName, spaceName, faultName } = data[i];
                    dataSource.push({
                        time: latestTime,
                        alarmDetail: buildingName + ' ' + spaceName,
                        name: faultName,
                        type
                    });
                }
                panel.a('dataSource', dataSource);
                panel.a('tableRowIndex', 0);
                animate.scrollAlarmTable(panel);
            }
        });
    }

    // 初始化停车场车位统计
    initParkingPlaceStatistics(panel) {
        this.dataSource.getParkingPlaceStatistics(result => {
            let data = result.data || {};
            panel.a("openingTime", `${data.startTime} - ${data.endTime}`);
            panel.a("usedPark", data.usedPark);
            panel.a("usualParkingLot", data.usualParkingLot);
            panel.a("seldomParkingLot", data.seldomParkingLot);
        })
    }

    // 初始化消防报警
    initFireAlarm(panel) {
        this.dataSource.getFireAlarm(result => {
            let data = result.data || {};
            panel.a("alarmNum", data.alarmNum);
            panel.a("unhandled", data.unhandled);
            panel.a("handled", data.handled);
        })
    }

    // 获取视频流 token
    getFlowVedioToken(callBack) {
        this.dataSource.getFlowVideoToken(response => {
            typeof callBack === 'function' && callBack(response);
        });
    }

    // 初始化停车场面板
    initFloorInfoPanel(floorId, panel) {
        this.dataSource.getFloorParkingInfo(floorId, result => {
            let data = result.data || {};
            panel.a("parkingFloorName", data.parkingFloorName);
            panel.a("parkingFloorArea", data.parkingFloorArea);
            panel.a("totalParkingSpace", data.totalParkingSpace);
        })
    }

    // 获取停车场当前状态信息
    getParkingStatus(panel) {
        this.dataSource.getParkingStatus(result => {
            let data = result.data || {};
            panel.a('monthRent_0', false);
            panel.a('monthRent_1', false);
            panel.a('monthRent_2', false);
            data.latestLeavingCars.map((item, index) => {
                if (item.isMonthlyRenting === '1') {
                    panel.a('monthRent_' + index, true);
                } else {
                    panel.a('monthRent_' + index, false);
                }
            })
            panel.a('emptyParkingSpace', data.emptyParkingSpace);
            panel.a('enteringTimes', data.enteringTimes);
            panel.a('totalParkingFee', data.totalParkingFee);
            panel.a('latestLeavingCars', data.latestLeavingCars);
        })
    }

    // 销毁函数
    destory() {
        this.dataSource.destory();
        this.dataSource = null;
    }
}