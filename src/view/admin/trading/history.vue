<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="/">交易明细列表</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <div class="mt15"></div>
    <el-form :inline="true" size="mini" :model="search" class="demo-form-inline">
      <el-form-item label="时间">
        <el-date-picker v-model="date_time" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBtn">查询</el-button>
        <el-button type="primary" @click="exportSub">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" size="mini" border style v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column label="交易类型" fixed width="80" align="center" header-align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.AMTCDR == 'C'" style="color:#00FF00;font-weight: bold;">收入</div>
          <div v-if="scope.row.AMTCDR == 'D'"  style="color:red;font-weight: bold;">支出</div>
        </template>
      </el-table-column>
      <el-table-column fixed label="摘要" width="240" align="center" header-align="center">
        <template slot-scope="scope">
          {{scope.row.NARYUR}}
        </template>
      </el-table-column>
      <el-table-column fixed prop="RPYNAM" label="交易对方名称" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="REQNBR" label="交易实例号" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="RPYBNK" label="对方银行" align="center" header-align="center">
        <template slot-scope="scope">
          {{scope.row.RPYBNK}}
        </template>
      </el-table-column>
      <el-table-column fixed label="交易金额" width="300" align="center" header-align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.AMTCDR == 'C'" style="color:#00FF00;font-weight: bold;">+{{scope.row.TRSAMT}}</div>
          <div v-if="scope.row.AMTCDR == 'D'"  style="color:red;font-weight: bold;">{{scope.row.TRSAMT}}</div>

        </template>
      </el-table-column>
      <el-table-column fixed prop="TRSBLV" label="余额" align="center" header-align="center"></el-table-column>


      <el-table-column fixed prop="C_VLTDAT" label="记录时间" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="ETYTIM" label="具体时间" align="center" header-align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "App",
    data() {
      return {
        isExport : false,
        search: {
          begin_time : '',
          end_time : '',
        },
        money_total : 0,
        date_time: "",
        value: 0,
        options: [1],
        total: 1000,
        limit: 10,
        page: 1,
        loading: true,
        tableData: [],
        multipleSelection: [],
        extractList: [],
        isRequest: false
      };
    },
    created() {
      this.$api.get('admin/trading_history', {

      }, res => {
        console.log(res)
      });
      this.loadData();
    },
    mounted() {
      this.loading = false
    },
    methods: {

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      loadData() {
        let self = this
        self.loading=true
        this.$api.get('admin/trading_history', self.search, res => {
          self.tableData = res.data.data.NTQTSINFZ

          self.loading=false
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
      },
      exportSub() {

        const self = this
        if (self.isExport)
        {
          self.$message.error("正在导出请稍候...")
          return
        }
        self.isExport = true
        this.search.begin_time = this.date_time == null ? '' : this.date_time[0],
        this.search.end_time = this.date_time == null ? '' : this.date_time[1],
        this.$api.post('admin/export_trading_history', this.search, res=>{
          self.isExport = false
          if(res.data.bol){
            self.$message.success(res.data.msg)
            window.open(res.data.data.path, "_blank")
          }else{
            self.$message.error(res.data.msg)
          }
        });
      },
      handleClick(row) {
        console.log(row);
      },

      pageChange(e) {
        this.page = e;
        this.loadData();
      },
      reload() {
        this.loadData();
      }
    }
  };
</script>

<style>
  .id_logo {
    width: 100%;
    height: 100%
  }

  .btn {
    display: flex;
    position: fixed;
    justify-content: center;
    width: 375px;
    bottom: 20px;
    left: 50%;
    margin-left: -200px;
  }

  .el-dialog__body {
    padding: 0 !important;
    height: 500px;
    overflow: auto;
  }

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
