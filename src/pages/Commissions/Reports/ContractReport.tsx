import { Divider, FormControl, HStack, Select as ChakraSelect, Text, Th, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Board } from "../../../components/Board";
import { Table } from "../../../components/Table";
import { useCompanies } from "../../../hooks/useCompanies";
import { useProfile } from "../../../hooks/useProfile";
import { useWorkingBranch } from "../../../hooks/useWorkingBranch";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { api } from "../../../services/api";

export default function ContractReport() {
    const { permissions, profile } = useProfile();
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();

    const history = useHistory();

    const [years, setYears] = useState<Number[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>('');

    const loadYears = async () => {
        const { data } = await api.get('/transactionsYears');

        setYears(data);
    }

    useEffect(() => {
        loadYears();
    }, [])

    const dateObject = new Date;

    const companies = useCompanies();

    const [page, setPage] = useState(1);

    return (
            <Board mb="12">
                <HStack as="form" spacing="12" w="100%" mb="6" justifyContent="left">
                    <Text fontWeight="bold" w="100%" fontSize="13px">RELATÓRIO DE REGRAS</Text>

                    <FormControl display="flex" justifyContent="flex-end" minW="150px">
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

                <Divider mb="6" />

                        <Table header={[
                            { text: 'Regra', bold: true },
                            { text: 'Janeiro' },
                            { text: 'Fevereiro' },
                            { text: 'Março' },
                            { text: 'Abril' },
                            { text: 'Maio' },
                            { text: 'Junho' },
                            { text: 'Julho' },
                            { text: 'Agosto' },
                            { text: 'Setembro' },
                            { text: 'Outubro' },
                            { text: 'Novembro' },
                            { text: 'Dezembro' },
                        ]}>
                            <Tr>
                                <Th></Th>
                            </Tr>
                            <Tr>
                                <Th color="gray.900" fontSize="sm" position="sticky" left="0">2m</Th>
                                <Th color="green.400">7</Th>
                                <Th color="green.400">21</Th>
                                <Th color="green.400">34</Th>
                                <Th color="green.400">24</Th>
                                <Th color="green.400">28</Th>
                                <Th color="green.400">38</Th>
                                <Th color="green.400">42</Th>
                                <Th color="green.400">55</Th>
                                <Th color="green.400">59</Th>
                                <Th color="green.400">59</Th>
                                <Th color="green.400">59</Th>
                                <Th color="green.400">59</Th>
                            </Tr>
                            <Tr>
                                <Th></Th>
                            </Tr>
                            <Tr>
                                <Th color="gray.900" fontSize="sm" position="sticky" left="0">1m</Th>
                                <Th color="red.400">1</Th>
                                <Th color="red.400">3</Th>
                                <Th color="red.400">4</Th>
                                <Th color="red.400">2</Th>
                                <Th color="red.400">5</Th>
                                <Th color="red.400">6</Th>
                                <Th color="red.400">12</Th>
                                <Th color="red.400">6</Th>
                                <Th color="red.400">6</Th>
                                <Th color="red.400">6</Th>
                                <Th color="red.400">6</Th>
                                <Th color="red.400">6</Th>
                            </Tr>
                            <Tr>
                                <Th></Th>
                            </Tr>

                            <Tr>
                                <Th position="sticky" fontSize="sm" left="0" bg="white" color="black">Geral</Th>
                                <Th color="green.400">6</Th>
                                <Th color="green.400">18</Th>
                                <Th color="green.400">30</Th>
                                <Th color="green.400">22</Th>
                                <Th color="green.400">23</Th>
                                <Th color="green.400">35</Th>
                                <Th color="green.400">36</Th>
                                <Th color="green.400">43</Th>
                                <Th color="green.400">53</Th>
                                <Th color="green.400">53</Th>
                                <Th color="green.400">53</Th>
                                <Th color="green.400">53</Th>
                            </Tr>
                        </Table>
            </Board>
    );
}