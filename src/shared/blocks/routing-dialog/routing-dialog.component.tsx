import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, SelectChangeEvent, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import CustomerAPI from 'app/api/customer.api';
import { HotlineRouting } from 'app/api/hotline-routing.api';
import TrunkAPI from 'app/api/trunk.api';
import clsx from 'clsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import CloseDialog from 'shared/blocks/close-dialog/close-dialog.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import { STATUS_OPTIONS } from 'shared/const/select-option.const';
import SelectController, {
  SelectItem,
} from 'shared/form/select/select-controller.component';
import * as yup from 'yup';
import './routing-dialog.style.scss';
import {
  DialogState,
  OpenDialogProps,
  RoutingForm,
} from './routing-dialog.type';

function useHotlineRoutingDialog() {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    title: '',
    isUpdate: false,
    onSubmit: () => {},
    customerGroupOptions: [],
    listCustomerGroup: [],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const trunkList = useRef<SelectItem[]>([]);
  const customerList = useRef<SelectItem[]>([]);
  const schema = useRef(
    yup.object().shape({
      customerId: yup.string().required('Vui lòng chọn Khách hàng'),
      hotlineGroupId: yup.string().required('Vui lòng chọn nhóm Hotline'),
      trunkId: yup.string().required('Vui lòng chọn Trunk'),
    })
  ).current;
  const { control, handleSubmit, reset, setValue, resetField } =
    useForm<RoutingForm>({
      defaultValues: {
        customerId: '',
        hotlineGroupId: '',
        status: 0,
        trunkId: '',
      },
      resolver: yupResolver(schema),
    });

  const openHotlineRouting = ({
    title,
    isUpdate,
    onSubmit,
    initialValues,
    listCustomerGroup,
  }: OpenDialogProps) => {
    if (initialValues) {
      const { customerId, hotlineGroupId, groupStatus, trunkId } =
        initialValues;

      setValue('customerId', customerId);
      setValue('hotlineGroupId', String(hotlineGroupId));
      setValue('status', groupStatus);
      setValue('trunkId', trunkId);
      setListGroupHotline(String(customerId), listCustomerGroup);
    }

    setDialogState((prev) => ({
      ...prev,
      title,
      isUpdate,
      onSubmit,
      listCustomerGroup,
      isOpen: true,
    }));
  };

  const onChangeCustomer = (event: SelectChangeEvent<unknown>) => {
    resetField('hotlineGroupId');
    setListGroupHotline(
      String(event.target.value),
      dialogState.listCustomerGroup
    );
  };

  const setListGroupHotline = (
    customerId: string,
    listCustomerGroup?: HotlineRouting[]
  ) => {
    if (!listCustomerGroup) return;

    const groupHotline = listCustomerGroup.reduce(
      (prev: SelectItem[], current) => {
        if (String(current.customerId) === customerId)
          prev.push({
            label: current.hotlineGroupName,
            value: current.hotlineGroupId,
          });
        return prev;
      },
      []
    );

    if (groupHotline) {
      setDialogState((prev) => ({
        ...prev,
        customerGroupOptions: groupHotline,
      }));
    }
  };

  const closeHotlineRouting = () => {
    reset();
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const getListData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await Promise.all([
        TrunkAPI.getListTrunk(),
        CustomerAPI.getListCustomer(),
      ]);

      if (result) {
        trunkList.current =
          result[0]?.groupIps.map((item) => ({
            label: item.trunkName,
            value: item.id,
          })) || [];
        customerList.current =
          result[1]?.customers.map((item) => ({
            label: item.customerName,
            value: item.id,
          })) || [];
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListData();
  }, [getListData]);

  const HotlineRoutingDialog = useCallback(() => {
    return (
      <>
        <LoadingComponent open={loading} />
        <Dialog
          open={dialogState.isOpen}
          className="hotline-dialog"
          onClose={closeHotlineRouting}
        >
          <CloseDialog onClose={closeHotlineRouting} id="title">
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
                    Tên Khách hàng
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <SelectController
                    name="customerId"
                    control={control}
                    options={customerList.current}
                    handleChange={onChangeCustomer}
                    className="admin-select width-100"
                    disabled={dialogState.isUpdate}
                  />
                </Grid>
              </div>

              <div>
                <Grid item xs={12}>
                  <Typography className="mt--XS mb--XXS require-field">
                    Tên nhóm Hotline
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <SelectController
                    name="hotlineGroupId"
                    control={control}
                    options={dialogState.customerGroupOptions}
                    className="admin-select width-100"
                    disabled={dialogState.isUpdate}
                  />
                </Grid>
              </div>

              <div>
                <Grid item xs={12}>
                  <Typography className="mt--XS mb--XXS require-field">
                    Tên Trunk
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <SelectController
                    name="trunkId"
                    control={control}
                    options={trunkList.current}
                    className="admin-select width-100"
                  />
                </Grid>
              </div>

              {dialogState.isUpdate && (
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

  return {
    HotlineRoutingDialog,
    openHotlineRouting,
    closeHotlineRouting,
  };
}

export default useHotlineRoutingDialog;
