import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";

import { PaymentCategory } from "../../../types";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as EllipseIcon } from '../../../assets/icons/Ellipse.svg';
import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';
import { ReactComponent as BackArrow } from '../../../assets/icons/Back Arrow.svg';
import { ReactComponent as LinkIcon } from '../../../assets/icons/Link.svg';

import { Flex, HStack, SimpleGrid, Text, Stack } from "@chakra-ui/layout";
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
import { EditPaymentCategoryModal } from "./EditPaymentCategoryModal";
import { ConfirmPaymentCategoryRemoveModal } from "./ConfirmPaymentCategoryRemoveModal";
import { Checkbox, Divider, useBreakpointValue } from "@chakra-ui/react";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { useWorkingBranch } from "../../../hooks/useWorkingBranch";
import { Link } from "react-router-dom";

interface CreateNewPaymentCategoryFormData{
    name: string;
    color: string;
    individual: boolean;
}

const CreateNewPaymentCategoryFormSchema = yup.object().shape({
    name: yup.string().required('Insira um nome para a categoria.'),
    color: yup.string(),
});

export default function PaymentCategories(){
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();
    const isWideVersion = useBreakpointValue({base: false, lg: true});

    const [categories, setCategories] = useState<PaymentCategory[]>([]);
    const [color, setColor] = useState('#ffffff');
    const toast = useToast();
    const history = useHistory();
    const { showErrors } = useErrors();

    const [toEditcolor, setToEditColor] = useState('#ffffff');

    function changeColor(color: string){
        setToEditColor(color);
    }

    const [isEditPaymentCategoryModalOpen, setIsEditPaymentCategoryModalOpen] = useState(false);
    const [editPaymentCategoryData, setEditPaymentCategoryData] = useState<PaymentCategory>(() => {

        const data: PaymentCategory = {
            name: '',
            id: 0,
            color: '#ffffff',
            individual: false,
        };
        
        return data;
    });

    function OpenEditPaymentCategoryModal(categoryId: number){
        handleChangePaymentCategory(categoryId);
        setIsEditPaymentCategoryModalOpen(true);
    }
    function CloseEditPaymentCategoryModal(){
        setIsEditPaymentCategoryModalOpen(false);
    }

    const [paymentCategoryId, setPaymentCategoryId] = useState(0);
    const [isConfirmPaymentCategoryRemoveModalOpen, setIsConfirmPaymentCategoryRemoveModalOpen] = useState(false);

    function OpenConfirmPaymentCategoryRemoveModal(categoryId: number){
        setPaymentCategoryId(categoryId);
        setIsConfirmPaymentCategoryRemoveModalOpen(true);
    }
    function CloseConfirmPaymentCategoryRemoveModal(){
        setIsConfirmPaymentCategoryRemoveModalOpen(false);
    }


    function handleChangePaymentCategory(categoryId:number){
        const selectedPaymentData = categories.filter((category:PaymentCategory) => category.id === categoryId)[0];

        changeColor(selectedPaymentData.color);
        setEditPaymentCategoryData(selectedPaymentData);
    }

    const { register, handleSubmit, reset, formState} = useForm<CreateNewPaymentCategoryFormData>({
        resolver: yupResolver(CreateNewPaymentCategoryFormSchema),
    });

    const loadCategories = async () => {
        const { data } = await api.get('/payment_categories', {
            params: {
                company: workingCompany.company?.id,
                branch: workingBranch.branch?.id,
            }
        });

        setCategories(data);
    }

    useEffect(() => {
        loadCategories();
    }, [workingCompany, workingBranch])

    const handleCreateCategory = async (paymentCategoryData: CreateNewPaymentCategoryFormData) => {
        paymentCategoryData.color = color;

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
            await api.post('/payment_categories/store', paymentCategoryData);

            toast({
                title: "Sucesso",
                description: `A nova categoria ${paymentCategoryData.name} foi cadastrada`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            reset();
            loadCategories();
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
                <Stack>
                    <CompanySelectMaster />

                    <HStack>
                        <Link to="/pagamentos"><BackArrow width="20px" stroke="#4e4b66" fill="none"/></Link>
                        <Text color="gray.800" ml="4" whiteSpace="nowrap">
                            / Categorias de Pagamentos
                        </Text>
                    </HStack>
                </Stack>
            )
        }>
            <EditPaymentCategoryModal afterEdit={loadCategories} color={toEditcolor} changeColor={changeColor} toEditPaymentCategoryData={editPaymentCategoryData} isOpen={isEditPaymentCategoryModalOpen} onRequestClose={CloseEditPaymentCategoryModal}/>
            <ConfirmPaymentCategoryRemoveModal afterRemove={loadCategories} toRemovePaymentCategoryId={paymentCategoryId} isOpen={isConfirmPaymentCategoryRemoveModalOpen} onRequestClose={CloseConfirmPaymentCategoryRemoveModal}/>


            <Stack mt={["6", "0"]} direction={["column", "row"]} as="form" spacing="4" mb="10" onSubmit={handleSubmit(handleCreateCategory)}>
                <HStack>
                    <ColorPicker color={color} setNewColor={setColor}/>
                    <Input name="name" register={register} type="text" placeholder="Categoria" variant="outline" maxW="200px" error={formState.errors.name}/>
                </HStack>

                <Flex as="div">
                    <Checkbox {...register("individual")} colorScheme="blue" size="md" mr="15" borderRadius="full" fontSize="sm" color="gray.800" value={1}>
                        Desabilitar no resultado
                    </Checkbox>
                </Flex>

                <SolidButton type="submit" mb="10" color="white" bg="blue.400" icon={PlusIcon} colorScheme="blue">
                    Adicionar
                </SolidButton>
            </Stack>

            {
                !isWideVersion && <Divider mb="10"/>
            }

            <SimpleGrid columns={3} minChildWidth="260px" gap={6}>
            {
                !categories ? (
                    <Flex justify="center" flexWrap="wrap">
                        <Spinner/>
                    </Flex>
                ) : categories.map(category => {
                    return (
                        <Flex key={category.name} w="100%" justify="space-between" fontWeight="500" alignItems="center" bg="white" borderRadius="full" shadow="xl" h="54px" px="8">
                            <Flex alignItems="center" cursor="pointer" onClick={() => OpenEditPaymentCategoryModal(category.id)}>
                                <EllipseIcon stroke="none" fill={category.color ? category.color : "#dddddd"}/>
                                <Text mx="4" color={category.color ? category.color : "#dddddd"}>{category.name}</Text>
                                {
                                    category.individual ?
                                        <LinkIcon width="19px" height="19px" stroke="none" fill={category.color ? category.color : "#dddddd"}/>
                                    : ""
                                }
                            </Flex>
                            
                            <IconButton onClick={() => OpenConfirmPaymentCategoryRemoveModal(category.id)} h="24px" w="23px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                        </Flex>
                    )
                })
            }
            </SimpleGrid>
        </MainBoard>
    );
}