import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Container, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import TrunkAPI, { TrunkInfo } from 'app/api/trunk.api';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import addToast from 'shared/blocks/toastify/add-toast.component';
import { PageName } from 'shared/const/drawer.const';
import { Message } from 'shared/const/message.const';
import { STATUS_OPTIONS } from 'shared/const/select-option.const';
import useTrunkDialog from '../components/trunk-dialog/trunk-dialog.component';
import { TrunkForm, TrunkTableInfo } from '../shared/trunk-dialog.const';

function TrunkManagement() {
  const { openTrunkDialog, TrunkDialog, closeTrunkDialog } = useTrunkDialog();
  const [loading, setLoading] = useState<boolean>(false);
  const trunkDetail = useRef<TrunkTableInfo[]>();
  const navigate = useNavigate();
  const { groupCode, trunkId } = useParams();

  const COLUMN_CONFIG = useRef<GridColDef[]>([
    { field: 'no', headerName: 'STT', flex: 0.13, sortable: false },
    { field: 'trunkName', headerName: 'Tên Trunk', flex: 1, sortable: false },
    { field: 'groupName', headerName: 'Nhà mạng', flex: 1, sortable: false },
    {
      field: 'ipPort',
      headerName: 'IP:PORT',
      flex: 1,
      sortable: false,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.ip || ''}:${params.row.port}`,
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      flex: 0.3,
      valueGetter: (params: GridValueGetterParams) =>
        STATUS_OPTIONS.find((item) => item.value === params.row.status)?.label,
    },
    {
      field: 'action',
      headerName: 'Chức năng',
      flex: 0.25,
      sortable: false,
      renderCell: (cellValues) => {
        return (
          <CellAction
            viewAble={false}
            deleteAble={false}
            handleEdit={() => handleEdit(cellValues.row)}
          />
        );
      },
    },
  ]).current;

  const onUpdate = async (data: TrunkForm, isOnlyChangeStatus?: boolean) => {
    try {
      const { id, telecom, ip, port, trunkName, status } = data;
      setLoading(true);
      await TrunkAPI.updateTrunk(
        isOnlyChangeStatus
          ? {
              groupCode: telecom,
              status: status ?? 0,
              trunkId: id || '',
            }
          : {
              groupCode: telecom,
              ip,
              port,
              status: status ?? 0,
              trunkId: id || '',
              trunkName,
            }
      );

      await getListTrunk();
      addToast({ message: Message.UPDATE_SUCCESS, type: 'success' });
      closeTrunkDialog();
    } catch (error) {
      setLoading(false);
    }
  };

  const handleEdit = (initialValues: TrunkInfo) => {
    openTrunkDialog({
      initialValues,
      onSubmit: onUpdate,
      title: 'Cập nhật Trunk',
      isUpdate: true,
    });
  };

  const getListTrunk = useCallback(async () => {
    try {
      setLoading(true);
      const result = await TrunkAPI.getDetailTrunk(groupCode || '');
      if (result) {
        trunkDetail.current = result.groupIps.reduce(
          (prev: TrunkTableInfo[], current, index) => {
            if (current.id === trunkId)
              prev.push({
                ...current,
                no: index + 1,
              });
            return prev;
          },
          []
        );
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getListTrunk();
  }, [getListTrunk]);

  return (
    <>
      <Helmet>
        <title>{PageName.TRUNK_DETAIL}</title>
      </Helmet>

      <LoadingComponent open={loading} />

      <Container maxWidth="xl" className="detail-page">
        <Stack
          direction="row"
          alignItems="center"
          className="back mb--S"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIosIcon />
          <Typography>Quay lại</Typography>
        </Stack>

        <div className="data-grid">
          <DataGrid
            rows={trunkDetail.current || []}
            columns={COLUMN_CONFIG}
            rowHeight={200}
            autoHeight
            hideFooter
            disableColumnMenu
          />
        </div>

        <TrunkDialog />
      </Container>
    </>
  );
}

export default TrunkManagement;
