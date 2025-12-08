/**
 * Generate technical diagrams for Cloak Protocol README
 * Converts diagrams to JPEG images using canvas
 */

const fs = require('fs');
const path = require('path');

// Check if canvas is available, if not, we'll use a fallback
let canvas;
try {
  canvas = require('canvas');
} catch (e) {
  console.log('Canvas library not found. Installing dependencies...');
  console.log('Please run: npm install canvas');
  process.exit(1);
}

// Create images directory
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const { createCanvas, loadImage } = canvas;

function createSystemArchitecture() {
  const width = 1400;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Title
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Cloak Protocol System Architecture', width / 2, 40);

  // Client Layer
  drawBox(ctx, 100, 150, 300, 200, '#dbeafe', '#2563eb', 'Client Layer', 
    ['React Frontend', 'ZK SDK', 'Wallet']);

  // API Gateway Layer
  drawBox(ctx, 450, 150, 300, 200, '#ede9fe', '#7c3aed', 'API Gateway', 
    ['REST API', 'WebSocket', 'gRPC']);

  // Backend Core
  drawBox(ctx, 800, 150, 300, 200, '#fee2e2', '#dc2626', 'Backend Core', 
    ['CloakNode', 'StateManager', 'ZK Prover']);

  // Psy Protocol Layer
  drawBox(ctx, 450, 400, 300, 200, '#d1fae5', '#059669', 'Psy Protocol', 
    ['Psy Client', 'Verifier Contract', 'PARTH Lanes']);

  // Arrows
  drawArrow(ctx, 400, 250, 450, 250);
  drawArrow(ctx, 750, 250, 800, 250);
  drawArrow(ctx, 600, 400, 600, 350);

  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  fs.writeFileSync(path.join(imagesDir, 'system-architecture.jpg'), buffer);
  console.log('✓ System Architecture');
}

function createDataFlow() {
  const width = 1400;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Data Flow: Trade Execution', width / 2, 40);

  const participants = [
    { x: 150, y: 200, label: 'User', color: '#3b82f6' },
    { x: 350, y: 200, label: 'API Gateway', color: '#8b5cf6' },
    { x: 550, y: 200, label: 'CloakNode', color: '#ef4444' },
    { x: 750, y: 200, label: 'ZK Prover', color: '#f59e0b' },
    { x: 550, y: 400, label: 'StateManager', color: '#10b981' },
    { x: 750, y: 400, label: 'Psy Protocol', color: '#06b6d4' },
  ];

  participants.forEach(p => {
    drawCircle(ctx, p.x, p.y, 50, p.color, p.label);
  });

  // Flow arrows
  drawArrow(ctx, 200, 200, 300, 200);
  drawLabel(ctx, 250, 180, 'POST /prove_trade');
  drawArrow(ctx, 400, 200, 500, 200);
  drawLabel(ctx, 450, 180, 'Validate');
  drawArrow(ctx, 550, 250, 550, 350);
  drawLabel(ctx, 570, 300, 'Query');
  drawArrow(ctx, 550, 350, 550, 250);
  drawLabel(ctx, 530, 300, 'Balance');
  drawArrow(ctx, 600, 200, 700, 200);
  drawLabel(ctx, 650, 180, 'Generate Proof');
  drawArrow(ctx, 750, 250, 750, 350);
  drawLabel(ctx, 770, 300, 'Submit');
  drawArrow(ctx, 750, 350, 750, 250);
  drawLabel(ctx, 730, 300, 'TX Hash');
  drawArrow(ctx, 500, 200, 400, 200);
  drawLabel(ctx, 450, 220, 'Confirmed');

  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  fs.writeFileSync(path.join(imagesDir, 'data-flow-trade.jpg'), buffer);
  console.log('✓ Data Flow: Trade Execution');
}

function createComponentInteraction() {
  const width = 1400;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Component Interaction Diagram', width / 2, 40);

  // State Management
  drawBox(ctx, 100, 200, 300, 300, '#dbeafe', '#3b82f6', 'State Management', 
    ['StateManager', 'Merkle Tree', 'RocksDB']);

  // ZK Proving
  drawBox(ctx, 500, 200, 300, 300, '#fef3c7', '#f59e0b', 'ZK Proving', 
    ['Balance Circuit', 'Witness Gen', 'Groth16 Proof']);

  // Order Processing
  drawBox(ctx, 900, 200, 300, 300, '#d1fae5', '#10b981', 'Order Processing', 
    ['Order Intent', 'Matching', 'Batch Agg']);

  // Arrows
  drawArrow(ctx, 400, 350, 500, 350);
  drawLabel(ctx, 450, 330, 'Query');
  drawArrow(ctx, 800, 350, 900, 350);
  drawLabel(ctx, 850, 330, 'Process');
  drawArrow(ctx, 600, 500, 200, 400);
  drawLabel(ctx, 400, 450, 'Update');

  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  fs.writeFileSync(path.join(imagesDir, 'component-interaction.jpg'), buffer);
  console.log('✓ Component Interaction');
}

