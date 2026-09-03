import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_c6zr1KeBIDFt@ep-lively-frog-axp9ua3s-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

export const sql = neon(connectionString);
