import { SolidButton } from '../../../components/Buttons/SolidButton'
import { MainBoard } from '../../../components/MainBoard'

import { BillCategory } from '../../../types'

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg'
import { ReactComponent as EllipseIcon } from '../../../assets/icons/Ellipse.svg'
import { ReactComponent as BackArrow } from '../../../assets/icons/Back Arrow.svg'
import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg'
import { ReactComponent as LinkIcon } from '../../../assets/icons/Link.svg'

import { Flex, HStack, SimpleGrid, Text } from '@chakra-ui/layout'
import { IconButton } from '@chakra-ui/button'
import { Input } from '../../../components/Forms/Inputs/Input'
import { ColorPicker } from '../../../components/Forms/ColorPicker'
import { useEffect, useState } from 'react'
import { api } from '../../../services/api'

import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useToast } from '@chakra-ui/toast'
import { useErrors } from '../../../hooks/useErrors'
import { useHistory } from 'react-router'
import { Spinner } from '@chakra-ui/spinner'
import { EditBillCategoryModal } from './EditBillCategoryModal'
import { ConfirmBillCategoryRemoveModal } from './ConfirmBillCategoryRemoveModal'
import { ControlledCheckbox } from '../../../components/Forms/CheckBox/ControlledCheckbox'
import { useWorkingCompany } from '../../../hooks/useWorkingCompany'
import { Stack } from '@chakra-ui/react'
import { CompanySelectMaster } from '../../../components/CompanySelect/companySelectMaster'
import { useWorkingBranch } from '../../../hooks/useWorkingBranch'
import { Link } from 'react-router-dom'

interface CreateNewBillCategoryFormData {
  name: string
  color: string
  individual: boolean
}

const CreateNewBillCategoryFormSchema = yup.object().shape({
  name: yup.string().required('Insira um nome para a categoria.'),
  color: yup.string(),
  individual: yup.boolean()
})

