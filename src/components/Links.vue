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
        this.$emit('navigate', this.name)
      },

      strikeThrough() {

        // Strike the work.
        let position = { width: 0 }, target = { };
        let name = '#' + this.name;

        if (name == '#art')
          target.width = 60;
        else
          target.width = 70;

        var tween = new TWEEN.Tween(position)
          .to(target, 400)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(function() {
            $(name)[0].style.width = position.width + '%';
          }).start()

        this.animate();

        // Color some random circles.
        var color = '';

        if (name == '#projects')
          color = '#d99278';
        else if (name == '#resume')
          color = '#357ba2';
        else if (name == '#art')
          color = '#ccaecf';
        else
          color = '#000000';

        for (var i = 0; i < 17; ++i) {
          let index = Math.floor(Math.random() * this.agents.length);
          this.agents[index].color = color;
        }

      },

      removeStrike() {

        let position = { }, target = { width: 0 };
        let name = '#' + this.name;

        if (name == '#art')
          position.width = 60;
        else
          position.width = 70;

        var tween = new TWEEN.Tween(position)
          .to(target, 400)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(function() {
            $(name)[0].style.width = position.width + '%';
          }).start()

        this.animate();

        // Remove coloring on the circles.
        for (var i = 0; i < this.agents.length; ++i)
          this.agents[i].color = '#ffffff';
      },

      animate() {
		var id = requestAnimationFrame(this.animate);
		var result = TWEEN.update();
		//if (!result) return;
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
