import { Divider, Flex, HStack, Spinner, Stack, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useHistory, useParams } from "react-router";
import { useEffect } from "react";
import { Board } from "../../../components/Board";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { MainBoard } from "../../../components/MainBoard";
import { getQuotas } from "../../../hooks/useQuotas";
import { api } from "../../../services/api";
import { Quota } from "../../../types";
import { useQuota } from "../../../hooks/useQuota";
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

interface QuotaSaleParams{
    quota: string;
}

interface QuotaSaleFormData{
    quota: number;
    sale_date:string;
    company:number;
    value: string;
    seller: string;
    buyer: string;
    cpf_cnpj: string;
    profit?: number;
    tax?: string;
    coordinator?: string;
    description?: string;

    passed_value?: string;
    partner_value?: string;
}

interface PaymentOfQuota{
    value: string;
    observation?:string;
    expire:string;
}

const EditQuotaFormSchema = yup.object().shape({
    description: yup.string().nullable(),
    seller: yup.string().required("Quem vendeu a cota?"),
    buyer: yup.string().required("Quem foi o comprador?"),
    value: yup.string().required("Informe o valor da venda"),
    profit: yup.string().required("Informe o lucro"),
    tax: yup.string().nullable(),
    cpf_cnpj: yup.string().required("Qual o cpf ou cnpj proprietário?"),

    partner_value: yup.string().nullable(),
    passed_value: yup.string().nullable(),

    coordinator: yup.string().nullable(),

    sale_date: yup.string().required("Selecione a data da venda"),
});

const PaymentsOfQuotaSchema = yup.object().shape({
    value: yup.string().required("Informe o valor da venda"),
    expire: yup.string().required("Selecione a data da venda"),
    osbervation: yup.string().nullable(),
});

