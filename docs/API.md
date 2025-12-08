# Cloak Protocol API Documentation

This document provides the OpenAPI 3.0 specification for the REST API, gRPC proto definitions, and WebSocket event schema.

## REST API (OpenAPI 3.0)

```yaml
openapi: 3.0.0
info:
  title: Cloak Protocol API
  version: 1.0.0
  description: REST API for the Cloak Protocol ZK-Privacy DEX.
servers:
  - url: http://localhost:8080
    description: Local development server

paths:
  /health:
    get:
      summary: Health Check
      responses:
        '200':
          description: System is healthy
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HealthResponse'

  /api/proof/submit:
    post:
      summary: Submit a ZK Proof
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SubmitProofRequest'
      responses:
        '200':
          description: Proof submitted successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SubmitProofResponse'

  /api/state/query:
    post:
      summary: Query User State
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/QueryStateRequest'
      responses:
        '200':
          description: User state retrieved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/QueryStateResponse'

components:
  schemas:
    HealthResponse:
      type: object
      properties:
        status: { type: string, example: "healthy" }
        psy_sync_status: { type: string, example: "synced" }
        block_height: { type: integer, example: 12345 }

    SubmitProofRequest:
      type: object
      properties:
        user_sdkey: { type: string }
        proof_data: { type: string, description: "Hex-encoded proof" }
        public_inputs: { type: array, items: { type: string } }
        signature: { type: string, description: "ECDSA signature" }

    SubmitProofResponse:
      type: object
      properties:
        proof_id: { type: string }
        status: { type: string, example: "submitted" }
        tx_hash: { type: string, example: "0x..." }

    QueryStateRequest:
      type: object
      properties:
        user_sdkey: { type: string }

    QueryStateResponse:
      type: object
      properties:
        balances: { type: array, items: { $ref: '#/components/schemas/Balance' } }
        positions: { type: array, items: { $ref: '#/components/schemas/Position' } }
        orders: { type: array, items: { $ref: '#/components/schemas/Order' } }

    # Add schemas for Order, Position, Balance, ZKProof here
```

## gRPC API

```protobuf
syntax = "proto3";

package api;

service CloakService {
  rpc HealthCheck(HealthCheckRequest) returns (HealthCheckResponse);
  rpc SubmitProof(SubmitProofRequest) returns (SubmitProofResponse);
  rpc QueryState(QueryStateRequest) returns (QueryStateResponse);
}

// Message definitions would go here...
```

## WebSocket Events

The WebSocket server at `/ws` pushes real-time updates.

**Event: `update`**

- **Description**: Sent periodically with the latest proofs and orders.
- **Payload**:

```json
{
  "type": "update",
  "proofs": [
    // Array of ZKProof objects
  ],
  "orders": [
    // Array of Order objects
  ]
}
```
