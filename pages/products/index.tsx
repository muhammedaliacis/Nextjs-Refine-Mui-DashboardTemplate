import {GetServerSideProps} from "next";
import SearchIcon from "@mui/icons-material/Search";

import {getServerSession} from "next-auth";
import {authOptions} from "../api/auth/[...nextauth]";
import {getDefaultFilter, useTable} from "@refinedev/core";
import {CreateButton, DeleteButton, EditButton, List} from "@refinedev/mui";
import {Box, Chip, Grid, IconButton, InputBase, Pagination, Paper, Stack, Typography} from "@mui/material";
import React from "react";

export default function ProductsList() {
    const {tableQueryResult: productsData, setCurrent, filters, setFilters, pageCount} = useTable<any>({
        resource: 'products',
        initialPageSize: 12
    });

    // @ts-ignore
    const {data: products} = productsData?.data ?? {}
    console.log(products)
    return (
        <Box>
            <Stack
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                padding={1}
                direction="row"
                gap={2}
                mb={5}
            >
                <Typography variant="h5">
                    Products
                </Typography>
                <Paper
                    component="form"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        width: 400,
                    }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search"
                        inputProps={{
                            "aria-label": "product search",
                        }}
                        value={getDefaultFilter(
                            "name",
                            filters,
                            "contains",
                        )}
                        onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                            setFilters([
                                {
                                    field: "name",
                                    operator: "contains",
                                    value:
                                        e.target.value !== ""
                                            ? e.target.value
                                            : undefined,
                                },
                            ]);
                        }}
                    />
                    <IconButton
                        type="submit"
                        sx={{ p: "10px" }}
                        aria-label="search"
                    >
                        <SearchIcon />
                    </IconButton>
                </Paper>
                <CreateButton
                    />
            </Stack>            <Grid item container spacing={2}>
                {
                    products?.map((product: any) =>
                        <Grid item container justifyContent="center" xs={12} sm={6} md={4} lg={3} xl={2}>
                            <Stack spacing={1} alignItems="center" justifyContent="center" key={product?.id}
                                   sx={{border: '1px solid #bfbfbf', borderRadius: 2, p: 2, position: 'relative'}}>
                                <Chip label={product?.isActive ? "Active" : "Not Active"} color={product?.isActive ? "success" : "error"} sx={{position: 'absolute', top: 5, left: 5, fontWeight: 600, color: '#fff'}} />
                                <Box component="img" src={product?.images?.[0]?.url} width={"100%"}
                                     height={200}/>
                                <Typography align="center">{product?.name}</Typography>
                                <Typography align="center"
                                            color="#bfbfbf">{product?.description?.length > 40 ? product?.description?.substring(0, 40) + "..." : product?.description}</Typography>
                                <Typography>{product?.price}$</Typography>
                                <Stack direction="row" spacing={1}>
                                <EditButton size="small" sx={{border: '1px solid #B7B7B7', px: 1}} color="success"
                                            recordItemId={product?.id}/>
                                    <DeleteButton size="small" sx={{border: '1px solid #B7B7B7', px: 1}}
                                                recordItemId={product?.id}/>
                                </Stack>
                            </Stack>
                        </Grid>
                    )
                }

            </Grid>
            <Pagination
                count={pageCount}
                variant="outlined"
                color="primary"
                shape="rounded"
                sx={{
                    display: "flex",
                    justifyContent: "end",
                    paddingY: "20px",
                }}
                onChange={(
                    event: React.ChangeEvent<unknown>,
                    page: number,
                ) => {
                    event.preventDefault();
                    setCurrent(page);
                }}
            />
        </Box>
    );
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session) {
        return {
            props: {},
            redirect: {
                destination: `/login?to=${encodeURIComponent("/products")}`,
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};
