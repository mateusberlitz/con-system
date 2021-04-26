import { HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { Input } from "../../../components/Forms/Input";

import { Controller, useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface NewCompanyModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
}

interface CreateNewCompanyFormData{
    name: string;
    address: string;
    phone?: string;
    cnpj?: string;
}

const CreateNewCompanyFormSchema = yup.object().shape({
    name: yup.string().required('Nome da Empresa Obrigatório'),
    address: yup.string().required('Endereço Obrigatório'),
    phone: yup.string().min(9),//51991090700
    cnpj: yup.string().min(9),//51991090700
});

export function NewCompanyModal( { isOpen, onRequestClose } : NewCompanyModalProps){
    const toast = useToast();

    const { register, control, watch, handleSubmit, formState} = useForm<CreateNewCompanyFormData>({
        resolver: yupResolver(CreateNewCompanyFormSchema),
    });

    function handleCreateNewCompany(){

    }

    console.log(register);

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent borderRadius="24px" as="form" onSubmit={handleSubmit(handleCreateNewCompany)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Cadastrar Empresa</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">

                        {/* Name */}
                        <Controller name="name" control={control} defaultValue="" render={({ field: { ref, ...field } }) => 
                            <Input type="text" placeholder="Nome da empresa" variant="outline" {...field}/>
                        }/>
                        
                        <Input name="name" type="text" placeholder="Nome da empresa" variant="outline"/>
                        {/* <HStack spacing="4">
                            <Input {...register("cnpj")} type="text" placeholder="CNPJ da empresa" variant="outline"/>
                            <Input {...register("phone")} type="text" placeholder="Telefone" variant="outline"/>
                        </HStack>
                        <Input name="address" type="text" placeholder="Endereço" variant="outline"/> */}
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