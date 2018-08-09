<template>
  <div style='position:relative;top:0;left:0;width:100vw;height:100vh;'>
    <loader id='loader'></loader>
    <div id='imageLoaded'>
      <div id='overlay' @click='removeOverlay'>
        <p id='poem-text'>Hello this is Oliver <br/><br/>Here's a poem <br/><br/> About this picture <br/></p>
      </div>
      <div id='image-holder'>
        <!-- <img id='image'></img> -->
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
  </div>
</template>


<script>

  import anime from 'animejs'
  import Loader from './Loading.vue'

  export default {

    name: 'Photo',

    components: {
      Loader
    },

    data() {
      return {
        lastScrollFired: 0,
        minScrollInterval: 2000,
        scrollTimer: null,
        index: 0,
        name: '',
        photoList: [
          'floral',
          'mom',
          'moody'
        ],
        latestDirectionUp: false,
        chromeListener: null,
        firefoxListener: null
      }
    },

    watch: {

      name: function(newName, oldName) {
        this.loadImage('/static/img/' + newName + '.jpg', newName, oldName);
      }

    },

    methods: {

      insertImage(source) {
        let container = $('#image-holder')[0];
        let newImage = document.createElement('img');

        newImage.className += 'photo ' + this.name;
        newImage.id = this.name;

        newImage.src = source;

        // Unfortunately this has to be here instead of the CSS...
        newImage.style = `
          position: absolute;
          bottom: 0;
          right: 0;
          top: 0; 
          left: 0;
          max-height: 100%;
          max-width: 100%;
          margin: auto;
          z-index: 8;
          opacity: 0;
        `;

        /*let mask = document.createElement('div');
        mask.id = 'mask-' + this.name;
        mask.style = `
          position: absolute;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          z-index: 6;
          opacity: 0;
          background-color: #111;
        `;

        container.append(mask)
        $('#mask-' + this.name)[0].append(newImage);*/

        container.append(newImage);
      },


      loadImage(fullFilePath, newName, oldName) {

        // Make the polar bears come back!
        let bearAnime = anime({
          targets: '#loader',
          opacity: 1,
          duration: 1500,
          easing: 'linear'
        })

        $('#loader')[0].style['z-index'] = 12;
        $('#imageLoaded')[0].style['z-index'] = -1;

        let that = this;

        let downloadingImage = new Image();
        downloadingImage.onload = () => {

          that.insertImage(downloadingImage.src);

          // Fade the photo away.
          if (oldName) {

            if (!that.latestDirectionUp) {
              let photoAnime = anime({
                targets: '#' + oldName,
                marginBottom: '100%',
                duration: 3000,
                easing: 'easeOutQuad',
                complete: () => {
                  $('#' + oldName).remove()
                }
              })
            }
            else {
              let photoAnime = anime({
                targets: '#' + oldName,
                marginTop: '100%',
                duration: 2000,
                easing: 'easeOutQuad',
                complete: () => {
                  $('#' + oldName).remove()
                }
              })
            }

            let target = $('#' + oldName)[0];
            target.removeEventListener('mousewheel', that.chromeListener)
            target.removeEventListener('DOMMouseScroll', that.firefoxListener)
          }

          // Make the polar bears disappear :(
          let bearAnime = anime({
            targets: '#loader',
            opacity: 0,
            duration: 1500,
            easing: 'linear'
          })

          $('#loader')[0].style['z-index'] = -1;
          $('#imageLoaded')[0].style['z-index'] = 12;
          $('#imageLoaded')[0].style.opacity = 1;

          // Make the photo visible.
          let photoAnime = anime({
            targets: '#' + newName,
            opacity: 1,
            easing: 'linear',
            duration: 2000,
            complete: () => {
              $('#' + newName)[0].style.zIndex = 12;
              //$('#mask-' + newName)[0].style.opacity = 1;
              //$('#mask-' + newName)[0].style.zIndex = 11;
            }
          })

          setTimeout(() => {
            let eventTarget = $('#' + that.name)[0];
            // IE9, Chrome, Safari, Opera
            eventTarget.addEventListener("mousewheel", that.chromeListener);
            // Firefox
            eventTarget.addEventListener("DOMMouseScroll", that.firefoxListener);
          }, 2000);
        }

        // Start downloading the image.
        downloadingImage.src = fullFilePath;
      },

      // Show the poem.
      poem() {
        $('#overlay')[0].style['z-index'] = 11;

        let overlayAnime = anime({
          targets: '#overlay',
          opacity: 0.7,
          duration: 2000,
          easing: 'easeInOutQuart'
        })

      },

      // Take the poem away.
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

      // Go home!
      home() {
        let target = $('#' + this.name)[0];
        target.removeEventListener('mousewheel', this.chromeListener);
        target.removeEventListener('DOMMouseScroll', this.firefoxListener);
        target.remove()
        this.$router.push({ name: 'Home' })
      },

      // Animate the buttons in.
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

      // Animate the buttons away.
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

      },

      handleScroll(event) {

        let that = this;
        let now = new Date().getTime();

        let process = (event) => {

          // Keep track of the most recent scroll event.
          that.lastScrollFired = new Date().getTime();

          // Navigate to the next picture if the user scrolls down.
          if (event.deltaY >= 0) {
            ++that.index;

            that.latestDirectionUp = false;

            if (that.index !== that.photoList.length)
              that.name = that.photoList[that.index]
            else
              that.$router.push({ name: 'Art' });
          }

          // Otherwise go to the last picture.
          else {
            --that.index;

            that.latestDirectionUp = true;

            if (that.index >= 0)
              that.name = that.photoList[that.index]
            else
              that.$router.push({ name: 'Art' });
          }

        };

        // Ensure a single scroll can't move through all of the pictures at once.
        if (!this.scrollTimer) {
          if (now - this.lastScrollFired > (this.minScrollInterval)) {
            process(event);
          }
          else {
            this.scrollTimer = setTimeout(() => {
              this.scrollTimer = null;
            }, this.minScrollInterval);
          }
        }

      }

    },

    beforeDestroy() {
      console.log('destroy!')
      let target = $('#' + this.name)[0];
      target.removeEventListener('mousewheel', this.chromeListener);
      target.removeEventListener('DOMMouseScroll', this.firefoxListener);
    },

    mounted() {

      let that = this;
      this.chromeListener = (e) => { that.handleScroll(e) };
      this.firefoxListener = (e) => { that.handleScroll(e) };


      // Delay the scroll handlers by a couple seconds.
      /*setTimeout(() => {
        let eventTarget = $('#' + that.name)[0];
        // IE9, Chrome, Safari, Opera
        eventTarget.addEventListener("mousewheel", that.chromeListener);
        // Firefox
        eventTarget.addEventListener("DOMMouseScroll", that.firefoxListener);
      }, 2000);*/

      // Prevent right click.
      document.addEventListener("contextmenu", function(e){
        e.preventDefault();
      }, false);

      // Start loading the first picture.
      this.name = this.photoList[0];

    }

  }

</script>


<style scoped>

  html {
    height: 100vh;
    overflow: hidden;
    background-color: #111;
  }

  body {
    height: 100%;
    overflow: hidden;
  }

  #loader {
    opacity: 1;
    z-index: 2;
  }

  #imageLoaded {
    opacity: 0;
    position: relative;
    z-index: 10;
    width: 100%;
    height: 100%;
  }

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
    position: relative;
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
    z-index: 17;
  }

  img {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0;
    max-height: 100%;
    max-width: 100%;
    margin: auto;
    overflow: auto;
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
