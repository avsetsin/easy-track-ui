import type { BigNumber } from 'ethers'
import type { PromiseValue } from 'type-fest'
import type { EasyTrackAbi } from 'generated'

export const MotionType = {
  NodeOperatorIncreaseLimit: 'NodeOperatorIncreaseLimit',
  LEGOTopUp: 'LEGOTopUp',
  RewardProgramAdd: 'RewardProgramAdd',
  RewardProgramRemove: 'RewardProgramRemove',
  RewardProgramTopUp: 'RewardProgramTopUp',
} as const
// intentionally
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MotionType = typeof MotionType[keyof typeof MotionType]

export const MotionStatus = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  CANCELED: 'CANCELED',
  REJECTED: 'REJECTED',
  ENACTED: 'ENACTED',
} as const
// intentionally
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MotionStatus = typeof MotionStatus[keyof typeof MotionStatus]

export const MotionDisplayStatus = {
  DEFAULT: 'DEFAULT',
  DANGER: 'DANGER',
  ATTENDED: 'ATTENDED',
  ATTENDED_DANGER: 'ATTENDED_DANGER',
  ACTIVE: 'ACTIVE',
  ENACTED: 'ENACTED',
} as const
// intentionally
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type MotionDisplayStatus =
  typeof MotionDisplayStatus[keyof typeof MotionDisplayStatus]

export type Motion = {
  id: number
  evmScriptFactory: string
  creator: string
  duration: number
  startDate: number
  snapshotBlock: number
  objectionsThreshold: number
  objectionsAmount: BigNumber
  evmScriptHash: string
  evmScriptCalldata?: string
  status: MotionStatus
  enacted_at?: number
  canceled_at?: number
  rejected_at?: number
}

export type RawMotionOnchain = PromiseValue<
  ReturnType<InstanceType<typeof EasyTrackAbi>['getMotions']>
>[0]

export type RawMotionSubgraph = {
  id: string
  evmScriptFactory: string
  creator: string
  duration: string
  startDate: string
  snapshotBlock: string
  objectionsThreshold: string
  objectionsAmount: string
  evmScriptHash: string
  evmScriptCalldata?: string
  status: MotionStatus
  enacted_at?: string
  canceled_at?: string
  rejected_at?: string
}
