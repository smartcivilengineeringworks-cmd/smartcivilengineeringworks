import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const ACTIVE_POOL_URL = 'postgresql://neondb_owner:npg_haS3G7ujCofn@ep-square-sky-ayd8pf06-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

let rawUrl = (process.env.DATABASE_URL || '').trim().replace(/^["']|["']$/g, '');

// If DATABASE_URL is not set or still contains the expired ep-lively-frog cluster, fallback to the active pool
if (!rawUrl || rawUrl.includes('ep-lively-frog')) {
  rawUrl = ACTIVE_POOL_URL;
}

export const sql = neon(rawUrl);
