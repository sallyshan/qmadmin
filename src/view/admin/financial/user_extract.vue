<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="/">用户提现列表</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <div class="mt15"></div>
    <el-form :inline="true" size="mini" :model="search" class="demo-form-inline">
      <el-form-item label="时间">
        <el-date-picker v-model="date_time" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="search.status" placeholder="请选择">
          <el-option label="全部" :value='0'></el-option>
          <el-option label="审核成功" :value='1'></el-option>
          <el-option label="审核失败" :value='2'></el-option>
          <el-option label="审核中" :value='3'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户手机号" prop="phone">
        <el-input v-model="search.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBtn">查询</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <!-- <el-form-item label="">
        <el-button type="primary" size="mini" @click="$router.push('/admin/enterprise/add')">添加</el-button>
      </el-form-item> -->
      <el-form-item>
        <el-button type="warning" @click="searchBtn" size="mini">刷新</el-button>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" size="mini" @click="extract">结款选中</el-button>
        <el-button type="primary" size="mini" @click="open">打开</el-button>
      </el-form-item>
      <el-form-item label="当前银行所剩金额:">
          <span style="color:red; font-size: 18px; font-weight: bold;">{{money_total}}</span>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" size="mini" border style v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="id" label="编号" fixed width="60" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="nickname" label="用户名称" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="phone" label="联系电话" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="logo" label="用户头像" align="center" header-align="center">
        <template slot-scope="scope">
          <img :src="scope.row.logo" style="width: 60px; height: 60px;">
        </template>
      </el-table-column>
      <el-table-column fixed label="提现金额" width="300" align="center" header-align="center">
        <template slot-scope="scope">
          <div style="color:red; font-size: 18px; font-weight: bold;">{{scope.row.money}}</div>
        </template>
      </el-table-column>
      <el-table-column fixed label="提现方式" width="240" align="center" header-align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.extract_type==1">支付宝</div>
          <div v-if="scope.row.extract_type==2">
            <p>银行卡</p>
            <p>卡号：{{scope.row.bank_info.bank_num}}</p>
            <p>银行：{{scope.row.bank_info.bank_name}}</p>
          </div>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="scope.row.status == 1">提现成功</el-button>
          <el-button type="drange" size="mini" v-if="scope.row.status == 2">已拒绝</el-button>
          <el-button type="warning" size="mini" v-if="scope.row.status == 3">审核中</el-button>
          <el-button type="infor" size="mini" v-if="scope.row.status == 4">银行受理中</el-button>
          <el-button type="infor" size="mini" v-if="scope.row.status == 5">银行处理失败</el-button>
          <div v-if="scope.row.status == 5">失败原因{{scope.row.message}}</div>
        </template>
      </el-table-column>
      <el-table-column fixed prop="created_at" label="申请时间" align="center" header-align="center"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="editStatus(scope.row.id, 1)" v-if="scope.row.status==3">同意</el-button>
          <el-button type="text" size="mini" @click="editStatus(scope.row.id, 2)" v-if="scope.row.status==3">拒绝</el-button>
          <el-button type="text" size="mini" @click="editStatus(scope.row.id, 2)" v-if="scope.row.status==5">退回请求</el-button>
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
          status: 0,
          phone: '',
          limit: 10,
          page: 1,
          begin_time :'',
          end_time : '',
        },
        money_total : 0,
        date_time: "",
        value: 0,
        options: [1],
        total: 1000,
        loading: true,
        tableData: [],
        multipleSelection: [],
        extractList: [],
        isRequest: false
      };
    },
    created() {
      this.loadData();
    },
    methods: {
      open() {
        const self = this
         this.$confirm(
           'aaa', '提示', {
             beforeClose : (action, instance, done) => {
               if(action == 'confirm')
               {
                 instance.confirmButtonLoading = true;
                 instance.confirmButtonText = '执行中...'
                 setTimeout(function(){
                   instance.confirmButtonLoading = false;
                   done()
                 },2000)
               }else{
                 done()
               }
             }
           }
         )
      },
      extract() {
        this.extractList = []
        let self = this
        this.multipleSelection.forEach(function(e) {
          if (e.status == 3) {
            let data = {
              id: e.id,
              status: 1,
            }
            self.extractList.push(data)
          }
        })
        if (this.extractList.length < 1) {
          this.$message.error('未选中，或不存在待审核数据');
          return false;
        }
        this.$msgbox({
          title: '提示',
          type : 'warning',
          message: '确定要通过么？确认后将同意将提示金额转入该用户账下，此过程不可逆转。。。',
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              self.isRequest = true
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              self.$api.post('admin/user/edit_extract_status', {
                params: JSON.stringify(this.extractList)
              }, res => {
                done();
                instance.confirmButtonLoading = false;
                self.isRequest = false
                if (res.data.bol) {
                  self.$message.success(res.data.msg);
                  self.loadData({})
                } else {
                  self.$message.error(res.data.msg);
                }
              });
            } else {
              if (self.isRequest == true) {
                self.$message.error('正在请求无法中断')
              } else {
                done()
              }
            }
          }
        }).then(action => {

        });
        // this.$confirm('确定要通过么？', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   self.$api.post('admin/user/edit_extract_status', {
        //     params: JSON.stringify(this.extractList)
        //   }, res => {
        //     if (res.data.bol) {
        //       self.$message.success(res.data.msg);
        //       self.loadData({})
        //     } else {
        //       self.$message.error(res.data.msg);
        //     }
        //   });
        // }).catch(() => {});
      },
      editStatus(id, status) {
        let data = {
          id: id,
          status: status,
          message: '',
        }
        let self = this;
        if (status == 2) {
          this.$prompt('请输入拒绝理由。。。', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: "请写下拒绝理由，让用户参考修改",
            inputValidator: function(str) {
              if (str == null) {
                return false;
              }
              return true;
            },
            inputErrorMessage: '拒绝审核，理由不可为空'
          }).then(({
            value
          }) => {
            data.message = value
            self.extractList.push(data)
            self.$api.post('admin/user/edit_extract_status', {
              params: JSON.stringify(this.extractList)
            }, res => {
              if (res.data.bol) {
                self.$message.success(res.data.msg);
                this.loadData({});
              } else {
                self.$message.error(res.data.msg);
              }
            });
          }).catch(() => {
            self.extractList = []
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
        } else {
          this.$msgbox({
            title: '提示',
            message: '确定要通过么？确认后将同意将提示金额转入该用户账下，此过程不可逆转。。。',
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                self.isRequest = true
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = '执行中...';
                self.extractList.push(data)
                self.$api.post('admin/user/edit_extract_status', {
                  params: JSON.stringify(this.extractList)
                }, res => {
                  done();
                  instance.confirmButtonLoading = false;
                  self.isRequest = false
                  if (res.data.bol) {
                    self.$message.success(res.data.msg);
                    self.loadData({})
                  } else {
                    self.$message.error(res.data.msg);
                  }
                });
              } else {
                if (self.isRequest == true) {
                  self.$message.error('正在请求无法中断')
                } else {
                  done()
                }
              }
            }
          }).then(action => {

          });
          // this.$confirm('确定要通过么？', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          // }).then(() => {
          //   self.extractList.push(data)
          //   self.$api.post('admin/user/edit_extract_status', {
          //     params: JSON.stringify(this.extractList)
          //   }, res => {
          //     if (res.data.bol) {
          //       self.$message.success(res.data.msg);
          //       self.loadData({})
          //     } else {
          //       self.$message.error(res.data.msg);
          //     }
          //   });
          // }).catch(() => {});
        }
        self.extractList = []
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      loadData() {
        this.loading = true
        this.$api.get('admin/user/extract_list', this.search, res => {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
          this.money_total = res.data.data.money_total
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
        this.search.page = 1;
        this.search.begin_time = this.date_time == null ? '' : this.date_time[0],
        this.search.end_time = this.date_time == null ? '' : this.date_time[1],
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
