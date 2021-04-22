import { ChakraProps, Flex, GridItem } from "@chakra-ui/react";
import { ReactNode } from "react";

interface BoardProps extends ChakraProps{
    tag?: 'flex' | 'grid';
    children: ReactNode;
}

export function Board({ tag = 'grid', children, ...rest } : BoardProps){
    return tag === 'flex' ? (
        <Flex bg="white" boxShadow="md" p="9" borderRadius="24"  {...rest}>
            {children}
        </Flex>
    ): (
        <GridItem bg="white" boxShadow="md" p="9" borderRadius="24" {...rest}>
            {children}
        </GridItem>
    );
}