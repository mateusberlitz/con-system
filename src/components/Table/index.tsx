import { ElementType, ReactNode } from "react";
import { Icon, Table as ChakraTable, Tbody, Th, Thead, Tr } from "@chakra-ui/react";

interface ThProps{
    text: string,
    icon?: ElementType
}

interface TableProps{
    children: ReactNode;
    header: ThProps[];
}

export function Table({ header, children } : TableProps){
    return (
        <ChakraTable>
            <Thead>
                <Tr>
                    {
                        header.map(th => {
                            return(
                                <Th fontSize="14" textTransform="capitalize" border="none" fontWeight="500" color="gray.900">
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