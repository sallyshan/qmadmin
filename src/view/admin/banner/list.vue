<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="/">广告位列表</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <div class="mt15"></div>
    <el-form :inline="true" size="small" :model="search" class="demo-form-inline">
       <el-form-item label="">
         <el-button type="primary" size="mini" @click="$router.push('/admin/banner/add')">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="searchBtn" size="mini">刷新</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" :model="search" class="demo-form-inline">
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
    <el-table size="small" :data="tableData" border style v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column type="index" label="编号" fixed width="60" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="title" label="标题" align="center" header-align="center"></el-table-column>
      <el-table-column fixed label="图片" align="center" header-align="center">
          <template slot-scope="scope">
              <div>
                  <img :src="scope.row.url" alt="" width="60" height="60">
              </div>
          </template>
      </el-table-column>
      <el-table-column fixed prop="type" label="显示类型" align="center" header-align="center">
          <template slot-scope="scope">
              <div v-if="scope.row.type==1">
                  任务广告
              </div>
          </template>
      </el-table-column>
      <el-table-column fixed prop="show" label="显示区域" align="center" header-align="center">
          <template slot-scope="scope">
              <div v-if="scope.row.show==1">
                  首页顶部
              </div>
              <div v-if="scope.row.show==3">
                  首页第二位置
              </div>
          </template>
      </el-table-column>
      <el-table-column fixed prop="order" label="顺序" align="center" header-align="center"></el-table-column>
       <el-table-column prop="created_at" label="记录时间" align="center" header-align="center">
      </el-table-column>
      <el-table-column fixed="right" label="状态" align="center">
        <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              active-text="启用" inactive-text="停用" :active-value="1" :inactive-value="2"
              @change="editStatus($event , scope.row.id)"
              inactive-color="#ff4949">
            </el-switch>
        </template>
      </el-table-column>
       <el-table-column fixed="right" label="操作" width="100" height="200">
        <template slot-scope="scope">
          <el-button type="text" size="mini"  >删除</el-button>
          <el-button type="text" size="mini" @click="$router.push({ path : '/admin/banner/add', query: { id : scope.row.id}})">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt15">
      <el-pagination layout="prev, pager, next" :total="total" :page-size="search.limit" @current-change="pageChange" :current-page='search.page' :background="true"></el-pagination>
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
     this.loadData({});
  },
  mounted() {
    this.loading = false
  },
  methods: {
    handleSelectionChange(val) {
        this.multipleSelection = val;
      },
    loadData () {
      this.$api.get('admin/banner/list',this.search, res=>{
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
        this.search.page= 1
    },
    editStatus(e, id)
    {
      this.$api.post('admin/banner/edit_status', { id : id , status : e}, res=>{
            if(res.data.bol)
            {
              this.$message.success(res.data.msg);
            }else{
              this.$message.error(res.data.msg);
            }
      });
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
