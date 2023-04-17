import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { Edit, useAutocomplete } from "@refinedev/mui";
import {
    Box,
    TextField,
    Autocomplete,
    Grid,
    FormControl,
    FormLabel,
    Stack,
    Input,
    Avatar,
    Checkbox
} from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { Controller } from "react-hook-form";
import React from "react";
import axios from "axios";

export default function ProductEdit() {
    const {
        saveButtonProps,
        refineCore: { queryResult },
        register,
        control,
        formState: { errors },
        watch, setValue
    } = useForm();

    const productsData = queryResult?.data?.data;

    const { autocompleteProps: categoryAutocompleteProps } = useAutocomplete({
        resource: "categories",
        defaultValue: productsData?.category?.id,
    });
    const imageInput = watch("images");



    const onChangeHandler = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const formData = new FormData();

        const target = event.target;
        const file: File = (target.files as FileList)[0];

        formData.append("file", file);

        const res = await axios.post(
            `https://api.finefoods.refine.dev/media/upload`,
            formData,
            {
                withCredentials: false,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            },
        );

        const { name, size, type, lastModified } = file;

        // eslint-disable-next-line
        const imagePaylod: any = [
            {
                name,
                size,
                type,
                lastModified,
                url: res.data.url,
            },
        ];

        setValue("images", imagePaylod, { shouldValidate: true });
    };
    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column" }}
                autoComplete="off"
            >
                <Grid item container spacing={2}>
                    <Grid item container xs={12}>

                        <FormControl>
                            <FormLabel required>
                                Images
                            </FormLabel>
                            <Stack
                                display="flex"
                                alignItems="center"
                                border="1px dashed  "
                                borderColor="primary.main"
                                borderRadius="5px"
                                padding="50px"
                                marginTop="5px"
                            >
                                <label htmlFor="images-input">
                                    <Input
                                        id="images-input"
                                        type="file"
                                        sx={{
                                            display: "none",
                                        }}
                                        onChange={onChangeHandler}
                                    />
                                    <input
                                        id="file"
                                        {...register("images")}
                                        type="hidden"
                                    />
                                    <Avatar
                                        sx={{
                                            cursor: "pointer",
                                            width: {
                                                xs: 100,
                                                md: 140,
                                            },
                                            height: {
                                                xs: 100,
                                                md: 140,
                                            },
                                        }}
                                        src={
                                            imageInput && imageInput[0].url
                                        }
                                        alt="Store Location"
                                    />
                                </label>

                            </Stack>

                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            {...register("name", {
                                required: "This field is required",
                            })}
                            error={!!(errors as any)?.name}
                            helperText={(errors as any)?.name?.message}
                            margin="normal"
                            fullWidth
                            InputLabelProps={{shrink: true}}
                            type="text"
                            label="Name"
                            name="name"
                        />

                        <TextField
                            {...register("description", {
                                required: "This field is required",
                            })}
                            error={!!(errors as any)?.description}
                            helperText={(errors as any)?.description?.message}
                            margin="normal"
                            fullWidth
                            InputLabelProps={{shrink: true}}
                            multiline
                            label="Description"
                            name="description"
                        />
                        <TextField
                            {...register("price", {
                                required: "This field is required",
                                valueAsNumber: true,
                            })}
                            error={!!(errors as any)?.price}
                            helperText={(errors as any)?.price?.message}
                            margin="normal"
                            fullWidth
                            InputLabelProps={{shrink: true}}
                            type="number"
                            label="Price"
                            name="price"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>

                        <Controller
                            control={control}
                            name="category"
                            rules={{required: "This field is required"}}
                            // eslint-disable-next-line
                            defaultValue={null as any}
                            render={({field}) => (
                                <Autocomplete
                                    {...categoryAutocompleteProps}
                                    {...field}
                                    onChange={(_, value) => {
                                        field.onChange(value);
                                    }}
                                    getOptionLabel={(item) => {
                                        return (
                                            categoryAutocompleteProps?.options?.find(
                                                (p) =>
                                                    p?.id?.toString() ===
                                                    item?.id?.toString(),
                                            )?.title ?? ""
                                        );
                                    }}
                                    isOptionEqualToValue={(option, value) =>
                                        value === undefined ||
                                        option?.id?.toString() === value?.id?.toString()
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Category"
                                            margin="normal"
                                            variant="outlined"
                                            error={!!(errors as any)?.category?.id}
                                            helperText={
                                                (errors as any)?.category?.id?.message
                                            }
                                            required
                                        />
                                    )}
                                />
                            )}
                        />
                        <Controller
                            name="isActive"
                            control={control}
                            defaultValue={false}
                            render={({ field }) => (
                                <label>
                                    <Checkbox
                                        {...field}
                                    />
                                    Active
                                </label>
                            )}
                        />
                    </Grid>

                </Grid>

            </Box>
        </Edit>
    );
};


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
