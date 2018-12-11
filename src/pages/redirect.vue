<template>

</template>

<script>
    export default {
        name: "redirect",
        data(){
          return{

          }
        },
      methods:{

      },
      mounted(){
          console.log(this.$route.query)
          if (this.$route.query.platId) {
            sessionStorage.setItem('funwlPlatId',this.$route.query.platId);

          }
      }
    }
</script>

<style scoped>

</style>
