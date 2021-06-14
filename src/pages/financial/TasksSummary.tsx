import { Text, Stack,Flex, Spinner, HStack, Tag } from "@chakra-ui/react";
import { UseQueryResult } from "react-query";
import { SolidButton } from "../../components/Buttons/SolidButton";
import { Payment } from "../../types";
import { formatDate } from "../../utils/Date/formatDate";
import { formatYmdDate } from "../../utils/Date/formatYmdDate";
import { getDay } from "../../utils/Date/getDay";
import { PayPaymentFormData } from "./Payments/PayPaymentModal";


import { ReactComponent as EllipseIcon } from '../../assets/icons/Ellipse.svg';
import { ReactComponent as AttachIcon } from '../../assets/icons/Attach.svg';
import { ReactComponent as CheckIcon } from '../../assets/icons/Check.svg';
import { formatBRDate } from "../../utils/Date/formatBRDate";
import { Divider } from "@chakra-ui/react";

interface TasksSummaryProps{
    tasks: UseQueryResult<{
        data: any;
        total: number;
    }, unknown>;
    openRemoveTask: (toPayPaymentData: PayPaymentFormData) => void;
}

export function TasksSummary(){
    return (
        <Stack w="55%" min-width="300px" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8">
            <Text fontSize="xl" mb="8" w="100%" fontWeight="semibold">Agenda</Text>

            <Flex flexDirection="row" >
                <Text mr="4" fontWeight="bold" color="gray.800" fontSize="sm">15/06/2020</Text>
                <hr style={{width: "100%", marginTop: "10px", borderTopWidth: "2px"}} />
            </Flex> 

            <Flex>
                <Tag padding="2" width="55px" textAlign="center" fontSize="sm" borderRadius="full" variant="solid" colorScheme="green">
                    14:20
                </Tag>
            </Flex>

        </Stack>
    )
}