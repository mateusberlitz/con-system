import { Flex, Heading, HStack, Icon, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { Board } from "../../../components/Board";
import { EditButton } from "../../../components/Buttons/EditButton";
import { RemoveButton } from "../../../components/Buttons/RemoveButton";
import { NewCompanyModal } from "./NewCompanyModal";

import { ReactComponent as LocationIcon } from '../../../assets/icons/Location.svg';
import { ReactComponent as CallIcon } from '../../../assets/icons/Call.svg';
import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";
import { useState } from "react";
import { ConfirmCompanyRemoveModal } from "./ConfirmCompanyRemoveModal";

export default function Companys(){
    const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);
    const [isConfirmCompanyRemoveModalOpen, setisConfirmCompanyRemoveModalOpen] = useState(false);

    function OpenNewCompanyModal(){
        setIsNewCompanyModalOpen(true);
    }

    function CloseNewCompanyModal(){
        setIsNewCompanyModalOpen(false);
    }

    function OpenConfirmCompanyRemoveModal(){
        setisConfirmCompanyRemoveModalOpen(true);
    }

    function CloseConfirmCompanyRemoveModal(){
        setisConfirmCompanyRemoveModalOpen(false);
    }

    return (
        <>
            <NewCompanyModal isOpen={isNewCompanyModalOpen} onRequestClose={CloseNewCompanyModal}/>
            <ConfirmCompanyRemoveModal isOpen={isConfirmCompanyRemoveModalOpen} onRequestClose={CloseConfirmCompanyRemoveModal}/>

            <MainBoard sidebar="configs">
                <SolidButton onClick={OpenNewCompanyModal} mb="12" color="white" bg="purple.300" icon={PlusIcon} colorScheme="purple">
                    Adicionar Empresa
                </SolidButton>

                <SimpleGrid flex="1" gap="12" minChildWidth="100%" align="flex-start">
                    <Board>
                        <Flex mb="12">
                            <Heading fontSize="2xl" fontWeight="500">Teste</Heading>

                            <HStack spacing="10" ml="auto">
                                <RemoveButton onClick={OpenConfirmCompanyRemoveModal}/>
                                <EditButton/>
                            </HStack>
                        </Flex>

                        <Stack spacing="4">
                            <Text color="gray.800" fontSize="md"> <Icon as={LocationIcon}  stroke="#4e4b66" fill="none" mr="2"/>R. Silveira Martins, 47 - Centro, Novo Hamburgo - RS, 93510-310</Text>
                            <Text color="gray.800" fontSize="md"> <Icon as={CallIcon}  stroke="#4e4b66" fill="none" mr="2"/>(51) 3066-0166</Text>
                        </Stack>
                        
                    </Board>

                    <Board>
                        <Flex mb="12">
                            <Heading fontSize="2xl" fontWeight="500">Teste</Heading>

                            <HStack spacing="10" ml="auto">
                                <RemoveButton onClick={OpenConfirmCompanyRemoveModal}/>
                                <EditButton/>
                            </HStack>
                        </Flex>

                        <Stack spacing="4">
                            <Text color="gray.800" fontSize="md"> <Icon as={LocationIcon}  stroke="#4e4b66" fill="none" mr="2"/>R. Silveira Martins, 47 - Centro, Novo Hamburgo - RS, 93510-310</Text>
                            <Text color="gray.800" fontSize="md"> <Icon as={CallIcon}  stroke="#4e4b66" fill="none" mr="2"/>(51) 3066-0166</Text>
                        </Stack>
                        
                    </Board>
                </SimpleGrid>
            </MainBoard>
        </>
    );
}