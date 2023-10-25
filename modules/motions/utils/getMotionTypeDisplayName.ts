import { EvmUnrecognized } from '../evmAddresses'
import { MotionType } from '../types'

export const MotionTypeDisplayNames: Record<
  MotionType | EvmUnrecognized,
  string
> = {
  [MotionType.NodeOperatorIncreaseLimit]:
    'Increase node operator staking limit',
  [MotionType.AllowedRecipientTopUpTrpLdo]: 'Top up LDO TRP',
  [MotionType.LegoLDOTopUp]: 'Top up LEGO LDO',
  [MotionType.LegoDAITopUp]: 'Top up LEGO DAI',
  [MotionType.RccStablesTopUp]: 'Top up RCC',
  [MotionType.PmlStablesTopUp]: 'Top up PML',
  [MotionType.AtcStablesTopUp]: 'Top up ATC',
  [MotionType.StethRewardProgramAdd]: 'Add stETH reward program',
  [MotionType.StethRewardProgramRemove]: 'Remove stETH reward program',
  [MotionType.StethRewardProgramTopUp]: 'Top up stETH reward programs',
  [MotionType.StethGasSupplyAdd]: 'Add stETH Gas Supply recipient',
  [MotionType.StethGasSupplyRemove]: 'Remove stETH Gas Supply recipient',
  [MotionType.StethGasSupplyTopUp]: 'Top up stETH Gas Supply recipients',
  [MotionType.RewardsShareProgramAdd]: 'Add Rewards Share Program participant',
  [MotionType.RewardsShareProgramRemove]:
    'Remove Rewards Share Program participant',
  [MotionType.RewardsShareProgramTopUp]:
    'Top up Rewards Share Program participants',
  [MotionType.SDVTNodeOperatorsAdd]: 'Add Node Operators',
  [MotionType.SDVTNodeOperatorsActivate]: 'Activate Node Operators',
  [MotionType.SDVTNodeOperatorsDeactivate]: 'Deactivate Node Operators',
  [MotionType.SDVTVettedValidatorsLimitsSet]: 'Set vetted validators limits',
  [MotionType.SDVTNodeOperatorsAdd]: 'Add node operators',
  [MotionType.SDVTNodeOperatorsActivate]: 'Activate node operators',
  [MotionType.SDVTNodeOperatorsDeactivate]: 'Deactivate node operators',
  [MotionType.SDVTTargetValidatorLimitsUpdate]:
    'Update target validator limits',
  [MotionType.SDVTNodeOperatorRewardAddressesSet]:
    'Set node operators reward addresses',
  [MotionType.SDVTNodeOperatorManagerChange]: 'Change node operators managers',
  [MotionType.SDVTNodeOperatorNamesSet]: 'Set node operators names',
  [MotionType.SDVTNodeOperatorManagerChange]: 'Change node operators managers',

  [EvmUnrecognized]: 'Unrecognized evm factory',

  // next motion types are retired
  // we are keeping them here to display history data
  [MotionType.LEGOTopUp]: 'Top up LEGO',
  [MotionType.GasFunderETHTopUp]: 'Top up Gas Funder ETH',
  [MotionType.RewardProgramAdd]: 'Add reward program',
  [MotionType.RewardProgramRemove]: 'Remove reward program',
  [MotionType.RewardProgramTopUp]: 'Top up reward program',
  [MotionType.ReferralPartnerAdd]: 'Add LDO referral partner',
  [MotionType.ReferralPartnerRemove]: 'Remove LDO referral partner',
  [MotionType.ReferralPartnerTopUp]: 'Top up LDO referral partner',
  [MotionType.AllowedRecipientAdd]: 'Add reward program',
  [MotionType.AllowedRecipientRemove]: 'Remove reward program',
  [MotionType.AllowedRecipientTopUp]: 'Top up reward program',
  [MotionType.AllowedRecipientAddReferralDai]: 'Add DAI referral partner',
  [MotionType.AllowedRecipientRemoveReferralDai]: 'Remove DAI referral partner',
  [MotionType.AllowedRecipientTopUpReferralDai]: 'Top up DAI referral partner',
} as const

export function getMotionTypeDisplayName(
  motionType: MotionType | EvmUnrecognized,
) {
  return MotionTypeDisplayNames[motionType]
}
