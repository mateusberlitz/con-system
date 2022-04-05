import { Button } from '@chakra-ui/react'

interface PaginationItemProps {
  isCurrent?: boolean
  pageNumber: number
  onPageChange: (page: number) => void
}

export function PaginationItem({
  isCurrent = false,
  pageNumber,
  onPageChange
}: PaginationItemProps) {
  if (isCurrent) {
    return (
      <Button
        size="sm"
        fontSize="xs"
        width="4"
        colorScheme="blue"
        disabled
        _disabled={{ bg: 'blue.400', cursor: 'default' }}
      >
        {pageNumber}
      </Button>
    )
  }

  return (
    <Button
      size="sm"
      fontSize="xs"
      color="blue.400"
      width="4"
      colorScheme="blue"
      bg="transparent"
      border="1px"
      borderColor="blue.400"
      _hover={{ bg: 'blue.100' }}
      onClick={() => onPageChange(pageNumber)}
    >
      {pageNumber}
    </Button>
  )
}
