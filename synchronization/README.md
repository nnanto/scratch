# p5.js Local Environment

A simple p5.js development environment for creating interactive sketches.

## Getting Started

1. Open `index.html` in your web browser to view your sketch
2. Edit `sketch.js` to create your own p5.js artwork
3. For local development with live reload, you can use a local server

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

- `index.html` - Main HTML file that loads p5.js and your sketch
- `sketch.js` - Your p5.js code goes here
- `README.md` - This file

## Interactive Features

The current sketch includes:
- A circle that follows your mouse cursor
- Color changes based on mouse position
- Drawing mode when mouse is pressed
- Press 'C' to clear the canvas
- Responsive canvas that resizes with the window

## p5.js Resources

- [p5.js Reference](https://p5js.org/reference/)
- [p5.js Examples](https://p5js.org/examples/)
- [p5.js Tutorials](https://p5js.org/learn/)

## Next Steps

1. Modify the `sketch.js` file to create your own artwork
2. Add additional JavaScript files by including them in `index.html`
3. Explore p5.js libraries for sound, DOM manipulation, and more
