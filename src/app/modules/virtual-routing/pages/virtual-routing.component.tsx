import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, Container } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import CustomerAPI from 'app/api/customer.api';
import VirtualRoutingAPI, {
  VirtualRouting,
  VngTrunk,
} from 'app/api/virtual-routing.api';
import useChangePageSize from 'app/hooks/change-page-size.hook';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import CustomRow from 'shared/blocks/custom-row/custom-row.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import addToast from 'shared/blocks/toastify/add-toast.component';
import { ROW_PAGE_OPTIONS } from 'shared/const/data-grid.const';
import { PageName } from 'shared/const/drawer.const';
import { Message } from 'shared/const/message.const';
import { STATUS_OPTIONS } from 'shared/const/select-option.const';
import { GroupCodeList } from 'shared/const/trunk.const';
import SearchFieldComponent from 'shared/search-field/search-field.component';
import useVirtualRoutingDialog from '../components/virtual-routing-dialog/virtual-routing-dialog.component';
import { RoutingForm } from '../shared/virtual-routing-dialog.type';
import { VirtualRoutingTableInfo } from '../shared/virtual-routing.type';

function HotlineRoutingPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const listDataHaveTrunkAll = useRef<VirtualRoutingTableInfo[]>([]);
  const listDataNotTrunk = useRef<VirtualRouting[]>([]);
  const [listData, setListData] = useState<VirtualRoutingTableInfo[]>([]);
  const { changePageSize, pageSize } = useChangePageSize();
  const { VirtualRoutingDialog, closeVirtualRouting, openVirtualRouting } =
    useVirtualRoutingDialog();

  const COLUMN_CONFIG = useRef<GridColDef[]>([
    { field: 'id', headerName: 'STT', flex: 0.1, sortable: false },
    {
      field: 'customerName',
      headerName: 'T??n kh??ch h??ng',
      flex: 0.7,
      sortable: false,
    },
    {
      field: 'vngName',
      headerName: 'T??n nh??m Virtual',
      flex: 0.7,
      sortable: false,
      renderCell: (cellValues) => {
        const { customerId, vngId } = cellValues.row as VirtualRoutingTableInfo;

        return (
          <Link
            to={`/admin/customer-management/virtual-detail/${customerId}/${vngId}`}
            style={{ textDecoration: 'none' }}
            className="ellipsis-text"
          >
            {cellValues.row.vngName}
          </Link>
        );
      },
    },
    {
      field: 'viettelTrunk',
      headerName: 'Viettel Trunk',
      flex: 0.4,
      sortable: false,
      renderCell: (cellValues) => {
        const { viettelTrunk } = cellValues.row as VirtualRoutingTableInfo;
        const vngViettelTrunk = viettelTrunk as VngTrunk;
        return (
          <Link
            key={vngViettelTrunk?.trunkId}
            to={`/admin/trunk-management/detail/${vngViettelTrunk?.groupCode}/${vngViettelTrunk?.trunkId}`}
            style={{ textDecoration: 'none' }}
            className="ellipsis-text mr--XXS"
          >
            {vngViettelTrunk?.trunkName}
          </Link>
        );
      },
    },
    {
      field: 'mobiTrunk',
      headerName: 'Mobiphone Trunk',
      flex: 0.4,
      sortable: false,
      renderCell: (cellValues) => {
        const { mobiTrunk } = cellValues.row as VirtualRoutingTableInfo;
        const vngMobiTrunk = mobiTrunk as VngTrunk;
        return (
          <Link
            key={vngMobiTrunk?.trunkId}
            to={`/admin/trunk-management/detail/${vngMobiTrunk?.groupCode}/${vngMobiTrunk?.trunkId}`}
            style={{ textDecoration: 'none' }}
            className="ellipsis-text mr--XXS"
          >
            {vngMobiTrunk?.trunkName}
          </Link>
        );
      },
    },
    {
      field: 'vinaTrunk',
      headerName: 'Vinaphone Trunk',
      flex: 0.4,
      sortable: false,
      renderCell: (cellValues) => {
        const { vinaTrunk } = cellValues.row as VirtualRoutingTableInfo;
        const vngVinaTrunk = vinaTrunk as VngTrunk;
        return (
          <Link
            key={vngVinaTrunk?.trunkId}
            to={`/admin/trunk-management/detail/${vngVinaTrunk?.groupCode}/${vngVinaTrunk?.trunkId}`}
            style={{ textDecoration: 'none' }}
            className="ellipsis-text mr--XXS"
          >
            {vngVinaTrunk?.trunkName}
          </Link>
        );
      },
    },
    {
      field: 'defaultTrunk',
      headerName: 'Default Trunk',
      flex: 0.4,
      sortable: false,
      renderCell: (cellValues) => {
        const { defaultTrunk } = cellValues.row as VirtualRoutingTableInfo;
        const vngDefaultTrunk = defaultTrunk as VngTrunk;
        return (
          <Link
            key={vngDefaultTrunk?.trunkId}
            to={`/admin/trunk-management/detail/${vngDefaultTrunk?.groupCode}/${vngDefaultTrunk?.trunkId}`}
            style={{ textDecoration: 'none' }}
            className="ellipsis-text mr--XXS"
          >
            {vngDefaultTrunk?.trunkName}
          </Link>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Tr???ng th??i',
      flex: 0.3,
      valueGetter: (params: GridValueGetterParams) =>
        STATUS_OPTIONS.find((item) => item.value === params.row.status)?.label,
    },
    {
      field: 'action',
      headerName: 'Ch???c n??ng',
      flex: 0.25,
      sortable: false,
      renderCell: (cellValues) => {
        return (
          <CellAction
            viewAble={false}
            deleteAble={false}
            handleEdit={() => handleEditHotlineRouting(cellValues.row)}
          />
        );
      },
    },
  ]).current;

  const handleEditHotlineRouting = (initialValues: VirtualRouting) => {
    openVirtualRouting({
      onSubmit: onUpdate,
      initialValues,
      title: 'C???p nh???t Trunk cho nh??m Virtual',
      isUpdate: true,
      listCustomerGroup: listDataHaveTrunkAll.current,
    });
  };

  const handleCreateHotlineRouting = () => {
    openVirtualRouting({
      onSubmit: onCreate,
      title: 'T???o Trunk cho nh??m Virtual',
      listCustomerGroup: listDataNotTrunk.current,
    });
  };

  const onUpdate = async (data: RoutingForm) => {
    try {
      setLoading(true);
      const {
        customerId,
        mobiVngtId,
        vinaVngtId,
        defaultVngtId,
        viettelVngtId,
        viettelTrunkId,
        mobiTrunkId,
        vinaTrunkId,
        status,
        defaultTrunkId,
        virtualGroupId,
      } = data;
      const findVirtualGroup = listDataHaveTrunkAll.current.find(
        (item) =>
          String(item.customerId) === customerId &&
          String(item.vngId) === virtualGroupId
      );
      const callAPI = [];

      if (findVirtualGroup) {
        if (
          findVirtualGroup.vngTrunks.find(
            (item) =>
              item.groupCode === GroupCodeList.viettel &&
              String(item.trunkId) !== viettelTrunkId
          )
        ) {
          callAPI.push(() => {
            return VirtualRoutingAPI.setTrunkToVngtId({
              customerId,
              vngtId: viettelVngtId,
              trunkId: viettelTrunkId,
            });
          });
        }

        if (
          findVirtualGroup.vngTrunks.find(
            (item) =>
              item.groupCode === GroupCodeList.mobi &&
              String(item.trunkId) !== mobiTrunkId
          )
        ) {
          callAPI.push(() => {
            return VirtualRoutingAPI.setTrunkToVngtId({
              customerId,
              vngtId: mobiVngtId,
              trunkId: mobiTrunkId,
            });
          });
        }

        if (
          findVirtualGroup.vngTrunks.find(
            (item) =>
              item.groupCode === GroupCodeList.vina &&
              String(item.trunkId) !== vinaTrunkId
          )
        ) {
          callAPI.push(() => {
            return VirtualRoutingAPI.setTrunkToVngtId({
              customerId,
              vngtId: vinaVngtId,
              trunkId: vinaTrunkId,
            });
          });
        }

        if (
          findVirtualGroup.vngTrunks.find(
            (item) =>
              item.groupCode === GroupCodeList.default &&
              String(item.trunkId) !== defaultTrunkId
          )
        ) {
          callAPI.push(() => {
            return VirtualRoutingAPI.setTrunkToVngtId({
              customerId,
              vngtId: defaultVngtId,
              trunkId: defaultTrunkId,
            });
          });
        }

        if (findVirtualGroup.status !== status) {
          callAPI.push(() => {
            return CustomerAPI.updateVirtualGroup({
              status,
              customerId: Number(customerId),
              vngId: Number(virtualGroupId),
            });
          });
        }
      }

      Promise.all(callAPI.map((api) => api())).then(async () => {
        await getListVirtual();
        addToast({ message: Message.UPDATE_SUCCESS, type: 'success' });
        closeVirtualRouting();
      });
    } catch (error) {
      setLoading(false);
    }
  };

  const onCreate = async (data: RoutingForm) => {
    try {
      setLoading(true);
      const {
        customerId,
        viettelTrunkId,
        mobiTrunkId,
        vinaTrunkId,
        defaultTrunkId,
        virtualGroupId,
      } = data;
      const callAPI = [
        viettelTrunkId,
        mobiTrunkId,
        vinaTrunkId,
        defaultTrunkId,
      ].reduce((prev: (() => Promise<unknown>)[], current) => {
        prev.push(() => {
          return VirtualRoutingAPI.setTrunkToGroupVirtual({
            customerId,
            vngId: virtualGroupId,
            trunkId: current,
          });
        });

        return prev;
      }, []);
      await Promise.all(callAPI.map((api) => api()));
      await getListVirtual();
      addToast({ message: Message.CREATE_SUCCESS, type: 'success' });
      closeVirtualRouting();
    } catch (error) {
      setLoading(false);
    }
  };

  const getListVirtual = useCallback(async () => {
    try {
      setLoading(true);
      const result = await VirtualRoutingAPI.getListVirtualRouting();

      if (result) {
        const dataHaveTrunk: VirtualRoutingTableInfo[] = [];
        const dataNotTrunk: VirtualRouting[] = [];
        result.virtualNumberGroups.forEach((item, index) => {
          if (item.vngTrunks?.length) {
            dataHaveTrunk.push({
              ...item,
              id: index + 1,
              viettelTrunk:
                item.vngTrunks?.find(
                  (trunk) => trunk.groupCode === GroupCodeList.viettel
                ) || '',
              mobiTrunk:
                item.vngTrunks?.find(
                  (trunk) => trunk.groupCode === GroupCodeList.mobi
                ) || '',
              vinaTrunk:
                item.vngTrunks?.find(
                  (trunk) => trunk.groupCode === GroupCodeList.vina
                ) || '',
              defaultTrunk:
                item.vngTrunks?.find(
                  (trunk) => trunk.groupCode === GroupCodeList.default
                ) || '',
            });
          } else {
            dataNotTrunk.push(item);
          }
        });
        listDataHaveTrunkAll.current = dataHaveTrunk;
        listDataNotTrunk.current = dataNotTrunk;
      }
      setListData([...listDataHaveTrunkAll.current]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  const onLocalSearch = (search: string) => {
    const convertSearch = search.trim().toLowerCase();
    const searchList = listDataHaveTrunkAll.current.filter(
      (item) =>
        item.customerName.toLowerCase().includes(convertSearch) ||
        item.vngName.toLowerCase().includes(convertSearch) ||
        !!item.vngTrunks.find((trunk) =>
          trunk.trunkName.toLowerCase().includes(convertSearch)
        )
    );
    setListData(searchList);
  };

  useEffect(() => {
    getListVirtual();
  }, [getListVirtual]);

  return (
    <>
      <LoadingComponent open={loading} />

      <Container maxWidth="xl" className="table-page">
        <Helmet>
          <title>{PageName.VIRTUAL_ROUTING}</title>
        </Helmet>

        <div className="create-button">
          <SearchFieldComponent
            placeholder="Nh???p t??n Kh??ch h??ng, Trunk, Virtual"
            handleSearch={onLocalSearch}
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            className="admin-button --no-transform"
            onClick={handleCreateHotlineRouting}
          >
            T???o m???i
          </Button>
        </div>

        <div className="data-grid">
          <DataGrid
            rows={listData}
            columns={COLUMN_CONFIG}
            pageSize={pageSize}
            onPageSizeChange={changePageSize}
            rowsPerPageOptions={ROW_PAGE_OPTIONS}
            autoHeight
            disableColumnMenu
            hideFooterSelectedRowCount
            components={{ Row: CustomRow }}
          />
        </div>
      </Container>

      <VirtualRoutingDialog />
    </>
  );
}

export default HotlineRoutingPage;
