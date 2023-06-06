import {Box, Card, CardContent, Chip, Collapse, Dialog, LinearProgress, Pagination, Stack} from "@mui/material";
import {gql} from "../../../__generated__";
import {useQuery} from "@apollo/client";
import {useLocation, useNavigate} from "react-router-dom";
import contestId from "../utils/ggsQuelingId.ts"
import Typography from "@mui/material/Typography";
import {animated, useSpring} from "@react-spring/web";
import {blue, grey, red} from "@mui/material/colors";
import {TeamStatus} from "../../../__generated__/graphql.ts";
import {useHover} from "react-use-gesture";
import {useState} from "react";
import TeamPanel from "../components/TeamPanel.tsx";
import StatusBadge from "../components/StatusBadge.tsx";

const GET_TEAMS_QUERY = gql(`query GgsTeamsQuery($contestId: ID!, $pageNum: Int!) {
    teams(contestId: $contestId, pageNum: $pageNum) {
        name
        players {
            name
        }
        leaderIndex
        status
        id
    }
}`)

const GET_TEAM_NUM_QUERY = gql(`query TeamNumQuery($contestId: ID!) {
    contestById(id: $contestId) {
        attendNum
    }
}`)

const AnimatedChip = animated(Chip)

export default function Teams() {

    const location = useLocation()
    const nav = useNavigate()
    const pageNum = +(new URLSearchParams(location.search).get("p") ?? 0)
    const [selectedTeamId, setSelectedTeamId] = useState("")

    const setPageNum = (v: number) => nav(`/ggs/teams?p=${v}`)

    const {data, loading, error} = useQuery(GET_TEAMS_QUERY, {
        variables: {
            contestId,
            pageNum
        }
    })

    const {data: teamNum, loading: loadingTeamNum, error: teamNumError} = useQuery(GET_TEAM_NUM_QUERY, {
        variables: {
            contestId
        }
    })

    const chipSprings = useSpring({
        width: loadingTeamNum ? "200px" : "130px",
        backgroundColor: (() => {
            if (loadingTeamNum) {
                return blue[200]
            } else if (teamNumError || error) {
                return red[300]
            } else {
                return grey[300]
            }
        })()
    })

    const contestNumText = () => {
        if (teamNumError || error) {
            return "链接错误"
        } else if (loadingTeamNum) {
            return "正在获取队伍数量..."
        } else {
            return `队伍数量：${teamNum?.contestById?.attendNum ?? "加载中..."}`
        }
    }





    const CustomizedCard = (props: {
        team: {
            __typename?: "Team" | undefined,
            name: string, leaderIndex?: number | null | undefined,
            status?: TeamStatus | null | undefined,
            id: string,
            players: {__typename?: "Player" | undefined, name: string}[]},
        key: number
    }) => {

        const {team, key: i} = props

        const [spring, api] = useSpring(() => ({
            backgroundColor: 'white'
        }))

        const AnimatedCard = animated(Card)

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
            <AnimatedCard key={i} style={{cursor: "pointer", ...spring}} {...bind()} onClick={() => {setSelectedTeamId(team.id)}}>
                <CardContent>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                        <Stack direction={"row"} spacing={2} alignItems={"center"}>
                            <Typography sx={{fontSize: "19px"}}>{team.name}</Typography>
                            <StatusBadge status={team.status ?? TeamStatus.Editing} />
                        </Stack>
                        <Typography sx={{fontSize: "13px"}}>{`成员数量: ${team.players.length}`}</Typography>
                    </Stack>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                        <Box/>
                        <Typography sx={{fontSize: "13px"}}>{`领队: ${team.players[team?.leaderIndex??0]?.name??"未指定"}`}</Typography>
                    </Stack>
                </CardContent>
            </AnimatedCard>
        )
    }


    return (
        <Stack spacing={2}>
            <AnimatedChip style={chipSprings} label={contestNumText()} />
            <Collapse in={loading}>
                <LinearProgress />
            </Collapse>
            <Collapse in={!loading && !error}>
                <Stack spacing={2}>
                    {data?.teams?.map((team, i) => (
                        <CustomizedCard team={team} key={i} />
                    )) ?? ''}
                    <Stack direction={"row"} sx={{width: "100%"}} justifyContent={"center"}>
                        <Pagination page={pageNum+1} onChange={(_, v) => setPageNum(v-1)} count={Math.ceil((teamNum?.contestById?.attendNum??0) / 20)}/>
                    </Stack>
                </Stack>
            </Collapse>
            <Dialog open={!!selectedTeamId} onClose={() => setSelectedTeamId("")} fullWidth maxWidth={"lg"}>
                <TeamPanel teamId={selectedTeamId} />
            </Dialog>
        </Stack>
    )
}