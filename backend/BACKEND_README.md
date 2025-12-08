# Cloak Protocol Backend - Rust Implementation

A foundational Rust backend for the Cloak Protocol ZK-Privacy DEX for RWAs, designed to integrate with the Psy Protocol testnet.

## Project Structure

```
cloak-backend/
├── Cargo.toml                 # Project manifest with dependencies
├── Cargo.lock                 # Dependency lock file
├── src/
│   ├── lib.rs                # Library root with module exports
│   ├── main.rs               # Binary entry point
│   ├── node/
│   │   └── mod.rs            # Core CloakNode architecture
│   ├── state/
│   │   └── mod.rs            # State management and persistence
│   ├── psy_client/
│   │   └── mod.rs            # Psy Protocol integration
│   └── api/
│       ├── mod.rs            # API types and messages
│       └── server.rs         # gRPC API server implementation
└── BACKEND_README.md         # This file
```

## Core Components

### 1. CloakNode (`src/node/mod.rs`)
The main orchestrator that coordinates all backend components:
- **state_manager**: Manages private state and Merkle tree commitments
- **prover_interface**: Interface to the ZK prover system
- **order_relay**: Relay for broadcasting encrypted order intents
- **psy_client**: Client for Psy Protocol testnet interaction

**Key Methods:**
- `new()` - Initialize with Psy testnet connection
- `start_event_loop()` - Main event loop subscribing to block headers
- `submit_trade_proof()` - Submit ZK proofs to verifier contract
- `get_status()` - Get current node status

### 2. StateManager (`src/state/mod.rs`)
Manages the private state with RocksDB persistence:

**Data Structures:**
- `UserState` - Represents a user's private state
  - `sdkey_hash: [u8; 32]` - User's SDKey hash
  - `merkle_root: [u8; 32]` - Merkle tree root commitment
  - `balances: HashMap<String, u128>` - Token balances
  - `nonce: u64` - Transaction ordering
  
- `StateTransition` - Enum for state changes
  - `Deposit` - User deposits assets
  - `Trade` - Private trade execution
  - `Withdrawal` - User withdraws assets

- `SimpleMerkleTree` - Placeholder for full Poseidon-based tree
  - `add_leaf()` - Add user state to tree
  - `get_root()` - Get current root hash

**Key Methods:**
- `new()` - Initialize with RocksDB
- `register_user()` - Register new user
- `apply_transition()` - Apply state transitions
- `get_user_state()` - Query user state
- `get_merkle_root()` - Get current root

### 3. PsyClient (`src/psy_client/mod.rs`)
Integrates with Psy Protocol testnet via WebSocket and HTTP:

**Key Types:**
- `PsyBlockHeader` - Block information from Psy chain
- `PsyTransaction` - Transaction details
- `ProofSubmissionResponse` - Proof submission result
- `ProofVerificationResult` - Proof verification result

**Key Methods:**
- `new()` - Create client and test connection
- `get_chain_state()` - Fetch latest block header
- `submit_proof()` - Submit ZK proof to verifier
- `verify_proof()` - Verify proof against contract
- `subscribe_blocks()` - Subscribe to block updates
- `is_connected()` - Check connection status

### 4. ApiServer (`src/api/server.rs`)
gRPC API server for frontend communication:

**Endpoints:**
- `health_check()` - Node and Psy connection status
- `submit_proof()` - Submit ZK proofs
- `query_state()` - Query user state
- `broadcast_order_intent()` - Broadcast encrypted orders
- `get_merkle_root()` - Get current Merkle root
- `get_active_users()` - Get number of active users

## Dependencies

### Core Dependencies
- **tokio** (1.35) - Async runtime
- **tonic** (0.11) - gRPC framework
- **prost** (0.12) - Protocol buffers
- **ark-ff, ark-ec, ark-poly** (0.4) - ZK cryptography
- **ethers** (2.0) - Ethereum/Web3 integration
- **rocksdb** (0.21) - Persistent state storage
- **tracing** (0.1) - Logging and diagnostics

## Building the Project

### Prerequisites
- Rust 1.80+
- Build tools: `gcc`, `pkg-config`, `libssl-dev`

### Installation
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install dependencies (Ubuntu/Debian)
sudo apt-get install build-essential pkg-config libssl-dev

# Build the project
cd cloak-backend
cargo build --release
```

### Running the Backend
```bash
# Debug mode
cargo run

# Release mode
cargo run --release

# With logging
RUST_LOG=debug cargo run
```

## Configuration

Default configuration (from `CloakConfig`):
```rust
CloakConfig {
    psy_rpc_url: "https://testnet-rpc.psy.xyz",
    api_bind_addr: "127.0.0.1:50051",
    db_path: "./cloak_state.db",
    verbose: false,
}
```

## Testing

Run unit tests:
```bash
cargo test
```

Run tests with output:
```bash
cargo test -- --nocapture
```

## TODO for Part 2 Implementation

### Node Architecture
- [ ] Implement full block subscription via WebSocket
- [ ] Add block processing pipeline
- [ ] Implement batch proof generation
- [ ] Add error recovery and retry logic

### State Management
- [ ] Replace SimpleMerkleTree with full Poseidon-based tree
- [ ] Implement ZK proof verification before state transitions
- [ ] Add state snapshot and recovery
- [ ] Implement state pruning for old entries

### Psy Integration
- [ ] Implement actual JSON-RPC calls to Psy testnet
- [ ] Add WebSocket subscription handling
- [ ] Implement transaction signing and submission
- [ ] Add transaction receipt polling
- [ ] Implement contract call encoding

### ZK Prover
- [ ] Implement arkworks circuit compilation
- [ ] Add witness generation pipeline
- [ ] Implement proof batching mechanism
- [ ] Add circuit caching

### Order Relay
- [ ] Implement P2P order book network
- [ ] Add order matching engine
- [ ] Implement order aggregation for batch settlement
- [ ] Add order expiration and cancellation

### API Server
- [ ] Implement actual tonic gRPC server
- [ ] Add service trait implementations
- [ ] Add request validation and error handling
- [ ] Add rate limiting and authentication
- [ ] Implement WebSocket subscriptions for events

## Integration with Frontend

The backend exposes a gRPC API on `127.0.0.1:50051` with the following message types:

### Request Types
- `SubmitProofRequest` - Submit ZK proof
- `QueryStateRequest` - Query user state
- `OrderIntentMessage` - Broadcast order intent

### Response Types
- `SubmitProofResponse` - Proof submission result
- `QueryStateResponse` - User state information
- `HealthCheckResponse` - Node status

## Performance Considerations

### Scalability
- Uses Psy Protocol's PARTH architecture for parallel state management
- Implements batch proof verification for high throughput
- RocksDB for efficient local state caching

### Security
- ZK proofs ensure privacy without revealing transaction details
- SDKey-based identity management
- Nonce-based replay protection

## License

This project is part of the Cloak Protocol and follows the same license as the main project.

## Support

For issues, questions, or contributions, please refer to the main Cloak Protocol repository.
