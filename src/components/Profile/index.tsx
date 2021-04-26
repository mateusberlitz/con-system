import { Avatar, Box, Flex, Link, Text } from "@chakra-ui/react";
import { useState } from "react";

import { ReactComponent as ForwardArrowIcon } from '../../assets/icons/Forward Arrow.svg';
import { LogoutModal } from "./LogoutModal";

export function Profile(){
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    function OpenLogoutModal(){
        setIsLogoutModalOpen(true);
    }

    function CloseLogoutModal(){
        setIsLogoutModalOpen(false);
    }

    return(
        <Flex ml="auto" title="Ver informações ou sair" cursor="pointer">
            {/* { showProfileData && ( */}
                <Box mr="4" mt="1" textAlign="right">
                    <Text fontWeight="600" fontSize="sm" color="gray.700">Mateus Berlitz</Text>
                    <Text fontSize="small" color="gray.700">
                        Programador Master
                    </Text>
                </Box>
            {/* )} */}

            <Flex borderRadius="full" height="fit-content" bgGradient="linear(to-r, purple.600, blue.300)" p="2px">
                <Avatar borderColor="gray.600" border="2px" size="md" name="Mateus Berlitz" src="https://avatars.githubusercontent.com/u/32850300?v=4"/>
            </Flex>

            <Link mt="3" ml="6" title="Sair e fazer logout do sistema" onClick={OpenLogoutModal}>
                <ForwardArrowIcon stroke="#6e7191" fill="none" width="20"/>
            </Link>

            <LogoutModal isOpen={isLogoutModalOpen} onRequestClose={CloseLogoutModal}/>
        </Flex>
    );
}