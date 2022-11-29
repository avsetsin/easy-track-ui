import moment from 'moment'
import { LimitCheckerAbi, EasyTrackAbi } from 'generated'
import { createContractHelpers } from 'modules/blockChain/utils/createContractHelpers'
import {
  ContractLegoDAIRegistry,
  ContractEasyTrack,
  ContractAllowedRecipientRegistry,
} from 'modules/blockChain/contracts'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useSWR, SWRResponse } from 'modules/network/hooks/useSwr'
import {
  getLimits,
  LimitsType,
  getPeriodData,
  PeriodDataType,
} from 'modules/motions/utils'
import { MotionType } from 'modules/motions/types'
import { EvmUnrecognized } from 'modules/motions/evmAddresses'

type ContractLimitsMethods = {
  getLimitParameters: LimitCheckerAbi['getLimitParameters']
  getPeriodState: LimitCheckerAbi['getPeriodState']
}

type UsePeriodLimitInfoProps<T> = {
  address: string
  contract: T
  swrKey: string
  isPending?: boolean
}

export type usePeriodLimitsInfoResultData = {
  limits: LimitsType
  periodData: PeriodDataType
  motionDuration: number
  isEndInNextPeriod: boolean
}

type UsePeriodLimitInfo = <T extends ContractLimitsMethods>(
  data: UsePeriodLimitInfoProps<T>,
) => SWRResponse<{
  limits: LimitsType
  periodData: PeriodDataType
  motionDuration: number
  isEndInNextPeriod: boolean
}>

const getNextPeriod = ({
  periodLimit,
  periodEndTimestamp,
  periodDurationMonths,
}: {
  periodLimit: string
  periodEndTimestamp: number
  periodDurationMonths: number
}) => {
  return {
    alreadySpentAmount: '0',
    periodStartTimestamp: moment().add(1, 'M').startOf('month').unix(),
    periodEndTimestamp: moment
      .unix(periodEndTimestamp)
      .add(periodDurationMonths, 'M')
      .startOf('month')
      .unix(),
    spendableBalanceInPeriod: periodLimit,
  }
}

const getPeriodLimitsInfo = async <T extends ContractLimitsMethods>(
  easyTrack: EasyTrackAbi,
  contract: T,
  isPending?: boolean,
) => {
  const motionDuration = await easyTrack.motionDuration()
  const limits = await getLimits(contract)
  let periodData = await getPeriodData(contract)

  const dateOfEndMotion = moment().add(motionDuration.toNumber(), 'seconds')
  const periodEnd = moment.unix(periodData.periodEndTimestamp)

  const isEndInNextPeriod = dateOfEndMotion.isAfter(periodEnd)

  if (isEndInNextPeriod && !isPending) {
    periodData = getNextPeriod({
      periodLimit: limits.limit,
      periodEndTimestamp: periodData.periodEndTimestamp,
      periodDurationMonths: limits.periodDurationMonths,
    })
  }

  return {
    limits,
    periodData,
    motionDuration: motionDuration.toNumber() / 60 / 60, // hours
    isEndInNextPeriod,
  }
}

export const usePeriodLimitsInfo: UsePeriodLimitInfo = props => {
  const { address, contract, swrKey, isPending } = props
  const { chainId } = useWeb3()

  const easyTrack = ContractEasyTrack.useRpc()

  return useSWR(
    `${swrKey}-${chainId}-${address}`,
    async () => {
      const data = await getPeriodLimitsInfo(easyTrack, contract, isPending)

      return data
    },
    {
      shouldRetryOnError: true,
      errorRetryInterval: 5000,
    },
  )
}

const isContractWithLimits = (
  contract: unknown,
): contract is ContractLimitsMethods => {
  if (typeof contract !== 'object' || contract === null) return false
  if ('getLimitParameters' in contract || 'getPeriodState' in contract)
    return true

  return false
}

const registryByMotionType: {
  [key in MotionType]?: ReturnType<typeof createContractHelpers>
} = {
  [MotionType.LegoDAITopUp]: ContractLegoDAIRegistry,
  [MotionType.AllowedRecipientTopUp]: ContractAllowedRecipientRegistry,
}

export const usePeriodLimitsInfoByMotionType = (props: {
  motionType: MotionType | EvmUnrecognized
  isPending?: boolean
}) => {
  const { motionType, isPending } = props
  const { chainId } = useWeb3()
  const swrKey = `${motionType}-period-limits-data`
  const easyTrack = ContractEasyTrack.useRpc()

  return useSWR(
    `${swrKey}-${chainId}-${motionType}`,
    async () => {
      if (motionType === EvmUnrecognized) return null

      const registry = registryByMotionType[motionType]?.connectRpc({ chainId })

      if (!isContractWithLimits(registry)) return null

      const data = await getPeriodLimitsInfo(easyTrack, registry, isPending)

      return data
    },
    {
      shouldRetryOnError: true,
      errorRetryInterval: 5000,
    },
  )
}
