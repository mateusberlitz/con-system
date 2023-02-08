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
import { useEffect, useState } from "react";
import getMonthName from "../../../utils/Date/getMonthName";
import { useForm } from "react-hook-form";

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Pagination } from "../../../components/Pagination";
import { NewSaleModal } from "../../Commercial/Sales/NewSaleModal";
import { ReactSelect, SelectOption } from "../../../components/Forms/ReactSelect";
import { UserFilterData, useUsers } from "../../../hooks/useUsers";
import { User } from "../../../types";
import { getReactSelectStyles } from "../../../styles/solidReactSelectStyles";

const FilterCompanyCommissionsFormSchema = yup.object().shape({
    search: yup.string(),
    start_date: yup.string(),
    end_date: yup.string(),
    is_chargeback: yup.string(),
    contract: yup.string(),
    group: yup.string(),
    quote: yup.string(),
    confirmed: yup.string(),
    number_contract: yup.string(),
    parcel_number: yup.string(),
    seller_id: yup.string(),
});

export default function Company(){
    const history = useHistory();
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();

    const { register, handleSubmit, formState, control} = useForm<CompanyCommissionsFilterData>({
        resolver: yupResolver(FilterCompanyCommissionsFormSchema),
    });

    const [filter, setFilter] = useState<CompanyCommissionsFilterData>(() => {
        const data: CompanyCommissionsFilterData = {
            search: '',
            company_id: workingCompany.company?.id,
            branch_id: workingBranch.branch?.id,
            group_by: 'commission_date',
            confirmed: true
        };
        
        return data;
    })

    const handleSearchCompanyCommissions = async (search : CompanyCommissionsFilterData) => {
        console.log(search);
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

    useEffect(() => {
        setFilter({...filter, company_id: workingCompany.company?.id, branch_id: workingBranch.branch?.id});
    }, [workingCompany, workingBranch]);

    const [usersFilter, setUsersFilter] = useState<UserFilterData>(() => {
        const data: UserFilterData = {
          search: '',
          company: workingCompany.company?.id,
          //role: 5
        }
    
        return data
      })
    
      const usersQuery = useUsers(usersFilter)
    
      const sellerOptions: SelectOption[] = [
        {
          value: '',
          label: 'Selecionar Vendedor'
        }
      ]

    usersQuery.data &&
    usersQuery.data.map((user: User) => {
        sellerOptions.push({ value: user.id.toString(), label: `${user.name} ${user.last_name}` })
    })

    const solidReactSelectStyles = getReactSelectStyles({primaryColor: "#c30052"});

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
                            {/* <Input register={register} name="search" type="text" error={formState.errors.search} placeholder="Procurar" variant="filled" focusBorderColor="red.400"/> */}
                            <ReactSelect control={control} options={sellerOptions} styles={solidReactSelectStyles} placeholder={"Selecionar Vendedor"} name="seller_id" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } borderRadius="full"/>

                            <Input register={register} name="start_date" type="date" error={formState.errors.start_date} placeholder="Data Inicial" variant="filled" focusBorderColor="red.400"/>
                            <Input register={register} name="end_date" type="date" error={formState.errors.end_date} placeholder="Data Final" variant="filled" focusBorderColor="red.400"/>

                            <Select register={register} h="45px" name="is_chargeback" w="100%" maxW="200px" error={formState.errors.is_chargeback} fontSize="sm" focusBorderColor="red.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full">
                                <option value="">Selecionar estorno</option>
                                <option value={1}>É estorno</option>
                                <option value={0}>Não é estorno</option>
                            </Select>
                        </Stack>

                        <Stack direction={["column", "row"]} spacing="6">
                            <Input register={register} name="group" type="text" placeholder="Grupo" variant="filled" error={formState.errors.group} focusBorderColor="red.400"/>

                            <Input register={register} name="quote" type="text" placeholder="Cota" variant="filled" error={formState.errors.quota} focusBorderColor="red.400"/>

                            <Input register={register} name="number_contract" type="text" placeholder="Contrato" variant="filled" error={formState.errors.number_contract} focusBorderColor="red.400"/>

                            <Input register={register} name="parcel_number" type="text" placeholder="Parcela" variant="filled" error={formState.errors.parcel_number} focusBorderColor="red.400"/>

                            <Select defaultValue={1} h="45px" register={register} name="confirmed" error={formState.errors.confirmed}  w="100%" maxW="200px" fontSize="sm" focusBorderColor="red.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full">
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