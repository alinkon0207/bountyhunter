# Sorobounty.xyz
![Image](https://github.com/Tellus-Cooperative/sorobounty.xyz/blob/main/sorobounty_logo.png)
## Overview
The Bounty Hunter Web Application is a platform that facilitates the creation and participation in bounties for various tasks. This application leverages the Stellar blockchain through the Soroban platform to establish an Escrow Smart Contract, ensuring secure fund management, authentication, and a review stage for accepting or rejecting work.

## Modules
This project is structured into six modules, each responsible for specific aspects of the smart contract functionality:

**Fee Module**: Handles the setting and retrieval of fees and supports fee functionality checks. Fee information includes the fee rate and wallet.

**Participance Module**: Manages the application for bounties. Participants can apply for a bounty (set participance) and check their participance status.

**Work Module**: Responsible for submitting work. It supports the creation, retrieval, and writing of work.

**Bounty Module**: Simulates real bounties. It supports creating bounties, funding them (putting money in escrow), submitting work, approving or rejecting work, cancelling, and closing work.

**Lib Module**: Contains export functions for web developers to use. These functions will be explained further in the documentation.

**Test Module**: Contains test functions for testing with Cargo. Currently, it includes four test cases, which will be discussed in more detail later.

## Data Structures
Data structures are defined in storage_types.rs and include:

**Constants**: These include constants like FEE_DECIMALS, DEF_FEE_RATE, etc.

**Enums**: Enumerations such as BountyStatus, WorkStatus, DataKey, and error codes are defined here.

**Structs**: Various structs like FeeInfo, BountyInfo, etc., are defined to structure data within the contract.

## Function Descriptions (Lib Module)
The Lib module provides several essential functions for managing the Escrow Smart Contract:

`set_fee`: Sets fee information with parameters for the environment (e), fee rate (in units of 1/10FEE_DECIMALS), and fee wallet address.

`create_bounty`: Creates a new bounty with parameters for the creator's address, bounty name, reward amount, payment token address, and deadline.

`fund_bounty`: Adds funds to a specific bounty by providing the creator's address and the bounty's ID.

`participate_bounty`: Allows workers to apply for a bounty by specifying their address and the bounty ID.

`submit_work`: Enables workers to submit their work for a specific bounty, providing their address, the bounty ID, and the work repository URL.

`approve_work`: Allows the creator to approve a worker's submitted work by specifying the creator's address and the work ID.

`reject_work`: Allows the creator to reject a worker's submitted work using the creator's address and the work ID.

`cancel_bounty`: Enables the creator to cancel a bounty by providing the creator's address and the bounty ID.

`close_bounty`: Closes an expired bounty, a function typically executed by a special account (administrator), with parameters for the administrator's address and the bounty ID.

Additionally, there are accessory functions:

`count_bounties`: Returns the number of bounties created.

`token_balances`: Retrieves the balance of a specific token for the specified account.

`get_error`: Retrieves error codes.

## Build, Test, and Deploy
Prerequisites
Before building, testing, or deploying the Soroban Escrow Smart Contract, ensure you have the following prerequisites:

- Install Rust using `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`.
- Add the wasm32-unknown-unknown target with `rustup target add wasm32-unknown-unknown`.
- Install Soroban CLI version 0.8.0 with `cargo install --locked --version 0.8.0 soroban-cli`.
- Install build-essential with `sudo apt install build-essential`.
- Make sure Soroban is properly set up.

### Tests
Run tests using the following commands:

```cd path_of_project
cargo test
```

### Deployments
To deploy the Soroban Escrow Smart Contract, use the following commands:

``` cargo build --target wasm32-unknown-unknown --release
soroban contract deploy \
    --wasm target/wasm32-unknown-unknown/release/[project-name].wasm \
    --source <secret key of issuer> \
    --rpc-url https://rpc-futurenet.stellar.org:443 \
    --network-passphrase 'Test SDF Future Network ; October 2022'
```
A new contract ID will be generated upon successful deployment.

## References
- [Stellar Developer Documentation](https://developers.stellar.org/docs)
- [Soroban Platform](https://soroban.stellar.org)
- [Rust Programming Language](https://doc.rust-lang.org/book/)
- [Tellus Cooperative](https://telluscoop.com)

