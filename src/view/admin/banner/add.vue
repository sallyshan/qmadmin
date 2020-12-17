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
        <el-form-item label="广告位名称" prop="title">
            <el-col :span="8">
                <el-input v-model="form.title"></el-input>
            </el-col>
        </el-form-item>
         <el-form-item label="广告位名称" prop="url">
            <el-upload
              class="avatar-uploader"
              action="http://api.qmve.com/api/v1/upload_img"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="form.url" :src="form.url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="显示位置" prop="show">
          <el-select v-model="form.show" placeholder="请选择显示位置">
            <el-option label="首页顶部" :value="1">首页顶部</el-option>
            <el-option label="首页中部" :value="3">首页中部</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告类型" prop="type">
            <el-radio v-model="form.type" :label="1">任务</el-radio>
            <el-radio v-model="form.type" :label="2">外链</el-radio>
        </el-form-item>
        <el-form-item label="广告内容" prop="type">
            <div v-if="form.type==1">
              <el-col :span="8">
                <el-input v-model="form.content" placeholder="请输入服务编号"></el-input>
              </el-col>
            </div>
            <div v-if="form.type==2">
                <el-col :span="8">
                <el-input v-model="form.content" placeholder="请输入外链地址"></el-input>
              </el-col>
            </div>
        </el-form-item>
        <el-form-item label="广告位顺序" prop="order">
            <el-col :span="8">
                <el-input v-model="form.order" type="number"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="行为状态">
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
      page_title:'添加广告位',
      form: {
        id    : '',
        url   : '',
        title   : '',
        show   : 1,
        type : 1,
        content:'',
        status: '1',
        order :99
      },
      detail : {},
      behavior_list:[],
      rules: {
        url: [
          { required: true, message: "请上传图片", trigger: "blur" },
        ],
        order: [
          { required: true, message: "请输入广告位顺序", trigger: "blur" },
        ],
        type: [
          { required: true, message: "请选择广告类型", trigger: "blur" },
        ],
        title: [
          { required: true, message: "请输入广告位名称", trigger: "blur" },
        ],
        show : [
            { required : true, message : '请选择显示区域', trigger : "blur"}
        ]
      }
    };
  },

  created () {
     let id = this.$route.query.id;
        if( id )
        {
            this.page_title = '编辑广告位';
            this.$api.get('/admin/banner/detail', { id : id }, res => {
                this.form = res.data.data
            });
        }
  },
  methods: {
    handleAvatarSuccess(res, file) {
        this.form.url = res.data.url
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api.post('admin/banner/edit', this.form, res=>{
            if(res.data.bol)
            {
              this.$message.success(res.data.msg);
              setTimeout(() => {
                this.$router.push('/admin/banner/list')
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
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px !important;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
