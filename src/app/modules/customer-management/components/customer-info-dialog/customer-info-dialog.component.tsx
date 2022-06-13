/* eslint-disable react/forbid-prop-types */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { WhitelistIP } from 'app/api/customer.api';
import { convertArrayToSelectItem } from 'app/helpers/array.helper';
import clsx from 'clsx';
import React, { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import CloseDialog from 'shared/blocks/close-dialog/close-dialog.component';
import AutocompleteControllerComponent from 'shared/form/autocomplete/autocomplete-controller.component';
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
    ipOptions: [],
  });
  const schema = useRef(
    yup.object().shape({
      customerName: yup
        .string()
        .max(20, 'Tên Khách hàng nhỏ hơn 20 kí tự')
        .required('Vui lòng nhập Tên khách hàng'),
      description: yup.string().required('Vui lòng nhập Mô tả'),
      ips: yup.array(),
      stringIP: yup.string(),
    })
  ).current;
  const { control, handleSubmit, reset, setValue, watch } =
    useForm<CustomerInfoForm>({
      defaultValues: {
        customerName: '',
        description: '',
        id: '',
        ips: [],
        stringIP: '',
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
      const { customerName, description, id, wlIps } = initialValues;
      const ipOptions = convertArrayToSelectItem<WhitelistIP>(
        wlIps || [],
        'ip',
        'wlIpId'
      );
      setValue('customerName', customerName);
      setValue('description', description);
      setValue('id', id);
      setValue('ips', ipOptions);
      schema.fields.ips = yup.array().min(1, 'Vui lòng nhập địa chỉ IP');
      setDialogState((prev) => ({ ...prev, ipOptions }));
    } else {
      schema.fields.stringIP = yup
        .string()
        .required('Vui lòng nhập địa chỉ IP');
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

            <Grid item xs={12}>
              <Typography className="mt--XS mb--XXS require-field">
                Địa chỉ IP
              </Typography>
            </Grid>

            <Grid item xs={12}>
              {dialogState.isUpdate ? (
                <AutocompleteControllerComponent
                  multiple
                  freeSolo
                  control={control}
                  name="ips"
                  options={dialogState.ipOptions}
                  defaultValue={dialogState.ipOptions}
                  className="admin-text-field"
                  setValue={setValue}
                  value={watch('ips')}
                  placeholder="Nhập địa chỉ IP"
                />
              ) : (
                <TextFieldController
                  control={control}
                  name="stringIP"
                  className="admin-text-field width-100"
                  placeholder="Nhập địa chỉ IP"
                />
              )}
            </Grid>

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
