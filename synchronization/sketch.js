
// Customizable Parameters
const params = {
  numBalls: 15,                    // Number of balls
  baseRadius: 30,                  // Base radius of balls
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
  spawnOnClick: true               // Spawn balls on mouse click
};

let balls = [];
let lastPulseTime = 0;
let pulseCounter = 0; // Count total pulses

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
      this.energyLevel = min(params.maxEnergyLevel, this.energyLevel + amount);
    }
  }
  
  draw() {
    push();
    
    // Draw influence radius in debug mode
    if (params.showInfluenceRadius && this.isPulsing) {
      stroke(255, 100, 100, 50);
      strokeWeight(1);
      noFill();
      ellipse(this.x, this.y, params.energyRadius * 2);
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
    
    // Draw the ball
    fill(r, g, b, this.alpha);
    noStroke();
    ellipse(this.x, this.y, this.currentRadius * 2);
    
    // Draw energy level indicator (small ring)
    const energyRingRadius = this.baseRadius + 5;
    const energyAngle = map(this.energyLevel, 1.0, params.maxEnergyLevel, 0, TWO_PI);
    stroke(255, 255, 100, 150);
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
  rect(10, 10, 280, 450);
  
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
  
  // Controls section
  let yPos = 190;
  textSize(14);
  fill(255, 255, 100);
  text("Controls:", 20, yPos);
  yPos += 20;
  
  textSize(11);
  fill(255);
  text("Mouse:", 20, yPos);
  text("  Click: Add ball (right side only)", 20, yPos + 15);
  yPos += 35;
  
  text("Keys:", 20, yPos);
  text("  'c': Clear all balls", 20, yPos + 15);
  text("  'd': Toggle debug mode (influence radius)", 20, yPos + 30);
  text("  'e': Toggle energy text display", 20, yPos + 45);
  yPos += 65;
  
  text("Parameter Controls:", 20, yPos);
  text("  '1'/'2': Decrease/Increase pulse interval", 20, yPos + 15);
  text("  '3'/'4': Decrease/Increase energy radius", 20, yPos + 30);
  text("  '5'/'6': Decrease/Increase energy boost", 20, yPos + 45);
  text("  '7'/'8': Decrease/Increase refractory period", 20, yPos + 60);
}

function mousePressed() {
  if (params.spawnOnClick) {
    // Only spawn balls in the area not occupied by the UI panel
    if (mouseX > 310) {
      balls.push(new Ball(mouseX, mouseY));
    }
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
