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
import { ControlledInput } from "../../components/Forms/Inputs/ControlledInput";

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatYmdDate } from "../../utils/Date/formatYmdDate";

interface FilterDashboardDateFormData{
    start_date: string;
    end_date: string;
}

const FilterDashboardDate = yup.object().shape({
    start_date: yup.string(),
    end_date: yup.string(),
});

export default function Commercial() {
    const { profile, permissions } = useProfile();
    const workingCompany = useWorkingCompany();
    const workingBranch = useWorkingBranch();

    const [page, setPage] = useState(1);

    const today = new Date();
    const monthBegin = new Date(today.getFullYear(), today.getMonth(), 1);

    const [startDate, setStartDate] = useState<string>(formatYmdDate(monthBegin.toString()));
    const [endDate, setEndDate] = useState<string>(formatYmdDate(today.toString()));

  const handleChangePage = (page: number) => {
    setPage(page);
  };

    const { register, handleSubmit, formState, control, watch, getValues} = useForm<FilterDashboardDateFormData>({
        resolver: yupResolver(FilterDashboardDate),
    });

  const [tasksFilter, setTasksFilter] = useState<TaskFilterData>(() => {
    const data: TaskFilterData = {
      search: "",
      company: workingCompany.company?.id,
      branch: workingBranch.branch?.id,
      author: profile ? profile.id : 0,
      start_date: startDate,
      end_date: endDate,
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
      start_date: startDate,
      end_date: endDate,
    });
  }, [workingCompany, workingBranch, startDate, endDate]);

  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);

  function OpenNewSaleModal() {
    //setAddSaleToLeadData(leadData)
    setIsNewSaleModalOpen(true);
  }
  function CloseNewSaleModal() {
    setIsNewSaleModalOpen(false);
  }

    useEffect(() => {
        setStartDate(getValues('start_date'));
    }, [watch('start_date')]);

    useEffect(() => {
        setEndDate(getValues('end_date'));
    }, [watch('end_date')]);

  return (
    <MainBoard sidebar="commercial" header={<CompanySelectMaster />}>
      <NewSaleModal isOpen={isNewSaleModalOpen} onRequestClose={CloseNewSaleModal}/>

      <Stack fontSize="13px" spacing="12" pos="relative">
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

            <Stack spacing="12" pos="relative">
                <HStack spacing="6" w="66.6%" position={"fixed"} boxShadow="lg" bottom="8px" bg="rgba(255,255,255,1)" p="5" borderRadius={24} zIndex="9">
                    <Text>Filtro de data:</Text>

                    <ControlledInput maxW="250px" control={control} name="start_date" value={formatYmdDate(monthBegin.toString())} type="date" error={formState.errors.start_date} placeholder="Data Inicial" variant="filled" focusBorderColor="red.400"/>
                    <ControlledInput maxW="250px" control={control} name="end_date" value={formatYmdDate(today.toString())} type="date" error={formState.errors.end_date} placeholder="Data Final" variant="filled" focusBorderColor="red.400"/>
                </HStack>

                <Stack>
                    <CurrentGoal />
                </Stack>

                <Stack direction={["column", "column", "row"]} spacing="8" alignItems="flex-start">
                    {/* PAGAMENTOS */}
                    <HStack spacing="8" w={["100%", "100%", "100%"]}>
                        <LeadsSummary startDate={startDate} endDate={endDate}/>

                        <SchedulesSummary startDate={startDate} endDate={endDate}/>
                    </HStack>

                    {/* TAREFAS */}
                </Stack>
        
                <Stack
                direction={["column", "column", "row"]}
                spacing="8"
                alignItems="flex-start"
                >
                    <SalesSummary startDate={startDate} endDate={endDate}/>
                    <Stack spacing="8" w={["100%", "100%", "100%"]}>
                        <TasksSummary tasks={tasks} page={page} setPage={handleChangePage}/>
                    </Stack>

                    {/* TAREFAS */}
                </Stack>

                <HStack spacing="8" alignItems="flex-start">
                    {/* PAGAMENTOS */}
                    <Stack spacing="8" w="100%">
                        <LeadsReport startDate={startDate} endDate={endDate}/>

                        <TeamRankingTable startDate={startDate} endDate={endDate} />

                        {
                            (profile && profile.role.id === 1) && (
                                <TeamsRankingsTable startDate={startDate} endDate={endDate} />
                            )
                        }
                    </Stack>
                </HStack>

                <LeadsReportByMonth />

                <Stack fontSize="13px">
                    <HStack spacing="8" w="100%" mt={6} mb={2}>
                        <SalesHistoryGrafic isManager={isManager}/>

                        <SalesChargesGrafics isManager={isManager}/>
                    </HStack>
                    <Stack spacing="8" w="100%">
                        <HStack spacing="8" w="100%" mt={4} mb={2}>
                            {/* <PurchasedSements /> */}
                        
                            <SchedulingSales maxW="50%" isManager={isManager}/>
                        </HStack>
                    </Stack>
                </Stack>
            </Stack>
      </Stack>
    </MainBoard>
  );
}
