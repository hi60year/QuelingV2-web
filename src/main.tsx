import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./pages/home.tsx";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev";
import ContestHome from "./pages/contestHome.tsx";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import GgsHome from "./officialContests/ggs/pages/home.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>
    },
    {
        path: "/com",
        element: <ContestHome mahjongType={'com'} />
    },
    {
        path: "/riichi",
        element: <ContestHome mahjongType={'riichi'} />
    },
    {
        path: "/ggs/*",
        element: <GgsHome />
    }
])

const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                GetContestList: {
                    keyArgs: false,

                    merge(existing = [], incoming) {
                        return [...existing, ...incoming]
                    }
                }
            }
        }
    }
})

const client = new ApolloClient({
    uri: 'http://localhost:8080/query',
    cache
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <DevSupport ComponentPreviews={ComponentPreviews}
                    useInitialHook={useInitial}
        >
            <ApolloProvider client={client}>
                <RouterProvider router={router}/>
            </ApolloProvider>
        </DevSupport>
    </React.StrictMode>,
)
