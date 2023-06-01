import {gql} from "../__generated__";
import {useQuery} from "@apollo/client";
import {
    Collapse,
    LinearProgress,
    Paper,
    Stack,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TableRowProps
} from "@mui/material";
import {ContestStatus, MahjongType} from "../__generated__/graphql.ts";
import {grey, red, yellow} from "@mui/material/colors";
import {animated, useSpring} from "@react-spring/web";
import {useHover} from "react-use-gesture";
import {FC} from "react";
import {useNavigate} from "react-router-dom";

const QUERY_CONTEST_LIST = gql(`
    query GetContestList($pageNum: Int!, $rule: MahjongType) {
        allContestsByRule(rule: $rule, pageNum: $pageNum) {
            name
            isIndividual
            homePage
            platformEngine
            status
            homePage
            id
        }
    }
`)

interface statusTextResult {
    text: string,
    color: string
}

const statusText = (contestStatus: ContestStatus): statusTextResult => {
    switch (contestStatus) {
        case ContestStatus.Registering:
            return {text: "报名中", color: yellow[700]}
        case ContestStatus.Holding:
            return {text: "进行中", color: red[500]}
        case ContestStatus.End:
            return {text: "已结束", color: grey[500]}
    }
}


const CustomizedTableRow: FC<TableRowProps>  = ({children, ...props}) => {
    const [spring, api] = useSpring(() => ({
        backgroundColor: 'white'
    }))

    const AnimatedTableRow = animated(TableRow)

    const bind = useHover(
        ({hovering}) => {
            api.start({
                backgroundColor: hovering ? grey[300] : "white",
                immediate: false
            })
        },
        {filterTaps: true}
    )

    return (
        <AnimatedTableRow style={{cursor: "pointer", ...spring}} {...bind()} {...props}>
            {children}
        </AnimatedTableRow>
    )
}

export default function ContestTable(props: {rule: MahjongType}) {
    const {loading, data, error, fetchMore} = useQuery(QUERY_CONTEST_LIST, {
        variables: {
            pageNum: 0,
            rule: props.rule
        }
    })

    const nav = useNavigate()

    return (
        <Stack>
            {loading ? <LinearProgress sx={{mt: "20px"}} /> : null}
            <Collapse in = {!loading} >
                <TableContainer component={Paper} sx={{mt: "20px", borderRadius: "0px"}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>赛事名称</b></TableCell>
                                <TableCell align={"center"}><b>平台</b></TableCell>
                                <TableCell align={"center"}><b>参赛单位</b></TableCell>
                                <TableCell align={"center"}><b>规则</b></TableCell>
                                <TableCell align={"center"}><b>赛事主页</b></TableCell>
                                <TableCell align={"center"}><b>状态</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.allContestsByRule.map((it) => {
                                const {color, text} = statusText(it.status)
                                return (<CustomizedTableRow onClick={() => nav(it.homePage ?? `/contests/${it.id}`)}>
                                    <TableCell>{it.name}</TableCell>
                                    <TableCell align={"center"}>{it.platformEngine["platform"] ?? "N/A"}</TableCell>
                                    <TableCell align={"center"}>{it.isIndividual ? "个人" : "团体"}</TableCell>
                                    <TableCell align={"center"}>{it.platformEngine["ruleName"] ?? "自定义"}</TableCell>
                                    <TableCell align={"center"}>{it.homePage ? "有" : "无"}</TableCell>
                                    <TableCell align={"center"} sx={{color}}>{text}</TableCell>
                                </CustomizedTableRow>)
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Collapse>
        </Stack>
    )
}