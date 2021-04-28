import { InputGroup, InputLeftElement, FormControl, InputProps, Icon, Input as ChakraInput, FormErrorMessage } from "@chakra-ui/react";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { mask as applyMask } from "../../utils/ReMask";

interface FormInputProps extends InputProps{
    name: string;
    type: string;
    value?: string;
    variant?: string;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    register?: UseFormRegister<any>;
    mask?: "phone" | "cpf" | "cnpj" | "money" | "";
    error?: FieldError;
}

export function Input({ name, type, icon, variant = "", value = "", mask = "", register, error, ...rest }: FormInputProps){
    const [controlledValue, setControlledValue] = useState("");

    const handleChangeInputValue = (value: string = "") => {
        if(mask){
            const maskPattern = (mask === "phone" ? "(99) 99999-9999"
                            : (mask === "cpf" ? "999.999.999-99"
                            :                  "99.999.999/9999-99"));

            setControlledValue(applyMask(value, maskPattern));
        }else{
            setControlledValue(value);
        }

        return value;
    }

    useEffect(() => {
        const maskedValue = handleChangeInputValue(value);
    }, [value]);

    // useEffect(() => {
    //     ref.dispatchEvent(customEvent);
    //  });

    return icon ? (
        <FormControl pos="relative" isInvalid={!!error}>
            <InputGroup>
                <InputLeftElement w="70px" h="45" pointerEvents="none" children={<Icon as={icon} stroke="#6E7191" fill="none" width="16" strokeWidth="3"/>} />

                <ChakraInput  value={controlledValue} onChange={(event) => handleChangeInputValue(event.target.value)} name={name} h="45px" pl="60px" type={type} fontSize="sm" focusBorderColor="purple.600" borderColor={variant === 'outline' ? "gray.500" : "transparent"} bgColor={variant === 'outline' ? "gray.100" : "gray.400"} variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" _placeholder={{color: "gray.600"}} {...rest}/>
            </InputGroup>

            { !!error && (
                <FormErrorMessage>
                    {error.message}
                </FormErrorMessage>
            )}
        </FormControl>
    ) 
    : 
    (
        <FormControl pos="relative" isInvalid={!!error}>
            <ChakraInput  value={controlledValue} onChange={(event) => handleChangeInputValue(event.target.value)} name={name} h="45px" pl="6" type={type} fontSize="sm" focusBorderColor="purple.600" borderColor={variant === 'outline' ? "gray.500" : "transparent"} bgColor={variant === 'outline' ? "gray.100" : "gray.400"} variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" _placeholder={{color: "gray.600"}} {...rest}/>
        
            { !!error && (
                <FormErrorMessage>
                    {error.message}
                </FormErrorMessage>   
            )}
        </FormControl>
    );
}