import { FormControl, HStack, Select as ChakraSelect } from "@chakra-ui/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Board } from "../../../components/Board";
import { CompanySelect } from "../../../components/CompanySelect";
import { MainBoard } from "../../../components/MainBoard";
import { Table } from "../../../components/Table";
import { PaymentFilterData } from "../../../hooks/usePayments";
import { HasPermission, useProfile } from "../../../hooks/useProfile";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";

export default function Reports(){
    const workingCompany = useWorkingCompany();
    const {permissions, profile} = useProfile();

    const history = useHistory();

    const [filter, setFilter] = useState<PaymentFilterData>(() => {
        const data: PaymentFilterData = {
            search: '',
            company: workingCompany.company?.id,
            status: 0,
        };
        
        return data;
    })

    function handleChangeFilter(newFilter: PaymentFilterData){
        setFilter(newFilter);
    }

    return(
        <MainBoard sidebar="financial" header={ 
            ( ( (permissions && HasPermission(permissions, 'Todas Empresas')) || (profile && profile.companies && profile.companies.length > 1)) && <CompanySelect searchFilter={filter} setFilter={handleChangeFilter}/> )
        }
        >

        <Board>
            <HStack as="form" spacing="10" w="100%" mb="10">
                <FormControl pos="relative">
                    <ChakraSelect defaultValue={workingCompany.company?.id} h="45px" name="selected_company" w="100%" maxW="200px" fontSize="sm" focusBorderColor="purple.600" bg="gray.400" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Empresa">
                        <option value="0">Ano</option>
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                    </ChakraSelect>
                </FormControl>
            </HStack>

            <Table header={[
                {text: 'Conta', bold: true},
                {text: 'Janeiro'},
                {text: 'Fevereiro'},
                {text: 'Março'},
                {text: 'Abril'},
                {text: 'Maio'},
                {text: 'Junho'},
                {text: 'Julho'},
                {text: 'Agosto'},
                {text: 'Setembro'},
                {text: 'Outubro'},
                {text: 'Novembro'},
                {text: 'Dezembro'},
            ]}>

            </Table>
        </Board>

        

        </MainBoard>
    );
}