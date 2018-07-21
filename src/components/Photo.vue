<template>
  <div>
    <div id='overlay' @click='removeOverlay'>
      <p id='poem-text'>Hello this is Oliver <br/><br/>Here's a poem <br/><br/> About this picture <br/></p>
    </div>
    <div id='image-holder'>
      <img id='image' :src='imageLink'></img>
      <div id='menu'>
        <div id='spacer' style='position:relative;height:80%;width:100%;'></div>
        <div 
          id='buttons'
          @mouseenter='showButtons()'
          @mouseleave='removeButtons()'>
          <v-card id='button-card'>
            <div class='help-button'>
              <v-btn color='blue-grey' class='el' @click='home' flat icon id='home-button'><v-icon>home</v-icon></v-btn>
            </div>
            <div class='help-button'> 
              <v-btn color='blue-grey' class='el' flat icon @click='poem' id='poem-button'><v-icon>info</v-icon></v-btn>
            </div>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

  import anime from 'animejs'

  export default {

    name: 'Photo',

    props: [
      'name'
    ],

    data() {
      return {

      }
    },

    computed: {

      imageLink() {
        return '/static/img/' + this.name + '.jpg';
      }

    },

    methods: {

      poem() {
        $('#overlay')[0].style['z-index'] = 11;

        let overlayAnime = anime({
          targets: '#overlay',
          opacity: 0.7,
          duration: 2000,
          easing: 'easeInOutQuart'
        })

      },

      removeOverlay() {

        let overlayAnime = anime({
          targets: '#overlay',
          opacity: 0,
          duration: 2000,
          easing: 'easeInOutQuart',
          complete: () => {
            $('#overlay')[0].style['z-index'] = 0;
          }
        })

      },

      home() {
        this.$router.push({ name: 'Home' })
      },

      showButtons() {

        var buttonAnime = anime({
          targets: '#button-card .el',
          opacity: 1,
          marginRight: '0%',
          duration: 1000,
          ease: 'easeInOutQuart',
          delay: function(el, i, l) {
            return i * 200;
          }
        });

      },

      removeButtons() {

        var buttonAnime = anime({
          targets: '#button-card .el',
          opacity: 0,
          marginRight: '20%',
          duration: 1000,
          ease: 'easeInOutQuart',
          delay: function(el, i, l) {
            return i * 200;
          }
        });

      }

    },

    mounted() {

      let that = this;

      // Prevent right click.
      document.addEventListener("contextmenu", function(e){
        e.preventDefault();
      }, false);

      // Get the appropriate margins...
      setTimeout(function() {
        let height = $('#image')[0].clientHeight;
        if (height < window.innerHeight) {
          $('#image')[0].style.marginTop = ((window.innerHeight - $('#image')[0].clientHeight) / 2) + 'px';
        }
      }, 50);

      // Make the photo visible.
      let photoAnime = anime({
        targets: '#image',
        opacity: 1,
        duration: 10000,
        delay: 50
      })

    }
  }

</script>


<style>

  #poem-text {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #eee;
    font-family: 'Playfair Display', serif;
    opacity: 1;
  }

  #overlay {
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    background-color: #111;
  }

  #home-button {
    opacity: 0;
    margin-right: 20%;
  }

  #poem-button {
    opacity: 0;
    margin-right: 20%;
  }

  .help-button {
    margin-top: 20px;
  }

  #menu {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 5%;
  }

  html {
    background-color: #111;
  }

  #image {
    opacity: 0;
    max-height: 100%;
    max-width: 100%;
    display: block;
    margin: 0 auto;
  }

  #image-holder {
    position: absolute;
    z-index: 10 !important;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
  }

</style>
