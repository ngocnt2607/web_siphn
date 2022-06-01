import { TrunkInfo } from 'app/api/trunk.api';

export interface TrunkTableInfo extends TrunkInfo {
  no: number;
}

export interface TrunkForm {
  id?: string;
  trunkName: string;
  ip: string;
  port: string;
  telecom: string;
  status?: number;
}

export interface OpenDialogProps {
  title: string;
  onSubmit: (data: TrunkForm, isOnlyChangeStatus?: boolean) => void;
  isUpdate?: boolean;
  initialValues?: TrunkInfo;
}

export interface DialogState extends OpenDialogProps {
  isOpen: boolean;
}
