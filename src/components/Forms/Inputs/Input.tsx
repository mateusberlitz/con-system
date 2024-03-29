import {
  InputGroup,
  InputLeftElement,
  FormControl,
  InputProps,
  Icon,
  Input as ChakraInput,
  FormErrorMessage,
  FormLabel
} from '@chakra-ui/react'
import { Ref, useEffect, useState } from 'react'
import { FieldError, UseFormRegister } from 'react-hook-form'
import { mask as applyMask, maskMoney as applyMoney, maskNumber } from '../../../utils/ReMask'

interface FormInputProps extends InputProps {
  name: string
  type: string
  value?: string
  variant?: string
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  register?: UseFormRegister<any>
  control?: any
  mask?: 'phone' | 'cpf' | 'cnpj' | 'money' | 'cep' | 'number' | '';
  error?: FieldError
  onChange?: (value: any) => void
  inputRef?: Ref<any>
}

export function Input({
  name,
  type,
  icon,
  variant = '',
  value = '',
  mask = '',
  placeholder,
  register = undefined,
  onChange,
  isRequired,
  inputRef,
  control,
  error,
  maxW,
  ...rest
}: FormInputProps) {
  const [controlledValue, setControlledValue] = useState('')

  const handleReturnMaskedInputValue = (value: string = '') => {
    if (mask) {
        if (mask === 'money') {
            value = applyMoney(value);
        }else if (mask === 'number') {
            value = maskNumber(value);
        }  else {
        const maskPattern =
          mask === 'phone'
            ? '(99) 99999-9999'
            : mask === 'cpf'
            ? '999.999.999-99'
            : mask === 'cnpj'
            ? '99.999.999/9999-99'
            : mask === 'cep'
            ? '99.999-999'
            : ''

        value = applyMask(value, maskPattern)
      }
    }

    setControlledValue(value)

    return value
  }

  useEffect(() => {
    setControlledValue(handleReturnMaskedInputValue(value));

    if (onChange) {
      onChange(value)
    }
  }, [value])

  // useEffect(() => {
  //     ref.dispatchEvent(customEvent);
  //  });

  function getControlledInputAttributes() {
    if (register) {
      return {
        ...register(name),
        value: controlledValue,
        onChange: (event: any) => {
          const makedValue = handleReturnMaskedInputValue(event.target.value)
          setControlledValue(makedValue)
        }
      }
    }

    return {
      ref: inputRef ? inputRef : undefined,
      value: controlledValue,
      onChange: (event: any) => {
        const makedValue = handleReturnMaskedInputValue(event.target.value)
        setControlledValue(makedValue)
        if (onChange) {
          onChange(makedValue)
        }
      }
    }
  }

  return icon ? (
    <FormControl pos="relative" isInvalid={!!error} maxW={maxW}>
      <FormLabel
        pos="absolute"
        left="60px"
        zIndex="2"
        top={controlledValue ? '4px' : '13px'}
        fontSize={controlledValue ? '9' : '13'}
        fontWeight="500"
        color="gray.700"
        _focus={{ top: '4px', fontSize: '9px' }}
      >
        {placeholder}
        {isRequired && '*'}
      </FormLabel>

      <InputGroup>
        <InputLeftElement
          w="70px"
          h="45"
          pointerEvents="none"
          children={
            <Icon
              as={icon}
              stroke="#6E7191"
              fill="none"
              width="16"
              strokeWidth="3"
            />
          }
        />

        <ChakraInput
          {...getControlledInputAttributes()}
          name={name}
          pt="8px"
          h="45px"
          pl="60px"
          type={type}
          fontSize="sm"
          borderColor={variant === 'outline' ? 'gray.500' : 'transparent'}
          bgColor={
            variant === 'outline'
              ? 'gray.100'
              : variant === 'filled'
              ? 'gray.400'
              : ''
          }
          _hover={{ bgColor: 'gray.500' }}
          size="lg"
          borderRadius="full"
          _placeholder={{ color: 'gray.600' }}
          {...rest}
        />
      </InputGroup>

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  ) : (
    <FormControl pos="relative" isInvalid={!!error} maxW={maxW}>
      <FormLabel
        pos="absolute"
        left="25"
        zIndex="2"
        top={
          controlledValue || type === 'date' || type === 'datetime-local'
            ? '4px'
            : '13px'
        }
        fontSize={
          controlledValue || type === 'date' || type === 'datetime-local'
            ? '9'
            : '13'
        }
        fontWeight="500"
        color="gray.700"
        _focus={{ top: '4px', fontSize: '9px' }}
      >
        {placeholder}
        {isRequired && '*'}
      </FormLabel>

      <ChakraInput
        {...getControlledInputAttributes()}
        name={name}
        h="45px"
        pt="8px"
        pl="6"
        type={type}
        fontSize="sm"
        borderColor={variant === 'outline' ? 'gray.500' : 'transparent'}
        bgColor={
          variant === 'outline'
            ? 'gray.100'
            : variant === 'filled'
            ? 'gray.400'
            : ''
        }
        _hover={{ bgColor: 'gray.500' }}
        size="lg"
        borderRadius="full"
        _placeholder={{ color: 'gray.600' }}
        {...rest}
      />

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  )
}

//export default forwardRef(Input);
