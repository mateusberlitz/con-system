import { Avatar, Box, Flex, HStack, Stack, Text, Input, useToast } from "@chakra-ui/react";

import { MainBoard } from "../components/MainBoard";
import { useProfile } from "../hooks/useProfile";
import { useState } from "react";
import { ControlledInput } from "../components/Forms/Inputs/ControlledInput";

import {  useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SolidButton } from "../components/Buttons/SolidButton";
import { api } from "../services/api";
import { useHistory } from "react-router";
import { showErrors } from "../hooks/useErrors";

interface SelfEditData{
    image?: File;
    phone: string;
    email: string;
}

const SelfEditSchema = yup.object().shape({
    image: yup.mixed(),
    phone: yup.string().min(9, "O telefone não parece estar correto."),
    email: yup.string().email("Informe um e-mail válido"),
});

export default function Me(){
    const { loadProfile } = useProfile();
    const toast = useToast();
    const history = useHistory();
    const { profile } = useProfile();

    const [profileImage, setProfileImage] = useState(() => {
        if(profile){
            return `${process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_STORAGE : process.env.REACT_APP_API_LOCAL_STORAGE}${profile.image}`;
        }

        return "";
    });
    const [profileFileName, setProfileFileName] = useState("");
    const [toFormFile, setToFormFile] = useState<File>();

    const { handleSubmit, formState, control} = useForm<SelfEditData>({
        resolver: yupResolver(SelfEditSchema)
    })

    function handleChangeFile(event: any){
        if(event.target.files.length){
            setProfileImage(URL.createObjectURL(event.target.files[0]));
            setProfileFileName(event.target.files[0].name);

            setToFormFile(event.target.files[0]);
        }else{
            setProfileImage("");
            setProfileFileName("");

            setToFormFile(event.target);
        }
    }

    const handleSaveProfile = async (selfData : SelfEditData) => {
        try{
            const userFormedData = new FormData();
            if(toFormFile !== undefined){
                userFormedData.append('image', toFormFile);
            }

            userFormedData.append('email', selfData.email);
            userFormedData.append('phone', selfData.phone);

            if(profile){
                await api.post('/users/self', userFormedData, {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                });

                toast({
                    title: "Sucesso",
                    description: `Seus dados foram salvos.`,
                    status: "success",
                    duration: 12000,
                    isClosable: true,
                });

                loadProfile();
            }

        }catch(error: any) {
            showErrors(error, toast);

            if(error.response && error.response.data.access){
                history.push('/');
            }
        }
    }

    return (
        <MainBoard sidebar="configs">
            { profile && (
                <Stack as="form" spacing="8" onSubmit={handleSubmit(handleSaveProfile)}>
                    <Box mr="4" mt="1" textAlign="left" _hover={{textDecoration: "none"}}>
                        <Text fontWeight="600" fontSize="lg" color="gray.700">{profile.name} {profile.last_name}</Text>
                        <Text fontSize="md" color="gray.700">
                            {profile.role.name}
                        </Text>
                    </Box>

                    <HStack spacing="6" display="flex" pos="relative">
                        <Flex w="fit-content" borderRadius="full" height="fit-content" bgGradient="linear(to-r, purple.600, blue.300)" p="2px">
                            <Avatar borderColor="gray.600" border="2px" size="md" name={profile && `${profile.name} ${profile.last_name}`} src={profileImage}/>
                        </Flex>

                        <Box as="label" display="flex" borderRadius="full" alignItems="center" h="29px" fontWeight="600" fontSize="12px" pl="6" pr="6" cursor="pointer" border="2px" borderColor="purple.300" color="purple.300">
                            <Input name="image" type="file" accept="image/png, image/jpeg" display="none" onChange={handleChangeFile}/> 
                            Alterar Foto
                        </Box>

                        <Text>{profileFileName}</Text>
                        
                    </HStack>

                    <Stack direction={["column", "row"]} spacing="4" align="baseline">
                        <ControlledInput control={control} value={profile.email} name="email" type="text" placeholder="E-mail" variant="outline" error={formState.errors.email}/>
                        <ControlledInput control={control} value={profile.phone} name="phone" type="text" placeholder="Telefone" variant="outline" mask="phone" error={formState.errors.phone}/>
                        
                        <SolidButton type="submit" mb="12" color="white" bg="purple.300" colorScheme="purple">
                            Salvar
                        </SolidButton>
                    </Stack>
                </Stack>
            )}
        </MainBoard>
    )
}