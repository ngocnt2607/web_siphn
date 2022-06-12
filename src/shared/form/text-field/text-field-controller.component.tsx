/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search } from '@mui/icons-material';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { BaseTextFieldProps, InputAdornment, TextField } from '@mui/material';
import React from 'react';
import { Control, Controller } from 'react-hook-form';

interface TextFieldController extends BaseTextFieldProps {
  name: string;
  control: Control<any>;
  isSearchField?: boolean;
}

function TextFieldController(props: TextFieldController) {
  const { control, name, isSearchField, ...rest } = props;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...rest}
          id={name}
          error={!!fieldState.error}
          InputProps={{
            endAdornment: !!fieldState.error && (
              <InputAdornment position="end">
                <ErrorOutlineOutlinedIcon color="error" />
              </InputAdornment>
            ),
            startAdornment: isSearchField && (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          helperText={fieldState.error ? fieldState.error.message : ''}
        />
      )}
    />
  );
}

TextFieldController.defaultProps = {
  isSearchField: false,
};

export default React.memo(TextFieldController);
