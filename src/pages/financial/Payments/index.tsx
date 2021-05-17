import { FormControl, Flex, HStack, Stack, Select, Spinner } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";
import { useCompanies } from "../../../hooks/useCompanies";
import { useProfile } from "../../../hooks/useProfile";
import { useSelectedCompany } from "../../../hooks/useSelectedCompany";
import { Company } from "../../../types";

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { Input } from "../../../components/Forms/Inputs/Input";
import { useErrors } from "../../../hooks/useErrors";


interface FilterPaymentsFormData{
    search: string;
    name: string;
    address: string;
    phone?: string;
    cnpj?: string;
}

const FilterPaymentsFormSchema = yup.object().shape({
    search: yup.string(),
    name: yup.string().required('Nome da Empresa Obrigatório'),
    address: yup.string().required('Endereço Obrigatório'),
    phone: yup.string().min(9, "Existe Telefone com menos de 9 dígitos?"),//51991090700
    cnpj: yup.string().min(12, "Não parece ser um CNPJ correto"),//02.999.999/0001-00
});

export default function Payments(){
    const {profile} = useProfile();
    const companies = useCompanies();
    //const categoriesArray = usePaymentCategories();
    const { showErrors } = useErrors();

    const { register, handleSubmit, reset, formState} = useForm<FilterPaymentsFormData>({
        resolver: yupResolver(FilterPaymentsFormSchema),
    });

    const { companyId, changeCompanyId } = useSelectedCompany();

    function handleChangeCompany(event:any){
        const id = (event?.target.value ? event?.target.value : 1);
        changeCompanyId(id);
    }

    return(
        <MainBoard sidebar="financial" header={ 
            ( profile && profile.role.id == 1) && ( companies.isLoading ? (
                <Flex justify="center">
                    <Spinner/>
                </Flex>
            ) : (
                    <HStack as="form" spacing="10" w="100%" mb="10">
                        <FormControl pos="relative">
                            <Select onChange={handleChangeCompany} h="45px" name="selected_company" w="100%" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Empresa">
                            {companies.data && companies.data.map((company:Company) => {
                                return (
                                    <option key={company.id} value={company.id}>{company.name}</option>
                                )
                            })}
                            </Select>
                        </FormControl>
                    </HStack>
                ))
        }
        >

            <SolidButton  mb="10" color="white" bg="blue.400" icon={PlusIcon} colorScheme="blue">
                Adicionar Pagamento
            </SolidButton>

            <Flex as="form">

                <Stack spacing="6">
                    <HStack spacing="6">
                        <Input register={register} name="search" type="text" placeholder="Procurar" variant="outline" error={formState.errors.search}/>

                        <Input register={register} name="name" type="date" placeholder="Nome da empresa" variant="outline" error={formState.errors.name}/>

                        <Select register={register} h="45px" name="category" w="100%" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Categoria">
                            <option value="1">Comissões</option>
                            <option value="2">Materiais</option>
                            <option value="3">Escritório</option>
                        </Select>
                            
                        <Input register={register} name="name" type="text" placeholder="Nome da empresa" variant="outline" error={formState.errors.name}/>
                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="cnpj" type="text" placeholder="CNPJ da empresa" variant="outline" mask="cnpj" error={formState.errors.cnpj}/>
                            <Input register={register} name="phone" type="text" placeholder="Telefone" variant="outline" mask="phone" error={formState.errors.phone}/>
                        </HStack>
                        <Input register={register} name="address" type="text" placeholder="Endereço" variant="outline" error={formState.errors.address}/>

                    </HStack>
                </Stack>

            </Flex>
            
        </MainBoard>
    );
}