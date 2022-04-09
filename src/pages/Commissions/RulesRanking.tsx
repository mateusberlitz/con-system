import {
  Flex,
  HStack,
  Stack,
  Text,
  Divider,
  Grid,
  GridItem
} from '@chakra-ui/react'

import { useEffect, useState } from 'react'
import { useProfile } from '../../hooks/useProfile'

import { ReactComponent as ChartBarIcon } from '../../assets/icons/Chart-bar.svg'

import { Link } from 'react-router-dom'

export default function RulesRanking() {
  const { profile, permissions } = useProfile()

  return (
    <Flex align="center" justify="center">
      <Stack w="100%" min-width="300px" spacing="4" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8" mt={8}>
        <Text color="#000" fontSize="xl" fontWeight="400">
          Ranking de Regras
        </Text>
        <Divider />

        <HStack spacing="6" align="center">
          <Text
            color="#000"
            fontSize="xl"
            fontWeight="400"
            justify="right"
            alignItems="right"
          >
            1. Regra Geral
          </Text>
        </HStack>

        <Grid templateColumns="repeat(5, 1fr)" gap={4} h="20px">
          <GridItem rowSpan={2} colSpan={1} h="10">
            <Text fontSize="md" fontWeight="normal" color="gray.700">
              Vendido
            </Text>
          </GridItem>
          <GridItem colStart={6} h="20px">
            <Text fontSize="md" fontWeight="normal" color="gray.700">
              R$28.000.000,00
            </Text>
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(5, 1fr)" gap={4} h="20px">
          <GridItem colSpan={2} h="10">
            <Text fontSize="md" fontWeight="normal" color="gray.700">
              Pago
            </Text>
          </GridItem>
          <GridItem colStart={6} colEnd={5} h="10">
            <Text fontSize="md" fontWeight="normal" color="gray.700">
              R$28.000.000,00
            </Text>
          </GridItem>
        </Grid>
        <Divider />
        <HStack spacing="8" align="center">
          <Text
            color="#000"
            fontSize="xl"
            fontWeight="normal"
            justify="right"
            alignItems="right"
          >
            2. Regra 1m
          </Text>
        </HStack>

        <Grid templateColumns="repeat(5, 1fr)" gap={4} h="20px">
          <GridItem colSpan={2} h="10">
            <Text fontSize="md" fontWeight="normal" color="gray.700">
              Vendido
            </Text>
          </GridItem>
          <GridItem colStart={6} colEnd={5} h="10">
            <Text fontSize="md" fontWeight="normal" color="gray.700">
              R$28.000.000,00
            </Text>
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(5, 1fr)" gap={4} h="20px">
          <GridItem colSpan={2} h="10">
            <Text fontSize="md" fontWeight="normal" color="gray.700">
              Pago
            </Text>
          </GridItem>
          <GridItem colStart={6} colEnd={5} h="10">
            <Text fontSize="md" fontWeight="normal" color="gray.700">
              R$28.000.000,00
            </Text>
          </GridItem>
        </Grid>
        <Divider />
        <HStack spacing="8" align="center">
          <Text color="#000" fontSize="xl" fontWeight="normal" justify="right" alignItems="right">
            3. Regra 2m
          </Text>
        </HStack>
        <Grid templateColumns="repeat(5, 1fr)" gap={4} h="20px">
          <GridItem colSpan={2} h="10">
            <Text fontSize="md" fontWeight="normal" color="gray.700">
              Vendido
            </Text>
          </GridItem>
          <GridItem colStart={6} colEnd={5} h="10">
            <Text fontSize="md" fontWeight="normal" color="gray.700">
              R$28.000.000,00
            </Text>
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(5, 1fr)" gap={4}>
          <GridItem colSpan={2} h="10">
            <Text fontSize="md" fontWeight="normal" color="gray.700">
              Pago
            </Text>
          </GridItem>
          <GridItem colStart={6} colEnd={5} h="10">
            <Text fontSize="md" fontWeight="normal" color="gray.700">
              R$28.000.000,00
            </Text>
          </GridItem>
        </Grid>
      </Stack>
    </Flex>
  )
}
