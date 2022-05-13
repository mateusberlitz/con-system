import { Stack, Text } from '@chakra-ui/react'
import BarCharts from '../../components/Grafics/BarCharts';
import { useProfile } from '../../hooks/useProfile'

export default function PurchasedSements() {
  const { profile, permissions } = useProfile();
      

  return (
    <Stack width="100%"  h={400}  min-width="300px" spacing="6" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" mt={8}>
      <Text color="#000" fontSize="xl" fontWeight="400">
          Segmentos mais comprados
        </Text>
           <BarCharts />
      </Stack>
  )
}
