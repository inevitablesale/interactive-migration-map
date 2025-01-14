CREATE OR REPLACE FUNCTION get_service_distribution()
RETURNS TABLE (
  STATEFP text,
  specialities text,
  specialty_count bigint,
  specialty_percentage float
) AS $$
  WITH specialty_counts AS (
    SELECT 
      cf.STATEFP::text,
      cf.specialities,
      COUNT(*) as count
    FROM canary_firms_data cf
    WHERE cf.specialities IS NOT NULL
    GROUP BY cf.STATEFP, cf.specialities
  ),
  total_counts AS (
    SELECT 
      STATEFP,
      SUM(count) as total
    FROM specialty_counts
    GROUP BY STATEFP
  )
  SELECT 
    sc.STATEFP,
    sc.specialities,
    sc.count as specialty_count,
    (sc.count::float / tc.total * 100) as specialty_percentage
  FROM specialty_counts sc
  JOIN total_counts tc ON sc.STATEFP = tc.STATEFP
  ORDER BY sc.STATEFP, specialty_percentage DESC;
$$ LANGUAGE sql SECURITY DEFINER;