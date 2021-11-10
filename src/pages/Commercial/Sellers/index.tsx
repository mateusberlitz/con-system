import { CompanySelectMaster } from "../../../components/CompanySelect/companySelectMaster";
import { Avatar, Flex, HStack, Icon, Link, Spinner, Td, Text, Tr } from "@chakra-ui/react";
import { OutlineButton } from "../../../components/Buttons/OutlineButton";
import { Board } from "../../../components/Board";
import { RemoveButton } from "../../../components/Buttons/RemoveButton";
import { EditButton } from "../../../components/Buttons/EditButton";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { MainBoard } from "../../../components/MainBoard";
import { Table } from "../../../components/Table";
import { Input } from "../../../components/Forms/Inputs/Input";
import { Select } from "../../../components/Forms/Selects/Select";

import { ReactComponent as PlusIcon } from '../../../assets/icons/Plus.svg';
import { ReactComponent as SearchIcon } from "../../../assets/icons/Search.svg";
import { ReactComponent as HomeIcon } from '../../../assets/icons/Home.svg';
import { ReactComponent as PasteIcon } from '../../../assets/icons/Paste.svg';
import { ReactComponent as ProfileIcon } from '../../../assets/icons/Profile.svg';

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserFilterData, useUsers } from "../../../hooks/useUsers";

import { Company, Role, User } from "../../../types";
import { useState } from "react";
import { useCompanies } from "../../../hooks/useCompanies";
import { useRoles } from "../../../hooks/useRoles";
import { EditUserModal } from "../../configs/Users/EditUserModal";
import { ConfirmUserRemoveModal } from "../../configs/Users/ConfirmUserRemoveModal";

const SearchUserFormSchema = yup.object().shape({
    search: yup.string().nullable(),
    company: yup.string().nullable(),
    role: yup.string().nullable(),
});

interface EditUserFormData{
    name: string,
    id: number;
    phone: string;
    email: string;
    role: number;
}

interface RemoveUserData{
    id: number;
    name: string;
}

