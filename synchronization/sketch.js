// Customizable Parameters
const params = {
  numBalls: 20,                    // Number of balls
  baseRadius: 20,                  // Base radius of balls
  pulseAmplitude: 15,              // How much the radius changes during pulse
  basePulseInterval: 1000,         // Base pulse interval in milliseconds
  energyRadius: 350,               // Radius of influence for energy transfer
  energyBoost: 0.3,                // Energy boost factor (0-1)
  maxEnergyLevel: 3.0,             // Maximum energy level a ball can have
  energyDecay: 0.9,               // Energy decay rate per frame
  refractoryPeriod: 200,           // Time after pulse when ball can't receive energy (ms)
  backgroundColor: [20, 20, 30],   // Background color [R, G, B]
  ballColor: [100, 150, 255],      // Base ball color [R, G, B]
  pulseColor: [255, 100, 150],     // Pulse color [R, G, B]
  refractoryColor: [80, 80, 120],  // Color during refractory period [R, G, B]
  showInfluenceRadius: false,      // Show influence radius (debug mode)
  showEnergyText: false,           // Show energy level as text inside balls
  autoSpawn: true,                 // Automatically spawn balls
  spawnOnClick: true,              // Spawn balls on mouse click
  energyIncrease: true             // If true, increase energy; if false, decrease energy
};

let balls = [];
let lastPulseTime = 0;
let pulseCounter = 0; // Count total pulses
let draggedBall = null; // Track which ball is being dragged

