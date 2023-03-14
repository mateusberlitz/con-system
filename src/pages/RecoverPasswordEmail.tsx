import { isAuthenticated, login } from "../services/auth";
import { useHistory } from "react-router";

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
import { Link } from "react-router-dom";
import { showErrors } from "../hooks/useErrors";

interface RecoverPasswordEmailFormData{
    email: string;
}

const recoverPasswordEmailFormSchema = yup.object().shape({
    email: yup.string().required('E-mail Obrigatório!').email('E-mail inválido!'),
});

export default function RecoverPasswordEmail(){
    const {permissions, profile} = useProfile();
    const {prefix} = useTenant();
    const history = useHistory();
    const { loadProfile } = useProfile();
    const toast = useToast()

    const { register, watch, handleSubmit, formState} = useForm<RecoverPasswordEmailFormData>({
        resolver: yupResolver(recoverPasswordEmailFormSchema),
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

    const handleSendMail = async (recoverData : RecoverPasswordEmailFormData) => {
        try{
            const response = await api.post('auth/forgot-password', recoverData).then(() => {
                toast({
                    title: 'Sucesso',
                    description: `Mensagem de recuperação foi enviada para o seu e-mail.`,
                    status: 'success',
                    duration: 12000,
                    isClosable: true
                })
            });
        }catch(error:any) {
            showErrors(error, toast)
        }
    }

    const toastError = (error : string) => {
        toast({
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

            <Stack mt="50" as="form" spacing="24px" w="100%" p="9" maxW={400} bg="white" borderRadius="24" boxShadow="lg" flexDir="column" onSubmit={handleSubmit(handleSendMail)}>
                <Heading>Recuperar Senha</Heading>
                <Text fontSize={17}>Recuperar pelo e-mail</Text>

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

                <Button type="submit" colorScheme="purple" h="52px" size="lg" borderRadius="19" isLoading={formState.isSubmitting}>
                    Enviar E-mail
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