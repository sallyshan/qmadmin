<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="/">管理员列表</a>
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
         <el-button type="primary" size="mini" @click="$router.push('/admin/adm/add')">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="searchBtn" size="mini">刷新</el-button>
      </el-form-item>
    </el-form>
    <el-table size="small" :data="tableData" border style v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="id" label="编号" fixed width="60" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="nickname" label="管理员名称" align="center" header-align="center"></el-table-column>
      </el-table-column>
       <el-table-column prop="created_at" label="记录时间" align="center" header-align="center">
      </el-table-column>
       <el-table-column prop="roles" label="拥有角色" align="center" header-align="center">
      </el-table-column>
      <el-table-column label="开票是否通知" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.is_invoice_notice==1">通知</div>
          <div v-if="scope.row.is_invoice_notice==2">不通知</div>

            <div v-if="scope.row.is_invoice_notice==1">通知电话：{{scope.row.notice_phone}}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="状态" align="center">
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
      <el-table-column fixed="right" label="操作" width="100" height="200">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="del(scope.$index)" >删除</el-button>
          <el-button type="text" size="mini" @click="$router.push({ path : '/admin/adm/add', query: { id : scope.row.id}})">编辑</el-button>
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
    editStatus(e, id, index)
    {
      this.$api.post('admin/admin/edit_status', { id : id , status : e}, res=>{
            if(res.data.bol)
            {
              this.$message.success(res.data.msg);
            }else{
              this.tableData[index].status=e==1?2:1
              this.$message.error(res.data.msg);
            }
      });
    },
    loadData () {
      this.$api.get('admin/admin/list',this.search, res=>{
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
    del(index){

      console.log(index)
      let id = this.tableData[index].id
      this.$confirm("确定要删除管理员么", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         this.$api.post('admin/admin/del', {id:id}, res=>{
           if(res.data.bol){
             this.$message.success(res.data.msg)
             this.tableData.splice(index,1)
           }else{
             this.$message.error(res.data.msg)
           }
         });
        }).catch((e) => {
          console.log(e)
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });;

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
