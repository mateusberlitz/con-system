import { HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast, Text, IconButton } from "@chakra-ui/react";

import { useHistory } from "react-router";
import { useErrors } from "../../hooks/useErrors";

import { useWorkingCompany } from "../../hooks/useWorkingCompany";
import { useProfile } from "../../hooks/useProfile";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../../services/auth";
import { redirectMessages } from "../../utils/redirectMessages";

import { SalesFilterData, useSales } from "../../hooks/useSales";
import { Sales } from "../../types";
import { formatBRDate } from "../../utils/Date/formatBRDate";


interface ListUserSalesModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
}

export interface toAddGoalUserData{
    id: number;
    name: string;
}

export function ListUserSalesModal( { isOpen, onRequestClose } : ListUserSalesModalProps){
    const workingCompany = useWorkingCompany();
    const {profile, permissions} = useProfile();

    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const [page, setPage] = useState(1);

    const handleChangePage = (page: number) => {
        setPage(page);
    }

    const [filter, setFilter] = useState<SalesFilterData>(() => {
        const data: SalesFilterData = {
            company: workingCompany.company?.id,
            user: (profile  ? profile.id : 0),
        };
        
        return data;
    })

    const sales = useSales(filter, page);

    useEffect(() => {
        if(!isAuthenticated()){
            history.push({
                pathname: '/',
                state: redirectMessages.auth
            });
        }
    }, [isOpen]);

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px">
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Histórico de vendas</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        
                        {
                            sales.data && sales.data.data.map((sale: Sales) => {
                                return(
                                    <HStack>
                                        <Text>{formatBRDate(sale.date)}: </Text>
                                        <Text  cursor="pointer" fontWeight="bold" _hover={{textDecoration: "underline"}}>
                                            {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(sale.value)}
                                        </Text>
                                    </HStack>
                                )
                            })
                        }

                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Fechar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}