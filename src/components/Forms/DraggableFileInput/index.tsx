import { Divider, Stack, Text, Input as ChakraInput, HStack, IconButton } from "@chakra-ui/react"
import { ChangeEvent, useRef } from "react";

import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';


interface DraggableFileInputProps{
    fileList: {
        files: File[];
        count: number;
    };
    setFiles: (fileList: {
        files: File[],
        count: number
    }) => void;
}

export function DraggableFileInput({fileList, setFiles}: DraggableFileInputProps){
    const inputFilesRef = useRef<HTMLInputElement>(null);
    //const [files, setFiles] = useState<File[] | null>();

    const handleChangeFileInput = async (event: ChangeEvent<HTMLInputElement>) => {
        if(event.target.files && event.target.files.length > 0){
            const newFiles:File[] = (fileList.files ? fileList.files : []);

            for(let i = 0; i < event.target.files.length; i++){
                newFiles.push(event.target.files[i]);
            }

            setFiles({
                files: newFiles,
                count: newFiles.length
            });
        }else{
            setFiles({
                files: [],
                count: 0
            });
        }
    }

    const handleRemoveFile = async (index:number) => {
        //console.log(files, index);
        if(fileList.count){
            if(index){
                const newFiles = fileList.files;
                newFiles.splice(index, 1);

                console.log(newFiles, index);

                //setFiles(newFiles.length > 0 ? newFiles : {files: [], count: 0});
                setFiles({
                    files: newFiles,
                    count: newFiles.length
                });
            }else{
                setFiles({
                    files: [],
                    count: 0
                });
            }
        }
    }

    return(
        <>
            <Stack pos="relative" h="120px" border="2px dashed" borderColor="gray.200" cursor="pointer" borderRadius={10}>
                {/* <Input pos="absolute" zIndex={2} type="file" name="billets" multiple={true} opacity="0" cursor="pointer" minH="120px"/> */}
                {/* <input style={{position:"absolute", zIndex:2, opacity: 0, cursor: "pointer", minHeight: "120px"}} onChange={onChangeFiles} type="file" name="billets" multiple={true}/> */}

                <ChakraInput ref={inputFilesRef} name="files" type="file" accept={"image/png, image/jpeg, application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,text/plain, application/pdf"} zIndex="2" pos="absolute" multiple={true} opacity="0" cursor="pointer" minH="120px" onChange={handleChangeFileInput}/> 

                <Stack pos="absolute" p="8" left="0" right="0" top="0" bottom="0" justifyContent="center" alignItems={"center"}>
                    <Text color="gray.600">Arraste os arquivos</Text>
                </Stack>
            </Stack>

            <Stack>
                {
                    fileList && fileList.files.map((file, index) => {
                        return(
                            <HStack key={`${file.name}-${index}`} bg="gray.200" p="1" px="3" borderRadius="4" justifyContent="space-between">
                                <Text>{file.name}</Text>
                                <IconButton onClick={() => handleRemoveFile(index)} h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Remover arquivo" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                            </HStack>
                        )
                    })
                }
            </Stack>
        </>
    )
}