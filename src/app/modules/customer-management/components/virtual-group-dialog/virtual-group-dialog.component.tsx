/* eslint-disable react/forbid-prop-types */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import CustomerAPI, {
  VirtualNumber,
  VirtualNumberGroup,
} from 'app/api/customer.api';
import {
  convertArrayToSelectItem,
  convertStringToArray,
} from 'app/helpers/array.helper';
import clsx from 'clsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import CloseDialog from 'shared/blocks/close-dialog/close-dialog.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import { STATUS_OPTIONS } from 'shared/const/select-option.const';
import AutocompleteController from 'shared/form/autocomplete/autocomplete-controller.component';
import SelectController, {
  SelectItem,
} from 'shared/form/select/select-controller.component';
import TextFieldController from 'shared/form/text-field/text-field-controller.component';
import * as yup from 'yup';
import {
  DialogState,
  GroupVirtualForm,
  OpenDialogProps,
} from '../../shared/virtual-group-dialog.type';
import './virtual-group-dialog.style.scss';

function useVirtualGroupDialog() {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    title: '',
    isUpdate: true,
    onSubmit: () => {},
    virtualOptions: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const customerList = useRef<SelectItem[]>();
  const schema = useRef(
    yup.object().shape({
      customerId: yup.string(),
      vngName: yup
        .string()
        .max(20, 'Tên nhóm Virtual nhỏ hơn 20 kí tự')
        .required('Vui lòng nhập tên nhóm Virtual'),
      stringVirtual: yup.string(),
      virtual: yup.array(),
    })
  ).current;
  const initialGroupVirtual = useRef<VirtualNumberGroup>();
  const { control, handleSubmit, reset, setValue } = useForm<GroupVirtualForm>({
    defaultValues: {
      customerId: '',
      stringVirtual: '',
      vngName: '',
      virtual: [],
    },
    resolver: yupResolver(schema),
  });

  const openVirtualGroup = ({
    title,
    isUpdate,
    onSubmit,
    initialValues,
  }: OpenDialogProps) => {
    if (initialValues) {
      const { customerId, vngName, activeVirtual, status, customerName } =
        initialValues;
      initialGroupVirtual.current = initialValues;
      const virtualOptions = convertArrayToSelectItem<VirtualNumber>(
        activeVirtual || [],
        'isdn',
        'vnId'
      );
      setValue('customerId', customerId);
      setValue('customerName', customerName);
      setValue('virtual', virtualOptions);
      setValue('vngName', vngName);
      setValue('status', status);
      setDialogState((prev) => ({ ...prev, virtualOptions }));
      schema.fields.virtual = yup
        .array()
        .min(1, 'Vui lòng nhập số Virtual')
        .test({
          name: 'validate virtual',
          exclusive: true,
          message: 'Vui lòng nhập đúng định dạng số Virtual',
          test: (value) => {
            const arrayVirtual = value?.map(
              (item) => (item.label || item) as string
            );

            return validateVirtualNumber(arrayVirtual || []);
          },
        });
    } else {
      schema.fields.stringVirtual = yup
        .string()
        .required('Vui lòng nhập số Virtual')
        .test({
          name: 'validate virtual',
          exclusive: true,
          message: 'Vui lòng nhập đúng định dạng số Virtual',
          test: (value) => {
            const arrayHotline = convertStringToArray(value);

            return validateVirtualNumber(arrayHotline);
          },
        });
      schema.fields.customerId = yup
        .string()
        .required('Vui lòng chọn Khách hàng');
    }
    setDialogState((prev) => ({
      ...prev,
      title,
      isUpdate,
      onSubmit,
      isOpen: true,
    }));
  };

  const closeVirtualGroup = () => {
    reset();
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const validateVirtualNumber = (arrayVirtual: string[]): boolean => {
    const regex = /^((?!(0))[0-9]{1,6})$/;
    let isValid = true;

    if (arrayVirtual) {
      for (let i = 0; i < arrayVirtual.length; i += 1) {
        if (!regex.test(arrayVirtual[i].trim())) {
          isValid = false;
          break;
        }
      }
    }

    return isValid;
  };

  const getListCustomer = useCallback(async () => {
    try {
      setLoading(true);
      const result = await CustomerAPI.getListCustomer();
      if (result) {
        customerList.current = result.customers.map((item) => ({
          label: item.customerName,
          value: item.id,
        }));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!dialogState.isUpdate) getListCustomer();
  }, [getListCustomer, dialogState.isUpdate]);

  const VirtualGroupDialog = useCallback(() => {
    return (
      <>
        <LoadingComponent open={loading} />
        <Dialog
          open={dialogState.isOpen}
          className="virtual-dialog"
          onClose={closeVirtualGroup}
        >
          <CloseDialog onClose={closeVirtualGroup} id="title">
            <Typography className="font--24b" textAlign="center">
              {dialogState.title}
            </Typography>
          </CloseDialog>

          <Grid>
            <form
              className="form-paper"
              onSubmit={handleSubmit(dialogState.onSubmit)}
            >
              {dialogState.isUpdate ? (
                <div>
                  <Grid item xs={12}>
                    <Typography className="mt--XS mb--XXS">
                      Tên Khách hàng
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextFieldController
                      name="customerName"
                      control={control}
                      className="admin-text-field width-100"
                      disabled
                    />
                  </Grid>
                </div>
              ) : (
                <div>
                  <Grid item xs={12}>
                    <Typography className="mt--XS mb--XXS require-field">
                      Tên Khách hàng
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <SelectController
                      name="customerId"
                      options={customerList.current || []}
                      control={control}
                      className="admin-select width-100"
                    />
                  </Grid>
                </div>
              )}

              <div>
                <Grid item xs={12}>
                  <Typography className="mt--XS mb--XXS require-field">
                    Tên nhóm Virtual
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextFieldController
                    name="vngName"
                    control={control}
                    className="admin-text-field width-100"
                    placeholder="Nhập tên nhóm Virtual"
                  />
                </Grid>
              </div>

              {dialogState.isUpdate ? (
                <>
                  <div>
                    <Grid item xs={12}>
                      <Typography className="mt--XS mb--XXS require-field">
                        Số Virtual
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <AutocompleteController
                        multiple
                        freeSolo
                        options={dialogState.virtualOptions}
                        defaultValue={dialogState.virtualOptions}
                        name="virtual"
                        control={control}
                        placeholder="Nhập số Virtual"
                        className="admin-text-field"
                      />
                    </Grid>
                  </div>

                  <div>
                    <Grid item xs={12}>
                      <Typography className="mt--XS mb--XXS require-field">
                        Trạng thái
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <SelectController
                        name="status"
                        options={STATUS_OPTIONS}
                        control={control}
                        className="admin-select width-100"
                      />
                    </Grid>
                  </div>
                </>
              ) : (
                <div>
                  <Grid item xs={12}>
                    <Typography className="mt--XS mb--XXS require-field">
                      Số Virtual
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextFieldController
                      name="stringVirtual"
                      control={control}
                      className="admin-text-field width-100"
                      placeholder="Nhập số Virtual"
                    />
                  </Grid>
                </div>
              )}

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
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogState, loading]);

  return { VirtualGroupDialog, openVirtualGroup, closeVirtualGroup };
}

export default useVirtualGroupDialog;
