import { utils } from 'ethers'

import { Fragment, useCallback, useEffect } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Plus, ButtonIcon } from '@lidofinance/lido-ui'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  useActual,
  usePeriodLimitsData,
  REGISTRY_WITH_LIMITS_MAP,
  useTokenBytTopUpType,
} from 'modules/motions/hooks'
import {
  MotionLimitProgress,
  MotionLimitProgressWrapper,
} from 'modules/motions/ui/MotionLimitProgress'

import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { InputControl } from 'modules/shared/ui/Controls/Input'
import { SelectControl, Option } from 'modules/shared/ui/Controls/Select'
import { MotionWarningBox } from 'modules/shared/ui/Common/MotionWarningBox'
import {
  Fieldset,
  MessageBox,
  RemoveItemButton,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
} from '../CreateMotionFormStyle'

import {
  ContractEvmLegoLDOTopUp,
  ContractEvmLegoDAITopUp,
  ContractEvmRccDAITopUp,
  ContractEvmPmlDAITopUp,
  ContractEvmAtcDAITopUp,
  ContractEvmGasFunderETHTopUp,
} from 'modules/blockChain/contracts'
import { MotionType } from 'modules/motions/types'
import { createMotionFormPart } from './createMotionFormPart'
import { validateToken } from 'modules/tokens/utils/validateToken'
import {
  estimateGasFallback,
  checkInputsLargeThenLimit,
} from 'modules/motions/utils'
import {
  TRANSITION_LIMITS,
  tokenLimitError,
  periodLimitError,
} from 'modules/motions/constants'

export const TOPUP_WITH_LIMITS_MAP = {
  LegoLDO: ContractEvmLegoLDOTopUp,
  LegoDAI: ContractEvmLegoDAITopUp,
  RccDAI: ContractEvmRccDAITopUp,
  PmlDAI: ContractEvmPmlDAITopUp,
  AtcDAI: ContractEvmAtcDAITopUp,
  GasFunderETH: ContractEvmGasFunderETHTopUp,
}

type Program = {
  address: string
  amount: string
}

