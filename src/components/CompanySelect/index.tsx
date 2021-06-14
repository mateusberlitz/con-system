import { Flex, Spinner, HStack, FormControl, Select as ChakraSelect } from "@chakra-ui/react";
import { BillFilterData } from "../../hooks/useBills";
import { CashFlowsFilterData } from "../../hooks/useCashFlows";
import { useCompanies } from "../../hooks/useCompanies";
import { PaymentFilterData } from "../../hooks/usePayments";
import { useProfile } from "../../hooks/useProfile";
import { useWorkingCompany } from "../../hooks/useWorkingCompany";
import { Company } from "../../types";

interface CompanySelectProps{
    filter?: PaymentFilterData | CashFlowsFilterData | BillFilterData;
    setFilter?: (newFilterValue: any) => void;
}

export function CompanySelect({filter, setFilter}: CompanySelectProps){
    const workingCompany = useWorkingCompany();

    const companies = useCompanies();

    function handleChangeCompany(event:any){
        const selectedCompanyId = (event?.target.value ? event?.target.value : 1);
        const selectedCompanyData = companies.data.filter((company:Company) => Number(company.id) === Number(selectedCompanyId))[0]
        workingCompany.changeCompany(selectedCompanyData);

        if(filter && setFilter){
            const updatedFilter = filter;
            updatedFilter.company = selectedCompanyId;

            setFilter(updatedFilter);
        }
    }

    return (
    ( companies.isLoading ? (
        <Flex justify="center">
            <Spinner/>
        </Flex>
    ) : (
            <HStack as="form" spacing="10" w="100%" mb="10">
                <FormControl pos="relative">
                    <ChakraSelect onChange={handleChangeCompany} defaultValue={workingCompany.company?.id} h="45px" name="selected_company" w="100%" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Empresa">
                    {companies.data && companies.data.map((company:Company) => {
                        return (
                            <option key={company.id} value={company.id}>{company.name}</option>
                        )
                    })}
                    </ChakraSelect>
                </FormControl>
            </HStack>
        ))
    )
}