function createZKProofFlow() {
  const width = 1400;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Zero-Knowledge Proof Flow', width / 2, 40);

  const steps = [
    { x: 150, y: 200, label: 'User Initiates\nTrade', color: '#3b82f6' },
    { x: 350, y: 200, label: 'Validate\nOrder', color: '#8b5cf6' },
    { x: 550, y: 200, label: 'Query Private\nState', color: '#10b981' },
    { x: 750, y: 200, label: 'Generate\nMerkle Proof', color: '#f59e0b' },
    { x: 150, y: 400, label: 'Construct\nWitness', color: '#ef4444' },
    { x: 350, y: 400, label: 'Run ZK\nCircuit', color: '#ec4899' },
    { x: 550, y: 400, label: 'Generate\nGroth16 Proof', color: '#06b6d4' },
    { x: 750, y: 400, label: 'Verify\nProof', color: '#14b8a6' },
    { x: 150, y: 600, label: 'Add to Batch\nQueue', color: '#6366f1' },
    { x: 350, y: 600, label: 'Submit to\nPsy', color: '#8b5cf6' },
    { x: 550, y: 600, label: 'Settlement', color: '#10b981' },
    { x: 750, y: 600, label: 'Trade\nComplete', color: '#059669' },
  ];

  steps.forEach(step => {
    drawRoundedBox(ctx, step.x, step.y, 150, 80, step.color, step.label);
  });

  // Flow arrows
  for (let i = 0; i < steps.length - 1; i++) {
    const current = steps[i];
    const next = steps[i + 1];
    
    if (current.y === next.y) {
      // Horizontal flow
      drawArrow(ctx, current.x + 75, current.y, next.x - 75, next.y);
    } else if (current.x === next.x && current.y < next.y) {
      // Vertical flow down
      drawArrow(ctx, current.x, current.y + 40, next.x, next.y - 40);
    } else if (current.x > next.x && current.y > next.y) {
      // Diagonal flow
      drawArrow(ctx, current.x - 75, current.y - 40, next.x + 75, next.y + 40);
    }
  }

  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  fs.writeFileSync(path.join(imagesDir, 'zk-proof-flow.jpg'), buffer);
  console.log('✓ Zero-Knowledge Proof Flow');
}

function createNetworkTopology() {
  const width = 1400;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Network Topology', width / 2, 40);

  // Central Psy Protocol
  drawCircle(ctx, width / 2, height / 2, 100, '#10b981', 'Psy Protocol\nPARTH Lanes');

  // Cloak Nodes
  const nodes = [
    { x: 300, y: 300, label: 'CloakNode 1' },
    { x: 1100, y: 300, label: 'CloakNode 2' },
    { x: 300, y: 700, label: 'CloakNode 3' },
    { x: 1100, y: 700, label: 'CloakNode 4' },
  ];

  nodes.forEach(node => {
    drawCircle(ctx, node.x, node.y, 60, '#3b82f6', node.label);
    // Connect to center
    drawLine(ctx, node.x, node.y, width / 2, height / 2, '#6b7280');
  });

  // Users
  const users = [
    { x: 100, y: 200, label: 'User A' },
    { x: 250, y: 200, label: 'User B' },
    { x: 1150, y: 200, label: 'User C' },
    { x: 1300, y: 200, label: 'User D' },
    { x: 100, y: 800, label: 'User E' },
    { x: 250, y: 800, label: 'User F' },
  ];

  users.forEach(user => {
    drawEllipse(ctx, user.x, user.y, 40, 30, '#8b5cf6', user.label);
    // Connect to nearest node
    const nearest = nodes.reduce((min, n) => {
      const dist = Math.sqrt(Math.pow(n.x - user.x, 2) + Math.pow(n.y - user.y, 2));
      const minDist = Math.sqrt(Math.pow(min.x - user.x, 2) + Math.pow(min.y - user.y, 2));
      return dist < minDist ? n : min;
    });
    drawLine(ctx, user.x, user.y, nearest.x, nearest.y, '#9ca3af');
  });

  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  fs.writeFileSync(path.join(imagesDir, 'network-topology.jpg'), buffer);
  console.log('✓ Network Topology');
}

