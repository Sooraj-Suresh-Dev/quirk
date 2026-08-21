import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.js';

// Client for regular user operations (uses anon key)
export const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);

// Admin client for user management (uses service role key)
export const supabaseAdmin = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY);
