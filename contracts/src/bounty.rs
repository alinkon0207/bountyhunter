const BOUNTY: Symbol = symbol_short!("BOUNTY");

use soroban_sdk::{
    log, token, symbol_short, 
    Env, Address, Symbol, String
};
use crate::storage_types::{
    INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT, BALANCE_BUMP_AMOUNT, 
    WorkStatus, WorkInfo, BountyStatus, BountyInfo, DataKey, ErrorCode
};
use crate::fee::{ fee_get, fee_calculate, fee_check };
use crate::work::{ work_create, work_read, work_write_id, work_write_key, work_check_id, work_check_key };


// returns new bounty id on success, errorcode on failure
pub fn bounty_create(
    e: &Env, 
    creator: &Address, 
    name: &String, 
    reward_amount: u64, 
    pay_token: &Address, 
    deadline: u64
) -> Result<u32, ErrorCode> {
    // check args
    if reward_amount == 0 {
        log!(e, "zero reward");
        return Err(ErrorCode::ZeroReward)
    }
    if deadline == 0 {
        log!(e, "zero deadline");
        return Err(ErrorCode::ZeroDeadline)
    }

	if !fee_check(e) {
        log!(e, "fee not set");
        return Err(ErrorCode::FeeNotSet)
    }
    
    let fee_info = fee_get(e).unwrap();
    let fee_amount: u64 = fee_calculate(e, &fee_info.clone(), reward_amount);
    let transfer_amount: i128 = (reward_amount + fee_amount) as i128;
    
    let contract = e.current_contract_address();
    let pay_token_client = token::Client::new(e, &pay_token.clone());

    // Authorize the `create` call by creator to verify identity.
    creator.require_auth();

	if pay_token_client.balance(&creator) < transfer_amount {
        log!(e, "insufficient creator's balance");
        return Err(ErrorCode::InsuffCreatorBalance)
    }
    if pay_token_client.allowance(&creator, &contract) < transfer_amount {
        // log!(e, "insufficient creator's allowance");
        // return Err(ErrorCode::InsuffCreatorAllowance)
        pay_token_client.approve(&creator, &contract, &transfer_amount, &(e.ledger().sequence() + BALANCE_BUMP_AMOUNT));
    }

    pay_token_client.transfer(&creator, &contract, &(reward_amount as i128));
    pay_token_client.transfer(&creator, &fee_info.fee_wallet, &(fee_amount as i128));
    
    // write bounty info
    let bounty_count: u32 = e.storage().instance().get(&DataKey::BountyCount).unwrap_or(0);
    let bounty_id: u32 = bounty_count;

    bounty_write(
        e,
        bounty_id,
        &BountyInfo {
            creator: creator.clone(), 
            name: name.clone(), 
            reward_amount, 
            pay_token: pay_token.clone(), 
            end_date: e.ledger().timestamp() + deadline, 
            status: BountyStatus::ACTIVE
        },
    );
    
    // increase bounty count
    e.storage().instance().set(&DataKey::BountyCount, &(bounty_count + 1));
    e.storage().instance().bump(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);

    // emit BountyCreate event
    e.events().publish((BOUNTY, symbol_short!("BCreate")), 
        (creator.clone(), name.clone(), reward_amount, deadline, bounty_id)
    );

    Ok(bounty_id)
}

// returns new work id on success, errorcode on failure
pub fn bounty_apply(
    e: &Env, 
    participant: &Address, 
    bounty_id: u32
) -> Result<u32, ErrorCode> {
    // check args
    if !bounty_check(e, bounty_id) {
        log!(e, "bounty not found");
        return Err(ErrorCode::BountyNotFound)
    }
    let bounty = bounty_read(e, bounty_id);
    if bounty.creator == participant.clone() {
        log!(e, "participant is creator");
        return Err(ErrorCode::ParticipantIsCreator)
    }
    if bounty.status != BountyStatus::ACTIVE {
        log!(e, "inactive bounty status");
        return Err(ErrorCode::InactiveBountyStatus)
    }

    // avoid duplicate appliance
    if work_check_key(e, participant, bounty_id) {
        log!(e, "already applied participant");
        return Err(ErrorCode::AlreadyAppliedParticipant);
    }

    // Authorize the `apply` call by participant to verify identity.
    participant.require_auth();

    let work_id: u32 = work_create(&e, &participant, bounty_id);
    work_write_key(e, participant, bounty_id, 1);
    
    // emit BountyApplied event
    e.events().publish((BOUNTY, symbol_short!("BApply")), 
        (participant.clone(), bounty_id, work_id)
    );

    Ok(work_id)
}

