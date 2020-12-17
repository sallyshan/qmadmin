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
        class="mt15"
        :status-icon="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px"
        label-position="right"
      >
      
        <el-form-item label="企业名称" prop="enterprise_name">
            <el-col :span="8">
                <el-input v-model="form.enterprise_name"></el-input>
            </el-col>
        </el-form-item>
         <el-form-item label="联系电话" prop="phone">
            <el-col :span="8">
                <el-input v-model="form.phone"></el-input>
                （做为登陆账号使用）
            </el-col>
        </el-form-item>
         <el-form-item label="法人名称" prop="person_name">
            <el-col :span="8">
                <el-input v-model="form.person_name"></el-input>
            </el-col>
        </el-form-item>
         <el-form-item label="登陆密码" prop="password">
            <el-col :span="8">
                <el-input v-model="form.password"></el-input>
            </el-col>
        </el-form-item>
         <el-form-item label="确认密码" prop="com_password">
            <el-col :span="8">
                <el-input v-model="form.com_password"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="企业状态">
          <el-switch v-model="form.status" active-text="启用" inactive-text="停用" :active-value="1" :inactive-value='2'></el-switch>
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
      page_title:'添加企业',
      form: {
        id    : '',
        enterprise_name  : '',
        person_name  : '',
        phone   : '',
        password   : '',
        com_password   : '',
        status: 1
      },
      detail : {},
      behavior_list:[],
      rules: {
        enterprise_name: [
          { required: true, message: "请输入企业名称", trigger: "blur" },
        ],
        person_name: [
          { required: true, message: "请输入法人名称", trigger: "blur" },
        ],
        phone : [
            { required : true, message : '请输入手机号做为登陆使用', trigger : "blur"}
        ],
         password : [
            { required : true, message : '请输入密码', trigger : "blur"}
        ],
        com_password : [
            { required : true, message : '请输入确认密码', trigger : "blur"}
        ],
      }
    };
  },

  created () {
     let id = this.$route.query.id;
        if( id )
        {
            this.page_title = '编辑企业';
            this.$api.get('/admin/enterprise/detail', { id : id }, res => {
                this.form = res.data.data
            });
        }
    let self = this;
    this.$api.get('/admin/behavior/list', { pid : 0},res=>{
      self.behavior_list=res.data.data.list;
    });
  },
  methods: {
    dateRes () {
        var d = new Date(this.form.end_time);  
        var  resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds(); 
        return resDate;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api.post('admin/enterprise/edit', this.form, res=>{
            if(res.data.bol)
            {
              this.$message.success(res.data.msg);
              setTimeout(() => {
                this.$router.push('/admin/enterprise/list')
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
