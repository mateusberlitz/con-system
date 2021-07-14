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
import moneyToBackend from "../../../utils/moneyToBackend";
import { formatYmdDate } from "../../../utils/Date/formatYmdDate";
import { formatInputDate } from "../../../utils/Date/formatInputDate";

interface ExportReportModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
}

export interface ExportReportFormData{
    start_date: string,
    end_date: string,
}

const ExportReportFormSchema = yup.object().shape({
    start_date: yup.date().required("Selecione a data inicial"),
    end_date: yup.date().required("Selecione a data final"),
});

export function ExportReportModal ( { isOpen, onRequestClose} : ExportReportModalProps){
    const workingCompany = useWorkingCompany();
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { handleSubmit, reset, control, formState} = useForm<ExportReportFormData>({
        resolver: yupResolver(ExportReportFormSchema),
    });

    const handleExportReport = async (paymentData : ExportReportFormData) => {
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

            paymentData.start_date = formatYmdDate(paymentData.start_date);
            paymentData.end_date = formatYmdDate(paymentData.end_date);


            await api.get(`/report`, {params: {
                    paymentData
                }
            });

            toast({
                title: "Sucesso",
                description: `Relatório gerado.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            onRequestClose();
            reset();
        }catch(error) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }

    const todayYmd = formatYmdDate(new Date().toDateString());

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleExportReport)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Gerar Relatório</ModalHeader>

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