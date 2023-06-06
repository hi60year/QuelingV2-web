import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {Box, styled, Tab, TabProps, Tabs, TabsProps} from "@mui/material";
import {Link, matchPath, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import findLastIndex from "../../../utils/findLastIndex.ts";
import InputBase from "@mui/material/InputBase";
import {grey} from "@mui/material/colors";
import {Search} from "@mui/icons-material";


const StyledTabs = styled((props: TabsProps) => (
    <Tabs
        {...props}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))({
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
        maxWidth: 40,
        width: '100%',
        backgroundColor: '#635ee7',
    },
});

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
        backgroundColor: grey[600],
    }
}));


const StyledTab = styled((props: TabProps | {to: string, component: typeof Link}) => (
    <Tab disableRipple {...props} />
))(({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
        color: '#fff',
    },
    '&.Mui-focusVisible': {
        backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
}));

export default function Header() {

    const {pathname} = useLocation()
    const [currentTab, setCurrentTab] = useState<number | null>(0)

    useEffect(() => {
        const routes = ["/ggs", "/ggs/register", "/ggs/teams", "/ggs/grouping", "/ggs/score"]
        const index = findLastIndex(routes, (it) => !!matchPath(it, pathname))
        if (index == -1) {
            setCurrentTab(null)
        } else {
            setCurrentTab(index)
        }
    }, [pathname])

    return (
        <AppBar sx={{backgroundColor: 'black'}}>
            <Toolbar>
                <Typography variant={"h6"} sx={{letterSpacing: 6}}>全国高校国标麻将联赛</Typography>
                <StyledTabs value={currentTab} sx={{ml: 3}}>
                    <StyledTab label="首页" value={0} to={"/ggs"} component={Link} />
                    <StyledTab label="报名" value={1} to={"/ggs/register"} component={Link} />
                    <StyledTab label="队伍" value={2} to={"/ggs/teams"} component={Link} />
                    <StyledTab label="分组" value={3} to={"/ggs/grouping"} component={Link} />
                    <StyledTab label="成绩" value={4} to={"/ggs/score"} component={Link} />
                </StyledTabs>
                <Box sx={{
                    position: 'relative',
                    display: 'inline-block',
                    marginLeft: "20px"
                }}>
                    <Search sx={{
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 999,
                        left: '13px'
                    }}/>
                    <SearchInput placeholder={"搜索队伍..."}/>
                </Box>
                <Box sx={{flexGrow: 1}}/>
                <Button>联系我们</Button>
            </Toolbar>
        </AppBar>
    )
}