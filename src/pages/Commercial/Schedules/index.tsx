import { SolidButton } from "../../../components/Buttons/SolidButton";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { MainBoard } from "../../../components/MainBoard";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as BackIcon } from '../../../assets/icons/Back.svg';
import { ReactComponent as ForwardIcon } from '../../../assets/icons/Forward.svg';

import { Board } from "../../../components/Board";
import { HStack, IconButton, Stack, Text, Th, Tr } from "@chakra-ui/react";
import { Input } from "../../../components/Forms/Inputs/Input";
import { Table } from "../../../components/Table";
import { SchedulesTable } from "../../../components/Table/SchedulesTable";
import { hours } from "./HoursOfADay";

export default function Schedules(){
    return (
        <MainBoard sidebar="commercial" header={<CompanySelectMaster/>}>
            <SolidButton color="white" bg="orange.400" icon={PlusIcon} colorScheme="orange" mb="10">
                Agendar
            </SolidButton>

            <Board>
                <HStack mb="10">
                    <IconButton h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <BackIcon width="20px" stroke="#6e7191" fill="none"/>} variant="outline"/>
                    <IconButton h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <ForwardIcon width="20px" stroke="#6e7191" fill="none"/>} variant="outline"/>

                    <Input name="start_date" type="date" placeholder="Data inicial" variant="filled" maxW="240px"/>
                    <Text>Até</Text>
                    <Input name="end_date" type="date" placeholder="Data final" variant="filled" maxW="240px"/>
                </HStack>

                <SchedulesTable header={[
                    {text: ''},
                    {text: 'Seg 18/10', wrap: true},
                    {text: 'Ter 19/10', wrap: true},
                    {text: 'Qua 20/10', wrap: true},
                    {text: 'Março'},
                    {text: 'Abril'},
                    {text: 'Maio'},
                    {text: 'Junho'},
                    {text: 'Julho'},
                    {text: 'Agosto'},
                    {text: 'Setembro'},
                    {text: 'Outubro'},
                    {text: 'Novembro'},
                    {text: 'Dezembro'},
                    {text: 'Soma', bold:true},
                ]}>
                    <Tr borderBottom="1px solid" borderColor="gray.200">
                        <Th borderBottom="none" borderLeft="1px solid #e2e8f0" borderRight="1px solid #e2e8f0">
                            01:00
                        </Th>
                        <Th minWidth="180px" borderBottom="none" borderLeft="1px solid #e2e8f0" borderRight="1px solid #e2e8f0" p="0">
                            <Stack spacing="0" bg="green.100" color="green.500" p="2" textTransform="capitalize">
                                <Text fontWeight="normal">Mateus Berlitz</Text>
                                <Text fontWeight="bold">Porto Alegre</Text>
                            </Stack>
                            <Stack spacing="0" bg="green.100" color="green.500" p="2" textTransform="capitalize">
                                <Text fontWeight="normal">Mateus Berlitz</Text>
                                <Text fontWeight="bold">Porto Alegre</Text>
                            </Stack>
                        </Th>
                        <Th minWidth="180px" borderBottom="none" borderLeft="1px solid #e2e8f0" borderRight="1px solid #e2e8f0" p="0">
                            <Stack spacing="0" bg="orange.100" color="orange.500" p="2" textTransform="capitalize">
                                <Text fontWeight="normal">Mateus Berlitz</Text>
                                <Text fontWeight="bold">Porto Alegre</Text>
                            </Stack>
                        </Th>
                        <Th minWidth="180px" borderBottom="none" borderLeft="1px solid #e2e8f0" borderRight="1px solid #e2e8f0" p="0">
                            <Stack spacing="0" bg="red.100" color="red.500" p="2" textTransform="capitalize">
                                <Text fontWeight="normal">Mateus Berlitz</Text>
                                <Text fontWeight="bold">Porto Alegre</Text>
                            </Stack>
                        </Th>
                    </Tr>
                    {
                        hours.map((hour:string, index:number) => {
                            return (
                                <Tr borderBottom="1px solid" borderColor="gray.200">
                                    <Th borderBottom="none" borderLeft="1px solid #e2e8f0" borderRight="1px solid #e2e8f0">
                                        {hour}
                                    </Th>
                                </Tr>
                            )
                        })
                    }
                    
                    
                </SchedulesTable>
            </Board>
        </MainBoard>
    )
}