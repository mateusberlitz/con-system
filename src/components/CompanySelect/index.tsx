import { StackProps } from "@chakra-ui/core";
import { Flex, Text, Spinner, HStack, FormControl, Select as ChakraSelect, ChakraProps, HTMLChakraProps } from "@chakra-ui/react";
import { BillFilterData } from "../../hooks/useBills";
import { CashFlowsFilterData } from "../../hooks/useCashFlows";
import { useCompanies } from "../../hooks/useCompanies";
import { PaymentFilterData } from "../../hooks/usePayments";
import { useProfile } from "../../hooks/useProfile";
import { useWorkingCompany } from "../../hooks/useWorkingCompany";
import { Company } from "../../types";

interface CompanySelectProps extends ChakraProps{
    searchFilter?: PaymentFilterData | CashFlowsFilterData | BillFilterData;
    setFilter?: (newFilterValue: any) => void;
}

export function CompanySelect({searchFilter, setFilter, ...rest}: CompanySelectProps){
    const workingCompany = useWorkingCompany();

    const companies = useCompanies();
    const {profile} = useProfile();

    function handleChangeCompany(event:any){
        const selectedCompanyId = (event?.target.value ? event?.target.value : 1);
        const selectedCompanyData = companies.data.filter((company:Company) => Number(company.id) === Number(selectedCompanyId))[0]
        workingCompany.changeCompany(selectedCompanyData);

        if(searchFilter && setFilter){
            const updatedFilter = searchFilter;
            updatedFilter.company = selectedCompanyId;

            setFilter(updatedFilter);
        }
    }

    return (
    ( !profile || !profile.companies ? (
        <Flex justify="center">
            <Text>Nenhuma empresa disponível</Text>
        </Flex>
    ) : (
            <HStack as="form" spacing="10" w="100%" mb="10" {...rest}>
                <FormControl pos="relative">
                    <ChakraSelect onChange={handleChangeCompany} defaultValue={workingCompany.company?.id} h="45px" name="selected_company" w="100%" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full">
                    {profile.companies && profile.companies.map((company:Company) => {
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