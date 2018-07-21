<template>
  <v-layout>
    <div id='entrance' @click='enter()'>
      <p id='gatekeeper'>Roots, fallen branches<br/>
        Vermillion leaves falling <br/>
        Soft earth underfoot <br/>
        <br/>
        Pinecones suspended <br/>
        Trees older than memory <br/>
        Stories passed along <br/>
        <br/><br/>(click)</p>
    </div>
    <svg id='overlay' height='100vh' width='100vw'>
      <rect id='background' width='100%' fill='#273239'></rect>
    </svg>
    <art v-if='showArt'></art>
    <transition name='fade'>
      <div v-if='showName' id='name'>
        <span 
          onmouseover="this.style.cursor='pointer'"
          onmouseout="this.style.cursor='default'"
          @click='showTools()'
          ><p id='oliver' class='fade-out'>Oliver</p></span>
        <div id='line' class='fade-out'></div>
        <span></span>
      </div>
    </transition>
    <transition name='fade'>
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
        <a href='https://github.com/o-hill/oliver' target='_blank'><v-btn flat icon
          style='margin-bottom:20px;margin-top:0px;'><v-icon large>fab fa-github</v-icon>
        </v-btn></a>
      </v-card>
    </transition>
    <v-btn 
      flat icon
      v-if='showInfoButton'
      style='position:fixed;left:2%;bottom:2%;z-index:0;'
      color='blue-grey'
      @click.native='showInfo = !showInfo'>
      <v-icon>info</v-icon>
    </v-btn>
    <div id='tools' class='tools white--text'>
      <div class='outer' style='width:100%;'>
        <menu-link v-for='item in toolsList' 
          :key='item.id' 
          :id='item.id' 
          :name='item.name' 
          :agents='agents' 
          :title='item.title'
          v-on:navigate='navigateAway'>
        </menu-link>
      </div>
    </div>
  </v-layout>
</template>


