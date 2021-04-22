import { Flex, GridItem, Heading, HStack, Img, Link, SimpleGrid, Text } from "@chakra-ui/react";

import { ReactComponent as SettingsIcon } from '../../assets/icons/Settings.svg';
import { ReactComponent as ChartBarIcon } from '../../assets/icons/Chart-bar.svg';
import { ReactComponent as CartIcon } from '../../assets/icons/Cart.svg';
import { ReactComponent as CommentIcon } from '../../assets/icons/Comment.svg';

import Logo from '../../assets/icons/Logo.svg';
import { Profile } from "../../components/Profile";

export default function ConfigHome(){
    return(
        <Flex direction="column" h="100vh">
            <Flex w="100%" my="14" maxWidth={1280} mx="auto" px="6" direction="column">
                <Flex w="100%" mb="12">
                    <Img src={Logo}/>

                    <Profile/>
                </Flex>
                
                <Text fontSize="lg" color="gray.700" fontWeight="500" mb="3">Áreas do sistema</Text>
                
                <HStack spacing="7" direction="row" mb="12">

                    <Link href="/empresas" color="purple.300" display="flex" direction="row">
                        <SettingsIcon stroke="#5F2EEA" fill="none" width="20"/>
                        <Text fontWeight="600" ml="2" color="purple.300" lineHeight="25px">Configurações</Text>
                    </Link>

                    <Link color="blue.400" display="flex" direction="row">
                        <ChartBarIcon stroke="#0096B7" fill="none" width="20"/>
                        <Text fontWeight="600" ml="2" color="blue.400" lineHeight="25px">Finanças</Text>
                    </Link>

                    <Link color="orange.400" display="flex" direction="row">
                        <CartIcon stroke="#F24E1E" fill="none" width="20"/>
                        <Text fontWeight="600" ml="2" color="orange.400" lineHeight="25px">Funil de Vendas</Text>
                    </Link>

                    <Link color="red.400" display="flex" direction="row">
                        <CommentIcon stroke="#C30052" fill="none" width="20"/>
                        <Text fontWeight="600" ml="2" color="red.400" lineHeight="25px">Atendimento</Text>
                    </Link>
                </HStack>

                <SimpleGrid flex="1" templateColumns="repeat(5, 1fr)" gap="5" minChildWidth="320px" align="flex-start">
                    <GridItem colSpan={2}  p={["4", "6"]}  bg="white" shadow="sm" borderRadius={15} pb="4">
                        <Heading fontSize="xl" fontWeight="500">Saldo das Empresas</Heading>
                        
                        <br/> <br/> <br/> <br/>
                    </GridItem>

                    <GridItem colSpan={3} p={["4", "6"]}  bg="white" shadow="sm" borderRadius={15} pb="4">
                        <Heading fontSize="xl" fontWeight="500">Saldo das Empresas</Heading>
                    </GridItem>
                </SimpleGrid>
            </Flex>
        </Flex>
    );
}