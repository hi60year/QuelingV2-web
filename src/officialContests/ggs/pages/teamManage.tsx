import {
    Box,
    Card,
    CardActions,
    CardContent,
    Collapse, Dialog, DialogContent, DialogContentText, DialogTitle,
    Grid, IconButton,
    List, ListItem, Radio,
    Stack,
    TextField, ToggleButton, ToggleButtonGroup
} from "@mui/material";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {gql} from "../../../__generated__";
import {useMutation, useQuery} from "@apollo/client";
import {useEffect, useState} from "react";
import {newPlayer, PlayerPayload} from "../utils/playerUtils.ts";
import Typography from "@mui/material/Typography";
import {Delete} from "@mui/icons-material";
import {TransitionGroup} from "react-transition-group";
import Button from "@mui/material/Button";

const UPDATE_TEAM_MUTATION = gql(`mutation UpdateTeamMutation($teamId: ID!, $payload: TeamUploadPayload!) {
    updateTeam(teamId: $teamId, updatePayload: $payload)
}`)

const GET_TEAM_QUERY = gql(`query GgsTeamQuery($teamId: ID!) {
    teamById(id: $teamId) {
        name
        players {
            name
            platformInfos {
                name
                platform
            }
            extraInfo
        }
        leaderIndex
        playerOrder
        extraInfo
        status
    }
}`)

