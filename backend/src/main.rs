//! Cloak Protocol Backend - Main Entry Point
//!
//! Initializes and runs the Cloak Protocol node with API server.
//! Connects to Psy Protocol testnet and starts the event loop.

use cloak_backend::{CloakConfig, CloakNode, ApiServer, CloakError};
use std::sync::Arc;
use tracing::{info, error};

#[tokio::main]
async fn main() -> Result<(), CloakError> {
    // Initialize logging
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .init();

    info!("Starting Cloak Protocol Backend v{}", cloak_backend::VERSION);

    // Load configuration (default or from environment)
    let config = CloakConfig::default();
    info!("Configuration loaded:");
    info!("  Psy RPC URL: {}", config.psy_rpc_url);
    info!("  API Bind Address: {}", config.api_bind_addr);
    info!("  REST API Port: {}", config.rest_api_port);
    info!("  Database Path: {}", config.db_path);

    // Initialize the Cloak node
    let node = Arc::new(
        CloakNode::new(&config.psy_rpc_url, &config.db_path).await
            .map_err(|e| {
                error!("Failed to initialize Cloak node: {}", e);
                e
            })?
    );
    info!("Cloak node initialized successfully");

    // Initialize the REST API bridge server (for frontend)
    info!("Starting REST API bridge server on port {}", config.rest_api_port);
    let bridge_handle = {
        let port = config.rest_api_port;
        tokio::spawn(async move {
            if let Err(e) = cloak_backend::api::bridge::run_server(port).await {
                error!("REST API bridge server error: {}", e);
            }
        })
    };

    // Initialize the gRPC API server (for future use)
    let api_server = ApiServer::new(node.clone(), config.api_bind_addr.clone());
    info!("gRPC API server initialized on {} (placeholder)", config.api_bind_addr);

    // Spawn the gRPC API server in a background task
    let api_server_handle = {
        let api_server = api_server.clone();
        tokio::spawn(async move {
            if let Err(e) = api_server.start().await {
                error!("gRPC API server error: {}", e);
            }
        })
    };

    // Start the node's event loop
    info!("Starting Cloak node event loop");
    node.start_event_loop().await.map_err(|e| {
        error!("Event loop error: {}", e);
        e
    })?;
    info!("Event loop completed");

    // Wait for API servers to complete (they run indefinitely)
    tokio::select! {
        result = bridge_handle => {
            if let Err(e) = result {
                error!("Bridge server task error: {}", e);
            }
        }
        result = api_server_handle => {
            if let Err(e) = result {
                error!("gRPC API server task error: {}", e);
            }
        }
    }

    Ok(())
}
