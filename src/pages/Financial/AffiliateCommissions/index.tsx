import { Divider, FormControl, HStack, Select as ChakraSelect, Text, Th, Tr } from "@chakra-ui/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Board } from "../../../components/Board";
import { Table } from "../../../components/Table";
import { useProfile } from "../../../hooks/useProfile";
import { useWorkingBranch } from "../../../hooks/useWorkingBranch";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";


export default function AffiliateCommissions() {
    const { permissions, profile } = useProfile();
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();

    const history = useHistory();

    const [years, setYears] = useState<Number[]>([]);

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
                        <Tr>
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
                        </Tr>
                </Table>
            </Board>
    );
}