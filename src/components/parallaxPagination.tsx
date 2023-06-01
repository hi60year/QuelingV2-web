import {IconButton, Stack, StackProps} from "@mui/material";
import {HorizontalRule} from "@mui/icons-material";
import {Dispatch, SetStateAction} from "react";
import {grey} from "@mui/material/colors";
import {animated, useSpring} from "@react-spring/web";

interface ParallaxPaginationProps extends StackProps{
    pageNum: number,
    currentSelectedPage: number,
    currentSelectedPageSetter: Dispatch<SetStateAction<number>>
}

const AnimatedIconButtonBase = animated(IconButton)

function AnimatedIconButton(props: {index: number, selectedPage: number, selectedPageSetter: Dispatch<SetStateAction<number>>}) {
    const springs = useSpring({
        color: props.selectedPage == props.index ? grey[300] : grey[600]
    })
    return (
        <AnimatedIconButtonBase disableRipple={true} size={"small"}
                                onClick={() => props.selectedPageSetter(props.index)}
                                style={{...springs}}>
            <HorizontalRule fontSize={"large"}/>
        </AnimatedIconButtonBase>
    )
}

export default function ParallaxPagination(props: ParallaxPaginationProps) {
    const {pageNum, ...otherProps} = props

    return (
        <Stack direction={"row"} spacing={0} {...otherProps}>
            {Array.from({length: pageNum}).map((_, i) =>
                <AnimatedIconButton key={i} index={i} selectedPage={props.currentSelectedPage} selectedPageSetter={props.currentSelectedPageSetter}/>
            )}
        </Stack>
    )
}