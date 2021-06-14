import { InputGroup, InputLeftElement, FormControl, InputProps, Icon, Input as ChakraInput, FormErrorMessage } from "@chakra-ui/react";
import { Ref, useEffect, useState } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { mask as applyMask } from "../../../utils/ReMask";

interface FormInputProps extends InputProps{
    name: string;
    type: string;
    value?: string;
    variant?: string;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    register?: UseFormRegister<any>;
    control?: any;
    mask?: "phone" | "cpf" | "cnpj" | "money" | "";
    error?: FieldError;
    onChange?: (value: any) => void;
    inputRef?: Ref<any>
}

export function Input({ name, type, icon, variant = "", value = "", mask = "", register = undefined, onChange, inputRef, control, error, maxW, ...rest }: FormInputProps){
    const [controlledValue, setControlledValue] = useState("");

    const handleReturnMaskedInputValue = (value: string = "") => {
        if(mask){
            if(mask === 'money'){
                //console.log(value);
                //value = applyMoney(value);
            }else{
                const maskPattern = (mask === "phone" ? "(99) 99999-9999"
                            : (mask === "cpf" ? "999.999.999-99"
                            : (mask === "cnpj" ? "99.999.999/9999-99"
                            :  "")));

            
                value = applyMask(value, maskPattern);
            }
        }

        setControlledValue(value);

        return value;
    }

    useEffect(() => {
        setControlledValue(value);

        if(onChange){
            onChange(value);
        }
    }, [value]);

    // useEffect(() => {
    //     ref.dispatchEvent(customEvent);
    //  });

    function getControlledInputAttributes(){
        if(register){
            return {
                ...register(name),
                value: controlledValue,
                onChange: (event: any) => {
                    const makedValue = handleReturnMaskedInputValue(event.target.value);  
                    setControlledValue(makedValue);
                }
            }
        }

        return {
            ref: (inputRef ? inputRef : undefined),
            value: controlledValue,
            onChange: (event: any) => {
                    const makedValue = handleReturnMaskedInputValue(event.target.value);  
                    setControlledValue(makedValue);
                    if(onChange){
                        onChange(makedValue)
                    }
                }
                
        }
    }

    return icon ? (
        <FormControl pos="relative" isInvalid={!!error} maxW={maxW}>
            <InputGroup>
                <InputLeftElement w="70px" h="45" pointerEvents="none" children={<Icon as={icon} stroke="#6E7191" fill="none" width="16" strokeWidth="3"/>} />

                <ChakraInput {...getControlledInputAttributes()} name={name} h="45px" pl="60px" type={type} fontSize="sm" borderColor={variant === 'outline' ? "gray.500" : "transparent"} bgColor={variant === 'outline' ? "gray.100" : (variant === 'filled' ? "gray.400" : "")} _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" _placeholder={{color: "gray.600"}} {...rest}/>
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
        <FormControl pos="relative" isInvalid={!!error} maxW={maxW}>
            <ChakraInput

                {...getControlledInputAttributes()}
                
                name={name} h="45px" pl="6" type={type} fontSize="sm" borderColor={variant === 'outline' ? "gray.500" : "transparent"} bgColor={variant === 'outline' ? "gray.100" : (variant === 'filled' ? "gray.400" : "")} _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" _placeholder={{color: "gray.600"}} {...rest}
            />
        
            { !!error && (
                <FormErrorMessage>
                    {error.message}
                </FormErrorMessage>   
            )}
        </FormControl>
    );
}

//export default forwardRef(Input);