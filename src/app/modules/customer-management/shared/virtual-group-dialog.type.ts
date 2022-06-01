import { SelectItem } from 'shared/form/select/select-controller.component';
import { VirtualGroupInfo } from './customer.type';

export interface GroupVirtualForm {
  customerId: number | string;
  vngName: string;
  stringVirtual: string;
  virtual: SelectItem[];
  customerName?: string;
  status?: number;
}

export interface OpenDialogProps {
  title: string;
  onSubmit: (data: GroupVirtualForm) => void;
  isUpdate?: boolean;
  initialValues?: VirtualGroupInfo;
}

export interface DialogState extends OpenDialogProps {
  isOpen: boolean;
  virtualOptions: SelectItem[];
}