// Focus tracking variables
let windowFocused = true;
let focusLostTime = 0;
let totalPausedTime = 0;

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.baseRadius = params.baseRadius;
    this.currentRadius = this.baseRadius;
    this.energyLevel = 1.0;
    this.lastPulseTime = millis() + random(0, params.basePulseInterval);
    this.isPulsing = false;
    this.pulseProgress = 0;
    this.alpha = 255;
    this.isInRefractoryPeriod = false;
    this.id = Math.random().toString(36).substr(2, 9); // Unique ID for each ball
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
  }
  
  update() {
    // Calculate next pulse time based on energy level
    const energyFactor = map(this.energyLevel, 1.0, params.maxEnergyLevel, 1.0, 0.3);
    const nextPulseInterval = params.basePulseInterval * energyFactor;
    
    // Check if refractory period has ended
    if (this.isInRefractoryPeriod && millis() - this.lastPulseTime > params.refractoryPeriod) {
      this.isInRefractoryPeriod = false;
    }
    
    // Check if it's time to pulse
    if (millis() - this.lastPulseTime > nextPulseInterval) {
      this.startPulse();
    }
    
    // Update pulse animation
    if (this.isPulsing) {
      this.pulseProgress += 0.1;
      if (this.pulseProgress >= 1.0) {
        this.isPulsing = false;
        this.pulseProgress = 0;
      }
    }
    
    // Calculate current radius based on pulse
    if (this.isPulsing) {
      const pulseValue = sin(this.pulseProgress * PI);
      this.currentRadius = this.baseRadius + (params.pulseAmplitude * pulseValue);
      this.alpha = 255 * (0.7 + 0.3 * pulseValue);
      this.energyLevel = 1.0; // Reset energy level on pulse
    } else {
      this.currentRadius = this.baseRadius;
      this.alpha = 255 * 0.7;
    }
    
    // Decay energy over time
    // this.energyLevel = max(1.0, this.energyLevel * params.energyDecay);
  }
  
  startPulse() {
    this.isPulsing = true;
    this.pulseProgress = 0;
    this.lastPulseTime = millis();
    this.isInRefractoryPeriod = true; // Enter refractory period
    
    // Increment global pulse counter
    pulseCounter++;
    
    // Transfer energy to nearby balls
    this.transferEnergyToNearby();
  }
  
  transferEnergyToNearby() {
    for (let other of balls) {
      if (other !== this) {
        const distance = dist(this.x, this.y, other.x, other.y);
        if (distance < params.energyRadius) {
          // Calculate energy transfer based on distance
          const energyTransfer = map(distance, 0, params.energyRadius, params.energyBoost, 0);
          other.receiveEnergy(energyTransfer);
        }
      }
    }
  }
  
  receiveEnergy(amount) {
    // Only accept energy if not in refractory period
    if (!this.isInRefractoryPeriod) {
      if (params.energyIncrease) {
        this.energyLevel = min(params.maxEnergyLevel, this.energyLevel + amount);
      } else {
        this.energyLevel = max(1.0, this.energyLevel - amount);
      }
    }
  }
  
  // Check if mouse is over this ball
  isMouseOver(mx, my) {
    const distance = dist(mx, my, this.x, this.y);
    return distance < this.currentRadius;
  }
  
  // Start dragging this ball
  startDrag(mx, my) {
    this.isDragging = true;
    this.dragOffsetX = mx - this.x;
    this.dragOffsetY = my - this.y;
  }
  
  // Update position while dragging
  updateDrag(mx, my) {
    if (this.isDragging) {
      // Calculate new position
      let newX = mx - this.dragOffsetX;
      let newY = my - this.dragOffsetY;
      
      // Constrain to container boundaries (right side of UI panel)
      const minX = 310 + this.currentRadius + params.pulseAmplitude;
      const maxX = width - this.currentRadius - params.pulseAmplitude;
      const minY = this.currentRadius + params.pulseAmplitude;
      const maxY = height - this.currentRadius - params.pulseAmplitude;
      
      this.x = constrain(newX, minX, maxX);
      this.y = constrain(newY, minY, maxY);
    }
  }
  
  // Stop dragging
  stopDrag() {
    this.isDragging = false;
  }
  
  // Add method to adjust timing after focus is regained
  adjustForPause(pausedDuration) {
    // Extend the last pulse time by the paused duration
    // This maintains the relative timing between balls
    this.lastPulseTime += pausedDuration;
  }
  
  draw() {
    push();
    
    // Draw influence radius in debug mode
    if (params.showInfluenceRadius && this.isPulsing) {
      noFill();
      // Color influence radius based on energy mode
      if (params.energyIncrease) {
        stroke(150, 255, 150, 25); // Green for increase mode
      } else {
        stroke(255, 150, 150, 25); // Red for decrease mode
      }
      strokeWeight(2);
      ellipse(this.x, this.y, params.energyRadius * 2);
      
      if (params.energyIncrease) {
        stroke(150, 255, 150, 15);
      } else {
        stroke(255, 150, 150, 15);
      }
      strokeWeight(1);
      ellipse(this.x, this.y, params.energyRadius * 2.2);
    }
    
    // Calculate color based on energy level and pulse state
    let r, g, b;
    if (this.isPulsing) {
      const pulseValue = sin(this.pulseProgress * PI);
      r = lerp(params.ballColor[0], params.pulseColor[0], pulseValue);
      g = lerp(params.ballColor[1], params.pulseColor[1], pulseValue);
      b = lerp(params.ballColor[2], params.pulseColor[2], pulseValue);
    } else if (this.isInRefractoryPeriod) {
      // Use refractory color during refractory period
      r = params.refractoryColor[0];
      g = params.refractoryColor[1];
      b = params.refractoryColor[2];
    } else {
      // Color intensity based on energy level
      const energyIntensity = map(this.energyLevel, 1.0, params.maxEnergyLevel, 0.5, 1.0);
      r = params.ballColor[0] * energyIntensity;
      g = params.ballColor[1] * energyIntensity;
      b = params.ballColor[2] * energyIntensity;
    }
    
    // Draw the ball with subtle glow - color based on energy mode
    // Soft outer glow
    if (params.energyIncrease) {
      // Green tint for increase mode
      fill(r * 0.8 + 50, g * 0.8 + 100, b * 0.8, this.alpha * 0.2);
    } else {
      // Red tint for decrease mode
      fill(r * 0.8 + 100, g * 0.8 + 50, b * 0.8, this.alpha * 0.2);
    }
    noStroke();
    ellipse(this.x, this.y, (this.currentRadius + 6) * 2);
    
    // Main ball
    fill(r, g, b, this.alpha);
    ellipse(this.x, this.y, this.currentRadius * 2);
    
    // Draw energy level indicator - color based on energy mode
    const energyRingRadius = this.baseRadius + 5;
    const energyAngle = map(this.energyLevel, 1.0, params.maxEnergyLevel, 0, TWO_PI);
    
    if (params.energyIncrease) {
      stroke(120, 255, 120, 120); // Green for increase mode
    } else {
      stroke(255, 120, 120, 120); // Red for decrease mode
    }
    strokeWeight(2);
    noFill();
    arc(this.x, this.y, energyRingRadius * 2, energyRingRadius * 2, 0, energyAngle);
    
    // Draw energy level text inside ball if enabled
    if (params.showEnergyText) {
      fill(255, 255, 255, 200);
      textAlign(CENTER, CENTER);
      textSize(10);
      text(this.energyLevel.toFixed(1), this.x, this.y);
    }
    
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Add focus event listeners
  window.addEventListener('focus', () => {
    if (!windowFocused) {
      windowFocused = true;
      const pausedDuration = millis() - focusLostTime;
      totalPausedTime += pausedDuration;
      
      // Adjust all ball timing to account for the pause
      for (let ball of balls) {
        ball.adjustForPause(pausedDuration);
      }
    }
  });
  
  window.addEventListener('blur', () => {
    windowFocused = false;
    focusLostTime = millis();
  });
  
  // Initialize balls
  if (params.autoSpawn) {
    for (let i = 0; i < params.numBalls; i++) {
      const x = random(320 + params.baseRadius + params.pulseAmplitude, width - params.baseRadius - params.pulseAmplitude);
      const y = random(params.baseRadius + params.pulseAmplitude, height - params.baseRadius - params.pulseAmplitude);
      balls.push(new Ball(x, y));
    }
  }
}

