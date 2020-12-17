<template>
  <div class="container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">企业合同模板管理</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="img_box">
      <div class="img">
       <el-image  :src="enterprise_contract" style="width: 100%;" alt=""></el-image>
      </div>
      <div class="img_sub">
        <el-upload class="upload-demo" action="http://api.qmve.com/api/v1/upload_img" :on-preview="handlePreview"
          :on-remove="handleRemove" :before-remove="beforeRemove" name="file" multiple :before-upload="beforeUpload" :on-success="uploadSuccess">
          <el-button size="small" type="primary">修改合同</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10M</div>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "App",
    data() {
      return {
        search: {},
        enterprise_contract:'',
      };
    },
    created() {
      this.loadData()
    },
    methods: {
      uploadSuccess(res, file, fileList){
        this.enterprise_contract = res.data.url

        this.$api.post('admin/enterprise/edit_enterprise_contract', { enterprise_contract : this.enterprise_contract}, res => {
          console.log(res)
        });

      },
      beforeUpload(file){
        if (file.type != 'image/png' && file.type != 'image/jpg' && file.type != 'image/jpeg' ){
          this.$message.error("上传类型错误")
          return false;
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      loadData () {
        this.$api.get('admin/get_config', { }, res => {
          console.log(res)
           this.enterprise_contract = res.data.data.enterprise_contract
        });
      },
    }
  };
</script>

<style>
  .img_box {
    display: flex;
    margin-top: 20px;
    width: 100%;
  }

  .img {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 400px;
  }

  .img_sub {
    margin-left: 15px;
    flex-grow: 1;
  }
</style>
