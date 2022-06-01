import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, Container } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import TrunkAPI, { TrunkInfo } from 'app/api/trunk.api';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import addToast from 'shared/blocks/toastify/add-toast.component';
import { Message } from 'shared/const/message.const';
import { STATUS_OPTIONS } from 'shared/const/select-option.const';
import CustomRow from 'shared/blocks/custom-row/custom-row.component';
import useChangePageSize from 'app/hooks/change-page-size.hook';
import { ROW_PAGE_OPTIONS } from 'shared/const/data-grid.const';
import { PageName } from 'shared/const/drawer.const';
import useTrunkDialog from '../components/trunk-dialog/trunk-dialog.component';
import { TrunkForm } from '../shared/trunk-dialog.const';

function TrunkManagement() {
  const { openTrunkDialog, TrunkDialog, closeTrunkDialog } = useTrunkDialog();
  const [loading, setLoading] = useState<boolean>(false);
  const listTrunk = useRef<TrunkInfo[]>();
  const { pageSize, changePageSize } = useChangePageSize();

  const COLUMN_CONFIG = useRef<GridColDef[]>([
    { field: 'no', headerName: 'STT', flex: 0.15, sortable: false },
    { field: 'trunkName', headerName: 'Tên Trunk', flex: 0.8, sortable: false },
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

  const onCreate = async (data: TrunkForm) => {
    try {
      const { ip, trunkName, port, telecom } = data;
      setLoading(true);
      await TrunkAPI.createNewTrunk({
        ip,
        port,
        trunkName,
        groupName: telecom,
      });

      await getListTrunk();
      addToast({ message: Message.CREATE_SUCCESS, type: 'success' });
      closeTrunkDialog();
    } catch (error) {
      setLoading(false);
    }
  };

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

  const handleCreateTrunk = () => {
    openTrunkDialog({
      title: 'Tạo mới Trunk',
      onSubmit: onCreate,
    });
  };

  const getListTrunk = useCallback(async () => {
    try {
      setLoading(true);
      const result = await TrunkAPI.getListTrunk();
      if (result) {
        listTrunk.current = result.groupIps.map((item, index) => ({
          ...item,
          no: index + 1,
        }));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListTrunk();
  }, [getListTrunk]);

  return (
    <>
      <Helmet>
        <title>{PageName.TRUNK_MANAGEMENT}</title>
      </Helmet>

      <LoadingComponent open={loading} />

      <Container maxWidth="xl" className="table-page">
        <div className="create-button">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            className="admin-button --no-transform"
            onClick={handleCreateTrunk}
          >
            Tạo mới
          </Button>
        </div>

        <div className="data-grid">
          <DataGrid
            rows={listTrunk.current || []}
            columns={COLUMN_CONFIG}
            pageSize={pageSize}
            onPageSizeChange={changePageSize}
            rowsPerPageOptions={ROW_PAGE_OPTIONS}
            disableColumnMenu
            autoHeight
            rowHeight={60}
            hideFooterSelectedRowCount
            components={{ Row: CustomRow }}
          />
        </div>

        <TrunkDialog />
      </Container>
    </>
  );
}

export default TrunkManagement;
