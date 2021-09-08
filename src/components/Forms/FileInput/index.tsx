import { InputAttributes } from "@chakra-ui/core";
import { Box, HStack, IconButton, Input as ChakraInput, Tag, Text, Tooltip } from "@chakra-ui/react";
import { useState, useRef } from "react";

import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';

export interface FileInputProps{
    label: string;
    
    handleChangeFile: (file:File | "") => void;
    fileName: string;
    handleChangeFileName: (fileName:string) => void;

    accept?: string;
}

export function FileInput({label, fileName, handleChangeFileName, handleChangeFile, accept = "image/png, image/jpeg, application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf"}: FileInputProps){
    //const [fileName, setFileName] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    function handleChangeFileInput(event: any){
        if(event.target.files.length){
            handleChangeFileName(event.target.files[0].name);

            handleChangeFile(event.target.files[0]);
        }else{
            handleChangeFileName("");

            handleChangeFile("");
        }
    }

    function handleClearFileInput(){
        handleChangeFileName("");

        handleChangeFile("");
        
        if(inputRef.current){
            inputRef.current.value = "";
        }

        
    }

    return (
        <HStack spacing="6" display="flex" pos="relative">
            <Box as="label" display="flex" borderRadius="full" alignItems="center" h="29px" fontWeight="600" fontSize="12px" pl="6" pr="6" cursor="pointer" border="2px" borderColor="blue.400" color="blue.400">
                <ChakraInput ref={inputRef} name="date" type="file" accept={accept} display="none" onChange={handleChangeFileInput}/> 
                {label}
            </Box>

            {
                fileName !== "" && (
                    <>
                        <Tooltip label={fileName}>
                            <Tag>
                                {fileName.length > 25 ? `${fileName.substring(0,25)}...` : fileName}
                            </Tag>
                        </Tooltip>

                        <IconButton onClick={handleClearFileInput} h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Excluir nota" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                    </>
                )
            }

            
        </HStack>
    )
}