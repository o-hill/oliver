<template>
  <v-layout>
    <svg id='overlay' height='100vh' width='100vw'>
      <rect x=300 y=300 height=10 width=10 fill='#ff0000'></rect>
      <rect width='100%' fill='#273239'></rect>
    </svg>
    <div id='name'>
      <p id='oliver'>Oliver</p>
      <div id='line'></div>
      <span></span>
    </div>
    <v-card
      v-if='showInfo'
      class='grey darken-4 blue-grey--text text--lighten-3'
      style='position:fixed;bottom:8%;left:2%;z-index:0'>
      <v-card-title class='welcome'>Welcome!</v-card-title>
      <div class='sep'></div>
      <v-card-text><p class='text-lg-left descriptor'>
        This is an implementation of a Reinforcement Learning
        technique <br /> called Epsilon-Greedy Deep Q-Network Learning. <br />
        The circles are being controlled by a Neural Network, which
        is <br /> learning to cluster the circles around a point in the
        top left of the screen. <br /> This happens very slowly, but if you
        leave this page up for a few hours, <br /> they'll all end up in the same place!<br />
        <br />If you'd like to learn more about this project, click
        the button below.
      </p></v-card-text>
      <v-btn flat icon
        style='margin-bottom:20px;margin-top:0px;'><v-icon large>fab fa-github</v-icon></v-btn>
    </v-card>
    <v-btn 
      flat icon
      style='position:fixed;left:2%;bottom:2%;z-index:0;'
      color='blue-grey darken-2'
      @click.native='showInfo = !showInfo'>
      <v-icon>info</v-icon>
    </v-btn>
  </v-layout>
</template>


