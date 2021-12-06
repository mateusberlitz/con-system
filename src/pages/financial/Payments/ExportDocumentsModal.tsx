import { HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";


import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";

import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";
import { formatYmdDate } from "../../../utils/Date/formatYmdDate";
import { redirectMessages } from "../../../utils/redirectMessages";
import { isAuthenticated } from "../../../services/auth";
import { useEffect } from "react";

interface ExportDocumentsModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
}

export interface ExportDocumentsFormData{
    start_date: string,
    end_date: string,
    company: number
}

const ExportDocumentsFormSchema = yup.object().shape({
    start_date: yup.date().required("Selecione a data inicial"),
    end_date: yup.date().required("Selecione a data final"),
});

export function ExportDocumentsModal ( { isOpen, onRequestClose} : ExportDocumentsModalProps){
    const workingCompany = useWorkingCompany();
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { handleSubmit, reset, control, formState} = useForm<ExportDocumentsFormData>({
        resolver: yupResolver(ExportDocumentsFormSchema),
    });

    const handleExportDocuments = async (exportData : ExportDocumentsFormData) => {
        try{
            if(!workingCompany.company){
                toast({
                    title: "Ué",
                    description: `Seleciona uma empresa`,
                    status: "warning",
                    duration: 12000,
                    isClosable: true,
                });

                return;
            }

            exportData.start_date = formatYmdDate(exportData.start_date);
            exportData.end_date = formatYmdDate(exportData.end_date);

            exportData.company = workingCompany.company?.id;


            const {data, headers} = await api.get(`/zip`, {params: exportData
            });

            const win = window.open(`${process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_STORAGE : process.env.REACT_APP_API_LOCAL_STORAGE}${data.file}`, "_blank");
            
            onRequestClose();
            //reset();
        }catch(error:any) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }

    const todayYmd = formatYmdDate(new Date().toDateString());

    useEffect(() => {
        if(!isAuthenticated()){
            history.push({
                pathname: '/',
                state: redirectMessages.auth
            });
        }
    }, [isOpen])

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleExportDocuments)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Baixar pasta de documentos</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={todayYmd} name="start_date" type="date" placeholder="Data inicial" variant="outline" error={formState.errors.start_date} focusBorderColor="blue.400"/>

                            <ControlledInput control={control} value={todayYmd} name="end_date" type="date" placeholder="Data final" variant="outline" error={formState.errors.end_date} focusBorderColor="blue.400"/>
                        </HStack>
                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="green.400" colorScheme="green" type="submit" isLoading={formState.isSubmitting}>
                        Download
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}