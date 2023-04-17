import React from "react";
import {AppProps} from "next/app";
import type {NextPage} from "next";
import {AuthBindings, Refine} from "@refinedev/core";
import {RefineKbarProvider} from "@refinedev/kbar";
import {SessionProvider, signIn, signOut, useSession} from "next-auth/react";
import {useRouter} from "next/router";
import PeopleIcon from '@mui/icons-material/People';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import {notificationProvider, RefineSnackbarProvider, ThemedLayoutV2,} from "@refinedev/mui";
import routerProvider, {UnsavedChangesNotifier,} from "@refinedev/nextjs-router";
import DashboardIcon from '@mui/icons-material/Dashboard';
import dataProvider from "@refinedev/simple-rest";
import {CssBaseline, GlobalStyles} from "@mui/material";
import {ColorModeContextProvider} from "@contexts";
import {Header} from "@components/header";
import {CustomBanner} from "@components/CustomBanner";
import {Sider} from "@components/sider";

const API_URL = "https://api.finefoods.refine.dev";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    noLayout?: boolean;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

const App = (props: React.PropsWithChildren) => {
    const {data, status} = useSession();
    const router = useRouter();
    const {to} = router.query;

    if (status === "loading") {
        return <span>loading...</span>;
    }

    const authProvider: AuthBindings = {
        login: async () => {
            signIn("auth0", {
                callbackUrl: to ? to.toString() : "/",
                redirect: true,
            });

            return {
                success: true,
            };
        },
        logout: async () => {
            signOut({
                redirect: true,
                callbackUrl: "/login",
            });

            return {
                success: true,
            };
        },
        onError: async (error) => {
            console.error(error);
            return {
                error,
            };
        },
        check: async () => {
            if (status === "unauthenticated") {
                return {
                    authenticated: false,
                    redirectTo: "/login",
                };
            }

            return {
                authenticated: true,
            };
        },
        getPermissions: async () => {
            return null;
        },
        getIdentity: async () => {
            if (data?.user) {
                const {user} = data;
                return {
                    name: user.name,
                    avatar: user.image,
                };
            }

            return null;
        },
    };

    return (
        <>
            <CustomBanner/>
            <RefineKbarProvider>
                <ColorModeContextProvider>
                    <CssBaseline/>
                    <GlobalStyles styles={{html: {WebkitFontSmoothing: "auto"}}}/>
                    <RefineSnackbarProvider>
                        <Refine
                            routerProvider={routerProvider}
                            dataProvider={dataProvider(API_URL)}
                            notificationProvider={notificationProvider}
                            authProvider={authProvider}
                            resources={[
                                {
                                    name: "dashboard",
                                    list: "/dashboard",
                                    meta: {
                                        canDelete: true,
                                    },
                                    options: {
                                        icon: <DashboardIcon/>,
                                        label: "Dashboard"
                                    }
                                },
                                {
                                    name: "users",
                                    list: "/users",
                                    show: "/users/show/:id",
                                    meta: {
                                        canDelete: true,
                                    },
                                    options: {
                                        icon: <PeopleIcon/>,
                                        label: "Users"
                                    }
                                },
                                {
                                    name: "products",
                                    list: "/products",
                                    create: "/products/create",
                                    edit: "/products/edit/:id",
                                    show: "/products/show/:id",
                                    meta: {
                                        canDelete: true,
                                    },
                                    options: {
                                        icon: <ProductionQuantityLimitsIcon/>,
                                        label: "Products"
                                    }
                                },

                                {
                                    name: "categories",
                                    list: "/categories",
                                    create: "/categories/create",
                                    edit: "/categories/edit/:id",
                                    show: "/categories/show/:id",
                                    meta: {
                                        canDelete: true,
                                    },
                                },
                            ]}
                            options={{
                                syncWithLocation: true,
                                warnWhenUnsavedChanges: true,
                            }}
                        >
                            {props.children}
                            <UnsavedChangesNotifier/>
                        </Refine>
                    </RefineSnackbarProvider>
                </ColorModeContextProvider>
            </RefineKbarProvider>
        </>
    );
};

function MyApp({
                   Component,
                   pageProps: {session, ...pageProps},
               }: AppPropsWithLayout): JSX.Element {
    const renderComponent = () => {
        if (Component.noLayout) {
            return <Component {...pageProps} />;
        }

        return (
            <ThemedLayoutV2 Sider={Sider} Header={Header}>
                <Component {...pageProps} />
            </ThemedLayoutV2>
        );
    };

    return (
        <SessionProvider session={session}>
            <App>{renderComponent()}</App>
        </SessionProvider>
    );
}

export default MyApp;
