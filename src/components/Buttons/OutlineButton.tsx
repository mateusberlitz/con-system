import { Button, ButtonProps } from '@chakra-ui/react'
import Icon from '@chakra-ui/icon'
import { ElementType } from 'react'

interface ButtonModelProps extends ButtonProps {
  icon?: ElementType
  children: string
}

export function OutlineButton({ icon, children, ...rest }: ButtonModelProps) {
  return (
    <Button
      h="45px"
      px="8"
      w="fit-content"
      leftIcon={
        icon && (
          <Icon
            as={icon}
            stroke={rest.color}
            fontSize="lg"
            fill="none"
            mr="2"
          />
        )
      }
      variant="outline"
      border="2px"
      borderRadius="full"
      fontSize="12"
      {...rest}
    >
      {children}
    </Button>
  )
}
