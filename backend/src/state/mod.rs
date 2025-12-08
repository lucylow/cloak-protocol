//! State Management Module
//!
//! Manages the private state of the Cloak Protocol, including:
//! - User balances and Merkle tree commitments
//! - State transitions (Deposit, Trade, Withdrawal)
//! - RocksDB persistence layer for local state caching

use crate::error::{CloakError, CloakResult};
use std::collections::HashMap;
use rocksdb::{DB, Options};
use serde::{Deserialize, Serialize};
use tracing::{info, warn, error};

/// Represents a user's private state in the Cloak Protocol
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserState {
    /// Hash of the user's SDKey (programmable identity)
    pub sdkey_hash: [u8; 32],

    /// Current Merkle tree root commitment
    /// TODO: Replace with actual Poseidon hash field element
    pub merkle_root: [u8; 32],

    /// User's asset balances (token_id -> amount)
    pub balances: HashMap<String, u128>,

    /// Nonce for ordering transactions
    pub nonce: u64,

    /// Last block height when state was updated
    pub last_updated_block: u64,
}

impl UserState {
    /// Creates a new user state with an SDKey hash
    pub fn new(sdkey_hash: [u8; 32]) -> Self {
        Self {
            sdkey_hash,
            merkle_root: [0u8; 32],
            balances: HashMap::new(),
            nonce: 0,
            last_updated_block: 0,
        }
    }

    /// Updates a user's balance for a specific token
    pub fn update_balance(&mut self, token_id: String, amount: u128) {
        self.balances.insert(token_id, amount);
        self.nonce = self.nonce.saturating_add(1);
    }

    /// Gets a user's balance for a specific token
    pub fn get_balance(&self, token_id: &str) -> u128 {
        self.balances.get(token_id).copied().unwrap_or(0)
    }
}

/// Represents a state transition in the Cloak Protocol
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum StateTransition {
    /// User deposits assets into the private state
    Deposit {
        user_sdkey_hash: [u8; 32],
        token_id: String,
        amount: u128,
    },

    /// User executes a private trade
    Trade {
        user_a_sdkey_hash: [u8; 32],
        user_b_sdkey_hash: [u8; 32],
        token_a_id: String,
        token_b_id: String,
        amount_a: u128,
        amount_b: u128,
    },

    /// User withdraws assets from the private state
    Withdrawal {
        user_sdkey_hash: [u8; 32],
        token_id: String,
        amount: u128,
    },
}

/// Simple Merkle tree structure for state commitments
/// TODO: Replace with full Poseidon-based Merkle tree implementation
#[derive(Debug, Clone)]
pub struct SimpleMerkleTree {
    /// Leaf nodes (user state hashes)
    leaves: Vec<[u8; 32]>,

    /// Current root hash
    root: [u8; 32],
}

impl SimpleMerkleTree {
    /// Creates a new empty Merkle tree
    pub fn new() -> Self {
        Self {
            leaves: Vec::new(),
            root: [0u8; 32],
        }
    }

    /// Adds a leaf to the tree and updates the root
    /// TODO: Implement proper Poseidon hashing for tree updates
    pub fn add_leaf(&mut self, leaf: [u8; 32]) {
        self.leaves.push(leaf);
        self.update_root();
    }

    /// Updates the root hash (placeholder implementation)
    fn update_root(&mut self) {
        // TODO: Implement proper Merkle tree root computation using Poseidon
        if self.leaves.is_empty() {
            self.root = [0u8; 32];
        } else {
            // Temporary: XOR all leaves as a placeholder
            // This is a simple hash that will be replaced with Poseidon
            let mut root = [0u8; 32];
            for leaf in &self.leaves {
                for (i, byte) in leaf.iter().enumerate() {
                    root[i] ^= byte;
                }
            }
            self.root = root;
        }
    }

    /// Gets the current root hash
    pub fn get_root(&self) -> [u8; 32] {
        self.root
    }

    /// Gets the number of leaves in the tree
    pub fn len(&self) -> usize {
        self.leaves.len()
    }