function draw() {
  // Set background
  background(params.backgroundColor[0], params.backgroundColor[1], params.backgroundColor[2]);
  
  // Draw container boundary (visual indicator of play area)
  stroke(100, 100, 150, 100);
  strokeWeight(2);
  noFill();
  rect(310, 0, width - 310, height);
  
  // Update and draw all balls
  for (let ball of balls) {
    ball.update();
    ball.draw();
  }
  
  // Draw UI
  drawUI();
}

function drawUI() {
  // Draw parameter panel
  fill(0, 0, 0, 150);
  rect(10, 10, 280, 520);
  
  fill(255);
  textAlign(LEFT);
  textSize(12);
  text("Pulsing Balls Simulation", 20, 30);
  text(`Balls: ${balls.length}`, 20, 50);
  text(`Total Pulses: ${pulseCounter}`, 20, 70);
  text(`Pulse Interval: ${params.basePulseInterval}ms`, 20, 90);
  text(`Energy Radius: ${params.energyRadius}px`, 20, 110);
  text(`Energy Boost: ${params.energyBoost}`, 20, 130);
  text(`Max Energy: ${params.maxEnergyLevel}`, 20, 150);
  text(`Refractory Period: ${params.refractoryPeriod}ms`, 20, 170);
  text(`Energy Mode: ${params.energyIncrease ? 'Increase' : 'Decrease'}`, 20, 190);
  
  // Description section
  let currentY = 210;
  textSize(14);
  fill(100, 200, 255);
  text("About:", 20, currentY);
  currentY += 20;
  
  textSize(11);
  fill(200, 200, 200);
  text("Each ball pulses at random intervals,", 20, currentY);
  text(`and ${params.energyIncrease ? 'transfers energy to' : 'drains energy from'}`, 20, currentY + 15);
  text("nearby balls, gradually", 20, currentY + 30);
  text(`${params.energyIncrease ? 'speeding up' : 'slowing down'} their pulse rates.`, 20, currentY + 45);
  currentY += 65;
  
  text("Over time, this energy coupling", 20, currentY);
  text("creates emergent synchronization -", 20, currentY + 15);
  text("the balls will naturally align their", 20, currentY + 30);
  text("pulses without central control.", 20, currentY + 45);
  currentY += 65;
  
  // Controls section
  textSize(14);
  fill(255, 255, 100);
  text("Controls:", 20, currentY);
  currentY += 20;
  
  textSize(11);
  fill(255);
  text("Mouse:", 20, currentY);
  text("  Click & Drag: Move balls around", 20, currentY + 15);
  text("  Click empty space: Add ball", 20, currentY + 30);
  currentY += 50;
  
  text("Keys:", 20, currentY);
  text("  'c': Clear all balls", 20, currentY + 15);
  text("  'd': Toggle debug mode (influence radius)", 20, currentY + 30);
  text("  'e': Toggle energy text display", 20, currentY + 45);
  text("  't': Toggle energy mode (increase/decrease)", 20, currentY + 60);
  currentY += 80;
  
  text("Parameter Controls:", 20, currentY);
  text("  '1'/'2': Decrease/Increase pulse interval", 20, currentY + 15);
  text("  '3'/'4': Decrease/Increase energy radius", 20, currentY + 30);
  text("  '5'/'6': Decrease/Increase energy boost", 20, currentY + 45);
  text("  '7'/'8': Decrease/Increase refractory period", 20, currentY + 60);
}

