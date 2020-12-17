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

        <el-form-item label="标题" prop="title">
            <el-col :span="8">
                <el-input v-model="form.title"></el-input>
            </el-col>
        </el-form-item>

         <el-form-item label="内容" style="z-index:-1" class="editor_box">
          <el-col :span="11" style="z-index:-1">
                <editor :content="form.content" :catchData="setContent" ref="basic" style="background:#fff;"></editor>
            </el-col>

        </el-form-item>
        <el-form-item label="顺序" prop="order" >
            <el-col :span="8">
                <el-input v-model="form.order"></el-input>
            </el-col>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="form.status" active-text="启用" inactive-text="停用" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item label="类型" prop="type" class="select">
          <el-select v-model="form.type" placeholder="请选择类型" style="z-index:111111111">
            <el-option label="关于我们" :value="1"></el-option>
            <el-option label="版权问题" :value="2"></el-option>
            <el-option label="法律问题" :value="3"></el-option>
            <el-option label="常见问题" :value="4"></el-option>
            <el-option label="帮助手册" :value="5"></el-option>
            <el-option label="交易规则" :value="6"></el-option>
            <el-option label="签约协议" :value="7"></el-option>
            <el-option label="注册协议" :value="8"></el-option>
            <el-option label="服务协议" :value="9"></el-option>
            <el-option label="隐私协议" :value="10"></el-option>
            <el-option label="首页公告" :value="11"></el-option>
          </el-select>
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
  import editor from '@/components/WangEditor'
import axios from 'axios'
export default {
  components : {
    editor
  },
  name: "App",
  data() {
    return {
      page_title:'添加资讯',
      editor: null,
      form: {
        id    : '',
        title  : '',
        type : 1,
        content  : '',
        order   : 99,
        status: 1
      },
      detail : {},
      behavior_list:[],
      rules: {
        title: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
        type : [
            { required : true, message : '请选择类型', trigger : "blur"}
        ],
        order : [
            { required : true, message : '请输入顺序', trigger : "blur"}
        ]
      }
    };
  },
  created () {
     let id = this.$route.query.id;
        if( id )
        {
            this.page_title = '编辑资讯';
            this.$api.get('/admin/news/detail', { id : id }, res => {
                this.form = res.data.data
                this.$refs.basic._data.editor.txt.html(this.form.content)

            });
        }
  },
  methods: {
    setContent(content){
      this.form.content = content
    },
    dateRes () {
        var d = new Date(this.form.end_time);
        var  resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        return resDate;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let basic = this.$refs.basic._data;
          this.form.content = basic.editor.txt.html();
          this.$api.post('admin/news/edit', this.form, res=>{
            if(res.data.bol)
            {
              this.$message.success(res.data.msg);
              setTimeout(() => {
                this.$router.push('/admin/new/list')
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
  },
};
</script>

<style>
.select ul{z-index: 11111 !important}
body {
  background: #f1f1f1;
}
</style>
