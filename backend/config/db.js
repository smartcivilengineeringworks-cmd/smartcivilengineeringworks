import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const rawUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_haS3G7ujCofn@ep-square-sky-ayd8pf06-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const connectionString = rawUrl.trim().replace(/^["']|["']$/g, '');

export const sql = neon(connectionString);