export const formParts = ({
  registryType,
}: {
  registryType: keyof typeof REGISTRY_WITH_LIMITS_MAP
}) =>
  createMotionFormPart({
    motionType: MotionType.LegoDAITopUp,
    populateTx: async ({ evmScriptFactory, formData, contract }) => {
      const encodedCallData = new utils.AbiCoder().encode(
        ['address[]', 'uint256[]'],
        [
          formData.programs.map(p => utils.getAddress(p.address)),
          formData.programs.map(p => utils.parseEther(p.amount)),
        ],
      )
      const gasLimit = await estimateGasFallback(
        contract.estimateGas.createMotion(evmScriptFactory, encodedCallData),
      )
      const tx = await contract.populateTransaction.createMotion(
        evmScriptFactory,
        encodedCallData,
        { gasLimit },
      )
      return tx
    },
    getDefaultFormData: () => ({
      programs: [{ address: '', amount: '' }] as Program[],
    }),
    Component: function StartNewMotionMotionFormLego({
      fieldNames,
      submitAction,
    }) {
      const { chainId, walletAddress } = useWeb3()
      const trustedCaller = TOPUP_WITH_LIMITS_MAP[registryType].useSwrWeb3(
        'trustedCaller',
        [],
      )
      const isTrustedCallerConnected = trustedCaller.data === walletAddress

      const { data: periodLimitsData, initialLoading: periodLimitsLoading } =
        usePeriodLimitsData({ registryType })
      const legoDAIRecipients = useActual({ registryType })
      const token = useTokenBytTopUpType({ registryType })

      const fieldsArr = useFieldArray({ name: fieldNames.programs })

      const handleAddProgram = useCallback(
        () => fieldsArr.append({ address: '', amount: '' }),
        [fieldsArr],
      )

      const handleRemoveProgram = useCallback(
        (i: number) => fieldsArr.remove(i),
        [fieldsArr],
      )

      const { watch, setValue } = useFormContext()
      const selectedPrograms: Program[] = watch(fieldNames.programs)

      const newAmount = selectedPrograms.reduce(
        (acc, program) => acc + Number(program.amount),
        0,
      )

      const getFilteredOptions = (fieldIdx: number) => {
        if (!legoDAIRecipients.data) return []
        const thatAddress = selectedPrograms[fieldIdx]?.address
        const selectedAddresses = selectedPrograms.map(({ address }) => address)
        return legoDAIRecipients.data.filter(
          ({ address }) =>
            !selectedAddresses.includes(address) || address === thatAddress,
        )
      }

      useEffect(() => {
        const recipientsCount = legoDAIRecipients.data?.length || 0
        const isMoreThanOne = recipientsCount > 1

        if (isMoreThanOne) return

        const recipientAddress = legoDAIRecipients.data?.[0].address || ''
        setValue(fieldNames.programs, [{ address: recipientAddress }])
      }, [fieldNames.programs, setValue, legoDAIRecipients.data])

      const transitionLimit = TRANSITION_LIMITS[chainId][token.address || '']

      if (
        trustedCaller.initialLoading ||
        legoDAIRecipients.initialLoading ||
        periodLimitsLoading
      ) {
        return <PageLoader />
      }

      if (!isTrustedCallerConnected) {
        return (
          <MessageBox>You should be connected as trusted caller</MessageBox>
        )
      }

      return (
        <>
          {periodLimitsData?.periodData && (
            <MotionLimitProgressWrapper>
              <MotionLimitProgress
                spentAmount={periodLimitsData.periodData.alreadySpentAmount}
                totalLimit={periodLimitsData.limits.limit}
                startDate={periodLimitsData.periodData.periodStartTimestamp}
                endDate={periodLimitsData.periodData.periodEndTimestamp}
                token={token.label}
                newAmount={newAmount}
              />
            </MotionLimitProgressWrapper>
          )}

          {fieldsArr.fields.map((item, i) => (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  <FieldsHeaderDesc>Recipient #{i + 1}</FieldsHeaderDesc>
                  {fieldsArr.fields.length > 1 && (
                    <RemoveItemButton onClick={() => handleRemoveProgram(i)}>
                      Remove recipient {i + 1}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>
                {periodLimitsData?.isEndInNextPeriod && (
                  <MotionWarningBox>
                    Please note that this program will be finished in the next
                    month. Motion top up limit for the next month may differ
                    from this.
                  </MotionWarningBox>
                )}
                <Fieldset>
                  <SelectControl
                    label="Top up recipient address"
                    name={`${fieldNames.programs}.${i}.address`}
                    rules={{ required: 'Field is required' }}
                  >
                    {getFilteredOptions(i).map((program, j) => (
                      <Option
                        key={j}
                        value={program.address}
                        children={program.title}
                      />
                    ))}
                  </SelectControl>
                </Fieldset>

                <Fieldset>
                  <InputControl
                    label={`${token.label} Amount`}
                    name={`${fieldNames.programs}.${i}.amount`}
                    rules={{
                      required: 'Field is required',
                      validate: value => {
                        const check1 = validateToken(value)
                        if (typeof check1 === 'string') {
                          return check1
                        }
                        if (Number(value) > transitionLimit) {
                          return tokenLimitError(token.label, transitionLimit)
                        }

                        const isLargeThenPeriodLimit =
                          checkInputsLargeThenLimit({
                            inputValues: selectedPrograms,
                            spendableBalanceInPeriod: Number(
                              periodLimitsData?.periodData
                                .spendableBalanceInPeriod,
                            ),
                            currentValue: { value, index: i },
                          })

                        if (
                          periodLimitsData?.periodData
                            .spendableBalanceInPeriod &&
                          isLargeThenPeriodLimit
                        ) {
                          return periodLimitError(
                            token.label,
                            Number(
                              periodLimitsData.periodData
                                .spendableBalanceInPeriod,
                            ),
                          )
                        }
                        return true
                      },
                    }}
                  />
                </Fieldset>
              </FieldsWrapper>
            </Fragment>
          ))}

          {legoDAIRecipients.data &&
            fieldsArr.fields.length < legoDAIRecipients.data.length && (
              <Fieldset>
                <ButtonIcon
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddProgram}
                  icon={<Plus />}
                  color="secondary"
                >
                  One more recipient
                </ButtonIcon>
              </Fieldset>
            )}

          {submitAction}
        </>
      )
    },
  })
