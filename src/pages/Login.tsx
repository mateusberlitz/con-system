import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { Flex, Heading, Link, Stack } from "@chakra-ui/layout";
import { useForm } from "react-hook-form";

import { ReactComponent as MailIcon } from '../assets/icons/Mail.svg';
import { ReactComponent as LockIcon } from '../assets/icons/Lock.svg';
import Logo from '../assets/icons/Logo.svg';
import { Img } from "@chakra-ui/image";

export default function Login(){
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    console.log(watch("email"));

    return(
        <Flex w="100vw" h="100vh" align="center" justify="center" flexDir="column">
            <Img src={Logo}/>

            <Stack mt="50" as="form" spacing="24px" w="100%" p="9" maxW={400} bg="white" borderRadius="24" boxShadow="lg" flexDir="column">
                <Heading>Login</Heading>

                <FormControl pos="relative">
                    <FormLabel pos="absolute" left="62px" zIndex="2" top={watch("email") ? "2" : "16px"} fontSize={watch("email") ? "10" : "14"} fontWeight="600" color="gray.600" _focus={{top: 2, fontSize: "10"}}>E-mail</FormLabel>
                    

                    <InputGroup>
                        <InputLeftElement w="70px" h="52px" pointerEvents="none" children={<MailIcon stroke="#6E7191" fill="none" width="20"/>} />

                        <Input {...register("email")} h="52px" pl="60px" pt="8px" type="email" fontSize="sm" focusBorderColor="purple.600" bgColor="gray.400" variant="filled" _hover={ {bgColor: 'gray.100'} } size="lg" borderRadius="19"/>
                    </InputGroup>
                </FormControl>

                <FormControl pos="relative">
                    <FormLabel {...register("senha")} pos="absolute" left="62px" zIndex="2" top={watch("senha") ? "2" : "16px"} fontSize={watch("senha") ? "10" : "14"} fontWeight="600" color="gray.600" _focus={{top: 2, fontSize: "10"}}>Senha</FormLabel>
                    

                    <InputGroup>
                        <InputLeftElement zIndex="2" w="70px" h="52px" pointerEvents="none" children={<LockIcon stroke="#6E7191" fill="none" width="20"/>} />

                        <Input h="52px" pl="60px" pt="8px" type="password" fontSize="sm" focusBorderColor="purple.600" bgColor="gray.400" variant="filled" _hover={ {bgColor: 'gray.100'} } size="lg" borderRadius="19"/>
                    </InputGroup>
                </FormControl>

                <Flex as="div">
                    <Checkbox colorScheme="purple" size="md" mr="15" borderRadius="full"    fontSize="sm" color="gray.800">
                        Permanecer conectado
                    </Checkbox>
                </Flex>

                <Button type="submit" colorScheme="purple" h="52px" size="lg" borderRadius="19">
                    Entrar
                </Button>
                    
            </Stack>

            <Link align="center" mt="30" color="gray.700">Esqueci minha senha</Link>
        </Flex>
    )
}