export default function NewQuotaSale(){
    const workingCompany = useWorkingCompany();

    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const params = useParams<QuotaSaleParams>();

    const quotaQuery = useQuota(params.quota);

    const quota = (quotaQuery?.data ? quotaQuery?.data : null);

    const { handleSubmit, register, formState, control} = useForm<QuotaSaleFormData>({
        resolver: yupResolver(EditQuotaFormSchema),
        defaultValues: {
            value: quota ? quota.value : null,
        }
    });

    const paymentsForm = useForm<PaymentOfQuota>({
        resolver: yupResolver(PaymentsOfQuotaSchema),
        defaultValues: {
            value: quota ? quota.value : null,
        }
    });

    const [paymentsOfQuota, setPaymentOfQuota] = useState<PaymentOfQuota[]>([]);

    function handleAddPayment(payment : PaymentOfQuota){
        payment.value = moneyToBackend(payment.value);

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
            quotaSaleData.quota = quota.id

            const response = await api.post('/quota_sales/store', quotaSaleData);

            toast({
                title: "Sucesso",
                description: `A Cota ${quota.group}-${quota.quota} foi cadastrada como vendida.`,
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            //history.push('vendas');

        }catch(error:any) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }

    console.log(formState.errors);

    return(
        <MainBoard sidebar="quotas" header={ <CompanySelectMaster/>}>
            <HStack justifyContent="space-between" align="baseline">
                <Text mb="6" fontWeight="bold" fontSize="lg">Vender a cota</Text>

                {
                    quota && <Text mb="6" fontWeight="bold" fontSize="lg">{quota.group}-{quota.quota}</Text>
                }
            </HStack>

            <Board mb="14">
                {
                        quotaQuery.isLoading ? (
                            <Flex justify="center">
                                <Spinner/>
                            </Flex>
                        ) : ( quotaQuery.isError ? (
                                <Flex justify="center" mt="4" mb="4">
                                    <Text>Erro listar as contas a pagar</Text>
                                </Flex>
                            ) : (quota.data?.length === 0 || quota.error) ? (
                                <Flex justify="center">
                                    <Text>Nenhuma cota encontrada.</Text>
                                </Flex>
                            ) : (
                                quota ? (
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
                                ) : (
                                    <Text>Nenhuma cota encontrada.</Text>
                                )
                            )
                        )
                }
            </Board>

            {
                quota && (
                    <Stack id="quotaSale" as="form" spacing="6" mb="14" onSubmit={handleSubmit(handleCreateNewQuotaSale)}>
                        <HStack spacing="4" align="baseline">
                            <ControlledInput control={control} value={quota.value} name="value" type="text" placeholder="Valor (Entrada)" variant="outline" error={formState.errors.value} focusBorderColor="blue.800"/>
                        
                            <Input register={register} name="sale_date" type="date" placeholder="Data da venda" variant="outline" error={formState.errors.sale_date} focusBorderColor="blue.800"/>
                        
                            <Input register={register} name="buyer" type="text" placeholder="Comprador" variant="outline" mask="money" error={formState.errors.buyer} focusBorderColor="blue.800"/>
                        
                            <Input register={register} name="profit" type="text" placeholder="Lucro" variant="outline" error={formState.errors.profit} focusBorderColor="blue.800"/>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="tax" type="text" placeholder="Taxa" variant="outline" error={formState.errors.tax} focusBorderColor="blue.800"/>

                            <Input register={register} name="cpf_cnpj" type="text" placeholder="CPF/CNPJ" variant="outline" error={formState.errors.cpf_cnpj} focusBorderColor="blue.800"/>

                            <Input register={register} name="seller" type="text" placeholder="Vendedor" variant="outline" error={formState.errors.seller} focusBorderColor="blue.800"/>
                        
                            <Input register={register} name="coordinator" type="text" placeholder="Coordenador" variant="outline" mask="money" error={formState.errors.coordinator} focusBorderColor="blue.800"/>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="passed_value" type="text" placeholder="Valor passado" variant="outline" mask="money" error={formState.errors.passed_value} focusBorderColor="blue.800"/>
                        
                            <Input register={register} name="partner_value" type="text" placeholder="Comissão do Parceiro" variant="outline" mask="money" error={formState.errors.partner_value} focusBorderColor="blue.800"/>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="description" type="text" placeholder="Descrição" variant="outline" mask="money" error={formState.errors.description} focusBorderColor="blue.800"/>
                        </HStack>
                    </Stack>
                )
            }

            <HStack justifyContent="space-between" align="baseline">
                <Text mb="6" fontWeight="bold" fontSize="lg">Pagamentos a receber</Text>
            </HStack>

            <Board background="transparent" border="1px solid" borderColor="gray.300" boxShadow="none">
                {
                    paymentsOfQuota && paymentsOfQuota.map((paymentOfQuota:PaymentOfQuota, index: number) => {
                        return (
                            <Stack key={`${paymentOfQuota.expire}-${paymentOfQuota.value}`} borderBottom="1px solid" borderColor="gray.300" mb="14" spacing="4">
                                <HStack spacing="12" justifyContent="space-between">
                                    <Text fontWeight="bold">{formatBRDate(paymentOfQuota.expire)}</Text>

                                    <Text fontWeight="bold">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(parseFloat(paymentOfQuota.value))}</Text>
                                
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
                            <Input register={paymentsForm.register} name="value" type="text" placeholder="Valor" variant="outline" mask="money" error={paymentsForm.formState.errors.value} focusBorderColor="blue.800"/>
                            
                            <Input register={paymentsForm.register} name="expire" type="date" placeholder="Data da venda" variant="outline" error={paymentsForm.formState.errors.expire} focusBorderColor="blue.800"/>
                        </HStack>

                        <HStack>
                            <Input register={paymentsForm.register} name="observation" type="text" placeholder="Observação" variant="outline" error={paymentsForm.formState.errors.observation} focusBorderColor="blue.800"/>

                            <SolidButton mr="6" color="white" bg="blue.800" colorScheme="blue" type="submit" isLoading={formState.isSubmitting}>
                                Adicionar
                            </SolidButton>
                        </HStack>
                    </Stack>
                </Stack>
            </Board>

            <SolidButton form="quotaSale" mt="14" mr="6" color="white" bg="green.500" colorScheme="green" type="submit" isLoading={formState.isSubmitting}>
                Cadastrar Venda
            </SolidButton>
        </MainBoard>
    )
}