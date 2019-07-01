export default class DataSource {
    constructor() {
        let { baseurl, siteId, ajax } = window.buildURL;
        this.baseurl = baseurl;
        this.siteId = siteId;
        this.ajax = ajax;
    }

    // 获取天气
    getWeather(callBack) {
        let ajaxObj = this.methodGetSettings('weather');
        this.sendAjax(ajaxObj, (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (errorMsg) => {
            console.error(errorMsg);
        });
    }

    // 获取工单数据
    getWorkOrder(callBack) {
        this.sendAjax(this.methodGetSettings('workOrder', { siteId: this.siteId }), (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (errorMsg) => {
            console.error(errorMsg);
        });
    }

    // 获取访客数据
    getVisitors(callBack) {
        this.sendAjax(this.methodGetSettings('visitors', { siteId: this.siteId }), (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (errorMsg) => {
            console.error(errorMsg);
        });
    }

    // 获取场内人员统计
    getInsidePassengers(callBack) {
        this.sendAjax(this.methodGetSettings('insidePassengers', { siteId: this.siteId }), (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (errorMsg) => {
            console.error(errorMsg);
        });
    }

    // 获取车位统计数据
    getParkingPlaceStatus(callBack) {
        this.sendAjax(this.methodGetSettings('parkingPlaceStatus', { siteId: this.siteId }), (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (errorMsg) => {
            console.error(errorMsg);
        });
    }

    // 获取紧急警报列表
    getEmergencyAlarm(callBack) {
        this.sendAjax(this.methodGetSettings('emergencyAlarm', { siteId: this.siteId }), (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (errorMsg) => {
            console.error(errorMsg);
        });
    }

    // 获取根据客流设备获取的单个楼层客流统计数据
    getFloorPassengers(floorId, callBack) {
        this.sendAjax(this.methodGetSettings('floorPassengers', { floorId }), (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (errorMsg) => {
            console.error(errorMsg);
        });
    }

    // 获取设备报警列表
    getEquipmentAlarm(callBack) {
        this.sendAjax(this.methodGetSettings('equipmentAlarm', { siteId: this.siteId }), (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (errorMsg) => {
            console.error(errorMsg);
        });
    }

    // 停车场车位统计
    getParkingPlaceStatistics(callBack) {
        this.sendAjax(this.methodGetSettings('parkingPlaceStatistics', { siteId: this.siteId }), (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (errorMsg) => {
            console.error(errorMsg);
        });
    }

    // 消防报警
    getFireAlarm(callBack) {
        this.sendAjax(this.methodGetSettings('fireAlarm', { siteId: this.siteId }), (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (errorMsg) => {
            console.error(errorMsg);
        });
    }

    // 获取视频流的token
    getFlowVideoToken(callBack) {
        let ajaxObj = {
            url: "https://dm-api.exaleap.net/weather/turing/robot_dog_sr_20004",
            method: "GET",
        }
        this.sendAjax(ajaxObj, (response) => {
            typeof callBack === 'function' && callBack(response);
        }, (status, errorMsg) => {
            callBack('The robox is not connected. Please turn on the power and connect with the Internet. (offline)')
        });
    }

    methodGetSettings(name, replaceData) {
        let { baseurl, ajax } = this, { url: subPath, method } = ajax[name];
        if (replaceData) {
            for (let key in replaceData) {
                subPath = subPath.replace('{' + key + '}', replaceData[key]);
            }
        }
        let reqUrl = window.buildURL.debug ? baseurl + '/console' + subPath + '.json' : baseurl + '/console' + subPath;
        return {
            url: reqUrl,
            method: method,
            headers: window.buildURL.headers
        }
    }

    sendAjax({ method, url, headers, body }, success, error) {
        let request = new XMLHttpRequest();
        request.open(method, url);
        for (let key in headers) {
            request.setRequestHeader(key, headers[key]);
        }
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status >= 200 && request.status < 400) {
                    typeof success === 'function' && success(JSON.parse(request.responseText));
                } else {
                    typeof error === 'function' && error(request.status);
                }
            }
        }
        request.send(body);
    }

    destory() {
        this.ajax = null;
        this.baseurl = null;
        this.siteId = null;
    }
}