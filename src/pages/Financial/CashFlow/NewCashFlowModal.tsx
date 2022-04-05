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
import { PaymentCategory} from "../../../types";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import moneyToBackend from "../../../utils/moneyToBackend";
import { useEffect } from "react";
import { isAuthenticated } from "../../../services/auth";
import { redirectMessages } from "../../../utils/redirectMessages";

interface NewCashFlowModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterCreate: () => void;
    categories: PaymentCategory[];
}

interface CreateNewCashFlowFormData{
    title: string;
    company: number;
    category: number;
    value: string;
}

const CreateNewCashFlowFormSchema = yup.object().shape({
    title: yup.string().required('Título da movimentação é obrigatório.'),
    company: yup.number(),
    category: yup.number(),
    value: yup.string().required("Informe o valor da movimentação."),
});

export function NewCashFlowModal( { isOpen, onRequestClose, afterCreate, categories, } : NewCashFlowModalProps){
    const workingCompany = useWorkingCompany();
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { register, handleSubmit, reset, formState} = useForm<CreateNewCashFlowFormData>({
        resolver: yupResolver(CreateNewCashFlowFormSchema),
    });

    function includeAndFormatData(cashFlowData: CreateNewCashFlowFormData){
        cashFlowData.value = moneyToBackend(cashFlowData.value);

        if(!workingCompany.company){
            return cashFlowData;
        }

        cashFlowData.company = workingCompany.company?.id;

        return cashFlowData;
    }

    const handleCreateNewPayment = async (cashFlowData : CreateNewCashFlowFormData) => {
        try{
            if(!workingCompany.company){
                toast({
                    title: "Ué",
                    description: `Seleciona uma empresa para trabalhar`,
                    status: "warning",
                    duration: 12000,
                    isClosable: true,
                });

                return;
            }

            cashFlowData = includeAndFormatData(cashFlowData);

            console.log(cashFlowData);

            await api.post('/cashflows/store', cashFlowData);

            toast({
                title: "Sucesso",
                description: `A movimentação ${cashFlowData.title} foi cadastrada.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            onRequestClose();
            afterCreate();
            reset();
        }catch(error: any) {
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
    }, [isOpen])

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleCreateNewPayment)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Cadastrar Movimentação</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        
                        <Input register={register} name="title" type="text" placeholder="Título" variant="outline" error={formState.errors.title}/>

                        <HStack spacing="4" align="baseline">
                            <Select register={register} h="45px" value="0" name="category" w="100%" fontSize="sm" focusBorderColor="blue.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Categoria" error={formState.errors.category}>
                                {categories && categories.map((category:PaymentCategory) => {
                                    return (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    )
                                })}
                            </Select>

                            <Input register={register} name="value" type="text" placeholder="Valor" variant="outline" mask="money" error={formState.errors.value}/>
                        </HStack>

                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="blue.400" colorScheme="blue" type="submit" isLoading={formState.isSubmitting}>
                        Cadastrar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}