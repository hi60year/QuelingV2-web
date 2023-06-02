import React, {useEffect, useState} from "react";
import {
    Box,
    Card,
    CardActions,
    CardContent, CircularProgress,
    Collapse,
    CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton,
    LinearProgress, List, ListItem, Radio,
    Stack,
    TextField, ToggleButton, ToggleButtonGroup
} from "@mui/material";
import {blue} from "@mui/material/colors";
import Header from "../components/header.tsx";
import Toolbar from "@mui/material/Toolbar";
import {Route, Routes, useNavigate} from "react-router-dom";
import {useLazyQuery, useMutation} from "@apollo/client";
import {gql} from "../../../__generated__";
import {animated, config, useSpring, useTransition} from "@react-spring/web";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {useDebounce, useMeasure} from "react-use";
import './home.css'
import {Check, Close, Delete} from "@mui/icons-material";
import {TransitionGroup} from "react-transition-group";


const ggsQuelingId = "64763ca531d1b9a31d40f7e3"

export default function GgsHome() {
    return (
        <React.Fragment>
            <CssBaseline />
            <Stack sx={{minHeight: '100vh', minWidth: '100vw', backgroundColor: blue[50] }}>
                <Header/>
                <Toolbar/>
                <Box sx={{width: "calc(min(1200px, 100%))", alignSelf: "center", py: 3}}>
                    <Routes>
                        <Route path={"register"} element={<Register />}/>
                    </Routes>
                </Box>
            </Stack>
        </React.Fragment>
    )
}

const QUERY_INVITE_CODE = gql(`
    query InviteCodeQuery($contestId: ID!, $inviteCode: String!) {
        contestById(id: $contestId) {
            checkInviteCode(inviteCode: $inviteCode)
        }
    }
`)

const QUERY_TEAM_NAME_EXIST = gql(`
    query TeamNameExistQuery($contestId: ID!, $name: String!) {
        contestById(id: $contestId) {
            checkTeamNameExist(name: $name)
        }
    }
`)

const MUTATION_SAVE_TEAM = gql(`
    mutation SaveTeam($payload: TeamRegistrationPayload!, $inviteCode: String!) {
        registerNewTeam(registrationPayload: $payload, inviteCode: $inviteCode) {
            authorizationCode
            error {
                ... on TeamNameAlreadyExistError {
                    msg
                }
                ... on InviteCodeNotMatchError {
                    msg
                }
                ... on MaxTeamMemberExceededError{
                    msg
                }
            }
        }
    }
`)

function Register() {

    const [inviteCode, setInviteCode] = useState("")

    const [authorizationPassed, setAuthorizationPassed] = useState(false)

    const [enableInviteCodeListening, setEnableInviteCodeListening] = useState(false)

    const [inviteCodeTextField, setInviteCodeTextField] = useState("")

    const [getInviteCode, {data: inviteCodeData, loading: inviteCodeLoading, error: inviteCodeError}] = useLazyQuery(QUERY_INVITE_CODE, {
        variables: {
            contestId: ggsQuelingId,
            inviteCode
        },
        fetchPolicy: "network-only"
    })

    const [errorSwingingSpring, api] = useSpring(() => ({
        from: {
            transform: 'translateX(0px)',
            boxShadow: '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)'
        },
        config: {...config.wobbly, precision: 0.1},
        reset: true
    }))

    const transitions = useTransition(authorizationPassed, {
        from: {opacity: 0},
        enter: {opacity: 1},
        leave: {opacity: 0}
    })

    const AnimatedCard = animated(Card)

    const handleInviteCodeSubmit = () => {
        setInviteCode(inviteCodeTextField)
        getInviteCode()
        setEnableInviteCodeListening(true)
    }

    useEffect(() => {
        if (enableInviteCodeListening && !inviteCodeLoading) {
            if (inviteCodeData?.contestById?.checkInviteCode) {
                setAuthorizationPassed(true)
            } else {
                api.start({
                    to: async (next) => {
                        await new Promise(resolve => setTimeout(resolve, 600));
                        await next({
                            transform: 'translateX(10px)',
                            boxShadow: '0px 0px 10px 0px rgba(255, 0, 0, 0.5), 0px 10px 10px 0px rgba(255, 0, 0, 0.14), 0px 20px 20px 0px rgba(255, 0, 0, 0.12)'
                        });
                        await next({
                            transform: 'translateX(-10px)',
                            boxShadow: '0px 0px 10px 0px rgba(255, 0, 0, 0.5), 0px 10px 10px 0px rgba(255, 0, 0, 0.14), 0px 20px 20px 0px rgba(255, 0, 0, 0.12)'
                        });
                        await next({
                            transform: 'translateX(10px)',
                            boxShadow: '0px 0px 10px 0px rgba(255, 0, 0, 0.5), 0px 10px 10px 0px rgba(255, 0, 0, 0.14), 0px 20px 20px 0px rgba(255, 0, 0, 0.12)'
                        });
                        await next({
                            transform: 'translateX(-10px)',
                            boxShadow: '0px 0px 10px 0px rgba(255, 0, 0, 0.5), 0px 10px 10px 0px rgba(255, 0, 0, 0.14), 0px 20px 20px 0px rgba(255, 0, 0, 0.12)'
                        });
                        await next({
                            transform: 'translateX(0px)',
                            boxShadow: '0px 0px 10px 0px rgba(255, 0, 0, 0.5), 0px 10px 10px 0px rgba(255, 0, 0, 0.14), 0px 20px 20px 0px rgba(255, 0, 0, 0.12)'
                        });
                    },
                })
            }
        }
    }, [api, enableInviteCodeListening, inviteCodeLoading, inviteCodeData?.contestById?.checkInviteCode])

    return (
        <Stack flexDirection={"column"} sx={{width: "100%", flexGrow: 1}}>
            { transitions((style, item) => item ? (
                <RegistrationPage inviteCode={inviteCode}/>
            ) : (
                <AnimatedCard style={{...style, ...errorSwingingSpring}} sx={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "700px",
                    flexGrow: 0.5,
                    alignSelf: "center",
                    p: 2
                }}>
                    <CardContent>
                        <Typography variant={"h6"} sx={{ml: -1}}>请输入邀请码：</Typography>
                    </CardContent>
                    <CardActions>
                        <TextField
                            fullWidth
                            size={"small"}
                            value={inviteCodeTextField}
                            onChange={e => setInviteCodeTextField(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key == "Enter")
                                    handleInviteCodeSubmit()
                            }}
                            autoFocus/>
                        <Button variant={"outlined"} onClick={handleInviteCodeSubmit} sx={{height: "40px", ml: 2, width: "90px"}}>确认</Button>
                    </CardActions>
                    <Collapse in={inviteCodeLoading}>
                        <CardActions>
                            <LinearProgress sx={{width : "100%"}}/>
                        </CardActions>
                    </Collapse>
                </AnimatedCard>
            ))}
        </Stack>
    )
}

