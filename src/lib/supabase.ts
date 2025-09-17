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

// -- Create a table for public user data
// create table profiles (
//   id uuid references auth.users not null primary key,
//   email text,
//   is_admin boolean default false
// );

// -- Set up Row Level Security (RLS)
// -- See https://supabase.com/docs/guides/auth/row-level-security for more details.
// alter table profiles
//   enable row level security;

// create policy "Public profiles are viewable by everyone." on profiles
//   for select using (true);

// create policy "Users can insert their own profile." on profiles
//   for insert with check (auth.uid() = id);

// create policy "Users can update own profile." on profiles
//   for update using (auth.uid() = id);

// create policy "Admins can update any profile." on profiles
//   for update using (is_admin(auth.uid()));

// -- This trigger automatically creates a profile for new users.
// -- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
// create function public.handle_new_user()
// returns trigger as $$
// begin
//   insert into public.profiles (id, email)
//   values (new.id, new.email);
//   return new;
// end;
// $$ language plpgsql security definer;
// create trigger on_auth_user_created
//   after insert on auth.users
//   for each row execute procedure public.handle_new_user();


// -- Helper function to check if the current user is an admin.
// create or replace function is_admin(user_id uuid)
// returns boolean
// language plpgsql
// security definer
// set search_path = public
// as $$
// declare
//   is_admin_user boolean;
// begin
//   select is_admin into is_admin_user from profiles where id = user_id;
//   return coalesce(is_admin_user, false);
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