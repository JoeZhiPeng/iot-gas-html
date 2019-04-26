<template>
  <div class="scroll-container" ref="scrollContainer">
    <div :ref="refName" class="echars-line"></div>
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
  props: ["refName"],
  mounted() {
initEcharts().then(echarts => {
 let name = this.refName;
    this.myChart =  echarts.init(this.$refs[name]);
    this.myChart.setOption({
    tooltip: {
        trigger: 'item',
        formatter: "{b}: {c} ({d}%)"
    },
    legend: {
        bottom: 2,
        data:['离线','在线','开机','故障','关机']
    },
    color:['#aaa', 'rgb(51, 126, 212)','#15a626','#c4090c',"#f4b02d"],
    series: [
        {
            type:'pie',
            selectedMode: 'single',
            radius: [0, '30%'],
            label: {
                normal: {
                    position: 'inner'
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'离线'},
                {value:1548, name:'在线'}
            ]
        },
        {
            type:'pie',
            radius: ['40%', '55%'],
            label: {
                normal: {
                    formatter: '{b|{b}：}{c} \n {per|{d}%}  ',
                    rich: {
                        a: {
                            color: '#999',
                            lineHeight: 22,
                            align: 'center'
                        },
                        hr: {
                            borderColor: '#aaa',
                            width: '100%',
                            borderWidth: 0.5,
                            height: 0
                        },
                        b: {
                            fontSize: 16,
                            lineHeight: 33
                        },
                        per: {
                            color: '#eee',
                            backgroundColor: '#334455',
                            padding: [2, 2],
                            borderRadius: 2
                        }
                    }
                }
            },
            data:[
                {value:335, name:'离线'},
                {value:1000, name:'开机'},
                {value:148, name:'故障', selected:true},
                {value:400, name:'关机'}
            ]
        }
    ]
})
   
  })
  },
  methods: {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.echars-line {
  width: 100%;
  height: 350px;
}
</style>
