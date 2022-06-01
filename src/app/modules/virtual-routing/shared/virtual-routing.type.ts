import { VirtualRouting, VngTrunk } from 'app/api/virtual-routing.api';

export interface VirtualRoutingTableInfo extends VirtualRouting {
  id: number;
  viettelTrunk: VngTrunk | string;
  mobiTrunk: VngTrunk | string;
  vinaTrunk: VngTrunk | string;
  defaultTrunk: VngTrunk | string;
}
