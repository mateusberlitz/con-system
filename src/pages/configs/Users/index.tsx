import { Avatar, Flex, HStack, Td, Text, Tr } from "@chakra-ui/react";
import { OutlineButton } from "../../../components/Buttons/OutlineButton";
import { Board } from "../../../components/Board";
import { RemoveButton } from "../../../components/Buttons/RemoveButton";
import { EditButton } from "../../../components/Buttons/EditButton";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";
import { Table as ProTable } from "../../../components/Table";
import { Input } from "../../../components/Forms/Input";
import { Select } from "../../../components/Forms/Select";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as SearchIcon } from "../../../assets/icons/Search.svg";
import { ReactComponent as HomeIcon } from '../../../assets/icons/Home.svg';
import { ReactComponent as PasteIcon } from '../../../assets/icons/Paste.svg';
import { ReactComponent as ProfileIcon } from '../../../assets/icons/Profile.svg';

export default function Users(){
    return(
        <MainBoard sidebar="configs">
            <SolidButton mb="12" color="white" bg="purple.300" icon={PlusIcon} colorScheme="purple">
                Adicionar Usuário
            </SolidButton>

            <HStack as="form" spacing="24px" w="100%">

                <Input name="search" type="text" icon={SearchIcon}/>

                <Select name="role">
                        <option value="0">Cargo</option>
                        <option value="1">Diretor</option>
                        <option value="2">Financeiro</option>
                        <option value="3">Gerente</option>
                        <option value="4">Vendedor</option>
                </Select>

                <Select name="company">
                        <option value="0">Empresa</option>
                        <option value="1">Central</option>
                        <option value="2">Londrina</option>
                        <option value="3">Quero Carta</option>
                </Select>

                <OutlineButton type="submit" colorScheme="purple" h="45px" size="sm" borderRadius="full" variant="outline">
                    Filtrar
                </OutlineButton>
                    
            </HStack>

            <Board mt="50px">
                <ProTable header={
                    [
                        {
                            text: 'Lista de usuários',
                            icon: ProfileIcon
                        },
                        {
                            text: 'Empresa',
                            icon: HomeIcon
                        },
                        {
                            text: 'Cargo',
                            icon: PasteIcon
                        },
                        {
                            text: 'Ações',
                            //icon: ConfigureIcon
                        },
                    ]
                }>
                    {/* ITEMS */}
                        <Tr>
                            <Td alignItems="center" display="flex">
                                <Flex mr="4" borderRadius="full" h="fit-content" w="fit-content" bgGradient="linear(to-r, purple.600, blue.300)" p="2px">
                                    <Avatar borderColor="gray.600" border="2px" size="md" name="Mateus Berlitz" src="https://avatars.githubusercontent.com/u/32850300?v=4"/>
                                </Flex>
                                <Text display="flex" fontSize="sm" color="gray.700" fontWeight="600">Robson Seibel Gerente</Text>
                            </Td>
                            <Td fontSize="sm" color="gray.800">Central</Td>
                            <Td fontSize="sm" color="gray.800">Gerente de Vendas</Td>
                            <Td>
                                <HStack spacing="4">
                                    <RemoveButton />
                                    <EditButton />
                                </HStack>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td alignItems="center" display="flex">
                                <Flex mr="4" borderRadius="full" h="fit-content" w="fit-content" bgGradient="linear(to-r, purple.600, blue.300)" p="2px">
                                    <Avatar borderColor="gray.600" border="2px" size="md" name="Mateus Berlitz" src="https://avatars.githubusercontent.com/u/32850300?v=4"/>
                                </Flex>
                                <Text display="flex" fontSize="sm" color="gray.700" fontWeight="600">Robson Seibel</Text>
                            </Td>
                            <Td fontSize="sm" color="gray.800">Central</Td>
                            <Td fontSize="sm" color="gray.800">Gerente</Td>
                            <Td>
                                <HStack spacing="4">
                                    <RemoveButton />
                                    <EditButton />
                                </HStack>
                            </Td>
                        </Tr>
                </ProTable>
            </Board>

        </MainBoard>
    );
}