<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="/">管理员日志</a>
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
       <el-form-item label="管理员">
         <el-select v-model="search.admin_id" placeholder="请选择">
            <el-option
              label="全部"
              :value='0'
            ></el-option>
            <el-option :label="v.nickname" :value="v.id" v-for="(v,i) in admin_list" :key="i" ></el-option>
          </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBtn">查询</el-button>
      </el-form-item>
    </el-form>
     <el-form :inline="true" :model="search" class="demo-form-inline">
       <el-form-item label="">
         <el-button type="primary" size="mini" @click="$router.push('/admin/behavior/add')">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="reload" size="mini">刷新</el-button>
      </el-form-item>
    </el-form>
    <el-table size="small" :data="tableData" border style v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="id" label="编号" fixed width="60" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="info.nickname" label="管理员名称" width="120"  align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="message" label="操作日志" align="center" header-align="center">

        </el-table-column>


      </el-table-column>
       <el-table-column prop="created_at" label="记录时间" align="center" width="120" header-align="center">
      </el-table-column>

    </el-table>

    <div class="mt15">
      <el-pagination layout="prev, pager, next" :total="total" :page-size="search.limit" :current-page='search.page' @current-change="pageChange" :background="true"></el-pagination>
    </div>


  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
        search : {
            admin_id : 0,
            limit: 10,
            page:1,
            begin_time:'',
            end_time : '',
        },
        admin_list : [],
        date_time: "",
        value: 0,
        options:[1],
        total: 1000,
        loading:true,
        tableData:[],
        multipleSelection:[],
        showBtn : '0'
    };
  },
  created(){
      this.$api.get('admin/admin/list',{ page : 1 , limit : 50}, res =>{
          this.admin_list = res.data.data.list
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
    editStatus(e, id)
    {
      this.$api.post('admin/behavior/edit_status', { id : id , status : e}, res=>{
            if(res.data.bol)
            {
              this.$message.success(res.data.msg);
            }else{
              this.$message.error(res.data.msg);
            }
      });
    },
    loadData () {
      this.$api.get('admin/admin/get_log',this.search, res=>{
        this.tableData=res.data.data.list
        this.total = res.data.data.total
        this.showBtn = this.search.status
        this.loading = false
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
        this.loadData()
        this.search.page = 1
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
      this.search = {
        page : 1,
        limit : 10,
        begin_time: '',
        end_time:'',
        admin_id:0,
      },
      this.date_time = ''
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
