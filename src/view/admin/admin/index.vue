<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo header-nav"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="text-align:right"
      >
        <el-submenu index="2">
          <template slot="title">{{ nickname }}</template>
          <el-menu-item index="2-3" @click="dialogFormVisible = true">修改密码</el-menu-item>
          <el-menu-item index="2-1" @click="out">退出</el-menu-item>
        </el-submenu>


        <el-menu-item index="3" disabled>千马管理后台</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          :unique-opened="true"
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          :router="true"
          @select="menuSelect"
          text-color="#fff"
          active-text-color="#ffd04b"
           style="overflow: auto;"
        >
          <el-menu-item index="/welcome">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu :index="v.name" v-for="(v,i) in menu_list" :key="i">
            <template slot="title">
              <i :class="v.icon"></i>
              <span>{{ v.name }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="m.link" router v-for="(m,k) in v.menu" :key="k">{{ m.name }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main style='padding: 0;'>
        <v-tags></v-tags>
        <div class="content" v-fours style="padding: 20px;">
            <transition name="move" mode="out-in">
                <keep-alive :include="tagsList">
                    <router-view link="/welcome"></router-view>
                </keep-alive>
            </transition>
            <el-backtop target=".content"></el-backtop>
        </div>
      </el-main>

      <el-dialog
        title="修改密码"
        :visible.sync="dialogFormVisible"
        width="500px"
        :center="true"
        :close-on-click-modal="false"
      >
        <el-form :model="form" ref="form" :rules="rules" :status-icon="true">
          <el-form-item label="旧密码：" :label-width="formLabelWidth" prop="pre_password">
            <el-col :span="18">
              <el-input v-model="form.pre_password" autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="新密码：" :label-width="formLabelWidth" prop="new_password">
            <el-col :span="18">
              <el-input v-model="form.new_password" show-password autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="新密码："  :label-width="formLabelWidth" prop="sign_pwd">
            <el-col :span="18">
              <el-input v-model="form.sign_pwd" show-password autocomplete="off"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editPwd('form')">确 定</el-button>
        </div>
      </el-dialog>
    </el-container>
  </el-container>
</template>

<script>
import vTags from '../../../components/Tags.vue';
export default {
  components:{
    vTags
  },
  name: "App",
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1",
      formLabelWidth: "80px",
      dialogFormVisible: false,
      infoVisible:false,
      menu_list : [],
      info:{},
      nickname :"",
      tagsList:[],
      form: {
        pre_password: "",
        new_password: "",
        sign_pwd: ""
      },
      rules: {
        pre_password: [
          { required: true, message: "旧密码必须输入", trigger: "blur" }
        ],
        new_password: [
          { required: true, message: "新密码必须输入", trigger: "blur" }
        ],
        sign_pwd: [
          { required: true, message: "新密码必须输入", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.nickname = localStorage.getItem('nickname');
    let token = localStorage.getItem("token");
    console.log(token)
    console.log(this.nickname)
    if (!token) {
      this.$router.push("/admin/login");
    }
    this.getMenu();
  },
  mounted (){
  },
  methods: {
    menuSelect(index, path)
    {
      console.log(index, path)
    },
    getMenu(){
      this.$api.get('admin/get_menu', {}, res => {
        this.menu_list=res.data.data
      });
    },
    getInfo(){
      this.$api.get('enterprise/get_enterprise_detail', {}, res => {
        this.info=res.data.data
        this.infoVisible=true
      });
    },
    editPwd(formName) {
      let self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {

          if( this.form.new_password != this.form.sign_pwd)
          {
            this.$message.error('两次新密码不一致');
            return;
          }
          this.$api.post('/enterprise/edit_pass', this.form, res=>{
              if( res.data.bol )
              {
                this.$message.success(res.data.msg);
                setTimeout(function() {
                  self.dialogFormVisible = false;
                }, 1500);
              }else{
                this.$message.error(res.data.msg)
              }
          });

        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    out() {
      let self = this;
      this.$message.warning("退出成功");
      localStorage.removeItem("token");
      setTimeout(function() {
        self.$router.push("/admin/login");
      }, 2000);
    }
  },
  directives:{
    fours : {
        inserted (el) {
          let windowHeight = document.documentElement.clientHeight-130
          console.log(windowHeight)
          el.style.height=windowHeight+"px"
          el.style.overflow = "auto"
        }
    }
  }
};
</script>

<style>
body {
  padding: 0;
  margin: 0;
}
.el-header {
  padding: 0 !important;
  margin: 0 !important;
}
.header-nav li {
  float: right !important;
}
html,
.gr__localhost,
.el-container,
body,
.el-container,
.el-menu {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
.mt15 {
  margin-top: 15px !important;
}
</style>
