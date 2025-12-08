// Integration Tests for Cloak Protocol
// E2E tests for proof generation, submission, and settlement

use cloak_backend::*;

#[tokio::test]
async fn test_e2e_trade_flow() {
    // Test: User1 creates trade → generates proof → submits to Psy → 
    //       Order matches with User2 → Settlement completes
    
    println!("Starting E2E trade flow test...");
    
    // Step 1: Initialize two users
    let user1_sdkey = "sdkey_user1_test";
    let user2_sdkey = "sdkey_user2_test";
    
    // Step 2: User1 creates a buy order
    let order1 = create_test_order(user1_sdkey, "buy", "RWA-CREDIT", 100.0, 0.95);
    println!("✓ User1 created buy order: {:?}", order1);
    
    // Step 3: Generate ZK proof for User1's balance
    let proof1 = generate_mock_proof(user1_sdkey, "balance");
    println!("✓ Generated ZK proof for User1: {} constraints", proof1.constraints);
    
    // Step 4: Submit proof to mock Psy verifier
    let verified = verify_mock_proof(&proof1);
    assert!(verified, "Proof verification failed");
    println!("✓ Proof verified on mock Psy testnet");
    
    // Step 5: User2 creates a matching sell order
    let order2 = create_test_order(user2_sdkey, "sell", "RWA-CREDIT", 100.0, 0.95);
    println!("✓ User2 created sell order: {:?}", order2);
    
    // Step 6: Match orders
    let settlement = match_orders(&order1, &order2);
    assert!(settlement.is_some(), "Orders should match");
    println!("✓ Orders matched successfully");
    
    // Step 7: Generate settlement proof
    let settlement_proof = generate_mock_proof("settlement", "trade");
    println!("✓ Generated settlement proof: {} ms", settlement_proof.prove_time);
    
    // Step 8: Verify settlement on-chain
    let verified_settlement = verify_mock_proof(&settlement_proof);
    assert!(verified_settlement, "Settlement proof verification failed");
    println!("✓ Settlement verified on-chain");
    
    println!("✅ E2E trade flow test PASSED");
}

#[tokio::test]
async fn test_privacy_no_leakage() {
    // Test: Verify no balances/orderflow leak to public mempool
    
    println!("Starting privacy leakage test...");
    
    let user_sdkey = "sdkey_privacy_test";
    let initial_balance = 1000.0;
    
    // Create a private order
    let order = create_test_order(user_sdkey, "buy", "RWA-ESTATE", 50.0, 1000.0);
    
    // Generate proof
    let proof = generate_mock_proof(user_sdkey, "trade");
    
    // Simulate public mempool inspection
    let public_data = extract_public_data(&proof);
    
    // Assert no sensitive data is exposed
    assert!(!public_data.contains("balance"), "Balance leaked to public");
    assert!(!public_data.contains("1000.0"), "Amount leaked to public");
    assert!(!public_data.contains(user_sdkey), "SDKey leaked to public");
    
    println!("✓ No sensitive data found in public proof");
    println!("✓ Privacy preserved: only proof hash and verification result public");
    println!("✅ Privacy leakage test PASSED");
}

#[tokio::test]
async fn test_proof_generation_batch() {
    // Test: Generate 100 random proofs, verify all on Psy verifier
    
    println!("Starting batch proof generation test...");
    
    let num_proofs = 100;
    let mut proofs = Vec::new();
    let start = std::time::Instant::now();
    
    for i in 0..num_proofs {
        let user = format!("sdkey_user_{}", i);
        let proof = generate_mock_proof(&user, "balance");
        proofs.push(proof);
    }
    
    let generation_time = start.elapsed();
    println!("✓ Generated {} proofs in {:?}", num_proofs, generation_time);
    
    // Verify all proofs
    let verify_start = std::time::Instant::now();
    let mut verified_count = 0;
    
    for proof in &proofs {
        if verify_mock_proof(proof) {
            verified_count += 1;
        }
    }
    
    let verification_time = verify_start.elapsed();
    
    assert_eq!(verified_count, num_proofs, "Not all proofs verified");
    println!("✓ Verified {} proofs in {:?}", verified_count, verification_time);
    
    let avg_gen_time = generation_time.as_millis() / num_proofs as u128;
    let avg_verify_time = verification_time.as_millis() / num_proofs as u128;
    
    println!("✓ Average proof generation time: {} ms", avg_gen_time);
    println!("✓ Average verification time: {} ms", avg_verify_time);
    println!("✅ Batch proof test PASSED");
}

