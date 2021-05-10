import { Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerOverlay, useBreakpointValue } from "@chakra-ui/react";
import { useSideBarDrawer } from "../_Contexts/SidebarDrawerContext";
import { SideBarNav } from "./SideBarNav";

interface SideBarProps{
    desk: string;
}

export function SideBar({ desk } : SideBarProps){
    const { isOpen, onClose } = useSideBarDrawer();

    const isDrawerSidebar = useBreakpointValue({
        base: true,
        lg: false,
    });

    if(isDrawerSidebar){
        return (
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay>
                    <DrawerContent bg="gray.800">
                        <DrawerCloseButton mt="6" color="#fff" />

                        <DrawerBody p="0">
                            <SideBarNav desk={desk}/>
                        </DrawerBody>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>
        );
    }

    return(
        <Box as="aside" w="254px" float="left" position="fixed">
            <SideBarNav desk={desk}/>
        </Box>
    )
}