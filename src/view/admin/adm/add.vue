<template>
  <div>
    <div  style="margin-left:50px;">
      <h3>{{ page_title }}</h3>
    </div>
    <div style="margin-left:50px;">
      <el-button size="mini" type="primary" @click="$router.go(-1)">返回</el-button>
    </div>
    <div>
      <el-form
        class="mt15" size="small"
        :status-icon="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px"
        label-position="right"
      >

        <el-form-item label="管理员名称" prop="nickname">
            <el-col :span="8">
                <el-input v-model="form.nickname" placeholder="请输入管理员名称" clearable></el-input>
            </el-col>
        </el-form-item>
         <el-form-item label="管理员账号" prop="phone">
            <el-col :span="8">
                <el-input v-model="form.phone" placeholder="请输入管理员账号" clearable></el-input>
                (登陆后台使用)
            </el-col>
        </el-form-item>
        <el-form-item label="登陆密码">
            <el-col :span="8">
                <el-input v-model="form.password" type="password" placeholder="请输入管理员密码" clearable show-password></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="确认密码">
            <el-col :span="8">
                <el-input v-model="form.com_password" type="password" placeholder="请输入确认密码" clearable show-password></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="发票通知:" prop="password">
          <el-radio-group v-model="form.is_invoice_notice" @change="noticeChange">
            <el-radio :label='1'>通知他</el-radio>
            <el-radio :label='2'>不通知</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="通知电话" v-if="showNoticePhone">
            <el-col :span="8">
                <el-input v-model="form.notice_phone" type="text" placeholder="请输入通知电话" clearable></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="所属角色" prop="pid">
          <el-checkbox-group  v-model="form.role" size="small">
            <el-checkbox v-for="(v,i) in role_list" :key="i" :label="v.id">{{v.name}}</el-checkbox>
          </el-checkbox-group>

        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" active-text="启用" inactive-text="停用" :active-value=1
    :inactive-value=2></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
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
      page_title:'添加管理员',
      showNoticePhone : false,
      form: {
        id    : '',
        nickname  : '',
        phone  : '',
        role : [],
        status: 1,
        password:'',
        com_password:'',
        is_invoice_notice:2,
        notice_phone : '',
      },
      detail : {},
      role_list:[],
      rules: {
        nickname: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入手机号当前登陆账号使用", trigger: "blur" },
        ],
        roles : [
            { required : true, message : '请选择角色', trigger : "blur"}
        ],
        status : [
            { required : true, message : '请选择状态', trigger : "blur"}
        ]
      }
    };
  },

  created () {
     let id = this.$route.query.id;
        if( id )
        {
            this.page_title = '编辑管理员';
            this.$api.get('/admin/admin/detail', { id : id }, res => {
                this.form = res.data.data
                if( this.form.is_invoice_notice == 1)
                {
                  this.showNoticePhone = true
                }
            });
        }
    let self = this;
    this.$api.get('/admin/role/list', { status : 1},res=>{
      self.role_list=res.data.data.list;
    });
  },
  methods: {
    noticeChange(e){
      if (e == 1) {
        this.showNoticePhone = true
      }else{
        this.showNoticePhone = false
      }
    },
    dateRes () {
        var d = new Date(this.form.end_time);
        var  resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        return resDate;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {

          if( this.form.id=='')
          {
            if(this.form.password == '' )
            {
              this.$message.error('添加管理员要指定登陆密码')
              return false;
            }
            if( this.form.com_password != this.form.password)
            {
              this.$message.error('两次密码不一致');
              return false;
            }
            delete this.form.id
          }
          if(this.form.is_invoice_notice == 1 && this.form.notice_phone == '')
          {
            this.$message.error("设置发票通知他，请输入一个通知电话");
            return false
          }
          if(!(/^1[3456789]\d{9}$/.test(this.form.notice_phone))){
                this.$message.error("手机号码有误，请重填");
                return false;
          }
          this.$api.post('admin/admin/edit', this.form, res=>{
            if(res.data.bol)
            {
              this.$message.success(res.data.msg);
              setTimeout(() => {
                this.$router.push('/admin/adm/list')
              }, 1500);
            }else{
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
</style>
