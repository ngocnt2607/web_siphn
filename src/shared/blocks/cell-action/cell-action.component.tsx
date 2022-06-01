import { IconButton, Stack } from '@mui/material';
import React from 'react';
import { Preview, Edit, DeleteForever } from '@mui/icons-material';
import { COLOR_EDIT, COLOR_GREEN_LIGHT } from 'styles/variables';
import useConfirmDialog, {
  OpenDialogProps,
} from '../confirm-dialog/confirm-dialog.component';
import './cell-action.style.scss';

interface ActionCellProps {
  viewAble?: boolean;
  editAble?: boolean;
  deleteAble?: boolean;
  handleView?: () => void;
  handleEdit?: () => void;
  deleteDialogInfo?: OpenDialogProps;
}

function ActionCell(props: ActionCellProps) {
  const {
    deleteAble,
    editAble,
    handleEdit,
    handleView,
    viewAble,
    deleteDialogInfo,
  } = props;

  const { ConfirmDialog, openConfirmDialog } = useConfirmDialog();

  const handleOpenDeleteConfirm = () => {
    if (deleteDialogInfo) {
      const { description, title, handleConfirm, type } = deleteDialogInfo;
      openConfirmDialog({
        title,
        type,
        description,
        handleConfirm,
      });
    }
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      className="cell-action"
    >
      {viewAble && (
        <IconButton onClick={handleView}>
          <Preview sx={{ color: COLOR_GREEN_LIGHT }} />
        </IconButton>
      )}

      {editAble && (
        <IconButton onClick={handleEdit}>
          <Edit sx={{ color: COLOR_EDIT }} />
        </IconButton>
      )}

      {deleteAble && (
        <IconButton color="error" onClick={handleOpenDeleteConfirm}>
          <DeleteForever />
        </IconButton>
      )}

      <ConfirmDialog />
    </Stack>
  );
}

ActionCell.defaultProps = {
  viewAble: true,
  editAble: true,
  deleteAble: true,
  handleView: () => {},
  handleEdit: () => {},
  deleteDialogInfo: {},
};

export default React.memo(ActionCell);
