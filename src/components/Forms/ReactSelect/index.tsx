import { ChakraProps, FormControl, FormErrorMessage, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Controller, FieldError, UseFormRegister } from "react-hook-form";
import Select from "react-select";

export interface SelectOption{
    value: string | number,
    label: string,
}

interface ReactSelectProps extends ChakraProps{
    name: string;
    options: SelectOption[];
    register?: UseFormRegister<any>;
    error?: FieldError;
    control?: any;

    value?: string;
    variant?: string;

    width?: string;
    marginBottom?: string;
    maxWidth?: string
    label?: string;
}

export function ReactSelect({name, register, control, value = "", variant = 'outline', label, error, options, width, marginBottom, maxWidth, ...rest} : ReactSelectProps){
    const customStyles = {
        container: (styles:any) => ({ 
            ...styles,
            width: width,
            marginBottom: marginBottom,
            maxWidth: maxWidth
        }),
        input: (styles:any) => ({ 
            ...styles ,
            fontSize: "13px",
            paddingLeft: "15px"
        }),
        option: (provided:any, state:any) => ({
          ...provided,
          backgroundColor: state.isSelected ? '#f24e1e' : 'white',
          cursor: state.isDisabled ? 'not-allowed' : 'pointer',
          fontSize: '13px',
          paddingLeft: "15px",
          ':hover': {
            backgroundColor: !state.isSelected ? "#ffefe1" : "#f24e1e",
            color: !state.isSelected ? "#f24e1e" : "#ffffff"
          },
        }),
        control: (styles: any, state: any) => ({ 
            ...styles, 
            backgroundColor: '#f7f7fc' , 
            borderColor: state.isFocused ? "#f24e1e" : "#d9dbe9",
            // ':focus': {
                boxShadow: 0,//state.isFocused ? "0 0 0 1px #f24e1e" : ""
            // },
            ':hover': {
                //border: '2px solid',
                borderColor: state.isFocused ? "#f24e1e" : "#d9dbe9",
            },
            height: '45px',
            borderRadius: '90px'
        }),
        placeholder: (styles: any, state: any) => ({ 
            ...styles,
            paddingLeft: "15px",
            fontSize: '14px',
        }),
        singleValue: (provided:any, state:any) => {
          const opacity = state.isDisabled ? 0.5 : 1;
          const transition = 'opacity 300ms';
          const color = "#14142b";
          const paddingLeft = "15px";
      
          return { ...provided, paddingLeft, opacity, transition, color, fontSize: '14px', };
        }
      }

    const [controlledValue, setControlledValue] = useState<string | number>("");

    useEffect(() => {
        setControlledValue(value);
    }, [value]);


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
                render={({ field: {ref, onChange, value, ...select} }) => 
                    <Select {...select} ref={ref} options={options} placeholder="Selecione" styles={customStyles} value={options.find(c => c.value === controlledValue)} onChange={val => {onChange(val ? val.value : ""); setControlledValue(val ? val.value : "");}} {...rest}/>
                }
            />
            {/* <Select options={options} styles={customStyles}/> */}

            { !!error && (
                <FormErrorMessage>
                    {error.message}
                </FormErrorMessage>
            )}
        </FormControl>
    ) : (
        <FormControl pos="relative" isInvalid={!!error}>
            {
                label && (
                    <Text fontSize="sm" mb="1" display="inline-block">{label}</Text>
                )
            }

            <Select options={options} styles={customStyles} {...rest}/>
        
            { !!error && (
                <FormErrorMessage>
                    {error.message}
                </FormErrorMessage>   
            )}
        </FormControl>

    );
}