<template>
  <v-layout>
    <transition name='fade'>
      <div id='resume-mask' class='mask' v-if='showResume'>
        <resume></resume>
      </div>
    </transition>
    <transition name='fade'>
      <div id='project-mask' class='mask' v-if='showProjects'>
        <projects></projects>
      </div>
    </transition>
    <transition name='fade'>
      <div id='thoughts-mask' class='mask' v-if='showThoughts'>
        <thoughts></thoughts>
      </div>
    </transition>
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
  import Resume from './Resume.vue';
  import Projects from './Projects.vue';
  import Art from './Art.vue';
  import Thoughts from './Test.vue';
  import Vue from 'vue';
  import anime from 'animejs';


  export default {

    name: 'Homepage',

    components: {
      MenuLink,
      Art,
      Resume,
      Projects,
      Thoughts
    },

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
        showResume: false,
        showProjects: false,
        showThoughts: false,
        keepColor: false,
        maxRadius: 10,
        numAgents: 100,
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

      resetSpace() {
        this.showResume = false;
        this.showProjects = false;
      },

      enter() {
        var fadeOverlay = anime({
          targets: '#entrance',
          opacity: 0,
          duration: 1000,
          easing: 'linear',
          complete: function() {
            $('#entrance')[0].style['z-index'] = -1;
          }
        });
      },

      navigateAway(name) {

        this.resetSpace();
        this.keepColor = true;

        if (name === 'Art')
          this.$router.push({ name: name });
        else if (name == 'Resume') {
          this.showResume = true;
          setTimeout(() => {
            $('#resume-mask')[0].style.zIndex = 90;
          }, 200);
        }
        else if (name == 'Projects') {
          this.showProjects = true;
          setTimeout(() => {
            $('#project-mask')[0].style.zIndex = 90;
          }, 200);
        }
        else if (name == 'Thoughts') {
          this.showThoughts = true;
          setTimeout(() => {
            $('#thoughts-mask')[0].style.zIndex = 90;
          }, 200);
        }
      },

      beginNewLife(env) {

        let that = this;
        let svg = d3.select('svg')

        for (var i = 0; i < this.agents.length; ++i) {
          this.agents[i].slow(3)
          this.agents[i].act(Math.floor(Math.random() * 4), 20)
        }

        for (var i = 0; i < 200; ++i) {
          this.agents.push(new Agent.Agent(
            window.innerWidth,
            window.innerHeight,
            this.maxRadius,
            this.x,
            this.y,
            Math.random
          ));

          this.agents[i + this.numAgents].slow(3);
        }

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
              that.agents[i].act(Math.floor(Math.random() * 4), 3)

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

        // Make the circles float aimlessly around screen.
        setTimeout(function() {
          var intervalId = setInterval(function() {

            for (var i = 0; i < that.agents.length; ++i)
              that.agents[i].act(Math.floor(Math.random() * 4));

            that.draw(that.transitionSpeed * 3);

          }, 10);
        }, 2000);
      },

      showTools() {

        this.showName = !this.showName;

        // Animate the links in.
        var linksAnime = anime({
          targets: '#tools .item',
          marginLeft: 0,
          duration: 1000,
          easing: 'easeInOutQuart',
          delay: function(el, i, l) {
            return i * 200;
          }
        });

        // Reset the html background to black.
        $('html')[0].style.backgroundColor = '#000000';

        var htmlAnime = anime({
          targets: '#background',
          opacity: 0,
          duration: 3000
        })

        this.learn = false;
        this.showInfo = false;


      },

      initializeAgents() {

        let svg = d3.select('svg');
        let that = this;
        let agents = this.agents;

        var gaussianRandom = () => {
          let sample = 0.0;
          for (var i = 0; i < 4; ++i) 
            sample += Math.random()

          return sample / 4;
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
        }

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

        let distance = (agentOne) => {

          let dx = agentOne.x - that.x,
            dy = agentOne.y - that.y;

          return Math.sqrt((dx * dx) + (dy * dy));
        };

        // Approximate the farthest distance.  This isn't quite correct, but good enough.
        this.maxDistance = Math.max(distance({x: this.maxWidth, y: this.maxHeight}),
                                  distance({x: 0, y: 0}));

        var env = { };
        env.getMaxNumActions = () => { return actionSpace; };
        env.getNumStates = () => { return numStates; };

        env.calculateReward = (currentAgent) => {

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

      // Run the simulation.
      simulate(env, spec) {

        let that = this;
        let actor = new RL.DQNAgent(env, spec);

        var interval = setInterval(() => {

          for (var i = 0; i < that.numAgents; ++i) {

            // Find the optimal action in the current state.
            let action = actor.act(that.agents[i].getState());

            // Take the action.
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
          .style('opacity', function(d) { return d.opacity; })
      }
    },

    mounted() {

      console.log('mounting...')

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

    }
  }

</script>


<style>

  .mask {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: scroll;
    margin: auto;
    right: -17px;
  }

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
    overflow: hidden;
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
    z-index: 100 ;
  }

  #tools {
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    width: 10%;
    z-index: 100;
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
