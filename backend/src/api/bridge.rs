// REST API Bridge for Frontend Integration
// Wraps gRPC services with HTTP/JSON endpoints for Next.js compatibility

use crate::error::CloakError;
use axum::{
    extract::{Json, State, WebSocketUpgrade},
    http::{header, Method, StatusCode},
    response::{IntoResponse, Response},
    routing::{get, post},
    Router,
};
use futures_util::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;
use tower_http::cors::{Any, CorsLayer};

// ============================================================================
// API Types matching frontend mockData.ts
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Order {
    pub id: String,
    pub side: String, // "buy" | "sell"
    pub asset: String,
    pub amount: f64,
    pub price: f64,
    pub total: f64,
    pub time: String, // ISO 8601
    pub status: String, // "open" | "filled" | "cancelled"
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Position {
    pub asset: String,
    pub amount: f64,
    pub avg_price: f64,
    pub current_price: f64,
    pub pnl: f64,
    pub pnl_percent: f64,
    pub privacy_status: String, // "shielded" | "public" | "generating"
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ZKProof {
    pub id: String,
    #[serde(rename = "type")]
    pub proof_type: String, // "balance" | "trade" | "compliance"
    pub status: String, // "generating" | "complete" | "verified"
    pub constraints: u64,
    pub prove_time: u64, // milliseconds
    pub proof_size: u64, // bytes
    pub timestamp: String, // ISO 8601
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SubmitProofRequest {
    pub user_sdkey: String,
    pub proof_data: String, // hex-encoded proof
    pub public_inputs: Vec<String>,
    pub signature: String, // ECDSA signature
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SubmitProofResponse {
    pub proof_id: String,
    pub status: String,
    pub tx_hash: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct QueryStateRequest {
    pub user_sdkey: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct QueryStateResponse {
    pub balances: Vec<Balance>,
    pub positions: Vec<Position>,
    pub orders: Vec<Order>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Balance {
    pub token: String,
    pub amount: f64,
    pub privacy_status: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HealthResponse {
    pub status: String,
    pub psy_sync_status: String,
    pub block_height: u64,
    pub connected_peers: u32,
}

// ============================================================================
// Shared State
// ============================================================================

#[derive(Clone)]
pub struct AppState {
    pub orders: Arc<RwLock<Vec<Order>>>,
    pub positions: Arc<RwLock<Vec<Position>>>,
    pub proofs: Arc<RwLock<Vec<ZKProof>>>,
    pub psy_block_height: Arc<RwLock<u64>>,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            orders: Arc::new(RwLock::new(vec![
                Order {
                    id: "1".to_string(),
                    side: "buy".to_string(),
                    asset: "RWA-CREDIT".to_string(),
                    amount: 100.0,
                    price: 0.95,
                    total: 95.0,
                    time: chrono::Utc::now().to_rfc3339(),
                    status: "open".to_string(),
                },
            ])),
            positions: Arc::new(RwLock::new(vec![
                Position {
                    asset: "RWA-CREDIT".to_string(),
                    amount: 125.4,
                    avg_price: 0.92,
                    current_price: 0.95,
                    pnl: 3800.0,
                    pnl_percent: 3.26,
                    privacy_status: "shielded".to_string(),
                },
            ])),
            proofs: Arc::new(RwLock::new(vec![
                ZKProof {
                    id: "proof-001".to_string(),
                    proof_type: "trade".to_string(),
                    status: "verified".to_string(),
                    constraints: 1247392,
                    prove_time: 182,
                    proof_size: 288,
                    timestamp: chrono::Utc::now().to_rfc3339(),
                },
            ])),
            psy_block_height: Arc::new(RwLock::new(0)),
        }
    }
}

// ============================================================================
// HTTP Handlers
// ============================================================================

async fn health_handler(State(state): State<AppState>) -> Json<HealthResponse> {
    let block_height = *state.psy_block_height.read().await;
    Json(HealthResponse {
        status: "healthy".to_string(),
        psy_sync_status: "synced".to_string(),
        block_height,
        connected_peers: 4,
    })
}

async fn submit_proof_handler(
    State(state): State<AppState>,
    Json(req): Json<SubmitProofRequest>,
) -> Result<Json<SubmitProofResponse>, StatusCode> {
    // Validate proof data is not empty
    if req.proof_data.is_empty() {
        return Err(StatusCode::BAD_REQUEST);
    }
    
    // TODO: Validate signature
    // TODO: Verify proof using ZK verifier
    // TODO: Submit to Psy testnet
    
    let proof_id = format!("proof-{}", uuid::Uuid::new_v4());
    
    // Add to proofs list
    let new_proof = ZKProof {
        id: proof_id.clone(),
        proof_type: "trade".to_string(),
        status: "generating".to_string(),
        constraints: 1247392,
        prove_time: 182,
        proof_size: 288,
        timestamp: chrono::Utc::now().to_rfc3339(),
    };
    
    state.proofs.write().await.push(new_proof);
    
    Ok(Json(SubmitProofResponse {
        proof_id,
        status: "submitted".to_string(),
        tx_hash: Some("0x1234567890abcdef".to_string()),
    }))
}

async fn query_state_handler(
    State(state): State<AppState>,
    Json(req): Json<QueryStateRequest>,
) -> Json<QueryStateResponse> {
    let positions = state.positions.read().await.clone();
    let orders = state.orders.read().await.clone();
    
    Json(QueryStateResponse {
        balances: vec![
            Balance {
                token: "RWA-CREDIT".to_string(),
                amount: 125.4,
                privacy_status: "shielded".to_string(),
            },
        ],
        positions,
        orders,
    })
}

async fn get_orders_handler(State(state): State<AppState>) -> Json<Vec<Order>> {
    let orders = state.orders.read().await.clone();
    Json(orders)
}

async fn get_positions_handler(State(state): State<AppState>) -> Json<Vec<Position>> {
    let positions = state.positions.read().await.clone();
    Json(positions)
}

async fn get_proofs_handler(State(state): State<AppState>) -> Json<Vec<ZKProof>> {
    let proofs = state.proofs.read().await.clone();
    Json(proofs)
}

// WebSocket handler for real-time updates
async fn ws_handler(
    ws: WebSocketUpgrade,
    State(state): State<AppState>,
) -> Response {
    ws.on_upgrade(|socket| handle_socket(socket, state))
}

async fn handle_socket(
    socket: axum::extract::ws::WebSocket,
    state: AppState,
) {
    use axum::extract::ws::Message;
    use tokio::time::{interval, Duration};
    
    let (mut sender, mut receiver) = socket.split();
    let mut interval = interval(Duration::from_secs(2));
    
    loop {
        tokio::select! {
            _ = interval.tick() => {
                // Send real-time updates - clone only when sending
                let proofs: Vec<ZKProof> = {
                    let guard = state.proofs.read().await;
                    guard.clone()
                };
                let orders: Vec<Order> = {
                    let guard = state.orders.read().await;
                    guard.clone()
                };
                
                let update = serde_json::json!({
                    "type": "update",
                    "proofs": proofs,
                    "orders": orders,
                });
                
                if sender.send(Message::Text(update.to_string())).await.is_err() {
                    break;
                }
            }
            result = receiver.next() => {
                // Handle incoming messages or connection close
                match result {
                    Some(Ok(Message::Close(_))) => break,
                    Some(Err(_)) => break,
                    None => break,
                    _ => {}
                }
            }
        }
    }
}

// ============================================================================
// Router Setup
// ============================================================================

pub fn create_router() -> Router {
    let state = AppState::default();
    
    // CORS configuration
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers([header::CONTENT_TYPE, header::AUTHORIZATION]);
    
    Router::new()
        .route("/health", get(health_handler))
        .route("/api/proof/submit", post(submit_proof_handler))
        .route("/api/state/query", post(query_state_handler))
        .route("/api/orders", get(get_orders_handler))
        .route("/api/positions", get(get_positions_handler))
        .route("/api/proofs", get(get_proofs_handler))
        .route("/ws", get(ws_handler))
        .layer(cors)
        .with_state(state)
}

pub async fn run_server(port: u16) -> Result<(), CloakError> {
    let app = create_router();
    let addr = format!("0.0.0.0:{}", port);
    
    tracing::info!("REST API server listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    axum::serve(listener, app).await
        .map_err(|e| CloakError::Network(format!("Failed to start HTTP server: {}", e)))?;
    
    Ok(())
}
