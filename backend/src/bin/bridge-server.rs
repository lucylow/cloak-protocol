// Cloak Protocol Bridge Server - Standalone REST API
// This binary runs the HTTP/WebSocket bridge without the full node

use cloak_backend::api::bridge;
use tracing::info;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize logging
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .init();

    info!("Starting Cloak Protocol Bridge Server");

    // Get port from environment or use default
    let port = std::env::var("API_PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse::<u16>()
        .unwrap_or(8080);

    info!("Bridge server will listen on port {}", port);

    // Run the bridge server
    bridge::run_server(port).await?;

    Ok(())
}
