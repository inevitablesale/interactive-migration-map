CREATE OR REPLACE FUNCTION public.get_comprehensive_county_data(p_county_name text, p_state_fp text)
 RETURNS TABLE(
    total_population integer,
    median_household_income integer,
    median_gross_rent integer,
    median_home_value integer,
    employed_population integer,
    private_sector_accountants integer,
    public_sector_accountants integer,
    firms_per_10k_population numeric,
    growth_rate_percentage numeric,
    market_saturation_index numeric,
    total_education_population integer,
    bachelors_degree_holders integer,
    masters_degree_holders integer,
    doctorate_degree_holders integer,
    avg_accountant_payroll numeric,
    public_to_private_ratio numeric,
    avg_commute_time numeric,
    commute_rank integer,
    poverty_rate numeric,
    poverty_rank integer,
    vacancy_rate numeric,
    vacancy_rank integer,
    income_rank integer,
    population_rank integer,
    top_firms jsonb,
    state_avg_income numeric,
    adjacent_counties jsonb
 )
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    WITH national_ranks AS (
        SELECT 
            cd."COUNTYNAME",
            cd."STATEFP",
            RANK() OVER (ORDER BY cd."B08303_001E"::numeric / (12 * 20) DESC)::integer as commute_rank,
            RANK() OVER (ORDER BY (cd."B17001_002E"::NUMERIC / NULLIF(cd."B17001_001E", 0)) DESC)::integer as poverty_rank,
            RANK() OVER (ORDER BY (cd."B25002_003E"::NUMERIC / NULLIF(cd."B25002_002E", 0)) DESC)::integer as vacancy_rank,
            RANK() OVER (ORDER BY cd."B19013_001E" DESC)::integer as income_rank,
            RANK() OVER (ORDER BY cd."B01001_001E" DESC)::integer as population_rank
        FROM county_data cd
        WHERE cd."B08303_001E" IS NOT NULL
    )
    SELECT 
        cd."B01001_001E" AS total_population,
        cd."B19013_001E" AS median_household_income,
        cd."B25002_003E" AS median_gross_rent,
        cd."B25001_001E" AS median_home_value,
        cd."B17001_001E" AS employed_population,
        cd."B15003_001E" AS private_sector_accountants,
        cd."B15003_022E" AS public_sector_accountants,
        (cd."B15003_001E"::numeric / NULLIF(cd."B01001_001E", 0)) * 10000 AS firms_per_10k_population,
        (cd."B17001_001E"::numeric / NULLIF(cd."B01001_001E", 0)) * 100 AS growth_rate_percentage,
        (cd."B25002_003E"::numeric / NULLIF(cd."B25002_002E", 0)) * 100 AS market_saturation_index,
        cd."B15003_001E" AS total_education_population,
        cd."B15003_022E" AS bachelors_degree_holders,
        cd."B15003_023E" AS masters_degree_holders,
        cd."B15003_025E" AS doctorate_degree_holders,
        cd."B17001_001E" AS avg_accountant_payroll,
        (cd."B17001_002E"::numeric / NULLIF(cd."B17001_001E", 0)) AS public_to_private_ratio,
        cd."B08303_001E" AS avg_commute_time,
        nr.commute_rank,
        nr.poverty_rate,
        nr.poverty_rank,
        nr.vacancy_rate,
        nr.vacancy_rank,
        nr.income_rank,
        nr.population_rank,
        (SELECT jsonb_agg(f) FROM (SELECT company_name, employee_count, follower_count, follower_ratio FROM sold_firms_data WHERE county_name = p_county_name AND state_fp = p_state_fp LIMIT 5) f) AS top_firms,
        (SELECT AVG(median_household_income) FROM county_data WHERE "STATEFP" = p_state_fp) AS state_avg_income,
        (SELECT jsonb_agg(c) FROM (SELECT county_name, population, median_income FROM adjacent_counties WHERE state_fp = p_state_fp) c) AS adjacent_counties
    FROM county_data cd
    JOIN national_ranks nr ON cd."COUNTYNAME" = nr."COUNTYNAME" AND cd."STATEFP" = nr."STATEFP"
    WHERE cd."COUNTYNAME" = p_county_name AND cd."STATEFP" = p_state_fp;
END;
$function$;
