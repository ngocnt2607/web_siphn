import { CustomerInfo } from 'app/api/customer.api';

export interface CustomerInfoForm {
  id?: number;
  customerName: string;
  description: string;
}

export interface OpenDialogProps {
  title: string;
  onSubmit: (data: CustomerInfoForm) => void;
  isUpdate?: boolean;
  initialValues?: CustomerInfo;
}

export interface DialogState extends OpenDialogProps {
  isOpen: boolean;
}
