#!/usr/bin/env python3
"""
Generate technical diagrams for Cloak Protocol README
Converts Mermaid diagrams to JPEG images using matplotlib and networkx
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Rectangle, Circle, Ellipse
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import os

# Create images directory
os.makedirs('images', exist_ok=True)

# Set style
plt.style.use('default')
plt.rcParams['figure.facecolor'] = 'white'
plt.rcParams['axes.facecolor'] = 'white'
plt.rcParams['font.size'] = 10
plt.rcParams['font.family'] = 'sans-serif'

def create_system_architecture():
    """Create Detailed Technical System Architecture Diagram"""
    fig, ax = plt.subplots(1, 1, figsize=(16, 12))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 12)
    ax.axis('off')
    
    # Title
    ax.text(7, 11.5, 'Cloak Protocol: Technical Architecture', 
           ha='center', fontsize=16, weight='bold')
    
    # Client Layer
    client_box = FancyBboxPatch((0.2, 9.0), 2.6, 2.5, boxstyle="round,pad=0.1", 
                                edgecolor='#2563eb', facecolor='#dbeafe', linewidth=2)
    ax.add_patch(client_box)
    ax.text(1.5, 10.8, 'Client Layer', ha='center', fontsize=11, weight='bold')
    ax.text(1.5, 10.3, 'React + TypeScript', ha='center', fontsize=8)
    ax.text(1.5, 10.0, '• ZK SDK (WASM)', ha='center', fontsize=7)
    ax.text(1.5, 9.7, '• SDKey Manager', ha='center', fontsize=7)
    ax.text(1.5, 9.4, '• Wallet Connect', ha='center', fontsize=7)
    ax.text(1.5, 9.1, 'Protocol: HTTPS/WS', ha='center', fontsize=7, style='italic')
    
    # API Gateway Layer
    api_box = FancyBboxPatch((3.2, 9.0), 2.6, 2.5, boxstyle="round,pad=0.1",
                            edgecolor='#7c3aed', facecolor='#ede9fe', linewidth=2)
    ax.add_patch(api_box)
    ax.text(4.5, 10.8, 'API Gateway', ha='center', fontsize=11, weight='bold')
    ax.text(4.5, 10.3, 'ApiServer (Rust)', ha='center', fontsize=8)
    ax.text(4.5, 10.0, '• Axum HTTP Server', ha='center', fontsize=7)
    ax.text(4.5, 9.7, '• Tonic gRPC', ha='center', fontsize=7)
    ax.text(4.5, 9.4, '• WebSocket Handler', ha='center', fontsize=7)
    ax.text(4.5, 9.1, 'Runtime: Tokio', ha='center', fontsize=7, style='italic')
    
    # Backend Core
    backend_box = FancyBboxPatch((6.2, 9.0), 2.6, 2.5, boxstyle="round,pad=0.1",
                                edgecolor='#dc2626', facecolor='#fee2e2', linewidth=2)
    ax.add_patch(backend_box)
    ax.text(7.5, 10.8, 'Backend Core', ha='center', fontsize=11, weight='bold')
    ax.text(7.5, 10.3, 'CloakNode', ha='center', fontsize=8)
    ax.text(7.5, 10.0, '• StateManager', ha='center', fontsize=7)
    ax.text(7.5, 9.7, '• ProverInterface', ha='center', fontsize=7)
    ax.text(7.5, 9.4, '• OrderRelay', ha='center', fontsize=7)
    ax.text(7.5, 9.1, 'Arc<RwLock<>>', ha='center', fontsize=7, style='italic')
    
    # State Management
    state_box = FancyBboxPatch((9.2, 9.0), 2.6, 2.5, boxstyle="round,pad=0.1",
                              edgecolor='#059669', facecolor='#d1fae5', linewidth=2)
    ax.add_patch(state_box)
    ax.text(10.5, 10.8, 'State Layer', ha='center', fontsize=11, weight='bold')
    ax.text(10.5, 10.3, 'StateManager', ha='center', fontsize=8)
    ax.text(10.5, 10.0, '• Merkle Tree (32)', ha='center', fontsize=7)
    ax.text(10.5, 9.7, '• RocksDB', ha='center', fontsize=7)
    ax.text(10.5, 9.4, '• UserState HashMap', ha='center', fontsize=7)
    ax.text(10.5, 9.1, 'Hash: Poseidon-2', ha='center', fontsize=7, style='italic')
    
    # Psy Protocol Layer
    psy_box = FancyBboxPatch((3.2, 5.5), 6.6, 2.5, boxstyle="round,pad=0.1",
                            edgecolor='#059669', facecolor='#d1fae5', linewidth=3)
    ax.add_patch(psy_box)
    ax.text(6.5, 7.5, 'Psy Protocol Integration', ha='center', fontsize=12, weight='bold')
    ax.text(4.5, 7.0, 'PsyClient', ha='center', fontsize=9, weight='bold')
    ax.text(4.5, 6.7, '• JSON-RPC Client', ha='center', fontsize=7)
    ax.text(4.5, 6.4, '• WebSocket Sub', ha='center', fontsize=7)
    ax.text(4.5, 6.1, '• Verifier Contract', ha='center', fontsize=7)
    ax.text(6.5, 7.0, 'PARTH Lanes', ha='center', fontsize=9, weight='bold')
    ax.text(6.5, 6.7, '• Parallel Execution', ha='center', fontsize=7)
    ax.text(6.5, 6.4, '• PoW 2.0 Consensus', ha='center', fontsize=7)
    ax.text(8.5, 7.0, 'Blockchain', ha='center', fontsize=9, weight='bold')
    ax.text(8.5, 6.7, '• Block Headers', ha='center', fontsize=7)
    ax.text(8.5, 6.4, '• State Roots', ha='center', fontsize=7)
    
    # Data Structures
    ds_box = FancyBboxPatch((0.2, 2.0), 6.6, 2.8, boxstyle="round,pad=0.1",
                           edgecolor='#f59e0b', facecolor='#fef3c7', linewidth=2)
    ax.add_patch(ds_box)
    ax.text(3.5, 4.5, 'Core Data Structures', ha='center', fontsize=11, weight='bold')
    ax.text(1.5, 4.1, 'UserState {', ha='left', fontsize=7, family='monospace')
    ax.text(1.7, 3.9, 'sdkey_hash: [u8; 32]', ha='left', fontsize=7, family='monospace')
    ax.text(1.7, 3.7, 'merkle_root: [u8; 32]', ha='left', fontsize=7, family='monospace')
    ax.text(1.7, 3.5, 'balances: HashMap<...>', ha='left', fontsize=7, family='monospace')
    ax.text(1.5, 3.3, '}', ha='left', fontsize=7, family='monospace')
    ax.text(4.5, 4.1, 'CloakNode {', ha='left', fontsize=7, family='monospace')
    ax.text(4.7, 3.9, 'state_manager: Arc<...>', ha='left', fontsize=7, family='monospace')
    ax.text(4.7, 3.7, 'prover_interface: Arc<...>', ha='left', fontsize=7, family='monospace')
    ax.text(4.7, 3.5, 'psy_client: Arc<PsyClient>', ha='left', fontsize=7, family='monospace')
    ax.text(4.5, 3.3, '}', ha='left', fontsize=7, family='monospace')
    
    # ZK Proving
    zk_box = FancyBboxPatch((7.2, 2.0), 6.6, 2.8, boxstyle="round,pad=0.1",
                           edgecolor='#ec4899', facecolor='#fce7f3', linewidth=2)
    ax.add_patch(zk_box)
    ax.text(10.5, 4.5, 'ZK Proof System', ha='center', fontsize=11, weight='bold')
    ax.text(8.5, 4.1, 'Circuit: BalanceProof', ha='left', fontsize=8, weight='bold')
    ax.text(8.7, 3.9, 'Constraints: 1,247,392', ha='left', fontsize=7)
    ax.text(8.7, 3.7, 'Proof: Groth16', ha='left', fontsize=7)
    ax.text(8.7, 3.5, 'Curve: BLS12-381', ha='left', fontsize=7)
    ax.text(11.5, 4.1, 'Performance', ha='left', fontsize=8, weight='bold')
    ax.text(11.7, 3.9, 'Prove: ~180ms', ha='left', fontsize=7)
    ax.text(11.7, 3.7, 'Verify: ~50ms', ha='left', fontsize=7)
    ax.text(11.7, 3.5, 'Framework: Arkworks', ha='left', fontsize=7)
    
    # Connections
    arrow1 = FancyArrowPatch((2.8, 10.25), (3.2, 10.25), arrowstyle='->', 
                            mutation_scale=20, color='#4b5563', linewidth=2)
    ax.add_patch(arrow1)
    ax.text(3.0, 10.5, 'HTTPS/WS', ha='center', fontsize=7)
    arrow2 = FancyArrowPatch((5.8, 10.25), (6.2, 10.25), arrowstyle='->',
                            mutation_scale=20, color='#4b5563', linewidth=2)
    ax.add_patch(arrow2)
    ax.text(6.0, 10.5, 'gRPC', ha='center', fontsize=7)
    arrow3 = FancyArrowPatch((8.8, 10.25), (9.2, 10.25), arrowstyle='->',
                            mutation_scale=20, color='#4b5563', linewidth=2)
    ax.add_patch(arrow3)
    ax.text(9.0, 10.5, 'Arc<RwLock>', ha='center', fontsize=7)
    arrow4 = FancyArrowPatch((7.5, 9.0), (6.5, 8.0), arrowstyle='->',
                            mutation_scale=20, color='#059669', linewidth=2)
    ax.add_patch(arrow4)
    ax.text(6.8, 8.3, 'JSON-RPC', ha='center', fontsize=7)
    
    plt.tight_layout()
    plt.savefig('images/system-architecture.jpg', dpi=200, bbox_inches='tight', format='jpeg')
    plt.close()

def create_data_flow():
    """Create Data Flow: Trade Execution Diagram"""
    fig, ax = plt.subplots(1, 1, figsize=(14, 10))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    # Participants
    participants = [
        ('User', 1.0, 8.0, '#3b82f6'),
        ('API Gateway', 3.0, 8.0, '#8b5cf6'),
        ('CloakNode', 5.0, 8.0, '#ef4444'),
        ('ZK Prover', 7.0, 8.0, '#f59e0b'),
        ('StateManager', 5.0, 6.0, '#10b981'),
        ('Psy Protocol', 7.0, 6.0, '#06b6d4'),
    ]
    
    for name, x, y, color in participants:
        circle = Circle((x, y), 0.4, color=color, ec='black', linewidth=2)
        ax.add_patch(circle)
        ax.text(x, y, name, ha='center', va='center', fontsize=9, weight='bold', color='white')
    
    # Flow arrows with labels
    flows = [
        ((1.4, 8.0), (2.6, 8.0), 'POST /prove_trade'),
        ((3.4, 8.0), (4.6, 8.0), 'Validate Order'),
        ((5.0, 7.6), (5.0, 6.4), 'Query Balance'),
        ((5.0, 6.4), (5.0, 7.6), 'Balance + Proof'),
        ((5.4, 8.0), (6.6, 8.0), 'Generate Proof'),
        ((7.0, 7.6), (7.0, 6.4), 'Submit Proof'),
        ((7.0, 6.4), (7.0, 7.6), 'TX Hash'),
        ((5.0, 7.6), (3.6, 7.6), 'Settlement'),
        ((3.6, 8.0), (2.6, 8.0), 'Confirmed'),
    ]
    
    for (x1, y1), (x2, y2), label in flows:
        arrow = FancyArrowPatch((x1, y1), (x2, y2), arrowstyle='->',
                               mutation_scale=15, color='#4b5563', linewidth=1.5)
        ax.add_patch(arrow)
        mid_x, mid_y = (x1 + x2) / 2, (y1 + y2) / 2
        ax.text(mid_x, mid_y + 0.15, label, ha='center', fontsize=8, 
               bbox=dict(boxstyle='round,pad=0.3', facecolor='white', alpha=0.8))
    
    ax.set_title('Data Flow: Trade Execution', fontsize=16, weight='bold', pad=20)
    plt.tight_layout()
    plt.savefig('images/data-flow-trade.jpg', dpi=150, bbox_inches='tight', format='jpeg')
    plt.close()

def create_component_interaction():
    """Create Component Interaction Diagram"""
    fig, ax = plt.subplots(1, 1, figsize=(14, 10))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    # State Management
    state_box = FancyBboxPatch((0.5, 6.5), 2.5, 2.5, boxstyle="round,pad=0.2",
                              edgecolor='#3b82f6', facecolor='#dbeafe', linewidth=2)
    ax.add_patch(state_box)
    ax.text(1.75, 8.5, 'State Management', ha='center', va='center', fontsize=11, weight='bold')
    ax.text(1.75, 7.8, 'StateManager', ha='center', fontsize=9)
    ax.text(1.75, 7.3, 'Merkle Tree', ha='center', fontsize=9)
    ax.text(1.75, 6.8, 'RocksDB', ha='center', fontsize=9)
    
    # ZK Proving
    zk_box = FancyBboxPatch((3.5, 6.5), 2.5, 2.5, boxstyle="round,pad=0.2",
                           edgecolor='#f59e0b', facecolor='#fef3c7', linewidth=2)
    ax.add_patch(zk_box)
    ax.text(4.75, 8.5, 'ZK Proving', ha='center', va='center', fontsize=11, weight='bold')
    ax.text(4.75, 7.8, 'Balance Circuit', ha='center', fontsize=9)
    ax.text(4.75, 7.3, 'Witness Gen', ha='center', fontsize=9)
    ax.text(4.75, 6.8, 'Groth16 Proof', ha='center', fontsize=9)
    
    # Order Processing
    order_box = FancyBboxPatch((6.5, 6.5), 2.5, 2.5, boxstyle="round,pad=0.2",
                              edgecolor='#10b981', facecolor='#d1fae5', linewidth=2)
    ax.add_patch(order_box)
    ax.text(7.75, 8.5, 'Order Processing', ha='center', va='center', fontsize=11, weight='bold')
    ax.text(7.75, 7.8, 'Order Intent', ha='center', fontsize=9)
    ax.text(7.75, 7.3, 'Matching', ha='center', fontsize=9)
    ax.text(7.75, 6.8, 'Batch Agg', ha='center', fontsize=9)
    
    # Interaction arrows
    arrow1 = FancyArrowPatch((3.0, 7.75), (3.5, 7.75), arrowstyle='->',
                            mutation_scale=20, color='#4b5563', linewidth=2)
    ax.add_patch(arrow1)
    ax.text(3.25, 8.0, 'Query', ha='center', fontsize=8)
    
    arrow2 = FancyArrowPatch((6.0, 7.75), (6.5, 7.75), arrowstyle='->',
                            mutation_scale=20, color='#4b5563', linewidth=2)
    ax.add_patch(arrow2)
    ax.text(6.25, 8.0, 'Process', ha='center', fontsize=8)
    
    arrow3 = FancyArrowPatch((4.75, 6.5), (1.75, 7.0), arrowstyle='->',
                            mutation_scale=20, color='#4b5563', linewidth=2)
    ax.add_patch(arrow3)
    ax.text(2.5, 6.5, 'Update', ha='center', fontsize=8)
    
    ax.set_title('Component Interaction Diagram', fontsize=16, weight='bold', pad=20)
    plt.tight_layout()
    plt.savefig('images/component-interaction.jpg', dpi=150, bbox_inches='tight', format='jpeg')
    plt.close()

def create_zk_proof_flow():
    """Create Zero-Knowledge Proof Flow Diagram"""
    fig, ax = plt.subplots(1, 1, figsize=(14, 10))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    # Flow boxes
    boxes = [
        ('User Initiates Trade', 1.0, 9.0, '#3b82f6'),
        ('Validate Order', 3.0, 9.0, '#8b5cf6'),
        ('Query Private State', 5.0, 9.0, '#10b981'),
        ('Generate Merkle Proof', 7.0, 9.0, '#f59e0b'),
        ('Construct Witness', 1.0, 7.0, '#ef4444'),
        ('Run ZK Circuit', 3.0, 7.0, '#ec4899'),
        ('Generate Groth16 Proof', 5.0, 7.0, '#06b6d4'),
        ('Verify Proof', 7.0, 7.0, '#14b8a6'),
        ('Add to Batch Queue', 1.0, 5.0, '#6366f1'),
        ('Submit to Psy', 3.0, 5.0, '#8b5cf6'),
        ('Settlement', 5.0, 5.0, '#10b981'),
        ('Trade Complete', 7.0, 5.0, '#059669'),
    ]
    
    for label, x, y, color in boxes:
        box = FancyBboxPatch((x-0.8, y-0.3), 1.6, 0.6, boxstyle="round,pad=0.1",
                            edgecolor=color, facecolor=color, alpha=0.3, linewidth=2)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=8, weight='bold')
    
    # Flow arrows
    flow_paths = [
        ((1.8, 9.0), (2.2, 9.0)),
        ((3.8, 9.0), (4.2, 9.0)),
        ((5.8, 9.0), (6.2, 9.0)),
        ((7.0, 8.7), (1.0, 7.3)),
        ((1.8, 7.0), (2.2, 7.0)),
        ((3.8, 7.0), (4.2, 7.0)),
        ((5.8, 7.0), (6.2, 7.0)),
        ((7.0, 6.7), (1.0, 5.3)),
        ((1.8, 5.0), (2.2, 5.0)),
        ((3.8, 5.0), (4.2, 5.0)),
        ((5.8, 5.0), (6.2, 5.0)),
    ]
    
    for (x1, y1), (x2, y2) in flow_paths:
        arrow = FancyArrowPatch((x1, y1), (x2, y2), arrowstyle='->',
                               mutation_scale=15, color='#4b5563', linewidth=1.5)
        ax.add_patch(arrow)
    
    # Decision diamond
    diamond = mpatches.RegularPolygon((3.0, 6.5), 4, radius=0.4, 
                                     orientation=np.pi/4, color='#fbbf24', ec='black', linewidth=2)
    ax.add_patch(diamond)
    ax.text(3.0, 6.5, 'Valid?', ha='center', va='center', fontsize=8, weight='bold')
    
    ax.set_title('Zero-Knowledge Proof Flow', fontsize=16, weight='bold', pad=20)
    plt.tight_layout()
    plt.savefig('images/zk-proof-flow.jpg', dpi=150, bbox_inches='tight', format='jpeg')
    plt.close()

def create_network_topology():
    """Create Network Topology Diagram"""
    fig, ax = plt.subplots(1, 1, figsize=(14, 10))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    # Central Psy Protocol
    psy_circle = Circle((5.0, 5.0), 1.0, color='#10b981', ec='black', linewidth=3)
    ax.add_patch(psy_circle)
    ax.text(5.0, 5.0, 'Psy Protocol\nPARTH Lanes', ha='center', va='center', 
           fontsize=11, weight='bold', color='white')
    
    # Cloak Nodes
    nodes = [
        (2.0, 2.0, 'CloakNode 1'),
        (8.0, 2.0, 'CloakNode 2'),
        (2.0, 8.0, 'CloakNode 3'),
        (8.0, 8.0, 'CloakNode 4'),
    ]
    
    for x, y, label in nodes:
        node = Circle((x, y), 0.6, color='#3b82f6', ec='black', linewidth=2)
        ax.add_patch(node)
        ax.text(x, y, label, ha='center', va='center', fontsize=9, weight='bold', color='white')
        
        # Connection to Psy
        line = FancyArrowPatch((x + 0.5*np.cos(np.arctan2(5-y, 5-x)),
                               y + 0.5*np.sin(np.arctan2(5-y, 5-x))),
                              (5.0 - 0.7*np.cos(np.arctan2(5-y, 5-x)),
                               5.0 - 0.7*np.sin(np.arctan2(5-y, 5-x))),
                              arrowstyle='->', mutation_scale=15, color='#6b7280', linewidth=2)
        ax.add_patch(line)
    
    # Users
    users = [
        (0.5, 1.0, 'User A'),
        (1.5, 1.0, 'User B'),
        (8.5, 1.0, 'User C'),
        (9.5, 1.0, 'User D'),
        (0.5, 9.0, 'User E'),
        (1.5, 9.0, 'User F'),
    ]
    
    for x, y, label in users:
        user = Ellipse((x, y), 0.4, 0.3, color='#8b5cf6', ec='black', linewidth=1.5)
        ax.add_patch(user)
        ax.text(x, y, label, ha='center', va='center', fontsize=7, weight='bold', color='white')
        
        # Connection to nearest node
        nearest_node = min(nodes, key=lambda n: np.sqrt((n[0]-x)**2 + (n[1]-y)**2))
        line = FancyArrowPatch((x, y), (nearest_node[0], nearest_node[1]),
                              arrowstyle='->', mutation_scale=10, color='#9ca3af', linewidth=1)
        ax.add_patch(line)
    
    ax.set_title('Network Topology', fontsize=16, weight='bold', pad=20)
    plt.tight_layout()
    plt.savefig('images/network-topology.jpg', dpi=150, bbox_inches='tight', format='jpeg')
    plt.close()

def create_state_management():
    """Create State Management Architecture Diagram"""
    fig, ax = plt.subplots(1, 1, figsize=(14, 10))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    # Merkle Tree visualization
    # Root
    root = Circle((5.0, 9.0), 0.3, color='#3b82f6', ec='black', linewidth=2)
    ax.add_patch(root)
    ax.text(5.0, 9.0, 'Root', ha='center', va='center', fontsize=8, weight='bold', color='white')
    
    # Level 1
    for i, x in enumerate([3.0, 7.0]):
        node = Circle((x, 7.5), 0.25, color='#60a5fa', ec='black', linewidth=1.5)
        ax.add_patch(node)
        line = FancyArrowPatch((x, 7.75), (4.5 + i*1.0, 8.7), arrowstyle='-',
                              mutation_scale=10, color='#4b5563', linewidth=1)
        ax.add_patch(line)
    
    # Level 2
    for i, x in enumerate([1.5, 4.5, 5.5, 8.5]):
        node = Circle((x, 6.0), 0.2, color='#93c5fd', ec='black', linewidth=1)
        ax.add_patch(node)
        parent_x = 3.0 if i < 2 else 7.0
        line = FancyArrowPatch((x, 6.2), (parent_x, 7.3), arrowstyle='-',
                              mutation_scale=10, color='#4b5563', linewidth=1)
        ax.add_patch(line)
    
    # Leaves (User States)
    for i, x in enumerate([0.5, 2.5, 4.0, 6.0, 7.0, 9.5]):
        leaf = Rectangle((x-0.2, 4.0), 0.4, 0.3, color='#dbeafe', ec='#3b82f6', linewidth=1.5)
        ax.add_patch(leaf)
        ax.text(x, 4.15, f'User {i+1}', ha='center', fontsize=7)
        parent_x = [1.5, 1.5, 4.5, 5.5, 5.5, 8.5][i]
        line = FancyArrowPatch((x, 4.3), (parent_x, 5.8), arrowstyle='-',
                              mutation_scale=10, color='#4b5563', linewidth=1)
        ax.add_patch(line)
    
    # RocksDB
    db_box = FancyBboxPatch((1.0, 1.5), 2.0, 1.0, boxstyle="round,pad=0.1",
                           edgecolor='#059669', facecolor='#d1fae5', linewidth=2)
    ax.add_patch(db_box)
    ax.text(2.0, 2.0, 'RocksDB\nPersistence', ha='center', va='center', 
           fontsize=10, weight='bold')
    
    # Connection from tree to DB
    line = FancyArrowPatch((4.0, 4.0), (2.0, 2.5), arrowstyle='->',
                          mutation_scale=15, color='#4b5563', linewidth=2)
    ax.add_patch(line)
    ax.text(2.5, 3.0, 'Persist State', ha='center', fontsize=8)
    
    ax.set_title('State Management: Merkle Tree Architecture', fontsize=16, weight='bold', pad=20)
    plt.tight_layout()
    plt.savefig('images/state-management.jpg', dpi=150, bbox_inches='tight', format='jpeg')
    plt.close()

def create_security_model():
    """Create Security Model Diagram"""
    fig, ax = plt.subplots(1, 1, figsize=(14, 10))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    # Central Security Core
    core = Circle((5.0, 5.0), 1.2, color='#dc2626', ec='black', linewidth=3)
    ax.add_patch(core)
    ax.text(5.0, 5.0, 'ZK Proof\nVerification', ha='center', va='center',
           fontsize=12, weight='bold', color='white')
    
    # Security layers
    layers = [
        ('Client-Side\nProving', 2.0, 2.0, '#3b82f6'),
        ('Merkle Proof\nValidation', 8.0, 2.0, '#10b981'),
        ('SDKey\nIdentity', 2.0, 8.0, '#8b5cf6'),
        ('On-Chain\nVerification', 8.0, 8.0, '#f59e0b'),
    ]
    
    for label, x, y, color in layers:
        layer = Circle((x, y), 0.8, color=color, ec='black', linewidth=2)
        ax.add_patch(layer)
        ax.text(x, y, label, ha='center', va='center', fontsize=9, weight='bold', color='white')
        
        # Connection to core
        line = FancyArrowPatch((x + 0.6*np.cos(np.arctan2(5-y, 5-x)),
                               y + 0.6*np.sin(np.arctan2(5-y, 5-x))),
                              (5.0 - 1.0*np.cos(np.arctan2(5-y, 5-x)),
                               5.0 - 1.0*np.sin(np.arctan2(5-y, 5-x))),
                              arrowstyle='->', mutation_scale=15, color='#4b5563', linewidth=2)
        ax.add_patch(line)
    
    # Threats (outside)
    threats = [
        ('Front-Running', 0.5, 5.0, '#ef4444'),
        ('Censorship', 9.5, 5.0, '#ef4444'),
    ]
    
    for label, x, y, color in threats:
        threat = mpatches.RegularPolygon((x, y), 3, radius=0.4, 
                                        orientation=0, color=color, ec='black', linewidth=2)
        ax.add_patch(threat)
        ax.text(x, y, label, ha='center', va='center', fontsize=8, weight='bold', color='white')
        
        # Blocked arrow
        blocked_x = 2.0 if x < 5 else 8.0
        line = FancyArrowPatch((x, y), (blocked_x, y), arrowstyle='->',
                              mutation_scale=15, color='#ef4444', linewidth=2, linestyle='--')
        ax.add_patch(line)
        ax.text((x + blocked_x)/2, y + 0.3, 'BLOCKED', ha='center', fontsize=8, 
               weight='bold', color='#ef4444')
    
    ax.set_title('Security Model: Multi-Layer Protection', fontsize=16, weight='bold', pad=20)
    plt.tight_layout()
    plt.savefig('images/security-model.jpg', dpi=150, bbox_inches='tight', format='jpeg')
    plt.close()

def create_performance_flow():
    """Create Performance Flow Diagram"""
    fig, ax = plt.subplots(1, 1, figsize=(14, 10))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    # Performance stages
    stages = [
        ('Proof Generation\n180ms', 1.5, 8.0, '#3b82f6'),
        ('Proof Submission\n10ms', 3.5, 8.0, '#8b5cf6'),
        ('On-Chain Verify\n50ms', 5.5, 8.0, '#10b981'),
        ('Settlement\n240ms Total', 7.5, 8.0, '#f59e0b'),
    ]
    
    for label, x, y, color in stages:
        box = FancyBboxPatch((x-0.6, y-0.4), 1.2, 0.8, boxstyle="round,pad=0.1",
                            edgecolor=color, facecolor=color, alpha=0.3, linewidth=2)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=9, weight='bold')
    
    # Flow arrows
    for i in range(len(stages) - 1):
        arrow = FancyArrowPatch((stages[i][1] + 0.6, stages[i][2]),
                               (stages[i+1][1] - 0.6, stages[i+1][2]),
                               arrowstyle='->', mutation_scale=20, color='#4b5563', linewidth=2)
        ax.add_patch(arrow)
    
    # Throughput metrics
    metrics = [
        ('Single User\n~4.1 TPS', 1.5, 5.0, '#6366f1'),
        ('1000 Users\n~4,100 TPS', 3.5, 5.0, '#8b5cf6'),
        ('Batch Mode\n~12,000 TPS', 5.5, 5.0, '#a855f7'),
        ('PoW 2.0\n1.2M TPS', 7.5, 5.0, '#ec4899'),
    ]
    
    for label, x, y, color in metrics:
        box = FancyBboxPatch((x-0.6, y-0.4), 1.2, 0.8, boxstyle="round,pad=0.1",
                            edgecolor=color, facecolor=color, alpha=0.2, linewidth=2)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=9, weight='bold')
    
    # Connection lines
    for i in range(len(stages)):
        line = FancyArrowPatch((stages[i][1], stages[i][2] - 0.4),
                              (metrics[i][1], metrics[i][2] + 0.4),
                              arrowstyle='->', mutation_scale=10, color='#9ca3af', 
                              linewidth=1, linestyle='--')
        ax.add_patch(line)
    
    ax.set_title('Performance Flow: Latency & Throughput', fontsize=16, weight='bold', pad=20)
    plt.tight_layout()
    plt.savefig('images/performance-flow.jpg', dpi=150, bbox_inches='tight', format='jpeg')
    plt.close()

def create_deployment_architecture():
    """Create Deployment Architecture Diagram"""
    fig, ax = plt.subplots(1, 1, figsize=(14, 10))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    # Cloud/Infrastructure
    cloud_box = FancyBboxPatch((1.0, 7.0), 8.0, 2.0, boxstyle="round,pad=0.2",
                              edgecolor='#3b82f6', facecolor='#eff6ff', linewidth=2)
    ax.add_patch(cloud_box)
    ax.text(5.0, 8.5, 'Cloud Infrastructure', ha='center', va='center', 
           fontsize=12, weight='bold')
    
    # Services
    services = [
        ('Frontend\n(React)', 2.0, 7.5, '#3b82f6'),
        ('API Server\n(Axum)', 4.0, 7.5, '#8b5cf6'),
        ('CloakNode\n(Rust)', 6.0, 7.5, '#ef4444'),
        ('RocksDB\n(State)', 8.0, 7.5, '#10b981'),
    ]
    
    for label, x, y, color in services:
        box = FancyBboxPatch((x-0.5, y-0.3), 1.0, 0.6, boxstyle="round,pad=0.1",
                            edgecolor=color, facecolor=color, alpha=0.3, linewidth=2)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=8, weight='bold')
    
    # Psy Protocol
    psy_box = FancyBboxPatch((3.0, 4.0), 4.0, 1.5, boxstyle="round,pad=0.2",
                            edgecolor='#059669', facecolor='#d1fae5', linewidth=3)
    ax.add_patch(psy_box)
    ax.text(5.0, 4.75, 'Psy Protocol Network', ha='center', va='center',
           fontsize=12, weight='bold')
    ax.text(5.0, 4.25, 'PARTH Lanes • Verifier Contract • PoW 2.0', ha='center', fontsize=9)
    
    # Connection
    line = FancyArrowPatch((5.0, 7.0), (5.0, 5.5), arrowstyle='<->',
                           mutation_scale=20, color='#4b5563', linewidth=2)
    ax.add_patch(line)
    ax.text(5.5, 6.25, 'RPC/WebSocket', ha='left', fontsize=9)
    
    # Users
    user_box = FancyBboxPatch((1.0, 1.0), 8.0, 1.5, boxstyle="round,pad=0.2",
                             edgecolor='#8b5cf6', facecolor='#f3e8ff', linewidth=2)
    ax.add_patch(user_box)
    ax.text(5.0, 1.75, 'End Users (Browser/Mobile)', ha='center', va='center',
           fontsize=11, weight='bold')
    
    # User connection
    line2 = FancyArrowPatch((5.0, 2.5), (5.0, 7.0), arrowstyle='<->',
                            mutation_scale=20, color='#4b5563', linewidth=2)
    ax.add_patch(line2)
    ax.text(5.5, 4.75, 'HTTPS/WebSocket', ha='left', fontsize=9)
    
    ax.set_title('Deployment Architecture', fontsize=16, weight='bold', pad=20)
    plt.tight_layout()
    plt.savefig('images/deployment-architecture.jpg', dpi=150, bbox_inches='tight', format='jpeg')
    plt.close()

if __name__ == '__main__':
    print("Generating technical diagrams...")
    create_system_architecture()
    print("✓ System Architecture")
    create_data_flow()
    print("✓ Data Flow: Trade Execution")
    create_component_interaction()
    print("✓ Component Interaction")
    create_zk_proof_flow()
    print("✓ Zero-Knowledge Proof Flow")
    create_network_topology()
    print("✓ Network Topology")
    create_state_management()
    print("✓ State Management Architecture")
    create_security_model()
    print("✓ Security Model")
    create_performance_flow()
    print("✓ Performance Flow")
    create_deployment_architecture()
    print("✓ Deployment Architecture")
    print("\nAll diagrams generated successfully in /images folder!")

