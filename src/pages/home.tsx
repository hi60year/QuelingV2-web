import {
    Box,
    Card,
    CssBaseline,
    Divider, IconButton,
    Stack,
    useMediaQuery,
    useTheme
} from "@mui/material";
import Header from "../components/header.tsx";
import React, {useEffect, useRef, useState} from "react";
import {IParallax, Parallax, ParallaxLayer} from "@react-spring/parallax"
import Toolbar from "@mui/material/Toolbar";
import "./home.css"
import Typography from "@mui/material/Typography";
import {blue, grey} from "@mui/material/colors";
import {ArrowLeft, ArrowRight, ChevronRight} from "@mui/icons-material";
import ParallaxPagination from "../components/parallaxPagination.tsx";
import {useNavigate} from "react-router-dom";



function Home() {
    const theme = useTheme();
    const parallax = useRef<IParallax>(null)
    const underSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const [currentSelectedPage, setCurrentSelectedPage] = useState<number>(0);
    const nav = useNavigate()
    const parallaxPageNum = 2
    const parallaxContainer = useRef<HTMLDivElement>(null)

    // disable touch scroll on parallax
    useEffect(() => {
        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault()
        }

        const parallaxContainerNode = parallaxContainer.current

        parallaxContainerNode?.addEventListener('touchmove', handleTouchMove, {passive: false})

        return () => {
            parallaxContainerNode?.removeEventListener('touchmove', handleTouchMove)
        }
    })

    const nextPage = (currentPage: number) => (currentPage + 1) % parallaxPageNum
    const prevPage = (currentPage: number) => (currentPage - 1 + parallaxPageNum) % parallaxPageNum

    useEffect(() => {
        if (parallax.current)
            parallax.current.scrollTo(currentSelectedPage)
    })

    useEffect( () => {
        const timeoutId = setTimeout(() => {
            setCurrentSelectedPage(nextPage(currentSelectedPage))
        }, 7000)

        return () => {
            clearTimeout(timeoutId)
        }
    }, [currentSelectedPage])

    return (
        <React.Fragment>
            <CssBaseline />
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: '100vw', backgroundColor: blue[50] }}>
                    <Header />
                    <Box>
                        <Toolbar/>
                        <div ref={parallaxContainer}>
                        <Parallax className={"parallax"} ref={parallax} pages={parallaxPageNum} horizontal>
                            <ParallaxLayer speed={0.2} offset={0}>
                                <Box className={"image-container"}/>
                            </ParallaxLayer>
                            <ParallaxLayer className={"parallax-title"} offset={0} speed={0.5}>
                                <Typography className={"parallax-title-text"}
                                            variant={"h2"}
                                            letterSpacing={15}
                                >
                                    雀岭
                                </Typography>
                            </ParallaxLayer>
                            <ParallaxLayer className={"parallax-title"} offset={0} speed={0.7}>
                                <Typography className={"parallax-text"} sx={{...(underSmall ? {left : "14%"} : {})}}>
                                    竞技麻将赛事管理平台
                                </Typography>
                            </ParallaxLayer>
                            <ParallaxLayer sticky={{start: 0, end: parallaxPageNum - 1}}>
                                <ParallaxPagination
                                    className={"parallax-pagination"}
                                    pageNum={parallaxPageNum}
                                    currentSelectedPage={currentSelectedPage}
                                    currentSelectedPageSetter={setCurrentSelectedPage}
                                />

                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        right: '0px',
                                        color: grey[300],
                                        borderRadius: 0,
                                        height: '100%',
                                        paddingX: '50px'
                                    }}
                                    size={"large"}
                                    onClick={() => setCurrentSelectedPage(nextPage(currentSelectedPage))}
                                >
                                    <ArrowRight sx={{ fontSize: 50 }}/>
                                </IconButton>
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: grey[300],
                                        borderRadius: 0,
                                        height: '100%',
                                        paddingX: '50px'
                                    }}
                                    size={"large"}
                                    onClick={() => setCurrentSelectedPage(prevPage(currentSelectedPage))}
                                >
                                    <ArrowLeft sx={{ fontSize: 50 }}/>
                                </IconButton>
                            </ParallaxLayer>

                        </Parallax>
                        </div>
                        <Stack direction={"row"} spacing={5} justifyContent={"center"} sx={{mt: 5}}>
                            <Card className={"subpage-entrance-card card1"} sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                ':hover': {
                                    cursor: 'pointer'
                                }
                            }}
                                onClick={() => nav("/com")}
                            >
                                <Typography variant={"h2"} className={"entrance-text"} >
                                    国标麻将
                                </Typography>
                                <Typography variant={"h4"} className={"entrance-text"} >
                                    COM
                                </Typography>
                                <ChevronRight className={"entrance-chevron"} fontSize={'large'}/>
                            </Card>
                            <Divider variant={"middle"} flexItem orientation={"vertical"}/>
                            <Card className={"subpage-entrance-card card2"} sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                ':hover': {
                                    cursor: 'pointer'
                                }
                            }}
                                onClick={() => nav("/riichi")}
                            >
                                <Typography variant={"h2"} className={"entrance-text"} >
                                    立直麻将
                                </Typography>
                                <Typography variant={"h4"} className={"entrance-text"} >
                                    Riichi
                                </Typography>
                                <ChevronRight className={"entrance-chevron"} fontSize={'large'}/>
                            </Card>
                        </Stack>
                    </Box>
                </Box>
        </React.Fragment>
    )
}

export default Home;
