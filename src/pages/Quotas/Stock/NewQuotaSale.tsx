import { Divider, Flex, HStack, Link, Spinner, Stack, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useHistory, useParams } from "react-router";
import { useEffect } from "react";
import { Board } from "../../../components/Board";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { MainBoard } from "../../../components/MainBoard";
import { getQuotas } from "../../../hooks/useQuotas";
import { api } from "../../../services/api";
import { BillCategory, Quota, ReadyQuota } from "../../../types";
import { useReadyQuota } from "../../../hooks/useReadyQuota";
import { ControlledInput } from "../../../components/Forms/Inputs/ControlledInput";

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from "../../../components/Forms/Inputs/Input";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { formatBRDate } from "../../../utils/Date/formatBRDate";
import { RemoveButton } from "../../../components/Buttons/RemoveButton";
import moneyToBackend from "../../../utils/moneyToBackend";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { useErrors } from "../../../hooks/useErrors";
import { formatInputDate } from "../../../utils/Date/formatInputDate";
import { Select } from "../../../components/Forms/Selects/Select";

import { ReactComponent as TagIcon } from '../../../assets/icons/Tag.svg';
import { ReactComponent as BackArrow } from '../../../assets/icons/Back Arrow.svg';

interface QuotaSaleParams{
    quota: string;
}

interface QuotaSaleFormData{
    ready_quota: number;
    sale_date:string;
    company:number;
    value: string;
    seller: string;
    buyer: string;
    cpf_cnpj: string;
    profit?: number;
    tax: string;
    coordinator?: string;
    coordinator_value?: string;
    supervisor?: string;
    supervisor_value?: string;
    description?: string;

    passed_value?: string;
    partner_value?: string;
}

interface PaymentOfQuota{
    id?: number;
    title: string;
    value: string;
    observation?:string;
    expire:string;
    company?:number;
    category:number;
    quota_sales_id?: number;
}

const NewQuotaSaleFormSchema = yup.object().shape({
    description: yup.string().nullable(),
    seller: yup.string().required("Quem vendeu a cota?"),
    buyer: yup.string().required("Quem foi o comprador?"),
    value: yup.string().required("Informe o valor da venda"),
    tax: yup.string().required("Qual a taxa?"),
    cpf_cnpj: yup.string().required("Qual o cpf ou cnpj proprietário?"),

    partner_value: yup.string().nullable(),
    passed_value: yup.string().nullable(),

    coordinator: yup.string().nullable(),

    sale_date: yup.string().required("Selecione a data da venda"),
});

const PaymentsOfQuotaSchema = yup.object().shape({
    title: yup.string().required("Qual o título desse recebimento"),
    value: yup.string().required("Informe o valor da venda"),
    expire: yup.string().required("Selecione a data da venda"),
    category: yup.number().required("Selecione uma categoria"),
    osbervation: yup.string().nullable(),
});