    /// Checks if the tree is empty
    pub fn is_empty(&self) -> bool {
        self.leaves.is_empty()
    }
}

impl Default for SimpleMerkleTree {
    fn default() -> Self {
        Self::new()
    }
}

/// State manager that handles persistence and state transitions
pub struct StateManager {
    /// In-memory cache of user states
    user_states: HashMap<[u8; 32], UserState>,

    /// Merkle tree for state commitments
    merkle_tree: SimpleMerkleTree,

    /// RocksDB instance for persistence
    db: DB,
}

impl Drop for StateManager {
    fn drop(&mut self) {
        // Flush any pending writes before closing
        if let Err(e) = self.db.flush() {
            error!("Failed to flush RocksDB on drop: {}", e);
        }
    }
}

impl StateManager {
    /// Creates a new state manager with RocksDB persistence
    pub fn new(db_path: &str) -> CloakResult<Self> {
        let mut opts = Options::default();
        opts.create_if_missing(true);
        opts.set_max_open_files(1000);
        opts.set_write_buffer_size(64 * 1024 * 1024); // 64MB write buffer

        let db = DB::open(&opts, db_path)?;
        info!("Opened RocksDB at: {}", db_path);

        let mut manager = Self {
            user_states: HashMap::new(),
            merkle_tree: SimpleMerkleTree::new(),
            db,
        };

        // Load existing state from database
        manager.load_state_from_db()?;

        Ok(manager)
    }

    /// Loads state from RocksDB into memory
    fn load_state_from_db(&mut self) -> CloakResult<()> {
        let iter = self.db.iterator(rocksdb::IteratorMode::Start);
        let mut loaded_count = 0;

        for item in iter {
            let (key, value) = item?;
            if let Some(key_str) = std::str::from_utf8(&key).ok() {
                if key_str.starts_with("user:") {
                    let user_state: UserState = serde_json::from_slice(&value)?;
                    self.user_states.insert(user_state.sdkey_hash, user_state);
                    loaded_count += 1;
                }
            }
        }

        info!("Loaded {} user states from database", loaded_count);
        Ok(())
    }

    /// Persists a user state to RocksDB
    fn persist_user_state(&self, sdkey_hash: [u8; 32], user_state: &UserState) -> CloakResult<()> {
        let key = format!("user:{}", hex::encode(sdkey_hash));
        let value = serde_json::to_vec(user_state)?;
        self.db.put(key, value)?;
        Ok(())
    }

    /// Registers a new user in the state
    pub fn register_user(&mut self, sdkey_hash: [u8; 32]) -> CloakResult<()> {
        if self.user_states.contains_key(&sdkey_hash) {
            return Err(CloakError::State(format!(
                "User already registered: {}",
                hex::encode(sdkey_hash)
            )));
        }

        let user_state = UserState::new(sdkey_hash);
        self.user_states.insert(sdkey_hash, user_state.clone());

        // Persist to RocksDB
        self.persist_user_state(sdkey_hash, &user_state)?;

        info!("Registered user: {}", hex::encode(sdkey_hash));
        Ok(())
    }

