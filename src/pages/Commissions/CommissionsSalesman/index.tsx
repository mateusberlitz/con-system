import { Link, Flex, HStack, Stack, Spinner, IconButton, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, useToast, Divider, Table, Thead, Th, Td, Tbody, Tr, Checkbox, useBreakpointValue, Icon, Box } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';

import { useHistory } from "react-router-dom";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { OutlineButton } from "../../../components/Buttons/OutlineButton";
import { Input } from "../../../components/Forms/Inputs/Input";
import { Select } from "../../../components/Forms/Selects/Select";



export default function CommissionsSalesman(){
    const history = useHistory();

    return(
        <MainBoard sidebar="commissions" header={ <CompanySelectMaster/>}>

            {/* <ExportDocumentsModal /> */}

            <Stack flexDirection={["column", "row"]} spacing={["4", "0"]} justify="space-between" mb="10">
                <SolidButton color="white" bg="red.400" icon={PlusIcon} colorScheme="blue">
                    Cadastrar venda
                </SolidButton>
            </Stack>

            <Stack flexDir={["column", "row"]} spacing="6" as="form" mb="20">
                <Box w="100%">
                    <Stack spacing="6" w="100%">
                        <Stack direction={["column", "row"]} spacing="6">
                            <Input name="search" type="text" placeholder="Procurar" variant="filled"/>

                            <Input name="start_date" type="date" placeholder="Data Inicial" variant="filled"/>
                            <Input name="end_date" type="date" placeholder="Data Final" variant="filled"/>

                            <Select h="45px" name="category" w="100%" maxW="200px" fontSize="sm" focusBorderColor="blue.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Estorno">

                            </Select>
                        </Stack>

                        <Stack direction={["column", "row"]} spacing="6">
                            <Input name="group" type="text" placeholder="Grupo" variant="filled"/>

                            <Input name="quote" type="text" placeholder="Cota" variant="filled"/>

                            <Input name="contract" type="text" placeholder="Contrato" variant="filled"/>

                            <Input name="parcela" type="text" placeholder="Parcela" variant="filled"/>

                            <Select defaultValue={0} h="45px" name="pendency" w="100%" maxW="200px" fontSize="sm" focusBorderColor="blue.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full">
                                <option value="">Status</option>
                                <option value={1}>Pendente</option>
                                <option value={0}>Confirmada</option>
                            </Select>

                            <OutlineButton type="submit" mb="10" color="red.400" borderColor="red.400" colorScheme="blue">
                                Filtrar
                            </OutlineButton>
                        </Stack>
                    </Stack>
                </Box>

            </Stack>

            <Stack fontSize="13px" spacing="12">

                {/* <Pagination registerPerPage={50} currentPage={page} onPageChange={setPage}/> */}
            </Stack>

        </MainBoard>
    );
}