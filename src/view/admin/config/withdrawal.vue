<template>
  <div>
    <div style="margin-left:50px;">
      <h3>{{ page_title }}</h3>
    </div>
    <div>
      <el-form class="mt15" size="small" :status-icon="true" :model="form" :rules="rules" ref="form" label-width="120px"
        label-position="right">
        <el-form-item label="前置机用户名" prop="admin_name">
          <el-row>
            <el-col :span="8">
              <el-input v-model="form.admin_name" placeholder="请输入用户名" clearable></el-input>

            </el-col>
          </el-row>
          <div class="form-item-message mt15" style="border-radius: 5px;">
            前置机用名：公司设置的前置机的用户名 例：星米科技3，此参数错误无法提现，
          </div>
        </el-form-item>
        <el-form-item label="提现卡号" prop="bank_no">
          <el-row>
            <el-col :span="8">
              <el-input v-model="form.bank_no" placeholder="请输入提现卡号" clearable></el-input>

            </el-col>
          </el-row>
          <div class="form-item-message mt15" style="border-radius: 5px;">
            用户提现转账使用，从哪个卡里转出钱，必须是该公司下的招商银行卡号，谨慎设置
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">立即提交</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "App",
    data() {
      return {
        page_title: '提现设置',
        form: {
          admin_name : '',
          bank_no : ''
        },
        detail: {},
        rules: {
          admin_name: [{
            required: true,
            message: "请输入前置机用户名",
            trigger: "blur"
          }, ],
          bank_no: [{
            required: true,
            message: "请输入卡号",
            trigger: "blur"
          }, ],
        }
      };
    },

    created() {
      this.loadConfig();
    },
    methods: {
      loadConfig() {
        let self = this;
        self.$api.get('/admin/get_config', {
          status: 1
        }, res => {
          self.form = res.data.data;
        });
      },
      dateRes() {
        var d = new Date(this.form.end_time);
        var resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() +
          ':' + d.getSeconds();
        return resDate;
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let self = this;
            this.$api.post('admin/edit_withdraw', this.form, res => {
              if (res.data.bol) {
                this.$message.success(res.data.msg);
                setTimeout(() => {
                  self.loadConfig();
                }, 1500);
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
      setContent(content) {
        this.form.content = content
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>

<style>
  body {
    background: #f1f1f1;
  }

  .form-item-message {
    margin-left: 10px;
    background-color: #666;
    padding: 0 15px;
    border-radius: 25px;
    color: #fff;
    font-weight: bold;
  }
</style>
