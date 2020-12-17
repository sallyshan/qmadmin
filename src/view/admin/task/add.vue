<template>
  <div>
    <div  style="margin-left:50px;">
      <h3>添加任务</h3>
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
      <el-form-item label="任务合同" prop="title">
            <el-col :span="24">
                <el-radio-group v-model="form.contract_id">
                  <el-radio-button :label="v.id" @change="changeContract(v.id)"  v-for="(v,i) in contract_list " :key="i">{{ v.title }}
                    <div style="margin-top: 10px;">
                      <el-button type="text" size="mini" style="color:#333;" @click="showContract(i)">查看</el-button>
                    </div>
                  </el-radio-button>
                </el-radio-group>
            </el-col>
        </el-form-item>
        <el-form-item label="是否指定人" :hide-required-asterisk="true">
          <el-radio-group v-model="is_specified" @change="specifiedChange">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="指定人手机" v-if="is_specified_v">
            <el-col :span="8">
                <el-input v-model="search_user_phone"></el-input>
            </el-col>
            <el-col :span="3">
              <el-button type="text" size="small" @click="searchUser">搜索</el-button>
            </el-col>
        </el-form-item>
        <el-form-item label="搜索结果" v-if="is_specified_v">
            <el-col :span="4" v-for="(v,i) in search_user_list" :key="i">
                <el-card shadow="hover">
                  <div align="center">
                    <p>{{v.nickname}}</p>
                    <p>{{v.phone}}</p>
                  </div>
                  <div align="center">
                    <el-button type="success" size="mini" @click="addZd">添加</el-button>
                  </div>
                </el-card>
            </el-col>
        </el-form-item>
        <el-form-item label="已指定" v-if="is_specified_v">
            <el-col :span="4" v-for="(v,i) in already_user_list" :key="i">
                <el-card shadow="hover">
                  <div align="center">
                    <p>{{v.nickname}}</p>
                    <p>{{v.phone}}</p>
                  </div>
                </el-card>
            </el-col>
        </el-form-item>
        <el-form-item label="任务名称" prop="title">
            <el-col :span="8">
                <el-input v-model="form.title"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="任务封面" prop="logo">
            <el-col :span="8">
               <el-upload
                  action="http://39.96.29.15:9501/api/v1/upload_img"
                  list-type="picture-card"
                  name="file"
                  :show-file-list="true"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :on-success="uploadImageSuccess"
                  :before-upload="beforeAvatarUpload"
                  :limit="1"
                  >
                  <i class="el-icon-plus"></i>
                </el-upload>
            </el-col>
        </el-form-item>
        <el-form-item label="任务分类" prop="one_sort">
          <el-select v-model="form.one_sort" placeholder="请选择任务一级分类" @change="sortChange">
            <el-option v-for="(v,i) in sort_list" :label="v.name" :value="v.id" :key="i"></el-option>
          </el-select>
          <el-select v-model="form.two_sort" placeholder="请选择任务二级分类">
            <el-option v-for="(v,i) in two_list" :label="v.name" :value="v.id" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time">
          <el-col :span="11">
            <el-date-picker
              v-model="form.end_time"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="限制人数" prop="max_people">
            <el-col :span="3">
                <el-input type="number" v-model="form.max_people"></el-input>
            </el-col>
        </el-form-item>
         <el-form-item label="结算类型">
          <el-radio-group v-model="task_type" @change="typeChange">
            <el-radio label="按单"></el-radio>
            <el-radio label="按小时"></el-radio>
          </el-radio-group>
        </el-form-item>
         <el-form-item label="每单佣金" prop="money" v-show="type_show==1">
            <el-col :span="3">
                <el-input type="number" v-model="form.money"></el-input>
            </el-col>
        </el-form-item>
        <el-form-item label="小时佣金" prop="money" v-show="type_show==2">
            <el-col :span="3">
                <el-input type="number" v-model="form.money"></el-input>
            </el-col>
        </el-form-item>

        <el-form-item label="任务状态">
          <el-switch v-model="form.status" active-text="启用" inactive-text="停用" active-value="1" inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item label="活动描述" prop="message">
                <editor :content="form.content" :catchData="setContent" ref="basic" style="background:#fff;"></editor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">立即创建</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
        :title="contractTitle"
        :visible.sync="contractVisible"
        width="375px"
        :center="true"
        :close-on-click-modal="false"
      >
      <div v-html="showContractContent"></div>
    </el-dialog>
  </div>
</template>

