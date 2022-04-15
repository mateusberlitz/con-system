import { Avatar, Flex, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { ReactComponent as ForwardArrowIcon } from '../../assets/icons/Forward Arrow.svg'
import { useProfile } from '../../hooks/useProfile'
import { LogoutModal } from './LogoutModal'

export function Profile() {
  const { profile } = useProfile()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  function OpenLogoutModal() {
    setIsLogoutModalOpen(true)
  }

  function CloseLogoutModal() {
    setIsLogoutModalOpen(false)
  }

  return (
    <Flex ml="auto" title="Ver informações ou sair" cursor="pointer">
      {profile && (
        <Link to="/eu">
          <Stack
            spacing="1"
            width="max-content"
            mr="4"
            mt="1"
            textAlign="right"
            _hover={{ textDecoration: 'none' }}
          >
            <Text fontWeight="600" fontSize="sm" color="gray.700">
              {profile.name} {profile.last_name}
            </Text>
            <Text fontSize="small" color="gray.700">
              {profile.role.name}
            </Text>
          </Stack>
        </Link>
      )}

      <Link to="/eu">
        <Flex
          borderRadius="full"
          height="fit-content"
          bgGradient="linear(to-r, purple.600, blue.300)"
          p="2px"
        >
          <Avatar
            borderColor="gray.600"
            border="2px"
            size="md"
            name={
              profile && `${profile.name} ${profile ? profile.last_name : ''}`
            }
            src={
              profile && profile.image
                ? `${
                    process.env.NODE_ENV === 'production'
                      ? process.env.REACT_APP_API_STORAGE
                      : process.env.REACT_APP_API_LOCAL_STORAGE
                  }${profile.image}`
                : ''
            }
          />
        </Flex>
      </Link>

      <Flex
        mt="3"
        ml="6"
        title="Sair e fazer logout do sistema"
        onClick={OpenLogoutModal}
      >
        <ForwardArrowIcon stroke="#6e7191" fill="none" width="20" />
      </Flex>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onRequestClose={CloseLogoutModal}
      />
    </Flex>
  )
}
