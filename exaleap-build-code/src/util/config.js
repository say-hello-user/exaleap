import gradientColor from './gradientColor';

export default {
    // 根据楼层类别以及楼层人数获取楼层颜色
    getFloorInfoByPassengers(type, passengers) {
        if(type === 'office') { // 办公楼
            if(passengers >= 0 && passengers < 250) return { color: 'rgb(0, 180, 81)', level: 5 };
            if(passengers >= 250 && passengers < 500) return { color: 'rgb(115, 204, 52)', level: 4 };
            if(passengers >= 500 && passengers < 750) return { color: 'rgb(66, 180, 218)', level: 3 };
            if(passengers >= 750 && passengers < 1000) return { color: 'rgb(255, 183, 27)', level: 2 };
            if(passengers >= 1000) return { color: 'rgb(224, 68, 3)', level: 1 };
        }
        if(type === 'business') { // 商业楼层
            if(passengers >= 0 && passengers < 500) return { color: 'rgb(0, 180, 81)', level: 5 };
            if(passengers >= 500 && passengers < 1000) return { color: 'rgb(115, 204, 52)', level: 4 };
            if(passengers >= 1000 && passengers < 1500) return { color: 'rgb(66, 180, 218)', level: 3 };
            if(passengers >= 1500 && passengers < 2000) return { color: 'rgb(255, 183, 27)', level: 2 };
            if(passengers >= 2000) return { color: 'rgb(224, 68, 3)', level: 1 };
        }
        if(type === 'basement') { // 地下室
            if(passengers >= 0 && passengers < 50) return { color: 'rgb(0, 180, 81)', level: 5 };
            if(passengers >= 50 && passengers < 100) return { color: 'rgb(115, 204, 52)', level: 4 };
            if(passengers >= 100 && passengers < 150) return { color: 'rgb(66, 180, 218)', level: 3 };
            if(passengers >= 150 && passengers < 200) return { color: 'rgb(255, 183, 27)', level: 2 };
            if(passengers >= 200) return { color: 'rgb(224, 68, 3)', level: 1 };
        }
    },
    // 根据空气质量指数获取相应颜色值
    getColorByAirQualityIndex(airQualityIndex) {
        if(airQualityIndex >= 0 && airQualityIndex <= 50) return 'rgb(1, 142, 91)';
        if(airQualityIndex >= 51 && airQualityIndex <= 100) return 'rgb(255, 216, 45)';
        if(airQualityIndex >= 101 && airQualityIndex <= 150) return 'rgb(255, 142, 45)';
        if(airQualityIndex >= 151 && airQualityIndex <= 200) return 'rgb(197, 16, 45)';
        if(airQualityIndex >= 201 && airQualityIndex <= 300) return 'rgb(91, 4, 142)';
        if(airQualityIndex >= 301) return 'rgb(115, 6, 32)';
    },
    // 根据热力值获取滑块的颜色
    getSliderColorByThermal(thermal) {
        let thermalMultiply = Math.floor(thermal * 100);
        if(thermal >=0 && thermal < 0.35) {
            let color = new gradientColor('#6bb831', '#00f', 35);
            return color[thermalMultiply];
        }
        else if(thermal >= 0.35 && thermal < 0.45) {
            let color = new gradientColor('#00f', '#ff9a00', 10);
            return color[thermalMultiply - 35];
        }
        else if(thermal >= 0.45 && thermal < 1) {
            let color = new gradientColor('#ff9a00', '#dd1009', 55);
            return color[thermalMultiply - 45];
        }
        else {
            return '#dd1009';
        }
    }
};