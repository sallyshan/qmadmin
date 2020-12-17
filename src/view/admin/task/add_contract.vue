<template>
  <div>
    <div style="margin-left:50px;">
      <h3>{{ page_title }}</h3>
    </div>
    <div style="margin-left:50px;">
      <el-button size="mini" type="primary" @click="$router.go(-1)">返回</el-button>
    </div>
    <el-form class="mt15" :status-icon="true" :model="form" :rules="rules" ref="form" label-width="120px"
      label-position="right">
      <el-form-item label="合同名称" prop="title">
        <el-col :span="8">
          <el-input v-model="form.title"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="合同描述">
        <editor :content="form.content" :catchData="setContent" ref="basic" style="background:#fff;"></editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">立即创建</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
  import editor from '@/components/WangEditor'
  export default {
    components: {
      editor
    },
    data() {

      return {
        page_title: '添加合同',
        form: {
          title: '',
          content: '',
        },
        rules: {
          title: [{
            required: true,
            message: "请输入合同名称",
            trigger: "blur"
          }, ],
          content: [{
            required: true,
            message: "请输入合同内容",
            trigger: "blur"
          }, ],
        },
        toolbars: {
          undo: true, // 上一步
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          mark: true, // 标记
          superscript: true, // 上角标
          quote: true, // 引用
          ol: true, // 有序列表
        },
      }
    },

    created() {
      let id = this.$route.query.id;
      if (id) {
        this.page_title = '编辑合同';
        this.$api.get('admin/contract/detail', {
          id: id
        }, res => {
          this.form = res.data.data
          this.$refs.basic._data.editor.txt.html(this.form.content)
        });
      }
    },

    methods: {
      setContent(content){
        this.form.content = content
      },
    
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let basic = this.$refs.basic._data;
            this.form.content = basic.editor.txt.html();
            this.$api.post('admin/contract/edit', this.form, res => {
              if (res.data.bol) {
                this.$message.success(res.data.msg);
                setTimeout(() => {
                  this.$router.push('/admin/task/contract')
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
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>


<style lang="" scoped>

</style>
