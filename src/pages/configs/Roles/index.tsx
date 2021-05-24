import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { Flex, FormControl, HStack, Select, Spinner, Stack, Text, Checkbox, useToast } from "@chakra-ui/react";
import { Board } from "../../../components/Board";
import { NewRoleModal } from "./NewRoleModal";
import { useEffect, useState } from "react";
import { useRoles } from "../../../hooks/useRoles";
import { Permission, Role } from "../../../types";
import { usePermissions, getPermissions } from "../../../hooks/usePermissions";
import { useForm } from "react-hook-form";
import { showErrors } from "../../../hooks/useErrors";
import { useHistory } from "react-router";
import { api } from "../../../services/api";
import { RemoveButton } from "../../../components/Buttons/RemoveButton";
import { EditButton } from "../../../components/Buttons/EditButton";
import { ConfirmRoleRemoveModal } from "./ConfirmRoleRemoveModal";
import { EditRoleModal } from "./EditRoleModal";

interface SyncPermissions{
    [key: number]: string;
}

export default function Roles(){
    const history = useHistory();
    const toast = useToast();

    const roles = useRoles();

    const [isNewRoleModalOpen, setIsNewRoleModalOpen] = useState(false);
    const [isConfirmRoleRemoveModalOpen, setIsConfirmRoleRemoveModalOpen] = useState(false);
    const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);

    const [selectedRoleId, setSelectedRoleId] = useState(0);
    const [editRoleData, setEditRoleData] = useState<Role>(() => {

        const data: Role = {
            name: '',
            id: 0,
            desk_id: 0,
        };
        
        return data;
    });

    const [permissions, setPermissions] = useState<Permission[]>([]);
    const rolesPermissions = usePermissions(selectedRoleId);

    function OpenNewRoleModal(){
        setIsNewRoleModalOpen(true);
    }
    function CloseNewRoleModal(){
        setIsNewRoleModalOpen(false);
    }

    function OpenConfirmRoleRemoveModal(){
        setIsConfirmRoleRemoveModalOpen(true);
    }
    function CloseConfirmRoleRemoveModal(){
        setIsConfirmRoleRemoveModalOpen(false);
    }

    function OpenEditRoleModal(){
        setIsEditRoleModalOpen(true);
    }
    function CloseEditRoleModal(){
        setIsEditRoleModalOpen(false);
    }

    function handleChangeRole(event:any){
        const selectedRoleData = roles.data.filter((role:Role) => role.id === parseInt(event?.target.value))[0];

        setSelectedRoleId(event?.target.value);
        setEditRoleData(selectedRoleData);
    }

    const loadPermissions = async () => {
        const data = await getPermissions();
        setPermissions(data);
    }

    useEffect(() => {
        loadPermissions();
    },[])


    const { register, watch, handleSubmit, formState} = useForm();

    const handleSavePermissions = async (data:any) => {
        //Retorna um array com a ID das permissões ativas
        const filteredPermissions = Object.values(data).filter((permissionKey, permissionIndex, permissionArray) => {
            return (parseInt(Object.keys(data)[permissionIndex].slice(0, 1)) == selectedRoleId && permissionKey !== false);
        });

        //transforma o Array de permissões em um objeto do tipo SyncPermissions
        const syncedPermissions = filteredPermissions.reduce((syncPermissions:SyncPermissions, permissionField:any, permissionIndex) => {
            syncPermissions[parseInt(permissionField)] = "on";
            return syncPermissions;
        }, {} as SyncPermissions)

        try{
            await api.post(`/roles/${selectedRoleId}/sync`, syncedPermissions);

            toast({
                title: "Sucesso",
                description: "Permissões sincronizadas.",
                status: "success",
                duration: 12000,
                isClosable: true,
            });

        }catch(error) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }


    useEffect(() => {
        if(!roles.isLoading && !roles.error && selectedRoleId){
            const selectedRoleData = roles.data.filter((role:Role) => role.id == selectedRoleId)[0];
            
            if(selectedRoleData){
                setEditRoleData(roles.data.filter((role:Role) => role.id == selectedRoleId)[0]);
            }
        }
    }, [roles.data, setEditRoleData])

    return(
        <MainBoard sidebar="configs">
            <NewRoleModal afterCreate={roles.refetch} isOpen={isNewRoleModalOpen} onRequestClose={CloseNewRoleModal}/>
            <EditRoleModal afterEdit={roles.refetch} toEditRoleData={editRoleData} isOpen={isEditRoleModalOpen} onRequestClose={CloseEditRoleModal}/>
            <ConfirmRoleRemoveModal afterRemove={roles.refetch} toRemoveRoleId={selectedRoleId} isOpen={isConfirmRoleRemoveModalOpen} onRequestClose={CloseConfirmRoleRemoveModal}/>

            <SolidButton onClick={OpenNewRoleModal} mb="10" color="white" bg="purple.300" icon={PlusIcon} colorScheme="purple">
                Adicionar Cargo
            </SolidButton>

                { roles.isLoading ? (
                    <Flex justify="center">
                        <Spinner/>
                    </Flex>
                ) : (
                        <HStack spacing="10" w="100%" mb="10">
                            <FormControl pos="relative">
                                <Select onChange={handleChangeRole} h="45px" name="role" w="100%" maxW="200px" fontSize="sm" focusBorderColor="purple.600" borderColor="gray.500" variant="filled" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" placeholder="Cargo" color="gray.600">
                                {roles.data && roles.data.map((role:Role) => {
                                    return (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    )
                                })}
                                </Select>
                            </FormControl>

                            <RemoveButton onClick={OpenConfirmRoleRemoveModal}/>
                            <EditButton onClick={OpenEditRoleModal}/>
                        </HStack>
                    )
                }
            
            <Board>
                <Flex as="form" onSubmit={handleSubmit(handleSavePermissions)}>
                { (!rolesPermissions.isLoading && !rolesPermissions.error) &&
                    <Stack spacing="10" direction="column">

                        {permissions && permissions.map(permission => {
                            let checkOption = false;
                            if(rolesPermissions.data){
                                if(rolesPermissions.data.find((rolePermission: Permission) => rolePermission.id === permission.id)){
                                    checkOption = true;
                                }
                            }
                            return (
                                <FormControl key={`${selectedRoleId}-${permission.id}`} pos="relative">
                                    <Checkbox {...register(`${selectedRoleId}-${permission.id}`)} defaultChecked={checkOption} value={permission.id} colorScheme="purple" size="md" mr="15" borderRadius="full" fontSize="sm" color="gray.800">
                                        {permission.name}
                                    </Checkbox>
                                </FormControl>
                            )
                        })}

                        {/* <FormControl pos="relative">
                            <Text mb="4" fontWeight="600">Configurações</Text>

                            <RadioGroup name="cobranca">
                                <HStack spacing="6">
                                    <ChakraRadio value="2" colorScheme="purple" color="purple.300" variant="check" defaultIsChecked>Acesso Completo</ChakraRadio>
                                    <ChakraRadio value="3" colorScheme="purple">Acesso Limitado</ChakraRadio>
                                </HStack>
                            </RadioGroup>
                        </FormControl> */}

                        <SolidButton type="submit" mb="12" color="white" bg="purple.300" colorScheme="purple" isLoading={formState.isSubmitting}>
                            Salvar
                        </SolidButton>
                    </Stack>
                    }

                    { rolesPermissions.isLoading ? (
                            <Flex justify="center">
                                <Spinner/>
                            </Flex>
                        ) : rolesPermissions.error && (
                            <Flex justify="center" mt="4" mb="4">
                                <Text>Erro ao obter as permissões ativas</Text>
                            </Flex>
                        )
                    }
                    
                </Flex>
                
            </Board>
        </MainBoard>
    );
}