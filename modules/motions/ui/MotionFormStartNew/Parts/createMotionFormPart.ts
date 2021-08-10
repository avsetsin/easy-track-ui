import type { ContractTransaction } from 'ethers'
import type { MotionType } from 'modules/motions/types'
import type { ContractTypeEasyTrack } from 'modules/blockChain/contracts'

type Args<FormData> = {
  motionType: MotionType

  onSubmit: (args: {
    formData: FormData
    contract: ContractTypeEasyTrack
    evmScriptFactory: string
  }) => Promise<ContractTransaction>

  getDefaultFormData: () => FormData

  getComponent: (getComponent: {
    fieldNames: Record<keyof FormData, string>
  }) => React.ComponentType
}

export function createMotionFormPart<FormData>({
  motionType,
  onSubmit,
  getComponent,
  getDefaultFormData,
}: Args<FormData>) {
  const fieldNames = Object.keys(getDefaultFormData()).reduce(
    (res, key) => ({
      ...res,
      [key]: `${motionType}.${key}`,
    }),
    {} as Record<keyof FormData, string>,
  )
  return {
    onSubmit,
    getDefaultFormData,
    Component: getComponent({ fieldNames }),
  }
}