interface PlayerPayload {
    name: string,
    tziakchaName: string,
    qqNum: string,
    isCurrentStudent: boolean
}

const newPlayer = (): PlayerPayload => ({
    name: "",
    tziakchaName: "",
    qqNum: "",
    isCurrentStudent: true
})

function RegistrationPage(props: {inviteCode: string}) {

    const [teamName, setTeamName] = useState("")
    const [showSpinner, setShowSpinner] = useState(false)
    const [cardRef, {width: cardWidth}] = useMeasure()
    const [debouncedTeamName, setDebouncedTeamName] = useState("")
    const [campuses, setCampuses] = useState("")
    const [players, setPlayers] = useState<PlayerPayload[]>([newPlayer()])
    const [leaderIndex, setLeaderIndex] = useState(0)
    const [validationError, setValidationError] = useState("")
    const [submitDisabled, setSubmitDisabled] = useState(false)
    const [submitDialogOpened, setSubmitDialogOpened] = useState(false)
    const nav = useNavigate()

    const [getTeamNameExist, {data: teamNameExistData, loading: teamNameExistLoading, error: teamNameExistError}] = useLazyQuery(QUERY_TEAM_NAME_EXIST, {
        variables: {
            contestId: ggsQuelingId,
            name: debouncedTeamName
        },
        fetchPolicy: "network-only"
    })

    const [saveTeam, {error: saveTeamError, data}] = useMutation(MUTATION_SAVE_TEAM, {
        variables: {
            payload: {
                contestId: ggsQuelingId,
                name: teamName,
                leaderIndex,
                players: players.map((it) => ({
                    name: it.name,
                    platformInfos: [{
                        rankingInfoType: "Tziakcha",
                        name: it.tziakchaName
                    }],
                    extraInfo: {
                        isCurrentStudent: it.isCurrentStudent
                    }
                })),
                extraInfo: {
                    colleges: campuses,
                }
            },
            inviteCode: props.inviteCode
        }
    })

    useDebounce(() => {
        setDebouncedTeamName(teamName)
    }, 2000, [teamName])

    useEffect(() => {
        if (teamName) {
            setShowSpinner(true)
        } else {
            setShowSpinner(false)
        }
    }, [teamName])

    useEffect(() => {
        if (debouncedTeamName) {
            getTeamNameExist()
        }
    }, [debouncedTeamName])

    const AnimatedTextField = animated(TextField)

    const nameCheckSpring = useSpring({
        width: teamName ? cardWidth - 160 : cardWidth
    })

    const refCaster = (instance: HTMLDivElement | null) => {
        if (instance !== null) {
            cardRef(instance as unknown as Element)
        }
    }

    const nameAcknowledged = () =>
        !!((! teamNameExistData?.contestById?.checkTeamNameExist)
        && debouncedTeamName
        && teamName
        && teamName === debouncedTeamName
        && (! teamNameExistLoading))

    const renderPlayerItem = (player: PlayerPayload, index: number) => (
        <ListItem sx={{px: 0, pt: index === 0 ? 0 : 1}}>
            <Grid container spacing={2} sx={{width: "100%", px: 3}} columns={17}>
                <Grid item xs={4}>
                    <TextField size={"small"} value={player.name} onChange={(e) => {
                        players[index].name = e.target.value
                        setPlayers([...players])
                    }} />
                </Grid>
                <Grid item xs={4}>
                    <TextField size={"small"} value={player.tziakchaName} onChange={(e) => {
                        players[index].tziakchaName = e.target.value
                        setPlayers([...players])
                    }} />
                </Grid>
                <Grid item xs={4}>
                    <TextField size={"small"} value={player.qqNum} onChange={(e) => {
                        players[index].qqNum = e.target.value
                        setPlayers([...players])
                    }} />
                </Grid>
                <Grid item xs={3}>
                    <ToggleButtonGroup
                        value={players[index].isCurrentStudent}
                        exclusive
                        onChange={(_, newSelected) => {
                            players[index].isCurrentStudent = newSelected
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
                        onChange={e => setLeaderIndex(+e.target.value)}
                        value={index}
                        sx={{ml: -1}}
                    />
                </Grid>
                <Grid item xs={1}>
                    <IconButton onClick={() => {
                        setLeaderIndex((leaderIndex) => leaderIndex - (leaderIndex === index ? leaderIndex : +(leaderIndex > index)))
                        setPlayers((players) => players.filter((_, i) => i !== index))
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
            if (!(it.name && it.tziakchaName && it.qqNum)) {
                setValidationError(`选手${i + 1}的信息未填写完整!`)
                setSubmitDisabled(false)
                return
            } else if (!it.qqNum.match(/^[0-9]*$/)) {
                setValidationError(`选手${i + 1}的QQ号码不合法!`)
                setSubmitDisabled(false)
                return
            }
        }

        const result = await saveTeam();

        if (!(result.errors || result?.data?.registerNewTeam?.error )) {
            setSubmitDialogOpened(true)
        } else {
            setValidationError( (JSON.stringify(result.errors) ?? "") || (result?.data?.registerNewTeam?.error?.msg??""))
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
                    <Stack flexDirection={"row"} alignItems={"center"} sx={{mb:3, width: "100%"}} ref={refCaster}>
                        <AnimatedTextField autoFocus size={"small"} sx={{mx: 5}} style={nameCheckSpring}
                            value={teamName} onChange={e => setTeamName(e.target.value)}
                            inputProps={{
                                style: {textAlign: "center"}
                            }}
                        />
                        {showSpinner && (teamName !== debouncedTeamName || teamNameExistLoading)  && <CircularProgress size={30}/>}
                        {nameAcknowledged()
                            && <Check className={"blink"} sx={{color: 'green'}}/>}
                        {(teamNameExistData?.contestById?.checkTeamNameExist)
                            && debouncedTeamName
                            && teamName
                            && teamName === debouncedTeamName
                            && (! teamNameExistLoading)
                            && <Close className={"blink"} sx={{color: 'red'}}/>}
                    </Stack>
                </CardActions>
            </Card>
            <Collapse in={nameAcknowledged()}>
                <Stack spacing={2}>
                    <Card>
                        <CardContent>
                            <Typography variant={"h6"}>
                                成员学校
                            </Typography>
                            <Typography color={"grey"}>
                                请填写该队内所有成员的学校，不同学校之间请用半角逗号分隔，方便审核；若队内成员均来自队伍名所示学校，则该项可不填。
                            </Typography>
                        </CardContent>

                        <CardActions>
                            <TextField value={campuses}
                                       onChange={e => setCampuses(e.target.value)}
                                       size={"small"}
                                       variant={"standard"}
                                       sx={{mx: 1, mb: 1}}
                                       fullWidth
                            />
                        </CardActions>
                    </Card>
                    <Card>
                        <CardContent>
                            <Typography variant={"h6"}>
                                成员
                            </Typography>
                        </CardContent>
                        <CardContent>
                            <Grid container spacing={2} sx={{width: "100%", px: 3, mb: -3}} columns={17}>
                                <Grid item xs={4}>
                                    <Typography>
                                        <b>名称</b>
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography>
                                        <b>雀渣名称</b>
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography>
                                        <b>QQ号</b>
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
                            取消
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
                    <DialogContentText>恭喜，您已成功报名国高赛，请务必保管好队伍管理码。</DialogContentText>
                </DialogContent>
                <DialogContent>
                    <TextField value={data?.registerNewTeam?.authorizationCode} fullWidth label={"队伍管理码"}/>
                </DialogContent>
                <DialogActions>
                    <Button variant={"contained"} fullWidth sx={{mx: 2, mb: 1}} onClick={() => nav("/ggs")}>返回主页</Button>
                </DialogActions>
            </Dialog>


        </Stack>
    )
}