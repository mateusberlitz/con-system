import {
  ChakraProps,
  FormControl,
  FormErrorMessage,
  Text
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Controller, FieldError, UseFormRegister } from 'react-hook-form'
import Select, { StylesConfig } from 'react-select'

export interface SelectOption {
  value: string | number
  label: string
}

interface ReactSelectProps extends ChakraProps {
  name: string
  options: SelectOption[]
  register?: UseFormRegister<any>
  error?: FieldError
  control?: any

  color?: string

  value?: string
  variant?: string

  width?: string
  marginBottom?: string
  maxWidth?: string
  label?: string
  isRequired?: boolean;
  placeholder?: string;
  styles?: StylesConfig;
}

export function ReactSelect({
  name,
  register,
  control,
  value = '',
  variant = 'outline',
  color = '#f24e1e',
  label,
  isRequired = false,
  error,
  options,
  width,
  marginBottom,
  maxWidth,
  placeholder = '',
  styles,
  ...rest
}: ReactSelectProps) {

  const customStyles = styles ? styles : {
    container: (styles: any) => ({
      ...styles,
      width: width,
      marginBottom: marginBottom,
      maxWidth: maxWidth
    }),
    input: (styles: any) => ({
      ...styles,
      fontSize: '13px',
      paddingLeft: '15px'
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? color : 'white',
      cursor: state.isDisabled ? 'not-allowed' : 'pointer',
      fontSize: '13px',
      paddingLeft: '15px',
      ':hover': {
        backgroundColor: !state.isSelected ? `${color}12` : color,
        color: !state.isSelected ? color : '#ffffff'
      }
    }),
    control: (styles: any, state: any) => ({
      ...styles,
      backgroundColor: '#f7f7fc',
      borderColor: state.isFocused ? color : '#d9dbe9',
      // ':focus': {
      boxShadow: 0, //state.isFocused ? "0 0 0 1px color : ""
      // },
      ':hover': {
        //border: '2px solid',
        borderColor: state.isFocused ? color : '#d9dbe9'
      },
      height: '45px',
      borderRadius: '90px'
    }),
    placeholder: (styles: any, state: any) => ({
      ...styles,
      paddingLeft: '15px',
      fontSize: '14px'
    }),
    menu: (styles: any, state: any) => ({
        ...styles,
        zIndex: 5
      }),
    singleValue: (provided: any, state: any) => {
      const opacity = state.isDisabled ? 0.5 : 1
      const transition = 'opacity 300ms'
      const color = '#14142b'
      const paddingLeft = '15px'

      return {
        ...provided,
        paddingLeft,
        opacity,
        transition,
        color,
        fontSize: '14px'
      }
    }
  }

  const [controlledValue, setControlledValue] = useState<string | number>('')

  useEffect(() => {
    setControlledValue(value)
  }, [value])

  return control ? (
    <FormControl pos="relative" isInvalid={!!error}>
      {
        // label && (
        //     <Text fontSize="sm" mb="1" display="inline-block">{label}</Text>
        // )
      }
      <Controller
        name={name}
        control={control}
        defaultValue={controlledValue}
        render={({ field: { ref, onChange, value, ...select } }) => (
          <Select
            {...select}
            ref={ref}
            options={options}
            placeholder={`${placeholder} ${isRequired ? '*' : ''}`}
            styles={customStyles}
            value={options.find(c => c.value === controlledValue)}
            onChange={(val:any) => {
              onChange(val ? val.value : '')
              setControlledValue(val ? val.value : '')
            }}
            {...rest}
          />
        )}
      />
      {/* <Select options={options} styles={customStyles}/> */}

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  ) : (
    <FormControl pos="relative" isInvalid={!!error}>
      {label && (
        <Text fontSize="sm" mb="1" display="inline-block">
          {label}
        </Text>
      )}

      <Select options={options} styles={customStyles} placeholder={`${placeholder} ${isRequired ? '*' : ''}`} {...rest} />

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  )
}
