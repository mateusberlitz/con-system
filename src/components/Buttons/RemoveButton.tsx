import { Button, ButtonProps, Icon } from "@chakra-ui/react";
import { ReactNode } from "react";

import { ReactComponent as DeleteIcon } from '../../assets/icons/Delete.svg';

interface BoardProps extends ButtonProps{
    children?: ReactNode;
}

export function RemoveButton({children, size = "sm", ...rest } : BoardProps){
    return (
        <Button {...rest} color="red.400" fontWeight="500" variant="unstyled" size={size} fontSize="12px" borderRadius="full" pl="4" pr="4" height="7">
            <Icon as={DeleteIcon}  stroke="#C30052" fill="none" mr="2"/>
            Remover
            {children}
        </Button>
    )
}