pub fn bounty_submit(
    e: &Env, 
    participant: &Address, 
    work_id: u32
) -> Result<i32, ErrorCode> {
    // check args
    if !work_check_id(e, work_id) {
        log!(e, "work not found");
        return Err(ErrorCode::WorkNotFound)
    }
    
    let mut work = work_read(e, work_id);
    if work.participant != *participant {
        log!(e, "invalid participant");
        return Err(ErrorCode::InvalidParticipant)
    }
    if work.status != WorkStatus::APPLIED {
        log!(e, "not applied work");
        return Err(ErrorCode::NotAppliedWork)
    }

    // Authorize the `submit` call by participant to verify identity.
    participant.require_auth();

	work.status = WorkStatus::SUBMITTED;
    work_write_id(&e, work_id, &work);

    // emit WorkSubmitted event
    e.events().publish((BOUNTY, symbol_short!("WSubmit")), 
        (participant.clone(), work_id)
    );

    Ok(0)
}

pub fn bounty_approve(e: &Env, 
    creator: &Address, 
    work_id: u32
) -> Result<i32, ErrorCode> {
    if !work_check_id(e, work_id) {
        log!(e, "work not found");
        return Err(ErrorCode::WorkNotFound)
    }
    let mut work: WorkInfo = work_read(e, work_id);
    
    if !bounty_check(e, work.bounty_id) {
        log!(e, "bounty not found");
        return Err(ErrorCode::BountyNotFound)
    }
    let mut bounty: BountyInfo = bounty_read(e, work.bounty_id);
    if bounty.creator != *creator {
        log!(e, "invalid creator");
        return Err(ErrorCode::InvalidCreator)
    }
    if bounty.status != BountyStatus::ACTIVE {
        log!(e, "inactive bounty status");
        return Err(ErrorCode::InactiveBountyStatus)
    }

    // Authorize the `approve` call by creator to verify identity.
    creator.require_auth();

    let pay_token_client = token::Client::new(e, &bounty.pay_token);

    let amount: u64 = bounty.reward_amount;
    let contract = e.current_contract_address();
    
    pay_token_client.transfer(&contract, &work.participant, &(amount as i128));

    work.status = WorkStatus::APPROVED;
    work_write_id(e, work_id, &work);
    
    bounty.status = BountyStatus::COMPLETE;
    bounty_write(e, work.bounty_id, &bounty);

    // emit BountyComplete event
    e.events().publish((BOUNTY, symbol_short!("BComplete")), 
        (creator.clone(), work.bounty_id, work.participant, work_id)
    );

    Ok(0)
}

pub fn bounty_reject(e: &Env, 
    creator: &Address, 
    work_id: u32
) -> Result<i32, ErrorCode> {
    if !work_check_id(e, work_id) {
        log!(e, "work not found");
        return Err(ErrorCode::WorkNotFound)
    }
    let mut work: WorkInfo = work_read(e, work_id);

    if !bounty_check(e, work.bounty_id) {
        log!(e, "bounty not found");
        return Err(ErrorCode::BountyNotFound)
    }
    let bounty: BountyInfo = bounty_read(e, work.bounty_id);
    if bounty.creator != *creator {
        log!(e, "invalid creator");
        return Err(ErrorCode::InvalidCreator)
    }
    if bounty.status != BountyStatus::ACTIVE {
        log!(e, "inactive bounty status");
        return Err(ErrorCode::InactiveBountyStatus)
    }
    
    // Authorize the `reject` call by creator to verify identity.
    creator.require_auth();

    work.status = WorkStatus::REJECTED;
    work_write_id(e, work_id, &work);

    // emit WorkRejected event
    e.events().publish((BOUNTY, symbol_short!("WReject")), 
        (creator.clone(), work.bounty_id, work.participant, work_id)
    );

    Ok(0)
}

