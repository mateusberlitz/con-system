import { isAuthenticated, login } from "../services/auth";
import { useHistory, useParams } from "react-router";

import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";
import { Input as ChakraInput, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { Flex, Heading, Stack, HStack, Text } from "@chakra-ui/react";

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
import { showErrors } from "../hooks/useErrors";
import { Link } from "react-router-dom";

interface RecoverPasswordFormData{
    password: string;
    password_confirmation: string;
}

const signInFormSchema = yup.object().shape({
    password: yup.string().required('Senha obrigatória'),
    password_confirmation: yup.string().required('Confirmar a senha é obrigatório'),
});

interface RecoverParams{
    token: string;
    email: string
}

export default function RecoverPassword(){
    const {permissions, profile} = useProfile();
    const {prefix} = useTenant();
    const history = useHistory();
    const { loadProfile } = useProfile();
    const toast = useToast();
    const params = useParams<RecoverParams>();

    console.log(params);

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

    const handleResetPassword = async (RecoverPasswordData : RecoverPasswordFormData) => {
        try{
            const response = await api.post('auth/reset-password', {...RecoverPasswordData, token: params.token, email: params.email}).then(() => {
                toast({
                    title: 'Sucesso',
                    description: `Senha recuperada`,
                    status: 'success',
                    duration: 12000,
                    isClosable: true
                });

                history.push(`/`);
            });

        }catch(error:any) {
            showErrors(error, toast)
        }
    }

    useEffect(() => {
        if(isAuthenticated()){
            redirect();
        }
    }, [permissions]);

    const checkIfIsValidToken = async () => {
        try{
            api.post('auth/validate-token-reset-password', {token: params.token, email: params.email}).then((response) => {
                console.log(response);
                if(!response.data.token_exists){
                    toast({
                        title: 'Erro',
                        description: `requisição inválida`,
                        status: 'warning',
                        duration: 12000,
                        isClosable: true
                    });

                    history.push(`/`);
                }
            });

            //console.log(response);
        }catch(error:any) {
            showErrors(error, toast)
        }
    }

    useEffect(() => {
        checkIfIsValidToken();
    }, [params]);

    //HTML  
    return(
        <Flex w="100vw" h="100vh" align="center" justify="center" flexDir="column">
            <Logo />

            <Alert/>

            <Stack mt="50" as="form" spacing="24px" w="100%" p="9" maxW={400} bg="white" borderRadius="24" boxShadow="lg" flexDir="column" onSubmit={handleSubmit(handleResetPassword)}>
                <Heading>Recuperar Senha</Heading>

                <FormControl pos="relative" isInvalid={!!formState.errors.password}>
                    <FormLabel pos="absolute" left="62px" zIndex="2" top={watch("password") ? "2" : "16px"} fontSize={watch("password") ? "10" : "14"} fontWeight="600" color="gray.600" _focus={{top: 2, fontSize: "10"}}>Nova senha</FormLabel>
                    

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
                <FormControl pos="relative" isInvalid={!!formState.errors.password_confirmation}>
                    <FormLabel pos="absolute" left="62px" zIndex="2" top={watch("password_confirmation") ? "2" : "16px"} fontSize={watch("password_confirmation") ? "10" : "14"} fontWeight="600" color="gray.600" _focus={{top: 2, fontSize: "10"}}>Reescrever senha</FormLabel>
                    

                    <InputGroup>
                        <InputLeftElement zIndex="2" w="70px" h="52px" pointerEvents="none" children={<LockIcon stroke="#6E7191" fill="none" width="20"/>} />

                        <ChakraInput type="password" {...register("password_confirmation")} h="52px" pl="60px" pt="8px" fontSize="sm" focusBorderColor="purple.600" bgColor="gray.400" variant="filled" _hover={ {bgColor: 'gray.100'} } size="lg" borderRadius="19"/>
                    </InputGroup>

                    { !!formState.errors.password_confirmation && (
                        <FormErrorMessage>
                            {formState.errors.password_confirmation.message}
                        </FormErrorMessage>   
                    )}
                </FormControl>


                <Button type="submit" colorScheme="purple" h="52px" size="lg" borderRadius="19" isLoading={formState.isSubmitting}>
                    Confirmar Senha
                </Button>
                    
            </Stack>

            <Stack>
                <Link to="/">
                    <Text align="center" mt="30" color="gray.700">Voltar para a tela de login</Text>
                </Link>
            </Stack>
        </Flex>
    )
}