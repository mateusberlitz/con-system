import { Badge, HStack, Stack, Text } from "@chakra-ui/react";
import { OutlineButton } from "../../../components/Buttons/OutlineButton";
import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { MainBoard } from "../../../components/MainBoard";

export default function Leads(){
    return (
        <MainBoard sidebar="commercial" header={<CompanySelectMaster />}>
            <Stack w="100%" border="2px" borderColor="gray.500" borderRadius="26" overflow="hidden" spacing="0">
                <HStack spacing="8" justify="space-between" paddingX="8" paddingY="3" bg="gray.200">
                    <Text>25 pendentes</Text>

                    <OutlineButton h="30px" size="sm" fontSize="11" color="orange.400" borderColor="orange.400" colorScheme="orange">
                        Delegar selecionados
                    </OutlineButton>
                </HStack>

                <HStack justify="space-between" px="8" py="3" bg="white" borderTop="2px" borderTopColor="gray.500" borderBottom="0">
                    <Stack spacing="0">
                        <Text fontSize="10px" color="gray.800">16:30</Text>
                        <Text fontSize="sm" fontWeight="normal" color="gray.800">12/07/2021</Text>
                    </Stack>

                    <Stack spacing="0">
                        <Text fontSize="sm" fontWeight="bold" color="gray.800">Anderson Pereira</Text>
                        <Text fontSize="11px" fontWeight="normal" color="gray.800">(51) 9 9109-0100</Text>
                    </Stack>

                    <Stack spacing="0">
                        <Text fontSize="sm" fontWeight="normal" color="gray.800">Dois Irmãos</Text>
                        <Text fontSize="11px" fontWeight="normal" color="gray.800">RS</Text>
                    </Stack>

                    <Text fontSize="sm" fontWeight="normal" color="gray.800">Veículo - R$50.000,00</Text>

                    <Text fontSize="sm" fontWeight="normal" color="gray.800">Site</Text>

                    <Badge colorScheme="purple" color="white" bg="purple.500" display="flex" borderRadius="full" px="5" py="0" h="29px" alignItems="center"><Text>Novo!</Text></Badge>

                    <OutlineButton h="30px" size="sm" fontSize="11" color="orange.400" borderColor="orange.400" colorScheme="orange">
                        Delegar
                    </OutlineButton>
                </HStack>

                <HStack justify="space-between" px="8" py="3" bg="white" borderTop="2px" borderTopColor="gray.500" borderBottom="0">
                    <Stack spacing="0">
                        <Text fontSize="10px" color="gray.800">16:30</Text>
                        <Text fontSize="sm" fontWeight="normal" color="gray.800">12/07/2021</Text>
                    </Stack>

                    <Stack spacing="0">
                        <Text fontSize="sm" fontWeight="bold" color="gray.800">Anderson Pereira</Text>
                        <Text fontSize="11px" fontWeight="normal" color="gray.800">(51) 9 9109-0100</Text>
                    </Stack>

                    <Stack spacing="0">
                        <Text fontSize="sm" fontWeight="normal" color="gray.800">Dois Irmãos</Text>
                        <Text fontSize="11px" fontWeight="normal" color="gray.800">RS</Text>
                    </Stack>

                    <Text fontSize="sm" fontWeight="normal" color="gray.800">Veículo - R$50.000,00</Text>

                    <Text fontSize="sm" fontWeight="normal" color="gray.800">Site</Text>

                    <Badge colorScheme="purple" color="white" bg="purple.500" display="flex" borderRadius="full" px="5" py="0" h="29px" alignItems="center"><Text>Novo!</Text></Badge>

                    <OutlineButton h="30px" size="sm" fontSize="11" color="orange.400" borderColor="orange.400" colorScheme="orange">
                        Delegar
                    </OutlineButton>
                </HStack>
            </Stack>
        </MainBoard>
    )
}