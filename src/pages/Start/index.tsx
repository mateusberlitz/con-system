import { Flex, Stack, Text } from '@chakra-ui/react'

import { ReactComponent as SettingsIcon } from '../../assets/icons/Settings.svg'
import { ReactComponent as ChartBarIcon } from '../../assets/icons/Chart-bar.svg'
import { ReactComponent as CartIcon } from '../../assets/icons/Cart.svg'
import { ReactComponent as BagIcon } from '../../assets/icons/Bag.svg'

import { Profile } from '../../components/Profile'
import { Alert } from '../../components/Alert'
import { HasPermission, useProfile } from '../../hooks/useProfile'
import { useTenant } from '../../hooks/useTenant'
import { Logo } from '../../components/Logo'
import { Link } from 'react-router-dom'

export default function Start() {
  const { permissions } = useProfile();
  const { prefix } = useTenant();

  return (
    <Flex direction="column" h="100vh">
      <Alert />

      <Flex
        w="100%"
        my="14"
        maxWidth={1280}
        mx="auto"
        px="6"
        direction="column"
      >
        <Flex w="100%" mb="16">
          <Logo/>

          <Profile />
        </Flex>

        
      </Flex>
    </Flex>
  )
}
