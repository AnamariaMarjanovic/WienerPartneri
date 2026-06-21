export interface Partner {
  id?: number;
  firstName: string;
  lastName: string;
  address?: string;
  partnerNumber: string;
  croatianPIN?: string;
  partnerTypeId: number;
  createdAtUtc?: string;
  createdByUser: string;
  isForeign: boolean;
  externalCode?: string;
  gender: string;
  fullName?: string;
}
