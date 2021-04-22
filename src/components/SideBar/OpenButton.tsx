import { IconButton } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import { useBreakpointValue } from "@chakra-ui/media-query";
import { useSideBarDrawer } from "../_Contexts/SidebarDrawerContext";

import { ReactComponent as MenuLeftIcon } from '../../assets/icons/Menu-left.svg';

export function OpenButton(){
    const { onOpen } = useSideBarDrawer();

    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true,
    })

    return !isWideVersion ? (
        <IconButton mt="1" pos="absolute" display="flex" icon={<Icon as={MenuLeftIcon} stroke="#6e7191" fill="none"/>} fontSize="24" variant="unstyled" onClick={onOpen} aria-label="Open Navigation" mr="2"></IconButton>
    )
    : (
        <>
        </>
    );
}