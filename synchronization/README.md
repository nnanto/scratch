# Emergent Synchronization: Pulsing Balls Simulation

An interactive p5.js simulation demonstrating emergent synchronization behavior in distributed systems. Watch as individual pulsing balls naturally self-organize into synchronized groups through local energy interactions—no central coordination required.

## The Emergent Behavior

This simulation showcases **emergent synchronization**, a fascinating phenomenon where individual agents (balls) achieve collective coordination through simple local rules:

- **No Central Control**: Each ball operates independently with its own pulse timer
- **Local Energy Transfer**: Balls share energy with nearby neighbors when they pulse
- **Adaptive Timing**: Higher energy levels cause balls to pulse faster
- **Refractory Periods**: Balls become temporarily unresponsive after pulsing
- **Natural Clustering**: Over time, nearby balls synchronize their pulses automatically

The result is a beautiful demonstration of how complex, coordinated behavior can emerge from simple individual interactions—similar to fireflies synchronizing their flashing or heart cells beating in rhythm.

## Getting Started

1. Open `index.html` in your web browser to view the simulation
2. Watch the emergent synchronization unfold naturally
3. For local development with live reload, use a local server

## Running with Live Server

### Option 1: Using Python (built-in)
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Option 2: Using Node.js
```bash
# Install live-server globally
npm install -g live-server

# Run live server
live-server
```

### Option 3: Using VS Code Live Server Extension
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html` and select "Open with Live Server"

## Project Structure

- `index.html` - Main HTML file that loads p5.js and the simulation
- `sketch.js` - Complete pulsing balls synchronization simulation
- `README.md` - This documentation

## Technical Implementation

### Core Classes
- **Ball Class**: Individual agent with energy, pulse timing, and synchronization tracking
- **Synchronization Analysis**: Real-time detection of synchronized groups
- **Energy Transfer System**: Distance-based coupling between nearby balls

### Key Parameters (Tunable)
- `numBalls`: Initial number of agents (default: 25)
- `energyRadius`: Range of influence for energy transfer (350px)
- `energyBoost`: Strength of energy coupling (0.3)
- `refractoryPeriod`: Unresponsive time after pulsing (200ms)
- `energyDecay`: Rate of energy loss over time (0.98)

## Interactive Features

Experience the emergent synchronization through:

### Visual Elements
- **Pulsing Balls**: Individual agents with varying pulse rates
- **Energy Rings**: Yellow arcs showing each ball's energy level
- **Color Coding**: 
  - Blue: Normal state
  - Pink/Red: Actively pulsing
  - Gray: Refractory period (cannot receive energy)
  - Enhanced brightness: Part of synchronized group
- **Influence Radius**: Debug mode shows energy transfer range

### Real-time Controls
- **Mouse Click**: Add new balls (right side only)
- **'c' Key**: Clear all balls and reset simulation
- **'d' Key**: Toggle debug mode (show influence radius)
- **'e' Key**: Toggle energy level text display

### Parameter Tuning
- **'1'/'2'**: Decrease/Increase base pulse interval
- **'3'/'4'**: Decrease/Increase energy transfer radius  
- **'5'/'6'**: Decrease/Increase energy boost strength
- **'7'/'8'**: Decrease/Increase refractory period

### Live Statistics
- Real-time count of active synchronized groups
- Individual ball energy levels
- System parameters display

## The Science Behind It

This simulation models several key principles of emergent systems:

1. **Local Interactions**: Each ball only "knows" about nearby neighbors
2. **Energy Coupling**: Pulsing transfers energy to nearby balls
3. **Positive Feedback**: Higher energy → faster pulsing → more energy transfer
4. **Temporal Constraints**: Refractory periods prevent immediate re-triggering
5. **Decay Mechanisms**: Energy naturally decreases over time without reinforcement

The emergent synchronization occurs because:
- Balls near synchronized groups receive more frequent energy
- This accelerates their pulse rate toward the group frequency
- Eventually they join the synchronized cluster
- The process spreads outward, creating larger synchronized regions

## Biological Inspiration

This behavior mirrors many natural phenomena:
- **Fireflies**: Synchronous flashing in Southeast Asian firefly swarms
- **Cardiac Cells**: Heart muscle cells synchronizing to create heartbeats  
- **Circadian Rhythms**: Daily biological clocks aligning across populations
- **Neural Networks**: Synchronized firing in brain circuits
- **Pendulum Clocks**: Historic observation of wall-mounted clocks synchronizing

## Emergent Behavior Research

This simulation demonstrates **Kuramoto model** dynamics in a visual, interactive form. The Kuramoto model describes how oscillators (our pulsing balls) can spontaneously synchronize when weakly coupled. Key research applications include:

- **Swarm Intelligence**: Understanding how distributed systems coordinate
- **Network Science**: Studying synchronization in complex networks  
- **Neuroscience**: Modeling neural synchronization patterns
- **Social Dynamics**: Explaining consensus formation in groups
- **Engineering**: Designing self-organizing systems

## Experiments to Try

1. **Cluster Formation**: Start with scattered balls and watch clusters form
2. **Critical Mass**: Find the minimum number of balls needed for stable sync
3. **Parameter Sensitivity**: Adjust energy radius and observe clustering changes
4. **Disruption Recovery**: Add balls to break sync groups and watch reformation
5. **Spatial Patterns**: Observe how physical distance affects synchronization

## Next Steps

1. **Modify Parameters**: Experiment with different coupling strengths and ranges
2. **Add Obstacles**: Introduce barriers that block energy transfer
3. **Network Topology**: Connect balls in specific patterns (rings, grids, etc.)
4. **External Forcing**: Add periodic external pulses to drive the system
5. **3D Version**: Extend to three-dimensional synchronization

## p5.js and Complexity Science Resources

- [p5.js Reference](https://p5js.org/reference/)
- [p5.js Examples](https://p5js.org/examples/)
- [p5.js Tutorials](https://p5js.org/learn/)
- [Kuramoto Model](https://en.wikipedia.org/wiki/Kuramoto_model) - Mathematical foundation
- [Emergence in Complex Systems](https://www.complexityexplorer.org/) - Santa Fe Institute courses
- [Synchronization Phenomena](https://www.nature.com/articles/nature06938) - Research on sync in nature

## License & Attribution

This simulation is inspired by research in complex systems, emergence, and the Kuramoto model of coupled oscillators. Feel free to modify, experiment, and learn from the code!
