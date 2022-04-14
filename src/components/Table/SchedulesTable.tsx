import { ElementType, ReactNode } from "react";
import { Flex, Icon, Table as ChakraTable, Tbody, Th, Thead, Tr } from "@chakra-ui/react";

interface ThProps{
    text: string,
    icon?: ElementType,
    bold?: true | false;
    wrap?: boolean;
}

interface TableProps{
    children: ReactNode;
    header: ThProps[];
}

export function SchedulesTable({ header, children } : TableProps){

    return (
        <Flex overflow="auto" w="100%" h="800px">
            <ChakraTable size="md" height="fit-content">
                <Thead>
                    <Tr borderBottom="1px solid" borderTop="1px solid" borderColor="gray.200">
                        {
                            header.map(th => {
                                const whiteSpace = th.wrap === true ? 'nowrap' : 'normal';

                                return(
                                    <Th key={th.text} whiteSpace={whiteSpace} position="sticky" top="0" bg="white" fontSize="small" textTransform="capitalize" border="none" fontWeight={th.bold ? 700 : 500} color="gray.900">
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
        </Flex>
        
    )
}