webpackJsonp([3],{UaLa:function(e,t){},s7hM:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o={name:"App",data:function(){return{isShow:!1,invoice_type_list:[{value:1,name:"普通电子发票"},{value:2,name:"专用发票"}],form:{invoice_type:"",header:"",tax_num:"",address:"",phone:"",bank:""},rules:{invoice_type:[{required:!0,message:"请选择发票类型",trigger:"blur"}],header:[{required:!0,message:"请输入发票抬头",trigger:"blur"}],tax_num:[{required:!0,message:"请选择公司税号",trigger:"blur"}]}}},created:function(){this.getInfo()},methods:{getInfo:function(){var e=this;this.$api.get("/enterprise/get_enterprise_info",{},function(t){e.form=t.data.data,e.form.invoice_type=1==e.form.invoice_type?"普通电子发票":"专用发票"})},submitForm:function(e){var t=this,r=this;this.$refs[e].validate(function(e){if(!e)return console.log("error submit!!"),!1;t.$api.post("enterprise/edit_enterprise_info",t.form,function(e){e.data.bol&&(t.$message.success(e.data.msg),setTimeout(function(){r.getInfo()},1500))})})},resetForm:function(e){this.$refs[e].resetFields()}}},a={render:function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[e._m(0),e._v(" "),r("div",[r("el-form",{ref:"form",staticClass:"mt15",attrs:{"status-icon":!0,model:e.form,rules:e.rules,"label-width":"120px","label-position":"right"}},[r("el-form-item",{attrs:{label:"发票类型",prop:"invoice_type"}},[r("el-select",{attrs:{placeholder:"选择发票类型"},model:{value:e.form.invoice_type,callback:function(t){e.$set(e.form,"invoice_type",t)},expression:"form.invoice_type"}},e._l(e.invoice_type_list,function(t,o){return r("el-option",{key:o,attrs:{label:t.name,value:t.value,disabled:e.isShow}})}),1)],1),e._v(" "),r("el-form-item",{attrs:{label:"发票抬头",prop:"header"}},[r("el-col",{attrs:{span:8}},[r("el-input",{attrs:{disabled:e.isShow},model:{value:e.form.header,callback:function(t){e.$set(e.form,"header",t)},expression:"form.header"}})],1)],1),e._v(" "),r("el-form-item",{attrs:{label:"公司税号",prop:"tax_num"}},[r("el-col",{attrs:{span:8}},[r("el-input",{attrs:{"show-word-limit":!0,disabled:e.isShow},model:{value:e.form.tax_num,callback:function(t){e.$set(e.form,"tax_num",t)},expression:"form.tax_num"}})],1)],1),e._v(" "),r("el-form-item",{attrs:{label:"注册地址"}},[r("el-col",{attrs:{span:8}},[r("el-input",{model:{value:e.form.address,callback:function(t){e.$set(e.form,"address",t)},expression:"form.address"}})],1)],1),e._v(" "),r("el-form-item",{attrs:{label:"注册电话",prop:"phone"}},[r("el-col",{attrs:{span:8}},[r("el-input",{model:{value:e.form.phone,callback:function(t){e.$set(e.form,"phone",t)},expression:"form.phone"}})],1)],1),e._v(" "),r("el-form-item",{attrs:{label:"开户银行",prop:"bank"}},[r("el-col",{attrs:{span:8}},[r("el-input",{model:{value:e.form.bank,callback:function(t){e.$set(e.form,"bank",t)},expression:"form.bank"}})],1)],1),e._v(" "),r("el-form-item",[r("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.submitForm("form")}}},[e._v("提交")])],1)],1)],1)])},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticStyle:{"margin-left":"50px"}},[t("h3",[this._v("发票信息")])])}]};var i=r("VU/8")(o,a,!1,function(e){r("UaLa")},null,null);t.default=i.exports}});
//# sourceMappingURL=3.9084dad2773051aea687.js.map