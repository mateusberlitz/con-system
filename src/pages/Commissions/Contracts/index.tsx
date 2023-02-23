import { Stack, Box, Link, useBreakpointValue } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';

import { useHistory } from "react-router-dom";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { OutlineButton } from "../../../components/Buttons/OutlineButton";
import { Input } from "../../../components/Forms/Inputs/Input";
import { Select } from "../../../components/Forms/Selects/Select";

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { useWorkingBranch } from "../../../hooks/useWorkingBranch";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import getMonthName from "../../../utils/Date/getMonthName";
import CommissionsContracts from "./CommissionsContracts";
import { CommissionsContractFilterData, useCommissionsContract } from "../../../hooks/useCommissionsContract";
import { NewSaleModal } from "../../Commercial/Sales/NewSaleModal";
import { HasPermission, useProfile } from "../../../hooks/useProfile";
import { EditSaleModal } from "../../Commercial/Sales/EditSaleModal";
import { EditQuotaFormData, EditQuotaModal } from "./EditQuotaModal";
import { ConfirmSaleRemoveModal, RemoveSaleData } from "./ConfirmContractRemoveModal";
import { UserFilterData, useUsers } from "../../../hooks/useUsers";
import { ReactSelect, SelectOption } from "../../../components/Forms/ReactSelect";
import { User } from "../../../types";
import { getReactSelectStyles } from "../../../styles/solidReactSelectStyles";


const FilterCommissionsContractFormSchema = yup.object().shape({
    search: yup.string(),
    start_date: yup.string(),
    end_date: yup.string(),
    is_chargeback: yup.string(),
    contract: yup.string(),
    group: yup.string(),
    quote: yup.string(),
    active: yup.string(),
    number_contract: yup.string(),
    parcel_number: yup.string(),
    seller_id: yup.number().transform((v, o) => (o === '' ? null : v)).nullable(),
});

