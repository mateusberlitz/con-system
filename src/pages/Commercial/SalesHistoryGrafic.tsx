import { Flex, Stack, Text } from '@chakra-ui/react'
import { useProfile } from '../../hooks/useProfile'

import { Select } from '../../components/Forms/Selects/Select';
import LineAreaHistory from '../../components/Grafics/LineArea';

export default function SalesHistoryGrafic() {
  const { profile, permissions } = useProfile();
      
  // const options = {};

  // const series = [
  //       {
  //           name: 'TEAM A',
  //           type: 'area',
  //           data: [44, 55, 31, 47, 31, 43, 26, 41, 31, 47, 33]
  //           }
  //   ]

  return (
    <Stack width="100%"  min-width="300px" h="400" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" mt={4}>
      <Text color="#000" fontSize="xl" fontWeight="400">
          Histórico de vendas
        </Text>
        <Flex justify="flex-end" align="center">
          <Select
                h="45px"
                name="chargeback_type_id"
                value="0"
                w="90%"
                fontSize="sm"
                focusBorderColor="purple.300"
                bg="gray.400"
                variant="outline"
                _hover={{ bgColor: 'gray.500' }}
                size="lg"
                borderRadius="full"
                placeholder="Equipe"
              > 
            </Select>
            <Select
              h="45px"
              name="chargeback_type_id"
              value="0"
              w="90%"
              fontSize="sm"
              focusBorderColor="purple.300"
              bg="gray.400"
              variant="outline"
              _hover={{ bgColor: 'gray.500' }}
              size="lg"
              borderRadius="full"
              placeholder="Ultimo ano"
            > 
            </Select>
        </Flex>
            <LineAreaHistory  />
      </Stack>
  )
}
