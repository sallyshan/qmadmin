webpackJsonp([8],{"0FGc":function(t,e){},flBG:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s={name:"App",data:function(){return{account:"",pwd:""}},methods:{login:function(){var t=this;if(""==this.account)return this.$message.error("账号不可为空"),!1;if(""==this.pwd)return this.$message.error("密码不可为空"),!1;var e={phone:this.account,password:this.pwd};this.$api.post("/enterprise/login",e,function(e){e.data.bol?(localStorage.setItem("token",e.data.data.token),localStorage.setItem("nickname",e.data.data.nickname),t.$message.success("登陆成功"),setTimeout(function(){t.$router.push("/")},2e3)):t.$message.error(e.data.msg)})}}},n={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-container",[a("div",{staticClass:"login-box"},[a("div",{staticClass:"left-box"}),t._v(" "),a("div",{staticClass:"right-box"},[a("p",{staticClass:"title"},[t._v("欢迎登陆企业管理")]),t._v(" "),a("div",{staticClass:"input-box"},[a("el-input",{staticClass:"mt15",attrs:{placeholder:"请输入账号",clearable:""},model:{value:t.account,callback:function(e){t.account=e},expression:"account"}}),t._v(" "),a("el-input",{staticClass:"mt15",attrs:{placeholder:"请输入密码",clearable:"","show-password":""},model:{value:t.pwd,callback:function(e){t.pwd=e},expression:"pwd"}}),t._v(" "),a("el-button",{staticClass:"mt15 sub",attrs:{type:"primary"},on:{click:t.login}},[t._v("登陆")])],1)])])])},staticRenderFns:[]};var c=a("VU/8")(s,n,!1,function(t){a("0FGc")},null,null);e.default=c.exports}});
//# sourceMappingURL=8.9584a80fa9ace2a7758b.js.map