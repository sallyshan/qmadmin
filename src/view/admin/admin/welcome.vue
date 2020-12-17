<template>
  <div>
    <el-row  :gutter="10">
      <el-col :span="4">
        <el-card class="box-card" style="min-height: 150px;">
          <div>当前管理员</div>
          <h2>{{ nickname }}</h2>
        </el-card>
      </el-col>
      <el-col :span="4" >
        <el-card class="box-card" style="min-height: 150px;">
          <div>今日新增订单</div>
          <h2>{{data.order_count}}</h2>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="box-card" style="min-height: 150px;">
          <div>今日新增用户</div>
          <h2>{{ data.user_count}}</h2>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="box-card" style="min-height: 150px;">
          <div>今日新增任务</div>
          <h2>{{ data.task_count }}</h2>
        </el-card>
      </el-col>
    </el-row>
   <el-row  :gutter="10" class="mt15">
     <el-col :span="4" >
       <el-card class="box-card" style="min-height: 150px;">
         <div>pv(今日访问量)</div>
         <h2>{{data.pv}}</h2>
       </el-card>
     </el-col>
     <el-col :span="4" >
       <el-card class="box-card" style="min-height: 150px;">
         <div>ip(今日访问ip量)</div>
         <h2>{{data.ip.ip_count}}</h2>
       </el-card>
     </el-col>
   </el-row>
    <el-row :gutter="10" class="mt15">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>项目信息</span>
          </div>
          <div class="text item">
            服务器信息：centos 7.3
          </div>
          <div class="text item">
            php版本：7.3
          </div>
          <div class="text item">
            swoole扩展 ：4.4.12
          </div>
          <div class="text item">
            框架版本：esswoole 3.3.0
          </div>
          <div class="text item">
            Mysql版本：5.7
          </div>
          <div class="text item">
            前端框架 ：element
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import editor from '@/components/WangEditor'
  import echarts from 'echarts'
export default {
  components : {
      editor
  },
  name: "App",
  data() {
    return {
      data : {},
    };
  },
  mounted() {
    // let myChart = echarts.init(document.getElementById("my_echarts"))
    // let userChart = echarts.init(document.getElementById("user_charts"))
    // var option = {
    //     color : '#f60',
    //     title:{
    //         text:'本周用户量'
    //     },
    //     tooltip:{
    //       trigger : 'axis'
    //     },
    //     legend:{
    //       type:"scroll",
    //         data:['访客来源']
    //     },
    //     xAxis:{
    //         data:["12-01","12-02","12-03","12-04","12-05","12-06","12-07","12-08"]
    //     },
    //     yAxis:{
    //     },
    //     series:[{
    //         name:'访问量',
    //         type:'line',
    //         areaStyle: {
    //             color:"#f60",
    //             opacity : 0.1
    //         },
    //         data:[600,310,200,400,600,310,200,400]
    //     }]
    // };
    // myChart.setOption(option);
    // userChart.setOption(option);
  },
  created() {
    this.getIndex();
  },
  computed : {
    nickname (){
      return localStorage.getItem('nickname')
    }
  },
  methods: {
    getIndex()
    {
      this.$api.get('admin/get_index', {}, res=> {
        this.data = res.data.data
      });
    }
  }
};
</script>

<style>
.item{margin-top: 3px;}
</style>
