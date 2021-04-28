import { HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { Input } from "../../../components/Forms/Input";

import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";

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
    phone: yup.string().min(9, "Existe Telefone com menos de 9 dígitos?"),//51991090700
    cnpj: yup.string().min(12, "Não parece ser um CNPJ correto"),//02.999.999/0001-00
});

export function NewCompanyModal( { isOpen, onRequestClose } : NewCompanyModalProps){
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { register, handleSubmit, formState} = useForm<CreateNewCompanyFormData>({
        resolver: yupResolver(CreateNewCompanyFormSchema),
    });

    const handleCreateNewCompany = async (companyData : CreateNewCompanyFormData) => {
        try{
            await api.post('/companies/store', companyData);

            toast({
                title: "Sucesso",
                description: "A nova empresa foi cadastrada",
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            onRequestClose();
        }catch(error) {
            showErrors(error, toast);

            if(error.response.data.access){
                history.push('/');
            }
        }
    }

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleCreateNewCompany)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Cadastrar Empresa</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">

                        {/* Name */}
                        {/* <Controller name="name" control={control} defaultValue="" render={({ field: { ref, ...field } }) => 
                            <Input type="text" placeholder="Nome da empresa" variant="outline" {...field}/>
                        }/> */}
                        
                        <Input register={register} name="name" type="text" placeholder="Nome da empresa" variant="outline" error={formState.errors.name}/>
                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="cnpj" type="text" placeholder="CNPJ da empresa" variant="outline" mask="cnpj" error={formState.errors.cnpj}/>
                            <Input register={register} name="phone" type="text" placeholder="Telefone" variant="outline" mask="phone" error={formState.errors.phone}/>
                        </HStack>
                        <Input register={register} name="address" type="text" placeholder="Endereço" variant="outline" error={formState.errors.address}/>

                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="purple.300" colorScheme="purple" type="submit" isLoading={formState.isSubmitting}>
                        Cadastrar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}