import React from "react";
import {GetServerSideProps} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "../api/auth/[...nextauth]";
import {
    Avatar,
    Box,
    Button, Divider,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel, MenuItem,
    Select,
    Stack,
    TextField, Typography
} from "@mui/material";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PaymentsIcon from '@mui/icons-material/Payments';
import ReportIcon from '@mui/icons-material/Report';
import BadgeIcon from '@mui/icons-material/Badge';

export default function DashboardPage() {

    return (
        <>
            <Typography variant="h4">Welcome to Dashboard Page</Typography>
            <Grid item container my={1}>
                <Grid item container justifyContent="center" xs={12} sm={6} md={3}>
                    <Box width="90%" height={200} sx={{p:2, background: 'linear-gradient(86deg, rgba(92,90,190,1) 8%, rgba(174,117,243,1) 78%)', borderRadius: 2}}>
                        <PeopleAltIcon sx={{color: '#fff', fontSize:30}} />
                        <Typography fontSize={20}>User</Typography>
                        <Typography fontSize={27} fontWeight={700}>500</Typography>
                    </Box>
                </Grid>
                <Grid item container justifyContent="center" xs={12} sm={6} md={3}>
                    <Box width="90%" height={200} sx={{p:2, background: 'linear-gradient(86deg, rgba(251,103,9,1) 8%, rgba(247,128,53,1) 78%)', borderRadius: 2}}>
                        <PaymentsIcon sx={{color: '#fff', fontSize:30}} />
                        <Typography fontSize={20}>Total Earnings</Typography>
                        <Typography fontSize={27} fontWeight={700}>$9,999</Typography>
                    </Box>
                </Grid>
                <Grid item container justifyContent="center" xs={12} sm={6} md={3}>
                    <Box width="90%" height={200} sx={{p:2, background: 'linear-gradient(86deg, rgba(27,104,124,1) 8%, rgba(56,169,199,1) 78%)', borderRadius: 2}}>
                        <BadgeIcon sx={{color: '#fff', fontSize:30}} />
                        <Typography fontSize={20}>Employees</Typography>
                        <Typography fontSize={27} fontWeight={700}>25</Typography>
                    </Box>
                </Grid>
                <Grid item container justifyContent="center" xs={12} sm={6} md={3}>
                    <Box width="90%" height={200} sx={{p:2, background: 'linear-gradient(86deg, rgba(228,91,97,1) 8%, rgba(238,128,132,1) 78%)', borderRadius: 2}}>
                        <ReportIcon sx={{color: '#fff', fontSize:30}} />
                        <Typography fontSize={20}>Feedback</Typography>
                        <Typography fontSize={27} fontWeight={700}>34</Typography>
                    </Box>
                </Grid>

            </Grid>
        </>
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
