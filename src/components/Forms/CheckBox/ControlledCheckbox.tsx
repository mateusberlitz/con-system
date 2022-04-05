import { CheckboxProps } from '@chakra-ui/core'
import { Checkbox } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Controller, FieldError, UseFormRegister } from 'react-hook-form'

interface FormCheckboxProps extends CheckboxProps {
  name: string
  value?: string
  label?: string
  variant?: string
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  mask?: 'phone' | 'cpf' | 'cnpj' | 'money' | ''
  error?: FieldError
}

interface ControlledCheckboxProps extends FormCheckboxProps {
  register?: UseFormRegister<any>
  control?: any
}

export function ControlledCheckbox({
  control,
  label,
  defaultIsChecked,
  name,
  value,
  error,
  ...rest
}: ControlledCheckboxProps) {
  const [isIndividualChecked, setIsIndividualChecked] = useState<boolean>(
    () => {
      const isChecked = defaultIsChecked ? true : false

      return isChecked
    }
  )

  useEffect(() => {
    setIsIndividualChecked(defaultIsChecked ? true : false)
  }, [defaultIsChecked, setIsIndividualChecked])

  const handleChangeIsIndividualChecked = () => {
    setIsIndividualChecked(!isIndividualChecked)
  }

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={isIndividualChecked}
      render={({ field: { ref, onChange, ...field } }) => (
        <Checkbox
          ref={ref}
          {...field}
          name={name}
          error={error}
          onChange={event => {
            handleChangeIsIndividualChecked()
            onChange(event)
          }}
          isChecked={isIndividualChecked}
          colorScheme="blue"
          size="md"
          mr="15"
          borderRadius="full"
          fontSize="sm"
          color="gray.800"
          value={value}
        >
          {label}
        </Checkbox>
      )}
    />
  )
}
