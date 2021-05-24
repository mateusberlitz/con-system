import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";

import { PaymentCategory } from "../../../types";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as EllipseIcon } from '../../../assets/icons/Ellipse.svg';
import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';

import { Flex, HStack, Stack, Text } from "@chakra-ui/layout";
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

interface CreateNewPaymentCategoryFormData{
    name: string;
    color: string;
}

const CreateNewPaymentCategoryFormSchema = yup.object().shape({
    name: yup.string().required('Insira um nome para a categoria.'),
    color: yup.string(),
});

export default function PaymentCategories(){
    const [categories, setCategories] = useState<PaymentCategory[]>([]);
    const [color, setColor] = useState('#ffffff');
    const toast = useToast();
    const history = useHistory();
    const { showErrors } = useErrors();


    const { register, handleSubmit, reset, formState} = useForm<CreateNewPaymentCategoryFormData>({
        resolver: yupResolver(CreateNewPaymentCategoryFormSchema),
    });

    useEffect(() => {
        const loadCategories = async () => {
            const { data } = await api.get('/payment_categories');

            setCategories(data);
        }

        loadCategories();
        
    }, [])

    const handleCreateCategory = async (paymentCategoryData: CreateNewPaymentCategoryFormData) => {
        paymentCategoryData.color = color;

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
                <Text color="gray.800">
                    Categorias de Pagamentos
                </Text>
            )
        }>
            <HStack as="form" spacing="4" mb="10" onSubmit={handleSubmit(handleCreateCategory)}>
                <ColorPicker color={color} setNewColor={setColor}/>
                <Input name="name" register={register} type="text" placeholder="Categoria" variant="outline" maxW="200px" error={formState.errors.name}/>
                <SolidButton type="submit" mb="10" color="white" bg="blue.400" icon={PlusIcon} colorScheme="blue">
                    Adicionar
                </SolidButton>
            </HStack>

            <Stack spacing="6">
                {
                    !categories ? (
                        <Flex justify="center">
                            <Spinner/>
                        </Flex>
                    ) : categories.map(category => {
                        return (
                            <Flex key={category.name} flexGrow={1} justify="space-between" fontWeight="500" alignItems="center" bg="white" borderRadius="full" shadow="xl" h="54px" px="8">
                                <Flex alignItems="center">
                                    <EllipseIcon stroke="none" fill={category.color ? category.color : "#dddddd"}/>
                                    <Text mx="4" color={category.color ? category.color : "#dddddd"}>{category.name}</Text>
                                </Flex>
                                
                                <IconButton h="24px" w="23px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                            </Flex>
                        )
                    })
                }
                <HStack flexDirection="row" spacing="5" flexWrap="wrap">
                    <Flex flexGrow={1} justify="space-between" fontWeight="500" alignItems="center" bg="white" borderRadius="full" shadow="xl" h="54px" px="8">
                        <Flex alignItems="center">
                            <EllipseIcon stroke="none" fill="#2097ed"/>
                            <Text mx="4" color="#2097ed">Fatura da internet</Text>
                        </Flex>
                        
                        <IconButton h="24px" w="23px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                    </Flex>

                    <Flex flexGrow={1} fontWeight="500" alignItems="center" bg="white" borderRadius="full" shadow="xl" h="54px" px="8">
                        <EllipseIcon stroke="none" fill="#2097ed"/>
                        <Text ml="2" color="#2097ed">Fatura da internet</Text>
                    </Flex>

                    <Flex flexGrow={1} fontWeight="500" alignItems="center" bg="white" borderRadius="full" shadow="xl" h="54px" px="8">
                        <EllipseIcon stroke="none" fill="#2097ed"/>
                        <Text ml="2" color="#2097ed">Fatura da internet</Text>
                    </Flex>

                </HStack>

                    <HStack flexDirection="row" spacing="5" flexWrap="wrap">

                    <Flex flexGrow={1} fontWeight="500" alignItems="center" bg="white" borderRadius="full" shadow="xl" h="54px" px="8">
                        <EllipseIcon stroke="none" fill="#2097ed"/>
                        <Text ml="2" color="#2097ed">Fatura da internet</Text>
                    </Flex>

                    <Flex flexGrow={1} fontWeight="500" alignItems="center" bg="white" borderRadius="full" shadow="xl" h="54px" px="8">
                        <EllipseIcon stroke="none" fill="#2097ed"/>
                        <Text ml="2" color="#2097ed">Fatura da internet</Text>
                    </Flex>

                    <Flex flexGrow={1} fontWeight="500" alignItems="center" bg="white" borderRadius="full" shadow="xl" h="54px" px="8">
                        <EllipseIcon stroke="none" fill="#2097ed"/>
                        <Text ml="2" color="#2097ed">Fatura da internet</Text>
                    </Flex>

                    <Flex flexGrow={1} fontWeight="500" alignItems="center" bg="white" borderRadius="full" shadow="xl" h="54px" px="8">
                        <EllipseIcon stroke="none" fill="#2097ed"/>
                        <Text ml="2" color="#2097ed">Fatura da internet</Text>
                    </Flex>

                    </HStack>
            </Stack>
        </MainBoard>
    );
}