function mousePressed() {
  // Check if mouse is in the play area (right side of UI panel)
  if (mouseX > 310) {
    // Check if clicking on an existing ball to drag it
    let ballClicked = false;
    for (let ball of balls) {
      if (ball.isMouseOver(mouseX, mouseY)) {
        draggedBall = ball;
        ball.startDrag(mouseX, mouseY);
        ballClicked = true;
        break;
      }
    }
    
    // If no ball was clicked and spawn on click is enabled, create a new ball
    if (!ballClicked && params.spawnOnClick) {
      balls.push(new Ball(mouseX, mouseY));
    }
  }
}

function mouseDragged() {
  if (draggedBall) {
    draggedBall.updateDrag(mouseX, mouseY);
  }
}

function mouseReleased() {
  if (draggedBall) {
    draggedBall.stopDrag();
    draggedBall = null;
  }
}

function keyPressed() {
  if (key === 'c' || key === 'C') {
    balls = [];
    pulseCounter = 0;
  }
  
  if (key === 'd' || key === 'D') {
    params.showInfluenceRadius = !params.showInfluenceRadius;
  }
  
  if (key === 'e' || key === 'E') {
    params.showEnergyText = !params.showEnergyText;
  }
  
  if (key === 't' || key === 'T') {
    params.energyIncrease = !params.energyIncrease;
  }
  
  // Parameter adjustments with keys
  if (key === '1') params.basePulseInterval = max(500, params.basePulseInterval - 200);
  if (key === '2') params.basePulseInterval = min(5000, params.basePulseInterval + 200);
  if (key === '3') params.energyRadius = max(50, params.energyRadius - 25);
  if (key === '4') params.energyRadius = min(100, params.energyRadius + 25);
  if (key === '5') params.energyBoost = max(0.1, params.energyBoost - 0.1);
  if (key === '6') params.energyBoost = min(1.0, params.energyBoost + 0.1);
  if (key === '7') params.refractoryPeriod = max(100, params.refractoryPeriod - 100);
  if (key === '8') params.refractoryPeriod = min(2000, params.refractoryPeriod + 100);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
