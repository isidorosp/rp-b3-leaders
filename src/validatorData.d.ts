export interface ValidatorInfo {
  pubkey: string,
  withdrawal_credentials: string,
  effective_balance: string,
  slashed: boolean,
  activation_eligibility_epoch: string,
  activation_epoch: string,
  exit_epoch: string,
  withdrawable_epoch: string
}

export interface ValidatorData {
  index : string,
  balance: string,
  status: string,
  validator: ValidatorInfo,
  start_balance: number,
  adjusted_balance: number,
  beta_epochs_missed: number,
  eth1_addr: string,
  rewards_rank: number,
  rank: number,
  block_proposals: number
}

export interface ValidatorDataSet extends Array<ValidatorData>{}
