use soroban_sdk::{ contracterror, contracttype, Address, String };


pub(crate) const FEE_DECIMALS: u32 = 4;     // fee is described with the unit of 0.01%

pub(crate) const DAY_IN_LEDGERS: u32 = 17280;
pub(crate) const INSTANCE_BUMP_AMOUNT: u32 = 7 * DAY_IN_LEDGERS; // 7 days
pub(crate) const INSTANCE_LIFETIME_THRESHOLD: u32 = INSTANCE_BUMP_AMOUNT - DAY_IN_LEDGERS; // 6 days
pub(crate) const BALANCE_BUMP_AMOUNT: u32 = 30 * DAY_IN_LEDGERS; // 30 days


#[contracterror]
#[derive(Clone, Copy, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ErrorCode {
    Success = 0,

    GetErrorFailed = 100,

    // admin
    AdminNotSet = 110,
    IncorrectAdmin = 111,
    InvalidAdmin = 112,
    // Fee
    FeeNotSet = 115,
    
    // Work
    AlreadyAppliedParticipant = 120,
    WorkNotFound = 121,
    NotAppliedBounty = 122,
    NotAppliedWork = 123,
    
    // Bounty
    BountyNotFound = 130,
    ParticipantIsCreator = 131,
    InactiveBountyStatus = 132,
    EmptyName = 133,
    ZeroReward = 134,
    ZeroDeadline = 135,
    InsuffCreatorBalance = 136,
    InsuffCreatorAllowance = 137,
    InvalidCreator = 138,
    InvalidParticipant = 139,
    InvalidBountyID = 140,
    InvalidWorkRepo = 141,
    NoTimeout = 142,
    InsuffContractBalance = 143
}

#[derive(Clone)]
#[contracttype]
pub struct FeeInfo {
    pub fee_rate: u32,
    pub fee_wallet: Address,
}

#[derive(Clone, Copy, PartialEq)]
#[contracttype]
pub enum BountyStatus {
    INIT = 0,
    ACTIVE = 1,
    COMPLETE = 2,
    CANCELLED = 3,
    CLOSED = 4
}

#[derive(Clone, Copy, PartialEq)]
#[contracttype]
pub enum WorkStatus {
    INIT = 0,
    APPLIED = 1,
    SUBMITTED = 2,
    APPROVED = 3,
    REJECTED = 4
}


#[derive(Clone)]
#[contracttype]
pub struct BountyInfo {
    pub creator: Address,
    
    pub name: String,
    pub reward_amount: u64,
    pub pay_token: Address,
    pub end_date: u64,

    pub status: BountyStatus
}

#[derive(Clone)]
#[contracttype]
pub struct WorkInfo {
    pub participant: Address,
    pub bounty_id: u32,
    pub status: WorkStatus
}

#[derive(Clone)]
#[contracttype]
pub struct WorkKey {
    pub bounty_id: u32,
    pub participant: Address,
}


#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    ErrorCode,
    Admin,
    Fee,
    BountyCount,
    RegBounties(u32),
    WorkCount,
    RegWorks(u32),
    RegWorkKeys(WorkKey),
}
