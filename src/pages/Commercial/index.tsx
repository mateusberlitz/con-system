import { Box, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SolidButton } from "../../components/Buttons/SolidButton";
import { CompanySelectMaster } from "../../components/CompanySelect/companySelectMaster";
import { MainBoard } from "../../components/MainBoard";
import { HasPermission, useProfile } from "../../hooks/useProfile";
import { TaskFilterData, useTasks } from "../../hooks/useTasks";
import { useWorkingBranch } from "../../hooks/useWorkingBranch";
import { useWorkingCompany } from "../../hooks/useWorkingCompany";
import { TasksSummary } from "../Financial/TasksSummary";
import { LeadsReport } from "./LeadsReport";
import { LeadsReportByMonth } from "./LeadsReportByMonth";
import { LeadsSummary } from "./LeadsSummary";
import { SchedulesSummary } from "./SchedulesSummary";

import { ReactComponent as PlusIcon } from "../../assets/icons/Plus.svg";
import { NewSaleModal } from "./Sales/NewSaleModal";
import SalesHistoryGrafic from "./SalesHistoryGrafic";
import SalesChargesGrafics from "./SalesChargebacksGrafic";
import PurchasedSements from "./PurchasedSegments";
import SchedulingSales from "./SchedulingSales";
import { CurrentGoal } from "./CurrentGoal";
import TeamRankingTable from "./TeamRanking";
import { SalesSummary } from "./SalesSummary";
import TeamsRankingsTable from "./TeamsRankings";

export default function Commercial() {
  const { profile, permissions } = useProfile();
  const workingCompany = useWorkingCompany();
  const workingBranch = useWorkingBranch();

  const [page, setPage] = useState(1);

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const [tasksFilter, setTasksFilter] = useState<TaskFilterData>(() => {
    const data: TaskFilterData = {
      search: "",
      company: workingCompany.company?.id,
      branch: workingBranch.branch?.id,
      author: profile ? profile.id : 0,
    };

    return data;
  });

  const tasks = useTasks(tasksFilter, page);

  const canBeManager = HasPermission(permissions, "Comercial Completo");

  const [isManager, setIsManager] = useState(canBeManager);

  useEffect(() => {
    setTasksFilter({
      ...tasksFilter,
      company: workingCompany.company?.id,
      branch: workingBranch.branch?.id,
    });
  }, [workingCompany, workingBranch]);

  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);

  function OpenNewSaleModal() {
    //setAddSaleToLeadData(leadData)
    setIsNewSaleModalOpen(true);
  }
  function CloseNewSaleModal() {
    setIsNewSaleModalOpen(false);
  }

  return (
    <MainBoard sidebar="commercial" header={<CompanySelectMaster />}>
      <NewSaleModal isOpen={isNewSaleModalOpen} onRequestClose={CloseNewSaleModal}/>

      <Stack fontSize="13px" spacing="12">
        <HStack justifyContent="space-between" alignItems="center">
          <SolidButton color="white" bg="orange.400" icon={PlusIcon} colorScheme="orange" onClick={OpenNewSaleModal}>
            Adicionar Venda
          </SolidButton>

          {canBeManager && (
            <Flex alignItems="center" h="45px" bg="gray.200" borderRadius="full" w="180px" pos="relative" cursor="pointer" onClick={() => setIsManager(!isManager)}>
              <Box h="32px" w={isManager ? "77px" : "73px"} bg="orange.400" pos="absolute" transform={isManager ? "translateX(8px)" : "translateX(98px)"} transition={"all ease 0.3s"} borderRadius="full" />

              <HStack justifyContent="space-between" w="100%" px="5" pos="absolute">
                <Text color={isManager ? "white" : "auto"} transition={"all ease 0.3s"}>
                  Gerente
                </Text>
                <Text color={!isManager ? "white" : "auto"} transition={"all ease 0.3s"}>
                  Pessoal
                </Text>
              </HStack>
            </Flex>
          )}
        </HStack>
        <Stack>
          <CurrentGoal />
        </Stack>

        <Stack direction={["column", "column", "row"]} spacing="8" alignItems="flex-start">
          {/* PAGAMENTOS */}
          <HStack spacing="8" w={["100%", "100%", "100%"]}>
            <LeadsSummary />

            <SchedulesSummary />
          </HStack>

          {/* TAREFAS */}
        </Stack>
    
        <Stack
          direction={["column", "column", "row"]}
          spacing="8"
          alignItems="flex-start"
        >
          <Stack spacing="8" w={["100%", "100%", "100%"]}>
            <TasksSummary tasks={tasks} page={page} setPage={handleChangePage}/>
          </Stack>
          {/* PAGAMENTOS */}
          {/* <Stack spacing="8" w={["100%", "100%", "65%"]}>
          </Stack> */}

          {/* TAREFAS */}
        </Stack>

        <HStack spacing="8" alignItems="flex-start">
          <Stack spacing="8" w={["50%", "50%", "35%"]}>
            <SalesSummary />
          </Stack>
          {/* PAGAMENTOS */}
          <Stack spacing="8" w="100%">
            <LeadsReport />

            <TeamRankingTable />

            <TeamsRankingsTable />
          </Stack>
        </HStack>

        <LeadsReportByMonth />
            
      </Stack>
      <Stack fontSize="13px">
        <HStack spacing="8" w="100%" mt={6} mb={2}>
          <SalesHistoryGrafic />

          <SalesChargesGrafics />
        </HStack>
        <Stack spacing="8" w="100%">
          <HStack spacing="8" w="100%" mt={4} mb={2}>
            <PurchasedSements />
            
            <SchedulingSales />
          </HStack>
        </Stack>
      </Stack>
    </MainBoard>
  );
}
