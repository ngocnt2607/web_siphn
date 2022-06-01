/* eslint-disable no-return-await */
import httpService from 'app/services/http/http.service';
import { VirtualNumberGroup } from './customer.api';

export interface VirtualRoutingList {
  virtualNumberGroups: VirtualRouting[];
}

export interface VirtualRouting extends VirtualNumberGroup {
  vngTrunks: VngTrunk[];
}

export interface VngTrunk {
  groupCode: string;
  groupName: string;
  ip: string;
  port: string;
  trunkId: number;
  trunkName: string;
  vngtId: string;
}

interface SetTrunkParams {
  trunkId: string | number;
  customerId: number | string;
  vngId: string | number;
}

interface SetTrunkVngtParams {
  customerId: string | number;
  vngtId: string;
  trunkId: number | string;
}

export default class VirtualRoutingAPI {
  static getListVirtualRouting = async () => {
    return await httpService.get<VirtualRoutingList>('/virtual-number');
  };

  static setTrunkToGroupVirtual = async (params: SetTrunkParams) => {
    const { customerId, vngId, trunkId } = params;
    return await httpService.post(
      `/customer/${customerId}/virtual-number-group/${vngId}/trunk`,
      {
        body: { trunkId },
      }
    );
  };

  static setTrunkToVngtId = async (params: SetTrunkVngtParams) => {
    const { customerId, vngtId, trunkId } = params;
    return await httpService.put(
      `/customer/${customerId}/virtual-number-group-trunk/${vngtId}`,
      {
        body: { trunkId },
      }
    );
  };
}
