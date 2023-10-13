#![no_std]

mod storage_types;
mod admin;
mod fee;
mod work;
mod bounty;


use soroban_sdk::{
    token, contract, contractimpl, BytesN, 
    Env, Address, String
};
use crate::storage_types::{ FeeInfo, ErrorCode };
use crate::admin::{ has_administrator, read_administrator, write_administrator };
use crate::fee::{ fee_check, fee_set, fee_get };
use crate::bounty::{
    bounty_create, bounty_approve, bounty_reject, bounty_cancel, bounty_close, 
    bounty_apply, bounty_submit, 
};


#[contract]
pub struct BountyHunter;

#[contractimpl]
impl BountyHunter {
    // initialize
    pub fn init(e: Env, admin: Address) {
        write_administrator(&e, &admin);
    }

    // get version
    pub fn version() -> u32 {
        1
    }

    // upgrade
    pub fn upgrade(e: Env, new_wasm_hash: BytesN<32>) {
        let admin: Address = read_administrator(&e);
        admin.require_auth();

        e.deployer().update_current_contract_wasm(new_wasm_hash);
    }

    // set admin
    pub fn set_admin(e: Env, new_admin: Address) -> Result<(), ErrorCode> {
        let admin: Address = read_administrator(&e);
        admin.require_auth();

        write_administrator(&e, &new_admin);
        Ok(())
    }

    // get admin
    pub fn get_admin(e: Env) -> Result<Address, ErrorCode> {
        if !has_administrator(&e) {
            return Err(ErrorCode::AdminNotSet)
        }

        let admin = read_administrator(&e);
        Ok(admin)
    }

    // only admin can set fee
    pub fn set_fee(e: Env, fee_rate: u32, fee_wallet: Address) -> Result<(), ErrorCode> {
        let admin: Address = read_administrator(&e);
        admin.require_auth();

        let fee_info: FeeInfo = FeeInfo {fee_rate, fee_wallet};
        fee_set(&e, &fee_info);

        return Ok(())
    }

    // get fee
    pub fn get_fee(e: Env) -> Result<(u32, Address), ErrorCode> {
        if !fee_check(&e) {
            return Err(ErrorCode::FeeNotSet)
        }

        let fee_info = fee_get(&e).unwrap();
        return Ok((fee_info.fee_rate, fee_info.fee_wallet))
    }

    // return new bounty id on success, errorcode on failure
    pub fn create_bounty(e: Env, 
        creator: Address, 
        name: String, 
        reward: u64, 
        pay_token: Address, 
        deadline: u64
    ) -> Result<u32, ErrorCode> {
        let ret: Result<u32, ErrorCode> = bounty_create(&e, 
            &creator, 
            &name, 
            reward, 
            &pay_token, 
            deadline
        );

        return ret
    }

    // returns work_id on success, errorcode on failure
    pub fn apply_bounty(e: Env, 
        participant: Address, 
        bounty_id: u32
    ) -> Result<u32, ErrorCode> {
        let ret: Result<u32, ErrorCode> = bounty_apply(&e, &participant, bounty_id);

        return ret
    }

    pub fn submit_work(e: Env, 
        participant: Address, 
        work_id: u32
    ) -> Result<i32, ErrorCode> {
        let ret: Result<i32, ErrorCode> = bounty_submit(&e, &participant, work_id);

        return ret
    }

    pub fn approve_work(e: Env, 
        creator: Address, 
        work_id: u32
    ) -> Result<i32, ErrorCode> {
        let ret: Result<i32, ErrorCode> = bounty_approve(&e, &creator, work_id);

        return ret
    }

    pub fn reject_work(e: Env, 
        creator: Address, 
        work_id: u32
    ) -> Result<i32, ErrorCode> {
        let ret: Result<i32, ErrorCode> = bounty_reject(&e, &creator, work_id);

        return ret
    }

    pub fn cancel_bounty(e: Env, 
        creator: Address, 
        bounty_id: u32
    ) -> Result<i32, ErrorCode> {
        let ret: Result<i32, ErrorCode> = bounty_cancel(&e, &creator, bounty_id);

        return ret
    }

    pub fn close_bounty(e: Env, 
        admin: Address, 
        bounty_id: u32
    ) -> Result<u32, ErrorCode> {
        let ret: Result<u32, ErrorCode> = bounty_close(&e, &admin, bounty_id);

        return ret
    }

    
    pub fn token_balances(e: Env, 
        account: Address, 
        token: Address, 
    ) -> u64 {
        let token_client = token::Client::new(&e, &token);
        token_client.balance(&account) as u64
    }
}


mod test;
