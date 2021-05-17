import { FormControl, SelectProps, Select as ChakraSelect, FormErrorMessage } from "@chakra-ui/react";
import { ReactNode, Ref, useEffect, useState } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

interface FormSelectProps extends SelectProps{
    name: string;
    children: ReactNode;
    variant?: string;
    leftIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

    value?: string;
    error?: FieldError;
    register?: UseFormRegister<any>;
    onChange?: (value: any) => void;
    selectRef?: Ref<any>

    selected?: number;
}

export function Select({ name, children, variant, selectRef, value = "", selected, error, register, onChange, ...rest } : FormSelectProps){
    const [controlledValue, setControlledValue] = useState("");

    function getRegister(){
        if(register){
            return {
                ...register(name)
            }
        }

        return {
            ref: (selectRef ? selectRef : undefined),
            value: controlledValue,
            onChange: (event: any) => {
                    setControlledValue(event.target.value);
                    if(onChange){
                        onChange(event.target.value)
                    }
                }
                
        }
    }

    useEffect(() => {
        setControlledValue(value);
        if(onChange){
            onChange(value);
        }
    }, [value]);

    return(
        <FormControl pos="relative" isInvalid={!!error}>
            <ChakraSelect {...getRegister()} h="45px" name={name} fontSize="sm" focusBorderColor="purple.600" borderColor={variant === 'outline' ? "gray.500" : "transparent"} bgColor={variant === 'outline' ? "gray.100" : "gray.400"} _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" color="gray.700">
                {children}
            </ChakraSelect>

            { !!error && (
                <FormErrorMessage>
                    {error.message}
                </FormErrorMessage>
            )}
        </FormControl>
    );
}