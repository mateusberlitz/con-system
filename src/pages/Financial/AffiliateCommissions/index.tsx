import { Divider, FormControl, HStack, Select as ChakraSelect, Text, Th, Tr } from "@chakra-ui/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Board } from "../../../components/Board";
import { Table } from "../../../components/Table";
import { BranchesFilterData, useBranches } from "../../../hooks/useBranches";
import { useProfile } from "../../../hooks/useProfile";
import { useWorkingBranch } from "../../../hooks/useWorkingBranch";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { Branch, CompanyCommission, SellerCommission } from "../../../types";

interface AffiliateCommissionsProps{
    startDate?: string;
    endDate?: string;
}

export default function AffiliateCommissions({startDate, endDate}: AffiliateCommissionsProps) {
    const { permissions, profile } = useProfile();
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();

    const history = useHistory();

    const [filter, setFilter] = useState<BranchesFilterData>(() => {
        const data: BranchesFilterData = {
            company: workingCompany.company?.id,
            start_date: startDate,
            end_date: endDate,
            commissions: 'true',
        };
    
        return data;
    })

    const branches = useBranches(filter);

    console.log(branches);

    return (
            <Board m="0" h={320}>
                <HStack as="form" spacing="12" w="100%" mb="6" justifyContent="left">
                    <Text fontWeight="500" w="100%" fontSize="xl">Comissões de filiais</Text>

                    {/* <FormControl display="flex" justifyContent="flex-end" minW="150px">
                        <ChakraSelect defaultValue={workingCompany.company?.id} h="45px" mr={4} name="selected_company" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={{ bgColor: 'gray.500' }} size="lg" borderRadius="full">
                            {
                                years.map((year: Number) => {
                                    return (
                                        <option key={year.toString()} value={year.toString()}>{year}</option>
                                    )
                                })
                            }
                        </ChakraSelect>
                        <ChakraSelect defaultValue={workingCompany.company?.id} mr={4} h="45px" name="selected_company" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={{ bgColor: 'gray.500' }} size="lg" borderRadius="full">
                            {
                                years.map((year: Number) => {
                                    return (
                                        <option key={year.toString()} value={year.toString()}>{year}</option>
                                    )
                                })
                            }
                        </ChakraSelect>
                    </FormControl> */}
                </HStack>

                <Divider mb="4" />
                    <Table header={[
                            { text: 'Filial' },
                            { text: 'Contratos' },
                            { text: 'Comissões Recebidas' },
                            { text: 'Comissões Pagas' },
                            { text: 'total' }
                        ]}>
                            {
                                branches.data?.data && branches.data?.data.map((branch: Branch, position:number) => {
                                    const receivedCommissionsAmount = branch.received_commissions.reduce((sumAmount:number, commission:CompanyCommission) => {
                                        return sumAmount + commission.value
                                    }, 0);

                                    const quotasCount = branch.quotas.reduce((sumAmount:number) => {
                                        return sumAmount + 1
                                    }, 0);

                                    const paidCommissionsAmount = 0;
                                    // const paidCommissionsAmount = branch.paid_commissions.reduce((sumAmount:number, commission:SellerCommission) => {
                                    //     return sumAmount + commission.value
                                    // }, 0);

                                    const totalAmount = receivedCommissionsAmount - paidCommissionsAmount;

                                    return(
                                        <Tr>
                                            <Th color="black" fontSize="12px" position="sticky" left="0">{position + 1}. {branch.name}</Th>
                                            <Th color="gray.600">{quotasCount}</Th>
                                            <Th color="gray.600">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(receivedCommissionsAmount)}</Th>
                                            <Th color="gray.600">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(paidCommissionsAmount)}</Th>
                                            <Th color="gray.800">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(totalAmount)}</Th>
                                        </Tr>
                                    )
                                })
                            }
                        {/* <Tr>
                            <Th color="black" fontSize="12px" position="sticky" left="0">1.Novo Hamburgo 1</Th>
                            <Th color="gray.600">7</Th>
                            <Th color="gray.600">R$210.000,00</Th>
                            <Th color="gray.600">R$60.000,00</Th>
                            <Th></Th>
                        </Tr>
                        <Tr>
                            <Th color="black" fontSize="12px" position="sticky" left="0">2.Novo Hamburgo 2</Th>
                            <Th color="gray.600">1</Th>
                            <Th color="gray.600">R$210.000,00</Th>
                            <Th color="gray.600">R$60.000,00</Th>
                            <Th></Th>
                        </Tr>
                        <Tr>
                            <Th position="sticky" fontSize="12px" left="0" bg="white" color="black">3.Londrina</Th>
                            <Th color="gray.600">6</Th>
                            <Th color="gray.600">R$210.000,00</Th>
                            <Th color="gray.600">R$60.000,00</Th>
                            <Th></Th>
                        </Tr> */}
                </Table>
            </Board>
    );
}