import {
  Avatar,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Stack,
  Td,
  Text,
  Tr
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { SolidButton } from '../../../../components/Buttons/SolidButton'
import { MainBoard } from '../../../../components/MainBoard'
import { useBranches } from '../../../../hooks/useBranches'
import { api } from '../../../../services/api'
import { Branch, Company } from '../../../../types'

import { ReactComponent as BackArrow } from '../../../../assets/icons/Back Arrow.svg'
import { ReactComponent as ProfileIcon } from '../../../../assets/icons/Profile.svg'
import { ReactComponent as LocationIcon } from '../../../../assets/icons/Location.svg'
import { ReactComponent as PlusIcon } from '../../../../assets/icons/Plus.svg'

import { Board } from '../../../../components/Board'
import { Table } from '../../../../components/Table'
import { NewBranchModal } from './NewBranchModal'
import { EditBranchFormData, EditBranchModal } from './EditBranchModal'
import {
  ConfirmBranchRemoveModal,
  RemoveBranchData
} from './ConfirmBranchRemoveModal'
import { OutlineButton } from '../../../../components/Buttons/OutlineButton'
import { useUsers } from '../../../../hooks/useUsers'
import { CompanyRules } from './CompanyRules'
import { SellerCommissionRules } from '../../SellerCommissionsRules'
import { EditButton } from '../../../../components/Buttons/EditButton'
import { RemoveButton } from '../../../../components/Buttons/RemoveButton'
import { MoreVertical } from 'react-feather'
import { ControlledInput } from '../../../../components/Forms/Inputs/ControlledInput'
import { CloseSellerCommissionPeriod } from './CloseSellerCommissionPeriod'

interface CompanyParams {
  id: string
}

export default function CompanyPage() {
  const history = useHistory()
  const { id } = useParams<CompanyParams>()

  const [company, setCompany] = useState<Company>()

  const loadCompanyData = async () => {
    const { data } = await api.get(`/companies/${id}`)

    setCompany(data)
  }

  useEffect(() => {
    loadCompanyData()
  }, [])

  const branches = useBranches({ company: parseInt(id) }, 1);
  const users = useUsers({ company: parseInt(id) });

  const [removeBranch, setRemoveBranch] = useState<RemoveBranchData>(() => {
    const data: RemoveBranchData = {
      id: 0,
      name: ''
    }

    return data
  })

  const [editBranchData, setEditBranchData] = useState<EditBranchFormData>(
    () => {
      const data: EditBranchFormData = {
        id: 0,
        name: '',
        company: 0,
        manager: 0,
        state: 0,
        city: '',
        address: '',
        phone: '',
        email: ''
      }

      return data
    }
  )

  const [isNewBranchModalOpen, setIsNewBranchModalOpen] = useState(false)
  const [isConfirmBranchRemoveModalOpen, setisConfirmBranchRemoveModalOpen] =
    useState(false)
  const [isEditBranchModalOpen, setIsEditBranchModalOpen] = useState(false)

  function OpenNewBranchModal() {
    setIsNewBranchModalOpen(true)
  }
  function CloseNewBranchModal() {
    setIsNewBranchModalOpen(false)
  }

  function OpenEditBranchModal(branchData: EditBranchFormData) {
    setEditBranchData(branchData)
    setIsEditBranchModalOpen(true)
  }
  function CloseEditBranchModal() {
    setIsEditBranchModalOpen(false)
  }

  function OpenConfirmBranchRemoveModal(branchData: RemoveBranchData) {
    setRemoveBranch(branchData)
    setisConfirmBranchRemoveModalOpen(true)
  }
  function CloseConfirmBranchRemoveModal() {
    setisConfirmBranchRemoveModalOpen(false)
  }

  return (
    <>
      <NewBranchModal
        afterCreate={branches.refetch}
        isOpen={isNewBranchModalOpen}
        onRequestClose={CloseNewBranchModal}
      />
      <ConfirmBranchRemoveModal
        afterRemove={branches.refetch}
        isOpen={isConfirmBranchRemoveModalOpen}
        toRemoveBranchData={removeBranch}
        onRequestClose={CloseConfirmBranchRemoveModal}
      />
      <EditBranchModal
        afterEdit={branches.refetch}
        isOpen={isEditBranchModalOpen}
        toEditBranchData={editBranchData}
        onRequestClose={CloseEditBranchModal}
      />

      <MainBoard
        sidebar="configs"
        header={
          company && (
            <HStack>
              <Link to="/empresas">
                <Flex>
                  <BackArrow width="20px" stroke="#4e4b66" fill="none" />
                </Flex>
              </Link>
              <Text color="gray.800" ml="2" whiteSpace="nowrap">
                / {company.name}
              </Text>
            </HStack>
          )
        }
      >
        {company && (
          <Stack spacing="8">
            <HStack justifyContent="space-between">
              <Heading fontSize="2xl">{company.name}</Heading>
              <HStack>
                <LocationIcon width="20px" stroke="#4e4b66" fill="none" />
                <Text>
                  {branches.data && branches.data?.data.length} Filiais
                </Text>
              </HStack>
              <HStack>
                <ProfileIcon width="20px" stroke="#4e4b66" fill="none" />
                <Text>{users.data && users.data?.length} Usuários</Text>
              </HStack>
            </HStack>

            <Divider />

            <Board>
              <HStack mb="4" justifyContent="space-between">
                <Text fontSize="xl">Filiais</Text>

                <SolidButton
                  onClick={() => OpenNewBranchModal()}
                  mb="12"
                  color="white"
                  bg="purple.300"
                  icon={PlusIcon}
                  colorScheme="purple"
                >
                  Adicionar filial
                </SolidButton>
              </HStack>

              {branches.isLoading ? (
                <Flex justify="left">
                  <Spinner />
                </Flex>
              ) : branches.error ? (
                <Flex justify="left" mt="4" mb="4">
                  <Text>Erro listar as filiais</Text>
                </Flex>
              ) : (
                branches.data?.data.length === 0 && (
                  <Flex justify="left">
                    <Text>Nenhuma filial encontrada.</Text>
                  </Flex>
                )
              )}

              {!branches.isLoading &&
                !branches.error &&
                branches.data?.data.length !== 0 && (
                  <Table
                    header={[
                      {
                        text: 'Filial'
                      },
                      {
                        text: 'Local'
                      },
                      {
                        text: 'Cidade'
                      },
                      {
                        text: 'Endereço'
                      },
                      // {
                      //     text: 'E-mail',
                      // },
                      // {
                      //     text: 'Telefone',
                      // },
                      {
                        text: 'Gerente',
                        icon: ProfileIcon
                      },
                      {
                        text: ''
                      }
                    ]}
                  >
                    {/* ITEMS */}
                    {!branches.isLoading &&
                      !branches.error &&
                      branches.data?.data.map((branch: Branch) => {
                        return (
                          <Tr key={branch.id}>
                            <Td alignItems="center" display="flex">
                              <Text
                                display="flex"
                                fontSize="sm"
                                color="gray.700"
                                fontWeight="600"
                                whiteSpace="nowrap"
                              >
                                {branch.name}
                              </Text>
                            </Td>
                            <Td fontSize="sm" color="gray.800" whiteSpace="nowrap">
                              {branch.state.uf}
                            </Td>
                            <Td fontSize="sm" color="gray.800">
                              <Text fontSize="" whiteSpace="nowrap">{branch.city.name}</Text>
                            </Td>

                            <Td fontSize="sm" color="gray.800">
                              {branch.address}
                            </Td>
                            {/* <Td fontSize="sm" color="gray.800">{branch.email}</Td>
                                                    <Td fontSize="sm" color="gray.800">{branch.phone}</Td> */}

                            <Td alignItems="center" display="flex">
                              <Flex
                                mr="4"
                                borderRadius="full"
                                h="fit-content"
                                w="fit-content"
                                bgGradient="linear(to-r, purple.600, blue.300)"
                                p="2px"
                              >
                                <Avatar
                                  borderColor="gray.600"
                                  border="2px"
                                  size="sm"
                                  name={`${branch.manager.name} ${branch.manager.last_name}`}
                                  src={
                                    branch.manager.image
                                      ? `${
                                          process.env.NODE_ENV === 'production'
                                            ? process.env.REACT_APP_API_STORAGE
                                            : process.env
                                                .REACT_APP_API_LOCAL_STORAGE
                                        }${branch.manager.image}`
                                      : ''
                                  }
                                />
                              </Flex>
                              <Text
                                display="flex"
                                fontSize="sm"
                                color="gray.700"
                                fontWeight="600"
                              >
                                {branch.manager.name}{' '}
                                {branch.manager.last_name &&
                                  branch.manager.last_name}
                              </Text>
                            </Td>

                            <Td>
                              <HStack spacing="4">
                                <OutlineButton
                                  size="sm"
                                  colorScheme="purple"
                                  h="28px"
                                  px="5"
                                  onClick={() =>
                                    history.push(`/filiais/${branch.id}`)
                                  }
                                >
                                  Gerenciar
                                </OutlineButton>

                                <Popover>
                                    <PopoverTrigger>
                                        <IconButton aria-label='Opções'><Icon as={MoreVertical} /></IconButton>
                                    </PopoverTrigger>
                                    <PopoverContent w="fit-content" py="2" pr="6">
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        {/* <PopoverHeader>Confirmation!</PopoverHeader> */}
                                        <PopoverBody w="fit-content">
                                            <Stack spacing="4" alignItems={"center"}>
                                                <EditButton w="fit-content" onClick={() => OpenEditBranchModal({id: branch.id, name: branch.name, phone: branch.phone, email: branch.email, company: branch.company.id, manager: branch.manager.id, city: branch.city.name, state: branch.state.id, address: branch.address }) }/>
                                                <RemoveButton w="fit-content" onClick={() => OpenConfirmBranchRemoveModal({ id: branch.id, name: branch.name }) }/>
                                            </Stack>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                              </HStack>
                            </Td>
                          </Tr>
                        )
                      })}
                  </Table>
                )}
            </Board>

            {/* <CompanyRules/> */}
            
            <CloseSellerCommissionPeriod companyId={parseInt(id)}/>

            <SellerCommissionRules companyId={parseInt(id)}/>

            {/* <SolidButton onClick={OpenNewBranchModal} mb="12" color="white" bg="purple.300" icon={PlusIcon} colorScheme="purple">
                                Adicionar Filial
                            </SolidButton> */}
          </Stack>
        )}
      </MainBoard>
    </>
  )
}