    /// Applies a state transition
    /// TODO: Implement full ZK proof verification before applying transitions
    pub fn apply_transition(&mut self, transition: StateTransition) -> CloakResult<()> {
        match transition {
            StateTransition::Deposit {
                user_sdkey_hash,
                token_id,
                amount,
            } => {
                let user_state = self.user_states.get_mut(&user_sdkey_hash)
                    .ok_or_else(|| CloakError::user_not_found(&user_sdkey_hash))?;
                
                let current = user_state.get_balance(&token_id);
                user_state.update_balance(token_id.clone(), current + amount);
                
                // Persist updated state
                self.persist_user_state(user_sdkey_hash, user_state)?;
                
                info!(
                    "Deposit: user {} deposited {} of {}",
                    hex::encode(user_sdkey_hash),
                    amount,
                    token_id
                );
            }
            StateTransition::Trade {
                user_a_sdkey_hash,
                user_b_sdkey_hash,
                token_a_id,
                token_b_id,
                amount_a,
                amount_b,
            } => {
                // TODO: Verify ZK proof before executing trade
                let user_a = self.user_states.get_mut(&user_a_sdkey_hash)
                    .ok_or_else(|| CloakError::user_not_found(&user_a_sdkey_hash))?;
                
                let balance_a = user_a.get_balance(&token_a_id);
                if balance_a < amount_a {
                    return Err(CloakError::InsufficientBalance {
                        required: amount_a,
                        available: balance_a,
                    });
                }
                
                user_a.update_balance(token_a_id.clone(), balance_a - amount_a);
                let balance_b = user_a.get_balance(&token_b_id);
                user_a.update_balance(token_b_id.clone(), balance_b + amount_b);
                self.persist_user_state(user_a_sdkey_hash, user_a)?;
                
                let user_b = self.user_states.get_mut(&user_b_sdkey_hash)
                    .ok_or_else(|| CloakError::user_not_found(&user_b_sdkey_hash))?;
                
                let balance_b = user_b.get_balance(&token_b_id);
                if balance_b < amount_b {
                    return Err(CloakError::InsufficientBalance {
                        required: amount_b,
                        available: balance_b,
                    });
                }
                
                user_b.update_balance(token_b_id.clone(), balance_b - amount_b);
                let balance_a = user_b.get_balance(&token_a_id);
                user_b.update_balance(token_a_id.clone(), balance_a + amount_a);
                self.persist_user_state(user_b_sdkey_hash, user_b)?;
                
                info!(
                    "Trade: user {} and {} executed trade",
                    hex::encode(user_a_sdkey_hash),
                    hex::encode(user_b_sdkey_hash)
                );
            }
            StateTransition::Withdrawal {
                user_sdkey_hash,
                token_id,
                amount,
            } => {
                let user_state = self.user_states.get_mut(&user_sdkey_hash)
                    .ok_or_else(|| CloakError::user_not_found(&user_sdkey_hash))?;
                
                let current = user_state.get_balance(&token_id);
                if current < amount {
                    return Err(CloakError::InsufficientBalance {
                        required: amount,
                        available: current,
                    });
                }
                
                user_state.update_balance(token_id.clone(), current - amount);
                self.persist_user_state(user_sdkey_hash, user_state)?;
                
                info!(
                    "Withdrawal: user {} withdrew {} of {}",
                    hex::encode(user_sdkey_hash),
                    amount,
                    token_id
                );
            }
        }

        Ok(())
    }

    /// Gets a user's state
    pub fn get_user_state(&self, sdkey_hash: [u8; 32]) -> Option<UserState> {
        self.user_states.get(&sdkey_hash).cloned()
    }

    /// Gets the current Merkle root
    pub fn get_merkle_root(&self) -> [u8; 32] {
        self.merkle_tree.get_root()
    }

    /// Gets the number of registered users
    pub fn get_user_count(&self) -> usize {
        self.user_states.len()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_user_state_creation() {
        let sdkey_hash = [1u8; 32];
        let user = UserState::new(sdkey_hash);
        assert_eq!(user.sdkey_hash, sdkey_hash);
        assert_eq!(user.nonce, 0);
        assert!(user.balances.is_empty());
    }

    #[test]
    fn test_user_balance_update() {
        let sdkey_hash = [1u8; 32];
        let mut user = UserState::new(sdkey_hash);
        user.update_balance("USDC".to_string(), 1000);
        assert_eq!(user.get_balance("USDC"), 1000);
        assert_eq!(user.nonce, 1);
    }

    #[test]
    fn test_merkle_tree_operations() {
        let mut tree = SimpleMerkleTree::new();
        assert!(tree.is_empty());

        let leaf = [2u8; 32];
        tree.add_leaf(leaf);
        assert_eq!(tree.len(), 1);
        assert!(!tree.is_empty());
    }
}
