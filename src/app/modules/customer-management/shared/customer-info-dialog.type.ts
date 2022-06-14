import { CustomerInfo } from 'app/api/customer.api';
import { SelectItem } from 'shared/form/select/select-controller.component';

export interface CustomerInfoForm {
  id?: string;
  customerName: string;
  description: string;
  stringIP: string;
  ips: SelectItem[];
}

export interface OpenDialogProps {
  title: string;
  onSubmit: (data: CustomerInfoForm) => void;
  isUpdate?: boolean;
  initialValues?: CustomerInfo;
}

export interface DialogState extends OpenDialogProps {
  isOpen: boolean;
  ipOptions: SelectItem[];
}