<script>

  import { Agent } from './agent.js';
  import { R, RL } from './rl.js';
  import MenuLink from './Links.vue';
  import Art from './Art.vue';
  import Vue from 'vue';
  import anime from 'animejs'


  export default {

    name: 'Homepage',

    components: {
      MenuLink,
      Art
    },

    props: [
      'originalRequest'
    ],

    data() {
      return {
        toolsList: [
          { id: 'item0', name: 'projects', title: 'Projects' },
          { id: 'item1', name: 'resume', title: 'Resume' },
          { id: 'item2', name: 'art', title: 'Art' },
          { id: 'item3', name: 'thoughts', title: 'Thoughts' }
        ],
        numTools: 4,
        showName: true,
        showInfo: false,
        showInfoButton: true,
        showArt: false,
        maxRadius: 12,
        numAgents: 150,
        actionSpace: 4,
        stateSpace: 4 * this.numAgents,
        maxHeight: window.innerHeight,
        maxWidth: window.innerWidth,
        aggregateReward: [ ],
        x: 0,
        y: 0,
        agents: [ ],
        learn: true,

        // How far an agent can move in a single D3 transition.
        transitionSpeed: 300,

        // Radius for another agent to be within to get a positive reward.
        closeEnough: 10,

        // Farthest distance an agent can be from another agent.
        maxDistance: Math.sqrt((window.innerHeight * window.innerHeight) + (window.innerWidth * window.innerWidth))
      }
    },

    methods: {


      enter() {
        var fadeOverlay = anime({
          targets: '#entrance',
          opacity: 0,
          duration: 3000,
          complete: function() {
            $('#entrance')[0].style['z-index'] = -1;
          }
        });
      },

      navigateAway(name) {
        console.log(name)
        let that = this;

        // Reset the html background to black.
        $('html')[0].style.backgroundColor = '#000000';

        // Transition from normal to black background.
        let current = { opacity: 1 };
        let target = { opacity: 0 };
        var backgroundTween = new TWEEN.Tween(current)
          .to(target, 1000)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(function() {
            $('#background')[0].style.opacity = current.opacity
          }).start()
        this.animate()

        // Stop the reinforcement learning movement.
        this.learn = false;
        this.showInfoButton = false;

        if (name == 'art')
          setTimeout(function() { that.showArt = true; }, 1000);
      },

      beginNewLife(env) {

        let that = this;
        let svg = d3.select('svg')

        for (var i = 0; i < this.agents.length; ++i) {
          //this.agents[i] = env.step(this.agents[i], Math.floor(Math.random() * 4), 20)
          this.agents[i].vx /= 2;
          this.agents[i].vy /= 2;
          this.agents[i].act(Math.floor(Math.random() * 4), 20)
        }

        // Add more circles for fun!
        /*for (var i = 0; i < 200; ++i)
          this.agents.push({
            'x': Math.floor(Math.random() * window.innerWidth),
            'y': Math.floor(Math.random() * window.innerHeight),
            'radius': Math.floor(Math.random() * this.maxRadius) + 5,
            'vx': (Math.random() * 50) * 0.1 - 0.05,
            'vy': (Math.random() * 50) * 0.1 - 0.05,
            'prevDistance': 1680,
            'color': '#ffffff'
          });*/

        for (var i = 0; i < 200; ++i)
          this.agents.push(new Agent.Agent(
            window.innerWidth,
            window.innerHeight,
            this.maxRadius,
            this.x,
            this.y,
            Math.random
          ));

        // Move all the circles to random locations and make them tiny.
        let circle = svg.selectAll('circle')
          .data(that.agents)

        circle.enter().append('circle')
          .attr('cx', function(d) { return d.x; })
          .attr('cy', function(d) { return d.y; })
          .attr('r', function(d) { return d.radius / 3; })
          .style('opacity', function() { return Math.random(); })
          .style('fill', '#000000')
          .call(function(selection) {

            for (var i = that.numAgents; i < that.agents.length; ++i)
              that.agents[i] = env.step(that.agents[i], Math.floor(Math.random() * 4), 3)

            selection.transition().duration(3000)
              .attr('cx', function(d) { return d.x; })
              .attr('cy', function(d) { return d.y; })
              .style('fill', '#ffffff')
          })

        circle.transition().duration(2000)
          .ease(d3.easeQuadInOut)
          .attr('cx', function(d) { return d.x; })
          .attr('cy', function(d) { return d.y; })
          .attr('r', function(d) { return d.radius / 4; })
          .style('fill', '#ffffff')

        console.log('past update')

        // Make the circles float aimlessly around screen.
        setTimeout(function() {
          var intervalId = setInterval(function() {

            for (var i = 0; i < that.agents.length; ++i)
              that.agents[i] = env.step(that.agents[i], Math.floor(Math.random() * 4));

            that.draw(that.transitionSpeed * 3);

          }, 10);
        }, 2000);
      },

      animate() {
		var id = requestAnimationFrame(this.animate);
		var result = TWEEN.update();
		if (!result) return;
	  },

      showTools() {

        this.showName = !this.showName;

		var tweenGenerator = function(id) {

          let position = { x: 100 },
            target = { x: 0 };

          var tween = new TWEEN.Tween(position)
            .to(target, 600)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function() {
              $(id)[0].style.marginLeft = position.x + '%';
            })

          return tween;
        }

        let tweens = [ ];
        for (var i = 0; i < this.numTools; ++i) {
          tweens.push(tweenGenerator('#item' + i))

          if (i > 0) {
            tweens[i].delay(200 * i);
            //tweens[i - 1].chain(tweens[i]);
          }
        }

        for (var i = 0; i < this.numTools; ++i)
          tweens[i].start();

        this.animate();

      },

      initializeAgents() {

        console.log('initialize');

        let svg = d3.select('svg');
        let that = this;
        let agents = this.agents;

        var gaussianRandom = () => {
          let sample = 0.0;
          for (var i = 0; i < 6; ++i) 
            sample += Math.random()

          return sample / 6;
        }

        for (let i = 0; i < this.numAgents; ++i) {

          this.agents.push(new Agent.Agent(
            window.innerWidth,
            window.innerHeight,
            this.maxRadius,
            this.x,
            this.y,
            gaussianRandom
          ));

          // Find the starting position of the new agent.
          /*agents.push({
            'x': Math.floor(Math.random() * window.innerWidth),
            'y': Math.floor(Math.random() * window.innerHeight),
            'radius': Math.floor(Math.random() * this.maxRadius) + 5,
            'vx': (Math.random() * 50) * 0.1 - 0.05,
            'vy': (Math.random() * 50) * 0.1 - 0.05,
            'prevDistance': 1680,
            'color': '#ffffff'
          });*/
        }

        console.log(this.agents);

        var circle = svg.selectAll('circle')
          .data(this.agents)

        circle.enter().append('circle')
          .attr('r', function(d) { return d.radius; })
          .attr('cx', function(d) { return d.x; })
          .attr('cy', function(d) { return d.y; })
          .attr('fill', '#ffffff')
          .style('opacity', function(d) { return d.opacity; })

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

        let distance = function(agentOne) {

          let dx = agentOne.x - that.x,
            dy = agentOne.y - that.y;

          return Math.sqrt((dx * dx) + (dy * dy));
        };

        this.maxDistance = Math.max(distance({x: this.maxWidth, y: this.maxHeight}),
                                  distance({x: 0, y: 0}));

        var env = { };
        env.getMaxNumActions = function() { return actionSpace; };
        env.getNumStates = function() { return numStates; };

        // Move the agent.
        env.step = function(agent, action, speedCoefficient = 1) {

          if (action == 0)
            agent.x += (agent.vx * speedCoefficient);
          else if (action == 1)
            agent.x -= (agent.vx * speedCoefficient);
          else if (action == 2)
            agent.y += (agent.vy * speedCoefficient);
          else // action == 3
            agent.y -= (agent.vy * speedCoefficient);

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

        env.calculateReward = function(currentAgent) {

          let totalReward = 0.0;
          let agentDistance = that.agents[currentAgent].distance();

          // Reward function!
          if (agentDistance < 80)
            totalReward = 3;
          else if (agentDistance < that.agents[currentAgent].prevDistance)
            totalReward = 1 - (agentDistance / that.maxDistance)
          else
            totalReward = -3 - (agentDistance / that.maxDistance)

          that.agents[currentAgent].prevDistance = agentDistance;
          return totalReward;
        };

        return env;
      },

      getAgentState(agent) {
        return [agent.x, agent.y];
      },

      // Run the simulation.
      simulate(env, spec) {

        let that = this;
        let actor = new RL.DQNAgent(env, spec);

        var interval = setInterval(function() {

          for (var i = 0; i < that.numAgents; ++i) {

            // Find the optimal action in the current state.
            let action = actor.act(that.agents[i].getState());

            //agents[i] = env.step(agents[i], action);
            that.agents[i].act(action);

            // Calculate the reward based on the action taken.
            let reward = env.calculateReward(i);

            // Backpropogate through the neural network to try and learn.
            actor.learn(reward);
          }

          spec.nIter += 1;

          // Arbitrary estimate?
          if (spec.nIter == 300)
            $('#line').removeClass('fade-out');

          that.draw();

          if (!that.learn) {
            clearInterval(interval)
            that.beginNewLife(env)
          }

        }, 10);

      },

      // Draw the agents.
      draw(transDuration = this.transitionSpeed) {

        let that = this;
        let svg = d3.selectAll('svg');

        var circle = svg.selectAll('circle')
          .data(that.agents)
          .transition().duration(transDuration)
          .ease(d3.easeLinear)
          .attr('cx', function(d) { return d.x; })
          .attr('cy', function(d) { return d.y; })
          .attr('fill', function(d) { return d.color; })
      }
    },

    mounted() {

      this.x = 300;
      this.y = 300;

      // Set up the reinforcement learning environment.
      //let agents = this.initializeAgents();
      this.initializeAgents();
      let env = this.initializeEnvironment();
      let spec = this.initializeSpec();

      // Run the environment.
      this.simulate(env, spec);

      // Fade the circles and name in.
      document.body.className += ' fade-out';
      $(function() {
        $('body').removeClass('fade-out');
        $('#oliver').removeClass('fade-out');
      });

      if (this.originalRequest === 'false') {
        this.showTools();
        this.navigateAway();
      }
    }
  }

