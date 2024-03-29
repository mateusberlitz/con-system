import { QuotaFilterData } from "../../../hooks/useQuotas";

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Flex, Stack, HStack } from "@chakra-ui/react";
import { Input } from "../../../components/Forms/Inputs/Input";
import { Select } from "../../../components/Forms/Selects/Select";
import { OutlineButton } from "../../../components/Buttons/OutlineButton";

interface SearchQuotasProps{
    filter: QuotaFilterData;
    handleSearchQuotas: (filter: QuotaFilterData) => void;
}

const FilterQuotasFormSchema = yup.object().shape({
    search: yup.string(),
    start_date: yup.string(),
    end_date: yup.string(),
    category: yup.string(),
    company: yup.string(),
    contract: yup.string(),
    group: yup.string(),
    quote: yup.string(),
    status: yup.string(),
    pay_to_user: yup.string(),
    sold: yup.string(),
});

export function SearchQuotas({filter, handleSearchQuotas}: SearchQuotasProps){

    const { register, handleSubmit, control, reset, formState} = useForm<QuotaFilterData>({
        resolver: yupResolver(FilterQuotasFormSchema),
    });

    return (
        <Flex as="form" mb="20" onSubmit={handleSubmit(handleSearchQuotas)}>

            <Stack spacing="6" w="100%">
                <HStack spacing="6">
                    <Input register={register} name="search" type="text" placeholder="Procurar" variant="filled" error={formState.errors.search} focusBorderColor="blue.800"/>

                    <Input register={register} name="start_date" type="date" placeholder="Data Inicial" variant="filled" error={formState.errors.start_date} focusBorderColor="blue.800"/>
                    <Input register={register} name="end_date" type="date" placeholder="Data Final" variant="filled" error={formState.errors.end_date} focusBorderColor="blue.800"/>

                    <Select register={register} defaultValue={0} h="45px" name="segment" error={formState.errors.segment} w="100%" maxW="200px" fontSize="sm" focusBorderColor="blue.800" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full">
                        <option value="">Todos</option>
                        <option value="Imóvel">Imóvel</option>
                        <option value="Veículo">Veículo</option>
                    </Select>

                </HStack>

                <HStack spacing="6">
                    <Input register={register} name="group" type="text" placeholder="Grupo" variant="filled" error={formState.errors.group} focusBorderColor="blue.800"/>
                        
                    <Input register={register} name="quote" type="text" placeholder="Cota" variant="filled" error={formState.errors.quote} focusBorderColor="blue.800"/>
                    <Input register={register} name="contemplated_type" type="text" placeholder="Contrato" variant="filled" error={formState.errors.contemplated_type} focusBorderColor="blue.800"/>

                    <Select register={register} defaultValue="false" h="45px" name="sold" error={formState.errors.sold} w="100%" maxW="200px" fontSize="sm" focusBorderColor="blue.800" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full">
                        <option value="">Todos</option>
                        <option value="false">Disponíveis</option>
                        <option value="true">Vendidas</option>
                    </Select>

                    <OutlineButton type="submit" mb="10" color="blue.800" borderColor="blue.800" colorScheme="blue">
                        Filtrar
                    </OutlineButton>
                </HStack>
            </Stack>

        </Flex>
    )
}