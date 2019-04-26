<template>
  <div class="scroll-container" ref="scrollContainer" >
    <div :ref=refName class="echars-line" ></div>
  </div>
</template>

<script>
import initEcharts  from 'src/utils/initEchart';

export default {
  name: "scrollPane",
  data() {
    return {
      myChart: null
    };
  },
  props: ['refName'],
  mounted() {
    initEcharts().then(echarts => {
    let name = this.refName
    this.myChart = echarts.init(this.$refs[name]);
    this.myChart.setOption({
        title : {
    },
    tooltip : {
        trigger: 'axis'
    },
    calculable : true,
    dataZoom: [
        {
            show: true,
            realtime: true,
            start: 0,
            end: 85
        },
        {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 85
        }
    ],
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            name:"时间",
              
            data : ['10:00','11:00','12:00','13:00','14:00','15:00','16:00']
        }
    ],
    color:["rgba(196, 9, 12, 0.5)"],
    yAxis : [
        {
            type : 'value',
             name:"用气量 （L）",
        }
    ],
    series : [
        {
            name:'用气量',
            type:'line',
            smooth:true,
            itemStyle: {normal: {areaStyle: {type: 'default'}}},
            data:[2, 10, 21, 35, 36, 37, 19]
        },
    ]
    })
    })
  },
  methods:{}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.echars-line {
  width: 100%;
  height: 350px;
}
</style>
