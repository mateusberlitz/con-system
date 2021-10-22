import { SolidButton } from "../../../components/Buttons/SolidButton";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { MainBoard } from "../../../components/MainBoard";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as BackIcon } from '../../../assets/icons/Back.svg';
import { ReactComponent as ForwardIcon } from '../../../assets/icons/Forward.svg';

import { Board } from "../../../components/Board";
import { HStack, IconButton, Text, Th, Tr } from "@chakra-ui/react";
import { Input } from "../../../components/Forms/Inputs/Input";
import { Table } from "../../../components/Table";
import { SchedulesTable } from "../../../components/Table/SchedulesTable";

export default function Schedules(){
    return (
        <MainBoard sidebar="commercial" header={<CompanySelectMaster/>}>
            <SolidButton color="white" bg="blue.400" icon={PlusIcon} colorScheme="blue" mb="10">
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
                        <Th borderBottom="none" borderLeft="1px solid" borderRight="1px solid" borderColor="gray.200">07:00</Th>
                    </Tr>
                    <Tr>
                        <Th>08:00</Th>
                    </Tr>
                    <Tr>
                        <Th>09:00</Th>
                    </Tr>
                    <Tr>
                        <Th>10:00</Th>
                    </Tr>
                    <Tr>
                        <Th>11:00</Th>
                    </Tr>
                    <Tr>
                        <Th>12:00</Th>
                    </Tr>
                </SchedulesTable>
            </Board>
        </MainBoard>
    )
}