import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bqagcrwdgfoskdykeokq.supabase.co';       // 🔁 Replace
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxYWdjcndkZ2Zvc2tkeWtlb2txIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTE3MDkwNSwiZXhwIjoyMDYwNzQ2OTA1fQ.ZZWgYRkUtxJrfvQfTPWJiszkBztwxy7u14j05bFNi2Q'

export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
