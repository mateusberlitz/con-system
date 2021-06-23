import { Box, Stack, Text } from "@chakra-ui/react";
import { PaginationItem } from "./PaginationItem";

interface PaginationProps {
    totalCountOfRegister: number;
    registerPerPage?: number;
    currentPage?: number;
    onPageChange: (page: number) => void;
}

const siblingsCount = 1;

function generatePagesArray(from: number, to: number){
    return [...new Array(to - from)].map((_, index) => {
        return from + index + 1;
    }).filter(page => page > 0);
}

export function Pagination({ totalCountOfRegister, registerPerPage = 10, currentPage = 1, onPageChange}: PaginationProps){
    const lastPage = Math.ceil(totalCountOfRegister / registerPerPage);

    const previousPages = currentPage > 1 ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1) : [];

    const nextPages = currentPage < lastPage ? generatePagesArray(currentPage, Math.min(currentPage + siblingsCount, lastPage)) : [];

    const totalCountOfRegisters = (currentPage === lastPage ? totalCountOfRegister : (totalCountOfRegister > registerPerPage ? registerPerPage * currentPage  : totalCountOfRegister))
    const initialCountOfRegisters = (currentPage === 1 ? 1 : registerPerPage * (currentPage - 1) + 1);

    return(
        <Stack direction={["column", "row"]} mt="8" justify="space-between" align="center" spacing="6">
            <Box>
                <strong>{initialCountOfRegisters}</strong> - <strong>{totalCountOfRegisters}</strong> de <strong>{totalCountOfRegister}</strong>
            </Box>

            <Stack direction="row" spacing="2">
                {currentPage > (1 + siblingsCount) && (
                    <>
                        <PaginationItem onPageChange={onPageChange} pageNumber={1}/>
                        {currentPage > (2 + siblingsCount) && <Text color="gray.300" w="8" align="center">...</Text>}
                    </>
                )}

                {previousPages.length > 0 && previousPages.map(page => {
                    return <PaginationItem onPageChange={onPageChange} key={page} pageNumber={page}/>
                })}

                <PaginationItem onPageChange={onPageChange} pageNumber={currentPage} isCurrent/>

                {nextPages.length > 0 && nextPages.map(page => {
                    return <PaginationItem onPageChange={onPageChange} key={page} pageNumber={page}/>
                })}

                {(currentPage + siblingsCount) < lastPage && (
                    <>
                        {currentPage + 1 + siblingsCount < lastPage && <Text color="gray.300" w="8" align="center">...</Text>}
                        <PaginationItem onPageChange={onPageChange} pageNumber={lastPage}/>
                    </>
                )}

            </Stack>
            
        </Stack>   
    );
}