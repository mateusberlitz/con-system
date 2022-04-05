import { ChakraProps, HStack, Text } from "@chakra-ui/react";

interface logoProps extends ChakraProps{
    isWhite?: boolean;
}

export function Logo({isWhite, ...rest}: logoProps){
    return (
        <HStack {...rest} mb="5">
            <Text fontSize="4xl" color={isWhite ? "white" : "gray.600"} fontWeight="bold">System</Text>
            <Text fontSize="5xl" color={isWhite ? "white" : "purple.500"}>.</Text>
        </HStack>
    )
}