<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="/">订单列表</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <div class="mt15"></div>
    <el-form :inline="true" size="small" :model="search" class="demo-form-inline">
       <el-form-item label="时间">
         <el-date-picker
          v-model="date_time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input v-model="search.order_no" placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item label="用户手机">
        <el-input v-model="search.phone" placeholder="用户手机"></el-input>
      </el-form-item>
      <el-form-item label="企业手机">
        <el-input v-model="search.enterprise_phone" placeholder="企业手机"></el-input>
      </el-form-item>
      <el-form-item label="完成状态">
        <el-select v-model="search.status" placeholder="请选择">
          <el-option
            label="全部"
            value="0"
          ></el-option>
          <el-option
            label="工作中"
            value="1"
          ></el-option>
          <el-option
            label="待验收"
            value="2"
          ></el-option>
          <el-option
            label="待结款"
            value="3"
          ></el-option>
          <el-option
            label="已完成"
            value="4"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属企业">
        <el-select v-model="search.enterprise_id" filterable placeholder="请选择">
          <el-option label="全部" :value="0"></el-option>
          <el-option :label="v.enterprise_name" :value="v.id" v-for="(v,i) in enterpriseList" :key="i"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBtn">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table size="small" :data="tableData" border style v-loading="loading">
      <el-table-column type="expand" fixed="left">
        <template slot-scope="scope" v-if="scope.row.additional.note">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="验收备注:">
              <span>{{ scope.row.additional.note }}</span>
            </el-form-item>
            <el-form-item label="验收图片:">
              <el-image
              :src="scope.row.additional.images[0]"
              :preview-src-list="scope.row.additional.images"
              :style="{
                width : '70px'
              }"
              >
              </el-image>

            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label="编号" fixed width="60" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="enterprise_name" label="企业名称" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="nickname" label="昵称" align="center" header-align="center"></el-table-column>
      <el-table-column fixed label="头像" align="center" header-align="center">
          <template slot-scope="scope">
              <div>
                  <img :src="scope.row.ulogo" alt="" width="60" height="60">
              </div>
          </template>
      </el-table-column>
      <el-table-column fixed prop="money" label="订单金额" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="title" label="任务名称" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="phone" label="手机" align="center" header-align="center"></el-table-column>
       <el-table-column prop="created_at" label="记录时间" align="center" header-align="center">
      </el-table-column>
      <el-table-column fixed="right" label="状态" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="mini"  v-if="scope.row.status==1">工作中</el-button>
          <el-button type="drange" size="mini"  v-if="scope.row.status==2">待验收</el-button>
          <el-button type="warning" size="mini"  v-if="scope.row.status==3">待结款</el-button>
          <el-button type="info" size="mini"  v-if="scope.row.status==4">已完成</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt15">
      <el-pagination layout="prev, pager, next" :total="total" :page-size="search.limit" :current-page='search.page' @current-change='pageChange' :background="true"></el-pagination>
    </div>


  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
        search : {
            status : "0",
            order_no : '',
            phone:'',
            enterprise_phone:'',
            enterprise_id : 0,
            limit: 10,
            page:1,
            begin_time:'',
            end_time:'',
        },
        date_time: "",
        value: 0,
        options:[1],
        total: 1000,
        loading:true,
        tableData:[],
        showBtn : '0',
        enterpriseList :[]
    };
  },
  created(){
     this.loadData();
     this.getEnterpirseList();
  },
  mounted() {
    this.loading = false
  },
  methods: {
    getEnterpirseList() {
      this.$api.get("admin/enterprise/list", {page : 1 , limit : 1000}, res => {
        this.enterpriseList = res.data.data.list
      })
    },
    loadData () {
      let self = this
      this.$api.get('admin/order/list',self.search, res=>{
        self.tableData=res.data.data.list
        self.total = res.data.data.total
        self.showBtn = self.search.status
        self.loading = false
      });
    },
    dateRes (date) {
        var d = new Date(date);
        var  resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        return resDate;
    },
    searchBtn(){
        this.search.begin_time = this.date_time == null ? '' : this.date_time[0],
        this.search.end_time = this.date_time == null ? '' : this.date_time[1],
        this.search.page = 1
        this.loadData()
    },
    handleClick(row) {
      console.log(row);
    },
    pageChange(e)
    {
      this.search.page=e;
      this.loadData();
    },
    reload()
    {
      this.loadData();
    }
  }
};
</script>

<style>
  .user_info .item{display: flex; margin-top: 10px;}
  .user_info .item .left{width:120px; text-align:right}
  .user_info .item .right{ text-align:left; font-weight: bold;}
</style>
