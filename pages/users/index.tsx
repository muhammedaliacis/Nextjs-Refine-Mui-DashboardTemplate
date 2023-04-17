import React from "react";
import {GetServerSideProps} from "next";
import {getServerSession} from "next-auth";
import {authOptions} from "../api/auth/[...nextauth]";
import {DateField, DeleteButton, List, ShowButton, useDataGrid} from "@refinedev/mui";
import {DataGrid, GridColumns} from "@mui/x-data-grid";
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
import {CrudFilters, getDefaultFilter, HttpError} from "@refinedev/core";
import {useForm} from "@refinedev/react-hook-form";
import {Controller} from "react-hook-form";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
export default function UserList() {
    const {dataGridProps, search, filters} = useDataGrid<any>({
        initialPageSize: 10,
        onSearch: (params : any) => {
            const filters: CrudFilters = [];
            const { q, gender, isActive } = params;

            filters.push({
                field: "q",
                operator: "eq",
                value: q !== "" ? q : undefined,
            });

            filters.push({
                field: "isActive",
                operator: "eq",
                value: isActive !== "" ? isActive : undefined,
            });

            return filters;
        },
    });
    const { register, handleSubmit, control } = useForm<
        any,
        HttpError,
        any
    >({
        defaultValues: {
            q: getDefaultFilter("q", filters, "eq"),
            isActive: getDefaultFilter("isActive", filters, "eq") || "",
        },
    });
    const columns = React.useMemo<GridColumns<any>>(
        () => [
            {
                field: "id",
                headerName: "ID",
                type: "number",
                width: 75,
            },
            {
                field: "avatar",
                headerName: "Avatar",
                renderCell: function render({row}) {
                    return (
                        <Avatar src={row?.avatar?.[0]?.url}/>
                    )
                },
                width: 75,
            },
            {field: "firstName", headerName: "First Name", minWidth: 100, flex: 1},
            {field: "lastName", headerName: "Last Name", minWidth: 100, flex: 1},
            {
                field: "gsm",
                headerName: "Phone Number",
                width: 120,
            },
            {
                field: "isActive",
                headerName: "Active",
                align: "center",
                headerAlign: "center",
                renderCell: function render({row}) {
                    return (
                        <Typography>{row?.isActive ? <CheckIcon color="success" /> : <CloseIcon color="error" />}</Typography>
                    )
                },
                width: 120,
            },
            {
                field: "createdAt",
                headerName: "Created Date",
                renderCell: function render({row}) {
                    return (
                        <DateField value={row?.createdAt}/>
                    )
                },
                width: 120,
            },
            {
                field: "actions",
                headerName: "Actions",
                width: 120,
                renderCell: function render({row}) {
                    return (
                        <>
                            <ShowButton
                                size="small"
                                hideText
                                recordItemId={row.id}
                            />
                            <DeleteButton
                                size="small"
                                hideText
                                recordItemId={row.id}
                            />
                        </>
                    );
                },
                align: "center",
                headerAlign: "center",
                flex: 1,
                minWidth: 80,
            }
        ],
        [],
    );

    return (
        <>
            <Grid item container>
                <Grid item container justifyContent="center" xs={12} md={3}>
                    <Stack height={300} sx={{border: '1px solid #bfbfbf', borderRadius: 2}}>
                        <Typography  p={2}>Filters</Typography>
                        <Divider sx={{width: '100%', backgroundColor: '#bfbfbf'}} />
                        <Box
                            p={2}
                            component="form"
                            sx={{ display: "flex", flexDirection: "column" }}
                            autoComplete="off"
                            onSubmit={handleSubmit(search)}
                        >
                            <TextField
                                {...register("q")}
                                label={"Search"}
                                placeholder={"Search"}
                                margin="normal"
                                fullWidth
                                autoFocus
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchOutlinedIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Controller
                                control={control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormControl margin="normal" size="small">
                                        <InputLabel id="isActive-select">
                                            Active
                                        </InputLabel>
                                        <Select
                                            {...field}
                                            labelId="isActive-select"
                                            label={"is Active"}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value="true">
                                               Active
                                            </MenuItem>
                                            <MenuItem value="false">
                                               Not Active
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />

                            <br />
                            <Button type="submit" variant="contained">
                                Search
                            </Button>
                        </Box>
                    </Stack>
                </Grid>
                <Grid item xs={12} md={9} mt={{xs: 2, md: 0}} >
                    <List>
                        <DataGrid {...dataGridProps} columns={columns} autoHeight/>
                    </List>
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
