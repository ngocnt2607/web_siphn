/* eslint-disable react/forbid-prop-types */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import CustomerAPI, { Hotline } from 'app/api/customer.api';
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
  GroupHotlineForm,
  OpenDialogProps,
} from '../../shared/hotline-group-dialog.type';
import './hotline-group-dialog.style.scss';

function useHotlineGroupDialog() {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    title: '',
    isUpdate: true,
    onSubmit: () => {},
    hotlineOptions: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const customerList = useRef<SelectItem[]>();
  const schema = useRef(
    yup.object().shape({
      customerId: yup.string(),
      hotline: yup.array(),
      groupHotlineName: yup
        .string()
        .max(20, 'Tên nhóm Hotline nhỏ hơn 20 kí tự')
        .required('Vui lòng nhập tên nhóm Hotline'),
      stringHotline: yup.string(),
    })
  ).current;
  const { control, handleSubmit, reset, setValue } = useForm<GroupHotlineForm>({
    defaultValues: {
      customerId: '',
      stringHotline: '',
      groupHotlineName: '',
      hotline: [],
    },
    resolver: yupResolver(schema),
  });

  const openHotlineGroup = ({
    title,
    isUpdate,
    onSubmit,
    initialValues,
  }: OpenDialogProps) => {
    if (initialValues) {
      const {
        customerId,
        hotlineGroupName,
        groupStatus,
        customerName,
        activeHotlines,
      } = initialValues;
      const hotlineOptions = convertArrayToSelectItem<Hotline>(
        activeHotlines || [],
        'isdn',
        'hotlineId'
      );
      setValue('customerId', customerId);
      setValue('hotline', hotlineOptions);
      setValue('customerName', customerName);
      setValue('groupHotlineName', hotlineGroupName);
      setValue('status', groupStatus);
      setDialogState((prev) => ({ ...prev, hotlineOptions }));
      schema.fields.hotline = yup
        .array()
        .min(1, 'Vui lòng nhập số Hotline')
        .test({
          name: 'validate hotline',
          exclusive: true,
          message: 'Vui lòng nhập đúng định dạng số Hotline',
          test: (value) => {
            const arrayHotline = value?.map(
              (item) => (item.label || item) as string
            );

            return validatePhoneNumber(arrayHotline || []);
          },
        });
    } else {
      schema.fields.stringHotline = yup
        .string()
        .required('Vui lòng nhập số Hotline')
        .test({
          name: 'validate hotline',
          exclusive: true,
          message: 'Vui lòng nhập đúng định dạng số Hotline',
          test: (value) => {
            const arrayHotline = convertStringToArray(value);

            return validatePhoneNumber(arrayHotline);
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

  const validatePhoneNumber = (arrayHotline: string[]): boolean => {
    const regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    let isValid = true;

    if (arrayHotline) {
      for (let i = 0; i < arrayHotline.length; i += 1) {
        if (!regex.test(arrayHotline[i].trim())) {
          isValid = false;
          break;
        }
      }
    }

    return isValid;
  };

  const closeHotlineGroup = () => {
    reset();
    setDialogState((prev) => ({ ...prev, isOpen: false }));
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

  const HotlineGroupDialog = useCallback(() => {
    return (
      <>
        <LoadingComponent open={loading} />
        <Dialog
          open={dialogState.isOpen}
          className="hotline-dialog"
          onClose={closeHotlineGroup}
        >
          <CloseDialog onClose={closeHotlineGroup} id="title">
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
                    <Typography className="mt--XS mb--XXS required-field">
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
                    Tên nhóm Hotline
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextFieldController
                    name="groupHotlineName"
                    control={control}
                    className="admin-text-field width-100"
                    placeholder="Nhập tên nhóm Hotline"
                  />
                </Grid>
              </div>

              {dialogState.isUpdate ? (
                <>
                  <div>
                    <Grid item xs={12}>
                      <Typography className="mt--XS mb--XXS require-field">
                        Số Hotline
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <AutocompleteController
                        multiple
                        freeSolo
                        options={dialogState.hotlineOptions}
                        defaultValue={dialogState.hotlineOptions}
                        name="hotline"
                        control={control}
                        placeholder="Nhập số Hotline"
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
                      Số Hotline
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextFieldController
                      name="stringHotline"
                      control={control}
                      className="admin-text-field width-100"
                      placeholder="Nhập số Hotline"
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

  return { HotlineGroupDialog, openHotlineGroup, closeHotlineGroup };
}

export default useHotlineGroupDialog;
