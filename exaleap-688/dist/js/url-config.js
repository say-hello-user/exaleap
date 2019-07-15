// '详情' { kind: 'detail' };
// '切换' { kind: 'switch' }
// '工单面板' { kind: 'workSheetPanel' }
// '客流量面板' { kind: 'visitFlowPanel' }
// '消防报警面板' { kind: 'firePanel' }
// 重点区域监控面板 { kind: 'monitorPanel' }
// '投屏' { kind: 'screening' }
window.buildURL = {
    debug: false,
    isEnterToFloor: true,
    dirBasePath: '',
    baseurl: 'https://qa-api.exaleap.io',
    siteId: '78cae204-00e8-4f26-a1e0-5e20ffe50000',
    normalRefreshTime: 15 * 60 * 1000, // 正常数据请求周期 单位毫秒
    alarmRefreshTime: 60 * 1000, // 实时警告消息数据请求周期 单位毫秒
    emergencyAlarmRefreshTime: 10 * 1000, // 紧急警报滚动间隔 单位毫秒
    defaultLang: 'zh',
    headers: {
        "Content-Type": "application/json",
        "X-API-Language": "zh_CN",
        "X-API-Version": 1.0,
        "X-Auth-Token": "1e603a0872669aee2b8ee13e805a017b",
        "X-Client-Site-Id": "78cae204-00e8-4f26-a1e0-5e20ffe50000",
        "X-Client-Type": "Web"
    },
    ajax: {
        weather: { // 天气
            url: '/energy/summary/weather/recent',
            method: 'GET'
        },
        workOrder: { // 工单数据
            url: '/dashboard/{siteId}/workorder',
            method: 'GET'
        },
        visitors: { // 客流数据
            url: '/dashboard/{siteId}/visitors',
            method: 'GET'
        },
        fireAlarm: { // 消防报警
            url: '/dashboard/{siteId}/fire-alarm',
            method: 'GET'
        },
        insidePassengers: { // 场内人员统计
            url: '/dashboard/{siteId}/total-inside-passengers',
            method: 'GET'
        },
        parkingPlaceStatus: { // 车位统计数据接口
            url: '/dashboard/{siteId}/parking-place-status',
            method: 'GET'
        },
        emergencyAlarm: { // 紧急报警
            url: '/dashboard/{siteId}/emergency-alarm',
            method: 'GET'
        },
        parkingPlaceStatistics: { // 停车场车位统计
            url: '/dashboard/{siteId}/parking-place-statistics',
            method: 'GET'
        },
        floorPassengers: { // 单个楼层客流统计数据
            url: '/dashboard/{siteId}/{floorId}/inside-passengers',
            method: 'GET'
        },
        equipmentAlarm: { // 设备警报
            url: '/dashboard/{siteId}/equipment-alarm',
            method: 'GET'
        },
        floorParkingInfo: { // 停车场面板信息
            url: '/dashboard/{siteId}/{floorId}/parking-floor-info',
            method: 'GET'
        },
        parkingStatus: { // 停车场当前状态信息
            url: '/dashboard/{siteId}/parking-status',
            method: 'GET'
        }
    },
    dimensionInfo: {
        "Name": "Henderson Metropolitan Shanghai", // 楼宇的名字
        "ID": "cbe83f10-2b9f-4252-abc4-b16f557ab18d", // 楼宇的id
        "Building": [ // 樓宇下的building列表
            {
                "ID": "46c460a2-0698-40f1-af52-490e37ccd6e9",
                "Name": "Basement",
                "Floor": [ // 地下室 停车场
                    {
                        "ID": "2659f34b-d595-46bd-8f93-636c27131993",
                        "Name": "Basement-03 Floor"
                    },
                    {
                        "ID": "eb4999d7-733b-48e8-8733-906790e761d8",
                        "Name": "Basement-02 Floor"
                    },
                    {
                        "ID": "eb4999d7-733b-48e8-8733-906790e761d5",
                        "Name": "Basement-01 Floor"
                    }
                ],
            },
            {
                "ID": "68c46add-d4cb-480d-aefe-d95561b4b35d",
                "Name": "Office",
                "Floor": [ // 办公楼
                    {
                        "ID": "3e605e73-895b-4a15-a3a3-e68c166d0589",
                        "Name": "Office-01 Floor"
                    },
                    {
                        "ID": "50b4e8f8-1835-4e28-a11d-b3fe3227787d",
                        "Name": "Office-02 Floor"
                    },
                    {
                        "ID": "2026d53a-b271-4a80-a4fc-67e6daf90de3",
                        "Name": "Office-03 Floor"
                    },
                    {
                        "ID": "bf1a7922-ab41-478a-aa7f-cfea939e033c",
                        "Name": "Office-04 Floor"
                    },
                    {
                        "ID": "44e71328-74f5-4bf4-82a6-cbee90160cf6",
                        "Name": "Office-05 Floor"
                    },
                    {
                        "ID": "3c0a3623-5f11-4a41-8f13-a563d26929de",
                        "Name": "Office-06 Floor"
                    },
                    {
                        "ID": "b6012269-017b-4fbb-a884-6cedcbdcbb59",
                        "Name": "Office-07 Floor"
                    },
                    {
                        "ID": "8ebd1466-e769-408b-a6db-5b5b5d9c745f",
                        "Name": "Office-08 Floor"
                    },
                    {
                        "ID": "65c98a59-a139-46f7-ae27-e9768ce7d462",
                        "Name": "Office-09 Floor"
                    },
                    {
                        "ID": "6a81f8e6-12f6-47ff-91b7-f9978c230d92",
                        "Name": "Office-10 Floor"
                    },
                    {
                        "ID": "a619183d-9f42-4fb6-9d01-729efaa500d7",
                        "Name": "Office-11 Floor"
                    },
                    {
                        "ID": "d0929604-2f94-4854-adac-84e6ff340ef3",
                        "Name": "Office-12 Floor"
                    },
                    {
                        "ID": "42116de6-1d61-4d9e-bd49-d18e554309c2",
                        "Name": "Office-13 Floor"
                    },
                    {
                        "ID": "eca6750c-dad8-4c1d-a479-85e722f3ad96",
                        "Name": "Office-14 Floor"
                    },
                    {
                        "ID": "0d33f6d6-20f7-4a82-bba9-de9a867528fd",
                        "Name": "Office-15 Floor"
                    },
                    {
                        "ID": "5c4e6ee0-6f32-487b-9e04-8aa4ac5ffa60",
                        "Name": "Office-16 Floor"
                    },
                    {
                        "ID": "f051aaca-8254-4104-ad58-e29c1497c05a",
                        "Name": "Office-17 Floor"
                    },
                    {
                        "ID": "21a3c973-121e-4165-a447-2846811076ed",
                        "Name": "Office-18 Floor"
                    },
                    {
                        "ID": "b908dc8d-af03-4540-8f8e-fc3e432208f2",
                        "Name": "Office-19 Floor"
                    },
                    {
                        "ID": "7a42ccbd-94c1-487c-816d-886d1acaf88e",
                        "Name": "Office-20 Floor"
                    },
                    {
                        "ID": "e6f1e2d5-fe8a-4804-b973-1a217657bc5b",
                        "Name": "Office-21 Floor"
                    },
                    {
                        "ID": "ab4f09da-3f37-4040-8484-58c571aab5e7",
                        "Name": "Office-22 Floor"
                    },
                    {
                        "ID": "ab4f09da-3f37-4040-8484-58c571aab5e8",
                        "Name": "Office-23 Floor"
                    },
                    {
                        "ID": "ab4f09da-3f37-4040-8484-58c571aab5e9",
                        "Name": "Office-24 Floor"
                    },
                ],
            }
        ]
    }
};

window.htBuildConfig = {
    eye: {
        pc: [2709, 2567, 2599],
        mb: [2709, 2567, 2599]
    },
    center: {
        pc: [350, 766, 326],
        mb: [350, 766, 326]
    },
    orthoWidth: {
        pc: 4666,
        mb: 4666
    },
    screen: {
        pc2d: 'displays/pc-2d.json',
        pc3d: 'scenes/pc-3d.json',
        mb2d: 'displays/pc-2d.json',
        mb3d: 'scenes/pc-3d.json'
    }
};