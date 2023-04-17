import React from "react";
import {GetServerSideProps} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "../../api/auth/[...nextauth]";
import {useShow} from "@refinedev/core";
import {DateField, Show} from "@refinedev/mui";
import {Avatar, Box, Stack, Typography} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
export default function UserShow() {
    const {queryResult, showId} = useShow();
    const {isLoading} = queryResult;
    const data = queryResult?.data?.data
    console.log(data)
    return (
        <Show isLoading={isLoading}>
            <Box display="flex">
                    <Avatar src={data?.avatar?.[0]?.url} sx={{width: 200, height: 200}}  />
            <Stack spacing={3} width="100%" pl={2}>
                <Box display="flex" justifyContent="space-between">
                    <Box>
                        <Typography>Id</Typography>
                        <Typography fontWeight={700}>{data?.id}</Typography>
                    </Box>
                    <Box>
                        <Typography>Create Date</Typography>
                        <DateField value={data?.createdAt}/>
                    </Box>
                </Box>
                <Box>
                    <Typography>Full Name</Typography>
                    <Typography fontWeight={700}>{data?.firstName + " " + data?.lastName} </Typography>
                </Box>
                <Box>
                    <Typography>Number</Typography>
                    <Typography fontWeight={700}>{data?.gsm}</Typography>
                </Box>
                <Box>
                    <Typography>Addresses</Typography>
                    {data?.addresses?.map((address: any) => <Typography fontWeight={700}>- {address?.text}</Typography>) }
                </Box>
                <Box>
                    <Typography>Active</Typography>
                    <Typography>{data?.isActive ? <CheckIcon color="success" /> : <CloseIcon color="error" />}</Typography>
                </Box>

            </Stack>
            </Box>
        </Show>
    );
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session) {
        return {
            props: {},
            redirect: {
                destination: `/login?to=${encodeURIComponent("/users")}`,
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};
