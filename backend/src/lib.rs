//! Cloak Protocol Backend
//!
//! A Rust backend for the Cloak Protocol ZK-Privacy DEX for RWAs.
//! This library provides the foundational infrastructure for:
//! - Node architecture and event loop management
//! - State management with Merkle tree commitments
//! - Psy Protocol integration and testnet connectivity
//! - gRPC API server for frontend communication

pub mod api;
pub mod node;
pub mod psy_client;
pub mod state;
pub mod deploy;

pub use api::server::ApiServer;
pub use node::CloakNode;
pub use psy_client::PsyClient;
pub use state::{StateManager, UserState};

/// Version of the Cloak Protocol backend
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

/// Configuration for the Cloak backend
#[derive(Debug, Clone)]
pub struct CloakConfig {
    /// Psy Protocol testnet RPC endpoint
    pub psy_rpc_url: String,
    /// Local API server bind address
    pub api_bind_addr: String,
    /// RocksDB database path
    pub db_path: String,
    /// Enable verbose logging
    pub verbose: bool,
}

impl Default for CloakConfig {
    fn default() -> Self {
        Self {
            psy_rpc_url: "https://testnet-rpc.psy.xyz".to_string(),
            api_bind_addr: "127.0.0.1:50051".to_string(),
            db_path: "./cloak_state.db".to_string(),
            verbose: false,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_config() {
        let config = CloakConfig::default();
        assert_eq!(config.api_bind_addr, "127.0.0.1:50051");
        assert_eq!(config.db_path, "./cloak_state.db");
    }
}
