# oliver

This is the code for my personal website, which will be hosted at oliverhill.io at some point.

## Home Page

The home page implements a classic Reinforcement Learning algorithm called Epsilon-Greedy Deep Q-Network Learning.  I would like to be clear that I did not write the RL component to this - I just set up the environment for it to work in.  All the neural network components were written by Andrej Karpathy, and you can [find the library here](https://github.com/karpathy/reinforcejs).

As a brief introduction to Reinforcement Learning, the goal of this field of Machine Learning
is to have a computer learn a policy of how to act, given some state and some reward based
on previous actions.  This problem setup is modeled on a statistical construct known as a  [Finite Markov Decision Process](https://en.wikipedia.org/wiki/Markov_decision_process).  To learn more about the general problem of Reinforcement Learning and what it can be used for, check out the [wikipedia page here](https://en.wikipedia.org/wiki/Reinforcement_learning).

![Image](https://d3ansictanv2wj.cloudfront.net/image3-5f8cbb1fb6fb9132fef76b13b8687bfc.png)

### Process

When I originally approached this project, I wanted to write my own implementation of an RL algorithm, and have it run on my site.  [Q-Learning](https://en.wikipedia.org/wiki/Q-learning) seemed like the right choice, since the problem is seemingly simple (have circles learn to cluster together), and Q-Learning is fairly basic in the spectrum of RL algorithms, being much simpler to implement than a Policy-Gradient method like Trust Region Policy Optimization. My initial hope was also to not use any neural networks in the solution, but that quickly collapsed after exploring the problem more.  

Q-Learning revolves around finding the 'quality' of an action at each state. Ideally, the computer would learn that the highest quality move at each state is to move closer to the centroid of the cluster.

The Q-Learning update looks like this:
$$Q_{new}(s_t, a_t) = (1 - \alpha) \cdot Q(s_t, a_t) + \alpha (r_t + \gamma 
\cdot \text{max}_{a}Q(s_{t + 1}, a_t))$$
Where $s_t$ is the state of the environment at time step $t$, $a_t$ is the action taken by the agent at time step $t$, $\alpha$ is the learning rate of the system, $r_t$ is the agents reward for taking action $a$ at time step $t$, $\gamma$ is the discount factor (check out the RL wiki page for more on this), and $Q(s,a)$ is the quality of the action $a$ taken with state $s$.  

So essentially the computer is learning to maximize the quality of each action it takes, and that quality is dependent on the last value of quality we had for this action, the reward we get for this action, and the expected quality in the next state.

My first idea was to implement Tabular Q-Learning for this task.  Tabular Q-Learning is simple to implement (no need to include back-propagated neural networks), and relies upon explicitly storing the quality of each state.  This is great for a problem with a small state space, but my problem involves a discrete state at each pixel of the screen, which equates to 5,184,000 states on my computer! If we're lucky, the alignment would work out and the table storing the data would end up being around 42 megabytes in size - far too large for this application.

