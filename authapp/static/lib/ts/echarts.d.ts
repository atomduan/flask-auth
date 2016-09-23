/**
 * 定义Echarts
 */
interface ECharts{
    init(ele:Element):ECharts;
    setOption(option):void;
}

declare var echarts:ECharts;