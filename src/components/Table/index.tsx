import { ElementType, ReactNode } from "react";
import { Icon, Table as ChakraTable, Tbody, Th, Thead, Tr } from "@chakra-ui/react";

interface ThProps{
    text: string,
    icon?: ElementType,
    bold?: true | false;
}

interface TableProps{
    children: ReactNode;
    header: ThProps[];
}

export function Table({ header, children } : TableProps){
    return (
        <ChakraTable overflowX="auto" display="flex" w="100%">
            <Thead>
                <Tr>
                    {
                        header.map(th => {
                            return(
                                <Th key={th.text} fontSize="small" textTransform="capitalize" border="none" fontWeight={th.bold ? 700 : 500} color="gray.900">
                                    { th.icon && <Icon as={th.icon} stroke="#14142B" fill="none" h="30px" w="18px" mr="4"/> }
                                    { th.text }
                                </Th>
                            );
                        })
                    }
                </Tr>
            </Thead>
            <Tbody>
                {children}
            </Tbody>
        </ChakraTable>
    )
}