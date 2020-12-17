<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="/">合同列表</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="mt15" :gutter="5">
      <el-col :xl="1" :lg="1" :md="3" :sm="4" :xs="4">
        <el-button size="mini" type="success" @click="reload">刷新</el-button>
      </el-col>
      <el-col :xl="1" :lg="1" :md="3" :sm="4" :xs="4">
        <el-button size="mini" type="warning" @click="$router.push('/admin/task/add_contract')">新增</el-button>
      </el-col>
    </el-row>
    <el-form :inline="true" :model="search" class="demo-form-inline mt15">
      <el-form-item label="时间">
        <el-date-picker v-model="date_time" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="search.status" placeholder="请选择">
          <el-option label="全部" :value="0"></el-option>
          <el-option label="上架中" :value="1"></el-option>
          <el-option label="已下架" :value="2"></el-option>
          <el-option label="已删除" :value="10"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="search.audit_ret" placeholder="请选择">
          <el-option label="全部" :value="0"></el-option>
          <el-option label="已通过" :value="1"></el-option>
          <el-option label="审核中" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="企业手机">
        <el-input v-model="search.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBtn">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table class="mt15" :data="contract_list" border style v-loading="loading">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="编号" prop="id" fixed align="center" width="60" header-align="center"></el-table-column>
      <el-table-column fixed prop="title" label="标题" align="center" header-align="center"></el-table-column>
      <el-table-column prop="created_at" label="创建日期" align="center" header-align="center">
      </el-table-column>
      <el-table-column prop="status" label="企业" align="center" header-align="center">
        <template slot-scope="scope">
          <div type="success" size="mini" v-if="scope.row.enterprise_id > 0 ">
            {{scope.row.enterprise_name}}
          </div>
          <div type="success" size="mini" v-if="scope.row.enterprise_id < 1 ">
            后台添加
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" header-align="center">
        <template slot-scope="scope">
          <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              active-text="启用" inactive-text="停用" :active-value="1" :inactive-value="2"
              @change="editStatus($event , scope.row.id, scope.$index)"
              inactive-color="#ff4949">
            </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="city" label="审核状态" width="120" align="center" header-align="center">
        <template slot-scope="scope">
          <el-button type="success" v-if="scope.row.audit_ret==1" size="mini">审核成功</el-button>
          <el-button type="warning" v-if="scope.row.audit_ret==3" size="mini">审核中</el-button>
          <el-button type="error" v-if="scope.row.audit_ret==2" size="mini">审核失败</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200" height="200">
        <template slot-scope="scope">
          <el-button type="text" size="mini" v-if="scope.row.enterprise_id==0" @click="$router.push({ path : '/admin/task/add_contract', query: { id : scope.row.id}})">编辑</el-button>
          <el-button type="text" size="mini" v-if="scope.row.audit_ret == 3 " @click="audit(scope.row.id , 1,  scope.$index)">审核通过</el-button>
          <el-button type="text" size="mini" v-if="scope.row.audit_ret == 3 " @click="audit(scope.row.id , 2,  scope.$index)">拒绝审核</el-button>
          <el-button type="text" size="mini" @click="del( scope.row.id , scope.$index)">删除</el-button>
          <el-button type="text" size="mini" @click="show(scope.$index)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt15">
      <el-pagination layout="prev, pager, next" :total="total" :page-size="search.limit" :current-page='search.page' @current-change="pageChange"
        :background="true"></el-pagination>
    </div>
    <el-dialog :title="contractTitle" :visible.sync="contractVisible" width="700px" :center="true"
      :close-on-click-modal="false">
      <div v-html="contractContent"></div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        contractVisible: false,
        contractTitle: '',
        contractContent: '',
        search: {
          status: 0,
          audit_ret: 0,
          phone: '',
          begin_time: '',
          end_time: '',
          page: 1,
          limit: 10
        },
        date_time: '',
        total: 1000,
        loading: true,
        contract_list: []
      }
    },
    created() {
      this.loadData({})
    },
    mounted() {},
    methods: {
      show(index) {
        this.contractTitle = this.contract_list[index].title
        this.contractContent = this.contract_list[index].content
        this.contractVisible = true
      },
      audit(id, audit, index) {
        let msg = ''
        switch (audit) {
          case 1:
            // statements_1
            msg = '确定要审核通过么？'
            break
          case 2:
            msg = '确定要拒绝审核么？'
        }
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.post('admin/contract/audit', {
            id: id,
            audit: audit
          }, res => {
            if (res.data.bol) {
              this.contract_list[index].audit_ret = audit
            }
          })
        }).catch(() => {})
      },
      loadData() {
        this.$api.get('admin/contract/list', this.search, res => {
          this.loading = false
          this.contract_list = res.data.data.list
          this.total = res.data.data.total
        })
      },
      dateRes(date) {
        var d = new Date(date)
        var resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() +
          ':' + d.getSeconds()
        return resDate
      },

      del(id, index){
        let msg = '确定要删除该内容么?';
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.post('admin/contract/del', {
            id: id,
          }, res => {
            if (res.data.bol) {
              this.contract_list.splice(index,1)
            }
          })
        }).catch(() => {
        })

      },

      editStatus(status ,id, index) {
        let msg = ''
        switch (status) {
          case 1:
            msg = '确定要开启该内容么？'
            break;
          case 2:
            msg = '确定要停用该内容么？'
            break;
          case 10:
            msg = '确定要删除该内容么?'
            break;
        }
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.post('admin/contract/edit_status', {
            id: id,
            status: status
          }, res => {
            if (res.data.bol) {
              this.contract_list[index].status = status
            }
          })
        }).catch(() => {
          this.contract_list[index].status = this.contract_list[index].status == 1 ? 2 :1
        })
      },
      searchBtn() {

        this.search.begin_time = this.date_time == null ? '' : this.date_time[0]
        this.search.end_time = this.date_time == null ? '' : this.date_time[1]
        this.loadData()
        this.search.page = 1
      },
      handleClick(row) {
        console.log(row)
      },
      pageChange(e) {
        this.search.page = e
        this.loadData()
      },
      reload() {
        window.localtion.reload()
      }
    }
  }
</script>

<style>

</style>
