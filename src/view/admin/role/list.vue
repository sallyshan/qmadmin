<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="/">角色列表</a>
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
      
      <el-form-item>
        <el-button type="primary" @click="searchBtn">查询</el-button>
      </el-form-item>
    </el-form>
     <el-form :inline="true" :model="search" class="demo-form-inline">
       <el-form-item label="">
         <el-button type="primary" size="mini" @click="$router.push('/admin/role/add')">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="searchBtn" size="mini">刷新</el-button>
      </el-form-item>
    </el-form>
    <el-table size="small" :data="tableData" border style v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="id" label="编号" fixed width="60" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="name" label="角色名称" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="message" label="角色描述" align="center" header-align="center">
      
        </el-table-column>
      </el-table-column>
       <el-table-column prop="created_at" label="记录时间" align="center" header-align="center">
      </el-table-column>
      <el-table-column fixed="right" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              active-text="启用" inactive-text="停用" :active-value='1' :inactive-value='2'
              inactive-color="#ff4949">
            </el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100" height="200">
        <template slot-scope="scope">
          <el-button type="text" size="mini"  >删除</el-button>
          <el-button type="text" size="mini" @click="$router.push({ path : '/admin/role/add', query: { id : scope.row.id}})">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="showBtn==2" class="mt15">
                <el-button size="mini" type="warning" @click="editOrder(3)">验收选中</el-button>
          </div>
          <div v-if="showBtn==3" class="mt15">
            <el-button size="mini" type="success" @click="editOrder(4)">结款选中</el-button>
          </div>
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
            status : "0",
            order_no : '',
            phone:'',
            limit: 10,
            page:1,
        },
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
     this.loadData();
  },
  mounted() {
    this.loading = false
  },
  methods: {
    handleSelectionChange(val) {
        this.multipleSelection = val;
      },
    
    loadData () {
      this.$api.get('admin/role/list',this.search, res=>{
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
        this.search.begin_time = this.date_time[0],
        this.search.end_time = this.date_time[1],
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
