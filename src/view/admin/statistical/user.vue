<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="/">会员统计</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="mt15">
      <el-col :span="22">
        <el-card class="box-card">
          <div>
            <div>
              <el-radio-group v-model="search_type" @change="change">
                <el-radio-button label="本周"></el-radio-button>
                <el-radio-button label="本月"></el-radio-button>
                <el-radio-button label="本年"></el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div id="my_echarts" class="mt15" style="height:400px">
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  data () {
    return {
      search_type: '本周',
      option: {
        color: '#f60',
        title: {
          text: '柱状图'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          type: 'scroll',
          data: ['访客来源']
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [{
          name: '用户量',
          type: 'line',
          areaStyle: {
            color: '#f60',
            opacity: 0.1
          },
          data: []
        }]
      }
    }
  },
  mounted () {
    this.loadData()
  },
  created () {

  },
  methods: {
    loadData () {
      let self = this
      let myChart = echarts.init(document.getElementById('my_echarts'))
      self.option.title.text = self.search_type + '用户量'
      this.$api.get('admin/statistical/user', {
        search_type: self.search_type
      }, res => {
        self.option.series[0].data = res.data.data.val
        self.option.xAxis.data = res.data.data.key
        myChart.setOption(self.option)
        this.loading = false
      })
    },
    change (e) {
      let self = this
      self.search_type = e
      this.loadData()
    }
  }
}
</script>

<style>
  body {
    background: #f1f1f1;
  }
</style>
