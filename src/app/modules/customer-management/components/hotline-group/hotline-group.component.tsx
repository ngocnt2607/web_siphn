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
import { HotlineGroupInfo } from '../../shared/customer.type';
import { GroupHotlineForm } from '../../shared/hotline-group-dialog.type';
import useHotlineGroupDialog from '../hotline-group-dialog/hotline-group-dialog.component';

function HotlineGroup() {
  const { HotlineGroupDialog, closeHotlineGroup, openHotlineGroup } =
    useHotlineGroupDialog();
  const groupHotlineList = useRef<HotlineGroupInfo[]>();
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
      field: 'hotlineGroupName',
      headerName: 'Tên nhóm Hotline',
      flex: 0.75,
      sortable: false,
      renderCell: (cellValues) => (
        <Link
          href={`customer-management/hotline-detail/${cellValues.row.customerId}/${cellValues.row.hotlineGroupId}`}
          underline="none"
        >
          {cellValues.row.hotlineGroupName}
        </Link>
      ),
    },
    {
      field: 'stringHotline',
      headerName: 'Số Hotline',
      flex: 1.5,
      sortable: false,
    },
    {
      field: 'groupStatus',
      headerName: 'Trạng thái',
      flex: 0.3,
      valueGetter: (params: GridValueGetterParams) =>
        STATUS_OPTIONS.find((item) => item.value === params.row.groupStatus)
          ?.label,
    },
  ]).current;

  const onCreate = async (data: GroupHotlineForm) => {
    try {
      setLoading(true);
      const { customerId, groupHotlineName, stringHotline } = data;
      await CustomerAPI.createGroupHotline({
        customerId: Number(customerId),
        groupHotlineName,
        isdns: convertStringToArray(stringHotline),
      });
      await getListHotlineGroup();
      closeHotlineGroup();
      addToast({ message: Message.CREATE_SUCCESS, type: 'success' });
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCreateHotlineGroup = () => {
    openHotlineGroup({
      onSubmit: onCreate,
      title: 'Tạo mới nhóm Hotline',
    });
  };

  const getListHotlineGroup = useCallback(async () => {
    try {
      setLoading(true);
      const result = await CustomerAPI.getListGroupHotline();
      if (result) {
        groupHotlineList.current = result.hotlineGroups.map((item, index) => ({
          ...item,
          id: index + 1,
          stringHotline: item.hotlines
            .reduce((prev: string[], current) => {
              if (current.status) prev.push(current.isdn);
              return prev;
            }, [])
            .join(', '),
        }));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListHotlineGroup();
  }, [getListHotlineGroup]);

  return (
    <>
      <LoadingComponent open={loading} />

      <div className="create-button">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          className="admin-button --no-transform"
          onClick={handleCreateHotlineGroup}
        >
          Tạo mới
        </Button>
      </div>

      <div className="data-grid">
        <DataGrid
          rows={groupHotlineList.current || []}
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

      <HotlineGroupDialog />
    </>
  );
}

export default HotlineGroup;
