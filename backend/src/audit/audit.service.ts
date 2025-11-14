import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AuditService {
  constructor(private readonly dataSource: DataSource) {}

  async backfillDefaults() {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    try {
      const admin = await qr.manager.query(`SELECT id FROM users WHERE username = 'admin' LIMIT 1`);
      const adminId = admin?.[0]?.id;
      if (!adminId) return;
      const updates: string[] = [
        `UPDATE products SET 
          created_at = COALESCE(created_at, NOW()), 
          updated_at = COALESCE(updated_at, NOW()), 
          created_by_id = COALESCE(created_by_id, $1), 
          updated_by_id = COALESCE(updated_by_id, $1) 
         WHERE created_by_id IS NULL OR updated_by_id IS NULL OR created_at IS NULL OR updated_at IS NULL`,
        `UPDATE sizes SET 
          created_at = COALESCE(created_at, NOW()), 
          updated_at = COALESCE(updated_at, NOW()), 
          created_by_id = COALESCE(created_by_id, $1), 
          updated_by_id = COALESCE(updated_by_id, $1) 
         WHERE created_by_id IS NULL OR updated_by_id IS NULL OR created_at IS NULL OR updated_at IS NULL`,
        `UPDATE colors SET 
          created_at = COALESCE(created_at, NOW()), 
          updated_at = COALESCE(updated_at, NOW()), 
          created_by_id = COALESCE(created_by_id, $1), 
          updated_by_id = COALESCE(updated_by_id, $1) 
         WHERE created_by_id IS NULL OR updated_by_id IS NULL OR created_at IS NULL OR updated_at IS NULL`,
        `UPDATE sales SET 
          created_at = COALESCE(created_at, NOW()), 
          updated_at = COALESCE(updated_at, NOW()), 
          created_by_id = COALESCE(created_by_id, $1), 
          updated_by_id = COALESCE(updated_by_id, $1) 
         WHERE created_by_id IS NULL OR updated_by_id IS NULL OR created_at IS NULL OR updated_at IS NULL`,
        `UPDATE sale_items SET 
          created_at = COALESCE(created_at, NOW()), 
          updated_at = COALESCE(updated_at, NOW()), 
          created_by_id = COALESCE(created_by_id, $1), 
          updated_by_id = COALESCE(updated_by_id, $1) 
         WHERE created_by_id IS NULL OR updated_by_id IS NULL OR created_at IS NULL OR updated_at IS NULL`
      ];
      for (const sql of updates) {
        await qr.query(sql, [adminId]);
      }
    } finally {
      await qr.release();
    }
  }
}

