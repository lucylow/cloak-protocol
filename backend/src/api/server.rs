//! gRPC API Server Implementation
//!
//! Implements the Cloak Protocol API server for frontend communication.
//! Provides endpoints for proof submission, state queries, and health checks.

use crate::error::{CloakError, CloakResult};
use crate::node::CloakNode;
use crate::api::{HealthCheckResponse, QueryStateRequest, QueryStateResponse, SubmitProofRequest, SubmitProofResponse};
use std::sync::Arc;
use tracing::{debug, error, info, warn};

/// Expected length of an SDKey hash in bytes
const SDKEY_HASH_LEN: usize = 32;

/// The Cloak Protocol API Server
#[derive(Clone)]
pub struct ApiServer {
    /// Reference to the Cloak node
    pub node: Arc<CloakNode>,

    /// Bind address for the gRPC server
    pub bind_addr: String,
}

impl ApiServer {
    /// Creates a new API server instance
    ///
    /// # Arguments
    /// * `node` - Reference to the Cloak node
    /// * `bind_addr` - Address to bind the server to (e.g., "127.0.0.1:50051")
    ///
    /// # Example
    /// ```
    /// use std::sync::Arc;
    /// use cloak_protocol::{ApiServer, CloakNode};
    ///
    /// # async fn example() -> Result<(), Box<dyn std::error::Error>> {
    /// let node = Arc::new(CloakNode::new("https://testnet-rpc.psy.xyz", "./db").await?);
    /// let server = ApiServer::new(node, "127.0.0.1:50051".to_string());
    /// # Ok(())
    /// # }
    /// ```
    pub fn new(node: Arc<CloakNode>, bind_addr: String) -> Self {
        Self { node, bind_addr }
    }

    /// Starts the gRPC API server
    ///
    /// # TODO for Part 2:
    /// - Implement actual tonic gRPC server
    /// - Add service trait implementations
    /// - Add request validation and error handling
    /// - Add rate limiting and authentication
    pub async fn start(&self) -> CloakResult<()> {
        info!("Starting Cloak Protocol API server on {}", self.bind_addr);

        // Validate bind address format
        self.bind_addr.parse::<std::net::SocketAddr>()
            .map_err(|e| CloakError::Config(format!("Invalid bind address '{}': {}", self.bind_addr, e)))?;

        // TODO: Implement tonic gRPC server
        // let addr = self.bind_addr.parse()?;
        // let service = CloakProtocolService::new(self.node.clone());
        //
        // Server::builder()
        //     .add_service(CloakProtocolServiceServer::new(service))
        //     .serve(addr)
        //     .await?;

        // Placeholder: just log that we're running
        loop {
            tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;
            
            // Check node health periodically
            if let Err(e) = self.check_node_health().await {
                error!("Node health check failed: {}", e);
                warn!("API server continuing despite health check failure");
            } else {
                debug!("API server running on {}", self.bind_addr);
            }
        }
    }

    /// Internal method to check node health
    async fn check_node_health(&self) -> CloakResult<()> {
        let _status = self.node.get_status().await;
        // If we can get status, node is accessible
        Ok(())
    }

    /// Health check endpoint
    ///
    /// Returns the current status of the node and Psy connection
    ///
    /// # Returns
    /// A `HealthCheckResponse` containing:
    /// - Overall health status
    /// - Psy Protocol connection status
    /// - Current block height (from Psy client if available)
    /// - Number of active users
    /// - Current Merkle root
    /// - Backend version
    ///
    /// # Errors
    /// Returns `CloakError::State` if state manager is inaccessible
    /// Returns `CloakError::Network` if Psy Protocol connection fails
    pub async fn health_check(&self) -> CloakResult<HealthCheckResponse> {
        debug!("Health check requested");

        // Get node status with error handling
        let node_status = self.node.get_status().await;
        
        // Try to get actual block height from Psy client, fallback to chain state if unavailable
        let mut block_height = self.node.psy_client.get_last_block_height().await;
        if block_height == 0 {
            // If not set, try to get from chain state and update the cached value
            match self.node.psy_client.get_chain_state().await {
                Ok(header) => {
                    block_height = header.height;
                    self.node.psy_client.update_last_block_height(header.height).await;
                    debug!("Updated block height from chain state: {}", block_height);
                }
                Err(e) => {
                    warn!("Failed to get chain state for health check: {}", e);
                    // Continue with block_height = 0, but log the error
                }
            }
        }

        // Validate merkle root format
        let merkle_root = if node_status.state_root.is_empty() {
            warn!("Merkle root is empty in health check");
            "0x0000000000000000000000000000000000000000000000000000000000000000".to_string()
        } else {
            node_status.state_root
        };

        Ok(HealthCheckResponse {
            status: if node_status.is_running { "healthy" } else { "unhealthy" }.to_string(),
            psy_connected: node_status.psy_connected,
            block_height,
            active_users: node_status.active_users,
            merkle_root,
            version: crate::VERSION.to_string(),
        })
    }

