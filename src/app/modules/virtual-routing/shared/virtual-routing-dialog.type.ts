import { CustomerList } from 'app/api/customer.api';
import { TrunkList } from 'app/api/trunk.api';
import { VirtualRouting } from 'app/api/virtual-routing.api';
import { SelectItem } from 'shared/form/select/select-controller.component';

export interface RoutingForm {
  customerId: number | string;
  virtualGroupId: string;
  viettelTrunkId: string | number;
  mobiTrunkId: string | number;
  vinaTrunkId: string | number;
  defaultTrunkId: string | number;
  viettelVngtId: string;
  vinaVngtId: string;
  mobiVngtId: string;
  defaultVngtId: string;
  status?: number;
}

export interface OpenDialogProps {
  title: string;
  onSubmit: (data: RoutingForm) => void;
  listCustomerGroup?: VirtualRouting[];
  isUpdate?: boolean;
  initialValues?: VirtualRouting;
}

export interface DialogState extends OpenDialogProps {
  isOpen: boolean;
  customerGroupOptions: SelectItem[];
}

export interface ResponseAPI {
  [index: number]: TrunkList | CustomerList;
}