function createStateManagement() {
  const width = 1400;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('State Management: Merkle Tree Architecture', width / 2, 40);

  // Merkle Tree - Root
  drawCircle(ctx, width / 2, 150, 30, '#3b82f6', 'Root');

  // Level 1
  drawCircle(ctx, 400, 250, 25, '#60a5fa', '');
  drawCircle(ctx, 1000, 250, 25, '#60a5fa', '');
  drawLine(ctx, 400, 250, width / 2, 120, '#4b5563');
  drawLine(ctx, 1000, 250, width / 2, 120, '#4b5563');

  // Level 2
  const level2 = [250, 550, 650, 1150];
  level2.forEach(x => {
    drawCircle(ctx, x, 350, 20, '#93c5fd', '');
    const parentX = x < 500 ? 400 : 1000;
    drawLine(ctx, x, 350, parentX, 225, '#4b5563');
  });

  // Leaves
  const leaves = [100, 300, 500, 600, 700, 1300];
  leaves.forEach((x, i) => {
    drawRect(ctx, x - 20, 450, 40, 30, '#dbeafe', `User ${i + 1}`);
    const parentX = level2[Math.floor(i / 2) + (i >= 4 ? 2 : 0)];
    drawLine(ctx, x, 450, parentX, 370, '#4b5563');
  });

  // RocksDB
  drawBox(ctx, 200, 700, 200, 100, '#d1fae5', '#059669', 'RocksDB\nPersistence', []);
  drawArrow(ctx, 500, 480, 300, 700);

  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  fs.writeFileSync(path.join(imagesDir, 'state-management.jpg'), buffer);
  console.log('✓ State Management Architecture');
}

function createSecurityModel() {
  const width = 1400;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Security Model: Multi-Layer Protection', width / 2, 40);

  // Central core
  drawCircle(ctx, width / 2, height / 2, 120, '#dc2626', 'ZK Proof\nVerification');

  // Security layers
  const layers = [
    { x: 300, y: 300, label: 'Client-Side\nProving', color: '#3b82f6' },
    { x: 1100, y: 300, label: 'Merkle Proof\nValidation', color: '#10b981' },
    { x: 300, y: 700, label: 'SDKey\nIdentity', color: '#8b5cf6' },
    { x: 1100, y: 700, label: 'On-Chain\nVerification', color: '#f59e0b' },
  ];

  layers.forEach(layer => {
    drawCircle(ctx, layer.x, layer.y, 80, layer.color, layer.label);
    drawLine(ctx, layer.x, layer.y, width / 2, height / 2, '#4b5563');
  });

  // Threats
  drawTriangle(ctx, 100, height / 2, 40, '#ef4444', 'Front-Running');
  drawTriangle(ctx, width - 100, height / 2, 40, '#ef4444', 'Censorship');
  drawDashedLine(ctx, 140, height / 2, 300, height / 2, '#ef4444');
  drawDashedLine(ctx, width - 140, height / 2, 1100, height / 2, '#ef4444');
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 12px Arial';
  ctx.fillText('BLOCKED', 220, height / 2 - 10);
  ctx.fillText('BLOCKED', width - 220, height / 2 - 10);

  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  fs.writeFileSync(path.join(imagesDir, 'security-model.jpg'), buffer);
  console.log('✓ Security Model');
}

function createPerformanceFlow() {
  const width = 1400;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Performance Flow: Latency & Throughput', width / 2, 40);

  // Performance stages
  const stages = [
    { x: 200, y: 200, label: 'Proof Generation\n180ms', color: '#3b82f6' },
    { x: 450, y: 200, label: 'Proof Submission\n10ms', color: '#8b5cf6' },
    { x: 700, y: 200, label: 'On-Chain Verify\n50ms', color: '#10b981' },
    { x: 950, y: 200, label: 'Settlement\n240ms Total', color: '#f59e0b' },
  ];

  stages.forEach(stage => {
    drawRoundedBox(ctx, stage.x, stage.y, 180, 80, stage.color, stage.label);
  });

  // Flow arrows
  for (let i = 0; i < stages.length - 1; i++) {
    drawArrow(ctx, stages[i].x + 180, stages[i].y, stages[i + 1].x, stages[i + 1].y);
  }

  // Throughput metrics
  const metrics = [
    { x: 200, y: 500, label: 'Single User\n~4.1 TPS', color: '#6366f1' },
    { x: 450, y: 500, label: '1000 Users\n~4,100 TPS', color: '#8b5cf6' },
    { x: 700, y: 500, label: 'Batch Mode\n~12,000 TPS', color: '#a855f7' },
    { x: 950, y: 500, label: 'PoW 2.0\n1.2M TPS', color: '#ec4899' },
  ];

  metrics.forEach(metric => {
    drawRoundedBox(ctx, metric.x, metric.y, 180, 80, metric.color, metric.label);
  });

  // Connection lines
  stages.forEach((stage, i) => {
    drawDashedLine(ctx, stage.x + 90, stage.y + 80, metrics[i].x + 90, metrics[i].y);
  });

  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  fs.writeFileSync(path.join(imagesDir, 'performance-flow.jpg'), buffer);
  console.log('✓ Performance Flow');
}

