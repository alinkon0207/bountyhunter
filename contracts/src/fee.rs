use soroban_sdk::{ log, Env };
use crate::storage_types::{
    FEE_DECIMALS, /* INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT, */ 
    ErrorCode, DataKey, FeeInfo
};


pub fn fee_check(e: &Env) -> bool {
    let key = DataKey::Fee;

    if e.storage().instance().has(&key) {
        true
    }
    else {
        false
    }
}

pub fn fee_get(e: &Env) -> Result<FeeInfo, ErrorCode> {
    let key = DataKey::Fee;

    if !e.storage().instance().has(&key) {
        log!(e, "FeeInfo wasn't initialized");
        return Err(ErrorCode::FeeNotSet)
    }
    
    Ok(e.storage().instance().get(&key).unwrap())
}

pub fn fee_set(e: &Env, fee_info: &FeeInfo) {
    let key = DataKey::Fee;

    e.storage().instance().set(&key, fee_info);
    // e.storage().instance().bump(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
}

pub fn fee_calculate(_e: &Env, fee_info: &FeeInfo, amount: u64) -> u64 {
    amount * (fee_info.fee_rate as u64) / (u64::pow(10, FEE_DECIMALS))
}