pub fn bounty_cancel(e: &Env, 
    creator: &Address, 
    bounty_id: u32
) -> Result<i32, ErrorCode> {
    if !bounty_check(e, bounty_id) {
        log!(e, "bounty not found");
        return Err(ErrorCode::BountyNotFound)
    }
    let mut bounty = bounty_read(e, bounty_id);
    if bounty.creator != *creator {
        log!(e, "invalid creator");
        return Err(ErrorCode::InvalidCreator)
    }
    if bounty.status != BountyStatus::ACTIVE {
        log!(e, "inactive bounty status");
        return Err(ErrorCode::InactiveBountyStatus)
    }

    // Authorize the `cancel` call by creator to verify identity.
    creator.require_auth();

    // refund to creator
    let pay_token_client = token::Client::new(e, &bounty.pay_token);

    if pay_token_client.balance(&e.current_contract_address()) < bounty.reward_amount as i128 {
        log!(e, "insufficient contract's balance");
        return Err(ErrorCode::InsuffContractBalance)
    }

    pay_token_client.transfer(
        &e.current_contract_address(), 
        &creator, 
        &(bounty.reward_amount as i128), 
    );

    bounty.status = BountyStatus::CANCELLED;
    bounty_write(e, bounty_id, &bounty);

    // emit BountyCancelled event
    e.events().publish((BOUNTY, symbol_short!("BCancel")), 
        (creator.clone(), bounty_id)
    );

    Ok(0)
}

pub fn bounty_close(e: &Env, 
    creator: &Address, 
    bounty_id: u32
) -> Result<u32, ErrorCode> {
    if !bounty_check(e, bounty_id) {
        log!(e, "bounty not found");
        return Err(ErrorCode::BountyNotFound)
    }
    let mut bounty: BountyInfo = bounty_read(e, bounty_id);
    if bounty.status != BountyStatus::ACTIVE {
        log!(e, "inactive bounty status");
        return Err(ErrorCode::InactiveBountyStatus)
    }
    if bounty.end_date > e.ledger().timestamp() {
        log!(e, "bounty not timeout");
        return Err(ErrorCode::NoTimeout)
    }

    // Authorize the `cancel` call by creator to verify identity.
    creator.require_auth();

    // refund to bounty creator
    let pay_token_client = token::Client::new(e, &bounty.pay_token);

    if pay_token_client.balance(&e.current_contract_address()) < bounty.reward_amount as i128 {
        log!(e, "insufficient contract's balance");
        return Err(ErrorCode::InsuffContractBalance)
    }

    pay_token_client.transfer(
        &e.current_contract_address(), 
        &bounty.creator, 
        &(bounty.reward_amount as i128), 
    );

    bounty.status = BountyStatus::CLOSED;
    bounty_write(e, bounty_id, &bounty);

    // emit BountyClosed event
    e.events().publish((BOUNTY, symbol_short!("BClose")), 
        (creator.clone(), bounty_id)
    );

    Ok(0)
}

fn bounty_read(e: &Env, key: u32) -> BountyInfo {
    e.storage().instance().get(&DataKey::RegBounties(key)).unwrap()
}

fn bounty_write(e: &Env, key: u32, bounty: &BountyInfo) {
    e.storage().instance().set(&DataKey::RegBounties(key), bounty);
    // e.storage().instance().bump(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
}

fn bounty_check(e: &Env, bounty_id: u32) -> bool {
    if e.storage().instance().has(&DataKey::RegBounties(bounty_id)) {
        true
    }
    else {
        false
    }
}
