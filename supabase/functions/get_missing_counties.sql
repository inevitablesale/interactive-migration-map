CREATE OR REPLACE FUNCTION public.get_missing_counties()
RETURNS TABLE (
    COUNTYNAME text,
    state text,
    total_missing bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH county_rankings_data AS (
        SELECT DISTINCT countyname, statefp 
        FROM get_county_rankings()
    ),
    missing_counties AS (
        SELECT 
            cd."COUNTYNAME",
            cd."STATEFP",
            sfc.state
        FROM county_data cd
        LEFT JOIN state_fips_codes sfc ON cd."STATEFP" = sfc.fips_code
        WHERE NOT EXISTS (
            SELECT 1 
            FROM county_rankings_data cr
            WHERE cr.countyname = cd."COUNTYNAME"
            AND cr.statefp = cd."STATEFP"
        )
    )
    SELECT 
        mc."COUNTYNAME",
        mc.state,
        COUNT(*) OVER () as total_missing
    FROM missing_counties mc
    ORDER BY mc.state, mc."COUNTYNAME";
END;
$$;