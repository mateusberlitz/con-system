import {
  Divider,
  Flex,
  HStack,
  Link,
  Spinner,
  Stack,
  Text,
  Th,
  Tr
} from '@chakra-ui/react'
import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { Board } from '../../../components/Board'
import { OutlineButton } from '../../../components/Buttons/OutlineButton'
import { CompanySelectMaster } from '../../../components/CompanySelect/companySelectMaster'
import { Input } from '../../../components/Forms/Inputs/Input'
import { MainBoard } from '../../../components/MainBoard'
import { Table } from '../../../components/Table'
import { api } from '../../../services/api'
import { BillCategory, Log, User } from '../../../types'
import { LogsFilterData, useLogs } from '../../../hooks/useLogs'
import { formatYmdDate } from '../../../utils/Date/formatYmdDate'
import { formatBRDate } from '../../../utils/Date/formatBRDate'
import { getDay } from '../../../utils/Date/getDay'
import { getHour } from '../../../utils/Date/getHour'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ReactComponent as BackArrow } from '../../../assets/icons/Back Arrow.svg'

interface LogParams {
  user: string
}

const EditQuotaFormSchema = yup.object().shape({
  search: yup.string().nullable()
})

export function Logs() {
  const { user } = useParams<LogParams>()

  const [userData, setUserData] = useState<User>()

  const loadUserData = async () => {
    const { data } = await api.get(`/users/${user}`)

    setUserData(data)
  }

  useEffect(() => {
    loadUserData()
  }, [])

  const [filter, setFilter] = useState<LogsFilterData>(() => {
    const data: LogsFilterData = {
      search: '',
      start_date: formatYmdDate(new Date().toString()),
      end_date: formatYmdDate(new Date().toString()),
      user: parseInt(user)
    }

    return data
  })

  const { handleSubmit, register, formState, control } =
    useForm<LogsFilterData>({
      resolver: yupResolver(EditQuotaFormSchema),
      defaultValues: {
        search: ''
      }
    })

  function handleChangeFilter(newFilter: LogsFilterData) {
    newFilter.user = parseInt(user)
    setFilter(newFilter)
  }

  const users = useLogs(filter, 1)

  return (
    <MainBoard sidebar="commercial" header={<CompanySelectMaster />}>
      <Stack spacing="10">
        <HStack justifyContent="space-between">
          <HStack spacing="3" height="50px">
            <Link to="/vendedores">
              <Flex display="flex" flexDirection="row">
                <BackArrow width="20px" stroke="#4e4b66" fill="none" />
              </Flex>
            </Link>

            <Divider orientation="vertical" />

            <Stack>
              <Text fontSize="12px" fontWeight="semibold" color="gray.700">
                Histórico
              </Text>
              <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                {userData?.name} {userData?.last_name}
              </Text>
            </Stack>
          </HStack>

          <HStack
            as="form"
            spacing="6"
            onSubmit={handleSubmit(handleChangeFilter)}
          >
            <Input
              register={register}
              name="search"
              type="text"
              placeholder="Ação executada"
              variant="filled"
              focusBorderColor="orange.400"
              error={formState.errors.search}
            />

            <OutlineButton
              type="submit"
              mb="10"
              color="orange.400"
              borderColor="orange.400"
              colorScheme="orange"
            >
              Filtrar
            </OutlineButton>
          </HStack>
        </HStack>

        <Board>
          {users.isLoading ? (
            <Flex justify="center">
              <Spinner />
            </Flex>
          ) : users.isError ? (
            <Flex justify="center" mt="4" mb="4">
              <Text>Erro listar as ações</Text>
            </Flex>
          ) : (
            users.data?.data.length === 0 && (
              <Flex justify="center">
                <Text>Nenhuma ação encontrada.</Text>
              </Flex>
            )
          )}

          {!users.isLoading && !users.error && (
            <Table header={[{ text: 'Data' }, { text: 'Ação' }]}>
              {users.data?.data.map((log: Log) => {
                return (
                  <Tr>
                    <Th color="gray.800" fontWeight="normal">
                      <Text fontSize="10px">
                        {formatBRDate(log.created_at)}
                      </Text>
                      <Text fontSize="sm">{getHour(log.created_at)}</Text>
                    </Th>
                    <Th
                      color="gray.700"
                      fontWeight="normal"
                      textTransform="capitalize"
                    >
                      {log.action}
                    </Th>
                  </Tr>
                )
              })}
            </Table>
          )}
        </Board>
      </Stack>
    </MainBoard>
  )
}
