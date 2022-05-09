import { Stack, Box } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';

import { useHistory } from "react-router-dom";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { OutlineButton } from "../../../components/Buttons/OutlineButton";
import { Input } from "../../../components/Forms/Inputs/Input";
import { Select } from "../../../components/Forms/Selects/Select";
import CommissionsCompany from "./CommissionsCompany";
import { CompanyCommissionsFilterData, useCompanyCommissions } from "../../../hooks/useCompanyCommissions";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { useWorkingBranch } from "../../../hooks/useWorkingBranch";
import { useState } from "react";
import getMonthName from "../../../utils/Date/getMonthName";
import { useForm } from "react-hook-form";

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Pagination } from "../../../components/Pagination";
import { NewSaleModal } from "../../Commercial/Sales/NewSaleModal";

const FilterCompanyCommissionsFormSchema = yup.object().shape({
    search: yup.string(),
    start_date: yup.string(),
    end_date: yup.string(),
    is_chargeback: yup.string(),
    contract: yup.string(),
    group: yup.string(),
    quote: yup.string(),
    confirmed: yup.string(),
    contract_number: yup.string(),
    parcel_number: yup.string(),
});

export default function Company(){
    const history = useHistory();
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();

    const { register, handleSubmit, formState} = useForm<CompanyCommissionsFilterData>({
        resolver: yupResolver(FilterCompanyCommissionsFormSchema),
    });

    const [filter, setFilter] = useState<CompanyCommissionsFilterData>(() => {
        const data: CompanyCommissionsFilterData = {
            search: '',
            company: workingCompany.company?.id,
            branch: workingBranch.branch?.id,
            group_by: 'commission_date',
        };
        
        return data;
    })

    const handleSearchCompanyCommissions = async (search : CompanyCommissionsFilterData) => {
        setPage(1);
        setFilter({...filter, ...search});
    }

    const [page, setPage] = useState(1);

    const companyCommissions = useCompanyCommissions(filter, page);

    const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false)

    function OpenNewSaleModal() {
        setIsNewSaleModalOpen(true)
    }
    function CloseNewSaleModal() {
        setIsNewSaleModalOpen(false)
    }

    return(
        <MainBoard sidebar="commissions" header={<CompanySelectMaster/>}>

            <NewSaleModal isOpen={isNewSaleModalOpen} onRequestClose={CloseNewSaleModal} />

            <Stack flexDirection={["column", "row"]} spacing={["4", "0"]} justify="space-between" mb="10">
                <SolidButton color="white" bg="red.400" icon={PlusIcon} colorScheme="red" onClick={() => OpenNewSaleModal()}>
                    Cadastrar venda
                </SolidButton>
            </Stack>

            <Stack flexDir={["column", "row"]} spacing="6" as="form" mb="20" onSubmit={handleSubmit(handleSearchCompanyCommissions)}>
                <Box w="100%">
                    <Stack spacing="6" w="100%">
                        <Stack direction={["column", "row"]} spacing="6">
                            <Input register={register} name="search" type="text" error={formState.errors.search} placeholder="Procurar" variant="filled"/>

                            <Input register={register} name="start_date" type="date" error={formState.errors.start_date} placeholder="Data Inicial" variant="filled"/>
                            <Input register={register} name="end_date" type="date" error={formState.errors.end_date} placeholder="Data Final" variant="filled"/>

                            <Select register={register} h="45px" name="is_chargeback" w="100%" maxW="200px" error={formState.errors.is_chargeback} fontSize="sm" focusBorderColor="blue.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full">
                                <option value="">Estorno</option>
                                <option value={1}>Sim</option>
                                <option value={0}>Não</option>
                            </Select>
                        </Stack>

                        <Stack direction={["column", "row"]} spacing="6">
                            <Input register={register} name="group" type="text" placeholder="Grupo" variant="filled" error={formState.errors.group}/>

                            <Input register={register} name="quote" type="text" placeholder="Cota" variant="filled" error={formState.errors.quota}/>

                            <Input register={register} name="contract_number" type="text" placeholder="Contrato" variant="filled" error={formState.errors.contract_number}/>

                            <Input register={register} name="parcel_number" type="text" placeholder="Parcela" variant="filled" error={formState.errors.parcel_number}/>

                            <Select defaultValue={0} h="45px" register={register} name="confirmed" error={formState.errors.confirmed}  w="100%" maxW="200px" fontSize="sm" focusBorderColor="blue.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full">
                                <option value="">Status</option>
                                <option value={0}>Pendente</option>
                                <option value={1}>Confirmada</option>
                            </Select>

                            <OutlineButton type="submit" mb="10" color="red.400" borderColor="red.400" colorScheme="blue">
                                Filtrar
                            </OutlineButton>
                        </Stack>
                    </Stack>
                </Box>

            </Stack>

            <Stack fontSize="13px" spacing="12">
                {
                    (!companyCommissions.isLoading && !companyCommissions.error) && Object.keys(companyCommissions.data?.data.data).map((monthYear:string) => {
                        const monthNumber = parseInt(monthYear.split('-')[0]);
                        return (
                            <CommissionsCompany key={monthYear} monthName={getMonthName(monthNumber)} companyCommissions={companyCommissions.data?.data.data[monthYear]}/>
                        )
                    })
                }

                {/* <Pagination registerPerPage={50} currentPage={page} onPageChange={setPage}/> */}
            </Stack>

        </MainBoard>
    );
}