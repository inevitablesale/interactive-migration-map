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
    rent_rank integer,
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
            RANK() OVER (ORDER BY cd."B01001_001E" DESC)::integer as population_rank,
            RANK() OVER (ORDER BY cd."B25064_001E" ASC)::integer as rent_rank
        FROM county_data cd
        WHERE cd."B08303_001E" IS NOT NULL
    )
    SELECT 
        cd."B01001_001E"::integer AS total_population,
        cd."B19013_001E"::integer AS median_household_income,
        cd."B25064_001E"::integer AS median_gross_rent,
        cd."B25077_001E"::integer AS median_home_value,
        cd."B23025_004E"::integer AS employed_population,
        cd."C24060_004E"::integer AS private_sector_accountants,
        cd."C24060_007E"::integer AS public_sector_accountants,
        ROUND((cd."ESTAB"::NUMERIC / NULLIF(cd."B01001_001E", 0) * 10000), 2) AS firms_per_10k_population,
        ROUND(((cd."MOVEDIN2022" - cd."MOVEDIN2021")::NUMERIC / NULLIF(cd."MOVEDIN2021", 0) * 100), 2) AS growth_rate_percentage,
        ROUND(((cd."C24060_004E" + cd."C24060_007E")::NUMERIC / NULLIF(cd."B01001_001E", 0)), 4) AS market_saturation_index,
        cd."B15003_001E"::integer AS total_education_population,
        cd."B15003_022E"::integer AS bachelors_degree_holders,
        cd."B15003_023E"::integer AS masters_degree_holders,
        cd."B15003_025E"::integer AS doctorate_degree_holders,
        ROUND(cd."PAYANN"::NUMERIC / NULLIF(cd."EMP", 0), 2) AS avg_accountant_payroll,
        ROUND((cd."C24060_007E"::NUMERIC / NULLIF(cd."C24060_004E", 0)), 2) AS public_to_private_ratio,
        ROUND((cd."B08303_001E"::numeric / (12 * 20)), 1) AS avg_commute_time,
        nr.commute_rank::integer,
        ROUND((cd."B17001_002E"::NUMERIC / NULLIF(cd."B17001_001E", 0) * 100), 2) AS poverty_rate,
        nr.poverty_rank::integer,
        ROUND((cd."B25002_003E"::NUMERIC / NULLIF(cd."B25002_002E", 0) * 100), 2) AS vacancy_rate,
        nr.vacancy_rank::integer,
        nr.income_rank::integer,
        nr.population_rank::integer,
        nr.rent_rank::integer,
        (
            SELECT jsonb_agg(firm_data)
            FROM (
                SELECT 
                    cf."Company Name" as company_name,
                    cf."employeeCount" as employee_count,
                    cf."followerCount" as follower_count,
                    ROUND((cf."followerCount"::NUMERIC / NULLIF(cf."employeeCount", 0)), 2) as follower_ratio
                FROM canary_firms_data cf
                WHERE cf."COUNTYFP"::text = cd."COUNTYFP"
                AND cf."STATEFP"::text = cd."STATEFP"
                ORDER BY cf."employeeCount" DESC
                LIMIT 5
            ) firm_data
        ) as top_firms,
        (
            SELECT ROUND(AVG(sd."B19013_001E")::NUMERIC, 2)
            FROM state_data sd
            WHERE sd."STATEFP" = p_state_fp
        ) as state_avg_income,
        (
            SELECT jsonb_agg(adjacent_data)
            FROM (
                SELECT 
                    cd2."COUNTYNAME" as county_name,
                    cd2."B01001_001E" as population,
                    cd2."B19013_001E" as median_income
                FROM county_data cd2
                WHERE cd2."STATEFP" = p_state_fp
                AND cd2."COUNTYNAME" != p_county_name
                ORDER BY cd2."B01001_001E" DESC
                LIMIT 3
            ) adjacent_data
        ) as adjacent_counties
    FROM county_data cd
    LEFT JOIN national_ranks nr ON cd."COUNTYNAME" = nr."COUNTYNAME" AND cd."STATEFP" = nr."STATEFP"
    WHERE cd."COUNTYNAME" = p_county_name
    AND cd."STATEFP" = p_state_fp;
END;
$function$;