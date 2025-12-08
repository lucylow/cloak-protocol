//! Error types for Cloak Protocol Backend
//!
//! Provides comprehensive error handling using thiserror for better error messages
//! and error propagation throughout the codebase.

use thiserror::Error;

/// Main error type for the Cloak Protocol backend
#[derive(Error, Debug)]
pub enum CloakError {
    /// Database-related errors
    #[error("Database error: {0}")]
    Database(#[from] rocksdb::Error),

    /// Serialization/deserialization errors
    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),

    /// Hex encoding/decoding errors
    #[error("Hex encoding error: {0}")]
    Hex(#[from] hex::FromHexError),

    /// HTTP client errors
    #[error("HTTP client error: {0}")]
    Http(#[from] reqwest::Error),

    /// Psy Protocol client errors
    #[error("Psy Protocol error: {0}")]
    PsyProtocol(String),

    /// State management errors
    #[error("State error: {0}")]
    State(String),

    /// User not found error
    #[error("User not found: {0}")]
    UserNotFound(String),

    /// Invalid input error
    #[error("Invalid input: {0}")]
    InvalidInput(String),

    /// Insufficient balance error
    #[error("Insufficient balance: required {required}, available {available}")]
    InsufficientBalance { required: u128, available: u128 },

    /// Proof verification error
    #[error("Proof verification failed: {0}")]
    ProofVerification(String),

    /// Network/connection errors
    #[error("Network error: {0}")]
    Network(String),

    /// Configuration errors
    #[error("Configuration error: {0}")]
    Config(String),

    /// IO errors
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    /// Generic error for other cases
    #[error("Error: {0}")]
    Other(String),
}

/// Result type alias for convenience
pub type CloakResult<T> = Result<T, CloakError>;

impl CloakError {
    /// Creates a new Psy Protocol error
    pub fn psy_protocol(msg: impl Into<String>) -> Self {
        Self::PsyProtocol(msg.into())
    }

    /// Creates a new state error
    pub fn state(msg: impl Into<String>) -> Self {
        Self::State(msg.into())
    }

    /// Creates a new invalid input error
    pub fn invalid_input(msg: impl Into<String>) -> Self {
        Self::InvalidInput(msg.into())
    }

    /// Creates a new user not found error
    pub fn user_not_found(sdkey_hash: &[u8; 32]) -> Self {
        Self::UserNotFound(hex::encode(sdkey_hash))
    }
}

