-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add comment to document the security improvement
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Updates the updated_at timestamp with explicit search_path';
