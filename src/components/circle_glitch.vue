<template>
  <v-layout>
    <svg id='overlay' height='100vw' width='100vw'>
      <!-- <rect width='100%' height='100%' fill='#273239'></rect> -->
    </svg>
    <v-btn flat large color='white' @click.native='runSimulation'></v-btn>
  </v-layout>
</template>


<script>

  export default {

    data() {
      return {
        numAgents: 2,
        agents: { }
      }
    },

    methods: {

      initializeAgents() {

        var svg = d3.select('svg')
        var agents = { }

        for (var i = 0; i < this.numAgents; ++i) {

          // Find the starting position of the new agent.
          let positions = this.getRandomPosition();
          let x = positions[0], y = positions[1]

          // Append an SVG element for this agent.
          svg.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 5)
            .style('fill', 'white')

          // Keep the state of each agent.
          agents[i] = {
            'cx': x,
            'cy': y
          }
        }

        return agents
      },

      // Get a random position for an agent to start at.
      getRandomPosition() {

        // Find random positions within the range of the window.
        let x = Math.floor(Math.random() * Math.floor(window.innerWidth))
        let y = Math.floor(Math.random() * Math.floor(window.innerHeight))

        return [x, y]
      },

      moveAgents(agents) {

        var converged = false;
        let svg = d3.select('svg')
        let that = this

        console.log('In moveAgents')

        for (var j = 0; j < 100000; ++j) {
        // while (!converged) {

          svg.selectAll('circle').remove()
          for (var i = 0; i < this.numAgents; ++i) {

            //console.log('Before: ', agents[i]['cx'], agents[i]['cy'])
            // Randomly choose where to move for now.
            if (Math.random() > 0.5)
              agents[i]['cx'] += Math.floor(Math.random() * 2) == 1 ? 1 : -1;
            else
              agents[i]['cy'] += Math.floor(Math.random() * 2) == 1 ? 1 : -1;

            // Append an SVG element for this agent.
            //console.log('After: ', agents[i])
            svg.append('circle')
              .attr('cx', agents[i]['cx'])
              .attr('cy', agents[i]['cy'])
              .attr('r', 5)
              .style('fill', 'white')
          }

          console.log('Moved all agents')
        }
        console.log(agents)
        console.log(agents[0])
        console.log(agents[0]['cx'], agents[0]['cy'])
      },


      runSimulation() {
        // Initialize agent positions in the browser.
        var agents = this.initializeAgents()

        // Run the reinforcement learning algorithm.
        this.moveAgents(agents)
      }
    },

    mounted() {

      //this.runSimulation();
      var container = d3.select('svg');
      var randomFromTo = function randomFromTo(from, to){
          return Math.floor(Math.random() * (to - from + 1) + from);
      };
      var newData = function() {
          var nD = [];
          for(var i = 0; i < randomFromTo(10, 40); i++) {
              nD.push({
                  "x": randomFromTo(10, 1680),
                  "y": randomFromTo(10, 710),
                  "r": randomFromTo(5, 40)
              });
          }
          return nD;
      };
      var test = function(data) {
          var draw = function(selection) {
              selection
                      .attr("r", function(d, i) { return d.r; })
                      .attr("cx", function(d) { return d.x; })
                      .attr("cy", function(d) { return d.y; });
          };
          var circle = container.selectAll("circle")
                  .data(data, function(d, i) { return i; });
          circle.enter().append("circle")
                      .attr("r", 0)
                      .attr("fill", '#000000')
                  .transition().duration(500).call(draw);
          circle.transition().duration(500)
                  .ease(d3.easeLinear)
                  .call(draw);
          circle.exit()
                  .transition().duration(500)
                  .attr("r", 0)
                  .remove();
      };
      test(newData());
      // iterate with new data every 3 sec
      setInterval(function() {
          test(newData());
      }, 500);
    }

  }

</script>


<style>

  body {
    margin: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  svg {
    position: absolute;
    top: 0px;
    left: 0px;
    margin: 0px;
  }

</style>
