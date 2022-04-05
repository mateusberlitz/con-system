import { Text, Stack,Link } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

import { ReactComponent as CheckIcon } from '../../assets/icons/Check.svg';
import { Branch, Company } from "../../types";

interface RemoveTaskData{
    id: number;
}

interface CashSummaryFilter{
    company: number | undefined;
    branch?: number | undefined;
}

interface CashSummaryProps{
    company: Company | undefined;
    branch?: Branch | undefined | null;
}

export function CashSummary({company, branch}: CashSummaryProps){
    const workingCompany = company;
    const workingBranch = branch;

    const [amount, setAmount] = useState(0);

    const loadAmount = async () => {
        const filterAmount:CashSummaryFilter = {
            company: company?.id,
            branch: branch?.id,
        };

        const { data } = await api.get('/amount', {
            params: {
                company: (company && company.id ? company?.id.toString() : "0"),
                branch: (branch && branch.id ? branch?.id.toString() : "0")
            }
        });

        setAmount(data.total);
    }

    const [monthAmount, setMonthAmount] = useState(0);

    const loadMonthAmount = async () => {

        const { data } = await api.get('/month_amount', {
            params: {
                company: (company && company.id  ? company?.id.toString() : "0"),
                branch: (branch && branch.id  ? branch?.id.toString() : "0")
            }
        });

        setMonthAmount(data.total);
    }

    useEffect(() => {
        loadAmount();
        loadMonthAmount();
    }, [company, branch])

    return(
        <Stack spacing="8" width="100%">
            <Stack spacing="5" w="100%" minWidth="300px" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8">
                <Text fontSize="xl" w="100%">Saldo do Caixa</Text>

                <Text fontSize="2xl" w="100%" fontWeight="bold" color={amount > 0 ? "green.400" : "red.400"}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(amount)}</Text>

                <Link href="/caixa" display="flex" alignItems="center" fontSize="md" color="gray.700"><CheckIcon width="20px" stroke="#6e7191" fill="none"/> <Text ml="2">Ver fluxo de caixa</Text></Link>  
            </Stack>

            <Stack spacing="5" w="100%" minWidth="300px" justify="space-between" alignItems="left" bg="white" borderRadius="16px" shadow="xl" px="8" py="8">
                <Text fontSize="xl" w="100%">Saldo do Mês</Text>

                <Text fontSize="2xl" w="100%" fontWeight="bold" color={monthAmount > 0 ? "green.400" : "red.400"}>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(monthAmount)}</Text>

                <Link href="/caixa" display="flex" alignItems="center" fontSize="md" color="gray.700"><CheckIcon width="20px" stroke="#6e7191" fill="none"/> <Text ml="2">Ver fluxo de caixa</Text></Link>  
            </Stack>
        </Stack>
    )
}