<script>

  export default {

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


        for (var j = 0; j < 100000; ++j) {
        // while (!converged) {

          svg.selectAll('circle').remove()
          for (var i = 0; i < this.numAgents; ++i) {

            // Randomly choose where to move for now.
            if (Math.random() > 0.5)
              agents[i]['cx'] += Math.floor(Math.random() * 2) == 1 ? 1 : -1;
            else
              agents[i]['cy'] += Math.floor(Math.random() * 2) == 1 ? 1 : -1;

            // Append an SVG element for this agent.
            svg.append('circle')
              .attr('cx', agents[i]['cx'])
              .attr('cy', agents[i]['cy'])
              .attr('r', 5)
              .style('fill', 'white')
          }

        }
      },


      runSimulation() {
        // Initialize agent positions in the browser.
        var agents = this.initializeAgents()

        // Run the reinforcement learning algorithm.
        this.moveAgents(agents)
      },

      argMax(array) {
        return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
      }
    },

    mounted() {

      let that = this;
      let epsilon = 0.5;
      let q_table = { };
      let actionSpace = [0, 45, 90, 135, 180, 225, 270, 315];

      //this.runSimulation();
      var container = d3.select('svg');
      var randomFromTo = function randomFromTo(from, to){
        return Math.floor(Math.random() * (to - from + 1) + from);
      };
      var newData = function() {
        var nD = [];
        for(var i = 0; i < that.numAgents; i++) {
          nD.push({
            "x": randomFromTo(10, 1680),
            "y": randomFromTo(10, 1000),
            "r": randomFromTo(2, 12),
            'theta': randomFromTo(0, 360),
            'speed': Math.random() * that.agentSpeed
          });

          q_table[nD['x']] = { }
          q_table[nD['x']][nD['y']] = new Array(actionSpace.length).fill(0)
        }
        return nD;
      };

      var q_update = function(cur_state, next_state, reward, action, q_table) {

        if (!(next_state['x'] in q_table)) {
          q_table[next_state['x']] = { };
        }
        if (!(next_state['y'] in q_table[next_state['x']])) {
          q_table[next_state['x']][next_state['y']] = new Array(actionSpace.length).fill(0);
          console.log('Created new array: ', q_table[next_state['x']][next_state['y']]);
        }

        let target = reward + (that.gamma * Math.max(q_table[next_state['x']][next_state['y']]))
        console.log('Action: ', action);
        console.log('Current state: ', cur_state);

        // Update the Q learning table based on what we have seen.
        q_table[cur_state['x']][cur_state['y']][action] = ((1 - that.alpha) * q_table[cur_state['x']][cur_state['y']][action]) + (that.alpha * target)
      }

      // Detect if a point is within a circle from the center.
      var within = function(point, center) {
        var xx = center['x'] - point['x'];
        xx *= xx;

        var yy = center['y'] - point['y'];
        yy *= yy;

        if (Math.sqrt(xx + yy) < center['speed']) {
          return true;
        }

        return false;
      }

      // Calculate the reward for this agent at the new position.
      var q_reward = function(positions, newPosition) {

        var totalReward = 0.0;
        for (var i = 0; i < that.numAgents; ++i) {
          if (within(positions[i], newPosition)) {
            reward += 1;
          }
        }

        return totalReward / that.numAgents;
      }


      var q_step = function(positions) {
        for (var i = 0; i < that.numAgents; ++i) {
          var actionChoice = 0;

          if (!(positions[i]['x'] in q_table)) {
            q_table[positions[i]['x']] = { };
          }
          if (!(positions[i]['y'] in q_table[positions[i]['x']])) {
            q_table[positions[i]['x']][positions[i]['y']] = new Array(actionSpace.length).fill(0);
          }
          

          // Explore if a random sample is greater than epsilon.
          if (Math.random() > epsilon) {
            actionChoice = Math.floor(Math.random() * that.numActions);
          }

          // Otherwise, exploit!
          else {

            // If we have data for this position we can exploit, otherwise still choose randomly.
            if (positions[i]['x'] in q_table && positions[i]['y'] in q_table[positions[i]['x']]) {
              actionChoice = that.argMax(q_table[positions[i]['x']][positions[i]['y']]);
            }
            else {
              actionChoice = Math.floor(Math.random() * that.numActions);
            }
          }

          let target = actionSpace[actionChoice];

          // Find the new x and y positions.
          let dist = positions[i]['speed']
          let target_rad = target * (Math.PI / 180)

          let newPosition = {
            'x': Math.floor(dist * Math.sin(target_rad) * (270 < target || target < 90) ? 1 : -1),
            'y': Math.floor(dist * Math.cos(target_rad) * (0 < target && target < 180) ? 1 : -1),
            'theta': target
          };

          let reward = q_reward(positions, newPosition);

          q_update(positions[i], newPosition, reward, actionChoice, q_table)
        }

        return positions
      }

      var step = function(positions) {
        for (var i = 0; i < that.numAgents; ++i) {

          // Find the appropriate directions this particle can move.
          var phi = Math.floor(Math.random() * 40)
          var target;
          if (phi < 45) {
            target = positions[i]['theta'] - phi
            if (target < 0) target += 360
          }
          else {
            target = positions[i]['theta'] + phi
            if (target >= 360) target -= 360
          }

          // Find the new x and y positions.
          var dist = positions[i]['speed']
          var target_rad = target * (Math.PI / 180)
          positions[i]['x'] += Math.floor(dist * Math.sin(target_rad) * (270 < target || target < 90) ? 1 : -1);
          positions[i]['y'] += Math.floor(dist * Math.cos(target_rad) * (0 < target && target < 180) ? 1 : -1);
          positions[i]['theta'] = target
        }

        return positions
      };

      var test = function(data) {
        var draw = function(selection) {
          selection
            .attr("r", function(d, i) { return d.r; })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .style('opacity', function(d) { return Math.random(); });
        };


        var circle = container.selectAll("circle")
          .data(data) //, function(d, i) { return i; });


        circle.enter().append("circle")
          .attr("r", 0)
          .attr("fill", '#000000')
          .transition().duration(that.transitionSpeed).call(draw);
      
        circle.transition().duration(that.transitionSpeed)
          .ease(d3.easeLinear)
          .call(draw);

        circle.exit()
          .transition().duration(that.transitionSpeed)
          .attr("r", 0)
          .remove();
      };

      var update = function(data) {

        var circle = container.selectAll('circle')
          .data(data)
          .transition().duration(500)
          .ease(d3.easeLinear)
          .attr('cx', function(d) { return d.x; })
          .attr('cy', function(d) { return d.y; })

        return data
      };

      var nodes = newData();
      test(nodes);

      var simulation = d3.forceSimulation(nodes)
        .force('collide', d3.forceCollide().radius(function(d) { return d.r + 0.5; }).iterations(2))
        .on('tick', ticked)

      function ticked(e) {
        container.selectAll('circle')
          .attr('cx', function(d) { return d.x + d.r; })
          .attr('cy', function(d) { return d.y + d.r; });
      };
      // iterate with new data every 3 sec
      setInterval(function() {
          nodes = q_step(nodes)
          update(nodes);
      }, that.agentSpeed);
    }
<script>
