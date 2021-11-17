import { ReactNode } from 'react';
import { Text, Badge as ChakraBadge, ChakraProps } from "@chakra-ui/react";

interface BadgeProps extends ChakraProps{
    children?: ReactNode;
    colorScheme?: string;
    onClick?: () => void;
}

export default function Badge({children, colorScheme, onClick, ...rest}: BadgeProps){
    const color = colorScheme === 'purple' ? 'purple.500' 
                : (colorScheme === 'blue' ? 'blue.500' 
                : (colorScheme === 'green' ? 'green.400'
                : (colorScheme === 'yellow' ? 'yellow.500'
                : (colorScheme === 'orange' ? 'orange.400'
                : (colorScheme === 'red' ? 'red.400'
                : ''
                )))));

    return (
        <ChakraBadge onClick={onClick} fontSize="11px" textTransform="capitalize" fontWeight="semibold" colorScheme="purple" color="white" bg={color} display="flex" borderRadius="full" px="5" py="0" h="29px" alignItems="center" {...rest}>
            {children}
        </ChakraBadge>
    )
}