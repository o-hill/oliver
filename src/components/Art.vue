<template>
  <v-layout align-center>
    <v-flex xs4 offset-xs4>
      <transition name='fade'>
        <v-card class='mt-5' id='artCard'>
          <v-card-title class='ml-3' primary-title>
            <div id='title'>Art</div>
          </v-card-title>
          <div class='ml-4' id='artLine'></div>
          <p  class='artItem pb-3'>Photography</p>
          <p class='artItem pb-3'>Music</p>
        </v-card>
      </transition>
    </v-flex>
  </v-layout>
</template>


<script>

  export default {

    name: 'Art',

    data() {
      return {

      }
    },

    methods: {

    }
  }

</script>



<style scoped>

  #title {
    font-size: 25px;
    font-family: 'Playfair Display', serif;
    color: white;
  }

  #artCard {
    /*background-color: #2A3238;*/
    background-color: #000000;
  }

  #artLine {
    position: absolute;
    top: 60px;
    background-color: white;
    width: 90%;
    height: 1px;
  }

  .artItem {
    color: #dddddd;
    margin: 10px;
  }


</style>
