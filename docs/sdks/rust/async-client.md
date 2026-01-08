---
title: "Rust Async Client"
category: "SDKs"
---

# Rust Async Client

Built on `tokio`, the Rust client offers zero-cost abstractions for high-performance applications.

## Cargo.toml

```toml
[dependencies]
bmdrm = { version = "0.8", features = ["async", "tls-native"] }
tokio = { version = "1", features = ["full"] }
```

## Connecting

```rust
use bmdrm::Client;
use std::error::Error;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let client = Client::builder()
        .api_key("sk_live_rust_999")
        .build()?;

    let response = client.get_status().await?;
    println!("System Status: {:?}", response.status);

    Ok(())
}
```
