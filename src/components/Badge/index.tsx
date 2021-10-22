import { ReactNode } from 'react';
import { Text, Badge as ChakraBadge } from "@chakra-ui/react";

interface BadgeProps{
    children?: ReactNode
}

export default function Badge(){
    return (
        <ChakraBadge colorScheme="purple" color="white" bg="purple.500" display="flex" borderRadius="full" px="5" py="0" h="29px" alignItems="center">
            <Text>Novo!</Text>
        </ChakraBadge>
    )
}