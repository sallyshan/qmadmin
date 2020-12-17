<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页1</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="/">任务列表</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-form :inline="true" size="small" :model="search" class="mt15 demo-form-inline">
      <el-form-item label="时间">
        <el-date-picker v-model="date_time" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" @change="timeChange"></el-date-picker>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="search.status" placeholder="请选择">
          <el-option label="全部" value="0"></el-option>
          <el-option label="上架中" value="1"></el-option>
          <el-option label="已下架" value="2"></el-option>
          <el-option label="已删除" value="10"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="search.audit_ret" placeholder="请选择">
          <el-option label="全部" value="0"></el-option>
          <el-option label="已通过" value="1"></el-option>
          <el-option label="审核中" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="谁可接单">
        <el-select v-model="search.is_specified_people" placeholder="请选择">
          <el-option label="全部" value="0"></el-option>
          <el-option label="所有人可接" value="3"></el-option>
          <el-option label="指定可接" value="1"></el-option>
          <el-option label="绑定可接" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属企业">
        <el-select v-model="search.enterprise_id" filterable placeholder="请选择">
          <el-option label="全部" :value="0"></el-option>
          <el-option :label="v.enterprise_name" :value="v.id" v-for="(v,i) in enterpriseList" :key="i"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBtn">查询</el-button>
      </el-form-item>
      <el-form-item label="">
        <el-button type="success" @click="reload">刷新</el-button>
      </el-form-item>
    </el-form>


    <el-table class="mt15" size="mini" :data="tableData" border style v-loading="loading">

      <!-- <el-table-column type="selection" align="center" width="55"></el-table-column> -->
      <el-table-column label="编号" prop="id" fixed align="center" width="50" header-align="center"></el-table-column>
      <el-table-column fixed prop="title" label="标题" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="enterprise_name" label="公司名称" align="center" header-align="center"></el-table-column>
      <el-table-column label="logo" align="center" width="120" header-align="center">
        <template slot-scope="props">
          <img :src="props.row.logo" style="width:80px;height:80px;">
        </template>
      </el-table-column>
      <el-table-column label="顺序" align="center" header-align="center">
        <template slot-scope="scope">
          <el-button @click="editTaskOrder(scope.row.id , scope.$index)" size="mini" type="text">{{scope.row.order}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="是否指定" align="center" header-align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.is_specified_people == 1 ">
            已指定：{{ scope.row.specified_people_list }} 人
          </div>
          <div v-if="scope.row.is_specified_people == 2 ">
            绑定可接
          </div>
          <div v-if="scope.row.is_specified_people == 3 ">
            所有人可接
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" header-align="center">
        <template slot-scope="scope">
          <el-button type="success" v-if="scope.row.status==1" size="mini">上架中</el-button>
          <el-button type="error" v-if="scope.row.status==2" size="mini">已下架</el-button>
          <el-button type="error" v-if="scope.row.status==10" size="mini">已删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="city" label="审核状态" align="center" header-align="center">
        <template slot-scope="scope">
          <el-button type="success" v-if="scope.row.audit_ret==1" size="mini">审核成功</el-button>
          <el-button type="text" v-if="scope.row.nature==1" size="mini">兼职任务</el-button>
          
          <el-button type="text" v-if="scope.row.nature==2" size="mini">正常任务</el-button>
          <el-button type="warning" v-if="scope.row.audit_ret==3" size="mini">审核中</el-button>
          <el-button type="error" v-if="scope.row.audit_ret==2" size="mini">审核失败</el-button>
        </template>
      </el-table-column>


      <el-table-column label="已报名" align="center" header-align="center">

        <template slot-scope="scope">
          <el-button @click="showSign(scope.row.id,1)" size="mini" type="text">{{ scope.row.sign_count ? scope.row.sign_count : 0}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="订单" align="center" header-align="center">
        <template slot-scope="scope">
          <el-button @click="showOrder(scope.row.id,0)" size="mini" type="text">{{ scope.row.order_count }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center" header-align="center">
        <template slot-scope="scope">
          {{ scope.row.type == 1 ? '每单' : '每小时'}} {{scope.row.money}} <br />
          限制人数：{{ scope.row.max_people }}
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建日期" align="center" header-align="center">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200" height="200">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="getDetail(scope.row.id)">查看</el-button>
          <el-button type="text" size="mini" v-if="scope.row.audit_ret == 3 " @click="taskAudit(scope.row.id,1)">确认审核</el-button>
          <el-button type="text" size="mini" v-if="scope.row.audit_ret == 3 " @click="taskAudit(scope.row.id,2)">拒绝审核</el-button>
          <el-button type="text" size="mini" v-if="scope.row.status == 1" @click="del(scope.row.id,2)">下架</el-button>
          <el-button type="text" size="mini" v-if="scope.row.status == 2" @click="del(scope.row.id,1)">上架</el-button>
          <el-button type="text" size="mini" @click="del(scope.row.id, 10)">删除</el-button>
          <el-button type="text" size="mini" @click="exportInfo(scope.$index)">导出订单信息</el-button>
          <!-- <el-button type="text" size="mini" v-if="scope.row.status == 10" @click="del(scope.row.id, 1)">恢复</el-button> -->
          <!--           <el-button type="text" size="mini" @click="showSign(scope.row.id,3)" class="bm">报名列表<span style="color:red;">({{ scope.row.sign_ing > 0 ? scope.row.sign_ing : 0}})</span></el-button>
 -->
        </template>
      </el-table-column>
    </el-table>
    <div class="mt15">
      <el-pagination layout="prev, pager, next" :total="total" :page-size="search.limit" :current-page='search.page'
        @current-change="pageChange" :background="true"></el-pagination>
    </div>
    <!-- 任务详情弹窗 -->
    <el-dialog title="任务详情" :visible.sync="detailVisible" width="375px" :center="true" :close-on-click-modal="false"
      class="dialog-box" height="100%">
      <div class="box">
        <div class="header">
          <img :src="detail.logo">
        </div>
        <div class="title-box">
          <h3>{{detail.title}}</h3>
          <div class="task-info">
            <div class="diqu">
              报名:{{ detail.order_count}}人
            </div>
            <div class="diqu">
              每单:{{ detail.money }}元
            </div>
          </div>
        </div>
        <div class="xinxi">
          <div class="xh">
            <div class="sc"></div>
            <div class="t">任务信息</div>
          </div>
          <div>
            <div class="xinxi-box">
              <div class="item">
                <div class="mc">任务用人：</div>
                <div class="c">{{detail.max_people}}</div>
              </div>
              <div class="item">
                <div class="mc">截止时间：</div>
                <div class="c">{{detail.end_time}}</div>
              </div>
              <div class="item">
                <div class="mc">发布时间：</div>
                <div class="c">{{detail.created_at}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="xinxi">
          <div class="xh">
            <div class="sc"></div>
            <div class="t">任务描述</div>
          </div>
          <div v-html="detail.message">

          </div>
        </div>
        <div class="xinxi">
          <div class="xh">
            <div class="sc"></div>
            <div class="t">合同信息</div>
          </div>
          <div v-html="detail.contract">

          </div>
          <div style="height:60px;"></div>
        </div>
        <div class="btn">
          <el-button class="tg" type="success" @click="taskAudit(detail.id,1)" v-if="detail.audit_ret==3">审核通过</el-button>
          <el-button class="jj" type="danger" @click="taskAudit(detail.id,2)" v-if="detail.audit_ret==3">拒绝通过</el-button>
          <el-button class="jj" type="success" v-if="detail.audit_ret==1">已审核通过</el-button>
          <el-button class="jj" type="danger" v-if="detail.audit_ret==2">已拒绝审核</el-button>
        </div>
      </div>

    </el-dialog>

    <!-- 报名人员弹窗 -->
    <el-dialog title="报名人员" :visible.sync="signVisible" width="700px" :center="true" :close-on-click-modal="false">

      <el-table :data="signData">
        <el-table-column property="nickname" label="名字" align="center" header-align="center"></el-table-column>
        <el-table-column property="name" label="logo" align="center" header-align="center">
          <template slot-scope="scope">
            <img :src="scope.row.ulogo" width="40" height="40">
          </template>
        </el-table-column>
        <el-table-column property="name" label="签名" align="center" header-align="center">
          <template slot-scope="scope">
            <div class="demo-image__preview">
              <el-image style="width: 60px; height: 60px" :src="scope.row.contract_img" @click="scope.row.contract_img"
                :preview-src-list="scope.row.contract_big_img">
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="phone" label="手机" width="150" align="center" header-align="center"></el-table-column>
        <el-table-column label="操作" align="center" header-align="center">
          <template slot-scope="scope">

            <div v-if="scope.row.status!=3">
              <el-button size="mini" type="text">已同意</el-button>
            </div>
            <div v-if="scope.row.status==3">
              <el-button size="mini" type="text">等待企业同意</el-button>

            </div>
          </template>
        </el-table-column>
      </el-table>

    </el-dialog>
    <!-- 订单弹窗 -->
    <el-dialog :title="orderTitle" :visible.sync="orderVisible" width="900px" :center="true" :close-on-click-modal="false">

      <el-radio-group v-model="orderStatus" size="mini" @change="orderStatusChange">
        <el-radio-button label="0">全部</el-radio-button>
        <el-radio-button label="1">工作中</el-radio-button>
        <el-radio-button label="2">待验收</el-radio-button>
        <el-radio-button label="3">待结款</el-radio-button>
        <el-radio-button label="4">已完成</el-radio-button>
      </el-radio-group>
      <el-table :data="orderData" class="mt15" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column property="nickname" label="名字" width="150" align="center" header-align="center"></el-table-column>
        <el-table-column property="name" label="logo" width="100" align="center" header-align="center">
          <template slot-scope="scope">
            <img :src="scope.row.ulogo" width="40" height="40">
          </template>
        </el-table-column>
        <el-table-column property="phone" label="用户手机" width="120" align="center" header-align="center"></el-table-column>
        <el-table-column property="money" label="金额" width="150" align="center" header-align="center"></el-table-column>
        <el-table-column property="created_at" label="开始时间" width="150" align="center" header-align="center"></el-table-column>
        <el-table-column label="状态" align="center" header-align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.status==1">
              <el-button size="mini" type="text">工作中</el-button>
            </div>
            <div v-if="scope.row.status==2">
              <el-button size="mini" type="warning">待验收</el-button>
            </div>
            <div v-if="scope.row.status==3">
              <el-button size="mini" type="success">结款</el-button>
            </div>
            <div v-if="scope.row.status==4">
              <el-button size="mini" type="text">已结款</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 导出信息弹窗 -->
    <el-dialog :title="exportTitle" :visible.sync="exportShow" width="30%" :center="true" :close-on-click-modal="false">
      <el-form class="mt15" :status-icon="true" :model="export_form"  ref="form" label-width="120px"
        label-position="right" style="padding: 30px;">
        <el-form-item label="订单用户:" prop="money">
          <el-radio-group v-model="export_form.uid">
            <el-radio :label='v.uid' v-for="(v,i) in orderData" :key="i">{{v.nickname}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="导出类型:" prop="password">
          <el-radio-group v-model="export_form.type">
            <el-radio :label='1'>订单信息</el-radio>
            <el-radio :label='2'>企业信息</el-radio>
            <el-radio :label='3'>用户信息</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="exportFrom">导 出</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "App",
    data() {
      return {
        exportTitle : '',
        exportShow : false,
        signVisible: false,
        orderVisible: false,
        detailVisible: false,
        orderData: [],
        signData: [],
        orderTitle: '任务订单',
        orderStatus: "0",
        nowTaskId: '',
        multipleSelection: [],
        detail: {},
        export_form : {
          type : 1,
          order_id : 0,
          uid : 0,
          enterprise_id : 0,
        },
        search: {
          status: '0',
          audit_ret: '0',
          begin_time: '',
          end_time: '',
          is_specified_people: '0',
          enterprise_id: 0,
          limit: 10,
          page: 1,
        },
        date_time: "",
        value: 0,
        options: [1],
        total: 1000,
        loading: true,
        tableData: [],
        enterpriseList: [],
        isExport:false,
      };
    },
    created() {
      this.loadData({});
      this.getEnterpirseList()
    },
    mounted() {},
    methods: {
      exportFrom(){
        let self = this
        if( self.isExport )
        {
          self.$message.error("正在生成中，请稍等...")
          return
        }
        self.isExport = true
        self.$api.post('admin/export_pdf', self.export_form, res => {
          if( res.data.bol )
          {
            self.isExport = false
            self.$message.success(res.data.msg)
            window.open(res.data.data.path, "_blank");
          }else{
            self.$message.error(res.data.msg)
            return
          }
        });
      },
      exportInfo(index) {
        let data = this.tableData[index]
        this.$api.get('admin/order/list', {
          task_id: data.id,
          status: 4
        }, res => {
          if (res.data.bol) {
            this.orderData = res.data.data.list
            this.export_form.uid= res.data.data.list[0].uid
            this.export_form.enterprise_id=res.data.data.list[0].enterprise_id
            this.export_form.order_id = res.data.data.list[0].id
            this.exportShow = true
            this.exportTitle = data.title + "订单信息导出"
            console.log(res.data.data)
          }
        });
      },
      getDetail(id) {
        this.$api.get('admin/task_detail', {
          id: id
        }, res => {
          if (res.data.bol) {
            this.detailVisible = true;
            this.detail = res.data.data
          }
        });
        this.detailVisible = true
      },
      timeChange(e) {
        if (e == null) {
          this.search.begin_time = ''
          this.search.end_time = ''
        } else {
          this.date_time = e
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      orderSelectAll(s) {
        console.log(s)
      },
      orderStatusChange(status) {
        this.showOrder(this.nowTaskId, status)
      },

      editOrder(status, orderNo = '') {
        if (orderNo == '') {
          orderNo = [];
          this.multipleSelection.forEach((item, index) => {
            orderNo[index] = item.order_no
          })

        }
        let msg = '';
        if (status == 3) {
          msg = '确定要验收完成么？ 此操作代表认可他的工作！';
        }

        if (status == 4) {
          msg = '确定要打款么？此操作代表要将工作款打给他！';
        }

        this.$confirm(msg, '提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.post('enterprise/task/edit_order', {
            order_no: orderNo,
            status: status
          }, res => {
            if (res.data.bol) {
              this.$message.success(res.data.msg)
              this.orderStatus = "0"
              this.showOrder(this.nowTaskId, this.orderStatus)
            } else {
              this.$message.error(res.data.msg)
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });

      },
      //显示订单
      showOrder(taskId, status) {
        this.$api.get('admin/order/list', {
          task_id: taskId,
          status: status
        }, res => {
          if (res.data.bol) {
            if (res.data.data.total > 0) {
              this.orderVisible = true;
              this.orderTitle = res.data.data.list[0].title + '待处理订单信息'
              this.nowTaskId = res.data.data.list[0].task_id;
              this.orderData = res.data.data.list
              this.orderStatus = status
            } else {
              this.$message.error('暂无信息');
              this.orderData = [];
            }
          }
        });
      },
      //显示报名
      showSign(id, status) {
        let self = this;
        let data = {
          id: id,
          status: status
        };
        this.$api.get('/admin/task_sign', data, res => {
          let data = res.data.data;
          if (data.total <= 0) {
            this.$message.error('暂无报名');
            self.signVisible = false;
          } else {
            self.signData = data.list;
            self.signVisible = true;
          }
        })
      },
      loadData() {
        this.$api.get('admin/task_list', this.search, res => {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
          this.loading = false
        });
      },
      getEnterpirseList() {
        this.$api.get("admin/enterprise/list", {
          page: 1,
          limit: 1000
        }, res => {
          this.enterpriseList = res.data.data.list
        })
      },
      dateRes(date) {
        var d = new Date(date);
        var resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() +
          ':' + d.getSeconds();
        return resDate;
      },
      searchBtn() {
        this.search.begin_time = this.date_time[0],
          this.search.end_time = this.date_time[1],
          this.search.page = 1
        this.loadData()
      },
      editTaskOrder(id, index) {
        this.$prompt('请输入顺序，越小越靠前', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[\d]+?/,
          inputErrorMessage: '只能是数字'
        }).then(({
          value
        }) => {
          this.$api.post('admin/task_edit', {
            id: id,
            order: value
          }, res => {
            if (res.data.bol) {
              this.tableData[index].order = value
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },

      handleClick(row) {
        console.log(row);
      },
      taskAudit(id, audit_ret) {
        let msg = '';
        if (audit_ret == 1) {
          msg = '确认要完成审核么？此操作后该任务将公开由用户接单了！！！';
        } else {
          msg = '确认要拒绝审核么？此操作后该任务将由发布企业重新编辑！！！';
        }
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.post('/admin/task_audit', {
            id: id,
            audit_ret: audit_ret
          }, res => {
            if (res.data.bol) {
              this.$message.success(res.data.msg);
              this.detailVisible = false;
              this.loadData();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }).catch(() => {});
      },
      del(id, status) {
        console.log(status)
        let msg = '';
        switch (status) {
          case 1:
            // statements_1
            msg = '确认要上架么？ ';
            break;
          case 2:
            msg = '确认要下架么？ 下架后用户将不可报名该任务！！！';
            break;
          case 10:
            msg = '确认删除该任务么？ ';
            break;
          default:
            msg = '确认要上架么？ ';
            // statements_def
            break;
        }

        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var url = ''
          if (status == 10) {
            url = '/admin/task_del'
          } else {
            url = '/admin/task_status'
          }
          this.$api.post(url, {
            id: id,
            status: status
          }, res => {
            if (res.data.bol) {
              this.$message.success(res.data.msg);
              this.loadData({});
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }).catch((e) => {
          console.log(e)
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      pageChange(e) {
        this.search.page = e;
        this.loadData();
      },
      reload() {
        this.search = {
          status: '0',
          audit_ret: '0',
          begin_time: '',
          end_time: '',
          is_specified_people: '0',
          enterprise_id: 0,
          limit: 10,
          page: 1,
        }
        this.date_time = ''
        this.loading = true
        this.loadData()
      }
    }
  };
</script>

<style>
  .header {
    height: 200px;
  }

  .header img {
    width: 100%;
    height: 100%;
  }

  .box {
    background: #f6f6f6;
  }

  .diqu {
    margin-left: 10px;
  }

  .task-info {
    display: flex;
    padding: 10px 0;
  }

  h3 {
    padding: 10px;
    margin: 0;
  }

  .xinxi {
    margin-top: 15px;
    padding: 15px;
  }

  .xinxi .xh {
    display: flex;
  }

  .xinxi .t {
    font-size: 18px;
    line-height: 33px;
    margin-left: 10px
  }

  .xinxi .sc {
    width: 6px;
    height: 30px;
    background: #f60;
    border-radius: 10px;
  }

  .title-box,
  .xinxi {
    background: #fff;
  }

  .xinxi-box {
    margin-top: 30px;
  }

  .xinxi-box .item {
    display: flex;
    justify-content: start;
    align-items: center;
    font-size: 16px;
    margin-top: 15px;
  }

  .xinxi-box .item .mc {
    color: #888;
  }

  .title-box h3 {
    font-size: 24px;
    font-weight: bold
  }

  .el-dialog__body {
    padding: 0 !important;
    height: 500px;
    overflow: auto;
  }

  .box {
    position: relative;
  }

  .el-dialog {
    position: relative !important;
  }

  .box .btn {
    display: flex;
    position: fixed;
    justify-content: center;
    width: 375px;
    bottom: 20px;
    left: 50%;
    margin-left: -200px;
  }
</style>
