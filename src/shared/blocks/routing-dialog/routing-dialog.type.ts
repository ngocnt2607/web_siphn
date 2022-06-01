import { HotlineRouting } from 'app/api/hotline-routing.api';
import { SelectItem } from 'shared/form/select/select-controller.component';

export interface RoutingForm {
  customerId: number | string;
  hotlineGroupId: string;
  trunkId: string | number;
  status?: number;
}

export interface OpenDialogProps {
  title: string;
  onSubmit: (data: RoutingForm) => void;
  listCustomerGroup?: HotlineRouting[];
  isUpdate?: boolean;
  initialValues?: HotlineRouting;
}

export interface DialogState extends OpenDialogProps {
  isOpen: boolean;
  customerGroupOptions: SelectItem[];
}
