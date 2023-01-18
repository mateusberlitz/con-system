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
import { Board } from '../../../../components/Board'
import { OutlineButton } from '../../../../components/Buttons/OutlineButton'
import { CompanySelectMaster } from '../../../../components/CompanySelect/companySelectMaster'
import { Input } from '../../../../components/Forms/Inputs/Input'
import { MainBoard } from '../../../../components/MainBoard'
import { Table } from '../../../../components/Table'
import { api } from '../../../../services/api'
import { ContractLog, Log, User } from '../../../../types'
import { LogsFilterData, useLogs } from '../../../../hooks/useLogs'
import { formatYmdDate } from '../../../../utils/Date/formatYmdDate'
import { formatBRDate } from '../../../../utils/Date/formatBRDate'
import { getHour } from '../../../../utils/Date/getHour'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ReactComponent as BackArrow } from '../../../../assets/icons/Back Arrow.svg'
import { HasPermission, useProfile } from '../../../../hooks/useProfile'
import { useWorkingCompany } from '../../../../hooks/useWorkingCompany'
import { useWorkingBranch } from '../../../../hooks/useWorkingBranch'
import { ContractLogsFilterData, useContractLogs } from '../../../../hooks/useContractLogs'

interface LogParams {
  user: string
}

const EditQuotaFormSchema = yup.object().shape({
  search: yup.string().nullable()
})

export function ContractLogs() {
    const { profile, permissions } = useProfile();
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();
    const [page, setPage] = useState(1);

    const isManager = HasPermission(permissions, 'Comercial Completo');

    const [filter, setFilter] = useState<ContractLogsFilterData>(() => {
        const data: ContractLogsFilterData = {
            search: '',
            company_id: workingCompany.company?.id,
            branch_id: workingBranch.branch?.id,
            seller_id: !HasPermission(permissions, 'Comissões Completo') && !isManager ? (profile ? profile.id : 0) : undefined,
            team_id: isManager ? (profile && profile.teams.length > 0 ? profile.teams[0].id : undefined) : undefined
        };

        return data;
    })


    const handleSearchContractsLog = async (search : ContractLogsFilterData) => {
        setPage(1);
        setFilter({...filter, ...search});
    }

     useEffect(() => {
        setFilter({...filter, company_id: workingCompany.company?.id, branch_id: workingBranch.branch?.id});
    }, [workingCompany, workingBranch]);

    const logs = useContractLogs(filter, 1);

  return (
    <MainBoard sidebar="commissions" header={<CompanySelectMaster />}>
      <Stack spacing="10">
        <HStack w="100%">
          <HStack spacing="3" height="50px" w="100%">
            <Link href="/contratos" width={"fit-content"}>
              <Flex display="flex" flexDirection="row" width={"fit-content"}>
                <BackArrow width="20px" stroke="#4e4b66" fill="none" />
              </Flex>
            </Link>

            <Divider orientation="vertical" />

            <Stack>
              <Text fontSize="12px" fontWeight="semibold" color="gray.700" width={"fit-content"}>
                Contratos não cadastrados
              </Text>
            </Stack>
          </HStack>

          {/* <HStack
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
          </HStack>*/}
        </HStack>

        <Board>
          {logs.isLoading ? (
            <Flex justify="center">
              <Spinner />
            </Flex>
          ) : logs.isError ? (
            <Flex justify="center" mt="4" mb="4">
                <Text>Erro ao listar contrato</Text>
            </Flex>
          ) : (
            logs.data?.data.length === 0 && (
              <Flex justify="center">
                <Text>Nenhum contrato não cadastrado encontrado.</Text>
              </Flex>
            )
          )}

          {!logs.isLoading && !logs.error && (
            <Table header={[{ text: 'Data' }, { text: 'Contrato' }]}>
              {logs.data?.data.data.map((log: ContractLog) => {
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
                      {log.number_contract}
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
