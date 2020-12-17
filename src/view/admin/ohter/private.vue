<template>
    <div class="content">
      <div class="title1">{{title}}</div>
      <div v-html="content">

      </div>
    </div>
</template>

<script>
  export default {
    data (){
      return {
        title : '',
        content : '',
      }
    },
    created (){
      this.getLoad()
    },

    methods: {
      getLoad()
      {
        this.$api.get('api/v1/get_news?type=10', {}, res => {
          console.log(res.data.data.list[0].content)
          this.content=res.data.data.list[0].content
          this.title=res.data.data.list[0].title
        })
      }
    }
  }
</script>

<style scoped="scoped">
.content{
  width:960px; margin: 0 auto;background:#fff;
  padding: 20px;
}

.title1{text-align:center;font-size: 20px;}
</style>
