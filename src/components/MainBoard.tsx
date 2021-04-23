import { Box, Flex } from "@chakra-ui/react";
import { useBreakpointValue } from "@chakra-ui/media-query";
import { ReactNode } from "react";
import { SideBar } from "./SideBar";
import { OpenButton } from "./SideBar/OpenButton";
import { Profile } from "./Profile";

interface MainBoardProps{
    sidebar: string;
    header?: ReactNode;
    children: ReactNode;
}

export function MainBoard({ header = null, children } : MainBoardProps){
    const isWideVersion = useBreakpointValue({
        base: false,
        lg: true,
    })

    return(
        <Box w="100%">
            <SideBar/>

            <Flex float="right" my="9" pl="3" pr="3" width={isWideVersion ? "calc(100% - 254px)" : "100%"}>
                <OpenButton/>

                <Flex direction="column" w="100%" maxWidth={isWideVersion ? "calc(1280px - 254px)" : "1280px"} mx="auto">
                    <Flex as="header" w="100%" mb="20">
                        {header}

                        <Profile />
                    </Flex>

                    {children}
                </Flex>
            </Flex>
        </Box>    
    );
}