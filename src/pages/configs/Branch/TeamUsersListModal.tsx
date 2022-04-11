import { HStack, Stack, IconButton, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Flex, Avatar, useToast } from "@chakra-ui/react";
import { dayInvoices, Invoice, Team, User } from "../../../types";

import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';
import { ReactComponent as FileIcon } from '../../../assets/icons/File.svg';
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { api } from "../../../services/api";
import { showErrors } from "../../../hooks/useErrors";
import { useHistory } from "react-router-dom";
import { useUsers } from "../../../hooks/useUsers";
import { yupResolver } from "@hookform/resolvers/yup";


interface TeamUsersListModalProps{
    isOpen: boolean;
    handleUnicludeUser: (userId: number) => void;
    team?: Team;
    handleOpenIncludeUserModal: (teamId: number, afterIncludeUser: () => void) => void;
    afterEdit: () => void;
    onRequestClose: () => void
}

interface Sync {
    [key: number]: string
}

export function TeamUsersListModal({isOpen, team, afterEdit, handleOpenIncludeUserModal, onRequestClose} : TeamUsersListModalProps){
    const history = useHistory();
    const toast = useToast();

    const { data, isLoading, refetch, error } = useUsers({team: team && team.id});

    const handleUnicludeUser = async (user: User) => {
        if(team){
            try{
                const teamData: Sync = user.teams.reduce(
                    (syncTeams: Sync, userTeam: Team) => {
                      if(userTeam.id !== team.id){
                        syncTeams[userTeam.id] = 'on';
                      }
                      return syncTeams
                    },
                    {} as Sync
                  )
    
                await api.post(`/users/${user.id}/sync_teams`, teamData);
                refetch();
                afterEdit();
            }catch (error: any) {
                showErrors(error, toast);
    
                if (error.response.data.access) {
                  history.push('/')
                }
            }
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            {
                !team || !data ? (
                    <Text>Equipe não foi selecionada.</Text>
                ) : (
                    <ModalContent
                        borderRadius="24px"
                    >
                        <ModalHeader p="10" fontWeight="700" fontSize="2xl">
                            Participantes da equipe: {team.name}
                        </ModalHeader>

                        <ModalCloseButton top="10" right="5" />

                        <ModalBody pl="10" pr="10">
                            <Stack spacing="6" p="6" border="1px solid" borderColor="gray.200" borderRadius="8">
                                {
                                    data.length === 0 && (
                                        <Text>Nenhum usuário participante.</Text>
                                    )
                                }
                                {
                                    data.map((user:User) => {
                                        return (
                                            <Stack key={user.id}>
                                                <HStack justifyContent="space-between">
                                                    <HStack>
                                                        <Flex
                                                            mr="4"
                                                            borderRadius="full"
                                                            h="fit-content"
                                                            w="fit-content"
                                                            bgGradient="linear(to-r, purple.600, blue.300)"
                                                            p="2px"
                                                            whiteSpace="nowrap"
                                                            >
                                                            <Avatar
                                                                whiteSpace="nowrap"
                                                                borderColor="gray.600"
                                                                border="2px"
                                                                size="sm"
                                                                name={`${user.name} ${user.last_name}`}
                                                                src={
                                                                user.image
                                                                    ? `${
                                                                        process.env.NODE_ENV === 'production'
                                                                        ? process.env.REACT_APP_API_STORAGE
                                                                        : process.env.REACT_APP_API_LOCAL_STORAGE
                                                                    }${user.image}`
                                                                    : ''
                                                                }
                                                            />
                                                        </Flex>
                                                        <Text
                                                            display="flex"
                                                            fontSize="sm"
                                                            color="gray.700"
                                                            fontWeight="600"
                                                            whiteSpace="nowrap"
                                                            >
                                                            {user.name}{' '}
                                                            {user.last_name && user.last_name}
                                                        </Text>
                                                    </HStack>

                                                    <IconButton onClick={() => handleUnicludeUser(user)} h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Remover participante" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                                                </HStack>

                                                {/* <ControlledInput control={control} value={invoice.date} name="date" type="date" placeholder="Data da nota" variant="outline" error={formState.errors.file} focusBorderColor="blue.400"/> */}
                                            </Stack>
                                        )
                                    })
                                }
                            </Stack>
                        </ModalBody>

                        <ModalFooter p="10">
                            <SolidButton
                                mr="6"
                                color="white"
                                bg="purple.300"
                                colorScheme="purple"
                                onClick={() => handleOpenIncludeUserModal(team.id, refetch)}
                            >
                                Incluir
                            </SolidButton>

                            <Link onClick={onRequestClose} color="gray.700" fontSize="14px">
                                Cancelar
                            </Link>
                            </ModalFooter>
                    </ModalContent>
                )
            }
        </Modal>
    )
}