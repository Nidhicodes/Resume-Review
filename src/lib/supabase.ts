//SQL command I ran on Supabase to create and secure table "resumes":

// -- Create the resumes table to store metadata
// CREATE TABLE public.resumes (
//   id uuid NOT NULL DEFAULT gen_random_uuid(),
//   created_at timestamp with time zone NOT NULL DEFAULT now(),
//   user_id uuid REFERENCES auth.users(id),
//   file_path text NOT NULL,
//   status text NOT NULL DEFAULT 'Submitted'::text,
//   notes text NULL,
//   score integer NULL,
//   CONSTRAINT resumes_pkey PRIMARY KEY (id)
// );

// -- Add a comment to explain the 'status' column
// COMMENT ON COLUMN public.resumes.status IS 'Possible values: Submitted, Needs Revision, Approved, Rejected';

// -- Enable Row Level Security on the new table
// ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

//Poliicies to secure the table and storage bucket:

// -- Policy: Allow logged-in users to insert their own resume record.
// CREATE POLICY "Allow users to insert their own resume"
// ON public.resumes FOR INSERT
// TO authenticated
// WITH CHECK (auth.uid() = user_id);

// -- Policy: Allow users to view their own resume records.
// CREATE POLICY "Allow users to see their own resumes"
// ON public.resumes FOR SELECT
// TO authenticated
// USING (auth.uid() = user_id);

// -- Policy: Allow users to delete their own resume records.
// CREATE POLICY "Allow users to delete their own resumes"
// ON public.resumes FOR DELETE
// TO authenticated
// USING (auth.uid() = user_id);

// -- Policy: Allow logged-in users to upload files into a folder named after their user ID.
// CREATE POLICY "Allow authenticated uploads"
// ON storage.objects FOR INSERT
// TO authenticated
// WITH CHECK (bucket_id = 'resumes' AND auth.uid() = (storage.foldername(name))[1]::uuid);

// -- Policy: Allow users to view their own files.
// CREATE POLICY "Allow authenticated view of own files"
// ON storage.objects FOR SELECT
// TO authenticated
// USING (bucket_id = 'resumes' AND auth.uid() = (storage.foldername(name))[1]::uuid);

// -- Policy: Allow users to update their own files.
// CREATE POLICY "Allow authenticated update of own files"
// ON storage.objects FOR UPDATE
// TO authenticated
// USING (bucket_id = 'resumes' AND auth.uid() = (storage.foldername(name))[1]::uuid);

// -- Policy: Allow users to delete their own files.
// CREATE POLICY "Allow authenticated delete of own files"
// ON storage.objects FOR DELETE
// TO authenticated
// USING (bucket_id = 'resumes' AND auth.uid() = (storage.foldername(name))[1]::uuid);

//Admin policies

// -- Helper function to check if the current user is an admin.
// -- It checks the user's ID against a hardcoded list.
// create or replace function is_admin(user_id uuid)
// returns boolean
// language plpgsql
// security definer
// set search_path = public
// as $$
// begin
//   return user_id in ('29514379-62bc-429f-8dc5-276b7862b1ec');
// end;
// $$;



// -- Policy: Allow admins to view all resume records.
// CREATE POLICY "Allow admins to view all resumes"
// ON public.resumes FOR SELECT
// TO authenticated
// USING (is_admin(auth.uid()));

// -- Policy: Allow admins to update all resume records.
// CREATE POLICY "Allow admins to update all resumes"
// ON public.resumes FOR UPDATE
// TO authenticated
// USING (is_admin(auth.uid()));



// -- Policy: Allow admins to view all files in the resumes bucket.
// CREATE POLICY "Allow admins to view all files"
// ON storage.objects FOR SELECT
// TO authenticated
// USING (bucket_id = 'resumes' AND is_admin(auth.uid()));


// -- This function securely fetches the data needed for the leaderboard.
// -- It returns a table with an anonymized user ID and the score.
// -- It only includes resumes that have been scored, and it limits the results to the top 100.
// create or replace function get_leaderboard()
// returns table (
//   anon_id text,
//   score integer
// )
// language sql
// security definer
// set search_path = public
// as $$
//   select
//     'User-' || left(resumes.user_id::text, 8) as anon_id,
//     resumes.score
//   from
//     public.resumes
//   where
//     resumes.score is not null
//   order by
//     resumes.score desc
//   limit 100;
// $$;