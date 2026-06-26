import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://uzxswadvavjrbexwegie.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6eHN3YWR2YXZqcmJleHdlZ2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMTk1MjIsImV4cCI6MjA5NzY5NTUyMn0.fKXlV-d3AbaRQLqETir5Uimu7vdBOzkUch7l8W8Aa7U'
)