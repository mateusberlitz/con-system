import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as EllipseIcon } from '../../../assets/icons/Ellipse.svg';
import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';

import { Flex, HStack, Stack, Text } from "@chakra-ui/layout";
import { IconButton } from "@chakra-ui/button";
import { Input } from "../../../components/Forms/Inputs/Input";
import { SketchPicker } from "react-color";
import { ColorPicker } from "../../../components/Forms/ColorPicker";

export default function PaymentCategories(){
    return (
        <MainBoard sidebar="financial" header={
            (
                <Text color="gray.800">
                    Categorias de Pagamentos
                </Text>
            )
        }>
            <HStack as="form" spacing="4" mb="10">
                <Input name="name" type="text" placeholder="Categoria" variant="outline" maxW="200px"/>
                <ColorPicker />
                <SolidButton mb="10" color="white" bg="blue.400" icon={PlusIcon} colorScheme="blue">
                        Adicionar
                </SolidButton>
            </HStack>

            <Stack spacing="6">
                <HStack flexDirection="row" spacing="5" flexWrap="wrap">
                    <Flex flexGrow={1} justify="space-between" fontWeight="500" alignItems="center" bg="white" borderRadius="full" shadow="xl" h="54px" px="8">
                        <Flex alignItems="center">
                            <EllipseIcon stroke="none" fill="#2097ed"/>
                            <Text mx="4" color="#2097ed">Fatura da internet</Text>
                        </Flex>
                        
                        <IconButton h="24px" w="23px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                    </Flex>

                    <Flex flexGrow={1} fontWeight="500" alignItems="center" bg="white" borderRadius="full" shadow="xl" h="54px" px="8">
                        <EllipseIcon stroke="none" fill="#2097ed"/>
                        <Text ml="2" color="#2097ed">Fatura da internet</Text>
                    </Flex>

                    <Flex flexGrow={1} fontWeight="500" alignItems="center" bg="white" borderRadius="full" shadow="xl" h="54px" px="8">
                        <EllipseIcon stroke="none" fill="#2097ed"/>
                        <Text ml="2" color="#2097ed">Fatura da internet</Text>
                    </Flex>

                </HStack>

                    <HStack flexDirection="row" spacing="5" flexWrap="wrap">

                    <Flex flexGrow={1} fontWeight="500" alignItems="center" bg="white" borderRadius="full" shadow="xl" h="54px" px="8">
                        <EllipseIcon stroke="none" fill="#2097ed"/>
                        <Text ml="2" color="#2097ed">Fatura da internet</Text>
                    </Flex>

                    <Flex flexGrow={1} fontWeight="500" alignItems="center" bg="white" borderRadius="full" shadow="xl" h="54px" px="8">
                        <EllipseIcon stroke="none" fill="#2097ed"/>
                        <Text ml="2" color="#2097ed">Fatura da internet</Text>
                    </Flex>

                    <Flex flexGrow={1} fontWeight="500" alignItems="center" bg="white" borderRadius="full" shadow="xl" h="54px" px="8">
                        <EllipseIcon stroke="none" fill="#2097ed"/>
                        <Text ml="2" color="#2097ed">Fatura da internet</Text>
                    </Flex>

                    <Flex flexGrow={1} fontWeight="500" alignItems="center" bg="white" borderRadius="full" shadow="xl" h="54px" px="8">
                        <EllipseIcon stroke="none" fill="#2097ed"/>
                        <Text ml="2" color="#2097ed">Fatura da internet</Text>
                    </Flex>

                    </HStack>
            </Stack>
        </MainBoard>
    );
}