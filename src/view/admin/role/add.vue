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
        size="small"
        :status-icon="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px"
        label-position="right"
      >

        <el-form-item label="角色名称" prop="name">
            <el-col :span="8">
                <el-input v-model="form.name"></el-input>
            </el-col>
        </el-form-item>
         <el-form-item label="角色描述" prop="message">
            <el-col :span="8">
                <el-input v-model="form.message"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="行为" prop="behaviors">
          <template>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"  @change="handleCheckAllChange">全选</el-checkbox>
            <el-row v-for="(v ,i) in behavior_list" :key="i">
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="form.behaviors" @change="handleCheckedCitiesChange">

                <el-checkbox :label="v.id">{{v.name}}</el-checkbox>
                <el-checkbox v-for="(m,k) in v.menu" :label="m.id" :key="k">{{m.name}}</el-checkbox>
              </el-checkbox-group>
            </el-row>
          </template>
        </el-form-item>
        <el-form-item label="行为状态">
          <el-switch v-model="form.status" active-text="启用" inactive-text="停用" :active-value=1
    :inactive-value=2></el-switch>
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
      checkAll: false,
      behavior_list: [],
      isIndeterminate: false,
      count:0,
      page_title:'添加角色',
      form: {
        id    : '',
        name  : '',
        message  : '',
        behaviors   : [],
        status: '1'
      },
      detail : {},
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
        message: [
          { required: true, message: "请输入描述", trigger: "blur" },
        ],
        behaviors : [
            { required : true, message : '请选择行为', trigger : "blur"}
        ]
      }
    };
  },

  created () {
     let id = this.$route.query.id;
        if( id )
        {
            this.page_title = '编辑角色';
            this.$api.get('/admin/role/detail', { id : id }, res => {
                this.form = res.data.data
            });
        }
    let self = this;
    this.$api.get('/admin/role/get_menu', {},res=>{
      self.behavior_list=res.data.data;
      self.behavior_list.forEach(res=>{
              this.count+= 1
        res.menu.forEach(r => {
              this.count+= 1
        })
      })
      this.isIndeterminate= this.form.behaviors.length >= this.count ? true : false
    });
  },
  methods: {
    handleCheckAllChange(val) {
        if( val )
        {
          this.behavior_list.forEach(res=>{
            this.form.behaviors.push(res.id)
            res.menu.forEach(r => {
              this.form.behaviors.push(r.id)
            })
          })
        }else{
          this.form.behaviors = [];
        }
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.count;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.count;
      },
    dateRes () {
        var d = new Date(this.form.end_time);
        var  resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        return resDate;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$api.post('admin/role/edit', this.form, res=>{
            if(res.data.bol)
            {
              this.$message.success(res.data.msg);
              setTimeout(() => {
                this.$router.push('/admin/role/list')
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
}
</script>

<style>
body {
  background: #f1f1f1;
}
</style>
