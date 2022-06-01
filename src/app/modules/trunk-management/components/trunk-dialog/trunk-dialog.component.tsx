import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import TrunkAPI, { TrunkInfo } from 'app/api/trunk.api';
import clsx from 'clsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import CloseDialog from 'shared/blocks/close-dialog/close-dialog.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import { STATUS_OPTIONS } from 'shared/const/select-option.const';
import SelectController, {
  SelectItem,
} from 'shared/form/select/select-controller.component';
import TextFieldController from 'shared/form/text-field/text-field-controller.component';
import * as yup from 'yup';
import {
  DialogState,
  OpenDialogProps,
  TrunkForm,
} from '../../shared/trunk-dialog.const';
import './trunk-dialog.style.scss';

function useTrunkDialog() {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    title: '',
    isUpdate: false,
    onSubmit: () => {},
  });
  const initialUpdateValues = useRef<TrunkInfo>();
  const [loading, setLoading] = useState<boolean>(false);
  const telecomList = useRef<SelectItem[]>();
  const schema = useRef(
    yup.object().shape({
      trunkName: yup
        .string()
        .max(20, 'Tên Trunk nhỏ hơn 20 kí tự')
        .required('Vui lòng nhập tên Trunk'),
      ip: yup.string().required('Vui lòng nhập địa chỉ IP'),
      port: yup.string().required('Vui lòng nhập Port'),
      telecom: yup.string().required('Vui lòng nhập Nhà mạng'),
    })
  ).current;
  const { control, handleSubmit, reset, setValue } = useForm<TrunkForm>({
    defaultValues: {
      id: '',
      trunkName: '',
      ip: '',
      port: '',
      telecom: '',
      status: 0,
    },
    resolver: yupResolver(schema),
  });

  const openTrunkDialog = ({
    title,
    isUpdate,
    onSubmit,
    initialValues,
  }: OpenDialogProps) => {
    if (initialValues) {
      const { ip, trunkName, groupCode, port, status, id } = initialValues;
      initialUpdateValues.current = { ...initialValues };
      setValue('trunkName', trunkName);
      setValue('ip', ip);
      setValue('port', port);
      setValue('telecom', groupCode);
      setValue('status', status);
      setValue('id', id);
    }
    setDialogState((prev) => ({
      ...prev,
      isOpen: true,
      title,
      isUpdate,
      onSubmit,
    }));
  };

  const closeTrunkDialog = () => {
    reset();
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  const getTelecomList = useCallback(async () => {
    try {
      setLoading(true);
      const result = await TrunkAPI.getTelecom();
      telecomList.current = result?.groups?.map((group) => ({
        label: group.groupName,
        value: group.groupCode,
      }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  const handleCreate = (data: TrunkForm) => {
    dialogState.onSubmit(data);
  };

  const handleUpdate = (data: TrunkForm) => {
    const { ip, port, telecom, trunkName, status } = data;
    if (
      initialUpdateValues.current?.groupCode !== telecom ||
      initialUpdateValues.current?.trunkName !== trunkName ||
      initialUpdateValues.current?.ip !== ip ||
      initialUpdateValues.current?.port !== port
    ) {
      dialogState.onSubmit(data);
      return;
    }

    if (initialUpdateValues.current?.status !== status) {
      dialogState.onSubmit(data, true);
      return;
    }

    closeTrunkDialog();
  };

  useEffect(() => {
    getTelecomList();
  }, [getTelecomList]);

  const TrunkDialog = useCallback(() => {
    return (
      <>
        <LoadingComponent open={loading} />

        <Dialog
          open={dialogState.isOpen}
          className="trunk-dialog"
          onClose={closeTrunkDialog}
        >
          <CloseDialog onClose={closeTrunkDialog} id="title">
            <Typography className="font--24b" textAlign="center">
              {dialogState.title}
            </Typography>
          </CloseDialog>

          <Grid>
            <form
              className="form-paper"
              onSubmit={handleSubmit(
                dialogState.isUpdate ? handleUpdate : handleCreate
              )}
            >
              <div>
                <Grid item xs={12}>
                  <Typography className="mt--XS mb--XS require-field">
                    Tên Trunk
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextFieldController
                    name="trunkName"
                    control={control}
                    className="admin-text-field width-100"
                    placeholder="Nhập tên Trunk"
                  />
                </Grid>
              </div>

              <div>
                <Grid item xs={12}>
                  <Typography className="mt--XS mb--XS require-field">
                    Nhà mạng
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <SelectController
                    name="telecom"
                    control={control}
                    disabled={dialogState.isUpdate}
                    className="admin-select width-100"
                    options={telecomList.current || []}
                  />
                </Grid>
              </div>

              <div>
                <Grid item xs={12}>
                  <Typography className="mt--XS mb--XS require-field">
                    Địa chỉ IP
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextFieldController
                    name="ip"
                    control={control}
                    className="admin-text-field width-100"
                    placeholder="Nhập địa chỉ IP"
                  />
                </Grid>
              </div>

              <div>
                <Grid item xs={12}>
                  <Typography className="mt--XS mb--XS require-field">
                    Port
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextFieldController
                    name="port"
                    control={control}
                    className="admin-text-field width-100"
                    placeholder="Nhập Port"
                  />
                </Grid>
              </div>

              {dialogState.isUpdate && (
                <div>
                  <Grid item xs={12}>
                    <Typography className="mt--XS mb--XS require-field">
                      Trạng thái
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <SelectController
                      name="status"
                      control={control}
                      className="admin-select width-100"
                      options={STATUS_OPTIONS}
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
                {dialogState.isUpdate ? 'Cập nhật' : 'Tạo Trunk'}
              </Button>
            </form>
          </Grid>
        </Dialog>
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogState]);

  return { TrunkDialog, openTrunkDialog, closeTrunkDialog };
}

export default useTrunkDialog;