function createDeploymentArchitecture() {
  const width = 1400;
  const height = 1000;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Deployment Architecture', width / 2, 40);

  // Cloud Infrastructure
  drawBox(ctx, 150, 150, 1100, 200, '#eff6ff', '#3b82f6', 'Cloud Infrastructure', []);

  // Services
  const services = [
    { x: 250, y: 200, label: 'Frontend\n(React)', color: '#3b82f6' },
    { x: 500, y: 200, label: 'API Server\n(Axum)', color: '#8b5cf6' },
    { x: 750, y: 200, label: 'CloakNode\n(Rust)', color: '#ef4444' },
    { x: 1000, y: 200, label: 'RocksDB\n(State)', color: '#10b981' },
  ];

  services.forEach(service => {
    drawRoundedBox(ctx, service.x, service.y, 150, 80, service.color, service.label);
  });

  // Psy Protocol
  drawBox(ctx, 450, 450, 500, 150, '#d1fae5', '#059669', 'Psy Protocol Network', 
    ['PARTH Lanes • Verifier Contract • PoW 2.0']);

  // Connection
  drawArrow(ctx, 700, 350, 700, 450);
  drawLabel(ctx, 720, 400, 'RPC/WebSocket');

  // Users
  drawBox(ctx, 150, 750, 1100, 150, '#f3e8ff', '#8b5cf6', 'End Users (Browser/Mobile)', []);

  // User connection
  drawArrow(ctx, 700, 750, 700, 350);
  drawLabel(ctx, 720, 550, 'HTTPS/WebSocket');

  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  fs.writeFileSync(path.join(imagesDir, 'deployment-architecture.jpg'), buffer);
  console.log('✓ Deployment Architecture');
}

// Helper functions
function drawBox(ctx, x, y, w, h, fillColor, strokeColor, title, items) {
  ctx.fillStyle = fillColor;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(title, x + w / 2, y + 25);

  ctx.font = '11px Arial';
  items.forEach((item, i) => {
    ctx.fillText(item, x + w / 2, y + 50 + i * 20);
  });
}

function drawRoundedBox(ctx, x, y, w, h, color, label) {
  const radius = 10;
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.3;
  drawRoundedRect(ctx, x, y, w, h, radius);
  ctx.fill();
  ctx.globalAlpha = 1.0;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, x, y, w, h, radius);
  ctx.stroke();

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'center';
  const lines = label.split('\n');
  lines.forEach((line, i) => {
    ctx.fillText(line, x + w / 2, y + h / 2 - (lines.length - 1) * 8 + i * 16);
  });
}

function drawCircle(ctx, x, y, radius, color, label) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'center';
  const lines = label.split('\n');
  lines.forEach((line, i) => {
    ctx.fillText(line, x, y - (lines.length - 1) * 6 + i * 12);
  });
}

function drawEllipse(ctx, x, y, w, h, color, label) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y);
}

function drawRect(ctx, x, y, w, h, color, label) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = '#000000';
  ctx.font = '9px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(label, x + w / 2, y + h / 2 + 3);
}

function drawArrow(ctx, x1, y1, x2, y2, color = '#4b5563') {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Arrowhead
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const arrowLength = 15;
  const arrowAngle = Math.PI / 6;

  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - arrowLength * Math.cos(angle - arrowAngle),
            y2 - arrowLength * Math.sin(angle - arrowAngle));
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - arrowLength * Math.cos(angle + arrowAngle),
            y2 - arrowLength * Math.sin(angle + arrowAngle));
  ctx.stroke();
}

function drawLine(ctx, x1, y1, x2, y2, color = '#4b5563') {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawDashedLine(ctx, x1, y1, x2, y2, color = '#4b5563') {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawLabel(ctx, x, y, text) {
  ctx.fillStyle = '#000000';
  ctx.font = '10px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y);
}

function drawTriangle(ctx, x, y, size, color, label) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x - size, y + size);
  ctx.lineTo(x + size, y + size);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 10px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y + size + 15);
}

// Helper to draw rounded rectangle (polyfill for older canvas versions)
function drawRoundedRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Generate all diagrams
console.log('Generating technical diagrams...\n');
createSystemArchitecture();
createDataFlow();
createComponentInteraction();
createZKProofFlow();
createNetworkTopology();
createStateManagement();
createSecurityModel();
createPerformanceFlow();
createDeploymentArchitecture();
console.log('\nAll diagrams generated successfully in /images folder!');

