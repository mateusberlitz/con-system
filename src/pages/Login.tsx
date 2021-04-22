import { isAuthenticated, login } from "../services/auth";
import { Redirect } from "react-router";

import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";
import { Input as ChakraInput, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { Flex, Heading, Link, Stack } from "@chakra-ui/layout";

import { ReactComponent as MailIcon } from '../assets/icons/Mail.svg';
import { ReactComponent as LockIcon } from '../assets/icons/Lock.svg';
import Logo from '../assets/icons/Logo.svg';
import { Img } from "@chakra-ui/image";
import { api } from "../services/api";


import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useToast } from "@chakra-ui/toast";

interface SignInFormData{
    email: string;
    password: string;
    remember?: string;
}

const signInFormSchema = yup.object().shape({
    email: yup.string().required('E-mail Obrigatório!').email('E-mail inválido!'),
    password: yup.string().required('Senha Obrigatória'),
    remember: yup.string()
});

export default function Login(){
    const toastSignin = useToast();

    const { register, watch, handleSubmit, formState} = useForm<SignInFormData>({
        resolver: yupResolver(signInFormSchema),
    });

    const handleSignIn = async (signInData : SignInFormData) => {
        try{
            const response = await api.post('/auth/login', signInData);

            console.log(response.data);

            login(response.data.access_token, response.data.expires_in);

            return (
                <Redirect to={{ pathname: '/home' }}/>
            );
        }catch(error) {
            if(error.response){
                toastError(error.response.data.error);
            }else{
                toastError(error.message);
            }
        }
    }

    const toastError = (error : string) => {
        toastSignin({
            title: "Erro.",
            description: error,
            status: "error",
            duration: 9000,
            isClosable: true,
        });
    }

    if(isAuthenticated()){
        return (
            <Redirect to={{ pathname: '/home' }}/>
        );
    }

    return(
        <Flex w="100vw" h="100vh" align="center" justify="center" flexDir="column">
            <Img src={Logo}/>

            <Stack mt="50" as="form" spacing="24px" w="100%" p="9" maxW={400} bg="white" borderRadius="24" boxShadow="lg" flexDir="column" onSubmit={handleSubmit(handleSignIn)}>
                <Heading>Login</Heading>

                <FormControl pos="relative" isInvalid={!!formState.errors.email}>
                    <FormLabel pos="absolute" left="62px" zIndex="2" top={watch("email") ? "2" : "16px"} fontSize={watch("email") ? "10" : "14"} fontWeight="600" color="gray.600" _focus={{top: 2, fontSize: "10"}}>E-mail</FormLabel>
                    

                    <InputGroup>
                        <InputLeftElement w="70px" h="52px" pointerEvents="none" children={<MailIcon stroke="#6E7191" fill="none" width="20"/>} />

                        <ChakraInput type="email" {...register("email")} h="52px" pl="60px" pt="8px" fontSize="sm" focusBorderColor="purple.600" bgColor="gray.400" variant="filled" _hover={ {bgColor: 'gray.100'} } size="lg" borderRadius="19"/>
                    </InputGroup>

                    { !!formState.errors.email && (
                        <FormErrorMessage>
                            {formState.errors.email.message}
                        </FormErrorMessage>   
                    )}
                </FormControl>

                <FormControl pos="relative" isInvalid={!!formState.errors.password}>
                    <FormLabel pos="absolute" left="62px" zIndex="2" top={watch("password") ? "2" : "16px"} fontSize={watch("password") ? "10" : "14"} fontWeight="600" color="gray.600" _focus={{top: 2, fontSize: "10"}}>Senha</FormLabel>
                    

                    <InputGroup>
                        <InputLeftElement zIndex="2" w="70px" h="52px" pointerEvents="none" children={<LockIcon stroke="#6E7191" fill="none" width="20"/>} />

                        <ChakraInput type="password" {...register("password")} h="52px" pl="60px" pt="8px" fontSize="sm" focusBorderColor="purple.600" bgColor="gray.400" variant="filled" _hover={ {bgColor: 'gray.100'} } size="lg" borderRadius="19"/>
                    </InputGroup>

                    { !!formState.errors.password && (
                        <FormErrorMessage>
                            {formState.errors.password.message}
                        </FormErrorMessage>   
                    )}
                </FormControl>

                <Flex as="div">
                    <Checkbox {...register("remember")} colorScheme="purple" size="md" mr="15" borderRadius="full" fontSize="sm" color="gray.800" value="true">
                        Permanecer conectado
                    </Checkbox>
                </Flex>

                <Button type="submit" colorScheme="purple" h="52px" size="lg" borderRadius="19" isLoading={formState.isSubmitting}>
                    Entrar
                </Button>
                    
            </Stack>

            <Link align="center" mt="30" color="gray.700">Esqueci minha senha</Link>
        </Flex>
    )
}