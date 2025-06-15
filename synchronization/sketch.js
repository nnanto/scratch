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
      if (params.energyIncrease) {
        // Green pulse for energy increase mode
        const pulseValue = sin(this.pulseProgress * PI);
        r = lerp(params.ballColor[0], 50, pulseValue);  // Less red
        g = lerp(params.ballColor[1], 200, pulseValue);  // More green
        b = lerp(params.ballColor[2], 100, pulseValue);  // Less blue
      } else {
        // Red pulse for energy decrease mode
        const pulseValue = sin(this.pulseProgress * PI);
        r = lerp(params.ballColor[0], 200, pulseValue);  // More red
        g = lerp(params.ballColor[1], 50, pulseValue);  // Less green
        b = lerp(params.ballColor[2], 50, pulseValue);  // Less blue
      }
    } else if (this.isInRefractoryPeriod) {
      // Light grey during refractory period
      r = 140;
      g = 140;
      b = 140;
    } else {
      // Color intensity based on energy level
      const energyIntensity = map(this.energyLevel, 1.0, params.maxEnergyLevel, 0.5, 1.0);
      r = params.ballColor[0] * energyIntensity;
      g = params.ballColor[1] * energyIntensity;
      b = params.ballColor[2] * energyIntensity;
    }
    
    // Draw the ball with subtle glow - color based on energy mode
    // Soft outer glow
    if (this.isPulsing) {
      if (params.energyIncrease) {
        // Green glow for increase mode
        fill(r * 0.8 + 20, g * 0.8 + 40, b * 0.8 + 20, this.alpha * 0.2);
      } else {
        // Red glow for decrease mode
        fill(r * 0.8 + 40, g * 0.8 + 20, b * 0.8 + 20, this.alpha * 0.2);
      }
    } else if (this.isInRefractoryPeriod) {
      // Light grey glow for refractory period
      fill(r * 0.9, g * 0.9, b * 0.9, this.alpha * 0.15);
    } else {
      if (params.energyIncrease) {
        // Green tint for increase mode
        fill(r * 0.8 + 50, g * 0.8 + 100, b * 0.8, this.alpha * 0.2);
      } else {
        // Red tint for decrease mode
        fill(r * 0.8 + 100, g * 0.8 + 50, b * 0.8, this.alpha * 0.2);
      }
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
  // Main panel background
  fill(15, 15, 25, 200);
  stroke(60, 60, 80, 150);
  strokeWeight(2);
  rect(10, 10, 290, height - 20, 8);
  
  // Header section
  fill(40, 40, 60, 180);
  noStroke();
  rect(20, 20, 270, 50, 6);
  
  fill(120, 180, 255);
  textAlign(LEFT);
  textSize(16);
  textStyle(BOLD);
  text("Synchronization Simulation", 30, 42);
  
  fill(180, 180, 200);
  textSize(11);
  textStyle(NORMAL);
  text(`${balls.length} balls • ${pulseCounter} total pulses`, 30, 58);
  
  // Status section
  let currentY = 90;
  fill(50, 50, 70, 150);
  rect(20, currentY, 270, 100, 6);
  
  fill(100, 255, 150);
  textSize(14);
  textStyle(BOLD);
  text("Current Parameters", 30, currentY + 20);
  
  fill(220, 220, 240);
  textSize(11);
  textStyle(NORMAL);
  text(`Pulse Interval: ${params.basePulseInterval}ms`, 30, currentY + 38);
  text(`Energy Radius: ${params.energyRadius}px`, 30, currentY + 52);
  text(`Energy Boost: ${params.energyBoost.toFixed(1)}`, 30, currentY + 66);
  text(`Refractory Period: ${params.refractoryPeriod}ms`, 30, currentY + 80);
  
  // Energy mode indicator
  currentY += 105;
  fill(params.energyIncrease ? [50, 100, 50, 150] : [100, 50, 50, 150]);
  rect(20, currentY, 270, 35, 6);
  
  fill(params.energyIncrease ? [120, 255, 120] : [255, 120, 120]);
  textSize(12);
  textStyle(BOLD);
  text(`Energy Mode: ${params.energyIncrease ? 'INCREASE' : 'DECREASE'}`, 30, currentY + 22);
  
  // About section
  currentY += 55;
  fill(40, 40, 60, 150);
  rect(20, currentY, 270, 120, 6);
  
  fill(255, 255, 120);
  textSize(14);
  textStyle(BOLD);
  text("How It Works", 30, currentY + 20);
  
  fill(200, 200, 220);
  textSize(10);
  textStyle(NORMAL);
  text("Each ball pulses at intervals based on its energy.", 30, currentY + 38);
  text(`Pulsing balls ${params.energyIncrease ? 'boost' : 'drain'} energy from nearby`, 30, currentY + 52);
  text(`balls, ${params.energyIncrease ? 'speeding up' : 'slowing down'} their pulse rates.`, 30, currentY + 66);
  text("", 30, currentY + 80);
  text("Over time, this creates emergent synchronization", 30, currentY + 80);
  text("without any central coordination.", 30, currentY + 94);
  
  // Controls section
  currentY += 140;
  fill(30, 50, 70, 150);
  rect(20, currentY, 270, 140, 6);
  
  fill(255, 180, 100);
  textSize(14);
  textStyle(BOLD);
  text("Mouse Controls", 30, currentY + 20);
  
  fill(220, 220, 240);
  textSize(10);
  textStyle(NORMAL);
  text("• Click & Drag: Move balls around", 35, currentY + 38);
  text("• Click empty space: Add new ball", 35, currentY + 52);
  
  fill(255, 180, 100);
  textSize(14);
  textStyle(BOLD);
  text("Keyboard Shortcuts", 30, currentY + 75);
  
  fill(220, 220, 240);
  textSize(10);
  textStyle(NORMAL);
  text("• C: Clear all balls", 35, currentY + 93);
  text("• D: Toggle debug mode (show influence)", 35, currentY + 107);
  text("• E: Toggle energy text display", 35, currentY + 121);
  
  // Parameter controls section
  currentY += 160;
  fill(60, 40, 70, 150);
  rect(20, currentY, 270, 120, 6);
  
  fill(255, 150, 255);
  textSize(14);
  textStyle(BOLD);
  text("Parameter Controls", 30, currentY + 20);
  
  fill(220, 220, 240);
  textSize(10);
  textStyle(NORMAL);
  text("• T: Toggle energy mode (increase ↔ decrease)", 35, currentY + 38);
  text("• 1/2: Pulse interval (faster ↔ slower)", 35, currentY + 52);
  text("• 3/4: Energy radius (smaller ↔ larger)", 35, currentY + 66);
  text("• 5/6: Energy boost (weaker ↔ stronger)", 35, currentY + 80);
  text("• 7/8: Refractory period (shorter ↔ longer)", 35, currentY + 94);
  
  // Debug indicators (if enabled)
  if (params.showInfluenceRadius || params.showEnergyText) {
    currentY += 140;
    fill(70, 70, 30, 150);
    rect(20, currentY, 270, 45, 6);
    
    fill(255, 255, 100);
    textSize(12);
    textStyle(BOLD);
    text("Debug Mode Active", 30, currentY + 22);
    
    fill(220, 220, 180);
    textSize(10);
    textStyle(NORMAL);
    let debugText = "";
    if (params.showInfluenceRadius) debugText += "Influence Radius ";
    if (params.showEnergyText) debugText += "Energy Text";
    text(debugText, 30, currentY + 36);
  }
  
  // Play area separator line
  stroke(100, 150, 200, 100);
  strokeWeight(3);
  line(310, 0, 310, height);
  
  // Play area label
  fill(200, 250, 200, 80);
  textAlign(CENTER);
  textSize(12);
  textStyle(NORMAL);
  text("← Controls | Simulation Area →", width/2 + 155, 25);
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
  if (key === '4') params.energyRadius = min(300, params.energyRadius + 25);
  if (key === '5') params.energyBoost = max(0.1, params.energyBoost - 0.1);
  if (key === '6') params.energyBoost = min(1.0, params.energyBoost + 0.1);
  if (key === '7') params.refractoryPeriod = max(100, params.refractoryPeriod - 100);
  if (key === '8') params.refractoryPeriod = min(2000, params.refractoryPeriod + 100);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
