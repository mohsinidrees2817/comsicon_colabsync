import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bqagcrwdgfoskdykeokq.supabase.co';       // 🔁 Replace
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxYWdjcndkZ2Zvc2tkeWtlb2txIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNzA5MDUsImV4cCI6MjA2MDc0NjkwNX0.fHPPLMd5IUaOuqjFDGP4iqjOzbte0EvU5CR2SGS1SCQ';                     // 🔁 Replace

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
