import { Button } from '@chakra-ui/react'

interface PaginationItemProps {
  isCurrent?: boolean
  pageNumber: number
  colorScheme?: string,
  color?: string,
  onPageChange: (page: number) => void
}

export function PaginationItem({
  isCurrent = false,
  pageNumber,
  colorScheme = 'blue',
  color = 'blue.400',
  onPageChange
}: PaginationItemProps) {
  if (isCurrent) {
    return (
      <Button
        size="sm"
        fontSize="xs"
        width="4"
        colorScheme={colorScheme}
        disabled
        _disabled={{ bg: color, cursor: 'default' }}
      >
        {pageNumber}
      </Button>
    )
  }

  return (
    <Button
      size="sm"
      fontSize="xs"
      color={color}
      width="4"
      colorScheme="blue"
      bg="transparent"
      border="1px"
      borderColor={color}
      _hover={{ bg: 'blue.100' }}
      onClick={() => onPageChange(pageNumber)}
    >
      {pageNumber}
    </Button>
  )
}
