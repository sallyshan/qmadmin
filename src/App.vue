<template>
  <el-container>
  
      <router-view></router-view>
</el-container>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      activeIndex: '1',
        activeIndex2: '1'
    }
  }
}
</script>

<style>
body{
  padding: 0;
  margin: 0;
}
.el-header{
  padding: 0;
  margin: 0;
}
.header-nav li{float: right !important}
.gr__localhost,.el-container, body,.el-container,.el-menu{
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
.mt15{margin-top: 15px;}
.text-center{text-align: center;}
</style>
