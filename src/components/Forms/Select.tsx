import { FormControl, SelectProps, Select as ChakraSelect } from "@chakra-ui/react";
import { ReactNode } from "react";

interface FormSelectProps extends SelectProps{
    name: string;
    children: ReactNode;
    variant?: string;
    leftIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

export function Select({ name, children, variant, ...rest } : FormSelectProps){
    return(
        <FormControl pos="relative">
            <ChakraSelect h="45px" name={name} fontSize="sm" focusBorderColor="purple.600" borderColor={variant === 'outline' ? "gray.500" : "transparent"} bgColor={variant === 'outline' ? "gray.100" : "gray.400"} variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeHolder="Cargo" color="gray.600">
                {children}
            </ChakraSelect>
        </FormControl>
    );
}