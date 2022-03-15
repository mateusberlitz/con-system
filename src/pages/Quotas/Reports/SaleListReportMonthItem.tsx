import { HStack, Th, Tr, Text } from "@chakra-ui/react";
import { useState } from "react";
import { QuotaSale } from "../../../types";
import { formatBRDate } from "../../../utils/Date/formatBRDate";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as MinusIcon } from '../../../assets/icons/Minus.svg';

interface SaleListReportItemProps{
    open?: boolean;
    month: string;
    quotaSales: QuotaSale[];
}

export function SaleListReportMonthItem({open = false, month, quotaSales} : SaleListReportItemProps){
    const [isOpen, setIsOpen] = useState(open);

    const handleOpen = () => {
        setIsOpen(!isOpen);
    }

    console.log(quotaSales);

    return (
        <>
            <Tr cursor="pointer" transition="all ease 2s" alignItems="center" _hover={{transition: "all ease 2s"}} borderLeft="1px solid" borderColor="gray.400">
                <Th color="gray.900" onClick={handleOpen} alignItems="center" display="flex">
                        {
                            isOpen ? 
                            <MinusIcon stroke="#14142b" fill="none" width="12px"/>
                            :
                            <PlusIcon stroke="#14142b" fill="none" width="12px"/>
                        }
                        <Text ml="2">{month}</Text>
                </Th>
            </Tr>

            {
                quotaSales.map((quotaSale:QuotaSale) => (
                    <Tr display={isOpen ? 'table-row' : 'none'} opacity={isOpen ? 1 : 0} borderLeft="1px solid" borderColor="gray.400" transition="all ease 2s" _hover={{transition: "all ease 2s"}}>
                        <Th color="gray.800" fontWeight="normal">{formatBRDate(quotaSale.sale_date)}</Th>
                        <Th color="gray.800" fontWeight="normal">{quotaSale.ready_quota.group}-{quotaSale.ready_quota.quota}</Th>
                        <Th color="green.400" fontWeight="normal">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.value - quotaSale.ready_quota.cost - quotaSale.partner_value - (quotaSale.coordinator_value ? quotaSale.coordinator_value : 0) - (quotaSale.supervisor_value ? quotaSale.supervisor_value : 0))}</Th>
                        <Th color="gray.800" fontWeight="normal">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.value)}</Th>
                        <Th color="gray.800" fontWeight="normal">{quotaSale.ready_quota.segment}</Th>
                        <Th color="gray.800" fontWeight="normal">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.ready_quota.credit)}</Th>
                        <Th color="gray.800" fontWeight="normal">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.ready_quota.total_cost)}</Th>
                        <Th color="gray.800" fontWeight="normal">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.ready_quota.partner_cost ? quotaSale.ready_quota.partner_cost : 0)}</Th>
                        <Th color="gray.800" fontWeight="normal">{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.partner_value && quotaSale.ready_quota.partner_cost ? (quotaSale.partner_value - quotaSale.ready_quota.partner_cost) : 0)}</Th>
                        <Th color="gray.800" fontWeight="normal">{quotaSale.coordinator ? quotaSale.coordinator : '--'}<br />{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.coordinator_value ? quotaSale.coordinator_value : 0)}</Th>
                        <Th color="gray.800" fontWeight="normal">{quotaSale.supervisor ? quotaSale.supervisor : '--'}<br />{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(quotaSale.supervisor_value ? quotaSale.supervisor_value : 0)}</Th>
                        <Th color="gray.800" fontWeight="normal">{quotaSale.seller}</Th>
                        <Th color="gray.800" fontWeight="normal">{quotaSale.buyer}</Th>
                    </Tr>
                ))
            }
        </>
    )
}