export default function CommissionsSalesman(){
    const history = useHistory();
    const { profile, permissions } = useProfile();
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();
    const isWideVersion = useBreakpointValue({base: false, lg: true});

    const { register, handleSubmit, formState, control} = useForm<CommissionsContractFilterData>({
        resolver: yupResolver(FilterCommissionsContractFormSchema),
    });

    const isManager = HasPermission(permissions, 'Comercial Completo');

    const [filter, setFilter] = useState<CommissionsContractFilterData>(() => {
        const data: CommissionsContractFilterData = {
            search: '',
            company_id: workingCompany.company?.id,
            branch_id: workingBranch.branch?.id,
            seller_id: !HasPermission(permissions, 'Comissões Completo') && !isManager ? (profile ? profile.id : 0) : undefined,
            team_id: isManager ? (profile && profile.teams.length > 0 ? profile.teams[0].id : undefined) : undefined
        };

        return data;
    })

    
    const handleSearchCommissionsContracts = async (search : CommissionsContractFilterData) => {
        setPage(1);
        setFilter({...filter, ...search});
    }

    const [page, setPage] = useState(1);

    const commissionsContract = useCommissionsContract(filter, page);

    const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false)

    function OpenNewSaleModal() {
        setIsNewSaleModalOpen(true)
    }
    function CloseNewSaleModal() {
        setIsNewSaleModalOpen(false)
    }

    const [isEditQuotaModalOpen, setIsEditQuotaModalOpen] = useState(false);
    const [editQuotaFormData, setEditQuotaFormData] = useState<EditQuotaFormData>(
        () => {
          const data: EditQuotaFormData = {
            id: 0,
            credit: '',
            group: '',
            quota: '',
            date_sale: '',
            consortium_type_id: ''
          }
    
          return data
        }
      )

    function OpenEditQuotaModal(quotaFormData:EditQuotaFormData) {
        setIsEditQuotaModalOpen(true)
        setEditQuotaFormData(quotaFormData)
    }
    function CloseEditQuotaModal() {
        setIsEditQuotaModalOpen(false)
    }

    const [isRemoveQuotaModalOpen, setIsRemoveQuotaModalOpen] = useState(false);
    const [removeQuotaFormData, setRemoveQuotaFormData] = useState<RemoveSaleData>(
        () => {
          const data: RemoveSaleData = {
            id: 0,
            group: '',
            quota: '',
          }
    
          return data
        }
      )

    function OpenRemoveQuotaModal(quotaFormData:RemoveSaleData) {
        setIsRemoveQuotaModalOpen(true)
        setRemoveQuotaFormData(quotaFormData)
    }
    function CloseRemoveQuotaModal() {
        setIsRemoveQuotaModalOpen(false)
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
        <MainBoard sidebar="commissions" header={ <CompanySelectMaster/>}>

            <NewSaleModal isOpen={isNewSaleModalOpen} onRequestClose={CloseNewSaleModal} />
            <EditQuotaModal toEditQuotaData={editQuotaFormData} afterEdit={commissionsContract.refetch} isOpen={isEditQuotaModalOpen} onRequestClose={CloseEditQuotaModal} />
            <ConfirmSaleRemoveModal toRemoveSaleData={removeQuotaFormData} afterRemove={commissionsContract.refetch} isOpen={isRemoveQuotaModalOpen} onRequestClose={CloseRemoveQuotaModal} />

            <Stack flexDirection={["column", "row"]} spacing={["4", "0"]} justify="space-between" mb="10">
                <SolidButton color="white" bg="red.400" icon={PlusIcon} colorScheme="red" onClick={() => OpenNewSaleModal()}>
                    Cadastrar venda
                </SolidButton>

                {/* <Link href="/contracts/logs">
                    Contratos não cadastrados
                </Link> */}
                <OutlineButton h={!isWideVersion ? "36px" : "45px"} px={!isWideVersion ? "6" : "8"} onClick={() => {history.push("/contracts/logs")}}>
                    Contratos não cadastrados
                </OutlineButton>
            </Stack>

            <Stack flexDir={["column", "row"]} spacing="6" as="form" mb="20" onSubmit={handleSubmit(handleSearchCommissionsContracts)}>
                <Box w="100%">
                    <Stack spacing="6" w="100%">
                        <Stack direction={["column", "row"]} spacing="6">
                            {
                                //(profile && profile.role.id === 1) && (
                                    <ReactSelect isRequired={false} control={control} options={sellerOptions} styles={solidReactSelectStyles} placeholder={"Selecionar Vendedor"} name="seller_id" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } borderRadius="full"/>
                                //)
                            }
                            {/* <Input register={register} name="search" type="text" error={formState.errors.search} placeholder="Procurar" variant="filled" focusBorderColor="red.400"/> */}

                            <Input register={register} name="start_date" type="date" error={formState.errors.start_date} placeholder="Data Inicial" variant="filled" focusBorderColor="red.400"/>
                            <Input register={register} name="end_date" type="date" error={formState.errors.end_date} placeholder="Data Final" variant="filled" focusBorderColor="red.400"/>

                            <Select register={register} h="45px" name="is_chargeback" w="100%" maxW="200px" error={formState.errors.is_chargeback} fontSize="sm" focusBorderColor="red.400" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Selecionar Estorno">
                                <option value={0}>Ativa</option>
                                <option value={1}>Estorno</option>
                            </Select>
                        </Stack>

                        <Stack direction={["column", "row"]} spacing="6">
                            <Input register={register} name="group" type="text" placeholder="Grupo" variant="filled" focusBorderColor="red.400" error={formState.errors.group}/>

                            <Input register={register} name="quote" type="text" placeholder="Cota" variant="filled" focusBorderColor="red.400" error={formState.errors.quote}/>

                            <Input register={register} name="number_contract" type="text" placeholder="Contrato" variant="filled" focusBorderColor="red.400" error={formState.errors.number_contract}/>

                            {/* <Input register={register} name="parcel_number" type="text" placeholder="Parcela" variant="filled" focusBorderColor="red.400" error={formState.errors.parcel_number}/> */}

                            <Select register={register} defaultValue={""} h="45px" name="active" w="100%" maxW="200px" fontSize="sm" focusBorderColor="red.400" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Selecionar Status" error={formState.errors.active}>
                                <option value={0}>Pendente</option>
                                <option value={1}>Confirmado</option>
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
                    (!commissionsContract.isLoading && !commissionsContract.error) && (
                        <CommissionsContracts commissionsContract={commissionsContract.data?.data.data} OpenEditQuotaModal={OpenEditQuotaModal} OpenRemoveQuotaModal={OpenRemoveQuotaModal}/>
                    )
                }
            </Stack>

        </MainBoard>
    );
}