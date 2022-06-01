import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import CustomerAPI from 'app/api/customer.api';
import { convertStringToArray } from 'app/helpers/array.helper';
import useChangePageSize from 'app/hooks/change-page-size.hook';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import CustomRow from 'shared/blocks/custom-row/custom-row.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import addToast from 'shared/blocks/toastify/add-toast.component';
import { ROW_PAGE_OPTIONS } from 'shared/const/data-grid.const';
import { Message } from 'shared/const/message.const';
import { STATUS_OPTIONS } from 'shared/const/select-option.const';
import { VirtualGroupInfo } from '../../shared/customer.type';
import { GroupVirtualForm } from '../../shared/virtual-group-dialog.type';
import useVirtualGroupDialog from '../virtual-group-dialog/virtual-group-dialog.component';

function VirtualGroup() {
  const { VirtualGroupDialog, closeVirtualGroup, openVirtualGroup } =
    useVirtualGroupDialog();
  const groupVirtualList = useRef<VirtualGroupInfo[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const { changePageSize, pageSize } = useChangePageSize();

  const COLUMN_CONFIG = useRef<GridColDef[]>([
    { field: 'id', headerName: 'STT', flex: 0.1, sortable: false },
    {
      field: 'customerName',
      headerName: 'Tên khách hàng',
      flex: 0.75,
      sortable: false,
    },
    {
      field: 'vngName',
      headerName: 'Tên nhóm Virtual',
      flex: 0.75,
      sortable: false,
      renderCell: (cellValues) => (
        <Link
          href={`customer-management/virtual-detail/${cellValues.row.customerId}/${cellValues.row.vngId}`}
          underline="none"
        >
          {cellValues.row.vngName}
        </Link>
      ),
    },
    {
      field: 'stringVirtual',
      headerName: 'Số Virtual',
      flex: 1.5,
      sortable: false,
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      flex: 0.3,
      valueGetter: (params: GridValueGetterParams) =>
        STATUS_OPTIONS.find((item) => item.value === params.row.status)?.label,
    },
  ]).current;

  const onCreate = async (data: GroupVirtualForm) => {
    try {
      setLoading(true);
      const { customerId, vngName, stringVirtual } = data;
      await CustomerAPI.createGroupVirtual({
        customerId: Number(customerId),
        vngName,
        isdns: convertStringToArray(stringVirtual),
      });
      await getListVirtualGroup();
      closeVirtualGroup();
      addToast({ message: Message.CREATE_SUCCESS, type: 'success' });
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCreateVirtualGroup = () => {
    openVirtualGroup({
      onSubmit: onCreate,
      title: 'Tạo mới nhóm Virtual',
    });
  };

  const getListVirtualGroup = useCallback(async () => {
    try {
      setLoading(true);
      const result = await CustomerAPI.getListVirtual();
      if (result) {
        groupVirtualList.current = result.virtualNumberGroups.map(
          (item, index) => ({
            ...item,
            id: index + 1,
            stringVirtual: item.virtualNumbers
              .reduce((prev: string[], current) => {
                if (current.status) prev.push(current.isdn);
                return prev;
              }, [])
              .join(', '),
          })
        );
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListVirtualGroup();
  }, [getListVirtualGroup]);

  return (
    <>
      <LoadingComponent open={loading} />

      <div className="create-button">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          className="admin-button --no-transform"
          onClick={handleCreateVirtualGroup}
        >
          Tạo mới
        </Button>
      </div>

      <div className="data-grid">
        <DataGrid
          rows={groupVirtualList.current || []}
          columns={COLUMN_CONFIG}
          pageSize={pageSize}
          onPageSizeChange={changePageSize}
          rowsPerPageOptions={ROW_PAGE_OPTIONS}
          disableColumnMenu
          rowHeight={60}
          autoHeight
          hideFooterSelectedRowCount
          components={{ Row: CustomRow }}
        />
      </div>

      <VirtualGroupDialog />
    </>
  );
}

export default VirtualGroup;
