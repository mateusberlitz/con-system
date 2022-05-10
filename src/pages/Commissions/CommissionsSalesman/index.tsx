import { Stack, Box, useBreakpointValue } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';

import { useHistory } from "react-router-dom";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { OutlineButton } from "../../../components/Buttons/OutlineButton";
import { Input } from "../../../components/Forms/Inputs/Input";
import { Select } from "../../../components/Forms/Selects/Select";
import CommissionsSalesmanTable from "./CommissionsSalesmanTable";

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { useWorkingBranch } from "../../../hooks/useWorkingBranch";
import { CommissionsSellerFilterData, useCommissionsSeller } from "../../../hooks/useCommissionsSeller";
import { HasPermission, useProfile } from "../../../hooks/useProfile";
import { useForm } from "react-hook-form";
import { useState } from "react";
import getMonthName from "../../../utils/Date/getMonthName";
import { NewSaleModal } from "../../Commercial/Sales/NewSaleModal";


const FilterSalesmanCommissionsFormSchema = yup.object().shape({
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

export default function CommissionsSalesman(){
    const history = useHistory();
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();
    const { profile, permissions } = useProfile();
    const isWideVersion = useBreakpointValue({base: false, lg: true});

    const { register, handleSubmit, formState} = useForm<CommissionsSellerFilterData>({
        resolver: yupResolver(FilterSalesmanCommissionsFormSchema),
    });

    const isManager = HasPermission(permissions, 'Comercial Completo') && !HasPermission(permissions, 'Comissões Completo');

    console.log(HasPermission(permissions, 'Comissões Completo'));

    const [filter, setFilter] = useState<CommissionsSellerFilterData>(() => {
        const data: CommissionsSellerFilterData = {
            search: '',
            company: workingCompany.company?.id,
            branch: workingBranch.branch?.id,
            group_by: 'commission_date',
            seller_id: !HasPermission(permissions, 'Comissões Completo') && !isManager ? (profile ? profile.id : 0) : undefined,
            team_id: isManager ? (profile && profile.teams.length > 0 ? profile.teams[0].id : undefined) : undefined
        };

        return data;
    });
    
    const handleSearchCommissionsSeller = async (search : CommissionsSellerFilterData) => {
        setPage(1);
        setFilter({...filter, ...search});
    }

    const [page, setPage] = useState(1);

    const commissionsSeller = useCommissionsSeller(filter, page);

    const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false)

    function OpenNewSaleModal() {
        setIsNewSaleModalOpen(true)
    }
    function CloseNewSaleModal() {
        setIsNewSaleModalOpen(false)
    }

    return(
        <MainBoard sidebar="commissions" header={ <CompanySelectMaster/>}>

            <NewSaleModal isOpen={isNewSaleModalOpen} onRequestClose={CloseNewSaleModal} />

            <Stack flexDirection={["column", "row"]} spacing={["4", "0"]} justify="space-between" mb="10">
                <SolidButton color="white" bg="red.400" icon={PlusIcon} colorScheme="red" onClick={() => OpenNewSaleModal()}>
                    Cadastrar venda
                </SolidButton>
            </Stack>

            <Stack flexDir={["column", "row"]} spacing="6" as="form" mb="20">
                <Box w="100%">
                    <Stack spacing="6" w="100%">
                        <Stack direction={["column", "row"]} spacing="6">
                            <Input register={register} name="search" type="text" error={formState.errors.search} placeholder="Procurar" variant="filled"/>

                            <Input register={register} name="start_date" type="date" error={formState.errors.start_date} placeholder="Data Inicial" variant="filled"/>
                            <Input register={register} name="end_date" type="date" error={formState.errors.end_date} placeholder="Data Final" variant="filled"/>

                            <Select register={register} h="45px" name="category" w="100%" maxW="200px" error={formState.errors.is_chargeback} fontSize="sm" focusBorderColor="blue.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Estorno">
                                <option value="">Status</option>
                                <option value={0}>Pendente</option>
                                <option value={1}>Confirmada</option>
                            </Select>
                        </Stack>

                        <Stack direction={["column", "row"]} spacing="6">
                            <Input name="group" type="text" placeholder="Grupo" variant="filled"/>

                            <Input name="quote" type="text" placeholder="Cota" variant="filled"/>

                            <Input name="contract" type="text" placeholder="Contrato" variant="filled"/>

                            <Input name="parcela" type="text" placeholder="Parcela" variant="filled"/>

                            <Select defaultValue={0} h="45px" name="pendency" w="100%" maxW="200px" fontSize="sm" focusBorderColor="blue.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full">
                                <option value="">Status</option>
                                <option value={1}>Pendente</option>
                                <option value={0}>Confirmada</option>
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
                    (!commissionsSeller.isLoading && !commissionsSeller.error) && Object.keys(commissionsSeller.data?.data.data).map((monthYear:string) => {
                        const monthNumber = parseInt(monthYear.split('-')[0]);
                        return (
                            <CommissionsSalesmanTable key={monthYear} monthName={getMonthName(monthNumber)} commissionsSeller={commissionsSeller.data?.data.data[monthYear]}/>
                        )
                    })
                }
            </Stack>

        </MainBoard>
    );
}