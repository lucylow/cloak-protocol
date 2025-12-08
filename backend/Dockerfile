# Multi-stage Dockerfile for Cloak Protocol Backend
# Optimized for minimal image size (<100MB target)

# Stage 1: Build
FROM rust:1.80-slim as builder

WORKDIR /build

# Install build dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy manifests
COPY Cargo.toml Cargo.lock ./

# Copy source code
COPY src ./src
COPY tests ./tests

# Build release binary
RUN cargo build --release

# Stage 2: Runtime
FROM debian:bookworm-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy binary from builder
COPY --from=builder /build/target/release/cloak-backend /app/cloak-backend

# Create data directory
RUN mkdir -p /data

# Expose ports
EXPOSE 8080 50051 9090

# Set environment variables
ENV RUST_LOG=info
ENV DATABASE_PATH=/data/cloak_state.db

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Run the binary
CMD ["/app/cloak-backend"]
