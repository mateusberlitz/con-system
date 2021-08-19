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
import { formatYmdDate } from "../../../utils/Date/formatYmdDate";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";

interface NewCashDesksModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterCreate: () => void;
    categories: PaymentCategory[];
}

interface CreateNewCashDesksFormData{
    title: string;
    company: number;
    category: number;
    value: string;
    date: string;
}

const CreateNewCashDesksFormSchema = yup.object().shape({
    title: yup.string().required('Título da movimentação é obrigatório.'),
    company: yup.number(),
    category: yup.number(),
    value: yup.string().required("Informe o valor da movimentação."),
    date: yup.date().required("Selecione a data"),
});

export function NewCashDesksModal( { isOpen, onRequestClose, afterCreate, categories, } : NewCashDesksModalProps){
    const workingCompany = useWorkingCompany();
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { register, control, handleSubmit, reset, formState} = useForm<CreateNewCashDesksFormData>({
        resolver: yupResolver(CreateNewCashDesksFormSchema),
    });

    function includeAndFormatData(cashDesksData: CreateNewCashDesksFormData){
        cashDesksData.value = moneyToBackend(cashDesksData.value);

        if(!workingCompany.company){
            return cashDesksData;
        }

        cashDesksData.company = workingCompany.company?.id;

        return cashDesksData;
    }

    const handleCreateNewPayment = async (cashDesksData : CreateNewCashDesksFormData) => {
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

            cashDesksData = includeAndFormatData(cashDesksData);

            console.log(cashDesksData);

            await api.post('/cashdesks/store', cashDesksData);

            toast({
                title: "Sucesso",
                description: `A movimentação do caixa ${cashDesksData.title} foi cadastrada.`,
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

    useEffect(() => {
        if(!isAuthenticated()){
            history.push({
                pathname: '/',
                state: redirectMessages.auth
            });
        }
    }, [isOpen]);

    const todayYmd = formatYmdDate(new Date().toDateString());

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleCreateNewPayment)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Cadastrar Movimentação</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        
                        <Input register={register} name="title" type="text" placeholder="Título" variant="outline" error={formState.errors.title}/>

                        <Select register={register} h="45px" value="0" name="category" w="100%" fontSize="sm" focusBorderColor="blue.400" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Categoria" error={formState.errors.category}>
                            {categories && categories.map((category:PaymentCategory) => {
                                return (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                )
                            })}
                        </Select>

                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="value" type="text" placeholder="Valor" variant="outline" mask="money" error={formState.errors.value}/>
                            
                            {/* <Input register={register} name="date" value={todayYmd} type="date" placeholder="Data da movimentação" variant="outline" error={formState.errors.date}/> */}
                            <ControlledInput control={control} value={todayYmd} name="date" type="date" placeholder="Data da Movimentação" variant="outline" error={formState.errors.date} focusBorderColor="blue.400"/>
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