import { HStack, Text } from '@chakra-ui/react'
import { CompanySelect, filter } from '.'
import { HasPermission, useProfile } from '../../hooks/useProfile'
import { useWorkingBranch } from '../../hooks/useWorkingBranch'
import { useWorkingCompany } from '../../hooks/useWorkingCompany'
import { Branch } from '../../types'
import { BranchSelect } from '../BranchSelect'

interface CompanySelectMasterProps {
  filters?: filter[]
}

export function CompanySelectMaster({
  filters,
  ...rest
}: CompanySelectMasterProps) {
  const { permissions, profile } = useProfile()
  const workingBranch = useWorkingBranch()
  const workingCompany = useWorkingCompany()
  const hasBranches =
    profile && profile.branches
      ? profile.branches.filter(
          (branch: Branch) => branch.company.id === workingCompany.company?.id
        ).length > 0
      : false

  return (permissions && HasPermission(permissions, 'Todas Empresas')) ||
    (profile && profile.companies && profile.companies.length > 1) ? (
    <HStack spacing="6" alignItems="baseline">
      <CompanySelect filters={filters} />
      {(profile &&
        profile.branches &&
        profile.branches.length > 1 &&
        hasBranches) ||
      (hasBranches && profile && profile.role.name === 'Diretor') ? (
        <BranchSelect filters={filters} />
      ) : workingBranch.branch ? (
        <Text whiteSpace="nowrap">{workingBranch.branch.name}</Text>
      ) : (
        <></>
      )}
    </HStack>
  ) : (
    <></>
  )
}
