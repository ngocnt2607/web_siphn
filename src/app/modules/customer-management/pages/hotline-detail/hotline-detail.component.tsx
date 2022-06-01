import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Container, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CustomerAPI from 'app/api/customer.api';
import { getDifferenceTwoArray } from 'app/helpers/array.helper';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import CellAction from 'shared/blocks/cell-action/cell-action.component';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import addToast from 'shared/blocks/toastify/add-toast.component';
import { PageName } from 'shared/const/drawer.const';
import { Message } from 'shared/const/message.const';
import useHotlineGroupDialog from '../../components/hotline-group-dialog/hotline-group-dialog.component';
import { HotlineGroupInfo } from '../../shared/customer.type';
import { GroupHotlineForm } from '../../shared/hotline-group-dialog.type';

function HotlineDetailPage() {
  const { customerId, hotlineGroupId } = useParams();
  const hotlineDetailInfo = useRef<HotlineGroupInfo>();
  const [loading, setLoading] = useState<boolean>(false);
  const { HotlineGroupDialog, closeHotlineGroup, openHotlineGroup } =
    useHotlineGroupDialog();
  const navigate = useNavigate();

  const COLUMN_CONFIG = useRef<GridColDef[]>([
    { field: 'id', headerName: 'STT', flex: 0.1, sortable: false },
    {
      field: 'hotlineGroupName',
      headerName: 'Tên nhóm Hotline',
      flex: 0.85,
      sortable: false,
    },
    {
      field: 'stringHotline',
      headerName: 'Số Hotline',
      flex: 1.5,
      sortable: false,
    },
    {
      field: 'action',
      headerName: 'Chức năng',
      flex: 0.17,
      sortable: false,
      renderCell: (cellValues) => (
        <CellAction
          viewAble={false}
          deleteAble={false}
          handleEdit={() => handleEdit(cellValues.row)}
        />
      ),
    },
  ]).current;

  const onUpdate = async (data: GroupHotlineForm) => {
    const { groupHotlineName, hotline, status } = data;
    const callAPI = [];
    if (groupHotlineName !== hotlineDetailInfo.current?.hotlineGroupName) {
      callAPI.push(() => {
        return CustomerAPI.updateHotlineGroup({
          hotlineGroupName: groupHotlineName,
          customerId: hotlineDetailInfo.current?.customerId || 0,
          hotlineGroupId: hotlineDetailInfo.current?.hotlineGroupId || 0,
        });
      });
    }

    if (status !== hotlineDetailInfo.current?.groupStatus) {
      callAPI.push(() => {
        return CustomerAPI.updateHotlineGroup({
          status,
          customerId: hotlineDetailInfo.current?.customerId || 0,
          hotlineGroupId: hotlineDetailInfo.current?.hotlineGroupId || 0,
        });
      });
    }

    if (hotline?.length) {
      const arrayHotline = hotline.map(
        (hotlineItem) => hotlineItem.label || hotlineItem
      );
      const initialArrayHotline =
        hotlineDetailInfo.current?.activeHotlines?.map((item) => item.isdn) ||
        [];

      const deleteHotlines = getDifferenceTwoArray(
        initialArrayHotline,
        arrayHotline
      );
      const addHotlines = getDifferenceTwoArray(
        arrayHotline,
        initialArrayHotline
      );

      if (addHotlines.length) {
        const disableHotline = hotlineDetailInfo.current?.hotlines.filter(
          (item) => !item.status
        );
        const addNewHotlines: string[] = [];
        addHotlines?.forEach((addItem) => {
          const findHotline = disableHotline?.find(
            (item) => item.isdn === addItem
          );
          if (findHotline) {
            callAPI.push(() => {
              return CustomerAPI.changeActiveHotline(
                String(findHotline?.hotlineId),
                1
              );
            });
            return;
          }

          addNewHotlines.push(addItem);
        });

        if (addNewHotlines.length) {
          callAPI.push(() => {
            return CustomerAPI.addHotline({
              isdns: addNewHotlines,
              customerId: hotlineDetailInfo.current?.customerId || 0,
              hotlineGroupId: hotlineDetailInfo.current?.hotlineGroupId || 0,
            });
          });
        }
      }

      if (deleteHotlines.length) {
        deleteHotlines.forEach((deleteItem) => {
          const findHotline = hotlineDetailInfo.current?.activeHotlines?.find(
            (item) => item.isdn === deleteItem
          );
          if (findHotline)
            callAPI.push(() => {
              return CustomerAPI.changeActiveHotline(
                String(findHotline?.hotlineId),
                0
              );
            });
        });
      }
    }

    try {
      setLoading(true);
      Promise.all(callAPI.map((api) => api())).then(async () => {
        await getHotlineDetail();
        addToast({ message: Message.UPDATE_SUCCESS, type: 'success' });
        closeHotlineGroup();
      });
    } catch (error) {
      setLoading(false);
    }
  };

  const handleEdit = (initialValues: HotlineGroupInfo) => {
    openHotlineGroup({
      initialValues,
      onSubmit: onUpdate,
      title: 'Cập nhập nhóm Hotline',
      isUpdate: true,
    });
  };

  const getHotlineDetail = useCallback(async () => {
    try {
      setLoading(true);
      const result = await CustomerAPI.getHotlineDetail(
        customerId || '',
        hotlineGroupId || ''
      );
      if (result) {
        const activeHotlines = result.hotlineGroups?.[0].hotlines.filter(
          (item) => !!item.status
        );
        hotlineDetailInfo.current = {
          ...result.hotlineGroups?.[0],
          activeHotlines,
          id: 1,
          stringHotline:
            activeHotlines?.map((item) => item.isdn).join(', ') || '',
        };
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getHotlineDetail();
  }, [getHotlineDetail]);

  return (
    <>
      <Helmet>
        <title>{PageName.HOTLINE_DETAIL}</title>
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
            rows={hotlineDetailInfo.current ? [hotlineDetailInfo.current] : []}
            columns={COLUMN_CONFIG}
            rowHeight={200}
            autoHeight
            disableColumnMenu
            hideFooter
          />
        </div>
      </Container>

      <HotlineGroupDialog />
    </>
  );
}

export default HotlineDetailPage;
