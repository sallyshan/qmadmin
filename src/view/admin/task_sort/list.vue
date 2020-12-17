<template>
<div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="/">任务分类列表</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <div class="mt15"></div>
    <el-form :inline="true"  size="small" :model="search" class="demo-form-inline">
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
     <el-form :inline="true"  size="small" :model="search" class="demo-form-inline">
       <el-form-item label="">
         <el-button type="primary" size="mini" @click="$router.push('/admin/task_sort/add')">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="searchBtn" size="mini">刷新</el-button>
      </el-form-item>
    </el-form>
   <el-table
    :data="tableData"
    style="width: 100%;margin-bottom: 20px;"
    row-key="id"
     size="small"
    border
    default-expand-all
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column prop="id" label="编号" sortable> </el-table-column>
    <el-table-column prop="name" label="姓名" sortable> </el-table-column>
    <el-table-column label="icon">
        <template slot-scope="scope">
            <img :src="scope.row.icon" style="width: 30px; height: 30px">
        </template>
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
    <el-table-column prop="order" label="顺序" sortable width="180"> </el-table-column>
    <el-table-column fixed="right" label="操作" width="100" height="200">
        <template slot-scope="scope">
          <el-button type="text" size="mini"  >删除</el-button>
          <el-button type="text" size="mini" @click="$router.push({ path : '/admin/task_sort/add', query: { id : scope.row.id}})">编辑</el-button>
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
        name: "index",
        data (){
            return {
                search : {
                    status : "0",
                    order_no : '',
                    phone:'',
                    limit: 10,
                    page:1,
                    begin_time:'',
                    end_time:'',
                },
                date_time:'',
                tableData: [],
                total: 1000,
            }
        },
        created (){
            this.loadData({})
        },
        methods :{

           editStatus(e, id)
            {
              this.$api.post('admin/task_sort/edit_status', { id : id , status : e}, res=>{
                    if(res.data.bol)
                    {
                      this.$message.success(res.data.msg);
                    }else{
                      this.$message.error(res.data.msg);
                    }
              });
            },
            loadData (search) {
              this.$api.get('admin/task_sort/list',this.search, res=>{
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
              this.loadData();
            }
        }

    }
</script>

<style scoped>

</style>
