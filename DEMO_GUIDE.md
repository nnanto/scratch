# Adding New Demos to AUI

This guide explains how to add new interactive demos to the AUI project.

## Quick Setup for New Demos

### 1. Create Demo Folder Structure
```bash
mkdir new-demo-name
cd new-demo-name
```

### 2. Required Files
Each demo should have these minimum files:
- `index.html` - Main demo page
- `README.md` - Demo documentation
- `sketch.js` or equivalent main script

### 3. Update Main Index.html

Replace a "coming soon" card or add a new one in `/index.html`:

```html
<div class="project-card">
    <div class="badge">Live Demo</div>
    <h2 class="project-title">Your Demo Title</h2>
    <p class="project-description">
        Description of what your demo does and demonstrates.
    </p>
    <a href="./your-demo-folder/" class="project-link">Launch Demo</a>
</div>
```

## Demo Template Structure

### Basic HTML Template (`index.html`)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Demo Title</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f0f0f0;
        }
        
        /* Add your demo-specific styles here */
    </style>
</head>
<body>
    <!-- Include any necessary libraries (p5.js, three.js, etc.) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
    <script src="sketch.js"></script>
</body>
</html>
```

### Demo README Template
```markdown
# Your Demo Title

Brief description of what the demo demonstrates.

## Features
- Feature 1
- Feature 2
- Feature 3

## How it Works
Explain the underlying concepts and algorithms.

## Getting Started
1. Open `index.html` in your web browser
2. Interact with the demo
3. Observe the behaviors

## Technical Details
- Libraries used
- Key algorithms
- Performance considerations
```

## Current Demo Categories

### Interactive Simulations
- Emergent behaviors
- Physics simulations
- Particle systems

### Adaptive Interfaces
- Dynamic layouts
- Responsive interactions
- AI-driven adaptations

### Data Visualizations
- Real-time data displays
- Interactive charts
- Network visualizations

## Best Practices

1. **Performance**: Ensure demos run smoothly at 60fps
2. **Responsiveness**: Make demos work on mobile devices
3. **Documentation**: Include clear README with explanation
4. **Accessibility**: Add keyboard controls where appropriate
5. **Visual Design**: Maintain consistent aesthetic with main site

## File Naming Conventions

- Use kebab-case for folder names: `emergent-synchronization`
- Keep names descriptive but concise
- Avoid special characters and spaces

## Testing Checklist

Before adding to main index:
- [ ] Demo loads without errors
- [ ] Works on desktop browsers (Chrome, Firefox, Safari)
- [ ] Works on mobile devices
- [ ] README is complete and clear
- [ ] Performance is acceptable
- [ ] Visual design fits with site aesthetic
