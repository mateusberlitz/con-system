import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useState } from "react";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { MainBoard } from "../../../components/MainBoard";
import { QuotaFilterData, useQuotas } from "../../../hooks/useQuotas";
import { useReadyQuota } from "../../../hooks/useReadyQuota";
import { useReadyQuotas } from "../../../hooks/useReadyQuotas";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { EditQuota } from "./EditQuotaModal";
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
            sold: 'false',
        };
        
        return data;
    });

    function handleChangeFilter(newFilter: QuotaFilterData){
        setFilter(newFilter);
    }

    const [page, setPage] = useState(1);

    const quotas = useReadyQuotas(filter, page);

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
                            <Text>Erro listar as cotas em estoque</Text>
                        </Flex>
                    ) : (quotas.data?.data.length === 0) ? (
                        <Flex justify="center">
                            <Text>Nenhuma cota encontrada.</Text>
                        </Flex>
                    ) : 
                        <QuotasList quotas={quotas.data?.data} refetchQuotas={quotas.refetch} />
                    )
            }
            
        </MainBoard>
    )
}