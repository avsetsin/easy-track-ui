import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useContractMotionWeb3 } from 'modules/blockChain/hooks/useContractMotion'
import { useCurrentChain } from 'modules/blockChain/hooks/useCurrentChain'

import { Button } from '@lidofinance/lido-ui'
import { SelectControl, Option } from 'modules/shared/ui/Controls/Select'
import { Form } from 'modules/shared/ui/Controls/Form'
import { Fieldset } from './CreateMotionFormStyle'

import { formParts, FormData, getDefaultFormPartsData } from './Parts'
import { MotionType } from '../../types'
import { getScriptFactoryByMotionType } from 'modules/motions/utils/getMotionType'
import { getMotionTypeDisplayName } from 'modules/motions/utils/getMotionTypeDisplayName'

export function MotionFormStartNew() {
  const currentChainId = useCurrentChain()

  const formMethods = useForm<FormData>({
    defaultValues: {
      motionType: null,
      ...getDefaultFormPartsData(),
    },
  })

  const motionContract = useContractMotionWeb3()

  const handleSubmit = useCallback(
    e => {
      const motionType = formMethods.getValues('motionType')
      if (!motionType) return
      formParts[motionType].onSubmit({
        evmScriptFactory: getScriptFactoryByMotionType(
          currentChainId,
          motionType,
        ),
        formData: e[motionType],
        contract: motionContract,
      })
    },
    [currentChainId, formMethods, motionContract],
  )

  const motionType = formMethods.watch('motionType')
  const CurrentFormPart = motionType ? formParts[motionType].Component : null

  return (
    <Form formMethods={formMethods} onSubmit={handleSubmit}>
      <Fieldset>
        <SelectControl name="motionType" label="Motion type">
          {Object.values(MotionType).map(type => (
            <Option
              key={type}
              value={type}
              children={getMotionTypeDisplayName(type)}
            />
          ))}
        </SelectControl>
      </Fieldset>
      {CurrentFormPart && <CurrentFormPart />}
      {motionType && <Button type="submit" fullwidth children="Submit" />}
    </Form>
  )
}
