import { ChakraProps } from "@chakra-ui/system";
import { CompanySelect, filter } from ".";
import { BillFilterData } from "../../hooks/useBills";
import { CashFlowsFilterData } from "../../hooks/useCashFlows";
import { PaymentFilterData } from "../../hooks/usePayments";
import { HasPermission, useProfile } from "../../hooks/useProfile";

interface CompanySelectMasterProps{
    filters?: filter[];
}

export function CompanySelectMaster({filters, ...rest}: CompanySelectMasterProps){
    const {permissions, profile} = useProfile();

    return ( (permissions && HasPermission(permissions, 'Todas Empresas')) || (profile && profile.companies && profile.companies.length > 1)) ? (
        <CompanySelect filters={filters}/>
    )
    :(
        <>
        </>
    )

}