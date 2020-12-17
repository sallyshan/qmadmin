<template>
  <div>
    <div  style="margin-left:50px;">
      <h3>{{ page_title }}</h3>
    </div>
    <div>
      <el-form
        class="mt15"
         size="small"
        :status-icon="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px"
        label-position="right"
      >

        <el-form-item label="项目总开关" prop="api_status">
              <div class="el-row--flex" style="align-items: center;">
                <el-switch v-model="form.api_status" active-text="开启" inactive-text="关闭" :active-value="1"
                :inactive-value="2"></el-switch>
                <div class="form-item-message">
                  (该设置为项目总开关，如果关闭，整个项目将无法访问)
                </div>
              </div>

        </el-form-item>
        <el-form-item label="客服电话" prop="service_phone">
           <el-row>
             <el-col :span="8">
                 <el-input v-model="form.service_phone" placeholder="请输入客服电话" clearable></el-input>

             </el-col>
           </el-row>
            <div class="form-item-message mt15" style="border-radius: 5px;">
                设置客服电话，用户可联系此电话
            </div>
        </el-form-item>
         <el-form-item label="用户提现比例" prop="user_extract_proportion">
           <el-row>
             <el-col :span="8">
                 <el-input v-model="form.user_extract_proportion" placeholder="请输入一个数值" max="100" type="number" clearable></el-input>

             </el-col>
           </el-row>
            <div class="form-item-message mt15" style="border-radius: 5px;">
                该设置用户提现比例,举例：此设置为85，那么用户提现100元将得到85元，也就是85%的意思，
                最大值100；
            </div>
        </el-form-item>
        </el-form-item>
         <el-form-item label="用户提现类型" prop="user_extract_proportion">
           <el-row>
             <el-col :span="8">
                 <el-select v-model="form.extract_type" placeholder="请选择类型" style="z-index:111111111">
                   <el-option label="全部" :value="3"></el-option>
                   <el-option label="支付宝" :value="1"></el-option>
                   <el-option label="银行卡" :value="2"></el-option>
                 </el-select>
             </el-col>
           </el-row>
            <div class="form-item-message mt15" style="border-radius: 5px;">
                该设置用户提现类型,举例：此设置为支付宝，那么用户提现就只能选择支付宝
            </div>
        </el-form-item>
        <el-form-item
            :label="'用户身份' + (index+1)" v-for="(item , index) in form.user_identity" :key="index">
            <el-row>
              <el-col :span="8">
                  <el-input v-model="item.name" placeholder="请输入用户身份"></el-input>
              </el-col>
              <el-col :span="2">拍摄时说：</el-col>
              <el-col :span="8">
                  <el-input v-model="item.see" placeholder="请输入用户拍摄视频时说的话"></el-input>
              </el-col>
              <el-col :span="2" >
                  <el-button @click="delIdentity(index)">删除身份</el-button>
              </el-col>
              <el-col :span="2" v-if="index == (form.user_identity.length - 1)">
                  <el-button @click="addIdentity">增加身份</el-button>
              </el-col>
            </el-row>

        </el-form-item>
        <el-form-item
            label="身份设置说明">
              <div class="form-item-message mt15" style="border-radius: 5px;">
                  该设置用户提现比例,举例：此设置为85，那么用户提现100元将得到85元，也就是85%的意思
              </div>
        </el-form-item>
        <el-form-item label="用户身份说明" align-items="center">
            <el-col :span="8">
                <editor :content="form.user_identity_message" :catchData="setContent" ref="basic" style="background:#fff;"></editor>
            </el-col>
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

  import editor from '@/components/WangEditor'
export default {
  components : {
    editor
  },
  name: "App",
  data() {
    return {
      page_title:'系统设置',
      form: {
        'api_status' : 1,
        'extract_type' : 3,
        'service_phone' : '',
        'user_identity' : [
          {
            'see' : '',
            name : '工商个体户',
          }
        ],
        'user_identity_message' : '',
        'user_extract_proportion' : 100,
        'user_default_logo' : '',
      },
      detail : {},
      role_list:[],
      rules: {
        api_status: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
        extract_type: [
          { required: true, message: "请输入手机号当前登陆账号使用", trigger: "blur" },
        ],
        user_identity_message : [
            { required : true, message : '请选择角色', trigger : "blur"}
        ],
        user_extract_proportion : [
            { required : true, message : '请给用户提现设置比例', trigger : "blur"}
        ],
        service_phone : [
            { required : true, message : '请设置客服电话', trigger : "blur"}
        ],
      }
    };
  },

  created () {
    this.loadConfig();
  },
  methods: {
    loadConfig ()
    {
      let self = this;
      self.$api.get('/admin/get_config', { status : 1},res=>{
        self.form = res.data.data;
        this.$refs.basic._data.editor.txt.html(this.form.user_identity_message)
      });
    },
    delIdentity(index)
    {
      if( this.form.user_identity.length <= 1 )
      {
        this.$message.error('最后保留一下身份');
        return false;
      }
      this.form.user_identity.splice(index,1)
    },
    addIdentity()
    {
      this.form.user_identity.push({
        name : '',
        see : '',
      })
    },
    dateRes () {
        var d = new Date(this.form.end_time);
        var  resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        return resDate;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let self = this;
          let basic = this.$refs.basic._data;
          this.form.user_identity_message = basic.editor.txt.html();
          this.form.user_identity = JSON.stringify(this.form.user_identity)
          this.$api.post('admin/edit_config', this.form, res=>{
            if(res.data.bol)
            {
              this.$message.success(res.data.msg);
              setTimeout(() => {
                self.loadConfig();
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
    setContent(content){
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
.form-item-message{margin-left: 10px;background-color: #666; padding: 0 15px; border-radius: 25px; color:#fff; font-weight: bold;}
</style>
