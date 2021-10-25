import { ReactNode } from 'react';
import { Text, Badge as ChakraBadge, ChakraProps } from "@chakra-ui/react";

interface BadgeProps extends ChakraProps{
    children?: ReactNode
}

export default function Badge({children}: BadgeProps){
    return (
        <ChakraBadge colorScheme="purple" color="white" bg="purple.500" display="flex" borderRadius="full" px="5" py="0" h="29px" alignItems="center">
            {children}
        </ChakraBadge>
    )
}