//! API Server Module
//!
//! Provides gRPC API server for frontend communication and state queries.
//! Implements health checks, proof submission, and state management endpoints.

pub mod server;
pub mod bridge;

pub use server::ApiServer;

use serde::{Deserialize, Serialize};

/// Request to submit a ZK proof for a private trade
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SubmitProofRequest {
    /// The ZK proof data (serialized)
    pub proof_data: Vec<u8>,

    /// Public inputs for the proof
    pub public_inputs: Vec<u8>,

    /// User's SDKey hash
    pub user_sdkey_hash: String,

    /// Nonce for replay protection
    pub nonce: u64,

    /// Signature over the proof (for authentication)
    pub signature: String,
}

/// Response from proof submission
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SubmitProofResponse {
    /// Transaction hash on Psy Protocol
    pub tx_hash: String,

    /// Status of the submission
    pub status: String,

    /// Error message if submission failed
    pub error: Option<String>,
}

/// Request to query user state
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QueryStateRequest {
    /// User's SDKey hash
    pub user_sdkey_hash: String,
}

/// Response with user state information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QueryStateResponse {
    /// User's SDKey hash
    pub user_sdkey_hash: String,

    /// Current Merkle root commitment
    pub merkle_root: String,

    /// User's balances (token_id -> amount)
    pub balances: std::collections::HashMap<String, u128>,

    /// Current nonce
    pub nonce: u64,

    /// Last block height when state was updated
    pub last_updated_block: u64,
}

/// Encrypted order intent for private trading
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OrderIntentMessage {
    /// Encrypted order data
    pub encrypted_order: Vec<u8>,

    /// User's SDKey hash
    pub user_sdkey_hash: String,

    /// Timestamp of the order
    pub timestamp: u64,

    /// Signature for authentication
    pub signature: String,

    /// TODO: Add order matching hints (encrypted)
    /// TODO: Add liquidity provision parameters
}

/// Health check response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HealthCheckResponse {
    /// Overall health status
    pub status: String,

    /// Psy Protocol connection status
    pub psy_connected: bool,

    /// Current block height on Psy
    pub block_height: u64,

    /// Number of active users
    pub active_users: usize,

    /// Current Merkle root
    pub merkle_root: String,

    /// Version of the backend
    pub version: String,
}
