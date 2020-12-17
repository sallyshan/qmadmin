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
         size="small"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px"
        label-position="right"
      >
      
        <el-form-item label="分类名称" prop="name">
            <el-col :span="8">
                <el-input v-model="form.name"></el-input>
            </el-col>
        </el-form-item>
         <el-form-item label="分类icon" prop="icon">
            <el-col :span="8">
               <el-upload
                  action="http://api.qmve.com/api/v1/upload_img"
                  list-type="picture-card"
                  name="file"
                  :file-list="icon"
                  :show-file-list="true"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :on-success="uploadImageSuccess"
                  :before-upload="beforeAvatarUpload"
                  :limit="1"
                  :on-exceed="exceedFun"
                  >
                  <i class="el-icon-plus"></i>
                </el-upload>
            </el-col>
        </el-form-item>
        <el-form-item label="上级分类" prop="pid">
          <el-select v-model="form.pid" placeholder="请选择任务一级分类">
            <el-option label="一级分类" :value="0"></el-option>
            <el-option v-for="(v,i) in sort_list" :label="v.name" :value="v.id" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类顺序" prop="order">
            <el-col :span="8">
                <el-input v-model="form.order" type="number"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="分类状态">
          <el-switch v-model="form.status" active-text="启用" inactive-text="停用" :active-value=1
    :inactive-value=2></el-switch>
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
      page_title:'添加分类',
      form: {
        id    : '',
        name  : '',
        icon  : '',
        pid   : 0,
        status: 1,
        order : 99
      },
      icon:[],
      detail : {},
      sort_list:[],
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
        order: [
          { required: true, message: "请输入顺序", trigger: "blur" },
        ],
        pid : [
            { required : true, message : '请选择上级分类', trigger : "blur"}
        ],
        icon : [
            { required : true, message : '请上传icon', trigger : "blur"}
        ]
      }
    };
  },

  created () {
     let id = this.$route.query.id;
        if( id )
        {
            this.page_title = '编辑分类';
            this.$api.get('/admin/task_sort/detail', { id : id }, res => {
                this.form = res.data.data
                this.icon.push({
                    url : res.data.data.icon
                })
            });
        }
    let self = this;
    this.$api.get('/admin/task_sort/list', { pid : 0},res=>{
      self.sort_list=res.data.data.list;
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
          this.$api.post('admin/task_sort/edit', this.form, res=>{
            if(res.data.bol)
            {
              this.$message.success(res.data.msg);
              setTimeout(() => {
                this.$router.push('/admin/task_sort/list')
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
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return  isLt2M;
    },
    handleRemove(file, fileList){
      console.log('移除'+ file)
    },
    uploadImageSuccess(res, file, fileList)
    {
      this.form.icon=res.data.url;
    },
    handlePictureCardPreview(file){
      console.log(file)
    },
    exceedFun(files,fileList){
        this.$message.error('最多只能上传一个图片');
    },
  }
};
</script>

<style>
body {
  background: #f1f1f1;
}
</style>