</script>


<style>

  #entrance {
    position: absolute;
    z-index: 10;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0.8;
    background-color: #111;
  }

  #gatekeeper {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Lora', serif;
    color: white;
    font-size: 18px;
  }

  html {
    background-color: #273239;
  }

  .strike {
    position: absolute;
    top: 55%;
    right: 0%;
    background: white;
    width: 0%;
    height: 0.5px;
  }

  body {
    margin: 0;
    overflow: hidden;
    opacity: 1;
    transition: 0.5s opacity;
  }

  body.fade-out {
    opacity: 0;
    transition: none;
  }

  svg {
    position: absolute;
    top: 0px;
    left: 0px;
    margin: 0px;
  }

  .outer {
    position:absolute;
    top: 35%;
  }

  .item {
    position: relative;
    width: 100%;
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .sep {
    width: 90%;
    height: 1px;
    background: #B0BEC5;
    margin-left: 20px;;
  }

  .tools {
    font-family: 'Playfair Display', serif;
  }

  #tools {
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    width: 10%;
    z-index: 1;
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
    transition: all 1s ease;
  }

  #line {
    width: 90%;
    height: 3px;
    z-index: 0;
    background: #404F4F;
    margin: auto;
    transition: width 1s ease; /*background 30s ease-in-out;*/
  }

  #line.fade-out {
    width: 0%;
    /*background: #2A3238;*/
    transition: none;
  }

  #oliver {
    font-family: 'Playfair Display', serif;
    font-size: 100px;
    margin: 0;
    height: 120px;
    color: #404F4F;
    transition: 30s color ease-in-out;
  }

  #oliver.fade-out {
    color: #2A3238;
    transition: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .slide_up {
    opacity: 0;
  }

</style>
