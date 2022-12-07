import { Box, Flex, Heading, HStack, Icon, Spinner, Stack, Text } from '@chakra-ui/react'

import { ReactComponent as SettingsIcon } from '../../assets/icons/Settings.svg'
import { ReactComponent as ChartBarIcon } from '../../assets/icons/Chart-bar.svg'
import { ReactComponent as CartIcon } from '../../assets/icons/Cart.svg'
import { ReactComponent as BagIcon } from '../../assets/icons/Bag.svg'

import { Profile } from '../../components/Profile'
import { Alert } from '../../components/Alert'
import { HasPermission, useProfile } from '../../hooks/useProfile'
import { useTenant } from '../../hooks/useTenant'
import { Logo } from '../../components/Logo'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Branch, Company, CompanyCommissionRule, SellerCommissionRule } from '../../types'
import { api } from '../../services/api'
import { Board } from '../../components/Board'
import { SolidButton } from '../../components/Buttons/SolidButton'

import { NewCompanyModal } from '../configs/Companys/NewCompanyModal'
import { RemoveButton } from '../../components/Buttons/RemoveButton'
import { EditButton } from '../../components/Buttons/EditButton'
import { ConfirmCompanyRemoveModal } from '../configs/Companys/ConfirmCompanyRemoveModal'
import { EditCompanyModal } from '../configs/Companys/EditCompanyModal'
import { CompanyStep } from './CompanyStep'
import { BranchStep } from './BranchStep'
import { CompanyCommissionRuleStep } from './CompanyCommissionRuleStep'
import { SellerCommissionRuleStep } from './SellerCommissionRuleStep'

export default function Start() {
  const { permissions } = useProfile();
  const { prefix } = useTenant();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);

  const [firstBranch, setFirstBranch] = useState<Branch>();
  const [firstCompany, setFirstCompany] = useState<Company>();

  const [companyCommissionRule, setCompanyCommissionRule] = useState<CompanyCommissionRule>();
  const [firstSellerCommissionRule, setFirstSellerCommissionRule] = useState<SellerCommissionRule>();

  useEffect(() => {
    if(firstSellerCommissionRule){//companyCommissionRule
      //setStep(3);
      setLoading(false);
      //handleSaveInitiatedComplete();
      return;
    }

    if(firstBranch && firstCompany){
      setStep(2);
      setLoading(true);
    }
  }, [firstBranch, firstCompany, firstSellerCommissionRule])

  const handleSaveInitiatedComplete = async () => {
    api.put('/configs/1', {initiated: true}).then(() => {
      localStorage.setItem('@lance/firstSteps', JSON.stringify(1));

      window.location.reload();
    });
  }

  console.log(firstSellerCommissionRule, loading);
  
  return (
    <Flex direction="column" h="100vh">
      <Alert />

      <Flex w="100%" my="14" maxWidth={1280} mx="auto" px="6" direction="column">
        <Flex w="100%" mb="16">
          <Logo/>
          <Profile />
        </Flex>

        <Stack mb="20">
          <Text fontWeight="700" fontSize="3xl">Seja Bem-vindo!</Text>
          <Text fontSize="md" color="gray.800">Conclua seus primeiros passos</Text>
        </Stack>

        <Stack spacing="10" alignItems={"right"}>
          {
            (step === 1) && (
              <>
                <Stack direction={["column", "column", "row"]} justifyContent="space-between" spacing="8">
                  <CompanyStep loading={loading}  firstCompany={firstCompany} setFirstCompany={setFirstCompany}/>

                  <BranchStep loading={loading} firstBranch={firstBranch} setFirstBranch={setFirstBranch}/>
                </Stack>
                {
                  (firstBranch && firstCompany ) && (
                    <Box w="100%">
                      <SolidButton float="right" mb="12" color="white" bg="purple.300" colorScheme="purple" onClick={() => {setStep(2)}}>
                        Prosseguir
                      </SolidButton>
                    </Box>
                  )
                }
              </>
            )
          }

          {
            (step === 2) && (
              <>
                <Stack direction={["column", "column", "row"]} justifyContent="space-between" spacing="8">
                  {/* <CompanyCommissionRuleStep companyCommissionRule={companyCommissionRule} setCompanyCommissionRule={setCompanyCommissionRule}/> */}

                  <SellerCommissionRuleStep loading={loading} firstSellerCommissionRule={firstSellerCommissionRule} firstBranch={firstBranch} firstCompany={firstCompany} setFirstSellerCommissionRule={setFirstSellerCommissionRule}/>
                </Stack>
                {
                  (firstBranch && firstCompany ) && (
                    <Box w="100%">
                      <SolidButton float="right" mb="12" color="white" bg="purple.300" colorScheme="purple" onClick={() => handleSaveInitiatedComplete()}>
                        Concluir
                      </SolidButton>
                    </Box>
                  )
                }
              </>
            )
          }

          {
            // (step === 3) && (
            //   <>
            //     <Stack direction={["column", "column", "row"]} justifyContent="space-between" spacing="8">
            //       <CompanyCommissionRuleStep companyCommissionRule={companyCommissionRule} setCompanyCommissionRule={setCompanyCommissionRule}/>

            //       <SellerCommissionRuleStep firstSellerCommissionRule={firstSellerCommissionRule} firstBranch={firstBranch} firstCompany={firstCompany} setFirstSellerCommissionRule={setFirstSellerCommissionRule}/>
            //     </Stack>
                
            //     <Box w="100%">
            //       <SolidButton float="right" mb="12" color="white" bg="purple.300" colorScheme="purple" onClick={() => {setStep(2)}}>
            //         Concluir
            //       </SolidButton>
            //     </Box>
            //   </>
            // )
          }
        </Stack>

        
      </Flex>
    </Flex>
  )
}
