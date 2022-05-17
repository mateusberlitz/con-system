import { Divider, FormControl, HStack, Select as ChakraSelect, Text, Th, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Board } from "../../components/Board";
import { Table } from "../../components/Table";
import { useProfile } from "../../hooks/useProfile";
import { useWorkingBranch } from "../../hooks/useWorkingBranch";
import { useWorkingCompany } from "../../hooks/useWorkingCompany";


export default function TeamRankingTable() {
    const { permissions, profile } = useProfile();
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();

    const history = useHistory();

    const [years, setYears] = useState<Number[]>([]);

    return (
            <Board mb="12" h={450}>
                <HStack as="form" spacing="12" w="100%" mb="6" justifyContent="left">
                    <Text fontWeight="500" w="100%" fontSize="xl">Ranking da equipe</Text>

                    <FormControl display="flex" justifyContent="flex-end" align="flex-end" minW="150px">
                        <ChakraSelect defaultValue={workingCompany.company?.id} h="45px" name="selected_company" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={{ bgColor: 'gray.500' }} size="lg" borderRadius="full">
                            {
                                years.map((year: Number) => {
                                    return (
                                        <option key={year.toString()} value={year.toString()}>{year}</option>
                                    )
                                })
                            }
                        </ChakraSelect>
                    </FormControl>

                </HStack>

                <Divider mb="4" />

                        <Table header={[
                            { text: 'Vendedor' },
                            { text: 'Contratos' },
                            { text: 'Vendas' },
                            { text: 'Estornos' },
                            { text: 'total' }
                        ]}>
                            <Tr>
                                <Th></Th>
                            </Tr>
                            <Tr>
                                <Th color="black" fontSize="12px" position="sticky" left="0">1.Robson</Th>
                                <Th color="gray.600">7</Th>
                                <Th color="gray.600">R$210.000,00</Th>
                                <Th color="gray.600">R$60.000,00</Th>
                                <Th></Th>
                            </Tr>
                            <Tr>
                                <Th color="black" fontSize="12px" position="sticky" left="0">2.Ramon</Th>
                                <Th color="gray.600">1</Th>
                                <Th color="gray.600">R$210.000,00</Th>
                                <Th color="gray.600">R$60.000,00</Th>
                                <Th></Th>
                            </Tr>
                            <Tr>
                                <Th position="sticky" fontSize="12px" left="0" bg="white" color="black">3.Joceli</Th>
                                <Th color="gray.600">6</Th>
                                <Th color="gray.600">R$210.000,00</Th>
                                <Th color="gray.600">R$60.000,00</Th>
                                <Th></Th>
                            </Tr>
                            <Tr>
                                <Th position="sticky" fontSize="12px" left="0" bg="white" color="black">4.Bruno</Th>
                                <Th color="gray.600">6</Th>
                                <Th color="gray.600">R$210.000,00</Th>
                                <Th color="gray.600">R$60.000,00</Th>
                                <Th></Th>
                            </Tr>
                            <Tr>
                                <Th position="sticky" fontSize="12px" left="0" bg="white" color="black">5.Emerson</Th>
                                <Th color="gray.600">6</Th>
                                <Th color="gray.600">R$210.000,00</Th>
                                <Th color="gray.600">R$60.000,00</Th>
                                <Th></Th>
                            </Tr>
                        </Table>
            </Board>
    );
}