import { HStack, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useToast } from "@chakra-ui/react";
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { Input } from "../../../components/Forms/Input";

import { Controller, useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from "../../../services/api";
import { useHistory } from "react-router";
import { useErrors } from "../../../hooks/useErrors";

interface Company{
    id: number;
    name: string;
    address: string;
    phone?: string;
    cnpj?: string;
    created_at?: Date;
    updated_at?: Date;
}

interface EditCompanyModalProps{
    isOpen: boolean;
    toEditCompanyData: Company;
    onRequestClose: () => void;
    afterRemove: () => void;
}

interface EditNewCompanyFormData{
    name: string;
    address: string;
    phone?: string;
    cnpj?: string;
}

const EditNewCompanyFormSchema = yup.object().shape({
    name: yup.string().required('Nome da Empresa Obrigatório'),
    address: yup.string().required('Endereço Obrigatório'),
    phone: yup.string().min(9, "Existe Telefone com menos de 9 dígitos?"),//51991090700
    cnpj: yup.string().min(12, "Não parece ser um CNPJ correto"),//02.999.999/0001-00
});

export function EditCompanyModal( { isOpen, toEditCompanyData, afterRemove, onRequestClose } : EditCompanyModalProps){
    const history = useHistory();
    const toast = useToast();
    const { showErrors } = useErrors();

    const { register, handleSubmit, formState, control} = useForm<EditNewCompanyFormData>({
        resolver: yupResolver(EditNewCompanyFormSchema),
    });

    const handleEditCompany = async (companyData : EditNewCompanyFormData) => {
        try{
            await api.put(`/companies/edit/${toEditCompanyData.id}`, companyData);

            toast({
                title: "Sucesso",
                description: "Dados da empresa foram alterados.",
                status: "success",
                duration: 12000,
                isClosable: true,
            });

            afterRemove();
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
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleEditCompany)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Alterar Empresa {toEditCompanyData.name}</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">

                        <Controller
                            name="name"
                            control={control}
                            defaultValue={toEditCompanyData.name}
                            rules={{ required: true }}
                            render={({ field: {ref, ...field} }) => 
                                <Input {...field} type="text" placeholder="Nome da empresa" variant="outline" value={toEditCompanyData.name} error={formState.errors.name}/>
                            }
                        />

                        <HStack spacing="4" align="baseline">
                            <Controller
                                name="cnpj"
                                control={control}
                                defaultValue={toEditCompanyData.cnpj}
                                rules={{ required: true }}
                                render={({ field: {ref, ...field} }) => 
                                    <Input name="cnpj" type="text" placeholder="CNPJ da empresa" variant="outline" mask="cnpj" value={toEditCompanyData.cnpj} error={formState.errors.cnpj}/>
                                }
                            />

                            <Controller
                                name="phone"
                                control={control}
                                defaultValue={toEditCompanyData.phone}
                                rules={{ required: true }}
                                render={({ field: {ref, ...field} }) => 
                                    <Input name="phone" type="text" placeholder="Telefone" variant="outline" mask="phone" value={toEditCompanyData.phone} error={formState.errors.phone}/>
                                }
                            />
                        </HStack>

                        <Controller
                            name="address"
                            control={control}
                            defaultValue={toEditCompanyData.address}
                            rules={{ required: true }}
                            render={({ field: {ref, ...field} }) => 
                                <Input register={register} name="address" type="text" placeholder="Endereço" variant="outline" value={toEditCompanyData.address} error={formState.errors.address}/>
                            }
                        />

                        
                        
                        {/* <Input register={register} name="name" type="text" placeholder="Nome da empresa" variant="outline" value={toEditCompanyData.name} error={formState.errors.name}/>
                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="cnpj" type="text" placeholder="CNPJ da empresa" variant="outline" mask="cnpj" value={toEditCompanyData.cnpj} error={formState.errors.cnpj}/>
                            <Input register={register} name="phone" type="text" placeholder="Telefone" variant="outline" mask="phone" value={toEditCompanyData.phone} error={formState.errors.phone}/>
                        </HStack>
                        <Input register={register} name="address" type="text" placeholder="Endereço" variant="outline" value={toEditCompanyData.address} error={formState.errors.address}/> */}

                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="purple.300" colorScheme="purple" type="submit" isLoading={formState.isSubmitting}>
                        Atualizar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}