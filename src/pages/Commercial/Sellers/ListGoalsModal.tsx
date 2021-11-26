import { HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast, Text, IconButton } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";


import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";

import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { useProfile } from "../../../hooks/useProfile";
import { useEffect } from "react";
import { isAuthenticated } from "../../../services/auth";
import { redirectMessages } from "../../../utils/redirectMessages";

import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";
import { RemoveGoalData } from "./ConfirmGoalRemoveModal";
import { Goal } from "../../../types";
import { toAddGoalData } from "./NewGoalModal";

import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';
import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';

import { OutlineButton } from "../../../components/Buttons/OutlineButton";


interface NewLeadModalProps{
    isOpen: boolean;
    goals: Goal[];
    openNewGoalModal: (userData: toAddGoalData) => void;
    openConfirmRemoveGoalModal: (userData: RemoveGoalData) => void;
    toAddUserData: toAddGoalUserData;

    onRequestClose: () => void;
    afterEdit: () => void;
}

export interface toAddGoalUserData{
    id: number;
    name: string;
}

const EditGoalFormSchema = yup.object().shape({
    value: yup.string().required('Qual o valor da venda?'),
});

export function ListGoalsModal( { isOpen, onRequestClose, afterEdit, goals, toAddUserData, openNewGoalModal, openConfirmRemoveGoalModal } : NewLeadModalProps){
    const workingCompany = useWorkingCompany();
    const {profile, permissions} = useProfile();

    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    useEffect(() => {
        if(!isAuthenticated()){
            history.push({
                pathname: '/',
                state: redirectMessages.auth
            });
        }
    }, [isOpen]);

    const monthNames = ["", "Junho", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px">
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Metas do vendedor(a) {toAddUserData.name}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        
                        {
                            goals.map((goal: Goal) => {
                                return(
                                    <HStack>
                                        <Text>{monthNames[goal.month]}/{goal.year}: </Text>
                                        <Text  cursor="pointer" fontWeight="bold" _hover={{textDecoration: "underline"}}>
                                            {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(goal.value)}
                                        </Text>
                                        <IconButton onClick={() => openConfirmRemoveGoalModal({id: goal.id, name: toAddUserData.name, month: goal.month})} h="24px" w="23px" p="0" float="right" aria-label="Excluir venda" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                                    </HStack>
                                )
                            })
                        }

                        <OutlineButton onClick={() => openNewGoalModal({id: toAddUserData.id, name: toAddUserData.name})} icon={PlusIcon} h="30px" px="3" variant="outline" size="sm" fontSize="11" color="green.400" colorScheme="green">
                            Adicionar
                        </OutlineButton>

                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Fechar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}