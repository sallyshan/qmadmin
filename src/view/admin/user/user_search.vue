<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="/">人才搜索</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <div class="mt15"></div>
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <el-form-item label="用户手机">
        <el-input v-model="search.phone" placeholder="用户手机"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBtn">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table class="mt15" :data="tableData" border style v-loading="loading">
      <el-table-column type="index" label="编号" fixed width="60" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="nickname" label="昵称" align="center" header-align="center"></el-table-column>
      <el-table-column fixed label="头像" align="center" header-align="center">
          <template slot-scope="scope">
              <div>
                  <img :src="scope.row.logo" alt="" width="60" height="60">
              </div>
          </template>
      </el-table-column>
      <el-table-column fixed prop="phone" label="手机" align="center" header-align="center"></el-table-column>
       <el-table-column prop="created_at" label="记录时间" align="center" header-align="center">
      </el-table-column>
      <el-table-column fixed="right" label="状态" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="mini"  v-if="scope.row.is_bind==1">已绑定</el-button>
          <el-button type="drange" size="mini"  v-if="scope.row.is_bind==2">已拒绝</el-button>
          <el-button type="warning" size="mini"  v-if="scope.row.is_bind==3">申请中</el-button>
          <el-button type="warning" size="mini"  v-if="scope.row.is_bind==4">未绑定</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200" height="200">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="getUserInfo(scope.row.id)">查看信息</el-button>
          <el-button type="text" size="mini" @click="editBind(scope.row.id, 1)" v-if="scope.row.is_bind==3">同意</el-button>
          <el-button type="text" size="mini" @click="editBind(scope.row.id,2)" v-if="scope.row.is_bind==3">拒绝</el-button>
          <el-button type="text" size="mini" @click="editBind(scope.row.id,2)" v-if="scope.row.is_bind==1">解除绑定</el-button>
          <el-button type="text" size="mini" @click="editBind(scope.row.id,1)" v-if="scope.row.is_bind==2">重新绑定</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt15">
      <el-pagination layout="prev, pager, next" :total="total" :page-size="limit" @current-change="pageChange" :background="true"></el-pagination>
    </div>
    <el-dialog
        :title="userTitle"
        :visible.sync="userVisible"
        width="700px"
        :center="true"
        :close-on-click-modal="false"
      >
        <el-row>
            <el-col align="center">
                <div class="mt15">基本信息</div>

                <el-card class="mt15" align="center">
                    <div class="user_info">
                        <div class="item">
                            <div class="left">昵称：</div><div class="right">{{ user.nickname }}</div>
                        </div>
                        <div class="item">
                            <div class="left">手机号：</div><div class="right">{{ user.phone }}</div>
                        </div>
                    </div>
                </el-card>
                <div class="mt15">学校信息</div>
                <el-card class="mt15" align="center" v-for="(v ,i) in user.education_info" :key="i">
                    <div class="user_info">
                        <div class="item">
                            <div class="left">学校：</div><div class="right">{{ v.school_name }}</div>
                        </div>
                        <div class="item">
                            <div class="left">学历：</div><div class="right">{{ v.max_schooling}}</div>
                        </div>
                        <div class="item">
                            <div class="left">专业：</div><div class="right">{{ v.professional}}</div>
                        </div>
                        <div class="item">
                            <div class="left">入学时间：</div><div class="right">{{ v.begin_time}}</div>
                        </div>
                        <div class="item">
                            <div class="left">毕业时间：</div><div class="right">{{ v.end_time}}</div>
                        </div>
                    </div>
                </el-card>
                <div class="mt15">工作经历信息</div>
                <el-card class="mt15" align="center" v-for="(v ,i) in user.work_info" :key="i">
                    <div class="user_info">
                        <div class="item">
                            <div class="left">公司名字：</div><div class="right">{{ v.school_name }}</div>
                        </div>
                        <div class="item">
                            <div class="left">行业：</div><div class="right">{{ v.max_schooling}}</div>
                        </div>
                        <div class="item">
                            <div class="left">职业名称：</div><div class="right">{{ v.professional}}</div>
                        </div>
                        <div class="item">
                            <div class="left">标签：</div><div class="right">{{ v.begin_time}}</div>
                        </div>
                        <div class="item">
                            <div class="left">部门：</div><div class="right">{{ v.end_time}}</div>
                        </div>
                         <div class="item">
                            <div class="left">工作内容：</div><div class="right">{{ v.end_time}}</div>
                        </div>
                         <div class="item">
                            <div class="left">入职时间：</div><div class="right">{{ v.end_time}}</div>
                        </div>
                         <div class="item">
                            <div class="left">离职时间：</div><div class="right">{{ v.end_time}}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

      </el-dialog>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
        userTitle : '',
        user:{},  
        userVisible: false,
        search : {
            status : "",
            phone : '',
        },
        date_time: "",
        value: 0,
        options:[1],
        total: 1000,
        limit: 10,
        page:1,
        loading:true,
        tableData:[],
    };
  },
  created(){
     this.loadData({});
  },
  mounted() {
    this.loading = false
  },
  methods: {
    getUserInfo(uid){
        this.$api.get('enterprise/get_user_info',{ uid : uid }, res=>{
            this.user=res.data.data
            this.userTitle=this.user.nickname,
            this.userVisible=true;
      });
    },
    loadData (search) {
      let sea = search ? search : {};
      sea.page=this.page;
      sea.limit=this.limit
      this.$api.get('enterprise/search_user',sea, res=>{
        this.tableData=res.data.data.list
        this.total = res.data.data.total
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
        this.loadData(this.search)
    },
    handleClick(row) {
      console.log(row);
    },
    editBind(uid, status){  
        let data = {
            uid : uid,
            status : status
        };
        let msg = status == 1 ? '同意之后该人才即可领取发布的任务，确定这样操作么？' : '拒绝之后该人才再也不可领取发布的任务，确定这样操作么？'
      this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.post('/enterprise/edit_bind_user', data, res=> {
            if(res.data.bol)
            {
              this.$message.success(res.data.msg);
              this.loadData(this.search);
            }else{
              this.$message.error(res.data.msg);
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    pageChange(e)
    {
      this.page=e;
      this.loadData({});
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
