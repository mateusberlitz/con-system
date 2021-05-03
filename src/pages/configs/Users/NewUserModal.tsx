import { HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";


import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";

import { Input } from "../../../components/Forms/Inputs/Input";
import { Select } from "../../../components/Forms/Selects/Select";

interface NewUserModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterCreate: () => void;
}

interface CreateNewUserFormData{
    name: string;
    lastname?: string;
    phone: string;
    cpf: string;
    email: string;
    company: number;
    role: number;
    password: string;
}

const CreateNewUserFormSchema = yup.object().shape({
    name: yup.string().required('Nome do Usuário Obrigatório'),
    lastname: yup.string(),
    phone: yup.string().min(9, "Existe Telefone com menos de 9 dígitos?"),//51991090700
    cpf: yup.string().min(10, "Não parece ser um CPF correto"),//02.999.999/0001-00
    email: yup.string().required("Informe um E-mail").email("Informe um e-mail válido"),
    company: yup.number().required("Selecione uma Empresa"),
    role: yup.number().required("Selecione um Cargo"),
    password: yup.string().min(6, "A senha precisa de no mínimo 6 dígitos.").required("Informe uma senha forte."),
});

export function NewUserModal( { isOpen, onRequestClose, afterCreate } : NewUserModalProps){
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { register, handleSubmit, reset, formState} = useForm<CreateNewUserFormData>({
        resolver: yupResolver(CreateNewUserFormSchema),
    });

    const handleCreateNewUser = async (userData : CreateNewUserFormData) => {
        try{
            console.log(userData);
            await api.post('/users/store', userData);

            toast({
                title: "Sucesso",
                description: `O usuário ${userData.name} foi cadastrado.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            onRequestClose();
            afterCreate();
            reset();
        }catch(error) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleCreateNewUser)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Cadastrar Usuário</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        
                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="name" type="text" placeholder="Nome" variant="outline" error={formState.errors.name}/>
                            <Input register={register} name="lastname" type="text" placeholder="Sobrenome" variant="outline" error={formState.errors.lastname}/>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="cpf" type="text" placeholder="CPF" variant="outline" mask="cpf" error={formState.errors.cpf}/>
                            <Input register={register} name="phone" type="text" placeholder="Telefone" variant="outline" mask="phone" error={formState.errors.phone}/>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="email" type="text" placeholder="E-mail" variant="outline" error={formState.errors.email}/>
                            <Input register={register} name="password" type="password" placeholder="Senha" variant="outline" error={formState.errors.password}/>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <Select register={register} name="company" variant="outline" error={formState.errors.email}> 
                                    <option value="0">Empresa</option>
                                    <option value="1">Central</option>
                                    <option value="2">Londrina</option>
                                    <option value="3">Quero Carta</option>
                            </Select>

                            <Select register={register} name="role" variant="outline" error={formState.errors.email}>
                                    <option value="0">Cargo</option>
                                    <option value="1">Diretor</option>
                                    <option value="2">Financeiro</option>
                                    <option value="3">Gerente</option>
                                    <option value="4">Vendedor</option>
                            </Select>
                        </HStack>

                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="purple.300" colorScheme="purple" type="submit" isLoading={formState.isSubmitting}>
                        Cadastrar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}