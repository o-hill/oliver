<template>
  <div class='item' :id='id' style='margin-left:100%;'>
    <a 
      onmouseover="this.style.cursor='pointer'"
      onmouseout="this.style.cursor='default'"
      @mouseenter='strikeThrough()' 
      @mouseleave='removeStrike()'
      @click='click()'>
      {{ title }}
    </a>
    <!-- <a>Projects</a> -->
    <div class='strike' :id='name'></div> 
  </div>
</template>


<script>

  import anime from 'animejs';

  export default {

    name: 'MenuLink',

    props: [
      'id',
      'name',
      'agents',
      'title'
    ],

    data() {
      return {
      }
    },

    methods: {

      click() {
        this.$emit('navigate', this.title)
      },

      strikeThrough() {

        // Strike the work.
        let name = '#' + this.name;
        let target = 0;

        if (name == '#art')
          target = 60;
        else
          target = 70;

        var strikeAnime = anime({
          targets: name,
          width: target + '%',
          duration: 400,
          easing: 'easeInOutQuart'
        });

        // Color some random circles.
        var color = '';

        if (name === '#projects')
          color = '#d99278';
        else if (name === '#resume')
          color = '#357ba2';
        else if (name === '#art')
          color = '#ccaecf';
        else
          color = '#000000';

        for (var i = 0; i < 175; ++i) {
          let index = Math.floor(Math.random() * this.agents.length);
          this.agents[index].color = color;
          this.agents[index].opacity = 1;
        }

      },

      removeStrike() {

        var strikeAnime = anime({
          targets: '#' + this.name,
          width: 0,
          duration: 400,
          easing: 'easeInOutQuart'
        });

        // Remove coloring on the circles.
        if (!this.$parent.keepColor) {
          for (var i = 0; i < this.agents.length; ++i) {
            this.agents[i].color = '#ffffff';
            this.agents[i].opacity = this.agents[i].originalOpacity;
          }
        }
        else {
          this.$parent.keepColor = false;
        }
      }

	}
  }


</script>


<style scoped>

  .strike {
    position: absolute;
    top: 55%;
    right: 0%;
    background: white;
    width: 0%;
    height: 1px;
  }

  .item {
    text-color: white;
    position: relative;
    width: 100%;
    margin-top: 30px;
    margin-left: 30px;
  }

</style>
