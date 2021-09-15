import { ChakraProps } from "@chakra-ui/system";
import { CompanySelect } from ".";
import { BillFilterData } from "../../hooks/useBills";
import { CashFlowsFilterData } from "../../hooks/useCashFlows";
import { PaymentFilterData } from "../../hooks/usePayments";
import { HasPermission, useProfile } from "../../hooks/useProfile";

interface CompanySelectMasterProps{
    filter?: PaymentFilterData | CashFlowsFilterData | BillFilterData;
    setFilter?: (newFilterValue: any) => void;
}

export function CompanySelectMaster({filter, setFilter, ...rest}: CompanySelectMasterProps){
    const {permissions, profile} = useProfile();

    return ( (permissions && HasPermission(permissions, 'Todas Empresas')) || (profile && profile.companies && profile.companies.length > 1)) ? (
        <CompanySelect searchFilter={filter} setFilter={setFilter}/>
    )
    :(
        <>
        </>
    )

}