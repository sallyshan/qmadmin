<template>
  <el-container>
      <div class="login-box">
          <div class="left-box">

          </div>
          <div class="right-box">
                <p class="title">欢迎登陆千马后台管理</p>
                <div class="input-box">
                    <el-input class="mt15" v-model="account" placeholder="请输入账号" clearable></el-input>
                    <el-input class="mt15" v-model="pwd" placeholder="请输入密码" clearable show-password></el-input>
                    <el-button class="mt15 sub" @click="login" type="primary">登陆</el-button>
                </div>
          </div>
      </div>
</el-container>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
        account : '',
        pwd : ''    
    }
  },
  methods :{
      login () {
          if( this.account == '' )
          {
              this.$message.error('账号不可为空');
              return false;
          }
          if( this.pwd == '' )
          {
              this.$message.error('密码不可为空');
              return false;
          }
          let data = {
              phone : this.account,
              password : this.pwd
          }
          this.$api.post('/admin/login', data, res=>{
            if( res.data.bol )
            {
              localStorage.setItem('token', res.data.data.token);
              localStorage.setItem('nickname', res.data.data.nickname);
              this.$message.success('登陆成功');
              setTimeout(() => {
                this.$router.push('/')
              }, 2000);
            }else{
              this.$message.error(res.data.msg);
            }
          });
            
          
      }
  }
}
</script>

<style>
body{
    background:#f1f1f1
}
.mt15{margin-top: 15px;}
.login-box{
       width: 740px;
    height: 500px;
    font-size: 0;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -250px;
    margin-left: -370px;
    z-index: 2;
    display: flex;
    box-shadow: 1px 1px 4px #fff;
}
.left-box{
    width: 280px;
    border-radius: 6px 0 0 6px;
    background: #F4F9FF;    
}
.right-box{
    width: 460px;
    background: #fff;
    border-radius: 0 6px 6px 0;
    position: relative;
}
.title{
    font-size: 18px;
    color: #388CEB;
    letter-spacing: 0.9px;
    margin-top: 20px;
    text-align: center;
    margin-top: 140px;
}
.input-box{
    width: 300px;
    margin: 0 auto;
    text-align:center;
}
.sub{
    width: 100%;
}
</style>
