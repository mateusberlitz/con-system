import { Flex, Stack, Text } from '@chakra-ui/react'
import { useProfile } from '../../hooks/useProfile'
import TasksChart from '../../components/LineArea';
import { Select } from '../../components/Forms/Selects/Select';
import ColumnsCharts from '../../components/ColumnsCharts';

export default function SalesChargesGrafics() {
  const { profile, permissions } = useProfile();
      

  return (
      <Stack width="98%"  min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" mt={8}>
        <Text color="#000" fontSize="xl" fontWeight="400">
          Vendas x estornos
        </Text>
            <ColumnsCharts />
      </Stack>
  )
}
