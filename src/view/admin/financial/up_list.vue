<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="/">企业钱包记录</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <div class="mt15"></div>
    <el-form :inline="true" size="small" :model="search" class="demo-form-inline">
      <el-form-item label="时间">
        <el-date-picker v-model="date_time" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item label="操作类型">
        <el-select v-model="search.type" placeholder="请选择">
          <el-option label="全部" :value="0"></el-option>
          <el-option label="充值" :value="1"></el-option>
          <el-option label="提现" :value="2"></el-option>
          <el-option label="发布任务花费" :value="3"></el-option>
          <el-option label="任务到期退回" :value="4"></el-option>
          <el-option label="结算任务款" :value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="企业手机">
        <el-input v-model="search.phone" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item label="企业">
        <el-select v-model="search.enterprise_id" placeholder="请选择">
          <el-option label="全部" :value="0"></el-option>
          <el-option :label="v.enterprise_name" :value="v.id" v-for="( v, i) in enterprise_list" :key="i"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBtn">查询</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" size="mini" :model="search" class="demo-form-inline">
      <el-form-item label="">
        <el-button type="primary" size="mini" @click="$router.push('/admin/behavior/add')">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="searchBtn" size="mini">刷新</el-button>
      </el-form-item>
    </el-form>
    <el-table class="mt15" size="mini" :data="tableData" border style v-loading="loading">
      <el-table-column prop="id" label="编号" fixed width="60" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="enterprise_name" label="企业名称" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="link" label="企业logo" align="center" header-align="center">
        <template slot-scope="scope">
          <img :src="scope.row.logo" alt="" width="50" height="50" style="border-radius: 50%;">
        </template>
      </el-table-column>
      <el-table-column fixed prop="pre_money" label="操作前金额" align="center" header-align="center"></el-table-column>
      <el-table-column fixed label="操作金额" align="center" header-align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.type == 1 " class="zj" style="color:#409EFF; font-weight: bold;"> +{{scope.row.money}}</div>
          <div v-if="scope.row.type == 2 " class="js" style="color:red;font-weight: bold;"> -{{scope.row.money}}</div>
          <div v-if="scope.row.type == 3 " class="js" style="color:red;font-weight: bold;"> -{{scope.row.money}}</div>
          <div v-if="scope.row.type == 2 " class="js" style="color:#409EFF;font-weight: bold;"> +{{scope.row.money}}</div>
          <div v-if="scope.row.type == 5 " class="js" style="color:red;font-weight: bold;"> -{{scope.row.money}}</div>
          <div v-if="scope.row.type == 6 " class="js" style="color:#409EFF;font-weight: bold;"> +{{scope.row.money}}</div>
          <div v-if="scope.row.type == 7 " class="js" style="color:red;font-weight: bold;"> -{{scope.row.money}}</div>
          <div v-if="scope.row.type == 8 " class="js" style="color:#409EFF;font-weight: bold;"> +{{scope.row.money}}</div>
        </template>
      </el-table-column>
      <el-table-column fixed prop="now_money" label="操作后金额" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="message" label="操作说明" align="center" header-align="center"></el-table-column>
      <el-table-column label="操作类型" align="center" header-align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.type==1">充值</div>
          <div v-if="scope.row.type==2">提现</div>
          <div v-if="scope.row.type==3">发布任务花费</div>
          <div v-if="scope.row.type==4">任务到期退回</div>
          <div v-if="scope.row.type==5">结算任务款</div>
          <div v-if="scope.row.type==6">删除任务退回</div>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column prop="created_at" label="记录时间" align="center" header-align="center">
      </el-table-column>
    </el-table>
    <div v-if="showBtn==2" class="mt15">
      <el-button size="mini" type="warning" @click="editOrder(3)">验收选中</el-button>
    </div>
    <div v-if="showBtn==3" class="mt15">
      <el-button size="mini" type="success" @click="editOrder(4)">结款选中</el-button>
    </div>
    <div class="mt15">
      <el-pagination layout="prev, pager, next" :total="total" :page-size="limit" :current-page='search.page' @current-change="pageChange"
        :background="true"></el-pagination>
    </div>


  </div>
</template>

<script>
  export default {
    name: "App",
    data() {
      return {
        search: {
          status: "0",
          phone: '',
          enterprise_id: 0,
          type: 0,
          page: 2,
          limit: 10
        },
        enterprise_list: [],
        date_time: "",
        value: 0,
        options: [1],
        total: 0,
        limit: 10,
        page: 1,
        loading: true,
        tableData: [],
        multipleSelection: [],
        showBtn: '0'
      };
    },
    created() {
      this.$api.get('admin/enterprise/list', {
        page: 1,
        limit: 5000
      }, res => {
        this.enterprise_list = res.data.data.list
      });
      this.loadData({});
    },
    mounted() {
      this.loading = false
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      editStatus(e, id) {
        this.$api.post('admin/behavior/edit_status', {
          id: id,
          status: e
        }, res => {
          if (res.data.bol) {
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        });
      },
      loadData() {
        this.$api.get('admin/enterprise/up_list', this.search, res => {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
          this.showBtn = this.search.status
          this.loading = false
        });
      },
      dateRes(date) {
        var d = new Date(date);
        var resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() +
          ':' + d.getSeconds();
        return resDate;
      },
      searchBtn() {
        this.search.begin_time = this.date_time[0],
          this.search.end_time = this.date_time[1],
          this.search.page = 1
        this.loadData()
      },
      handleClick(row) {
        console.log(row);
      },

      pageChange(e) {
        this.search.page = e;
        this.loadData();
      },
      reload() {
        this.loadData();
      }
    }
  };
</script>

<style>
  .user_info .item {
    display: flex;
    margin-top: 10px;
  }

  .user_info .item .left {
    width: 120px;
    text-align: right
  }

  .user_info .item .right {
    text-align: left;
    font-weight: bold;
  }
</style>
