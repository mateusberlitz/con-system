import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";

import { Provider } from "../../../types";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as BackArrow } from '../../../assets/icons/Back Arrow.svg';
import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';

import { Flex, HStack, SimpleGrid, Text } from "@chakra-ui/layout";
import { IconButton } from "@chakra-ui/button";
import { Input } from "../../../components/Forms/Inputs/Input";
import {  useState } from "react";
import { api } from "../../../services/api";

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useToast } from "@chakra-ui/toast";
import { useErrors } from "../../../hooks/useErrors";
import { useHistory } from "react-router";
import { Spinner } from "@chakra-ui/spinner";
import { EditProviderModal } from "./EditProviderModal";
import { ConfirmProviderRemoveModal } from "./ConfirmProviderRemoveModal";
import { useProviders } from "../../../hooks/useProviders";
import { Link } from "react-router-dom";

interface CreateNewProviderFormData{
    name: string;
    color: string;
}

const CreateNewProviderFormSchema = yup.object().shape({
    name: yup.string().required('Insira um nome para o fornecedor.'),
    color: yup.string(),
});

export default function Providers(){
    const providers = useProviders();
    const toast = useToast();
    const history = useHistory();
    const { showErrors } = useErrors();

    const [isEditProviderModalOpen, setIsEditProviderModalOpen] = useState(false);
    const [editProviderData, setEditProviderData] = useState<Provider>(() => {

        const data: Provider = {
            name: '',
            id: 0,
        };
        
        return data;
    });

    function OpenEditProviderModal(providerId: number){
        handleChangeProvider(providerId);
        setIsEditProviderModalOpen(true);
    }
    function CloseEditProviderModal(){
        setIsEditProviderModalOpen(false);
    }

    const [ProviderId, setProviderId] = useState(0);
    const [isConfirmProviderRemoveModalOpen, setIsConfirmProviderRemoveModalOpen] = useState(false);

    function OpenConfirmProviderRemoveModal(providerId: number){
        setProviderId(providerId);
        setIsConfirmProviderRemoveModalOpen(true);
    }
    function CloseConfirmProviderRemoveModal(){
        setIsConfirmProviderRemoveModalOpen(false);
    }


    function handleChangeProvider(providerId:number){
        const selectedProviderData = providers.data.filter((provider:Provider) => provider.id === providerId)[0];

        setEditProviderData(selectedProviderData);
    }

    const { register, handleSubmit, reset, formState} = useForm<CreateNewProviderFormData>({
        resolver: yupResolver(CreateNewProviderFormSchema),
    });

    const handleCreateProvider = async (providerData: CreateNewProviderFormData) => {

        try{
            await api.post('/providers/store', providerData);

            toast({
                title: "Sucesso",
                description: `O fornecedor ${providerData.name} foi cadastrado`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            reset();
            providers.refetch();
        }catch(error:any) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }

    return (
        <MainBoard sidebar="financial" header={
            (
                <>
                    <Link to="/pagamentos"><BackArrow width="20px" stroke="#4e4b66" fill="none"/></Link>
                    <Text color="gray.800" ml="4" whiteSpace="nowrap">
                        / Fornecedores
                    </Text>
                </>
            )
        }>
            <EditProviderModal afterEdit={providers.refetch} toEditProviderData={editProviderData} isOpen={isEditProviderModalOpen} onRequestClose={CloseEditProviderModal}/>
            <ConfirmProviderRemoveModal afterRemove={providers.refetch} toRemoveProviderId={ProviderId} isOpen={isConfirmProviderRemoveModalOpen} onRequestClose={CloseConfirmProviderRemoveModal}/>


            <HStack as="form" spacing="4" mb="10" onSubmit={handleSubmit(handleCreateProvider)}>
                <Input name="name" register={register} type="text" placeholder="Fornecedor" variant="outline" maxW="200px" error={formState.errors.name}/>
                <SolidButton type="submit" mb="10" color="white" bg="blue.400" icon={PlusIcon} colorScheme="blue">
                    Adicionar
                </SolidButton>
            </HStack>

            <SimpleGrid columns={3} minChildWidth="260px" gap={6}>
            {
                !providers.data ? (
                    <Flex justify="center" flexWrap="wrap">
                        <Spinner/>
                    </Flex>
                ) : providers.data.map((provider:Provider) => {
                    return (
                        <Flex key={provider.name} w="100%" justify="space-between" fontWeight="500" alignItems="center" bg="white" borderRadius="full" shadow="xl" h="54px" px="8">
                            <Flex alignItems="center" cursor="pointer" onClick={() => OpenEditProviderModal(provider.id)}>
                                <Text mx="4">{provider.name}</Text>
                            </Flex>
                            
                            <IconButton onClick={() => OpenConfirmProviderRemoveModal(provider.id)} h="24px" w="23px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                        </Flex>
                    )
                })
            }
            </SimpleGrid>
        </MainBoard>
    );
}