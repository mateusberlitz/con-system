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

export default function CommissionsPaidReport() {
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
                    <Text fontWeight="bold" w="100%" fontSize="13px">RELATÓRIO DE COMISSÕES PAGAS</Text>

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

                <Divider mb="6" />

                        <Table header={[
                            { text: 'Tipo', bold: true },
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
                                <Th color="gray.900" fontSize="sm" position="sticky" left="0">Entradas</Th>
                                <Th color="green.400">R$58.000,00</Th>
                                <Th color="green.400">R$R$91.000,00</Th>
                                <Th color="green.400">R$102.000,00</Th>
                                <Th color="green.400">R$83.000,00</Th>
                                <Th color="green.400">R$R$145.000,00</Th>
                                <Th color="green.400">R$177.000,00</Th>
                                <Th color="green.400">R$198.000,00</Th>
                                <Th color="green.400">R$256.000,00</Th>
                                <Th color="green.400">R$102.000,00</Th>
                                <Th color="green.400">R$102.000,00</Th>
                                <Th color="green.400">R$102.000,00</Th>
                                <Th color="green.400">R$102.000,00</Th>
                            </Tr>
                            <Tr>
                                <Th></Th>
                            </Tr>
                            <Tr>
                                <Th color="gray.900" fontSize="sm" position="sticky" left="0">Estornos</Th>
                                <Th color="red.400">R$1.000,00</Th>
                                <Th color="red.400">R$5.000,00</Th>
                                <Th color="red.400">R$9.000,00</Th>
                                <Th color="red.400">R$83.000,00</Th>
                                <Th color="red.400">R$6.000,00</Th>
                                <Th color="red.400">R$8.000,00</Th>
                                <Th color="red.400">R$14.000,00</Th>
                                <Th color="red.400">R$11.000,00</Th>
                                <Th color="red.400">R$25.000,00</Th>
                                <Th color="red.400">R$13.000,00</Th>
                                <Th color="red.400">R$13.000,00</Th>
                                <Th color="red.400">R$13.000,00</Th>
                            </Tr>
                            <Tr>
                                <Th></Th>
                            </Tr>

                            <Tr>
                                <Th position="sticky" fontSize="sm" left="0" bg="white" color="black">TOTAL</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                                <Th color="green.400">R$57.000,00</Th>
                            </Tr>
                        </Table>
            </Board>
    );
}