export default function BillCategories() {
  const workingCompany = useWorkingCompany()
  const workingBranch = useWorkingBranch()

  const [categories, setCategories] = useState<BillCategory[]>([])
  const [color, setColor] = useState('#ffffff')
  const toast = useToast()
  const history = useHistory()
  const { showErrors } = useErrors()

  const [toEditcolor, setToEditColor] = useState('#ffffff')

  function changeColor(color: string) {
    setToEditColor(color)
  }

  const [isEditBillCategoryModalOpen, setIsEditBillCategoryModalOpen] =
    useState(false)
  const [editBillCategoryData, setEditBillCategoryData] =
    useState<BillCategory>(() => {
      const data: BillCategory = {
        name: '',
        id: 0,
        color: '#ffffff',
        individual: false
      }

      return data
    })

  function OpenEditBillCategoryModal(categoryId: number) {
    handleChangeBillCategory(categoryId)
    setIsEditBillCategoryModalOpen(true)
  }
  function CloseEditBillCategoryModal() {
    setIsEditBillCategoryModalOpen(false)
  }

  const [BillCategoryId, setBillCategoryId] = useState(0)
  const [
    isConfirmBillCategoryRemoveModalOpen,
    setIsConfirmBillCategoryRemoveModalOpen
  ] = useState(false)

  function OpenConfirmBillCategoryRemoveModal(categoryId: number) {
    setBillCategoryId(categoryId)
    setIsConfirmBillCategoryRemoveModalOpen(true)
  }
  function CloseConfirmBillCategoryRemoveModal() {
    setIsConfirmBillCategoryRemoveModalOpen(false)
  }

  function handleChangeBillCategory(categoryId: number) {
    const selectedBillData = categories.filter(
      (category: BillCategory) => category.id === categoryId
    )[0]

    changeColor(selectedBillData.color)
    setEditBillCategoryData(selectedBillData)
  }

  const { register, control, handleSubmit, reset, formState } =
    useForm<CreateNewBillCategoryFormData>({
      resolver: yupResolver(CreateNewBillCategoryFormSchema)
    })

  const loadCategories = async () => {
    const { data } = await api.get('/bill_categories', {
      params: {
        company: workingCompany.company?.id,
        branch: workingBranch.branch?.id
      }
    })

    setCategories(data)
  }

  useEffect(() => {
    loadCategories()
  }, [workingCompany, workingBranch])

  const handleCreateCategory = async (
    BillCategoryData: CreateNewBillCategoryFormData
  ) => {
    BillCategoryData.color = color

    if (color === '#ffffff') {
      toast({
        title: 'Ops',
        description: `Selecione uma cor diferente`,
        status: 'warning',
        duration: 12000,
        isClosable: true
      })

      return
    }

    try {
      await api.post('/bill_categories/store', BillCategoryData)

      toast({
        title: 'Sucesso',
        description: `A nova categoria ${BillCategoryData.name} foi cadastrada`,
        status: 'success',
        duration: 12000,
        isClosable: true
      })

      reset()
      loadCategories()
    } catch (error: any) {
      showErrors(error, toast)

      if (error.response.data.access) {
        history.push('/')
      }
    }
  }

  return (
    <MainBoard
      sidebar="financial"
      header={
        <Stack>
          <CompanySelectMaster />

          <HStack>
            <Link to="/receber">
              <BackArrow width="20px" stroke="#4e4b66" fill="none" />
            </Link>
            <Text color="gray.800" ml="4" whiteSpace="nowrap">
              / Categorias de Contas a Receber
            </Text>
          </HStack>
        </Stack>
      }
    >
      <EditBillCategoryModal
        afterEdit={loadCategories}
        color={toEditcolor}
        changeColor={changeColor}
        toEditBillCategoryData={editBillCategoryData}
        isOpen={isEditBillCategoryModalOpen}
        onRequestClose={CloseEditBillCategoryModal}
      />
      <ConfirmBillCategoryRemoveModal
        afterRemove={loadCategories}
        toRemoveBillCategoryId={BillCategoryId}
        isOpen={isConfirmBillCategoryRemoveModalOpen}
        onRequestClose={CloseConfirmBillCategoryRemoveModal}
      />

      <Stack
        mt={['6', '0']}
        direction={['column', 'row']}
        as="form"
        spacing="4"
        mb="10"
        onSubmit={handleSubmit(handleCreateCategory)}
      >
        <HStack>
          <ColorPicker color={color} setNewColor={setColor} />
          <Input
            name="name"
            register={register}
            type="text"
            placeholder="Categoria"
            variant="outline"
            maxW="200px"
            error={formState.errors.name}
          />
        </HStack>

        <Flex as="div">
          <ControlledCheckbox
            label="Desabilitar no resultado"
            control={control}
            defaultIsChecked={false}
            name="individual"
            error={formState.errors.individual}
          />
        </Flex>

        <SolidButton
          type="submit"
          mb="10"
          color="white"
          bg="blue.400"
          icon={PlusIcon}
          colorScheme="blue"
        >
          Adicionar
        </SolidButton>
      </Stack>

      <SimpleGrid columns={3} minChildWidth="260px" gap={6}>
        {!categories ? (
          <Flex justify="center" flexWrap="wrap">
            <Spinner />
          </Flex>
        ) : (
          categories.map(category => {
            return (
              <Flex
                key={category.name}
                w="100%"
                justify="space-between"
                fontWeight="500"
                alignItems="center"
                bg="white"
                borderRadius="full"
                shadow="xl"
                h="54px"
                px="8"
              >
                <Flex
                  alignItems="center"
                  cursor="pointer"
                  onClick={() => OpenEditBillCategoryModal(category.id)}
                >
                  <EllipseIcon
                    stroke="none"
                    fill={category.color ? category.color : '#dddddd'}
                  />
                  <Text
                    mx="4"
                    color={category.color ? category.color : '#dddddd'}
                  >
                    {category.name}
                  </Text>
                  {category.individual ? (
                    <LinkIcon
                      width="19px"
                      height="19px"
                      stroke="none"
                      fill={category.color ? category.color : '#dddddd'}
                    />
                  ) : (
                    ''
                  )}
                </Flex>

                <IconButton
                  onClick={() =>
                    OpenConfirmBillCategoryRemoveModal(category.id)
                  }
                  h="24px"
                  w="23px"
                  p="0"
                  float="right"
                  aria-label="Excluir categoria"
                  border="none"
                  icon={<CloseIcon width="20px" stroke="#C30052" fill="none" />}
                  variant="outline"
                />
              </Flex>
            )
          })
        )}
      </SimpleGrid>
    </MainBoard>
  )
}
