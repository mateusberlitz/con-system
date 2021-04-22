import { InputGroup, InputLeftElement, FormControl, InputProps, Icon, Input as ChakraInput } from "@chakra-ui/react";

interface FormInputProps extends InputProps{
    name: string;
    type: string;
    variant?: string;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

export function Input({ name, type, icon, variant = "", ...rest }: FormInputProps){
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