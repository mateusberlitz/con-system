import { isAuthenticated, login } from "../services/auth";
import { useHistory } from "react-router";

import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";
import { Input as ChakraInput, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { Flex, Heading, Link, Stack, HStack, Text } from "@chakra-ui/react";

import { ReactComponent as MailIcon } from '../assets/icons/Mail.svg';
import { ReactComponent as LockIcon } from '../assets/icons/Lock.svg';

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useToast } from "@chakra-ui/react";
import { Alert } from "../components/Alert";
import { Logo } from "../components/Logo";
import { useProfile } from "../hooks/useProfile";
import { useEffect, } from "react";
import { useTenant } from "../hooks/useTenant";
import { api } from "../services/api";

interface RecoverPasswordFormData{
    password: string;
    confirmPassword: string;
    remember?: string;
}

const signInFormSchema = yup.object().shape({
    password: yup.string().required('Senha Obrigatória'),
    confirmedPassword: yup.string().required('Confirmar Obrigatória'),
    remember: yup.string()
});

export default function RecoverPassword(){
    const {permissions, profile} = useProfile();
    const {prefix} = useTenant();
    const history = useHistory();
    const { loadProfile } = useProfile();
    const RecoverPasswordSignin = useToast();

    const { register, watch, handleSubmit, formState} = useForm<RecoverPasswordFormData>({
        resolver: yupResolver(signInFormSchema),
    });

    function redirect(){
        if(profile && permissions){
            if(Object.keys(profile).length !== 0){
                if(profile.role.desk_id === 1){
                    history.push(`/home`);
                }else{
                    history.push(`/financeiro`);
                }
            }
        }
    }

    const handleSignIn = async (RecoverPasswordData : RecoverPasswordFormData) => {
        try{
            const response = await api.post('/auth/login', RecoverPasswordData);

            login(response.data.access_token, response.data.expires_in);

            loadProfile();
        }catch(error:any) {
            if(error.response){
                toastError(error.response.data.error);
            }else{
                toastError(error.message);
            }
        }
    }

    const toastError = (error : string) => {
        RecoverPasswordSignin({
            title: "Erro.",
            description: error,
            status: "error",
            duration: 9000,
            isClosable: true,
        });
    }

    useEffect(() => {
        if(isAuthenticated()){
            redirect();
        }
    }, [permissions]);

    // useEffect(() => {
    //     if(isAuthenticated()){
    //         redirect();
    //     }
    // }, []);

    //HTML  
    return(
        <Flex w="100vw" h="100vh" align="center" justify="center" flexDir="column">
            <Logo />

            <Alert/>

            <Stack mt="50" as="form" spacing="24px" w="100%" p="9" maxW={400} bg="white" borderRadius="24" boxShadow="lg" flexDir="column" onSubmit={handleSubmit(handleSignIn)}>
                <Heading>Recuperar Senha</Heading>

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
                <FormControl pos="relative" isInvalid={!!formState.errors.confirmPassword}>
                    <FormLabel pos="absolute" left="62px" zIndex="2" top={watch("password") ? "2" : "16px"} fontSize={watch("password") ? "10" : "14"} fontWeight="600" color="gray.600" _focus={{top: 2, fontSize: "10"}}>Confirm Password</FormLabel>
                    

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


                <Button type="submit" colorScheme="purple" h="52px" size="lg" borderRadius="19" isLoading={formState.isSubmitting}>
                    Confirmar Senha
                </Button>
                    
            </Stack>

            <Link align="center" mt="30" color="gray.700">Voltar para tela de login</Link>
        </Flex>
    )
}