<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="/">人才列表</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-form :inline="true" size="mini" :model="search" class="demo-form-inline mt15">
      <el-form-item label="时间">
        <el-date-picker v-model="date_time" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="search.phone" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="name">
        <el-input v-model="search.name"></el-input>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="search.audit_ret" placeholder="请选择">
          <el-option label="全部" value="0"></el-option>
          <el-option label="审核成功" value="1"></el-option>
          <el-option label="审核失败" value="3"></el-option>
          <el-option label="未审核" value="2"></el-option>
          <el-option label="审核中" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBtn">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table size="mini" :data="tableData" border style v-loading="loading">
      <el-table-column prop="id" label="编号" fixed width="60" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="nickname" label="昵称" align="center" header-align="center"></el-table-column>
      <el-table-column fixed label="头像" align="center" header-align="center">
        <template slot-scope="scope">
          <div>
            <img :src="scope.row.logo" alt="" width="60" height="60">
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed prop="phone" label="手机" align="center" header-align="center"></el-table-column>
      <el-table-column fixed prop="user_wallet.can_money" label="钱包金额" align="center" header-align="center"></el-table-column>
      <el-table-column prop="created_at" label="记录时间" align="center" header-align="center">
      </el-table-column>
      <el-table-column label="绑定企业" fixed align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="getBindEnterprise(scope.row.id, scope.$index)">{{scope.row.bind_count}}个企业</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="" label="进行中任务" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="getOrder(scope.row.id, scope.$index)">{{scope.row.order_count}}个任务</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120" align="center" header-align="center">
        <template slot-scope="scope">
          <el-button type="success" v-if="scope.row.status==1" size="mini">正常</el-button>
          <el-button type="error" v-if="scope.row.status==2" size="mini">封禁</el-button>
          <el-button type="error" v-if="scope.row.status==10" size="mini">已删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="city" label="审核状态" width="120" align="center" header-align="center">
        <template slot-scope="scope">
          <el-button type="success" v-if="scope.row.is_certification==1" size="mini">审核成功</el-button>
          <el-button type="warning" v-if="scope.row.is_certification==3" size="mini">认证失败</el-button>
          <el-button type="danger" v-if="scope.row.is_certification==2" size="mini">未认证</el-button>
          <el-button type="primary" v-if="scope.row.is_certification==4" size="mini">认证中</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200" height="200">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="delUser(scope.row.id)">删除</el-button>
          <el-button type="text" size="mini" @click="getUserInfo(scope.row.id)">查看信息</el-button>
          <el-button type="text" size="mini" @click="getCertification(scope.row.id)">查看认证信息</el-button>
          <el-button type="text" size="mini" @click="gatherInfo(scope.row.id)">汇总信息</el-button>
          <el-button type="text" size="mini" @click="gatherInfoDetail(scope.row.id)">汇总信息明细</el-button>
          <!-- 认证成功才有下载 -->
          <el-button type="text" size="mini" v-if="scope.row.is_certification == 1" @click="downFile(scope.row.id)">下载文件</el-button>

        </template>
      </el-table-column>
    </el-table>
    <div class="mt15">
      <el-pagination layout="prev, pager, next" :total="total" :page-size="search.limit" :current-page='search.page' @current-change="pageChange"
        :background="true"></el-pagination>
    </div>
    <el-dialog :title="userTitle" :visible.sync="userVisible" width="700px" :center="true" :close-on-click-modal="false">
      <el-row>
        <el-col align="center">
          <div class="mt15">基本信息</div>

          <el-card class="mt15" align="center">
            <div class="user_info">
              <div class="item">
                <div class="left">昵称：</div>
                <div class="right">{{ user.nickname }}</div>
              </div>
              <div class="item">
                <div class="left">手机号：</div>
                <div class="right">{{ user.phone }}</div>
              </div>
            </div>
          </el-card>
          <div class="mt15">学校信息</div>
          <el-card class="mt15" align="center" v-for="(v ,i) in user.education_info" :key="i">
            <div class="user_info">
              <div class="item">
                <div class="left">学校：</div>
                <div class="right">{{ v.school_name }}</div>
              </div>
              <div class="item">
                <div class="left">学历：</div>
                <div class="right">{{ v.max_schooling}}</div>
              </div>
              <div class="item">
                <div class="left">专业：</div>
                <div class="right">{{ v.professional}}</div>
              </div>
              <div class="item">
                <div class="left">入学时间：</div>
                <div class="right">{{ v.begin_time}}</div>
              </div>
              <div class="item">
                <div class="left">毕业时间：</div>
                <div class="right">{{ v.end_time}}</div>
              </div>
            </div>
          </el-card>
          <div class="mt15">工作经历信息</div>
          <el-card class="mt15" align="center" v-for="(v ,i) in user.work_info" :key="i">
            <div class="user_info">
              <div class="item">
                <div class="left">公司名字：</div>
                <div class="right">{{ v.company_name }}</div>
              </div>
              <div class="item">
                <div class="left">行业：</div>
                <div class="right">{{ v.professional_name}}</div>
              </div>
              <div class="item">
                <div class="left">职业名称：</div>
                <div class="right">{{ v.department}}</div>
              </div>
              <div class="item">
                <div class="left">标签：</div>
                <div class="right">{{ v.label}}</div>
              </div>
              <div class="item">
                <div class="left">部门：</div>
                <div class="right">{{ v.department}}</div>
              </div>
              <div class="item">
                <div class="left">工作内容：</div>
                <div class="right">{{ v.content}}</div>
              </div>
              <div class="item">
                <div class="left">入职时间：</div>
                <div class="right">{{ v.begin_time}}</div>
              </div>
              <div class="item">
                <div class="left">离职时间：</div>
                <div class="right">{{ v.end_time}}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

    </el-dialog>
    <!-- 认证信息 -->
    <el-dialog :title="userTitle" :visible.sync="certificationShow" width="700px" :center="true" :close-on-click-modal="false">
      <el-form class="mt15" :status-icon="true" :model="user" ref="form" label-width="120px" label-position="right">
        <el-form-item label="认证状态:">
          <div v-if="user.is_certification==1" style="color:#85ce61">认证通过</div>
          <div v-if="user.is_certification==2" style="color:#777">未认证</div>
          <div v-if="user.is_certification==3" style="color:#f00">
            认证拒绝 - 原因 ： {{ user.failure_why}}
          </div>
          <div v-if="user.is_certification==4" style="color:#f60">认证中</div>
        </el-form-item>
        <el-form-item label="昵称:">
          {{ user.nickname}}
        </el-form-item>
        <el-form-item label="手机:">
          {{ user.phone}}
        </el-form-item>
        <el-form-item label="真实姓名:">
          {{ user.certification_info.name}}
        </el-form-item>

       <el-form-item label="手持身份证:">
         <el-col :span="11">
           <img class="id_logo" :src="user.certification_info.user_id_photo">
         </el-col>

       </el-form-item>
        <el-form-item label="身份证照片:">
          <el-col :span="11">
            <img class="id_logo" :src="user.certification_info.id_positive">
          </el-col>
          <el-col :span="11">
            <img class="id_logo" :src="user.certification_info.id_reverse">
          </el-col>
        </el-form-item>
        <el-form-item label="确认视频:">
          <video controls width="320" height="240" ref="videoSrc" :src="videoSrc" preload="none">
            <!-- <source :src="" type="video/mp4"> -->
          </video>
        </el-form-item>
      </el-form>
      <div class="btn">
        <el-button class="tg" type="warning" @click="userAudit(user.id,3)" v-if="user.is_certification==1">退还重新编辑</el-button>
        <el-button class="tg" type="success" @click="userAudit(user.id,1)" v-if="user.is_certification==4">认证通过</el-button>
        <el-button class="jj" type="danger" @click="userAudit(user.id,3)" v-if="user.is_certification==4">拒绝认证</el-button>
        <el-button class="jj" type="success" v-if="user.is_certification==1">已审核通过</el-button>
        <el-button class="jj" type="danger" v-if="user.is_certification==3">已拒绝审核</el-button>
      </div>

    </el-dialog>
    <!-- 订单信息 -->
    <el-dialog :title="orderTitle" :visible.sync="orderShow" width="920px" :center="true" :close-on-click-modal="false">
      <el-table :data="orderData" class="mt15">
        <el-table-column type="expand" v-if="">
          <template slot-scope="scope">
            <el-form label-position="left" v-if="scope.row.status==2" class="demo-table-expand">
              <el-form-item label="完成备注">
                <span>{{ scope.row.additional.note }}</span>
              </el-form-item>
              <el-form-item label="备注图片">
                <div v-for="(item, key) in scope.row.additional.images" :key="key" style="display:inline-block; padding: 3px;">
                  <el-image style="width: 100px; height: 100px" :src="item" :preview-src-list="scope.row.additional.images">
                  </el-image>
                </div>

              </el-form-item>
            </el-form>

          </template>
        </el-table-column>
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
              <el-button size="mini" type="text">进行中</el-button>
            </div>
            <div v-if="scope.row.status==2">
              <el-button size="mini" type="warning">待验收</el-button>
            </div>
            <div v-if="scope.row.status==3">
              <el-button size="mini" type="success">已结款</el-button>
            </div>
            <div v-if="scope.row.status==4">
              <el-button size="mini" type="text">已完成</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 企业信息 -->
    <el-dialog :title="enterpriseTitle" :visible.sync="enterpriseShow" width="750px" :center="true"
      :close-on-click-modal="false">
      <el-table :data="bind_enterprise_list">
        <el-table-column property="enterprise_name" label="公司名称" align="center" header-align="center"></el-table-column>
        <el-table-column label="公司logo" align="center" header-align="center">
          <template slot-scope="scope">
            <img :src="scope.row.logo" class="logo" style="width: 50px; height: 50px; border-radius: 50%;">
          </template>
        </el-table-column>
        <el-table-column property="created_at" label="申请时间" align="center" header-align="center"></el-table-column>
        <el-table-column label="当前绑定状态" align="center" header-align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.status==1">
              <el-button type="success" size="mini">已同意</el-button>
            </div>
            <div v-if="scope.row.status==2">
              <el-button type="success" size="mini">拒绝绑定</el-button>
            </div>
            <div v-if="scope.row.status==3">
              <el-button type="success" size="mini">申请中</el-button>
            </div>
            <div v-if="scope.row.status==4">
              <el-button type="warning" size="mini">企业解除<br>
                {{scope.row.updated_at}}</el-button>
            </div>
            <div v-if="scope.row.status==5">
              <el-button type="warning" size="mini">管理员解除 <br>
                {{scope.row.updated_at}}</el-button>
            </div>
            <div v-if="scope.row.status==6">
              <el-button type="warning" size="mini">
                用户自行解除 <br>
                {{scope.row.updated_at}}
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" header-align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.status==3">
              <el-button size="mini" type="success" @click="userBindEnterprise(scope.row.uid, scope.row.enterprise_id, scope.row.recommended_code,1, scope.$index)">同意</el-button>
              <el-button size="mini" type="danger" @click="userBindEnterprise(scope.row.uid, scope.row.enterprise_id, scope.row.recommended_code, 2,scope.$index)">拒绝</el-button>
            </div>
            <div v-if="scope.row.status==2">
              <el-button size="mini" type="danger" @click="userBindEnterprise(scope.row.uid, scope.row.enterprise_id, scope.row.recommended_code, 1,scope.$index)">重新绑定</el-button>
            </div>
            <div v-if="scope.row.status==1">
              <el-button size="mini" type="danger" @click="userBindEnterprise(scope.row.uid, scope.row.enterprise_id, scope.row.recommended_code, 2,scope.$index)">解除</el-button>

            </div>

          </template>
        </el-table-column>
      </el-table>
      <div class="mt15">
        <el-pagination layout="prev, pager, next" :total="orderTotal" :page-size="orderLimit" @current-change="orderPageChange"
          :background="true"></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        userTitle: '',
        orderTitle: '',
        orderShow: false,
        orderPage: 1,
        orderLimit: 3,
        orderTotal: 0,
        orderData: [],
        nowOrderUserIndex: 0,
        nowOrderUserId: 0,
        enterpriseTitle: '绑定企业详情',
        enterpriseShow: false,
        certificationShow: false,
        bind_enterprise_list: [],
        nowUserBindEnterpriseIndex: 0,
        user: {
          certification_info:{
            name : '',
            user_id_photo : '',
            id_positive : '',
            id_reverse :''
          }
        },
        userVisible: false,
        search: {
          status: '',
          phone: '',
          audit_ret: '0',
          name: '',
          limit: 10,
          page: 1,
        },
        date_time: '',
        value: 0,
        options: [1],
        videoSrc: '',
        total: 1000,
        loading: true,
        tableData: []
      }
    },
    created() {
      console.log(this.$store.state.Users.limit)
      this.$store.dispatch("cons", 1)
        console.log(this.$store.state.Users.limit)
      this.loadData()
    },
    mounted() {
      this.loading = false
    },
    methods: {
      delUser(id) {
        const self = this
        if (!id) {
          this.$message.error("未选择用户");
          return false;
        }
        self.$confirm("确定要删除用户么？", '提示', {
          type: "warning",
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...';
              self.$api.post("admin/user/del", {
                id: id
              }, res => {
                instance.confirmButtonLoading = false;
                done();
                self.loadData({})
                if (res.data.bol) {
                  this.$message.success(res.data.msg)
                } else {
                  this.$message.error(res.data.msg)
                }
              })

            } else {
              done()
            }
          }
        });
      },
      downFile(uid) {
        let url = 'http://api.qmve.com/admin/down_file?id=' + uid
        var a = document.createElement('a')
        a.setAttribute('href', url)
        a.setAttribute('target', '_blank')
        a.click()
      },
      getOrder(uid, index) {
        this.nowOrderUserId = uid
        this.nowOrderUserIndex = index
        this.$api.get('admin/order/list', {
          uid: uid,
          page: this.orderPage,
          limit: this.orderLimit
        }, res => {
          this.orderData = res.data.data.list
          this.orderTotal = res.data.data.total
          this.orderTitle = this.tableData[index].nickname + '的任务订单'
          this.orderShow = true
        })
      },
      // 绑定解除企业关系
      userBindEnterprise(uid, enterprise_id, code, status, index = 0) {
        console.log(index)
        let self = this
        let msg = status == 1 ? '确定要添加绑定关系么？' : '确定要解除他们之前的绑定关系么？'
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (status == 1) {
            self.$api.post('admin/user/bind_enterprise', {
              id: uid,
              code: code
            }, res => {
              if (res.data.bol) {
                self.$message.success(res.data.msg)
                self.getBindEnterprise(uid, self.nowUserBindEnterpriseIndex)
              } else {
                self.$message.error(res.data.msg)
              }
            })
          }

          if (status == 2) {
            self.$api.post('admin/user/remove_bind_enterprise', {
              uid: uid,
              enterprise_id: enterprise_id
            }, res => {
              console.log(res)
              if (res.data.bol) {
                self.$message.success(res.data.msg)
              } else {
                self.$message.error(res.data.msg)
              }
              self.getBindEnterprise(uid, self.nowUserBindEnterpriseIndex)
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      getBindEnterprise(uid, index) {
        this.nowUserBindEnterpriseIndex = index
        this.$api.get('admin/user/get_user_bind_enterprise', {
          uid: uid
        }, res => {
          this.bind_enterprise_list = res.data.data.list
          this.enterpriseTitle = this.tableData[index].nickname + '的绑定企业详情'
          this.enterpriseShow = true
        })
      },
      userAudit(uid, audit_ret) {
        let why = ''
        let self = this
        if (audit_ret == 3) {
          this.$prompt('请输入拒绝理由。。。', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: '请写下拒绝理由，让用户参考修改',
            inputValidator: function(str) {
              if (str == null) {
                return false
              }
              return true
            },
            inputErrorMessage: '拒绝审核，理由不可为空'
          }).then(({
            value
          }) => {
            why = value
            self.$api.post('admin/user/edit_audit', {
              id: uid,
              audit_ret: audit_ret,
              failure_why: why
            }, res => {
              if (res.data.bol) {
                self.$message.success(res.data.msg)
                self.userAudit = false
                self.getCertification(uid)
              } else {
                self.$message.error(res.data.msg)
                self.userAudit = false
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            })
          })
        } else {
          this.$confirm('确定要通过么？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            self.$api.post('admin/user/edit_audit', {
              id: uid,
              audit_ret: audit_ret,
              failure_why: why
            }, res => {
              if (res.data.bol) {
                self.$message.success(res.data.msg)
                self.userAudit = false
                self.getCertification(uid)
              } else {
                self.$message.error(res.data.msg)
                self.userAudit = false
              }
            })
          }).catch(() => {

          })
        }
      },
      getCertification(uid) {
        console.log(this.$refs.videoSrc)
        this.user = {}
        this.certificationShow = false
        this.$api.get('admin/user/getinfo', {
          uid: uid
        }, res => {
          this.$set(this, 'user', res.data.data)
          if (this.user.is_certification == 2) {
            this.$message.error("当前用户未提交认证")
          } else {
            this.videoSrc = this.user.certification_info.confirm_video
            this.userTitle = this.user.nickname
            this.certificationShow = true
          }
        })
      },
      getUserInfo(uid) {
        this.$api.get('admin/user/getinfo', {
          uid: uid
        }, res => {
          this.user = res.data.data
          this.userTitle = this.user.nickname,
            this.userVisible = true
        })
      },
      gatherInfo(uid) {
       let url = 'http://api.qmve.com/admin/gatherInfo?id=' + uid
        var a = document.createElement('a')
        a.setAttribute('href', url)
        a.setAttribute('target', '_blank')
        a.click()
      },
      gatherInfoDetail(uid) {
         let url = 'http://api.qmve.com/admin/gatherInfoDetail?id=' + uid
        var a = document.createElement('a')
        a.setAttribute('href', url)
        a.setAttribute('target', '_blank')
        a.click()
      },
      loadData() {
        this.$api.get('admin/user/list', this.search, res => {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
          this.loading = false
        })
      },
      downloadFile(uid) {
        this.$api.get('admin/down_file', {}, res => {

        })
      },
      dateRes(date) {
        var d = new Date(date)
        var resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() +
          ':' + d.getSeconds()
        return resDate
      },
      searchBtn() {
        this.search.begin_time = this.date_time == null ? '' : this.date_time[0],
        this.search.end_time = this.date_time == null ? '' : this.date_time[1],
        this.loadData(this.search)
        this.search.page = 1
      },
      handleClick(row) {
        console.log(row)
      },
      editBind(uid, status) {
        let data = {
          uid: uid,
          status: status
        }
        let msg = status == 1 ? '同意之后该人才即可领取发布的任务，确定这样操作么？' : '拒绝之后该人才再也不可领取发布的任务，确定这样操作么？'
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.post('/enterprise/edit_bind_user', data, res => {
            if (res.data.bol) {
              this.$message.success(res.data.msg)
              this.loadData()
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      orderPageChange(e) {
        this.orderPage = e
        this.getOrder(this.nowOrderUserId, this.nowOrderUserIndex)
      },
      pageChange(e) {
        this.search.page = e
        this.loadData()
      },
      reload() {
        this.loadData()
      }
    }
  }
</script>

<style>
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

  video {
    width: 100%;
    height: 300px;
  }

  .id_logo {
    width: 100%;
    height: 100%
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
  .logo{
	  width: 50px; height: 50px; border-radius: 50%;
  }
</style>