export default function Sellers(){
    const companies = useCompanies();
    const roles = useRoles();

    const [filter, setFilter] = useState<UserFilterData>(() => {
        const data: UserFilterData = {
            search: '',
            company: undefined,
            role: 3
        };
        
        return data;
    })
    const { data, isLoading, refetch, error} = useUsers(filter);
    const [ editUserData, setEditUserData ] = useState<EditUserFormData>(() => {

        const data: EditUserFormData = {
            name: '',
            id: 0,
            email: '',
            phone: '',
            role: 3,
        };
        
        return data;
    });

    const [removeUserData, setRemoveUserData] = useState<RemoveUserData>(() => {

        const data: RemoveUserData = {
            name: '',
            id: 0,
        };
        
        return data;
    });

    const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfirmUserRemoveModalOpen, setisConfirmUserRemoveModalOpen] = useState(false);

    function OpenNewUserModal(){
        setIsNewUserModalOpen(true);
    }
    function CloseNewUserModal(){
        setIsNewUserModalOpen(false);
    }


    function OpenEditModal(user : EditUserFormData){
        setEditUserData(user);
        setIsEditModalOpen(true);
    }
    function CloseEditModal(){
        setIsEditModalOpen(false);
    }

    function OpenConfirmUserRemoveModal(userIdAndName:RemoveUserData){
        setRemoveUserData(userIdAndName);
        setisConfirmUserRemoveModalOpen(true);
    }
    function CloseConfirmUserRemoveModal(){
        setisConfirmUserRemoveModalOpen(false);
    }



    const { register, handleSubmit, formState} = useForm<UserFilterData>({
        resolver: yupResolver(SearchUserFormSchema),
    });

    const handleSearchUser = async (search : UserFilterData) => {
        console.log(search);
        search.role = 3;
        setFilter(search);
    }

    return (
        <MainBoard sidebar="commercial" header={<CompanySelectMaster/>}>
            <EditUserModal afterEdit={refetch} toEditUserData={editUserData} isOpen={isEditModalOpen} onRequestClose={CloseEditModal}/>
            <ConfirmUserRemoveModal afterRemove={refetch} toRemoveUserData={removeUserData} isOpen={isConfirmUserRemoveModalOpen} onRequestClose={CloseConfirmUserRemoveModal}/>

            <HStack as="form" spacing="24px" w="100%" onSubmit={handleSubmit(handleSearchUser)}>

                <Input register={register} name="search" variant="filled" type="text" icon={SearchIcon} error={formState.errors.search} focusBorderColor="orange.400" placeholder="Procurar"/>

                <Select register={register} name="company" error={formState.errors.company} focusBorderColor="orange.400">
                        <option value="0">Empresa</option>
                        {companies.data && companies.data.map((company:Company) => {
                            return (
                                <option key={company.id} value={company.id}>{company.name}</option>
                            )
                        })}
                </Select>

                <OutlineButton type="submit" colorScheme="orange" color="orange.400" borderColor="orange.400" h="45px" size="sm" borderRadius="full" variant="outline">
                    Filtrar
                </OutlineButton>
                    
            </HStack>

            <Board mt="50px">
                {   isLoading ? (
                        <Flex justify="center">
                            <Spinner/>
                        </Flex>
                    ) : ( error ? (
                        <Flex justify="center" mt="4" mb="4">
                            <Text>Erro listar os leads</Text>
                        </Flex>
                    ) : (data.length === 0) && (
                        <Flex justify="center">
                            <Text>Nenhuma lead encontrado.</Text>
                        </Flex>
                    ) ) 
                }

                {
                    (!isLoading && !error && data.length !== 0) && (
                        <Table header={
                            [
                                {
                                    text: 'Vendedores',
                                    icon: ProfileIcon
                                },
                                {
                                    text: 'Conversão',
                                    icon: HomeIcon
                                },
                                // {
                                //     text: 'Metas',
                                //     icon: PasteIcon
                                // },
                                {
                                    text: 'Último acesso',
                                },
                                {
                                    text: '',
                                },
                            ]
                        }>
                            {/* ITEMS */}
                            { (!isLoading &&!error) && data.map((user:User) => {

                                return(
                                    <Tr key={user.id}>
                                        <Td alignItems="center" display="flex">
                                            <Flex mr="4" borderRadius="full" h="fit-content" w="fit-content" bgGradient="linear(to-r, purple.600, blue.300)" p="2px">
                                                <Avatar borderColor="gray.600" border="2px" size="md" name={`${user.name} ${user.last_name}`} src={user.image ? `${process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_STORAGE : process.env.REACT_APP_API_LOCAL_STORAGE}${user.image}` : ""}/>
                                            </Flex>
                                            <Text display="flex" fontSize="sm" color="gray.700" fontWeight="600">{user.name} {user.last_name && user.last_name}</Text>
                                        </Td>
                                        <Td fontSize="sm" color="gray.800">12%</Td>
                                        {/* <Td fontSize="sm" color="gray.800">12-35</Td> */}
                                        <Td fontSize="sm" color="gray.800">12/07/2021</Td>
                                        <Td>
                                            <HStack spacing="4">
                                                <Link href={`/historico/${user.id}`}>
                                                    <HStack>
                                                        <Icon as={PasteIcon} stroke="#4e4b66" fill="none" width="11" strokeWidth="3"/>
                                                        <Text fontSize="12px" color="gray.800">Histórico</Text>
                                                    </HStack>
                                                </Link>
                                                {/* <EditButton onClick={() => OpenEditModal({id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role.id }) }/> */}
                                            
                                                
                                            </HStack>
                                        </Td>
                                        <Td><RemoveButton onClick={() => OpenConfirmUserRemoveModal({ id: user.id, name: user.name }) }/></Td>
                                    </Tr>
                                )
                            })}
                        </Table>
                )}
            </Board>
        </MainBoard>
    )
}