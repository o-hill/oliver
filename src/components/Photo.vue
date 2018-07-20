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
              <v-btn color='blue-grey' @click='home' flat icon id='home-button'><v-icon>home</v-icon></v-btn>
            </div>
            <div class='help-button'> 
              <v-btn color='blue-grey' flat icon @click='poem' id='poem-button'><v-icon>info</v-icon></v-btn>
            </div>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

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
        let overlayTween = this.tweenGenerator('#overlay', 0, 0.7, 'opacity', '', 600).start()
        this.animate();
      },

      removeOverlay() {
        let overlayTween = this.tweenGenerator('#overlay', 0.7, 0, 'opacity', '', 600).start()
        this.animate()
        setTimeout(() => { $('#overlay')[0].style['z-index'] = 0; }, 600);
      },

      home() {
        let that = this;

        //let photoTween = this.tweenGenerator('#image', 1, 0, 'opacity', '', 1000).start()
        //this.animate()
        TWEEN.removeAll();
        $('#button-card').remove()
          
        //setTimeout(this.begone(photoTween), 1000);
        this.begone();
      },

      begone(tween) {

        TWEEN.removeAll();

        this.$router.push({ name: 'Home', params: { originalRequest: 'false' }})
      },

      tweenGenerator(id, start, end, attr, addString, duration=600) {

        let position = { x: start },
          target = { x: end };

        var tween = new TWEEN.Tween(position)
          .to(target, duration)
          .onUpdate(function() {
            $(id)[0].style[attr] = position.x + addString;
          })

        return tween;
      },

      showButtons() {

        let homeTween = this.tweenGenerator('#home-button', 0, 100, 'opacity', '', 1000),
          poemTween = this.tweenGenerator('#poem-button', 0, 100, 'opacity', '', 1000);

        let homeMarginTween = this.tweenGenerator('#home-button', 10, 0, 'margin-right', '%'),
          poemMarginTween = this.tweenGenerator('#poem-button', 10, 0, 'margin-right', '%');

        homeTween.easing(TWEEN.Easing.Exponential.In).start()
        poemTween.easing(TWEEN.Easing.Exponential.In).delay(200).start();

        homeMarginTween.easing(TWEEN.Easing.Exponential.Out).start()
        poemMarginTween.easing(TWEEN.Easing.Exponential.Out).delay(200).start();

        this.animate();
      },

      removeButtons() {

        let homeTween = this.tweenGenerator('#home-button', 100, 0, 'opacity', ''),
          poemTween = this.tweenGenerator('#poem-button', 100, 0, 'opacity', '');

        let homeMarginTween = this.tweenGenerator('#home-button', 0, 10, 'margin-right', '%'),
          poemMarginTween = this.tweenGenerator('#poem-button', 0, 10, 'margin-right', '%');

        homeMarginTween.start()
        poemMarginTween.delay(200).start()

        homeTween.easing(TWEEN.Easing.Exponential.In).start();
        poemTween.easing(TWEEN.Easing.Exponential.In).delay(200).start();

        this.animate();
      },

      animate() {
        if (TWEEN.update())
          requestAnimationFrame(this.animate);
      }
    },

    mounted() {

      let that = this;

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

      let position = { opacity: 0 }, target = { opacity: 1 };
      var tween = new TWEEN.Tween(position)
        .to(target, 3000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(function() {
          $('#image')[0].style.opacity = position.opacity;
        }).delay(50).start()

      this.animate();
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
