# AUI - Adaptive User Interfaces

A collection of interactive demos exploring adaptive user interfaces and emergent behaviors in digital systems.

## 🚀 Live Demos

Visit the live demos at: **[https://your-username.github.io/aui/](https://your-username.github.io/aui/)**

## 📋 Current Projects

### 🔴 Emergent Synchronization
An interactive p5.js simulation demonstrating emergent synchronization behavior in distributed systems. Watch as individual pulsing balls naturally self-organize into synchronized groups through local energy interactions—no central coordination required.

**[→ View Demo](https://your-username.github.io/aui/synchronization/)**

### 🔵 Interactive Particle Physics (Coming Soon)
Explore gravitational forces and particle interactions in real-time. Create and manipulate celestial bodies to observe orbital mechanics and complex n-body simulations.

### 🟢 Adaptive Neural Networks (Coming Soon)
Visualize learning algorithms in action as neural networks adapt to solve problems in real-time. Watch synaptic connections strengthen and weaken as the network evolves.

## ➕ Adding New Demos

See [`DEMO_GUIDE.md`](./DEMO_GUIDE.md) for detailed instructions on adding new interactive demos to this collection.

## 🛠️ Setup for GitHub Pages

This repository is configured for GitHub Pages deployment:

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Set source to "Deploy from a branch"
   - Select "main" branch and "/ (root)" folder
   - Save the settings

2. **Access your demos**:
   - Main page: `https://your-username.github.io/aui/`
   - Synchronization demo: `https://your-username.github.io/aui/synchronization/`

## 🔧 Local Development

To run locally with live reload:

```bash
# Option 1: Using Python (if installed)
python -m http.server 8000

# Option 2: Using Node.js live-server
npx live-server

# Option 3: Using PHP (if installed)
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 📁 Project Structure

```
aui/
├── index.html                 # Main landing page for GitHub Pages
├── README.md                 # Project overview
├── DEMO_GUIDE.md            # Guide for adding new demos
├── synchronization/         # Emergent synchronization demo
│   ├── index.html
│   ├── sketch.js
│   ├── package.json
│   └── README.md
├── particle-physics/        # Future: Interactive particle physics
└── neural-networks/         # Future: Adaptive neural networks
```

## 🎯 About

This project explores the intersection of adaptive user interfaces and emergent behaviors, demonstrating how simple rules can lead to complex, beautiful interactions in digital environments.

## 📄 License

MIT License - feel free to use and modify for your own projects.
