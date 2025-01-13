CREATE OR REPLACE FUNCTION get_market_opportunities()
RETURNS TABLE (
  STATEFP text,
  COUNTYFP text,
  COUNTYNAME text,
  migration_score float,
  business_density_score float,
  service_coverage_score float
) AS $$
  SELECT * FROM market_opportunity_scores;
$$ LANGUAGE sql SECURITY DEFINER;