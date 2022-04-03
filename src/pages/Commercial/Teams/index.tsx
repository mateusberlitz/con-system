import { CompanySelectMaster } from '../../../components/CompanySelect/companySelectMaster'
import { MainBoard } from '../../../components/MainBoard'

export default function Teams() {
  return (
    <MainBoard
      sidebar="commercial"
      header={<CompanySelectMaster />}
    >

    </MainBoard>
  )
}