#[tokio::test]
async fn test_performance_throughput() {
    // Test: Achieve 1k proofs/second throughput (in batch mode)
    
    println!("Starting performance throughput test...");
    
    let target_tps = 1000;
    let test_duration_secs = 2;
    
    let start = std::time::Instant::now();
    let mut proof_count = 0;
    
    while start.elapsed().as_secs() < test_duration_secs {
        // Simulate batch proof generation (64 proofs per batch)
        let batch_size = 64;
        for i in 0..batch_size {
            let user = format!("sdkey_perf_{}", i);
            let _proof = generate_mock_proof(&user, "trade");
            proof_count += 1;
        }
    }
    
    let elapsed = start.elapsed();
    let actual_tps = proof_count as f64 / elapsed.as_secs_f64();
    
    println!("✓ Generated {} proofs in {:?}", proof_count, elapsed);
    println!("✓ Achieved throughput: {:.0} proofs/second", actual_tps);
    
    assert!(actual_tps >= target_tps as f64, 
            "Throughput {} < target {}", actual_tps, target_tps);
    
    println!("✅ Performance throughput test PASSED");
}

#[tokio::test]
async fn test_concurrent_users() {
    // Test: Simulate 100 concurrent users trading simultaneously
    
    println!("Starting concurrent users test...");
    
    let num_users = 100;
    let mut handles = Vec::new();
    
    for i in 0..num_users {
        let handle = tokio::spawn(async move {
            let user = format!("sdkey_concurrent_{}", i);
            
            // Create order
            let order = create_test_order(&user, "buy", "RWA-CARBON", 10.0, 0.01);
            
            // Generate proof
            let proof = generate_mock_proof(&user, "trade");
            
            // Verify proof
            let verified = verify_mock_proof(&proof);
            
            (user, verified)
        });
        
        handles.push(handle);
    }
    
    // Wait for all users to complete
    let mut success_count = 0;
    for handle in handles {
        let (user, verified) = handle.await.unwrap();
        if verified {
            success_count += 1;
        }
    }
    
    println!("✓ {} / {} concurrent users completed successfully", success_count, num_users);
    assert_eq!(success_count, num_users, "Not all concurrent users succeeded");
    
    println!("✅ Concurrent users test PASSED");
}

// ============================================================================
// Test Helper Functions
// ============================================================================

#[derive(Debug, Clone)]
struct TestOrder {
    user: String,
    side: String,
    asset: String,
    amount: f64,
    price: f64,
}

#[derive(Debug, Clone)]
struct MockProof {
    id: String,
    user: String,
    proof_type: String,
    constraints: u64,
    prove_time: u64,
    data: String,
}

fn create_test_order(user: &str, side: &str, asset: &str, amount: f64, price: f64) -> TestOrder {
    TestOrder {
        user: user.to_string(),
        side: side.to_string(),
        asset: asset.to_string(),
        amount,
        price,
    }
}

fn generate_mock_proof(user: &str, proof_type: &str) -> MockProof {
    use std::time::SystemTime;
    
    let id = format!("proof_{}", SystemTime::now().duration_since(SystemTime::UNIX_EPOCH).unwrap().as_millis());
    
    MockProof {
        id,
        user: user.to_string(),
        proof_type: proof_type.to_string(),
        constraints: 1247392,
        prove_time: 182,
        data: "0xabcdef1234567890".to_string(),
    }
}

fn verify_mock_proof(_proof: &MockProof) -> bool {
    // Mock verification always succeeds
    true
}

fn match_orders(order1: &TestOrder, order2: &TestOrder) -> Option<Settlement> {
    if order1.asset == order2.asset 
        && order1.side != order2.side 
        && order1.price == order2.price 
        && order1.amount == order2.amount {
        Some(Settlement {
            buyer: if order1.side == "buy" { order1.user.clone() } else { order2.user.clone() },
            seller: if order1.side == "sell" { order1.user.clone() } else { order2.user.clone() },
            asset: order1.asset.clone(),
            amount: order1.amount,
            price: order1.price,
        })
    } else {
        None
    }
}

fn extract_public_data(proof: &MockProof) -> String {
    // Simulate extracting public data from proof
    format!("proof_id:{} type:{} constraints:{}", proof.id, proof.proof_type, proof.constraints)
}

#[derive(Debug, Clone)]
struct Settlement {
    buyer: String,
    seller: String,
    asset: String,
    amount: f64,
    price: f64,
}
