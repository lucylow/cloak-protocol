# Integration Testing Guide

This guide provides instructions for running the integration test suite and manually deploying the Cloak Protocol to the Psy testnet.

## Running the End-to-End Test Suite

The integration tests cover the full trade lifecycle, from proof generation to on-chain settlement. They use a mock Psy verifier for local testing, so no testnet connection is required.

```bash
# Navigate to the backend directory
cd backend

# Run the integration tests
cargo test --test integration_tests -- --nocapture
```

This will execute all tests in `tests/integration_tests.rs`, including:

-   `test_e2e_trade_flow`: Simulates a complete trade between two users.
-   `test_privacy_no_leakage`: Verifies that no sensitive data is leaked publicly.
-   `test_proof_generation_batch`: Checks batch proof generation and verification.
-   `test_performance_throughput`: Benchmarks the proof generation throughput.
-   `test_concurrent_users`: Simulates 100 concurrent users trading.

## Manual Deployment to Psy Testnet

To deploy the verifier contract and initialize the system on the live Psy testnet, follow these steps:

1.  **Set Environment Variables**:

    Create a `.env` file in the `backend` directory with your deployer private key:

    ```
    DEPLOYER_PRIVATE_KEY=0xYourPrivateKeyHere
    ```

2.  **Run the Deployment Script**:

    The deployment logic is handled in `src/deploy/mod.rs`. You can trigger it via a dedicated main function or a CLI command.

    *(Note: A CLI for deployment is a planned feature.)*

3.  **Update Frontend Configuration**:

    Once deployed, update the `NEXT_PUBLIC_VERIFIER_CONTRACT_ADDRESS` in the frontend's environment variables to point to the new contract address.

## Troubleshooting Common Issues

-   **RPC Timeouts**: If you experience timeouts when connecting to the Psy testnet, check your internet connection and the status of the official RPC endpoint at `https://testnet-rpc.psy.xyz`.
-   **Proof Format Errors**: Ensure that the ZK circuits and the verifier contract are using the same version and parameters. Mismatches can lead to invalid proofs.
-   **Docker Compose Failures**: If `docker compose up` fails, check the logs for each service (`docker compose logs backend` and `docker compose logs frontend`) to identify the issue. Common problems include port conflicts or build failures to download dependencies.
