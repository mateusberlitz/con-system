import { Flex, HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../components/Buttons/SolidButton";

import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';
import { showErrors } from "../../hooks/useErrors";
import { api } from "../../services/api";
import { isAuthenticated } from "../../services/auth";
import { useEffect, useState } from "react";
import { redirectMessages } from "../../utils/redirectMessages";
import { useHistory } from "react-router-dom";
import { useWorkingCompany } from "../../hooks/useWorkingCompany";
import { Input } from "../../components/Forms/Inputs/Input";

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ControlledSelect } from "../../components/Forms/Selects/ControlledSelect";
import { useProfile } from "../../hooks/useProfile";
import { Company, Configuration } from "../../types";
import { formatYmdDate } from "../../utils/Date/formatYmdDate";
import { ControlledInput } from "../../components/Forms/Inputs/ControlledInput";

interface CloseSellerCommissionsProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterClose: () => void;
}

interface CloseSellerCommissionsFormData{
    company_id: number;

    start_date?: string;
    end_date?: string;
}

const CloseSellerCommissionsFormSchema = yup.object().shape({
    company_id: yup.number().required('Selecione a empresa'),
    start_date: yup.string(),
    end_date: yup.string(),
});

export function CloseSellerCommissions( { isOpen, afterClose, onRequestClose } : CloseSellerCommissionsProps){
    const toast = useToast();
    const history = useHistory();
    const workingCompany = useWorkingCompany();
    const {profile} = useProfile();

    const [startDate, setStartDate] = useState<string>();
    const [startDateConfiguration, setStartDateConfiguration] = useState<Configuration>();

    const { register, handleSubmit, control, reset, formState, watch} = useForm<CloseSellerCommissionsFormData>({
        resolver: yupResolver(CloseSellerCommissionsFormSchema),
    });

    const handleCloseSellerCommissions = async (closeData: CloseSellerCommissionsFormData) => {
        try{
            await api.post(`/close-seller-commissions/${closeData.company_id}`);

            toast({
                title: "Sucesso",
                description: `O fechamento do período foi concluído`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            onRequestClose();
            afterClose();
        }catch(error){
            showErrors(error, toast);
        }
    }

    const loadStartDate = () => {
        api.get('configuration_by_name', {params: {
            name: "close_seller_commissions_start_day",
            company_id: watch('company_id') ? watch('company_id') : workingCompany.company ? workingCompany.company.id : "",
        }}).then(response => {
            if(response.data.data.id){
                setStartDateConfiguration(response.data.data);

                const date = new Date();
                date.setDate(response.data.data.value);
                date.setMonth(date.getMonth()-1);
                //console.log(response.data.data);
                setStartDate(formatYmdDate(date.toDateString()));
            }
        });
    }

    useEffect(() => {
        if(!isAuthenticated()){
            history.push({
                pathname: '/',
                state: redirectMessages.auth
            });
        }
    }, [isOpen])

    useEffect(() => {
        loadStartDate();
    }, []);

    useEffect(() => {
        loadStartDate();
    }, [watch('company_id')]);

    const todayYmd = formatYmdDate(new Date().toDateString());

    //console.log(startDate);

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent borderRadius="24px" as="form" onSubmit={handleSubmit(handleCloseSellerCommissions)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Fechar comissões para pagar?</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        {
                            ( !profile || !profile.companies ? (
                                <Flex justify="center">
                                    <Text>Nenhuma empresa disponível</Text>
                                </Flex>
                            ) : (
                                <ControlledSelect control={control} value={(workingCompany.company && workingCompany.company.id) ? workingCompany.company.id : ""}  h="45px" name="company_id" placeholder="Empresa" w="100%" fontSize="sm" focusBorderColor="blue.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" error={formState.errors.company_id}>
                                    {profile.companies && profile.companies.map((company:Company) => {
                                        return (
                                            <option key={company.id} value={company.id}>{company.name}</option>
                                        )
                                    })}
                                </ControlledSelect>
                            ))
                        }

                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={startDate} name="start_date" isDisabled type="date" placeholder="Data de Início" variant="outline" error={formState.errors.start_date}/>

                            <ControlledInput control={control} value={todayYmd} name="end_date" type="date" placeholder="Data de Fechamento" variant="outline" error={formState.errors.end_date}/>
                        </HStack>
                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="blue.400" colorScheme="blue" type="submit" isLoading={formState.isSubmitting}>
                        Fechar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}