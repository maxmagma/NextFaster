import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as newSchema from './schema';
import * as oldSchema from '@/db/schema';

// Merge both schemas for backward compatibility during migration
const schema = { ...oldSchema, ...newSchema };

const connectionString = process.env.SUPABASE_DB_URL!;
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
