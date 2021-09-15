import { Box, Flex, HStack, Modal, ModalBody, Text, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Select as ChakraInput, ModalFooter, Link } from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { SolidButton } from "../../../components/Buttons/SolidButton";
import { Input } from "../../../components/Forms/Inputs/Input";
import { ControlledSelect } from "../../../components/Forms/Selects/ControlledSelect";
import { Select } from "../../../components/Forms/Selects/Select";
import { useProfile } from "../../../hooks/useProfile";
import { useWorkingCompany } from "../../../hooks/useWorkingCompany";
import { Company, Quota } from "../../../types";

interface NewQuotaModalProps{
    isOpen: boolean;
    onRequestClose: () => void;
    afterCreate: () => void;
}

const CreateNewQuotaFormSchema = yup.object().shape({
    segment: yup.string().required('Selecione o tipo da carta de crédito'),
    description: yup.string(),
    seller: yup.string(),
    company: yup.number(),
    contemplated_type: yup.string(),
    pay_to_user: yup.number().transform((v, o) => o === '' ? null : v).nullable(),
    value: yup.string().required("Informe o valor do pagamento"),
    cost: yup.string().required("Informe o custo"),
    cpf_cnpj: yup.string().required("Qual o cpf ou cnpj proprietário?"),
    partner_cost: yup.string(),
    passed_cost: yup.string(),
    paid_percent: yup.string().required("Diga qual o percentual pago"),
    partner_commission: yup.string(),
    purchase_date: yup.string().required("Selecione a data de compra"),
    group: yup.string().required("Informe o grupo"),
    quote: yup.string().required("Informe a cota"),
});

export function NewQuotaModal({ isOpen, onRequestClose, afterCreate } : NewQuotaModalProps){
    const workingCompany = useWorkingCompany();
    const {profile} = useProfile();

    const { register, handleSubmit, control, reset, formState} = useForm<Quota>({
        resolver: yupResolver(CreateNewQuotaFormSchema),
    });

    const handleCreateNewPayment = async (paymentData : Quota) => {

    }

    return(
        <Modal isOpen={isOpen} onClose={onRequestClose} size="xl">
            <ModalOverlay />
            <ModalContent as="form" borderRadius="24px" onSubmit={handleSubmit(handleCreateNewPayment)}>
                <ModalHeader p="10" fontWeight="700" fontSize="2xl">Cadastrar Pagamento</ModalHeader>

                <ModalCloseButton top="10" right="5"/>
                
                <ModalBody pl="10" pr="10">
                    <Stack spacing="6">
                        
                        <Input register={register} name="title" type="text" placeholder="Título" variant="outline" error={formState.errors.value} focusBorderColor="blue.800"/>

                        {
                            ( !profile || !profile.companies ? (
                                <Flex justify="center">
                                    <Text>Nenhuma empresa disponível</Text>
                                </Flex>
                            ) : (
                                <ControlledSelect control={control} value={(workingCompany.company && workingCompany.company.id) ? workingCompany.company.id.toString() : "0"}  h="45px" name="company" w="100%" fontSize="sm" focusBorderColor="blue.800" bg="gray.400" variant="outline" _hover={ {bgColor: 'gray.500'} } size="lg" borderRadius="full" error={formState.errors.value}>
                                    {profile.companies && profile.companies.map((company:Company) => {
                                        return (
                                            <option key={company.id} value={company.id}>{company.name}</option>
                                        )
                                    })}
                                </ControlledSelect>
                            ))
                        }

                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="expire" type="date" placeholder="Data de Vencimento" variant="outline" error={formState.errors.value} focusBorderColor="blue.800"/>

                            <Input register={register} name="value" type="text" placeholder="Valor" variant="outline" mask="money" error={formState.errors.value} focusBorderColor="blue.800"/>
                        </HStack>

                        <HStack spacing="4" align="baseline">
                            <Input register={register} name="recurrence" type="number" placeholder="Repetir Mensalmente" variant="outline" error={formState.errors.value} focusBorderColor="blue.800"/>
                        </HStack>

                        <Input register={register} name="observation" type="text" placeholder="Observação" variant="outline" error={formState.errors.value} focusBorderColor="blue.800"/>

                    </Stack>
                </ModalBody>

                <ModalFooter p="10">
                    <SolidButton mr="6" color="white" bg="blue.800" colorScheme="blue" type="submit" isLoading={formState.isSubmitting}>
                        Cadastrar
                    </SolidButton>

                    <Link onClick={onRequestClose} color="gray.700" fontSize="14px">Cancelar</Link>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}