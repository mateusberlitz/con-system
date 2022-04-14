import { HStack, IconButton, Link, Stack, Text } from "@chakra-ui/react";
import { dayInvoices, Invoice } from "../../../types";

import { ReactComponent as CloseIcon } from '../../../assets/icons/Close.svg';
import { ReactComponent as FileIcon } from '../../../assets/icons/File.svg';


interface InvoicesToModalProps{
    handleRemoveInvoice: (invoiceId: number) => void;
    invoices: dayInvoices;
}

export function InvoicesToModal({invoices, handleRemoveInvoice} : InvoicesToModalProps){
    console.log(invoices);

    return (
        <>
            {
                Object.keys(invoices).map((day:string) => {
                    
                    invoices[day].map((invoice:Invoice) => {
                        return (
                            <Stack p="6" border="1px solid">
                                <HStack>
                                    <Link target="_blank" href={`${process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_STORAGE : process.env.REACT_APP_API_LOCAL_STORAGE}${invoice.file}`} display="flex" fontWeight="medium" alignItems="center" color="gray.900" _hover={{textDecor:"underline", cursor: "pointer"}}>
                                        <FileIcon stroke="#4e4b66" fill="none" width="16px"/>
                                        <Text ml="2">Ver Nota</Text>
                                    </Link>

                                    <IconButton onClick={() => handleRemoveInvoice(invoice.id)} h="24px" w="20px" minW="25px" p="0" float="right" aria-label="Excluir nota" border="none" icon={ <CloseIcon width="20px" stroke="#C30052" fill="none"/>} variant="outline"/>
                                </HStack>

                                {/* <ControlledInput control={control} value={invoice.date} name="date" type="date" placeholder="Data da nota" variant="outline" error={formState.errors.file} focusBorderColor="blue.400"/> */}
                            </Stack>
                        )
                    })

                })
            }
        </>
    )
}