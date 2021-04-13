import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { Flex, Heading } from "@chakra-ui/layout";

import { MailIcon } from '../assets/icons/';

export default function Login(){
    return(
        <Flex w="100vw" h="100vh" align="center" justify="center">
            <Flex as="form" w="100%" p="8" maxW={400} bg="white" borderRadius="24" boxShadow="lg" flexDir="column">
                <Heading>Login</Heading>

                <FormControl pos="relative">
                    <FormLabel pos="absolute" left="5" top="3" zIndex="2" fontSize="14" fontWeight="600" color="gray.600" _groupFocus={ {top: '2', fontSize:'11'}}>E-mail</FormLabel>

                    
                    <InputGroup>
                        <InputLeftElement pointerEvents="none" children={<MailIcon />} />

                        <Input h="50" focusBorderColor="purple.600" bgColor="gray.400" variant="filled" _hover={ {bgColor: 'gray.100'} } size="lg" borderRadius="20"/>
                    </InputGroup>
                </FormControl>
                    
            </Flex>
        </Flex>
    )
}