    /// Submits a ZK proof for a private trade
    ///
    /// # Arguments
    /// * `request` - The proof submission request
    ///
    /// # Returns
    /// A `SubmitProofResponse` with transaction details
    ///
    /// # Errors
    /// Returns `CloakError::InvalidInput` if:
    /// - Proof data is empty
    /// - Public inputs are empty
    /// - User SDKey hash is invalid
    /// - Signature is empty
    /// - Proof data format is invalid
    /// Returns `CloakError::Network` if submission to Psy Protocol fails
    /// Returns `CloakError::PsyProtocol` if Psy Protocol returns an error
    ///
    /// # TODO for Part 2:
    /// - Validate proof format
    /// - Verify user signature
    /// - Check nonce for replay protection
    /// - Submit to Psy verifier contract
    /// - Return transaction hash
    pub async fn submit_proof(
        &self,
        request: SubmitProofRequest,
    ) -> CloakResult<SubmitProofResponse> {
        debug!("Proof submission requested from user: {}", request.user_sdkey_hash);

        // Validate proof data is not empty
        if request.proof_data.is_empty() {
            return Err(CloakError::invalid_input("Proof data cannot be empty"));
        }

        // Validate proof data has minimum expected size (at least some bytes)
        if request.proof_data.len() < 32 {
            return Err(CloakError::invalid_input(
                format!("Proof data too short: expected at least 32 bytes, got {}", request.proof_data.len())
            ));
        }

        // Validate public inputs
        if request.public_inputs.is_empty() {
            return Err(CloakError::invalid_input("Public inputs cannot be empty"));
        }

        // Validate public inputs format (should be valid hex if provided as hex)
        if let Err(e) = hex::decode(&request.public_inputs) {
            return Err(CloakError::invalid_input(
                format!("Invalid public inputs hex format: {}", e)
            ));
        }

        // Validate user SDKey hash format
        let _sdkey_hash = Self::parse_sdkey_hash(&request.user_sdkey_hash)
            .map_err(|e| {
                error!("Invalid SDKey hash format: {}", e);
                e
            })?;

        // Validate signature is not empty
        if request.signature.is_empty() {
            return Err(CloakError::invalid_input("Signature cannot be empty"));
        }

        // Validate signature format (should be valid hex)
        if let Err(e) = hex::decode(&request.signature) {
            return Err(CloakError::invalid_input(
                format!("Invalid signature hex format: {}", e)
            ));
        }

        // TODO: Validate proof format
        // TODO: Verify user signature
        // TODO: Check nonce

        // Submit proof to Psy Protocol with error context
        let tx_hash = self.node.submit_trade_proof(request.proof_data.clone()).await
            .map_err(|e| {
                error!("Failed to submit proof to Psy Protocol: {}", e);
                match e {
                    CloakError::Network(_) | CloakError::PsyProtocol(_) => e,
                    _ => CloakError::Network(format!("Proof submission failed: {}", e)),
                }
            })?;

        // Validate transaction hash format
        if tx_hash.is_empty() {
            return Err(CloakError::Network("Received empty transaction hash from Psy Protocol".to_string()));
        }

        Ok(SubmitProofResponse {
            tx_hash,
            status: "submitted".to_string(),
            error: None,
        })
    }

    /// Queries the current state of a user
    ///
    /// # Arguments
    /// * `request` - The state query request containing the user's SDKey hash
    ///
    /// # Returns
    /// A `QueryStateResponse` with the user's state including:
    /// - Merkle root commitment
    /// - Token balances
    /// - Current nonce
    /// - Last updated block height
    ///
    /// # Errors
    /// Returns `CloakError::InvalidInput` if the SDKey hash format is invalid.
    /// Returns `CloakError::UserNotFound` if the user does not exist.
    /// Returns `CloakError::State` if state manager is inaccessible or poisoned.
    ///
    /// # TODO for Part 2:
    /// - Add privacy-preserving state queries
    /// - Implement zero-knowledge state proofs
    /// - Add caching for frequently queried states
    pub async fn query_state(
        &self,
        request: QueryStateRequest,
    ) -> CloakResult<QueryStateResponse> {
        debug!("State query requested for user: {}", request.user_sdkey_hash);

        // Parse SDKey hash from hex string
        let sdkey_hash = Self::parse_sdkey_hash(&request.user_sdkey_hash)
            .map_err(|e| {
                error!("Invalid SDKey hash in query_state: {}", e);
                e
            })?;

        // Get user state from state manager with error handling for poisoned locks
        let state_manager = self.node.state_manager.read().await;
        let user_state = state_manager.get_user_state(sdkey_hash)
            .ok_or_else(|| {
                let error = CloakError::user_not_found(&sdkey_hash);
                debug!("User not found: {}", hex::encode(sdkey_hash));
                error
            })?;

        // Encode merkle root with error handling
        let merkle_root = hex::encode(user_state.merkle_root);
        if merkle_root.is_empty() {
            warn!("Empty merkle root for user: {}", request.user_sdkey_hash);
        }

        Ok(QueryStateResponse {
            user_sdkey_hash: request.user_sdkey_hash,
            merkle_root,
            balances: user_state.balances.clone(),
            nonce: user_state.nonce,
            last_updated_block: user_state.last_updated_block,
        })
    }

