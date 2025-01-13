CREATE OR REPLACE FUNCTION get_service_distribution()
RETURNS TABLE (
  STATEFP text,
  specialities text,
  specialty_count bigint,
  specialty_percentage float
) AS $$
  SELECT * FROM service_distribution;
$$ LANGUAGE sql SECURITY DEFINER;