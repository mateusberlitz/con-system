import { Flex, Grid, HStack, SimpleGrid, Stack, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { useState } from "react";
import { SolidButton } from "../../components/Buttons/SolidButton";
import { MainBoard } from "../../components/MainBoard";
import { PaymentFilterData, usePayments } from "../../hooks/usePayments";
import { useWorkingCompany } from "../../hooks/useWorkingCompany";
import { Payment } from "../../types";
import { formatBRDate } from "../../utils/Date/formatBRDate";
import { formatDate } from "../../utils/Date/formatDate";
import { formatInputDate } from "../../utils/Date/formatInputDate";
import { formatYmdDate } from "../../utils/Date/formatYmdDate";
import { getDay } from "../../utils/Date/getDay";
import { PayPaymentFormData, PayPaymentModal } from "./Payments/PayPaymentModal";
import { PaymentsSummary } from "./PaymentsSummary";

import { ReactComponent as EllipseIcon } from '../../assets/icons/Ellipse.svg';
import { IconButton } from "@chakra-ui/button";


export default function Financial(){
    const workingCompany = useWorkingCompany();
    console.log(formatInputDate(new Date().toString()));

    const [filter, setFilter] = useState<PaymentFilterData>(() => {
        const data: PaymentFilterData = {
            search: '',
            company: workingCompany.company?.id,
            start_date: formatYmdDate(new Date().toString()),
            end_date: formatYmdDate(new Date().toString()),
        };
        
        return data;
    })

    const payments = usePayments(filter, 1);

    const [isPayPaymentModalOpen, setIsPayPaymentModalOpen] = useState(false);
    const [toPayPaymentData, setToPayPaymentData] = useState<PayPaymentFormData>(() => {

        const data: PayPaymentFormData = {
            id: 0,
            value: '',
            new_value: '',
            title: '',
            company: workingCompany.company?.id,
        };
        
        return data;
    });

    function OpenPayPaymentModal(paymentIdAndName: PayPaymentFormData){
        setToPayPaymentData(paymentIdAndName);
        setIsPayPaymentModalOpen(true);
    }
    function ClosePayPaymentModal(){
        setIsPayPaymentModalOpen(false);
    }

    return(
        <MainBoard sidebar="financial">
            <Stack fontSize="13px" spacing="12">

                <PayPaymentModal afterPay={payments.refetch} toPayPaymentData={toPayPaymentData} isOpen={isPayPaymentModalOpen} onRequestClose={ClosePayPaymentModal}/>

                <HStack spacing="8">
                            {/* PAGAMENTOS */}
                            <PaymentsSummary payments={payments} openPayPayment={OpenPayPaymentModal} />

                            <Flex w="45%" min-width="300px" justify="space-between" fontWeight="500" alignItems="center" bg="white" borderRadius="full" shadow="xl" h="54px" px="8">
                                <Flex alignItems="center" cursor="pointer" >
                                    <EllipseIcon stroke="none" fill="#dddddd"/>
                                    <Text mx="4">teste</Text>
                                </Flex>
                                
                                <IconButton h="24px" w="23px" p="0" float="right" aria-label="Excluir categoria" border="none" icon={ <EllipseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                            </Flex>
                </HStack>

            </Stack>
        </MainBoard>
    );
}