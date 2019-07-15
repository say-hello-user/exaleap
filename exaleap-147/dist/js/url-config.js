// '详情' { kind: 'detail' };
// '切换' { kind: 'switch' }
// '工单面板' { kind: 'workSheetPanel' }
// '设备检修面板' { kind: 'equipmentOverhaulPanel' }
// '消防报警面板' { kind: 'firePanel' }
// 重点区域监控面板 { kind: 'monitorPanel' }
// '投屏' { kind: 'screening' }
window.buildURL = {
    debug: true,
    dirBasePath: 'http://192.168.0.25:8080/ht/3dSupport/exaleap/exaleap-147/dist',
    baseurl: 'http://192.168.0.25:8080/ht/3dSupport/exaleap/exaleap-147/dist',
    siteId: 'cbe83f10-2b9f-4252-abc4-b16f557ab18d',
    normalRefreshTime: 15 * 60 * 1000, // 正常数据请求周期 单位毫秒
    alarmRefreshTime: 60 * 1000, // 实时警告消息数据请求周期 单位毫秒
    emergencyAlarmRefreshTime: 10 * 1000, // 紧急警报滚动间隔 单位毫秒
    defaultLang: 'zh',
    headers: {
        "Content-Type": "application/json",
        "X-API-Language": "zh_CN",
        "X-API-Version": 1.0,
        "X-Auth-Token": "40adb5f3bfb6b72e1d4a7aec215d1a5d",
        "X-Client-Site-Id": "634f2b89-3ed2-4324-8f06-0690c7276d8a",
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
    },
    dimensionInfo: {
        "Name": "130", // 楼宇的名字
        "ID": "634f2b89-3ed2-4324-8f06-0690c7276d8a", // 楼宇的id
        "Building": [ // 樓宇下的building列表
            {
                "ID": "3bf9ca7e-2c23-4fc2-9309-1f237da60be8",
                "Name": "Basement",
                "Floor": [ // 地下室 停车场
                    {
                        "ID": "ffe98028-1eba-46c6-b1e3-efac3e3342d1",
                        "Name": "Basement-02 Floor"
                    },
                    {
                        "ID": "5cf8cac4-7d61-4a10-8764-e740304ddca8",
                        "Name": "Basement-01 Floor"
                    }
                ],
            },
            {
                "ID": "2ee9a492-3f11-4593-8bc6-1febbf93d346",
                "Name": "Shop",
                "Floor": [ // 商业楼层
                    {
                        "ID": "62266884-d477-4139-b91b-ef27822b84dc",
                        "Name": "Floor 1"
                    },
                    {
                        "ID": "6e96fc76-c3e6-4f2a-9cf6-b8c30ea9dd09",
                        "Name": "Floor 2"
                    },
                    {
                        "ID": "c4bb59a3-5458-45bf-9304-1d9f7ffd6b98",
                        "Name": "Floor 3"
                    },
                ],
            },
            {
                "ID": "5188fa70-c6c7-47d1-8f6c-cd678b618923",
                "Name": "Office",
                "Floor": [ // 办公楼
                    {
                        "ID": "4276d63d-0818-4576-859a-8283066281ec",
                        "Name": "Office-09 Floor"
                    },
                    {
                        "ID": "6f93bb60-592f-4444-8380-cd22d66946e2",
                        "Name": "Office-10 Floor"
                    },
                    {
                        "ID": "80671a6c-f41b-4b5c-9aaf-d94184348152",
                        "Name": "Office-11 Floor"
                    },
                    {
                        "ID": "1d41ec8e-c9ed-43fc-a0cb-f190e533c43f",
                        "Name": "Office-12 Floor"
                    },
                    {
                        "ID": "e7ac6e5b-16d1-4495-a495-c00a8cc2ed9f",
                        "Name": "Office-15 Floor"
                    },
                    {
                        "ID": "d1847b68-1614-4874-af39-b1f3891ad013",
                        "Name": "Office-16 Floor"
                    },
                    {
                        "ID": "65ac43fb-020d-4e30-81d3-18a1b337e37c",
                        "Name": "Office-17 Floor"
                    },
                    {
                        "ID": "448ff46d-b0ce-4b04-941a-040e479199a4",
                        "Name": "Office-18 Floor"
                    },
                    {
                        "ID": "bcb742fd-84a8-4d0c-8496-576ba8377d5d",
                        "Name": "Office-19 Floor"
                    },
                    {
                        "ID": "30f743d5-91f2-485f-b17f-9cf61aaa794b",
                        "Name": "Office-20 Floor"
                    },
                    {
                        "ID": "ed145df3-2f98-4b4f-bf5f-26aa32fba7b2",
                        "Name": "Office-21 Floor"
                    },
                    {
                        "ID": "89f694ef-4d0d-46df-892e-b77ca5e9cc1b",
                        "Name": "Office-22 Floor"
                    },
                    {
                        "ID": "89f73a39-55d6-4dfb-bf47-975940b0e9b3",
                        "Name": "Office-23 Floor"
                    }, {
                        "ID": "eed0e835-7d07-4629-9e78-0d8cc2ae9151",
                        "Name": "Office-25 Floor"
                    },
                    {
                        "ID": "25445dcd-7d7a-4f42-803a-d5c60d149ac7",
                        "Name": "Shop-01 Floor"
                    },
                    {
                        "ID": "bd07fafe-e9e6-4325-9259-23d4dd44b92f",
                        "Name": "Shop-02 Floor"
                    },
                    {
                        "ID": "04e79829-df48-4b61-b1d2-80fe261257ee",
                        "Name": "Shop-03 Floor"
                    },
                    {
                        "ID": "71a25f6f-73c3-411b-a003-eb1fc2e1cae6",
                        "Name": "Shop-04 Floor"
                    },
                    {
                        "ID": "f88eace9-f446-4b0a-bf4a-f4ebb6bbc45e",
                        "Name": "Shop-05 Floor"
                    },
                    {
                        "ID": "cf738a77-6ab1-42ed-875b-31d4adf3e028",
                        "Name": "Shop-06 Floor"
                    },
                    {
                        "ID": "9516c85f-4975-4b15-a45b-7bff5e5b792f",
                        "Name": "Shop-07 Floor"
                    },
                    {
                        "ID": "9516c85f-4975-4b15-a45b-7bff5e5b7924",
                        "Name": "Shop-07 Floor"
                    }
                ]
            }
        ]
    }
};

window.htBuildConfig = {
    eye: {
        pc: [2940, 2497, 2492],
        mb: [2940, 2497, 2492]
    },
    center: {
        pc: [580, 657, 250],
        mb: [580, 657, 250]
    },
    orthoWidth: {
        pc: 6254,
        mb: 6254
    },
    screen: {
        pc2d: 'displays/pc-2d.json',
        pc3d: 'scenes/pc-3d.json',
        mb2d: 'displays/pc-2d.json',
        mb3d: 'scenes/pc-3d.json'
    }
};