export default function NewQuotaSale(){
    const workingCompany = useWorkingCompany();

    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const params = useParams<QuotaSaleParams>();

    const quotaQuery = useReadyQuota(params.quota);

    const quota:ReadyQuota = (quotaQuery?.data ? quotaQuery?.data : null);

    const { handleSubmit, register, formState, control} = useForm<QuotaSaleFormData>({
        resolver: yupResolver(NewQuotaSaleFormSchema),
        defaultValues: {
            value: (quota && quota.value) ? quota.value.toString().replace('.', ',') : '',
        }
    });

    const paymentsForm = useForm<PaymentOfQuota>({
        resolver: yupResolver(PaymentsOfQuotaSchema),
        defaultValues: {
            value: (quota && quota.value) ? quota.value.toString().replace('.', ',') : '',
        }
    });

    const [paymentsOfQuota, setPaymentOfQuota] = useState<PaymentOfQuota[]>([]);

    function handleAddPayment(payment : PaymentOfQuota){
        payment.value = moneyToBackend(payment.value);
        payment.title = `[${quota.group}-${quota.quota}] ${payment.title}`;

        setPaymentOfQuota([
            ...paymentsOfQuota,
            payment
        ])
    }

    function handleRemovePayment(index: number){
        const updatedPaymentsOfQuota = [...paymentsOfQuota];

        updatedPaymentsOfQuota.splice(index, 1);

        setPaymentOfQuota(updatedPaymentsOfQuota);
    }

    function includeAndFormatData(quotaSaleData: QuotaSaleFormData){
        quotaSaleData.value = moneyToBackend(quotaSaleData.value);

        quotaSaleData.partner_value = ((quotaSaleData.partner_value != null && quotaSaleData.partner_value != "") ? moneyToBackend(quotaSaleData.partner_value) : '');
        quotaSaleData.passed_value = ((quotaSaleData.passed_value != null && quotaSaleData.passed_value != "") ? moneyToBackend(quotaSaleData.passed_value) : '');

        quotaSaleData.tax = ((quotaSaleData.tax != null && quotaSaleData.tax != "") ? moneyToBackend(quotaSaleData.tax) : '');

        const partnerValue = (quotaSaleData.partner_value ? parseFloat(quotaSaleData.partner_value) : 0);

        quotaSaleData.profit = parseFloat(quotaSaleData.value) - quota.cost - partnerValue;

        quotaSaleData.sale_date = formatInputDate(quotaSaleData.sale_date);

        if(!workingCompany.company){
            return quotaSaleData;
        }
        
        quotaSaleData.company = workingCompany.company?.id;

        return quotaSaleData;
    }

    const handleCreateNewQuotaSale = async (quotaSaleData : QuotaSaleFormData) => {
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

            quotaSaleData = includeAndFormatData(quotaSaleData);
            quotaSaleData.ready_quota = quota.id

            const response = await api.post('/quota_sales/store', quotaSaleData);

            paymentsOfQuota.map(async (payment: PaymentOfQuota) => {
                payment.expire = formatInputDate(payment.expire);
                payment.company = workingCompany.company?.id;
                payment.quota_sales_id = response.data.id;

                await api.post('/bills/store', payment);
            })

            //console.log(paymentsOfQuota);

            toast({
                title: "Sucesso",
                description: `A Cota ${quota.group}-${quota.quota} foi cadastrada como vendida.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            history.replace('/venda-contempladas');

        }catch(error:any) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }

    const [categories, setCategories] = useState<BillCategory[]>([]);

    const loadCategories = async () => {
        const { data } = await api.get('/bill_categories');

        setCategories(data);
    }

    useEffect(() => {
        loadCategories();
    }, []);

    console.log(formState.errors);

    return(
        <MainBoard sidebar="quotas" header={ <CompanySelectMaster/>}>
            <Link href="/venda-contempladas" display="flex" flexDirection="row" mb="10">
                <BackArrow width="20px" stroke="#4e4b66" fill="none"/>
                <Text ml="4">Voltar para as cotas</Text>
            </Link>

                {
                        quotaQuery.isLoading ? (
                            <Flex justify="center">
                                <Spinner/>
                            </Flex>
                        ) : ( quotaQuery.isError ? (
                                <Flex justify="center" mt="4" mb="4">
                                    <Text>Erro listar as contas a pagar</Text>
                                </Flex>
                            ) : (
                                quota ? (
                                    <>
                                    
                                        <HStack justifyContent="space-between" align="baseline">
                                            <Text mb="6" fontWeight="bold" fontSize="lg">Vender a cota</Text>

                                            {
                                                quota && <Text mb="6" fontWeight="bold" fontSize="lg">{quota.group}-{quota.quota}</Text>
                                            }
                                        </HStack>

                                        <Board mb="14">

                                            <HStack justifyContent="space-between">

                                                <Stack spacing="0">
                                                    <Text fontSize="sm" color="gray.800">Grupo e cota:</Text>
                                                    <Text fontSize="sm" color="gray.800" fontWeight="bold">{quota.group}-{quota.quota}</Text>
                                                </Stack>

                                                <Stack spacing="0">
                                                    <Text fontSize="sm" color="gray.800">Crédito:</Text>
                                                    <Text fontSize="sm" color="gray.800" fontWeight="bold">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quota.credit)}</Text>
                                                </Stack> 

                                                <Stack spacing="0">
                                                    <Text fontSize="sm" color="gray.800">% paga pelo crédito:</Text>
                                                    <Text fontSize="sm" color="gray.800" fontWeight="bold">{quota.paid_percent}</Text>
                                                </Stack> 

                                                <Stack spacing="0">
                                                    <Text fontSize="sm" color="gray.800">Custo da empresa:</Text>
                                                    <Text fontSize="sm" color="gray.800" fontWeight="bold">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quota.cost)}</Text>
                                                </Stack> 

                                                <Stack spacing="0">
                                                    <Text fontSize="sm" color="gray.800">Custo total:</Text>
                                                    <Text fontSize="sm" color="gray.800" fontWeight="bold">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quota.total_cost)}</Text>
                                                </Stack>                  
                                            </HStack>
                                        </Board>

                                        <Stack id="quotaSale" as="form" spacing="6" mb="14" onSubmit={handleSubmit(handleCreateNewQuotaSale)}>
                                            <HStack spacing="4" align="baseline">
                                                <ControlledInput control={control} value={quota.value ? quota.value.toString().replace('.', ',') : ''} name="value" type="text" placeholder="Valor (Entrada)" variant="outline" error={formState.errors.value} focusBorderColor="blue.800"/>
                                            
                                                <Input register={register} name="sale_date" type="date" placeholder="Data da venda" variant="outline" error={formState.errors.sale_date} focusBorderColor="blue.800"/>
                                            
                                                <Input register={register} name="buyer" type="text" placeholder="Comprador" variant="outline" mask="money" error={formState.errors.buyer} focusBorderColor="blue.800"/>
                                            
                                                {/* <Input register={register} name="profit" type="text" placeholder="Lucro" variant="outline" error={formState.errors.profit} focusBorderColor="blue.800"/> */}
                                            </HStack>

                                            <HStack spacing="4" align="baseline">
                                                <Input register={register} name="tax" type="text" placeholder="Taxa" variant="outline" error={formState.errors.tax} focusBorderColor="blue.800"/>

                                                <Input register={register} name="cpf_cnpj" type="text" placeholder="CPF/CNPJ" variant="outline" error={formState.errors.cpf_cnpj} focusBorderColor="blue.800"/>

                                                <Input register={register} name="seller" type="text" placeholder="Vendedor" variant="outline" error={formState.errors.seller} focusBorderColor="blue.800"/>
                                            </HStack>

                                            <HStack spacing="4" align="baseline">
                                                <Input register={register} name="coordinator" type="text" placeholder="Coordenador" variant="outline" mask="money" error={formState.errors.coordinator} focusBorderColor="blue.800"/>

                                                <Input register={register} name="coordinator_value" type="text" placeholder="Comissão coordenador" variant="outline" error={formState.errors.coordinator_value} focusBorderColor="blue.800"/>

                                                <Input register={register} name="supervisor" type="text" placeholder="Supervisor" variant="outline" error={formState.errors.supervisor} focusBorderColor="blue.800"/>

                                                <Input register={register} name="supervisor_value" type="text" placeholder="Comissão do supervisor" variant="outline" error={formState.errors.supervisor_value} focusBorderColor="blue.800"/>
                                            </HStack>

                                            <HStack spacing="4" align="baseline">
                                                <Input register={register} name="passed_value" type="text" placeholder="Valor passado" variant="outline" mask="money" error={formState.errors.passed_value} focusBorderColor="blue.800"/>
                                            
                                                {/* <Input register={register} name="partner_value" type="text" placeholder="Comissão do Parceiro" variant="outline" mask="money" error={formState.errors.partner_value} focusBorderColor="blue.800"/> */}
                                            </HStack>

                                            <HStack spacing="4" align="baseline">
                                                <Input register={register} name="description" type="text" placeholder="Descrição" variant="outline" mask="money" error={formState.errors.description} focusBorderColor="blue.800"/>
                                            </HStack>
                                        </Stack>

                                        <HStack justifyContent="space-between" align="baseline">
                                            <Text mb="6" fontWeight="bold" fontSize="lg">Pagamentos a receber</Text>
                                        </HStack>

                                        <Board background="transparent" border="1px solid" borderColor="gray.300" boxShadow="none">
                                            {
                                                paymentsOfQuota && paymentsOfQuota.map((paymentOfQuota:PaymentOfQuota, index: number) => {
                                                    const paymentCategory:undefined|BillCategory = categories.filter(obj => obj.id === paymentOfQuota.category)[0];

                                                    return (
                                                        <Stack key={`${paymentOfQuota.expire}-${paymentOfQuota.value}`} borderBottom="1px solid" pb="4" borderColor="gray.300" mb="14" spacing="4">
                                                            <HStack spacing="12" justifyContent="space-between">
                                                                <Text fontWeight="bold">{formatBRDate(paymentOfQuota.expire)}</Text>

                                                                <Text>{paymentOfQuota.title}</Text>

                                                                <Text fontWeight="bold">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(parseFloat(paymentOfQuota.value))}</Text>

                                                                <Flex fontWeight="500" alignItems="center" color="gray.800" fontSize="sm">
                                                                    <TagIcon stroke="#4e4b66" fill="none" width="17px"/>
                                                                    <Text ml="2">{paymentCategory ? paymentCategory.name : ''}</Text>
                                                                </Flex>
                                                            
                                                                <RemoveButton alignSelf="right" onClick={() => handleRemovePayment(index)}/>
                                                            </HStack>

                                                            <Text fontWeight="regular" fontSize="sm">{paymentOfQuota.observation}</Text>
                                                        </Stack>
                                                    );
                                                })
                                            }

                                            {/* <Divider/> */}

                                            <Stack as="form" onSubmit={paymentsForm.handleSubmit(handleAddPayment)}>
                                                <Stack spacing="6">
                                                    <Text>Adicionar recebimento</Text>

                                                    <HStack>
                                                        <Input register={paymentsForm.register} name="title" type="text" placeholder="Título" variant="outline" mask="money" error={paymentsForm.formState.errors.title} focusBorderColor="blue.800"/>

                                                        <Input register={paymentsForm.register} name="value" type="text" placeholder="Valor" variant="outline" mask="money" error={paymentsForm.formState.errors.value} focusBorderColor="blue.800"/>
                                                        
                                                        <Input register={paymentsForm.register} name="expire" type="date" placeholder="Data do pagamento" variant="outline" error={paymentsForm.formState.errors.expire} focusBorderColor="blue.800"/>
                                                    </HStack>

                                                    <HStack>

                                                        <Select register={paymentsForm.register} h="45px" value="0" name="category" w="100%" fontSize="sm" focusBorderColor="blue.800" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Categoria" error={paymentsForm.formState.errors.category}>
                                                            {categories && categories.map((category:BillCategory) => {
                                                                return (
                                                                    <option key={category.id} value={category.id}>{category.name}</option>
                                                                )
                                                            })}
                                                        </Select>

                                                        <Input register={paymentsForm.register} name="observation" type="text" placeholder="Observação" variant="outline" error={paymentsForm.formState.errors.observation} focusBorderColor="blue.800"/>

                                                        <SolidButton mr="6" color="white" bg="blue.800" colorScheme="blue" type="submit" isLoading={formState.isSubmitting}>
                                                            Adicionar
                                                        </SolidButton>
                                                    </HStack>
                                                </Stack>
                                            </Stack>
                                        </Board>
                                    </>
                                ) : (
                                    <Text>Nenhuma cota encontrada.</Text>
                                )
                            )
                        )
                }
            

            <SolidButton form="quotaSale" mt="14" mr="6" color="white" bg="green.500" colorScheme="green" type="submit" isLoading={formState.isSubmitting}>
                Cadastrar Venda
            </SolidButton>
        </MainBoard>
    )
}