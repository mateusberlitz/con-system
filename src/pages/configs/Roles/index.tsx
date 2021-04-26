import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { Flex, FormControl, HStack, Radio, RadioGroup, Select, Stack, Text } from "@chakra-ui/react";
import { Board } from "../../../components/Board";

export default function Roles(){
    return(
        <MainBoard sidebar="configs">
            <SolidButton mb="10" color="white" bg="purple.300" icon={PlusIcon} colorScheme="purple">
                Adicionar Cargo
            </SolidButton>

            <HStack as="form" spacing="24px" w="100%" mb="10">
                <FormControl pos="relative">
                    <Select h="45px" name="role" w="100%" maxW="200px" fontSize="sm" focusBorderColor="purple.600" borderColor="gray.500" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Cargo" color="gray.600">
                        <option value="1">Diretor</option>
                        <option value="2">Financeiro</option>
                        <option value="3">Gerente</option>
                        <option value="4">Vendedor</option>
                    </Select>
                </FormControl>
            </HStack>
            
            <Board>
                <Flex as="form">
                    <Stack spacing="10" direction="column">
                        <FormControl pos="relative">
                            <Text mb="4" fontWeight="600">Configurações</Text>

                            <RadioGroup name="cobranca">
                                <HStack spacing="6">
                                    <Radio value="2" colorScheme="purple" color="purple.300" variant="check">Acesso Completo</Radio>
                                    <Radio value="3" colorScheme="purple">Acesso Limitado</Radio>
                                </HStack>
                            </RadioGroup>
                        </FormControl>

                        <FormControl pos="relative">
                            <Text mb="4" fontWeight="600">Cobrança</Text>

                            <RadioGroup name="cobranca">
                                <HStack spacing="6">
                                    <Radio value="2" colorScheme="purple" color="purple.300" variant="check">Acesso Completo</Radio>
                                    <Radio value="3" colorScheme="purple">Acesso Limitado</Radio>
                                </HStack>
                            </RadioGroup>
                        </FormControl>

                        <FormControl pos="relative">
                            <Text mb="4" fontWeight="600">Finanças</Text>

                            <RadioGroup name="cobranca">
                                <HStack spacing="6">
                                    <Radio value="2" colorScheme="purple" color="purple.300" variant="check">Acesso Completo</Radio>
                                    <Radio value="3" colorScheme="purple">Acesso Limitado</Radio>
                                </HStack>
                            </RadioGroup>
                        </FormControl>

                        <FormControl pos="relative">
                            <Text mb="4" fontWeight="600">Vendas</Text>

                            <RadioGroup name="cobranca">
                                <HStack spacing="6">
                                    <Radio value="2" colorScheme="purple" color="purple.300" variant="check">Acesso Completo</Radio>
                                    <Radio value="3" colorScheme="purple">Acesso Limitado</Radio>
                                </HStack>
                            </RadioGroup>
                        </FormControl>
                    </Stack>
                    
                </Flex>
                
            </Board>
        </MainBoard>
    );
}