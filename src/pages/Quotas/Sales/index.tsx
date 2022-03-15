import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { MainBoard } from "../../../components/MainBoard";
import { QuotaFilterData, useQuotas } from "../../../hooks/useQuotas";
import { useQuotaSales } from "../../../hooks/useQuotaSales";
import { useWorkingBranch } from "../../../hooks/useWorkingBranch";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { SalesNavBar } from "./NavBar";
import { SalesList } from "./SalesList";
import { SearchSales } from "./SearchSales";

export default function Sales(){
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();


    const [filter, setFilter] = useState<QuotaFilterData>(() => {
        const data: QuotaFilterData = {
            search: '',
            company: workingCompany.company?.id,
            branch: workingBranch.branch?.id,
            status: 0,
        };
        
        return data;
    });

    function handleChangeFilter(newFilter: QuotaFilterData){
        setFilter(newFilter);
    }

    const [page, setPage] = useState(1);

    const quotaSales = useQuotaSales(filter, page);

    const [isNewQuotaModalOpen, setIsNewQuotaModalOpen] = useState(false);

    function OpenNewQuotaModal(){
        setIsNewQuotaModalOpen(true);
    }
    function CloseNewQuotaModal(){
        setIsNewQuotaModalOpen(false);
    }

    useEffect(() => {
        setFilter({...filter, company: workingCompany.company?.id, branch: workingBranch.branch?.id});
    }, [workingCompany, workingBranch]);

    return (
        <MainBoard sidebar="quotas" header={ <CompanySelectMaster filters={[{filterData: filter, setFilter: handleChangeFilter}]}/>}
        >
            <SalesNavBar OpenNewSaleModal={OpenNewQuotaModal} />

            {/* <NewQuotaModal afterCreate={quotas.refetch} isOpen={isNewQuotaModalOpen} onRequestClose={CloseNewQuotaModal}/> */}

            <SearchSales filter={filter} handleSearchQuotas={handleChangeFilter} />

            {
                    quotaSales.isLoading ? (
                        <Flex justify="center">
                            <Spinner/>
                        </Flex>
                    ) : ( quotaSales.isError ? (
                        <Flex justify="center" mt="4" mb="4">
                            <Text>Erro listar as contas a pagar</Text>
                        </Flex>
                    ) : (quotaSales.data?.data.length === 0) ? (
                        <Flex justify="center">
                            <Text>Nenhuma cota encontrada.</Text>
                        </Flex>
                    ) : 
                        <SalesList quotaSales={quotaSales.data?.data} refetchQuotaSales={quotaSales.refetch} />
                    )
            }
            
        </MainBoard>
    )
}