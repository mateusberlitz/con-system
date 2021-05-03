import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, HStack, Link, Stack, Text } from "@chakra-ui/layout";
import { MainBoard } from "../components/MainBoard";
import { useProfile } from "../hooks/useProfile";
import { OutlineButton } from "../components/Buttons/OutlineButton";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { useState } from "react";
import { ControlledInput } from "../components/Forms/Inputs/ControlledInput";

import {  useForm, useFormState } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { isParenthesizedTypeNode } from "typescript";

interface SelfEditData{
    image: File;
    phone: string;
    email: string;
}

const SelfEditSchema = yup.object().shape({
    image: yup.array(),
    phone: yup.string().min(9, "O telefone não parece estar correto."),
    email: yup.string().email(),
});

export default function Me(){
    const { profile } = useProfile();

    const [profileImage, setProfileImage] = useState(() => {
        if(profile){
            return `${process.env.REACT_APP_API_STORAGE}${profile.image}`;
        }

        return "";
    });
    const [profileFileName, setProfileFileName] = useState("");

    const { register, handleSubmit, formState, control} = useForm<SelfEditData>({
        resolver: yupResolver(SelfEditSchema)
    })

    function handleChangeFile(event: any){
        setProfileImage(URL.createObjectURL(event.target.files[0]));
        setProfileFileName(event.target.files[0].name);


    }

    return (
        <MainBoard sidebar="configs">
            { profile && (
                <Stack spacing="8">
                    <Box mr="4" mt="1" textAlign="left" _hover={{textDecoration: "none"}}>
                        <Text fontWeight="600" fontSize="lg" color="gray.700">{profile.name} {profile.last_name}</Text>
                        <Text fontSize="md" color="gray.700">
                            {profile.role.name}
                        </Text>
                    </Box>

                    <HStack spacing="6" display="flex" pos="relative">
                        <Flex w="fit-content" borderRadius="full" height="fit-content" bgGradient="linear(to-r, purple.600, blue.300)" p="2px">
                            <Avatar borderColor="gray.600" border="2px" size="md" name="Mateus Berlitz" src={profileImage}/>
                        </Flex>

                        <Box as="label" display="flex" borderRadius="full" alignItems="center" h="29px" fontWeight="600" fontSize="12px" pl="6" pr="6" cursor="pointer" border="2px" borderColor="purple.300" color="purple.300">
                            <Input type="file" accept="image/png, image/jpeg" display="none" onChange={handleChangeFile}/>
                            Alterar Foto
                        </Box>

                        <Text>{profileFileName}</Text>
                        
                    </HStack>

                    <HStack spacing="4" align="baseline">
                        <ControlledInput control={control} value={profile.email} name="email" type="text" placeholder="E-mail" variant="outline" error={formState.errors.email}/>
                        <ControlledInput control={control} value={profile.phone} name="phone" type="text" placeholder="Telefone" variant="outline" mask="phone" error={formState.errors.phone}/>
                        
                    </HStack>
                </Stack>
            )}
        </MainBoard>
    )
}