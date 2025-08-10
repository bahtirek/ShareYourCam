-- Function to delete image and potentially delete session by image URL
DROP FUNCTION IF EXISTS public.delete_image_and_check_session(text);

-- Create indexes to optimize the function's performance
CREATE INDEX IF NOT EXISTS idx_images_url ON public.images(url);
CREATE INDEX IF NOT EXISTS idx_images_sessions_id ON public.images(sessions_id);
CREATE INDEX IF NOT EXISTS idx_sessions_id ON public.sessions(id);

CREATE OR REPLACE FUNCTION public.delete_image_and_check_session(
  input_url text
) 
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = '' -- Add this for security
AS $$
DECLARE
  session_record_id bigint;
  session_identifier text;
  remaining_images_count bigint;
  result JSON;
BEGIN
  -- Find the session ID associated with the image URL
  SELECT s.id, s.session_id INTO session_record_id, session_identifier
  FROM public.images i
  JOIN public.sessions s ON i.sessions_id = s.id
  WHERE i.url = input_url
  LIMIT 1;
  
  -- If no session found, raise an exception
  IF session_record_id IS NULL THEN
    RAISE EXCEPTION 'No session found for image URL: %', input_url;
  END IF;
  
  -- Delete the specified image
  DELETE FROM public.images 
  WHERE url = input_url;
  
  -- Check if any images remain for this session
  SELECT COUNT(*) INTO remaining_images_count
  FROM public.images i
  WHERE i.sessions_id = session_record_id;
  
  -- If no images remain, delete the session
  IF remaining_images_count = 0 THEN
    DELETE FROM public.sessions 
    WHERE id = session_record_id;
  END IF;
  -- Return success result
  result := json_build_object(
    'success', true,
    'session_id', session_record_id,
    'message', 'Image deleted successfully'
  );
    
  RETURN result;
END;
$$
