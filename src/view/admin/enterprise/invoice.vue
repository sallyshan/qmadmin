<template>
  <div>
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <a href="/">发票管理</a>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <div class="mt15"></div>
    <el-form :inline="true" size="small" :model="search" class="demo-form-inline">
      <el-form-item label="时间">
        <el-date-picker v-model="date_time" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item label="企业">
        <el-autocomplete class="inline-input" clearable placeholder="请选择企业" v-model="state1" :fetch-suggestions="querySearch"
          @select="handleSelect"></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBtn">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="reload" size="mini">刷新</el-button>
      </el-form-item>
    </el-form>
    <el-table size="small" :data="tableData" border style v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="expand" width="55" align="center">
        <template slot-scope="scope">
          <h3 style="color:#f60">抬头信息</h3>
          <el-form :inline="true" size="mini" class="demo-form-inline">
            <el-form-item label="发票抬头:">
              <div style="color:#000; font-weight: bold;">{{scope.row.enterprise_data.header}}</div>
            </el-form-item>
            <el-form-item label="发票性质:">
              <div style="color:#000; font-weight: bold;">企业</div>
            </el-form-item>
            <el-form-item label="发票类型:">
              <div style="color:#000; font-weight: bold;">{{scope.row.enterprise_data.invoice_type}}</div>
            </el-form-item>
            <el-form-item label="税务登记号:">
              <div style="color:#000; font-weight: bold;">{{scope.row.enterprise_data.tax_num}}</div>
            </el-form-item>
            <el-form-item label="开户银行名称">
              <div style="color:#000; font-weight: bold;">{{scope.row.enterprise_data.bank}}</div>
            </el-form-item>
            <el-form-item label="开户银行卡号 ">
              <div style="color:#000; font-weight: bold;">{{scope.row.enterprise_data.bank_name}}</div>
            </el-form-item>
            <el-form-item label="注册地址 ">
              <div style="color:#000; font-weight: bold;">{{scope.row.enterprise_data.address}}</div>
            </el-form-item>
            <el-form-item label="注册电话 ">
              <div style="color:#000; font-weight: bold;">{{scope.row.enterprise_data.phone}}</div>
            </el-form-item>
          </el-form>
          <h3 style="color:#f60">支付信息</h3>
          <el-table size="mini" :data="scope.row.detail" border :row-class-name="tableRowClassName">
            <el-table-column prop="money" label="金额" align="center" header-align="center"></el-table-column>
            <el-table-column label="类型" align="center" header-align="center">
              <template slot-scope="s">
                <div v-if="s.row.pay_type==1">微信</div>
                <div v-if="s.row.pay_type==2">支付宝</div>
                <div v-if="s.row.pay_type==3">招行</div>
                <div v-if="s.row.pay_type==4">后台管理充值</div>
              </template>
            </el-table-column>
            <el-table-column prop="pay_time" label="支付时间" align="center" header-align="center"></el-table-column>
            <el-table-column prop="order_no" label="支付订单号" align="center" header-align="center"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="编号" width="60" align="center" header-align="center"></el-table-column>
      <el-table-column prop="enterprise_name" label="企业名称" align="center" header-align="center"></el-table-column>
      <el-table-column prop="money" label="金额" align="center" header-align="center">

      </el-table-column>

      </el-table-column>
      <el-table-column prop="enterprise_data.email" label="邮箱地址" align="center" header-align="center">
      </el-table-column>
      <el-table-column label="快递信息" align="center">
        <template slot-scope="scope">
          <div>地址：{{scope.row.enterprise_data.courier_address}}</div>
          <div>联系人：{{scope.row.enterprise_data.contact}}</div>
          <div>联系电话：{{scope.row.enterprise_data.contact_phone}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="记录时间" align="center" header-align="center">
      </el-table-column>
      <el-table-column fixed="right" label="状态" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.invoice_status == 3" style="color:#f60">待处理</div>
          <div v-if="scope.row.invoice_status == 2" style="color:#ff0">处理失败</div>
          <div v-if="scope.row.invoice_status == 1" style="color:#8CC5FF">已处理</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100" height="200">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.invoice_status==3" size="mini" @click="showDialog(scope.$index)">处理请求</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt15">
      <el-pagination layout="prev, pager, next" :total="total" :page-size="search.limit" :current-page='search.page'
        @current-change="pageChange" :background="true"></el-pagination>
    </div>
    <el-dialog title="发票申请确认" :visible.sync="invoice_show" width="40%">
      <el-form size="mini" :model="search" class=" mt15">
        <el-form-item label="发票抬头 :">
          {{info.header}}
        </el-form-item>
        <el-form-item label="发票性质 :">
          企业
        </el-form-item>
        <el-form-item label="发票类型 :">
          {{info.invoice_type}}
        </el-form-item>
        <el-form-item label="税务登记证号 :">
          {{info.tax_num}}
        </el-form-item>
        <el-form-item label="开户银行名称 :">
          {{info.bank}}
        </el-form-item>
        <el-form-item label="基本开户账号 :">
          {{info.bank_num}}
        </el-form-item>
        <el-form-item label="注册场所地址 :">
          {{info.address}}
        </el-form-item>
        <el-form-item label="注册固定电话 :">
          {{info.phone}}
        </el-form-item>
        <el-form-item label="电子票邮箱 :">
          {{info.email}}
        </el-form-item>
        <el-form-item label="邮寄信息 :">
          {{info.courier_address}} - 联系人: {{info.contact}} - 联系电话 :{{info.contact_phone}}
        </el-form-item>
        <el-form-item label="处理结果 :">
          <el-radio-group v-model="dealInvoiceFrom.type">
            <el-radio :label='1'>已发送邮件</el-radio>
            <el-radio :label='2'>已发送快递</el-radio>
            <el-radio :label='3'>发送邮件并发送快递</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dealInvoice">处理发票申请</el-button>
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
        info: {},
        invoice_show: false,
        restaurants: [],
        state1: '',
        search: {
          limit: 10,
          page: 1,
          begin_time: '',
          end_time: '',
          enterprise_id: 0,
        },
        dealInvoiceFrom:{
          id:0,
          type:3
        },
        date_time: "",
        value: 0,
        options: [1],
        total: 1000,
        loading: true,
        tableData: [],
        multipleSelection: [],
        showBtn: '0'
      };
    },
    created() {
      this.loadData();
    },
    mounted() {
      this.restaurants = this.loadAll();
    },
    methods: {
      showDialog(index) {
        this.info = this.tableData[index].enterprise_data
        this.dealInvoiceFrom.id=this.tableData[index].id
        this.invoice_show = true
      },
      dealInvoice(){
        let self = this
        this.$api.post('admin/invoice/deal', this.dealInvoiceFrom, res=>{
          if (res.data.bol ){
            self.invoice_show = false
            self.$message.success(res.data.msg)
            self.loadData()
          }else{
            self.$message.error(res.data.msg)
          }
        });
      },
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadAll() {
        var arrList = []
        this.$api.get('admin/enterprise/list', {
          page: 1,
          limit: 2000
        }, res => {
          let list = res.data.data.list


          for (let v of list) {
            let l = v
            l.value = v.enterprise_name
            console.log(l)
            arrList.push(l)
          }

        });
        return arrList;
      },
      handleSelect(item) {
        this.search.enterprise_id = item.id
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      loadData() {
        this.$api.get('admin/invoice/list', this.search, res => {
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
        this.search.begin_time = this.date_time[0],
          this.search.end_time = this.date_time[1],
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
        this.search = {
          limit: 10,
          page: 1,
          begin_time: '',
          end_time: ''
        }
        this.date_time = ''
        console.log(this.search)
        this.loadData();
      }
    }
  };
</script>

<style>
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
