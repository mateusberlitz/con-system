import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useState } from "react";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { MainBoard } from "../../../components/MainBoard";
import { QuotaFilterData, useQuotas } from "../../../hooks/useQuotas";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { StockNavBar } from "./NavBar";
import { NewQuotaModal } from "./NewQuotaModal";
import { QuotasList } from "./QuotasList";
import { SearchQuotas } from "./SearchQuotas";

export default function Quotas(){
    const workingCompany = useWorkingCompany();

    const [filter, setFilter] = useState<QuotaFilterData>(() => {
        const data: QuotaFilterData = {
            search: '',
            company: workingCompany.company?.id,
            status: 0,
        };
        
        return data;
    });

    function handleChangeFilter(newFilter: QuotaFilterData){
        setFilter(newFilter);
    }

    const [page, setPage] = useState(1);

    const quotas = useQuotas(filter, page);

    const [isNewQuotaModalOpen, setIsNewQuotaModalOpen] = useState(false);

    function OpenNewQuotaModal(){
        setIsNewQuotaModalOpen(true);
    }
    function CloseNewQuotaModal(){
        setIsNewQuotaModalOpen(false);
    }

    return (
        <MainBoard sidebar="quotas" header={ <CompanySelectMaster/>}
        >
            <StockNavBar OpenNewQuotaModal={OpenNewQuotaModal} />

            <NewQuotaModal afterCreate={quotas.refetch} isOpen={isNewQuotaModalOpen} onRequestClose={CloseNewQuotaModal}/>

            <SearchQuotas filter={filter} handleSearchQuotas={handleChangeFilter} />

            {
                    quotas.isLoading ? (
                        <Flex justify="center">
                            <Spinner/>
                        </Flex>
                    ) : ( quotas.isError ? (
                        <Flex justify="center" mt="4" mb="4">
                            <Text>Erro listar as contas a pagar</Text>
                        </Flex>
                    ) : (quotas.data?.data.length === 0) ? (
                        <Flex justify="center">
                            <Text>Nenhuma cota encontrada.</Text>
                        </Flex>
                    ) : 
                        <QuotasList quotas={quotas.data?.data} />
                    )
            }
            
        </MainBoard>
    )
}