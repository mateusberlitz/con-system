import { Flex } from "@chakra-ui/layout";
import { useState } from "react";
import { SketchPicker } from "react-color";

export function ColorPicker(){
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [color, setColor] = useState({
        r: '241',
        g: '112',
        b: '19',
        a: '1'
    });

    const handleOpenColorPicker = () => {
        setShowColorPicker(true);
    }

    const handleCloseColorPicker = () => {
        setShowColorPicker(false);
    }

    const handleChangeColor = (color:any) => {
        setColor(color.rgb);
    }

    return(
        <Flex pos="relative">
            <Flex 
                onClick={showColorPicker ? handleCloseColorPicker : handleOpenColorPicker}
                bg={`rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`} 
                w="20px" h="20px" borderRadius="full" border="2px" borderColor="gray.500" cursor="pointer">
            </Flex>

            {
                showColorPicker && (
                    <Flex pos="absolute" left="30px" zIndex="90" top="-120px">
                        <SketchPicker onChange={handleChangeColor}/>
                    </Flex>
                )
            }
            
        </Flex>
    )
}