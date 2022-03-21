import { HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";

import {  useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";
import { Branch, Company, Desk, State, User } from "../../../types";
import { useEffect } from "react";
import { redirectMessages } from "../../../utils/redirectMessages";
import { isAuthenticated } from "../../../services/auth";
import { ControlledSelect } from "../../../components/Forms/Selects/ControlledSelect";
import { useUsers } from "../../../hooks/useUsers";
import { useCompanies } from "../../../hooks/useCompanies";
import { useStates } from "../../../hooks/useCompanies copy";
import { useDesks } from "../../../hooks/useDesks";
import { useBranches } from "../../../hooks/useBranches";

interface EditTeamModalProps{
    isOpen: boolean;
    toEditTeamData: EditTeamFormData;
    onRequestClose: () => void;
    afterEdit: () => void;
}

export interface EditTeamFormData{
    id:number;
    name: string;
    manager: number;
    company: number;
    branch?: number;
    desk: number;
}

const EditTeamFormSchema = yup.object().shape({
    name: yup.string().required('Nome da equipe obrigatório'),
    company: yup.number().required('A qual essa filial pertence?'),
    manager: yup.number().required('Informe o gerente desta equipe'),
    branch: yup.number().nullable(),
    desk: yup.number().required('Informe a área de trabalho dessa equipe'),
});

export function EditTeamModal( { isOpen, toEditTeamData, afterEdit, onRequestClose } : EditTeamModalProps){
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    console.log(toEditTeamData);

    const { handleSubmit, formState, control, reset} = useForm<EditTeamFormData>({
        resolver: yupResolver(EditTeamFormSchema),
    });

    const handleEditTeam = async (teamData : EditTeamFormData) => {
        try{
            await api.post(`/teams/update/${toEditTeamData.id}`, teamData);

            toast({
                title: "Sucesso",
                description: "Dados da equipe foram alterados.",
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            onRequestClose();
            afterEdit();
            reset();
        }catch(error:any) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }

    useEffect(() => {
        if(!isAuthenticated()){
            history.push({
                pathname: '/',
                state: redirectMessages.auth
            });
        }
    }, [isOpen]);

    const users = useUsers({});
    const companies = useCompanies();
    const branches = useBranches();
    const desks = useDesks();


    console.log(toEditTeamData);

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleEditTeam)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Alterar equipe {toEditTeamData.name}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        
                        <ControlledInput control={control} name="name" type="text" placeholder="Nome da equipe" variant="outline" value={toEditTeamData.name} error={formState.errors.name} focusBorderColor="purple.600"/>
                        
                        <ControlledSelect value={toEditTeamData.company} control={control} h="45px" name="company" w="100%" fontSize="sm" focusBorderColor="purple.300" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Empresa" error={formState.errors.company}>
                            {(!companies.isLoading && !companies.error) && companies.data.map((company:Company) => {
                                return (
                                    <option key={company.id} value={company.id}>{company.name}</option>
                                )
                            })}
                        </ControlledSelect>

                        <ControlledSelect value={toEditTeamData.branch} control={control} h="45px" name="branch" w="100%" fontSize="sm" focusBorderColor="purple.300" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Filial" error={formState.errors.branch}>
                            {(!branches.isLoading && !branches.error) && branches.data?.data.map((branch:Branch) => {
                                return (
                                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                                )
                            })}
                        </ControlledSelect>

                        <ControlledSelect value={toEditTeamData.desk}  control={control} h="45px" name="desk" w="100%" fontSize="sm" focusBorderColor="purple.300" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Gerente" error={formState.errors.desk}>
                            {(!desks.isLoading && !desks.error) && desks.data.map((desk:Desk) => {
                                return (
                                    <option key={desk.id} value={desk.id}>{desk.name}</option>
                                )
                            })}
                        </ControlledSelect>

                        <ControlledSelect value={toEditTeamData.manager}  control={control} h="45px" name="manager" w="100%" fontSize="sm" focusBorderColor="purple.300" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Gerente" error={formState.errors.manager}>
                            {(!users.isLoading && !users.error) && users.data.map((user:User) => {
                                return (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                )
                            })}
                        </ControlledSelect>
                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="purple.300" colorScheme="purple" type="submit" isLoading={formState.isSubmitting}>
                        Atualizar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}