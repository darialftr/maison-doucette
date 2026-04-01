import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://iiherfubfpjxgttviqdm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpaGVyZnViZnBqeGd0dHZpcWRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5ODQ0NDUsImV4cCI6MjA5MDU2MDQ0NX0.t14eGIm3HgZPyfs5NtiqovtQADwKYjPNd7iX9AgYTWs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
