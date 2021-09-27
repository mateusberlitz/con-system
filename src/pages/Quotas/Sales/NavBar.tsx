import { Flex } from "@chakra-ui/react"
import { SolidButton } from "../../../components/Buttons/SolidButton"

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { useHistory } from "react-router";

interface StockNavBarProps{
    OpenNewSaleModal: () => void;
}

export function SalesNavBar({OpenNewSaleModal}: StockNavBarProps){
    const history = useHistory();

    return (
        <Flex justify="space-between" alignItems="center" mb="10">
            <SolidButton onClick={() => history.push(`/contempladas`)} color="white" bg="blue.800" icon={PlusIcon} colorScheme="blue">
                Criar nova venda
            </SolidButton>

            {/* <Link href="/categorias" border="2px" borderRadius="full" borderColor="gray.500" px="6" h="8" alignItems="center">
                <Text>Categorias</Text>
            </Link> */}

            {/* <OutlineButton onClick={OpenExportDocumentsModal} variant="outline" colorScheme="blue" color="blue.400" borderColor="blue.400">
                Baixar Documentos
            </OutlineButton> */}
        </Flex>
    )
}