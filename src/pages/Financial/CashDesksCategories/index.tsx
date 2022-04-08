import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";

import { CashDeskCategory } from "../../../types";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as EllipseIcon } from '../../../assets/icons/Ellipse.svg';
import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';
import { ReactComponent as BackArrow } from '../../../assets/icons/Back Arrow.svg';

import { Flex, HStack, SimpleGrid, Text } from "@chakra-ui/layout";
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
import { EditCashDeskCategoryModal } from "./EditCashDeskCategoryModal";
import { ConfirmCashDeskCategoryRemoveModal } from "./ConfirmCashDeskCategoryRemoveModal";
import { Link } from "react-router-dom";

interface CreateNewCashDeskCategoryFormData{
    name: string;
    color: string;
}

const CreateNewCashDeskCategoryFormSchema = yup.object().shape({
    name: yup.string().required('Insira um nome para a categoria.'),
    color: yup.string(),
});

export default function CashDeskCategories(){
    const [categories, setCategories] = useState<CashDeskCategory[]>([]);
    const [color, setColor] = useState('#ffffff');
    const toast = useToast();
    const history = useHistory();
    const { showErrors } = useErrors();

    const [toEditcolor, setToEditColor] = useState('#ffffff');

    function changeColor(color: string){
        setToEditColor(color);
    }

    const [isEditCashDeskCategoryModalOpen, setIsEditCashDeskCategoryModalOpen] = useState(false);
    const [editCashDeskCategoryData, setEditCashDeskCategoryData] = useState<CashDeskCategory>(() => {

        const data: CashDeskCategory = {
            name: '',
            id: 0,
            color: '#ffffff',
        };
        
        return data;
    });

    function OpenEditCashDeskCategoryModal(categoryId: number){
        handleChangeCashDeskCategory(categoryId);
        setIsEditCashDeskCategoryModalOpen(true);
    }
    function CloseEditCashDeskCategoryModal(){
        setIsEditCashDeskCategoryModalOpen(false);
    }

    const [CashDeskCategoryId, setCashDeskCategoryId] = useState(0);
    const [isConfirmCashDeskCategoryRemoveModalOpen, setIsConfirmCashDeskCategoryRemoveModalOpen] = useState(false);

    function OpenConfirmCashDeskCategoryRemoveModal(categoryId: number){
        setCashDeskCategoryId(categoryId);
        setIsConfirmCashDeskCategoryRemoveModalOpen(true);
    }
    function CloseConfirmCashDeskCategoryRemoveModal(){
        setIsConfirmCashDeskCategoryRemoveModalOpen(false);
    }


    function handleChangeCashDeskCategory(categoryId:number){
        const selectedCashDeskData = categories.filter((category:CashDeskCategory) => category.id === categoryId)[0];

        changeColor(selectedCashDeskData.color);
        setEditCashDeskCategoryData(selectedCashDeskData);
    }

    const { register, handleSubmit, reset, formState} = useForm<CreateNewCashDeskCategoryFormData>({
        resolver: yupResolver(CreateNewCashDeskCategoryFormSchema),
    });

    const loadCategories = async () => {
        const { data } = await api.get('/cashdesk_categories');

        setCategories(data);
    }

    useEffect(() => {
        loadCategories();
        
    }, [])

    const handleCreateCategory = async (CashDeskCategoryData: CreateNewCashDeskCategoryFormData) => {
        CashDeskCategoryData.color = color;

        if(color === '#ffffff'){
            toast({
                title: "Ops",
                description: `Selecione uma cor diferente`,
                status: "warning",
                duration: 12000,
                isClosable: true,
            });

            return;
        }

        try{
            await api.post('/cashdesk_categories/store', CashDeskCategoryData);

            toast({
                title: "Sucesso",
                description: `A nova categoria ${CashDeskCategoryData.name} foi cadastrada`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            reset();
            loadCategories();
        }catch(error: any) {
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
                    <Link to="/caixa"><BackArrow width="20px" stroke="#4e4b66" fill="none"/></Link>
                    <Text color="gray.800" ml="4" whiteSpace="nowrap">
                        / Categorias do Caixa
                    </Text>
                </>
            )
        }>
            <EditCashDeskCategoryModal afterEdit={loadCategories} color={toEditcolor} changeColor={changeColor} toEditCashDeskCategoryData={editCashDeskCategoryData} isOpen={isEditCashDeskCategoryModalOpen} onRequestClose={CloseEditCashDeskCategoryModal}/>
            <ConfirmCashDeskCategoryRemoveModal afterRemove={loadCategories} toRemoveCashDeskCategoryId={CashDeskCategoryId} isOpen={isConfirmCashDeskCategoryRemoveModalOpen} onRequestClose={CloseConfirmCashDeskCategoryRemoveModal}/>


            <HStack as="form" spacing="4" mb="10" onSubmit={handleSubmit(handleCreateCategory)}>
                <ColorPicker color={color} setNewColor={setColor}/>
                <Input name="name" register={register} type="text" placeholder="Categoria" variant="outline" maxW="200px" error={formState.errors.name}/>
                <SolidButton type="submit" mb="10" color="white" bg="blue.400" icon={PlusIcon} colorScheme="blue">
                    Adicionar
                </SolidButton>
            </HStack>

            <SimpleGrid columns={3} minChildWidth="260px" gap={6}>
            {
                !categories ? (
                    <Flex justify="center" flexWrap="wrap">
                        <Spinner/>
                    </Flex>
                ) : categories.map(category => {
                    return (
                        <Flex key={category.name} w="100%" justify="space-between" fontWeight="500" alignItems="center" bg="white" borderRadius="full" shadow="xl" h="54px" px="8">
                            <Flex alignItems="center" cursor="pointer" onClick={() => OpenEditCashDeskCategoryModal(category.id)}>
                                <EllipseIcon stroke="none" fill={category.color ? category.color : "#dddddd"}/>
                                <Text mx="4" color={category.color ? category.color : "#dddddd"}>{category.name}</Text>
                            </Flex>
                            
                            <IconButton onClick={() => OpenConfirmCashDeskCategoryRemoveModal(category.id)} h="24px" w="23px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                        </Flex>
                    )
                })
            }
            </SimpleGrid>
        </MainBoard>
    );
}