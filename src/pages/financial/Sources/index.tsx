import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";

import { Source } from "../../../types";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as BackArrow } from '../../../assets/icons/Back Arrow.svg';
import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';

import { Flex, HStack, Link, SimpleGrid, Text } from "@chakra-ui/layout";
import { IconButton } from "@chakra-ui/button";
import { Input } from "../../../components/Forms/Inputs/Input";
import { ColorPicker } from "../../../components/Forms/ColorPicker";
import { useEffect, useState } from "react";
import { api } from "../../../services/api";

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useToast } from "@chakra-ui/toast";
import { useErrors } from "../../../hooks/useErrors";
import { useHistory } from "react-router";
import { Spinner } from "@chakra-ui/spinner";
import { EditSourceModal } from "./EditSourceModal";
import { ConfirmSourceRemoveModal } from "./ConfirmSourceRemoveModal";
import { useSources } from "../../../hooks/useSources";

interface CreateNewSourceFormData{
    name: string;
    color: string;
}

const CreateNewSourceFormSchema = yup.object().shape({
    name: yup.string().required('Insira um nome para a fonte de renda.'),
    color: yup.string(),
});

export default function Sources(){
    const source = useSources();
    const toast = useToast();
    const history = useHistory();
    const { showErrors } = useErrors();

    const [isEditSourceModalOpen, setIsEditSourceModalOpen] = useState(false);
    const [editSourceData, setEditSourceData] = useState<Source>(() => {

        const data: Source = {
            name: '',
            phone: '',
            email: '',
            id: 0,
        };
        
        return data;
    });

    function OpenEditSourceModal(sourceId: number){
        handleChangeSource(sourceId);
        setIsEditSourceModalOpen(true);
    }
    function CloseEditSourceModal(){
        setIsEditSourceModalOpen(false);
    }

    const [sourceId, setSourceId] = useState(0);
    const [isConfirmSourceRemoveModalOpen, setIsConfirmSourceRemoveModalOpen] = useState(false);

    function OpenConfirmSourceRemoveModal(sourceId: number){
        setSourceId(sourceId);
        setIsConfirmSourceRemoveModalOpen(true);
    }
    function CloseConfirmSourceRemoveModal(){
        setIsConfirmSourceRemoveModalOpen(false);
    }


    function handleChangeSource(sourceId:number){
        const selectedSourceData = source.data.filter((source:Source) => source.id === sourceId)[0];

        setEditSourceData(selectedSourceData);
    }

    const { register, handleSubmit, reset, formState} = useForm<CreateNewSourceFormData>({
        resolver: yupResolver(CreateNewSourceFormSchema),
    });

    const handleCreateSource = async (sourceData: CreateNewSourceFormData) => {
        console.log(sourceData);
        try{
            await api.post('/sources/store', sourceData);

            toast({
                title: "Sucesso",
                description: `A fonte de renda ${sourceData.name} foi cadastrada`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            reset();
            source.refetch();
        }catch(error) {
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
                    <Link href="/receber"><BackArrow width="20px" stroke="#4e4b66" fill="none"/></Link>
                    <Text color="gray.800" ml="4">
                        / Fontes de Renda
                    </Text>
                </>
            )
        }>
            <EditSourceModal afterEdit={source.refetch} toEditSourceData={editSourceData} isOpen={isEditSourceModalOpen} onRequestClose={CloseEditSourceModal}/>
            <ConfirmSourceRemoveModal afterRemove={source.refetch} toRemoveSourceId={sourceId} isOpen={isConfirmSourceRemoveModalOpen} onRequestClose={CloseConfirmSourceRemoveModal}/>


            <HStack as="form" spacing="4" mb="10" onSubmit={handleSubmit(handleCreateSource)}>
                <Input name="name" register={register} type="text" placeholder="Fontes de Renda" variant="outline" maxW="200px" error={formState.errors.name}/>
                <SolidButton type="submit" mb="10" color="white" bg="blue.400" icon={PlusIcon} colorScheme="blue">
                    Adicionar Fonte
                </SolidButton>
            </HStack>

            <SimpleGrid columns={3} minChildWidth="260px" gap={6}>
            {
                !source.data ? (
                    <Flex justify="center" flexWrap="wrap">
                        <Spinner/>
                    </Flex>
                ) : source.data.map((source:Source) => {
                    return (
                        <Flex key={source.name} w="100%" justify="space-between" fontWeight="500" alignItems="center" bg="white" borderRadius="full" shadow="xl" h="54px" px="8">
                            <Flex alignItems="center" cursor="pointer" onClick={() => OpenEditSourceModal(source.id)}>
                                <Text mx="4">{source.name}</Text>
                            </Flex>
                            
                            <IconButton onClick={() => OpenConfirmSourceRemoveModal(source.id)} h="24px" w="23px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                        </Flex>
                    )
                })
            }
            </SimpleGrid>
        </MainBoard>
    );
}