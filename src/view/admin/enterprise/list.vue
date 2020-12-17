<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="/">企业列表</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <div class="mt15"></div>
    <el-form :inline="true" :model="search" size="mini" class="demo-form-inline">
      <el-form-item label="时间">
        <el-date-picker v-model="date_time" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="search.audit_ret" placeholder="请选择">
          <el-option label="全部" :value="0"></el-option>
          <el-option label="认证中" :value="4"></el-option>
          <el-option label="未认证" :value="2"></el-option>
          <el-option label="认证失败" :value="3"></el-option>
          <el-option label="认证成功" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="search.phone"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="searchBtn">查询</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <el-form-item label="">
        <el-button type="primary" size="mini" @click="$router.push('/admin/enterprise/add')">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="searchBtn" size="mini">刷新</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border style size="mini" v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="id" label="编号" width="60" align="center" header-align="center"></el-table-column>
      <el-table-column prop="enterprise_name" label="企业名称" width="180" align="center" header-align="center"></el-table-column>
      <el-table-column prop="phone" label="联系电话" align="center" width="120" header-align="center"></el-table-column>
      <el-table-column label="绑定人才" width="80" prop="bind_user_count" align="center" header-align="center">
        <template slot-scope="scope">
          <el-button type="text">{{scope.row.bind_user_count}}个</el-button>
        </template>
      </el-table-column>
      <el-table-column label="任务数量" align="center" width="80" header-align="center">
        <template slot-scope="scope">
          <el-button type="text">{{scope.row.task_count}}个</el-button>
        </template>
      </el-table-column>
      <el-table-column label="钱包余额" align="center" width="120" header-align="center">
        <template slot-scope="scope">
          <div>{{scope.row.can_money}}</div>
          <div>
            <el-button type="text" size="mini" @click="addMoney(scope.row.id, scope.$index)">充值</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="增值税信息" align="center" width="250" header-align="center">
        <template slot-scope="scope">
          <div>增值税起征点{{scope.row.vat_start_money}}</div>
          <div>增值税扣除比例{{scope.row.vat_proportion}}</div>
          <div>
            <el-button type="text" size="mini" @click="editVat(scope.$index)">修改</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="认证状态" align="center" width="100" header-align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.is_certification==1">
            <el-button size="mini" type="success">已认证</el-button>
          </div>
          <div v-if="scope.row.is_certification==2">
            <el-button size="mini" type="info">未认证</el-button>
          </div>
          <div v-if="scope.row.is_certification==3">
            <el-button size="mini" type="danger">认证失败</el-button>
          </div>
          <div v-if="scope.row.is_certification==4">
            <el-button size="mini" type="primary">认证中</el-button>
          </div>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column prop="created_at" label="记录时间" width="150" align="center" header-align="center">
      </el-table-column>
      <el-table-column label="状态" width="150" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-color="#13ce66" active-text="启用" inactive-text="停用"
            :active-value="1" :inactive-value="2" @change="editStatus($event , scope.row.id)" inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" height="200">
        <template slot-scope="scope">
          <el-button type="text" size="mini">删除</el-button>
          <el-button type="text" size="mini" @click="$router.push({ path : '/admin/enterprise/add', query: { id : scope.row.id}})">编辑</el-button>
          <el-button type="text" size="mini" @click="getEnterpriseDetail(scope.row.id, scope.$index)">查看信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt15">
      <el-pagination layout="prev, pager, next" :total="total" :page-size="search.limit" :current-page='search.page'
        @current-change="pageChange" :background="true"></el-pagination>
    </div>
    <el-dialog :title="enterpriseTitle" :visible.sync="enterpriseShow" width="700px" :center="true"
      :close-on-click-modal="false">
      <el-form class="mt15" :status-icon="true" :model="enterprise" ref="form" label-width="120px" label-position="right">
        <el-form-item label="认证状态:">
          <div v-if="enterprise.is_certification==1" style="color:#85ce61">认证通过</div>
          <div v-if="enterprise.is_certification==2" style="color:#777">未认证</div>
          <div v-if="enterprise.is_certification==3" style="color:#f00">
            认证拒绝 - 原因 ： {{ enterprise.failure_why}}
          </div>
          <div v-if="enterprise.is_certification==4" style="color:#f60">认证中</div>
        </el-form-item>
        <el-form-item label="企业名称:">
          {{ enterprise.enterprise_name}}
        </el-form-item>
        <el-form-item label="手机:">
          {{ enterprise.phone}}
        </el-form-item>
        <el-form-item label="法人名称:">
          {{ enterprise.person_name}}
        </el-form-item>
        <el-form-item label="身份证号:">
          {{ enterprise.person_id_num}}
        </el-form-item>
        <el-form-item label="企业信用号:">
          {{ enterprise.credit_num}}
        </el-form-item>
        <el-form-item label="银行名称:">
          {{ enterprise.bank_name}}
        </el-form-item>
        <el-form-item label="银行卡号:">
          {{ enterprise.bank_num}}
        </el-form-item>
        <el-form-item label="支行名称:">
          {{ enterprise.bank_branch_name}}
        </el-form-item>
        </el-form-item>
        <el-form-item label="地区:">
          {{ enterprise.province}} - {{ enterprise.city}} - {{ enterprise.area}}
        </el-form-item>
        <el-form-item label="营业执照:">
          <el-col :span="11">
            <el-image :src="enterprise.license_photo" :preview-src-list="licenseList"></el-image>
          </el-col>
        </el-form-item>
        <el-form-item label="签署合同:">
          <el-col :span="8" v-for="(v, i ) in enterprise.contract_img " :key="i">
            <el-image :src="v" :preview-src-list="imgList"></el-image>
          </el-col>
        </el-form-item>
      </el-form>
      <div class="btn">
        <el-button class="tg" type="warning" @click="enterpriseAudit(enterprise.id,3)" v-if="enterprise.is_certification==1">退还重新编辑</el-button>
        <el-button class="tg" type="success" @click="enterpriseAudit(enterprise.id,1)" v-if="enterprise.is_certification==4">认证通过</el-button>
        <el-button class="jj" type="danger" @click="enterpriseAudit(enterprise.id,3)" v-if="enterprise.is_certification==4">拒绝认证</el-button>
        <el-button class="jj" type="success" v-if="enterprise.is_certification==1">已审核通过</el-button>
        <el-button class="jj" type="danger" v-if="enterprise.is_certification==3">已拒绝审核</el-button>
      </div>

    </el-dialog>
    <el-dialog :title="editVarTitle" :visible.sync="editVarShow" width="30%" :center="true" :close-on-click-modal="false">
      <el-form class="mt15" :status-icon="true" :model="edit_vat_form" ref="form" label-width="120px" label-position="right"
        style="padding: 30px;">
        <el-form-item label="起征点:">
          <el-input v-model="edit_vat_form.vat_start_money" type="number"></el-input>
        </el-form-item>
        <el-form-item label="扣除比例:">
          <el-input v-model="edit_vat_form.vat_proportion" type="number"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVarShow = false">取 消</el-button>
        <el-button type="primary" @click="editVatFrom">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="addMoneyTitle" :visible.sync="addMoneyShow" width="30%" :center="true" :close-on-click-modal="false">
      <el-form class="mt15" :status-icon="true" :model="add_money_form" :rules="money_rules" ref="form" label-width="120px"
        label-position="right" style="padding: 30px;">
        <el-form-item label="充值金额:" prop="money">
          <el-input v-model="add_money_form.money" type="number"></el-input>
        </el-form-item>
        <el-form-item label="充值密码:" prop="password">
          <el-input v-model="add_money_form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')" style="width: 100%;">充值</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "App",
    data() {
      return {
        imgList: [],
        licenseList: [],
        editVarTitle: '',
        editVarShow: false,
        addMoneyTitle: '',
        addMoneyShow: false,
        nowAddMoneyIndex: 0,
        enterpriseShow: false,
        enterpriseTitle: '',
        enterprise: {},
        nowAuditIndex: 0,
        edit_vat_form: {
          id: '',
          index: 0,
          vat_start_money: '',
          vat_proportion: ''
        },
        add_money_form: {
          id: 0,
          money: 0,
          password: 0
        },
        search: {
          status: "0",
          phone: '',
          audit_ret: 0,
          limit: 10,
          page: 1,
          begin_time: '',
          end_time: ''
        },
        date_time: "",
        value: 0,
        options: [1],
        total: 1000,
        loading: true,
        tableData: [],
        multipleSelection: [],
        money_rules: {
          money: [{
            required: true,
            message: "请输入金额",
            trigger: "blur"
          }, ],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: "blur"
          }],

        }
      };
    },
    created() {
      this.loadData({});
    },
    mounted() {},
    methods: {
      editVat(index) {
        let ent = this.tableData[index]
        this.editVarTitle = ent.enterprise_name + "增值税率修改"
        this.editVarShow = true
        this.edit_vat_form.id = ent.id
        this.edit_vat_form.vat_start_money = ent.vat_start_money
        this.edit_vat_form.vat_proportion = ent.vat_proportion
        this.edit_vat_form.index = index
        console.log(this.tableData[index])
      },
      editVatFrom() {

        if (this.edit_vat_form.id == 0 || this.edit_vat_form.index == 0) {
          this.$message.error('企业参数有误');
          return
        }
        if (this.edit_vat_form.vat_start_money == 0) {
          this.$message.error('企业起征点参数有误');
          return
        }
        if (this.edit_vat_form.vat_proportion == 0) {
          this.$message.error('企业扣除比例参数有误');
          return
        }
        let data = this.tableData[this.edit_vat_form.index]
        data.vat_start_money = this.edit_vat_form.vat_start_money
        data.vat_proportion = this.edit_vat_form.vat_proportion
        this.$api.post('admin/enterprise/edit', data, res => {
          if (res.data.bol) {
            this.$message.success(res.data.msg);
            this.loadData()
            this.editVarShow = false
          } else {
            this.$message.error(res.data.msg);
          }
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$api.post('admin/enterprise/add_money', this.add_money_form, res => {
              if (res.data.bol) {
                this.$message.success(res.data.msg);
                this.addMoneyShow = false
                this.tableData[this.nowAddMoneyIndex].can_money = (parseInt(this.tableData[this.nowAddMoneyIndex]
                  .can_money) + parseInt(this.add_money_form.money))
              } else {
                this.$message.error(res.data.msg);
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      addMoney(uid, index) {
        let enterpriseData = this.tableData[index].enterprise_name
        this.addMoneyTitle = enterpriseData + '充值'
        this.addMoneyShow = true
        this.add_money_form.id = uid
        this.add_money_form.money = ''
        this.add_money_form.password = ''
        this.nowAddMoneyIndex = index
      },
      enterpriseAudit(uid, audit_ret) {
        let why = '';
        let self = this;
        if (audit_ret == 3) {
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
            why = value
            self.$api.post('admin/enterprise/edit_audit', {
              id: uid,
              audit_ret: audit_ret,
              failure_why: why
            }, res => {
              if (res.data.bol) {
                self.$message.success(res.data.msg);
                self.getEnterpriseDetail(uid, this.nowAuditIndex)
              } else {
                self.$message.error(res.data.msg);
                self.enterpriseShow = false;
              }
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
        } else {
          this.$confirm('确定要认证通过么？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            self.$api.post('admin/enterprise/edit_audit', {
              id: uid,
              audit_ret: audit_ret,
              failure_why: why
            }, res => {
              if (res.data.bol) {
                self.$message.success(res.data.msg);
                self.getEnterpriseDetail(uid, this.nowAuditIndex)
              } else {
                self.$message.error(res.data.msg);
                self.userAudit = false;
              }
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }

      },
      getEnterpriseDetail(id, index) {
        this.nowAuditIndex = index;
        this.$api.get('/admin/enterprise/detail', {
          id: id
        }, res => {
          this.enterprise = res.data.data
          this.imgList = [];
          this.licenseList = [];
          console.log(this.enterprise.contract_img)
          this.enterprise.contract_img = this.enterprise.contract_img.split(',')
          console.log(this.enterprise.contract_img)
          for (let v of this.enterprise.contract_img) {
            this.imgList.push(v)
          }
          this.licenseList.push(this.enterprise.license_photo)
          this.enterpriseTitle = this.enterprise.enterprise_name;
          this.enterpriseShow = true;
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      editStatus(e, id) {
        this.$api.post('admin/behavior/edit_status', {
          id: id,
          status: e
        }, res => {
          if (res.data.bol) {
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        });
      },
      loadData() {
        this.$api.get('admin/enterprise/list', this.search, res => {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
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
        this.search.begin_time = this.date_time == null ? '' : this.date_time[0],
          this.search.end_time = this.date_time == null ? '' : this.date_time[1],
          this.loadData()
        this.search.page = 1
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
