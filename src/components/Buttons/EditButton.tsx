import { Button, ButtonProps } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface BoardProps extends ButtonProps {
  children?: ReactNode
}

export function EditButton({ children, size = 'sm', ...rest }: BoardProps) {
  return (
    <Button
      {...rest}
      height="7"
      colorScheme="yellow"
      color="yellow.500"
      borderColor="yellow.500"
      pl="4"
      pr="4"
      borderRadius="full"
      fontWeight="600"
      variant="outline"
      size={size}
      border="2px"
      fontSize="12px"
    >
      Alterar
      {children}
    </Button>
  )
}
