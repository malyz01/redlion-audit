export enum UnitTypeEnum {
  php = 'PHP',
  usd = 'USD',
  nzd = 'NZD',
  cad = 'CAD',
}

export enum RoleEnum {
  admin = 'admin',
  user = 'user',
  employee = 'employee',
}

export enum UserStatusEnum {
  active = 'active',
  inactive = 'inactive',
  suspended = 'suspended',
}

export enum AccessTypeEnum {
  admin = 'admin',
  manager = 'manager',
}

export enum ModerationStatusEnum {
  pending = 'pending',
  declined = 'declined',
  approved = 'approved',
}

export enum TransactionTypeEnum {
  debit = 'debit',
  credit = 'credit',
}

export enum ExpenseCategoryEnum {
  personal = 'personal',
  business = 'business',
}

export enum PaymentToEnum {
  expense = 'expense',
  self = 'escrow',
  loan = 'loan',
  other = 'other',
}

export enum PaymentStatusEnum {
  pending = 'pending',
  partial = 'partial',
  paid = 'paid',
  confirmed = 'confirmed',
}

export enum PaymentTypeEnum {
  escrow = 'escrow',
  loan = 'loan',
}

export enum CreditTypeEnum {
  additionalLoan = 'additional loan',
  loanPaymnent = 'loan payment',
  na = 'not applicable',
}

export enum TimeZoneEnum {
  nz_auckland = 'Pacific/Auckland',
  america_los_angeles = 'America/Los_Angeles',
  philippines = 'Asia/Manila',
}
