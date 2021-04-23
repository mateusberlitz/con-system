import { HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { Input } from "../../../components/Forms/Input";

interface NewCompanyModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
}

export function NewCompanyModal( { isOpen, onRequestClose } : NewCompanyModalProps){
    //const {isOpen, onClose} = useDisclosure();

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent borderRadius="24px" as="form">
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Cadastrar Empresa</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        <Input name="name" type="text" placeholder="Nome da empresa" variant="outline"/>
                        <HStack spacing="4">
                            <Input name="cnpj" type="text" placeholder="CNPJ da empresa" variant="outline"/>
                            <Input name="phone" type="text" placeholder="Telefone" variant="outline"/>
                        </HStack>
                        <Input name="address" type="text" placeholder="Endereço" variant="outline"/>
                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="purple.300" colorScheme="purple" type="submit">
                        Cadastrar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}