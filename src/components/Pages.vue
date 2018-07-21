<template>
</template>


<script>

  import Homepage from './Home.vue';

  export default {

    name: 'Transitioner',

    components: {
      Homepage
    },

    data() {
      return {
        view: Homepage
      }
    },

    mounted() {
      this.$router.push({ path: '/', params: { originalRequest: true }});
    }

  }


</script>