<script>
import editor from '@/components/WangEditor'
export default {
  components: {
    editor
  },
  name: "App",
  data() {
    return {
      is_specified_v:false, //指定人搜索框
      contractVisible: false,
      showContractContent:'',
      contractTitle:'',
      contract_list : [],
      search_user_phone:'',
      search_user_list:[],
      already_user_list:[],
      sort_list : [],
      two_list : [],
      is_specified:'否',
      type_show:1,
      task_type:'按单',
      form: {
        title: "",
        logo:'',
        one_sort: "",
        two_sort: "",
        end_time: "",
        status: "1",
        max_people:'',
        type: 1,
        message: "",
        money:'',
        is_specified_people:2,
        specified_people_list:[],
        contract_id:'1',
      },
      toolbars  : {
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
      rules: {
        title: [
          { required: true, message: "请输入任务名称", trigger: "blur" },
        ],
        logo: [
          { required: true, message: "请上传封面", trigger: "blur" },
        ],
        one_sort : [
            { required : true, message : '请选择任务分类', trigger : "blur"}
        ],
        end_time : [
            { required : true, message : '请选择任务进行时间', trigger : "blur"}
        ],
        max_people : [
            { required : true, message : '请填写参加限制人数', trigger : "blur"},
            { min : 1, max : 9999 , message : '人数最少1人 最多9999人' , trigger : "blur"}
        ],
        money : [
            { required : true, message : '请输入每单佣金', trigger : "blur"},
            { min : 1 , message : '金额最少1元' , trigger : "blur"}
        ],
         message : [
            { required : true, message : '请输入活动详细描述', trigger : "blur"}
        ],
      }
    };
  },

  created () {
    let self = this;
    this.getOneSort()
    this.getContract();
  },
  methods: {
    setContent(content){
      this.form.content = content
    },
    getOneSort()
    {
      this.$api.get('api/v1/get_task_one_sort', {},res=>{
        self.sort_list=res.data.data.list;
        this.$refs.basic._data.editor.txt.html(this.form.message)
      });
    },
    changeContract(contract_id){
      this.form.contract_id=contract_id
    },
    showContract(index){
      this.showContractContent=this.contract_list[index].content;
      this.contractTitle=this.contract_list[index].title;
      this.contractVisible=true;
    },
    getContract(){
        this.$api.get('enterprise/get_contract_list', {audit_ret:1, status : 1}, res => {
          this.contract_list=res.data.data
        });
    },
    addZd(){
      let user = this.search_user_list[0];
      if( this.already_user_list.length >= 1 )
      {
        for(let v of this.already_user_list){
          if(v.id==user.id)
          {
            this.$message.error('已经指定过该用户, 不可重复填加');
            return false;
          }
        }
      }

      this.already_user_list.push(this.search_user_list[0])
      this.form.specified_people_list.push(this.search_user_list[0].id)
      this.search_user_list.splice(0)
    },
    searchUser(){
      if(this.search_user_phone == '')
      {
        this.$message.error('搜索内容不能为空');
        return;
      }


      this.$api.get('admin/user/list', {phone:this.search_user_phone},res=>{
        if(res.data.bol === false || res.data.data.total == 0)
        {
          this.$message.error('没有找到这个人');
        }else{
          this.search_user_list=res.data.data.list;

        }
      });
    },
    lookContract(e){
      alert(e)
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
    handleRemove(file, fileList){
      console.log('移除'+ file)
    },
    uploadImageSuccess(res, file, fileList)
    {
      this.form.logo=res.data.url;
    },
    handlePictureCardPreview(file){
      console.log(file)
    },
    sortChange(e)
    {
        let self = this;
        this.$api.get('api/v1/get_task_two_sort', {id:e},res=>{
          self.two_list=res.data.data.list;
          console.log(self.two_list)
        });
    },
    specifiedChange(e){
      if( e == '是' )
      {
        this.form.is_specified_people = 1;
        this.is_specified_v = true;
      }

      if( e == '否' )
      {
        this.form.is_specified_people = 2;
        this.is_specified_v = false;

      }
    },
    typeChange(e){
      if( e == '按单' )
      {
        this.form.type = 1;
        this.type_show=1;
      }

      if( e == '按小时' )
      {
        this.form.type = 2;
        this.type_show=2;

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
          let basic = this.$refs.basic._data;
          this.form.message = basic.editor.txt.html();
          this.form.end_time=this.dateRes();
          console.log(this.form);
          this.$api.post('enterprise/task/add', this.form, res=>{
            if(res.data.bol)
            {
              this.$message.success(res.data.msg);
              setTimeout(() => {
                this.$router.push('/admin/task/list')
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
