import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://lbchkywhvpcutwjksdno.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiY2hreXdodnBjdXR3amtzZG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMDMyMjksImV4cCI6MjA5MzY3OTIyOX0.Zj_2evSTsVC1IpAMYp-6DPMzuIHtna7_q0z5SX7k_e8'
)

