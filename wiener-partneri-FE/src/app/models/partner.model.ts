export enum PartnerType {
  Personal = 1,
  Legal = 2,
}

export interface Partner {
  id?: number;
  firstName: string;
  lastName: string;
  address?: string;
  partnerNumber: string;
  croatianPIN?: string;
  partnerTypeId: PartnerType;
  createdAtUtc?: string;
  createdByUser: string;
  isForeign: boolean;
  externalCode?: string;
  gender: string;
  fullName?: string;
}
