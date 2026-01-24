import { SetMetadata } from '@nestjs/common';

export const AUDIT_KEY = 'audit_metadata';

export interface AuditOptions {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'EXPORT';
  module: 'USER' | 'COURSE' | 'FINANCE' | 'SYSTEM';
}

// Cách dùng: @AuditLog({ action: 'UPDATE', module: 'USER' })
export const AuditLog = (options: AuditOptions) =>
  SetMetadata(AUDIT_KEY, options);
