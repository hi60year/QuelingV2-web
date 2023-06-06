import {
    Card,
    CardContent,
    Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Fade,
    LinearProgress,
    Paper,
    Stack,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, useMediaQuery, Zoom
} from "@mui/material";
import {useLazyQuery, useQuery} from "@apollo/client";
import {gql} from "../../../__generated__";
import Typography from "@mui/material/Typography";
import {TeamStatus} from "../../../__generated__/graphql.ts";
import StatusBadge from "./StatusBadge.tsx";
import Button from "@mui/material/Button";
import {useRef, useState} from "react";
import {blueGrey} from "@mui/material/colors";
import {Star} from "@mui/icons-material";
import {LoadingButton} from "@mui/lab";
import {useNavigate} from "react-router-dom";

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

const CHECK_AUTHORIZATION_QUERY = gql(`query CheckAuthorizationCodeQuery($teamId: ID!, $authorizationCode: String!) {
    teamById(id: $teamId) {
        checkAuthorizationCode(authorizationCode: $authorizationCode)
    }
}`)

export default function TeamPanel(props: {teamId: string}) {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [changingState, setChangingState] = useState(false)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [deleting, setDeleting] = useState(false)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [teamNameConfirm, setTeamNameConfirm] = useState("")
    const [managing, setManaging] = useState(false)
    const [authorizationCode, setAuthorizationCode] = useState("")
    const [loadingAuthorizationCode, setLoadingAuthorizationCode] = useState(false)
    const [authorizationCodeError, setAuthorizationCodeError] = useState(false)
    const isShortScreen = useMediaQuery('(max-height:700px)')
    const nav = useNavigate()

    const {teamId} = props

    const containerRef = useRef(null)

    const {loading, data} = useQuery(GET_TEAM_QUERY, {
        variables: {
            teamId
        }
    })

    const [fetch] = useLazyQuery(CHECK_AUTHORIZATION_QUERY, {
        variables: {
            teamId,
            authorizationCode
        }
    })

    const submitAuthorizationCode = async () =>  {
        setAuthorizationCodeError(false)
        setLoadingAuthorizationCode(true)
        const accepted = await fetch()
        if (accepted.data?.teamById?.checkAuthorizationCode) {
            nav(`/ggs/teams/manage/${teamId}?authorizationCode=${authorizationCode}`)
        } else {
            setAuthorizationCodeError(true)
        }
        setLoadingAuthorizationCode(false)
    }


    return (
        <Card sx={{
            paddingTop: "20px",
            paddingX: "30px",
            position: "relative",
            backgroundColor: blueGrey[100],
        }}>
            <Collapse in={loading}>
                <LinearProgress />
            </Collapse>
            <Collapse in={!loading && !!data}>
                <CardContent>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                        <Stack direction={"row"} spacing={2} alignItems={"center"}>
                            <Typography gutterBottom variant={"h5"} component={"div"} sx={{m: 0}}>{data?.teamById?.name ?? ""}</Typography>
                            <StatusBadge status={data?.teamById?.status ?? TeamStatus.Editing} />
                        </Stack>
                        <Stack direction={"row"} alignItems={"center"} spacing={2}>
                            <Button variant={"contained"} onClick={() => setChangingState(true)}>变更状态</Button>
                            <Button variant={"contained"} color={"error"} onClick={() => {
                                setTeamNameConfirm("")
                                setDeleting(true)
                            }}>删除</Button>
                        </Stack>
                    </Stack>
                    <Fade in={true} style={{transitionDuration: "1s"}}>
                        <Paper elevation={4} sx={{marginTop: "20px"}}>
                            <TableContainer sx={{maxHeight: isShortScreen ? "300px" : "490px"}}>
                                <Table ref={containerRef} stickyHeader size={isShortScreen ? "small" : "medium"}>
                                    <TableHead>
                                        <TableRow>
                                            {
                                                [
                                                    <TableCell/>,
                                                    <TableCell>序号</TableCell>,
                                                    <TableCell>名称</TableCell>,
                                                    <TableCell>雀渣名称</TableCell>,
                                                    <TableCell>QQ号</TableCell>,
                                                    <TableCell>学校</TableCell>
                                                ].map((col, i) => <Zoom key={i} in={true} style={{transitionDelay: `${i * 50}ms`}}>
                                                    {col}
                                                </Zoom>)
                                            }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            data?.teamById?.players?.map((mem, index) =>
                                                <Fade key={index} in
                                                      style={{
                                                          transitionDelay: `${300 + index * 100}ms`,
                                                          transitionDuration: "1s"
                                                      }}
                                                >
                                                    <TableRow>
                                                        <TableCell align={"center"}>{data?.teamById?.leaderIndex === index && <Star fontSize={"medium"} sx={{
                                                            color: 'red',
                                                        }}/>}</TableCell>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>{mem?.name}</TableCell>
                                                        <TableCell>{mem?.platformInfos[0]?.name}</TableCell>
                                                        <TableCell>{mem?.extraInfo["qqNum"]}</TableCell>
                                                        <TableCell>{mem?.extraInfo["college"]}</TableCell>
                                                    </TableRow>
                                                </Fade>)
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Fade>
                </CardContent>
                <CardContent>
                    <Button fullWidth variant={"outlined"} sx={{mt: -2}} onClick={() => setManaging(true)}>管理队伍</Button>
                </CardContent>
            </Collapse>
            <Dialog open={managing} onClose={() => setManaging(false)}
                    maxWidth={"sm"}
                    fullWidth
            >
                <DialogTitle>
                    队伍管理
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        请输入管理码，管理码在创建队伍时下发。
                    </DialogContentText>
                    <TextField
                        fullWidth
                        autoFocus
                        variant={"standard"}
                        margin={"dense"}
                        id={"inviteCode"}
                        value={authorizationCode}
                        error={authorizationCodeError}
                        helperText={authorizationCodeError && "错误的管理码"}
                        onChange={(event) => setAuthorizationCode(event.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === "Enter" && !loadingAuthorizationCode) {
                                setTimeout(submitAuthorizationCode, 500)
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setManaging(false)}>取消</Button>
                    <LoadingButton onClick={submitAuthorizationCode} loading={loadingAuthorizationCode}>确认</LoadingButton>
                </DialogActions>
            </Dialog>
        </Card>
    )
}