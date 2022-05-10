import { SolidButton } from '../../../components/Buttons/SolidButton'
import { CompanySelectMaster } from '../../../components/CompanySelect/companySelectMaster'
import { MainBoard } from '../../../components/MainBoard'

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg'

export default function Teams() {
  return (
    <MainBoard sidebar="commercial" header={<CompanySelectMaster />} >
      <SolidButton
        onClick={() => {}}
        mb="12"
        color="white"
        bg="purple.300"
        icon={PlusIcon}
        colorScheme="purple"
      >
        Adicionar Usuário
      </SolidButton>
    </MainBoard>
  )
}
