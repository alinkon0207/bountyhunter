
use soroban_sdk::{ Env, Address };

use crate::storage_types::{
    // INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT, 
    WorkStatus, WorkInfo, WorkKey, DataKey
};


pub fn work_create(
    e: &Env, 
    participant: &Address, 
    bounty_id: u32
) -> u32 {
    // write work info
    let work_count: u32 = e.storage().instance().get(&DataKey::WorkCount).unwrap_or(0);
    let work_id: u32 = work_count;

    work_write_id(
        e,
        work_id,
        &WorkInfo {
            participant: participant.clone(), 
            bounty_id, 
            status: WorkStatus::APPLIED
        },
    );
    
    // increase work count
    e.storage().instance().set(&DataKey::WorkCount, &(work_count + 1));
    // e.storage().instance().bump(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);

    work_id
}

pub fn work_read(e: &Env, work_id: u32) -> WorkInfo {
    e.storage().instance().get(&DataKey::RegWorks(work_id)).unwrap()
}

pub fn work_write_id(e: &Env, work_id: u32, work: &WorkInfo) {
    e.storage().instance().set(&DataKey::RegWorks(work_id), work);
    // e.storage().instance().bump(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
}

pub fn work_check_id(e: &Env, work_id: u32) -> bool {
    if e.storage().instance().has(&DataKey::RegWorks(work_id)) {
        true
    }
    else {
        false
    }
}

pub fn work_write_key(e: &Env, participant: &Address, bounty_id: u32, val: u32) {
    e.storage().instance().set(&DataKey::RegWorkKeys(WorkKey {bounty_id, participant: participant.clone()}), &val);
    // e.storage().instance().bump(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
}

pub fn work_check_key(e: &Env, participant: &Address, bounty_id: u32) -> bool {
    if e.storage().instance().has(&DataKey::RegWorkKeys(WorkKey {bounty_id, participant: participant.clone()})) {
        true
    }
    else {
        false
    }
}
