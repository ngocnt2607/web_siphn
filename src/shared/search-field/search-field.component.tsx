import { Button, Stack } from '@mui/material';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import TextFieldController from 'shared/form/text-field/text-field-controller.component';
import './search-field.style.scss';

interface SearchFieldProps {
  placeholder: string;
  handleSearch: (search: string) => void;
}

interface FormType {
  searchField: string;
}

function SearchField({ placeholder, handleSearch }: SearchFieldProps) {
  const { control, handleSubmit } = useForm<FormType>({
    defaultValues: {
      searchField: '',
    },
  });

  const onSubmit = (data: FormType) => {
    handleSearch(data.searchField);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" alignItems="center" className="search-bar">
        <TextFieldController
          control={control}
          name="searchField"
          className="admin-text-field search-field"
          placeholder={placeholder}
          isSearchField
        />

        <Button
          variant="contained"
          type="submit"
          color="primary"
          className="p-button-search"
        >
          Tìm kiếm
        </Button>
      </Stack>
    </form>
  );
}

export default React.memo(SearchField);
