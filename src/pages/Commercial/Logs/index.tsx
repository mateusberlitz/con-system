import { HStack, Stack, Text, Th, Tr } from "@chakra-ui/react";
import { Board } from "../../../components/Board";
import { OutlineButton } from "../../../components/Buttons/OutlineButton";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { Input } from "../../../components/Forms/Inputs/Input";
import { MainBoard } from "../../../components/MainBoard";
import { Table } from "../../../components/Table";

export function Logs(){
    return(
        <MainBoard sidebar="commercial" header={<CompanySelectMaster/>}>
            <Stack spacing="10">
                <HStack justifyContent="space-between">
                    <Stack>
                        <Text fontSize="12px" fontWeight="semibold" color="gray.700">Histórico</Text>
                        <Text fontSize="lg" fontWeight="semibold" color="gray.700">Mateus Berlitz</Text>
                    </Stack>

                    <HStack as="form" spacing="6">
                        <Input name="search" type="text" placeholder="Ação executada" variant="filled" focusBorderColor="orange.400"/>

                        <OutlineButton type="submit" mb="10" color="orange.400" borderColor="orange.400" colorScheme="orange">
                            Filtrar
                        </OutlineButton>
                    </HStack>
                </HStack>

                <Board>
                    <Table header={
                        [
                            {text: 'Data'},
                            {text: 'Vendedor'},
                            {text: 'Ação'},
                        ]
                    }>
                        <Tr>
                            <Th color="gray.800" fontWeight="normal">
                            <Text fontSize="10px">13/08/2021</Text>
                            <Text fontSize="sm">18:56</Text>
                            </Th>
                            <Th color="gray.700" fontWeight="semibold" textTransform="capitalize">Mateus Berlitz</Th>
                            <Th color="gray.700" fontWeight="normal" textTransform="capitalize">Alterou o status de um lead para agendado</Th>
                        </Tr>

                        <Tr>
                            <Th color="gray.800" fontWeight="normal">
                            <Text fontSize="10px">13/08/2021</Text>
                            <Text fontSize="sm">18:56</Text>
                            </Th>
                            <Th color="gray.700" fontWeight="semibold" textTransform="capitalize">Mateus Berlitz</Th>
                            <Th color="gray.700" fontWeight="normal" textTransform="capitalize">Alterou o status de um lead para agendado</Th>
                        </Tr>

                        <Tr>
                            <Th color="gray.800" fontWeight="normal">
                            <Text fontSize="10px">13/08/2021</Text>
                            <Text fontSize="sm">18:56</Text>
                            </Th>
                            <Th color="gray.700" fontWeight="semibold" textTransform="capitalize">Mateus Berlitz</Th>
                            <Th color="gray.700" fontWeight="normal" textTransform="capitalize">Alterou o status de um lead para agendado</Th>
                        </Tr>
                    </Table>
                </Board>
            </Stack>
        </MainBoard>
    )
}