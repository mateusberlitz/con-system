import { Flex, Text, HStack, FormControl, Select as ChakraSelect, ChakraProps } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useBranches } from "../../hooks/useBranches";
import { useProfile } from "../../hooks/useProfile";
import { useWorkingBranch } from "../../hooks/useWorkingBranch";
import { useWorkingCompany } from "../../hooks/useWorkingCompany";
import { Branch } from "../../types";

export interface filter{
    filterData: any;
    setFilter: (newFilterValue: any) => void;
}

// interface BranchSelectProps extends ChakraProps{
//     searchFilter?: PaymentFilterData | CashFlowsFilterData | BillFilterData;
//     setFilter?: (newFilterValue: any) => void;
// }

interface BranchSelectProps extends ChakraProps{
    filters?: filter[];
}

export function BranchSelect({filters, ...rest}: BranchSelectProps){
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();

    const [companyId, setCompanyId] = useState<number | undefined>((): number | undefined => {
        return workingCompany.company?.id;
    })

    const branches = useBranches({
        company: companyId
    });

    //console.log(branches, workingCompany);

    const {profile} = useProfile();

    function handleChangeBranch(event:any){
        //console.log(event.target.value);

        if(event.target.value === ''){
            workingBranch.changeBranch(event.target.value);

            if(filters){
                filters.map((filter) => {
                    const updatedFilter = filter.filterData;
                    updatedFilter.company = event.target.value;

                    filter.setFilter(updatedFilter);
                })
            }

        }else{
            const selectedBranchId = (event?.target.value ? event?.target.value : 1);
            const selectedBranchData = branches.data?.data.filter((branch:Branch) => Number(branch.id) === Number(selectedBranchId))[0]
            workingBranch.changeBranch(selectedBranchData);

            if(filters){
                filters.map((filter) => {
                    const updatedFilter = filter.filterData;
                    updatedFilter.branch = selectedBranchId;

                    filter.setFilter(updatedFilter);
                })
            }
        }
    }

    useEffect(() => {
        setCompanyId(workingCompany.company?.id);
    }, [workingCompany])

    //const branches = ;

    return (
    ( !profile || !profile.branches ? (
        <Flex justify="center">
            <Text>Nenhuma filial disponível</Text>
        </Flex>
    ) : (
            <HStack as="form" spacing="10" w="100%" mb="10" {...rest}>
                <FormControl pos="relative">
                    <ChakraSelect onChange={handleChangeBranch} defaultValue={workingBranch.branch?.id} h="45px" name="selected_branch" w="100%" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full">
                    {profile.role.name === "Diretor" && <option value="">Todas as filiais</option>}

                    {profile.branches && profile.branches.map((branch:Branch) => {
                        return (
                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                        )
                    })}
                    </ChakraSelect>
                </FormControl>
            </HStack>
        ))
    )
}