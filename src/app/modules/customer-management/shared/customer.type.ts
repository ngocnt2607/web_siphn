import {
  Hotline,
  HotlineGroups,
  VirtualNumber,
  VirtualNumberGroup,
} from 'app/api/customer.api';

export interface HotlineGroupInfo extends HotlineGroups {
  id: number;
  stringHotline: string;
  activeHotlines?: Hotline[];
}

export interface VirtualGroupInfo extends VirtualNumberGroup {
  id: number;
  stringVirtual: string;
  activeVirtual?: VirtualNumber[];
}
