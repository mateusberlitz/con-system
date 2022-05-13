import { Flex, Stack, Text } from '@chakra-ui/react'
import { useProfile } from '../../hooks/useProfile'

import { Select } from '../../components/Forms/Selects/Select';
import LineAreaHistory from '../../components/Grafics/LineArea';

export default function CommissionsReceivedGrafic() {
  const { profile, permissions } = useProfile();
      

  return (
      <Stack width="98%" min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" mt={8}>
        <Text color="#000" fontSize="xl" fontWeight="400">
          Commissões Recebidas
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
            <LineAreaHistory />
      </Stack>
  )
}
