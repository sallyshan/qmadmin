webpackJsonp([10],{Cx9i:function(e,t){},Hf8h:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s={name:"App",data:function(){return{activeIndex:"1",activeIndex2:"1",formLabelWidth:"80px",dialogFormVisible:!1,infoVisible:!1,nickname:"",form:{pre_password:"",new_password:"",sign_pwd:""},rules:{pre_password:[{required:!0,message:"旧密码必须输入",trigger:"blur"}],new_password:[{required:!0,message:"新密码必须输入",trigger:"blur"}],sign_pwd:[{required:!0,message:"新密码必须输入",trigger:"blur"}]}}},created:function(){this.nickname=localStorage.getItem("nickname"),localStorage.getItem("token")||this.$router.push("/admin/login")},methods:{editPwd:function(e){var t=this,i=this;this.$refs[e].validate(function(e){if(!e)return console.log("error submit!!"),!1;t.form.new_password==t.form.sign_pwd?t.$api.post("/enterprise/edit_pass",t.form,function(e){e.data.bol?(t.$message.success(e.data.msg),setTimeout(function(){i.dialogFormVisible=!1},1500)):t.$message.error(e.data.msg)}):t.$message.error("两次新密码不一致")})},out:function(){var e=this;this.$message.warning("退出成功"),localStorage.removeItem("token"),setTimeout(function(){e.$router.push("/admin/login")},2e3)}}},o={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("el-container",[i("el-header",[i("el-menu",{staticClass:"el-menu-demo header-nav",staticStyle:{"text-align":"right"},attrs:{"default-active":e.activeIndex2,mode:"horizontal","background-color":"#545c64","text-color":"#fff","active-text-color":"#ffd04b"}},[i("el-submenu",{attrs:{index:"2"}},[i("template",{slot:"title"},[e._v(e._s(e.nickname))]),e._v(" "),i("el-menu-item",{attrs:{index:"2-2"},on:{click:function(t){e.infoVisible=!0}}},[e._v("我的信息")]),e._v(" "),i("el-menu-item",{attrs:{index:"2-3"},on:{click:function(t){e.dialogFormVisible=!0}}},[e._v("修改密码")]),e._v(" "),i("el-menu-item",{attrs:{index:"2-1"},on:{click:e.out}},[e._v("退出")])],2),e._v(" "),i("el-menu-item",{attrs:{index:"3",disabled:""}},[e._v("企业管理中心")]),e._v(" "),i("el-menu-item",{attrs:{index:"3"}},[e._v("\n            \n              消息 "),i("span",{staticStyle:{color:"#f00","font-weight":"bold"}},[e._v("(3)")])])],1)],1),e._v(" "),i("el-container",[i("el-aside",{attrs:{width:"200px"}},[i("el-menu",{staticClass:"el-menu-vertical-demo",attrs:{"default-active":"2","background-color":"#545c64",router:!0,"text-color":"#fff","active-text-color":"#ffd04b"}},[i("el-menu-item",{attrs:{index:"/welcome"}},[i("i",{staticClass:"el-icon-s-home"}),e._v(" "),i("span",{attrs:{slot:"title"},slot:"title"},[e._v("首页")])]),e._v(" "),i("el-submenu",{attrs:{index:"1"}},[i("template",{slot:"title"},[i("i",{staticClass:"el-icon-s-promotion"}),e._v(" "),i("span",[e._v("任务管理")])]),e._v(" "),i("el-menu-item-group",[i("template",{slot:"title"},[e._v("任务")]),e._v(" "),i("el-menu-item",{attrs:{index:"/admin/task/list",router:""}},[e._v("任务列表")]),e._v(" "),i("el-menu-item",{attrs:{index:"/admin/task/contract",router:""}},[e._v("合同管理")])],2)],2),e._v(" "),i("el-submenu",{attrs:{index:"6"}},[i("template",{slot:"title"},[i("i",{staticClass:"el-icon-user-solid"}),e._v(" "),i("span",[e._v("人才管理")])]),e._v(" "),i("el-menu-item-group",[i("el-menu-item",{attrs:{index:"/enterprise/bind_user"}},[e._v("人才列表")]),e._v(" "),i("el-menu-item",{attrs:{index:"2-2"}},[e._v("申请列表")])],1)],2),e._v(" "),i("el-submenu",{attrs:{index:"2"}},[i("template",{slot:"title"},[i("i",{staticClass:"el-icon-s-order"}),e._v(" "),i("span",[e._v("订单管理")])]),e._v(" "),i("el-menu-item-group",[i("template",{slot:"title"},[e._v("分组一")]),e._v(" "),i("el-menu-item",{attrs:{index:"2-1"}},[e._v("选项1")]),e._v(" "),i("el-menu-item",{attrs:{index:"2-2"}},[e._v("选项2")])],2)],2),e._v(" "),i("el-submenu",{attrs:{index:"3"}},[i("template",{slot:"title"},[i("i",{staticClass:"el-icon-s-cooperation"}),e._v(" "),i("span",[e._v("账务管理")])]),e._v(" "),i("el-menu-item-group",[i("el-menu-item",{attrs:{index:"/admin/enterprise/wallet"}},[e._v("账户余额")])],1)],2),e._v(" "),i("el-submenu",{attrs:{index:"4"}},[i("template",{slot:"title"},[i("i",{staticClass:"el-icon-s-tools"}),e._v(" "),i("span",[e._v("系统设置")])]),e._v(" "),i("el-menu-item-group",[i("el-menu-item",{attrs:{index:"/admin/enterprise/invoice"}},[e._v("发票信息")]),e._v(" "),i("el-menu-item",{attrs:{index:"4-1"}},[e._v("申请发票")]),e._v(" "),i("el-menu-item",{attrs:{index:"/admin/enterprise/address"}},[e._v("邮寄信息")]),e._v(" "),i("el-menu-item",{attrs:{index:"4-1"}},[e._v("发票查询")])],1),e._v(" "),i("el-menu-item-group",[i("template",{slot:"title"},[e._v("企业信息")]),e._v(" "),i("el-menu-item",{attrs:{index:"/admin/enterprise/certification"}},[e._v("认证信息")])],2)],2)],1)],1),e._v(" "),i("el-main",[i("router-view",{attrs:{link:"/welcome"}})],1),e._v(" "),i("el-dialog",{attrs:{title:"企业信息",visible:e.infoVisible,width:"500px",center:!0,"close-on-click-modal":!1},on:{"update:visible":function(t){e.infoVisible=t}}},[e._v("\n      \n      我的消息\n\n    ")]),e._v(" "),i("el-dialog",{attrs:{title:"修改密码",visible:e.dialogFormVisible,width:"500px",center:!0,"close-on-click-modal":!1},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[i("el-form",{ref:"form",attrs:{model:e.form,rules:e.rules,"status-icon":!0}},[i("el-form-item",{attrs:{label:"旧密码：","label-width":e.formLabelWidth,prop:"pre_password"}},[i("el-col",{attrs:{span:18}},[i("el-input",{attrs:{autocomplete:"off"},model:{value:e.form.pre_password,callback:function(t){e.$set(e.form,"pre_password",t)},expression:"form.pre_password"}})],1)],1),e._v(" "),i("el-form-item",{attrs:{label:"新密码：","label-width":e.formLabelWidth,prop:"new_password"}},[i("el-col",{attrs:{span:18}},[i("el-input",{attrs:{"show-password":"",autocomplete:"off"},model:{value:e.form.new_password,callback:function(t){e.$set(e.form,"new_password",t)},expression:"form.new_password"}})],1)],1),e._v(" "),i("el-form-item",{attrs:{label:"新密码：","label-width":e.formLabelWidth,prop:"sign_pwd"}},[i("el-col",{attrs:{span:18}},[i("el-input",{attrs:{"show-password":"",autocomplete:"off"},model:{value:e.form.sign_pwd,callback:function(t){e.$set(e.form,"sign_pwd",t)},expression:"form.sign_pwd"}})],1)],1)],1),e._v(" "),i("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:function(t){e.dialogFormVisible=!1}}},[e._v("取 消")]),e._v(" "),i("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.editPwd("form")}}},[e._v("确 定")])],1)],1)],1)],1)},staticRenderFns:[]};var l=i("VU/8")(s,o,!1,function(e){i("Cx9i")},null,null);t.default=l.exports}});
//# sourceMappingURL=10.0a4778f8e9eae7e1eb42.js.map