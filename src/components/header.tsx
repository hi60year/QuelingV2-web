import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import {blue, blueGrey, grey} from '@mui/material/colors';
import {Box, styled, useMediaQuery, useTheme} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {Search} from "@mui/icons-material";

const SearchInput = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        transition: theme.transitions.create('width'),
        paddingLeft: "10px",
        [theme.breakpoints.up('sm')]: {
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            width: '25ch',
            '&:focus': {
                width: '35ch',
            },
        },
        [theme.breakpoints.down('sm')]: {
            flexGrow: 1
        },
        backgroundColor: grey[400],
    },
}));

const Header: React.FC = () => {
    const theme = useTheme();
    const underMid = useMediaQuery(theme.breakpoints.down("md"));
    const underSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const nav = useNavigate()

    return (
        <AppBar sx={{backgroundColor: blueGrey[50]}}>
            <Toolbar>
                <Typography variant={"h6"} component={"div"} sx={{
                    letterSpacing: 3,
                    color: grey[800],
                    marginLeft: underMid ? "10px" : "50px",
                    cursor: "pointer",
                }}
                            whiteSpace={"nowrap"}
                            onClick={() => nav("/")}
                >
                    雀 岭
                </Typography>
                {!underMid && <Typography variant={"subtitle1"} component={"div"} sx={{
                    letterSpacing: 3,
                    color: grey[500],
                    marginLeft: "40px"
                }}>
                    竞技麻将赛事管理平台
                </Typography>}

                <Box sx={{
                    position: 'relative',
                    display: 'inline-block',
                    marginLeft: !underMid ? "50px" : "20px"
                }}>
                    <Search sx={{
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 999,
                        ...(underSmall ? {
                            right: '13px',
                        } : {
                            left: '13px'
                        })
                    }}/>
                    <SearchInput placeholder={"搜索比赛..."}/>
                </Box>

                <Box sx={{flexGrow: 1}}/>
                <Button sx={{
                    color: blue[300],
                    marginX: "10px",
                    letterSpacing: 2,
                    whiteSpace: "nowrap"
                }}
                        size={"large"}
                >
                    申请比赛
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;