import { AlertIcon, AlertTitle, Alert as ChakraAlert, Flex } from "@chakra-ui/react";
import { CloseButton } from "@chakra-ui/close-button";
import { useState } from "react";
import { useLocation } from "react-router";

export function Alert(){
    const location = useLocation<string>();
    const [alert, setAlert] = useState(location.state);

    function handleCloseAlert(){
        const cleanAlert = "";
        setAlert(cleanAlert);
    }

    return alert ?(
        <Flex position="fixed" zIndex="99" align="center" bottom="8" w="full">
            <ChakraAlert status="warning" maxW="380px" borderRadius="14px" boxShadow="md" bgColor="orange.400" color="white" margin="0 auto">
                <AlertIcon color="white"/>
                <AlertTitle mr={2}>{alert}</AlertTitle>
                <CloseButton position="absolute" right="8px" top="8px" onClick={handleCloseAlert}/>
            </ChakraAlert>
        </Flex>
        
    )
    :(
        <div></div>
    )
}