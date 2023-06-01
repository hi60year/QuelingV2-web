import {Fragment} from "react";
import {Box, Chip, CssBaseline, Divider, Stack} from "@mui/material";
import {blue, grey, red} from "@mui/material/colors";
import Header from "../components/header.tsx";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {gql} from "../__generated__";
import {useQuery} from "@apollo/client";
import {animated, useSpring} from "@react-spring/web";
import {GetComContestNumQueryQuery, GetRiichiContestNumQueryQuery, MahjongType} from "../__generated__/graphql.ts";
import ContestTable from "../components/contestTable.tsx";

interface ContestHomeProps {
    mahjongType: 'com' | 'riichi'
}

const GET_CONTESTS_NUM_COM = gql(/* GraphQL */ `
    query GetComContestNumQuery {
        comContestNum
    }
`);

const GET_CONTESTS_NUM_RIICHI = gql (`
    query GetRiichiContestNumQuery {
        riichiContestNum
    }
`)



const AnimatedChip = animated(Chip)

export default function ContestHome(props: ContestHomeProps) {

    const {loading, data, error} = useQuery<GetComContestNumQueryQuery | GetRiichiContestNumQueryQuery>(
        props.mahjongType == "com" ? GET_CONTESTS_NUM_COM : GET_CONTESTS_NUM_RIICHI
    )

    const contestNumText = () => {
        if (error) {
            return "链接错误"
        } else if (loading) {
            return "正在获取赛事数量..."
        } else {
            return `赛事数量：${props.mahjongType == "com" ?
                (data as GetComContestNumQueryQuery)?.comContestNum : (data as GetRiichiContestNumQueryQuery)?.riichiContestNum}`
        }
    }

    const chipSprings = useSpring({
        width: loading ? "200px" : "130px",
        backgroundColor: (() => {
            if (loading) {
                return blue[200]
            } else if (error) {
                return red[300]
            } else {
                return grey[300]
            }
        })()
    })

    return (
        <Fragment>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: '100vw', backgroundColor: blue[50] }}>
                <Header/>
                <Toolbar/>
                <Box sx={{width: "calc(min(1200px, 100vw))", alignSelf:"center", my: 4}}>
                    <Stack width={"100%"}
                           justifyContent={"space-between"}
                           direction={"row"}
                           alignItems={"flex-end"}
                    >
                        <Typography variant={"h3"} sx={{
                            color: grey[600],
                            fontWeight: "light",
                            letterSpacing: "4px",
                            display: "inline-block"
                        }}>
                            {(() => {
                               if (props.mahjongType == "com") {return "国标麻将"}
                               else if (props.mahjongType == "riichi") {return "立直麻将"}
                            })()}
                        </Typography>
                        <AnimatedChip
                            label={contestNumText()}
                            sx={{mb: "3px"}}
                            style={{
                                ...chipSprings
                            }}
                        />
                    </Stack>
                    <Divider />
                    <ContestTable rule={props.mahjongType == "com" ? MahjongType.Com : MahjongType.Riichi}/>
                </Box>
            </Box>
        </Fragment>
    )
}