import { InputGroup, InputLeftElement, FormControl, InputProps, Icon, Input as ChakraInput } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { RegisterOptions, UseFormRegister } from "react-hook-form";
import { mask as applyMask, unMask } from "../../utils/ReMask";

interface FormInputProps extends InputProps{
    name: string;
    type: string;
    variant?: string;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    //register?: UseFormRegister<any>;
    mask?: "phone" | "cpf" | "cnpj" | "money" | "";
}

export function Input({ name, type, icon, variant = "", mask = "", ...rest }: FormInputProps){
    const [maskedValue, setMaskedValue] = useState("");

    const handleChangeMask = (event: any) => {
        const maskPattern = (mask == "phone" ? "(99) 9 9999-9999"
                            : (mask == "cpf" ? "999.999.999-99"
                            :                  "99.999.999/9999-99"));

        setMaskedValue(applyMask(event.target.value, maskPattern));
    }

    return icon ? (
        <FormControl pos="relative">
            <InputGroup>
                <InputLeftElement w="70px" h="45" pointerEvents="none" children={<Icon as={icon} stroke="#6E7191" fill="none" width="16" strokeWidth="3"/>} />

                <ChakraInput name={name} h="45px" pl="60px" type={type} fontSize="sm" focusBorderColor="purple.600" borderColor={variant === 'outline' ? "gray.500" : "transparent"} bgColor={variant === 'outline' ? "gray.100" : "gray.400"} variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" _placeholder={{color: "gray.600"}} {...rest}/>
            </InputGroup>
        </FormControl>
    ) 
    : 
    (
        <FormControl pos="relative">
            <ChakraInput name={name} h="45px" pl="6" type={type} fontSize="sm" focusBorderColor="purple.600" borderColor={variant === 'outline' ? "gray.500" : "transparent"} bgColor={variant === 'outline' ? "gray.100" : "gray.400"} variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" _placeholder={{color: "gray.600"}} {...rest}/>
        </FormControl>
    );
}

//value={mask ? maskedValue : ''} onChange={mask ? handleChangeMask : () => {}} 