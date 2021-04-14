import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Img } from "@chakra-ui/image";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { Flex, Heading, Stack } from "@chakra-ui/layout";

//import MailIcon from '../assets/icons/Mail.svg';
import { ReactComponent as MailIcon } from '../assets/icons/Mail.svg';

export default function Login(){
    return(
        <Flex w="100vw" h="100vh" align="center" justify="center">
            <Stack as="form" spacing="30" w="100%" p="8" maxW={400} bg="white" borderRadius="24" boxShadow="lg" flexDir="column">
                <Heading>Login</Heading>

                <FormControl pos="relative">
                    {/* <FormLabel pos="absolute" left="45" top="3" zIndex="2" fontSize="14" fontWeight="600" color="gray.600" _groupFocus={ {top: '2', fontSize:'11'}}>E-mail</FormLabel> */}
                    <FormLabel pos="absolute" left="62px" top="2" zIndex="2" fontSize="10" fontWeight="600" color="gray.600" _groupFocus={ {top: '2', fontSize:'11'}}>E-mail</FormLabel>
                    
                    <InputGroup>
                        <InputLeftElement w="70px" h="60px" pointerEvents="none" children={<MailIcon stroke="#6E7191" fill="none" width="20"/>} />

                        <Input h="60px" pl="60px" pt="8px" fontSize="sm" focusBorderColor="purple.600" bgColor="gray.400" variant="filled" _hover={ {bgColor: 'gray.100'} } size="lg" borderRadius="24"/>
                    </InputGroup>
                </FormControl>
                    
            </Stack>
        </Flex>
    )
}