<script>

  import { R, RL } from './rl.js';

  export default {

    data() {
      return {
        showInfo: false,
        maxRadius: 12,
        numAgents: 250,
        actionSpace: 4,
        stateSpace: 4 * this.numAgents,
        maxHeight: window.innerHeight,
        maxWidth: window.innerWidth,
        aggregateReward: [ ],
        x: 0,
        y: 0,

        // How far an agent can move in a single D3 transition.
        transitionSpeed: 300,

        // Radius for another agent to be within to get a positive reward.
        closeEnough: 10,

        // Farthest distance an agent can be from another agent.
        maxDistance: Math.sqrt((window.innerHeight * window.innerHeight) + (window.innerWidth * window.innerWidth))
      }
    },

    methods: {

      leaving() {
        console.log(JSON.stringify(this.aggregateReward));
        alert('Get the reward dump!');
        return 'Get the reward dump!';
      },

      initializeAgents() {

        let svg = d3.select('svg');
        let that = this;
        let agents = [ ];

        for (let i = 0; i < this.numAgents; ++i) {

          // Find the starting position of the new agent.
          agents.push({
            'x': Math.floor(Math.random() * window.innerWidth),
            'y': Math.floor(Math.random() * window.innerHeight),
            'radius': Math.floor(Math.random() * this.maxRadius) + 5,
            'vx': (Math.random() * 50) * 0.1 - 0.05,
            'vy': (Math.random() * 50) * 0.1 - 0.05,
            'prevDistance': 1680
          });
        }

        var gaussianRandom = () => {
          let sample = 0.0;
          for (var i = 0; i < 6; ++i) 
            sample += Math.random()

          return sample / 6;
        }

        var draw = function(selection) {
          selection
            .attr('r', function(d, i) { return d.radius; })
            .attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; })
            .style('opacity', function(d) { return gaussianRandom(); })
        };

        var circle = svg.selectAll('circle')
          .data(agents)

        circle.enter().append('circle')
          .attr('r', 0)
          .attr('cx', function(d) { return d.x; })
          .attr('cy', function(d) { return d.y; })
          .attr('fill', '#ffffff')
          .transition().duration(that.transitionSpeed).call(draw)

        return agents;
      },


      initializeSpec() {

        let spec = {
          alpha: 0.001, // Learning rate.
          gamma: 0, // Maximally greedy policy.
          num_hidden_units: 128, // Size of the networks hidden layer.
          nIter: 0,

          // Start at 0.30 and slowly decay to around 0.05.
          epsilon: function() { return (0.4 - (0.35 * (this.nIter / 1000000))); }
        };

        return spec;
      },


      initializeEnvironment() {
        let that = this;
        let numStates = 4;
        let actionSpace = 4;

        let distance = function(agentOne, agentTwo) {

          // let dx = agentOne.x - agentTwo.x,
          //  dy = agentOne.y - agentTwo.y;

          let dx = agentOne.x - that.x,
            dy = agentOne.y - that.y;

          return Math.sqrt((dx * dx) + (dy * dy));
        };

        this.maxDistance = distance({x:this.maxWidth, y:this.maxHeight}, {});

        var env = { };
        env.getMaxNumActions = function() { return actionSpace; };
        env.getNumStates = function() { return numStates; };

        env.step = function(agent, action) {

          if (action == 0)
            agent.x += agent.vx;
          else if (action == 1)
            agent.x -= agent.vx;
          else if (action == 2)
            agent.y += agent.vy;
          else // action == 3
            agent.y -= agent.vy;

          // Keep the agents contained.
          if (agent.x > that.maxWidth)
            agent.x = that.maxWidth - 10;
          else if (agent.x < 0)
            agent.x = 10;

          if (agent.y > that.maxHeight)
            agent.y = that.maxHeight - 10;
          else if (agent.y < 0)
            agent.y = 10;

          return agent;
        };

        env.calculateReward = function(agents, currentAgent) {

          // Get the distance between two agents.
          let distance = function(agentOne, agentTwo) {

            // let dx = agentOne.x - agentTwo.x,
            //  dy = agentOne.y - agentTwo.y;

            let dx = agentOne.x - that.x,
              dy = agentOne.y - that.y;

            return Math.sqrt((dx * dx) + (dy * dy));
          };

          let totalReward = 0.0;

          let agentDistance = distance(agents[currentAgent], agents[0]);

          if (agentDistance < 80)
            totalReward = 3;
          else if (agentDistance < agents[currentAgent].prevDistance)
            totalReward = 1 - (agentDistance / that.maxDistance)
          else
            totalReward = -3 - (agentDistance / that.maxDistance)

          agents[currentAgent].prevDistance = agentDistance;
          return totalReward;
        };

        return env;
      },

      getAgentState(agent) {
        return [agent.x, agent.y];
      },

      getCurrentState(agents) {
        let state = [ ];

        for (let i = 0; i < this.numAgents; ++i) {
          state.push(agents[i].x);
          state.push(agents[i].y);
          state.push(agents[i].vx);
          state.push(agents[i].vy);
        }

        return state;
      },

      // Run the simulation.
      simulate(agents, env, spec) {

        let that = this;
        /*let actors = [ ];
        for (var i = 0; i < this.numAgents; ++i) {
          actors.push(new RL.DQNAgent(env, spec));
        }*/

        let actor = new RL.DQNAgent(env, spec);

        // let currentState = this.getCurrentState(agents);

        setInterval(function() {
          var rewards = 0.0;

          if (spec.nIter % 10000 == 0) {
            this.x = (Math.random() * (window.innerWidth * 0.5)) + (window.innerWidth * 0.25)
            this.y = (Math.random() * (window.innerHeight * 0.5)) + (window.innerHeight * 0.25)
          }

          for (var i = 0; i < that.numAgents; ++i) {
            let currentState = that.getAgentState(agents[i]);
            let action = actor.act(currentState);

            agents[i] = env.step(agents[i], action);
            let reward = env.calculateReward(agents, i);
            rewards += reward;

            actor.learn(reward);
          }

          spec.nIter += 1;

          // currentState = that.getCurrentState(agents);
          that.aggregateReward.push(rewards / that.numAgents);
          console.log('Reward: ', rewards / that.numAgents);
          console.log('Iteration: ', spec.nIter);

          that.draw(agents);
        }, 10);
      },

      // Draw the agents.
      draw(agents) {

        let that = this;
        let svg = d3.selectAll('svg');

        var circle = svg.selectAll('circle')
          .data(agents)
          .transition().duration(that.transitionSpeed)
          .ease(d3.easeLinear)
          .attr('cx', function(d) { return d.x; })
          .attr('cy', function(d) { return d.y; })

        return agents;
      }
    },

    mounted() {

      // this.x = (Math.random() * (window.innerWidth * 0.5)) + (window.innerWidth * 0.25)
      // this.y = (Math.random() * (window.innerHeight * 0.5)) + (window.innerHeight * 0.25)
      this.x = window.innerHeight * 0.66;
      this.y = window.innerWidth * 0.5;

      console.log('(x,y): (', this.x, ', ', this.y, ')')

      let that = this;
      window.onbeforeunload = () => {
        that.leaving();
        return 'Get the reward array!';
      }

      let agents = this.initializeAgents();
      let env = this.initializeEnvironment();
      let spec = this.initializeSpec();

      this.simulate(agents, env, spec);
    }
  }

</script>


<style>

  body {
    margin: 0;
    overflow: hidden;
  }

  svg {
    position: absolute;
    top: 0px;
    left: 0px;
    margin: 0px;
  }

  .sep {
    width: 90%;
    height: 1px;
    background: #B0BEC5;
    margin-left: 20px;;
  }

  .welcome {
    font-family: 'Playfair Display', serif;
    font-size: 25px;
    padding-bottom: 3px;
  }

  #name {
    position: fixed;
    top: 33%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
  }

  #line {
    width: 95%;
    height: 3px;
    z-index: 0;
    background: #2A3238;
    margin: auto;
  }

  #oliver {
    font-family: 'Playfair Display', serif;
    font-size: 100px;
    margin: 0;
    height: 120px;
    /*color: #404F4F;*/
    color: #2A3238;
  }

</style>
