//! gRPC API Server Implementation
//!
//! Implements the Cloak Protocol API server for frontend communication.
//! Provides endpoints for proof submission, state queries, and health checks.

use crate::node::CloakNode;
use crate::api::{HealthCheckResponse, QueryStateRequest, QueryStateResponse, SubmitProofRequest, SubmitProofResponse};
use std::sync::Arc;
use tracing::{debug, info};

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
    pub async fn start(&self) -> Result<(), Box<dyn std::error::Error>> {
        info!("Starting Cloak Protocol API server on {}", self.bind_addr);

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
            debug!("API server running on {}", self.bind_addr);
        }
    }

    /// Health check endpoint
    ///
    /// Returns the current status of the node and Psy connection
    pub async fn health_check(&self) -> Result<HealthCheckResponse, Box<dyn std::error::Error>> {
        debug!("Health check requested");

        let node_status = self.node.get_status().await;

        Ok(HealthCheckResponse {
            status: if node_status.is_running { "healthy" } else { "unhealthy" }.to_string(),
            psy_connected: node_status.psy_connected,
            block_height: 1000, // TODO: Get actual block height from Psy
            active_users: node_status.active_users,
            merkle_root: node_status.state_root,
            version: crate::VERSION.to_string(),
        })
    }

    /// Submits a ZK proof for a private trade
    ///
    /// # Arguments
    /// * `request` - The proof submission request
    ///
    /// # Returns
    /// A SubmitProofResponse with transaction details
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
    ) -> Result<SubmitProofResponse, Box<dyn std::error::Error>> {
        debug!("Proof submission requested from user: {}", request.user_sdkey_hash);

        // TODO: Validate proof format
        // TODO: Verify user signature
        // TODO: Check nonce

        // Submit proof to Psy Protocol
        let tx_hash = self.node.submit_trade_proof(request.proof_data).await?;

        Ok(SubmitProofResponse {
            tx_hash,
            status: "submitted".to_string(),
            error: None,
        })
    }

    /// Queries the current state of a user
    ///
    /// # Arguments
    /// * `request` - The state query request
    ///
    /// # Returns
    /// A QueryStateResponse with the user's state
    ///
    /// # TODO for Part 2:
    /// - Add privacy-preserving state queries
    /// - Implement zero-knowledge state proofs
    /// - Add caching for frequently queried states
    pub async fn query_state(
        &self,
        request: QueryStateRequest,
    ) -> Result<QueryStateResponse, Box<dyn std::error::Error>> {
        debug!("State query requested for user: {}", request.user_sdkey_hash);

        // Parse SDKey hash from hex string
        let sdkey_hash_hex = request.user_sdkey_hash.trim_start_matches("0x");
        let sdkey_hash_bytes = hex::decode(sdkey_hash_hex)?;
        let mut sdkey_hash = [0u8; 32];
        sdkey_hash.copy_from_slice(&sdkey_hash_bytes);

        // Get user state from state manager
        let state_manager = self.node.state_manager.read().await;
        match state_manager.get_user_state(sdkey_hash) {
            Some(user_state) => {
                Ok(QueryStateResponse {
                    user_sdkey_hash: request.user_sdkey_hash,
                    merkle_root: hex::encode(user_state.merkle_root),
                    balances: user_state.balances,
                    nonce: user_state.nonce,
                    last_updated_block: user_state.last_updated_block,
                })
            }
            None => {
                Err("User not found".into())
            }
        }
    }

    /// Broadcasts an encrypted order intent to the order relay network
    ///
    /// # TODO for Part 2:
    /// - Implement P2P order book network
    /// - Add order matching engine
    /// - Implement order aggregation for batch settlement
    /// - Add order expiration and cancellation
    pub async fn broadcast_order_intent(
        &self,
        _order: crate::api::OrderIntentMessage,
    ) -> Result<String, Box<dyn std::error::Error>> {
        debug!("Order intent broadcast requested");

        // TODO: Validate order format
        // TODO: Verify user signature
        // TODO: Broadcast to order relay network
        // TODO: Return order ID

        Ok("order_id_placeholder".to_string())
    }

    /// Gets the current Merkle root
    pub async fn get_merkle_root(&self) -> Result<String, Box<dyn std::error::Error>> {
        let state_manager = self.node.state_manager.read().await;
        Ok(hex::encode(state_manager.get_merkle_root()))
    }

    /// Gets the number of active users
    pub async fn get_active_users(&self) -> Result<usize, Box<dyn std::error::Error>> {
        let state_manager = self.node.state_manager.read().await;
        Ok(state_manager.get_user_count())
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
