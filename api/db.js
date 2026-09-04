import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

let rawUrl = (process.env.DATABASE_URL || '').trim().replace(/^["']|["']$/g, '');

if (!rawUrl) {
  console.warn('⚠️ WARNING: DATABASE_URL environment variable is not defined.');
}

export const sql = neon(rawUrl);
