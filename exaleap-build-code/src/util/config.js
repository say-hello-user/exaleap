import gradientColor from './gradientColor';

export default {
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