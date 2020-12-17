<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="/">资讯列表</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-form :inline="true" size="small" :model="search" class="demo-form-inline mt15">
      <el-form-item label="时间">
        <el-date-picker v-model="date_time" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select v-model="search.type" placeholder="请选择类型" style="z-index:111111111">
          <el-option label="全部" :value="0"></el-option>
          <el-option label="关于我们" :value="1"></el-option>
          <el-option label="版权问题" :value="2"></el-option>
          <el-option label="法律问题" :value="3"></el-option>
          <el-option label="常见问题" :value="4"></el-option>
          <el-option label="帮助手册" :value="5"></el-option>
          <el-option label="交易规则" :value="6"></el-option>
          <el-option label="签约协议" :value="7"></el-option>
          <el-option label="注册协议" :value="8"></el-option>
         <el-option label="服务协议" :value="9"></el-option>
         <el-option label="隐私协议" :value="10"></el-option>
         <el-option label="首页公告" :value="11"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBtn">查询</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="">
        <el-button type="primary" size="mini" @click="$router.push('/admin/new/add')">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="searchBtn" size="mini">刷新</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" size="small" border style v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="id" label="编号" fixed width="60" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="title" label="标题" align="center" header-align="center"></el-table-column>
      <el-table-column fixed label="类型" prop="type" align="center" header-align="center"> </el-table-column>
      <el-table-column prop="created_at" label="记录时间" align="center" header-align="center"> </el-table-column>
      <el-table-column prop="order" label="顺序" align="center" header-align="center"> </el-table-column>
      <el-table-column fixed="right" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-color="#13ce66" active-text="启用" inactive-text="停用"
            :active-value="1" :inactive-value="2" @change="editStatus($event , scope.row.id)" inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100" height="200">
        <template slot-scope="scope">
          <el-button type="text" size="mini">删除</el-button>
          <el-button type="text" size="mini" @click="$router.push({ path : '/admin/new/add', query: { id : scope.row.id}})">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt15">
      <el-pagination layout="prev, pager, next" :total="total" :page-size="search.limit" :current-page='search.page' @current-change="pageChange"
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
          type: 0,
          begin_time: '',
          end_time: '',
          limit: 10,
          page: 1,
        },
        date_time: "",
        value: 0,
        options: [1],
        total: 1000,
        loading: true,
        tableData: [],
      };
    },
    created() {
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
        this.$api.post('admin/news/edit_status', {
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
        this.$api.get('admin/news/list', this.search, res => {
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
        this.search.begin_time = this.date_time == null ? '' : this.date_time[0],
          this.search.end_time = this.date_time == null ? '' : this.date_time[1],
          this.loadData()
          this.search.page =1 
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