export default function TeamManage() {

    const {teamId} = useParams<{
        teamId: string,
    }>()

    const [searchParams] = useSearchParams()

    const authorizationCode = searchParams.get("authorizationCode")
    const [players, setPlayers] = useState<PlayerPayload[]>([newPlayer()])
    const [leaderIndex, setLeaderIndex] = useState(0)
    const [leaderIndexChanged, setLeaderIndexChanged] = useState(false)
    const [validationError, setValidationError] = useState("")
    const [submitDisabled, setSubmitDisabled] = useState(false)
    const [submitDialogOpened, setSubmitDialogOpened] = useState(false)
    const [playersChanged, setPlayersChanged] = useState(false)
    const nav = useNavigate()

    const {data: teamData, error: fetchTeamError, loading: fetchingTeam} = useQuery(GET_TEAM_QUERY, {
        variables: {
            teamId: teamId ?? ""
        }
    })

    useEffect(() => {
        if (!fetchingTeam && !fetchTeamError) {
            setPlayers(teamData?.teamById?.players?.map((it) => ({
                name: it.name,
                tziakchaName: it.platformInfos[0]?.name ?? "",
                qqNum: it.extraInfo?.["qqNum"] ?? "",
                isCurrentStudent: it.extraInfo?.["isCurrentStudent"] ?? false,
                college: it.extraInfo?.["college"] ?? false
            }))??[])
        }
    }, [fetchingTeam, fetchTeamError, teamData])

    const [update] = useMutation(UPDATE_TEAM_MUTATION, {
        variables: {
            teamId: teamId ?? "",
            payload: {
                authorizationCode: authorizationCode ?? "",
                players: playersChanged ? players.map((it) => ({
                    name: it.name,
                    platformInfos: [{
                        rankingInfoType: "Tziakcha",
                        name: it.tziakchaName
                    }],
                    extraInfo: {
                        isCurrentStudent: it.isCurrentStudent,
                        qqNum: it.qqNum,
                        college: it.college
                    }
                })) : undefined,
                leaderIndex: leaderIndexChanged ? leaderIndex : undefined
            }
        }
    })

    const renderPlayerItem = (player: PlayerPayload, index: number) => (
        <ListItem sx={{px: 0, pt: index === 0 ? 0 : 1}}>
            <Grid container spacing={2} sx={{width: "100%", px: 3}} columns={17}>
                <Grid item xs={3}>
                    <TextField size={"small"} value={player.name} onChange={(e) => {
                        players[index].name = e.target.value
                        setPlayersChanged(true)
                        setPlayers([...players])
                    }} />
                </Grid>
                <Grid item xs={3}>
                    <TextField size={"small"} value={player.tziakchaName} onChange={(e) => {
                        players[index].tziakchaName = e.target.value
                        setPlayersChanged(true)
                        setPlayers([...players])
                    }} />
                </Grid>
                <Grid item xs={3}>
                    <TextField size={"small"} value={player.qqNum} onChange={(e) => {
                        players[index].qqNum = e.target.value
                        setPlayersChanged(true)
                        setPlayers([...players])
                    }} />
                </Grid>
                <Grid item xs={3}>
                    <TextField size={"small"} value={player.college} onChange={(e) => {
                        players[index].college = e.target.value
                        setPlayersChanged(true)
                        setPlayers([...players])
                    }} />
                </Grid>
                <Grid item xs={3}>
                    <ToggleButtonGroup
                        value={players[index].isCurrentStudent}
                        exclusive
                        onChange={(_, newSelected) => {
                            players[index].isCurrentStudent = newSelected
                            setPlayersChanged(true)
                            setPlayers([...players])
                        }}
                        sx={{height: "40px"}}
                    >
                        <ToggleButton value={true}>
                            在读生
                        </ToggleButton>
                        <ToggleButton value={false}>
                            毕业生
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={1}>
                    <Radio
                        checked={leaderIndex === index}
                        onChange={e => {
                            setLeaderIndex(+e.target.value)
                            setLeaderIndexChanged(true)
                        }}
                        value={index}
                        sx={{ml: -1}}
                    />
                </Grid>
                <Grid item xs={1}>
                    <IconButton onClick={() => {
                        setLeaderIndex((leaderIndex) => leaderIndex - (leaderIndex === index ? leaderIndex : +(leaderIndex > index)))
                        setPlayers((players) => players.filter((_, i) => i !== index))
                        setPlayersChanged(true)
                        setLeaderIndexChanged(true)
                    }}>
                        <Delete />
                    </IconButton>
                </Grid>
            </Grid>
        </ListItem>
    )

    const handleAddPlayer = () => {
        setPlayers([...players, newPlayer()])
    }

    const handleSubmit = async () => {
        setSubmitDisabled(true)
        for (let i = 0; i < players.length; i++) {
            const it = players[i]
            if (!(it.name && it.tziakchaName && it.qqNum && it.college)) {
                setValidationError(`选手${i + 1}的信息未填写完整!`)
                setSubmitDisabled(false)
                return
            } else if (!it.qqNum.match(/^[0-9]*$/)) {
                setValidationError(`选手${i + 1}的QQ号码不合法!`)
                setSubmitDisabled(false)
                return
            }
        }
        const result = await update()
        if (result.data?.updateTeam) {
            setSubmitDialogOpened(true)
            setTimeout(() => {
                nav("/ggs")
                nav(0)
            }, 3000)
        } else {
            setValidationError(result.errors?.toString()??"")
            setSubmitDisabled(false)
        }
    }

    return (
        <Stack spacing={2}>
            <Card>
                <CardContent sx={{display: "flex", justifyContent: "center"}}>
                    <Typography variant={"h5"}>队伍名</Typography>
                </CardContent>
                <CardActions>
                    <Stack flexDirection={"row"} alignItems={"center"} sx={{mb:3, width: "100%"}}>
                        <TextField size={"small"} sx={{mx: 5}}
                                           value={teamData?.teamById?.name??""} disabled
                                           inputProps={{
                                               style: {textAlign: "center"}
                                           }}
                                   fullWidth
                        />
                    </Stack>
                </CardActions>
            </Card>
            <Collapse in={true}>
                <Stack spacing={2}>
                    <Card>
                        <CardContent>
                            <Typography variant={"h6"}>
                                成员
                            </Typography>
                        </CardContent>
                        <CardContent>
                            <Grid container spacing={2} sx={{width: "100%", px: 3, mb: -3}} columns={17}>
                                <Grid item xs={3}>
                                    <Typography>
                                        <b>名称</b>
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>
                                        <b>雀渣名称</b>
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>
                                        <b>QQ号</b>
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography>
                                        <b>学校</b>
                                    </Typography>
                                </Grid>
                                <Grid item xs={3} />
                                <Grid item xs={1}>
                                    <Typography>
                                        <b>领队</b>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardContent>
                            <List>
                                <TransitionGroup>
                                    {players.map((item, i) => (
                                        <Collapse key={i}>
                                            {renderPlayerItem(item, i)}
                                        </Collapse>
                                    ))}
                                </TransitionGroup>
                            </List>
                        </CardContent>
                        <CardActions>
                            <Button fullWidth variant={"contained"} sx={{my: 1, mx: 2}} onClick={handleAddPlayer}>添加新成员</Button>
                        </CardActions>
                    </Card>
                    <Collapse in={!!validationError}>
                        <Card>
                            <CardContent>
                                <Typography sx={{color: "red"}}>{validationError}</Typography>
                            </CardContent>
                        </Card>
                    </Collapse>
                    <Box sx={{alignSelf: "end"}}>
                        <Button variant={"contained"} sx={{backgroundColor: "grey", width: "130px"}} onClick={() => nav(0)}>
                            重置
                        </Button>
                        <Button variant={"contained"} disabled={submitDisabled} tabIndex={-1} sx={{backgroundColor: "green", width: "130px", ml:2}} onClick={handleSubmit}>
                            提交
                        </Button>
                    </Box>
                </Stack>
            </Collapse>
            <Dialog open={submitDialogOpened} fullWidth>
                <DialogTitle>成功</DialogTitle>
                <DialogContent>
                    <DialogContentText>三秒后将返回主页...</DialogContentText>
                </DialogContent>
            </Dialog>


        </Stack>
    )
}