import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import CustomerAPI, { CustomerInfo } from 'app/api/customer.api';
import useChangePageSize from 'app/hooks/change-page-size.hook';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import CellActionComponent from 'shared/blocks/cell-action/cell-action.component';
import CustomRow from 'shared/blocks/custom-row/custom-row.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import addToast from 'shared/blocks/toastify/add-toast.component';
import { ROW_PAGE_OPTIONS } from 'shared/const/data-grid.const';
import { Message } from 'shared/const/message.const';
import { STATUS_OPTIONS } from 'shared/const/select-option.const';
import { CustomerInfoForm } from '../../shared/customer-info-dialog.type';
import useCustomerInfoDialog from '../customer-info-dialog/customer-info-dialog.component';

function CustomerInfoTab() {
  const { openCustomerInfo, CustomerInfoDialog, closeCustomerInfo } =
    useCustomerInfoDialog();
  const customerList = useRef<CustomerInfo[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const { changePageSize, pageSize } = useChangePageSize();

  const COLUMN_CONFIG = useRef<GridColDef[]>([
    { field: 'no', headerName: 'STT', flex: 0.1, sortable: false },
    {
      field: 'customerName',
      headerName: 'Tên khách hàng',
      flex: 1,
      sortable: false,
    },
    { field: 'description', headerName: 'Mô tả', flex: 1, sortable: false },
    {
      field: 'status',
      headerName: 'Trạng thái',
      flex: 0.2,
      valueGetter: (params: GridValueGetterParams) =>
        STATUS_OPTIONS.find((item) => item.value === params.row.status)?.label,
    },
    {
      field: 'action',
      headerName: 'Chức năng',
      flex: 0.16,
      sortable: false,
      renderCell: (cellValues) => (
        <CellActionComponent
          viewAble={false}
          deleteAble={false}
          handleEdit={() => handleUpdate(cellValues.row)}
        />
      ),
    },
  ]).current;

  const handleUpdate = (initialValues: CustomerInfo) => {
    openCustomerInfo({
      initialValues,
      onSubmit: onUpdate,
      title: 'Cập nhật Khách hàng',
      isUpdate: true,
    });
  };

  const onUpdate = async (data: CustomerInfoForm) => {
    try {
      setLoading(true);
      const { customerName, description, id } = data;
      await CustomerAPI.updateCustomer({
        customerName,
        description,
        id: id || 0,
      });
      await getListCustomer();
      closeCustomerInfo();
      addToast({ message: Message.UPDATE_SUCCESS, type: 'success' });
    } catch (error) {
      setLoading(false);
    }
  };

  const onCreate = async (data: CustomerInfoForm) => {
    try {
      setLoading(true);
      const { description, customerName } = data;
      await CustomerAPI.createCustomer({
        customerName,
        description,
      });
      await getListCustomer();
      closeCustomerInfo();
      addToast({ message: Message.CREATE_SUCCESS, type: 'success' });
    } catch (error) {
      setLoading(false);
    }
  };

  const handleCreateCustomer = () => {
    openCustomerInfo({
      onSubmit: onCreate,
      title: 'Tạo mới Khách hàng',
    });
  };

  const getListCustomer = useCallback(async () => {
    try {
      setLoading(true);
      const result = await CustomerAPI.getListCustomer();
      if (result) {
        customerList.current = result.customers.map((item, index) => ({
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
    getListCustomer();
  }, [getListCustomer]);

  return (
    <>
      <LoadingComponent open={loading} />

      <div className="create-button">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          className="admin-button --no-transform"
          onClick={handleCreateCustomer}
        >
          Tạo mới
        </Button>
      </div>

      <div className="data-grid">
        <DataGrid
          rows={customerList.current || []}
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

      <CustomerInfoDialog />
    </>
  );
}

export default CustomerInfoTab;
