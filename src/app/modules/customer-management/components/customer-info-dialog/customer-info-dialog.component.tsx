import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import clsx from 'clsx';
import React, { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import CloseDialog from 'shared/blocks/close-dialog/close-dialog.component';
import TextFieldController from 'shared/form/text-field/text-field-controller.component';
import * as yup from 'yup';
import {
  CustomerInfoForm,
  DialogState,
  OpenDialogProps,
} from '../../shared/customer-info-dialog.type';
import './customer-info-dialog.style.scss';

function useCustomerInfoDialog() {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    title: '',
    isUpdate: false,
    onSubmit: () => {},
  });
  const schema = useRef(
    yup.object().shape({
      customerName: yup
        .string()
        .max(20, 'Tên Khách hàng nhỏ hơn 20 kí tự')
        .required('Vui lòng nhập Tên khách hàng'),
      description: yup.string().required('Vui lòng nhập Mô tả'),
    })
  ).current;
  const { control, handleSubmit, reset, setValue } = useForm<CustomerInfoForm>({
    defaultValues: {
      customerName: '',
      description: '',
      id: 0,
    },
    resolver: yupResolver(schema),
  });

  const openCustomerInfo = ({
    title,
    onSubmit,
    isUpdate,
    initialValues,
  }: OpenDialogProps) => {
    if (initialValues) {
      const { customerName, description, id } = initialValues;
      setValue('customerName', customerName);
      setValue('description', description);
      setValue('id', id || 0);
    }
    setDialogState((prev) => ({
      ...prev,
      title,
      onSubmit,
      isUpdate,
      isOpen: true,
    }));
  };

  const closeCustomerInfo = () => {
    reset();
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const CustomerInfoDialog = useCallback(() => {
    return (
      <Dialog
        open={dialogState.isOpen}
        className="customer-dialog"
        onClose={closeCustomerInfo}
      >
        <CloseDialog onClose={closeCustomerInfo} id="title">
          <Typography className="font--24b" textAlign="center">
            {dialogState.title}
          </Typography>
        </CloseDialog>

        <Grid>
          <form
            className="form-paper"
            onSubmit={handleSubmit(dialogState.onSubmit)}
          >
            <div>
              <Grid item xs={12}>
                <Typography className="mt--XS mb--XXS require-field">
                  Tên khách hàng
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextFieldController
                  name="customerName"
                  control={control}
                  className="admin-text-field width-100"
                  placeholder="Nhập tên Khách hàng"
                />
              </Grid>
            </div>

            <div>
              <Grid item xs={12}>
                <Typography className="mt--XS mb--XXS require-field">
                  Mô tả
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextFieldController
                  name="description"
                  control={control}
                  className="admin-text-field width-100"
                  placeholder="Nhập Mô tả"
                />
              </Grid>
            </div>

            <Button
              variant="contained"
              type="submit"
              className={clsx('action-button --no-transform width-100', {
                '--update': dialogState.isUpdate,
              })}
            >
              {dialogState.isUpdate ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </form>
        </Grid>
      </Dialog>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogState]);

  return { CustomerInfoDialog, openCustomerInfo, closeCustomerInfo };
}

export default useCustomerInfoDialog;
