import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as newSchema from './schema';
import * as oldSchema from '@/db/schema';

// Merge both schemas for backward compatibility during migration
const schema = { ...oldSchema, ...newSchema };

const connectionString = process.env.SUPABASE_DB_URL!;

// Configure postgres with better error handling
const client = postgres(connectionString, {
  prepare: false,
  max: 1, // Limit connections during development
  idle_timeout: 20,
  connect_timeout: 10,
  onnotice: () => {}, // Suppress notices
});

export const db = drizzle(client, { schema });
