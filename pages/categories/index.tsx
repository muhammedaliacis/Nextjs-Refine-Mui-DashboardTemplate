import React from "react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import {DeleteButton, EditButton, List, ShowButton, useDataGrid} from "@refinedev/mui";
import {DataGrid, GridColumns} from "@mui/x-data-grid";
import {Avatar} from "@mui/material";

export default function CategoryList() {
    const { dataGridProps } = useDataGrid<any>();

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
                renderCell: function render({ row }) {
                    return (
                        <Avatar src={row?.cover} sx={{width: 100, height: 80}} />
                    )
                },
                width: 150,
            },
            { field: "title", headerName: "Title", minWidth: 400, flex: 2 },
            {
                field: "actions",
                headerName: "Actions",
                renderCell: function render({ row }) {
                    return (
                        <>
                            <ShowButton
                                size="small"
                                hideText
                                recordItemId={row.id}
                            />
                            <EditButton
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
        <List>
            <DataGrid rowHeight={100} {...dataGridProps} columns={columns} autoHeight />
        </List>
    );
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      props: {},
      redirect: {
        destination: `/login?to=${encodeURIComponent("/categories")}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