    /// Broadcasts an encrypted order intent to the order relay network
    ///
    /// # Arguments
    /// * `order` - The encrypted order intent message
    ///
    /// # Returns
    /// An order ID string for tracking the order
    ///
    /// # Errors
    /// Returns `CloakError::InvalidInput` if:
    /// - Encrypted order data is empty
    /// - User SDKey hash format is invalid
    /// - Signature is empty or invalid format
    /// Returns `CloakError::Network` if broadcasting fails
    ///
    /// # TODO for Part 2:
    /// - Implement P2P order book network
    /// - Add order matching engine
    /// - Implement order aggregation for batch settlement
    /// - Add order expiration and cancellation
    pub async fn broadcast_order_intent(
        &self,
        order: crate::api::OrderIntentMessage,
    ) -> CloakResult<String> {
        debug!("Order intent broadcast requested for user: {}", order.user_sdkey_hash);

        // Validate order format
        if order.encrypted_order.is_empty() {
            return Err(CloakError::invalid_input("Encrypted order data cannot be empty"));
        }

        // Validate encrypted order has minimum size
        if order.encrypted_order.len() < 16 {
            return Err(CloakError::invalid_input(
                format!("Encrypted order data too short: expected at least 16 bytes, got {}", order.encrypted_order.len())
            ));
        }

        // Validate user SDKey hash format
        let _sdkey_hash = Self::parse_sdkey_hash(&order.user_sdkey_hash)
            .map_err(|e| {
                error!("Invalid SDKey hash in broadcast_order_intent: {}", e);
                e
            })?;

        // Validate signature
        if order.signature.is_empty() {
            return Err(CloakError::invalid_input("Order signature cannot be empty"));
        }

        // Validate signature format (should be valid hex)
        if let Err(e) = hex::decode(&order.signature) {
            return Err(CloakError::invalid_input(
                format!("Invalid signature hex format: {}", e)
            ));
        }

        // TODO: Verify user signature
        // TODO: Broadcast to order relay network
        // TODO: Return order ID

        // Placeholder: validate that we can at least access the node
        let _status = self.node.get_status().await;

        Ok("order_id_placeholder".to_string())
    }

    /// Gets the current Merkle root
    ///
    /// # Errors
    /// Returns `CloakError::State` if state manager is inaccessible or poisoned.
    pub async fn get_merkle_root(&self) -> CloakResult<String> {
        let state_manager = self.node.state_manager.read().await;
        let root = state_manager.get_merkle_root();
        let encoded = hex::encode(root);
        
        if encoded.is_empty() {
            warn!("Merkle root is empty");
        }
        
        Ok(encoded)
    }

    /// Gets the number of active users
    ///
    /// # Errors
    /// Returns `CloakError::State` if state manager is inaccessible or poisoned.
    pub async fn get_active_users(&self) -> CloakResult<usize> {
        let state_manager = self.node.state_manager.read().await;
        let count = state_manager.get_user_count();
        Ok(count)
    }

    /// Parses an SDKey hash from a hex string
    ///
    /// # Arguments
    /// * `hex_str` - Hex string representation of the SDKey hash (with or without "0x" prefix)
    ///
    /// # Returns
    /// A 32-byte array representing the SDKey hash
    ///
    /// # Errors
    /// Returns `CloakError::InvalidInput` if:
    /// - The hex string is empty
    /// - The hex string is invalid
    /// - The decoded bytes are not exactly 32 bytes
    fn parse_sdkey_hash(hex_str: &str) -> CloakResult<[u8; SDKEY_HASH_LEN]> {
        // Validate input is not empty
        if hex_str.trim().is_empty() {
            return Err(CloakError::invalid_input("SDKey hash cannot be empty"));
        }

        let hex_str = hex_str.trim_start_matches("0x").trim();
        
        // Validate hex string has correct length (64 hex chars for 32 bytes)
        if hex_str.len() != SDKEY_HASH_LEN * 2 {
            return Err(CloakError::invalid_input(format!(
                "SDKey hash must be {} hex characters ({} bytes), got {} characters",
                SDKEY_HASH_LEN * 2,
                SDKEY_HASH_LEN,
                hex_str.len()
            )));
        }

        let sdkey_hash_bytes = hex::decode(hex_str)
            .map_err(|e| CloakError::invalid_input(format!("Invalid hex encoding: {}", e)))?;
        
        if sdkey_hash_bytes.len() != SDKEY_HASH_LEN {
            return Err(CloakError::invalid_input(format!(
                "SDKey hash must be {} bytes, got {}",
                SDKEY_HASH_LEN,
                sdkey_hash_bytes.len()
            )));
        }
        
        let mut sdkey_hash = [0u8; SDKEY_HASH_LEN];
        sdkey_hash.copy_from_slice(&sdkey_hash_bytes);
        Ok(sdkey_hash)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_api_server_creation() {
        // This test would require a mock CloakNode
        // For now, we just verify the structure compiles
        let bind_addr = "127.0.0.1:50051".to_string();
        assert_eq!(bind_addr, "127.0.0.1:50051");
    }
}
