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
        size="small"
        class="mt15"
        :status-icon="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px"
        label-position="right"
      >

        <el-form-item label="行为名称" prop="name">
            <el-col :span="8">
                <el-input v-model="form.name"></el-input>
            </el-col>
        </el-form-item>
         <el-form-item label="行为链接" prop="link">
            <el-col :span="8">
                <el-input v-model="form.link"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="行为icon" v-if="form.pid == 0 ">
            <el-col :span="8">  
                <el-input v-model="form.icon"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="上级行为" prop="pid">
          <el-select v-model="form.pid" placeholder="请选择任务一级分类">
            <el-option label="一级行为" :value="0"></el-option>
            <el-option v-for="(v,i) in behavior_list" :label="v.name" :value="v.id" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行为状态">
          <el-switch v-model="form.status" active-text="启用" inactive-text="停用" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item label="行为顺序" prop="order">
            <el-col :span="8">
                <el-input v-model="form.order" type="number"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">立即创建</el-button>
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
      page_title:'添加行为',
      form: {
        id    : '',
        name  : '',
        link  : '',
        pid   : 0,
        roles : [],
        status: 1,
        icon : '',
        order : 99
      },
      detail : {},
      behavior_list:[],
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
        link: [
          { required: true, message: "请输入链接", trigger: "blur" },
        ],
        pid : [
            { required : true, message : '请选择分类', trigger : "blur"}
        ],
        order : [
            { required : true, message : '请选择顺序', trigger : "blur"}
        ]
      }
    };
  },

  created () {
     let id = this.$route.query.id;
        if( id )
        {
            this.page_title = '编辑行为';
            this.$api.get('/admin/behavior/detail', { id : id }, res => {
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
          this.$api.post('admin/behavior/edit', this.form, res=>{
            if(res.data.bol)
            {
              this.$message.success(res.data.msg);
              setTimeout(() => {
                this.$router.push('/admin/behavior/list')
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
