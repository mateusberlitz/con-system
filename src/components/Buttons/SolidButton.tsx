import { Button, ButtonProps } from '@chakra-ui/react'
import Icon from '@chakra-ui/icon'
import { ElementType } from 'react'

interface ButtonModelProps extends ButtonProps {
  icon?: ElementType
  children: string
}

export function SolidButton({ icon, children, ...rest }: ButtonModelProps) {
  return (
    <Button
      h="45px"
      pl="8"
      pr="8"
      w="fit-content"
      leftIcon={icon && <Icon as={icon} stroke="#ffffff" fill="none" mr="2" />}
      variant="solid"
      borderRadius="full"
      fontSize="12"
      {...rest}
    >
      {children}
    </Button>
  )
}
