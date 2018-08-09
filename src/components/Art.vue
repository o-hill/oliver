<template>
  <div id='wrapper' style='position:fixed;top:0;left:0;width:100%;height:100%;'>
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
      <div id='photo-scroll'>
        <div id='scroll-line'></div>
        <p id='photo-text'>Scroll down to see photography...</p>
      </div>
    </v-layout>
  </div>
</template>


<script>

  export default {

    name: 'Art',

    data() {
      return {
        photoList: [
          'floral',
          'mom',
          'moody'
        ],
        lastScrollFired: 0,
        minScrollInterval: 2000,
        scrollTimer: null,
        chromeListener: null,
        firefoxListener: null
      }
    },

    methods: {

      // Fisher-Yates shuffling algorithm.
      shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }

        return array;
      },

      handleScroll(event) {

        let that = this;
        let now = new Date().getTime();

        let process = (event) => {
          console.log('process')
          that.lastScrollFired = new Date().getTime();

          if (event.deltaY >= 0) {
            //that.activePhotos.push(that.photos[++that.currentPhoto]);

            that.$router.push({ name: 'photo', params: {
              photoList: $.extend(true, [ ], that.photoList)
            }});

            //anime.remove('html, body');
            /*let scrollAnime = anime({
              targets: 'html, body',
              scrollTop: [window.pageYOffset, '+=' + window.innerHeight]
            });*/
          }
          else {
            /*let scrollAnime = anime({
              targets: 'html, body',
              scrollTop: [window.pageYOffset, '-=' + window.innerHeight]
            });*/
          }

        };

        if (!this.scrollTimer) {
          if (now - this.lastScrollFired > (this.minScrollInterval)) {
            console.log('time interval: ', now - this.lastScrollFired)
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
      let target = $('#wrapper')[0];

      target.removeEventListener('mousewheel', this.chromeListener);
      target.removeEventListener('DOMMouseScroll', this.firefoxListener);
    },
      

    mounted() {

      let that = this;

      this.chromeListener = (e) => { that.handleScroll(e) };
      this.firefoxListener = (e) => { that.handleScroll(e) };

      setTimeout(() => {
        let target = $('#wrapper')[0];
        // IE9, Chrome, Safari, Opera
        target.addEventListener("mousewheel", that.chromeListener);
        // Firefox
        target.addEventListener("DOMMouseScroll", that.firefoxListener);
      }, 2000);

      // Randomize the photos.
      this.shuffle(this.photoList);
    }

  }

</script>



<style scoped>

  html {
    background-color: #111;
  }

  #photo-scroll {
    position: absolute;
    bottom: 0;
    left: 5%;
    height: 50px;
  }

  #photo-text {
    white-space: nowrap;
    margin-top: 20px;
    margin-left: 10px;
    color: white;
    font-family: 'Lora', serif;
    font-size: 12px;
  }

  #scroll-line {
    position: absolute;
    background-color: white;
    height: 100%;
    width: 1px;
  }

  .slide-enter {
    transform: translate(100%, 0);
  }

  #title {
    font-size: 25px;
    font-family: 'Playfair Display', serif;
    color: white;
  }

  #artCard {
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
    font-family: 'Lora', serif;
    color: #dddddd;
    margin: 10px;
  }


</style>
