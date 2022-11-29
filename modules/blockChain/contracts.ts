import { createContractHelpers } from './utils/createContractHelpers'
import {
  EasyTrackAbi,
  RewardProgramRegistryAbi,
  ReferralPartnersRegistryAbi,
  EasyTrackAbi__factory,
  NodeOperatorsAbi__factory,
  MiniMeTokenAbi__factory,
  RewardProgramRegistryAbi__factory,
  ReferralPartnersRegistryAbi__factory,
  EvmIncreaseNodeOperatorStakingLimitAbi__factory,
  EvmTopUpLegoProgramAbi__factory,
  EvmAddRewardProgramAbi__factory,
  EvmRemoveRewardProgramAbi__factory,
  EvmTopUpRewardProgramsAbi__factory,
  EvmAddReferralPartnerAbi__factory,
  EvmRemoveReferralPartnerAbi__factory,
  EvmTopUpReferralPartnersAbi__factory,
  AllowedRecipientsRegistryLDOAbi__factory,
  AllowedRecipientsRegistryLDOAbi,
  AddAllowedRecipientLDOAbi__factory,
  RemoveAllowedRecipientLDOAbi__factory,
  TopUpAllowedRecipientsLDOAbi__factory,
  LegoDAIRegistryAbi__factory,
  LegoDAIRegistryAbi,
  LegoDAITopUpAbi__factory,
} from 'generated'
import { MotionType } from 'modules/motions/types'
import { EvmAddressesByType } from 'modules/motions/evmAddresses'
import * as CONTRACT_ADDRESSES from './contractAddresses'

export type ContractTypeEasyTrack = EasyTrackAbi
/**
 * @deprecated since version 2.0
 */
export type ContractTypeRewardProgramRegistry = RewardProgramRegistryAbi
export type ContractTypeReferralPartnersRegistry = ReferralPartnersRegistryAbi
export type ContractTypeAllowedRecipientRegistry =
  AllowedRecipientsRegistryLDOAbi
export type ContractTypeLegoDAIRegistry = LegoDAIRegistryAbi

export const ContractNodeOperatorsRegistry = createContractHelpers({
  factory: NodeOperatorsAbi__factory,
  address: CONTRACT_ADDRESSES.NodeOperatorsRegistry,
})

export const ContractEasyTrack = createContractHelpers({
  factory: EasyTrackAbi__factory,
  address: CONTRACT_ADDRESSES.EasyTrack,
})

/**
 * @deprecated since version 2.0
 */
export const ContractRewardProgramRegistry = createContractHelpers({
  factory: RewardProgramRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.RewardProgramRegistry,
})

export const ContractAllowedRecipientRegistry = createContractHelpers({
  factory: AllowedRecipientsRegistryLDOAbi__factory,
  address: CONTRACT_ADDRESSES.AllowedRecipientRegistry,
})

export const ContractEvmAllowedRecipientAdd = createContractHelpers({
  factory: AddAllowedRecipientLDOAbi__factory,
  address: EvmAddressesByType[MotionType.AllowedRecipientAdd],
})

export const ContractEvmAllowedRecipientRemove = createContractHelpers({
  factory: RemoveAllowedRecipientLDOAbi__factory,
  address: EvmAddressesByType[MotionType.AllowedRecipientRemove],
})

export const ContractEvmAllowedRecipientTopUp = createContractHelpers({
  factory: TopUpAllowedRecipientsLDOAbi__factory,
  address: EvmAddressesByType[MotionType.AllowedRecipientTopUp],
})

export const ContractLegoDAIRegistry = createContractHelpers({
  factory: LegoDAIRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.LegoDAIRegistry,
})

export const ContractEvmLegoDAITopUp = createContractHelpers({
  factory: LegoDAITopUpAbi__factory,
  address: EvmAddressesByType[MotionType.LegoDAITopUp],
})

export const ContractGovernanceToken = createContractHelpers({
  factory: MiniMeTokenAbi__factory,
  address: CONTRACT_ADDRESSES.GovernanceToken,
})

export const ContractEvmNodeOperatorIncreaseLimit = createContractHelpers({
  factory: EvmIncreaseNodeOperatorStakingLimitAbi__factory,
  address: EvmAddressesByType[MotionType.NodeOperatorIncreaseLimit],
})

export const ContractEvmLEGOTopUp = createContractHelpers({
  factory: EvmTopUpLegoProgramAbi__factory,
  address: EvmAddressesByType[MotionType.LEGOTopUp],
})

/**
 * @deprecated since version 2.0
 */
export const ContractEvmRewardProgramAdd = createContractHelpers({
  factory: EvmAddRewardProgramAbi__factory,
  address: EvmAddressesByType[MotionType.RewardProgramAdd],
})

/**
 * @deprecated since version 2.0
 */
export const ContractEvmRewardProgramRemove = createContractHelpers({
  factory: EvmRemoveRewardProgramAbi__factory,
  address: EvmAddressesByType[MotionType.RewardProgramRemove],
})

/**
 * @deprecated since version 2.0
 */
export const ContractEvmRewardProgramTopUp = createContractHelpers({
  factory: EvmTopUpRewardProgramsAbi__factory,
  address: EvmAddressesByType[MotionType.RewardProgramTopUp],
})

export const ContractEvmReferralPartnerAdd = createContractHelpers({
  factory: EvmAddReferralPartnerAbi__factory,
  address: EvmAddressesByType[MotionType.ReferralPartnerAdd],
})

export const ContractEvmReferralPartnerRemove = createContractHelpers({
  factory: EvmRemoveReferralPartnerAbi__factory,
  address: EvmAddressesByType[MotionType.ReferralPartnerRemove],
})

export const ContractEvmReferralPartnerTopUp = createContractHelpers({
  factory: EvmTopUpReferralPartnersAbi__factory,
  address: EvmAddressesByType[MotionType.ReferralPartnerTopUp],
})

export const ContractReferralPartnersRegistry = createContractHelpers({
  factory: ReferralPartnersRegistryAbi__factory,
  address: CONTRACT_ADDRESSES.ReferralPartnersRegistry,
})
