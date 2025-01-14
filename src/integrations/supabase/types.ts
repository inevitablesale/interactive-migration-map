export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alerts: {
        Row: {
          created_at: string | null
          employee_count_max: number | null
          employee_count_min: number | null
          frequency: string
          id: string
          is_active: boolean | null
          region: string | null
          specialties: string[] | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          employee_count_max?: number | null
          employee_count_min?: number | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          region?: string | null
          specialties?: string[] | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          employee_count_max?: number | null
          employee_count_min?: number | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          region?: string | null
          specialties?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      buyer_profiles: {
        Row: {
          acquisition_purpose: string | null
          buyer_name: string
          contact_email: string
          contact_phone: string | null
          created_at: string | null
          employee_count_max: number | null
          employee_count_min: number | null
          engagement_frequency: string | null
          growth_priorities: string[] | null
          id: string
          preferred_communication: string | null
          preferred_insights: string[] | null
          price_max: number | null
          price_min: number | null
          retention_risk: string | null
          revenue_max: number | null
          revenue_min: number | null
          service_lines: string[] | null
          subscription_tier: string
          target_geography: string[]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          acquisition_purpose?: string | null
          buyer_name: string
          contact_email: string
          contact_phone?: string | null
          created_at?: string | null
          employee_count_max?: number | null
          employee_count_min?: number | null
          engagement_frequency?: string | null
          growth_priorities?: string[] | null
          id?: string
          preferred_communication?: string | null
          preferred_insights?: string[] | null
          price_max?: number | null
          price_min?: number | null
          retention_risk?: string | null
          revenue_max?: number | null
          revenue_min?: number | null
          service_lines?: string[] | null
          subscription_tier?: string
          target_geography: string[]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          acquisition_purpose?: string | null
          buyer_name?: string
          contact_email?: string
          contact_phone?: string | null
          created_at?: string | null
          employee_count_max?: number | null
          employee_count_min?: number | null
          engagement_frequency?: string | null
          growth_priorities?: string[] | null
          id?: string
          preferred_communication?: string | null
          preferred_insights?: string[] | null
          price_max?: number | null
          price_min?: number | null
          retention_risk?: string | null
          revenue_max?: number | null
          revenue_min?: number | null
          service_lines?: string[] | null
          subscription_tier?: string
          target_geography?: string[]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      canary_firms_data: {
        Row: {
          "Block FIPS": string | null
          "Company ID": number
          "Company Name": string | null
          COUNTYFP: number | null
          COUNTYNAME: string | null
          description: string | null
          employeeCount: number | null
          employeeCountRangeHigh: number | null
          employeeCountRangeLow: number | null
          followerCount: number | null
          foundedOn: number | null
          latitude: number | null
          Location: string | null
          logoResolutionResult: string | null
          longitude: number | null
          originalCoverImage: string | null
          PLACEFP: string | null
          PLACENAME: string | null
          PLACENS: string | null
          "Primary Subtitle": string | null
          "Profile URL": string | null
          specialities: string | null
          STATE: string | null
          "State Name": string | null
          STATEFP: number | null
          Summary: string | null
          websiteUrl: string | null
        }
        Insert: {
          "Block FIPS"?: string | null
          "Company ID": number
          "Company Name"?: string | null
          COUNTYFP?: number | null
          COUNTYNAME?: string | null
          description?: string | null
          employeeCount?: number | null
          employeeCountRangeHigh?: number | null
          employeeCountRangeLow?: number | null
          followerCount?: number | null
          foundedOn?: number | null
          latitude?: number | null
          Location?: string | null
          logoResolutionResult?: string | null
          longitude?: number | null
          originalCoverImage?: string | null
          PLACEFP?: string | null
          PLACENAME?: string | null
          PLACENS?: string | null
          "Primary Subtitle"?: string | null
          "Profile URL"?: string | null
          specialities?: string | null
          STATE?: string | null
          "State Name"?: string | null
          STATEFP?: number | null
          Summary?: string | null
          websiteUrl?: string | null
        }
        Update: {
          "Block FIPS"?: string | null
          "Company ID"?: number
          "Company Name"?: string | null
          COUNTYFP?: number | null
          COUNTYNAME?: string | null
          description?: string | null
          employeeCount?: number | null
          employeeCountRangeHigh?: number | null
          employeeCountRangeLow?: number | null
          followerCount?: number | null
          foundedOn?: number | null
          latitude?: number | null
          Location?: string | null
          logoResolutionResult?: string | null
          longitude?: number | null
          originalCoverImage?: string | null
          PLACEFP?: string | null
          PLACENAME?: string | null
          PLACENS?: string | null
          "Primary Subtitle"?: string | null
          "Profile URL"?: string | null
          specialities?: string | null
          STATE?: string | null
          "State Name"?: string | null
          STATEFP?: number | null
          Summary?: string | null
          websiteUrl?: string | null
        }
        Relationships: []
      }
      county_data: {
        Row: {
          B01001_001E: number | null
          B01002_001E: number | null
          B08303_001E: number | null
          B11001_001E: number | null
          B11003_001E: number | null
          B15003_001E: number | null
          B15003_022E: number | null
          B15003_023E: number | null
          B15003_025E: number | null
          B17001_001E: number | null
          B17001_002E: number | null
          B19013_001E: number | null
          B23001_001E: number | null
          B23025_004E: number | null
          B23025_005E: number | null
          B25001_001E: number | null
          B25002_002E: number | null
          B25002_003E: number | null
          B25064_001E: number | null
          B25077_001E: number | null
          C24010_001E: number | null
          C24010_012E: number | null
          C24010_033E: number | null
          C24010_034E: number | null
          C24060_001E: number | null
          C24060_004E: number | null
          C24060_007E: number | null
          COUNTYFP: string | null
          COUNTYNAME: string | null
          EMP: number | null
          ESTAB: number | null
          MOVEDIN2020: number | null
          MOVEDIN2021: number | null
          MOVEDIN2022: number | null
          PAYANN: number | null
          PLACEFP: string | null
          PLACENAME: string | null
          PLACENS: string | null
          STATEFP: string | null
        }
        Insert: {
          B01001_001E?: number | null
          B01002_001E?: number | null
          B08303_001E?: number | null
          B11001_001E?: number | null
          B11003_001E?: number | null
          B15003_001E?: number | null
          B15003_022E?: number | null
          B15003_023E?: number | null
          B15003_025E?: number | null
          B17001_001E?: number | null
          B17001_002E?: number | null
          B19013_001E?: number | null
          B23001_001E?: number | null
          B23025_004E?: number | null
          B23025_005E?: number | null
          B25001_001E?: number | null
          B25002_002E?: number | null
          B25002_003E?: number | null
          B25064_001E?: number | null
          B25077_001E?: number | null
          C24010_001E?: number | null
          C24010_012E?: number | null
          C24010_033E?: number | null
          C24010_034E?: number | null
          C24060_001E?: number | null
          C24060_004E?: number | null
          C24060_007E?: number | null
          COUNTYFP?: string | null
          COUNTYNAME?: string | null
          EMP?: number | null
          ESTAB?: number | null
          MOVEDIN2020?: number | null
          MOVEDIN2021?: number | null
          MOVEDIN2022?: number | null
          PAYANN?: number | null
          PLACEFP?: string | null
          PLACENAME?: string | null
          PLACENS?: string | null
          STATEFP?: string | null
        }
        Update: {
          B01001_001E?: number | null
          B01002_001E?: number | null
          B08303_001E?: number | null
          B11001_001E?: number | null
          B11003_001E?: number | null
          B15003_001E?: number | null
          B15003_022E?: number | null
          B15003_023E?: number | null
          B15003_025E?: number | null
          B17001_001E?: number | null
          B17001_002E?: number | null
          B19013_001E?: number | null
          B23001_001E?: number | null
          B23025_004E?: number | null
          B23025_005E?: number | null
          B25001_001E?: number | null
          B25002_002E?: number | null
          B25002_003E?: number | null
          B25064_001E?: number | null
          B25077_001E?: number | null
          C24010_001E?: number | null
          C24010_012E?: number | null
          C24010_033E?: number | null
          C24010_034E?: number | null
          C24060_001E?: number | null
          C24060_004E?: number | null
          C24060_007E?: number | null
          COUNTYFP?: string | null
          COUNTYNAME?: string | null
          EMP?: number | null
          ESTAB?: number | null
          MOVEDIN2020?: number | null
          MOVEDIN2021?: number | null
          MOVEDIN2022?: number | null
          PAYANN?: number | null
          PLACEFP?: string | null
          PLACENAME?: string | null
          PLACENS?: string | null
          STATEFP?: string | null
        }
        Relationships: []
      }
      msa_county_reference: {
        Row: {
          county_name: string
          fipscty: string
          fipstate: string
          msa: string
          msa_name: string
        }
        Insert: {
          county_name: string
          fipscty: string
          fipstate: string
          msa: string
          msa_name: string
        }
        Update: {
          county_name?: string
          fipscty?: string
          fipstate?: string
          msa?: string
          msa_name?: string
        }
        Relationships: []
      }
      msa_state_crosswalk: {
        Row: {
          county_name: string | null
          msa: string | null
          msa_name: string | null
          state_fips: string | null
        }
        Insert: {
          county_name?: string | null
          msa?: string | null
          msa_name?: string | null
          state_fips?: string | null
        }
        Update: {
          county_name?: string | null
          msa?: string | null
          msa_name?: string | null
          state_fips?: string | null
        }
        Relationships: []
      }
      national_data: {
        Row: {
          B01001_001E: number | null
          B01002_001E: number | null
          B08303_001E: number | null
          B11001_001E: number | null
          B11003_001E: number | null
          B15003_001E: number | null
          B15003_022E: number | null
          B15003_023E: number | null
          B15003_025E: number | null
          B17001_001E: number | null
          B17001_002E: number | null
          B19013_001E: number | null
          B23001_001E: number | null
          B23025_004E: number | null
          B23025_005E: number | null
          B25001_001E: number | null
          B25002_002E: number | null
          B25002_003E: number | null
          B25064_001E: number | null
          B25077_001E: number | null
          C24010_001E: number | null
          C24010_012E: number | null
          C24010_033E: number | null
          C24010_034E: number | null
          C24060_001E: number | null
          C24060_004E: number | null
          C24060_007E: number | null
          EMP: number | null
          ESTAB: number | null
          naics2017: string | null
          PAYANN: number | null
          us: string
        }
        Insert: {
          B01001_001E?: number | null
          B01002_001E?: number | null
          B08303_001E?: number | null
          B11001_001E?: number | null
          B11003_001E?: number | null
          B15003_001E?: number | null
          B15003_022E?: number | null
          B15003_023E?: number | null
          B15003_025E?: number | null
          B17001_001E?: number | null
          B17001_002E?: number | null
          B19013_001E?: number | null
          B23001_001E?: number | null
          B23025_004E?: number | null
          B23025_005E?: number | null
          B25001_001E?: number | null
          B25002_002E?: number | null
          B25002_003E?: number | null
          B25064_001E?: number | null
          B25077_001E?: number | null
          C24010_001E?: number | null
          C24010_012E?: number | null
          C24010_033E?: number | null
          C24010_034E?: number | null
          C24060_001E?: number | null
          C24060_004E?: number | null
          C24060_007E?: number | null
          EMP?: number | null
          ESTAB?: number | null
          naics2017?: string | null
          PAYANN?: number | null
          us: string
        }
        Update: {
          B01001_001E?: number | null
          B01002_001E?: number | null
          B08303_001E?: number | null
          B11001_001E?: number | null
          B11003_001E?: number | null
          B15003_001E?: number | null
          B15003_022E?: number | null
          B15003_023E?: number | null
          B15003_025E?: number | null
          B17001_001E?: number | null
          B17001_002E?: number | null
          B19013_001E?: number | null
          B23001_001E?: number | null
          B23025_004E?: number | null
          B23025_005E?: number | null
          B25001_001E?: number | null
          B25002_002E?: number | null
          B25002_003E?: number | null
          B25064_001E?: number | null
          B25077_001E?: number | null
          C24010_001E?: number | null
          C24010_012E?: number | null
          C24010_033E?: number | null
          C24010_034E?: number | null
          C24060_001E?: number | null
          C24060_004E?: number | null
          C24060_007E?: number | null
          EMP?: number | null
          ESTAB?: number | null
          naics2017?: string | null
          PAYANN?: number | null
          us?: string
        }
        Relationships: []
      }
      region_data: {
        Row: {
          B01001_001E: number | null
          B01002_001E: number | null
          B08303_001E: number | null
          B11001_001E: number | null
          B11003_001E: number | null
          B15003_001E: number | null
          B15003_022E: number | null
          B15003_023E: number | null
          B15003_025E: number | null
          B17001_001E: number | null
          B17001_002E: number | null
          B19013_001E: number | null
          B23001_001E: number | null
          B23025_004E: number | null
          B23025_005E: number | null
          B25001_001E: number | null
          B25002_002E: number | null
          B25002_003E: number | null
          B25064_001E: number | null
          B25077_001E: number | null
          C24010_001E: number | null
          C24010_012E: number | null
          C24010_033E: number | null
          C24010_034E: number | null
          C24060_001E: number | null
          C24060_004E: number | null
          C24060_007E: number | null
          EMP: number | null
          ESTAB: number | null
          msa: string | null
          PAYANN: number | null
        }
        Insert: {
          B01001_001E?: number | null
          B01002_001E?: number | null
          B08303_001E?: number | null
          B11001_001E?: number | null
          B11003_001E?: number | null
          B15003_001E?: number | null
          B15003_022E?: number | null
          B15003_023E?: number | null
          B15003_025E?: number | null
          B17001_001E?: number | null
          B17001_002E?: number | null
          B19013_001E?: number | null
          B23001_001E?: number | null
          B23025_004E?: number | null
          B23025_005E?: number | null
          B25001_001E?: number | null
          B25002_002E?: number | null
          B25002_003E?: number | null
          B25064_001E?: number | null
          B25077_001E?: number | null
          C24010_001E?: number | null
          C24010_012E?: number | null
          C24010_033E?: number | null
          C24010_034E?: number | null
          C24060_001E?: number | null
          C24060_004E?: number | null
          C24060_007E?: number | null
          EMP?: number | null
          ESTAB?: number | null
          msa?: string | null
          PAYANN?: number | null
        }
        Update: {
          B01001_001E?: number | null
          B01002_001E?: number | null
          B08303_001E?: number | null
          B11001_001E?: number | null
          B11003_001E?: number | null
          B15003_001E?: number | null
          B15003_022E?: number | null
          B15003_023E?: number | null
          B15003_025E?: number | null
          B17001_001E?: number | null
          B17001_002E?: number | null
          B19013_001E?: number | null
          B23001_001E?: number | null
          B23025_004E?: number | null
          B23025_005E?: number | null
          B25001_001E?: number | null
          B25002_002E?: number | null
          B25002_003E?: number | null
          B25064_001E?: number | null
          B25077_001E?: number | null
          C24010_001E?: number | null
          C24010_012E?: number | null
          C24010_033E?: number | null
          C24010_034E?: number | null
          C24060_001E?: number | null
          C24060_004E?: number | null
          C24060_007E?: number | null
          EMP?: number | null
          ESTAB?: number | null
          msa?: string | null
          PAYANN?: number | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          chart_config: Json | null
          content: Json
          created_at: string | null
          description: string | null
          id: string
          insights_query: string
          title: string
          updated_at: string | null
          user_id: string | null
          visibility: Database["public"]["Enums"]["report_visibility"] | null
        }
        Insert: {
          chart_config?: Json | null
          content: Json
          created_at?: string | null
          description?: string | null
          id?: string
          insights_query: string
          title: string
          updated_at?: string | null
          user_id?: string | null
          visibility?: Database["public"]["Enums"]["report_visibility"] | null
        }
        Update: {
          chart_config?: Json | null
          content?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          insights_query?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
          visibility?: Database["public"]["Enums"]["report_visibility"] | null
        }
        Relationships: []
      }
      sold_firms_data: {
        Row: {
          annual_revenue: number | null
          asking_price: number | null
          City: string | null
          clientele: string | null
          County: number | null
          employee_count: number | null
          FIPS: number | null
          Latitude: number | null
          Longitude: number | null
          MSA: number | null
          service_lines: string | null
          State: string | null
        }
        Insert: {
          annual_revenue?: number | null
          asking_price?: number | null
          City?: string | null
          clientele?: string | null
          County?: number | null
          employee_count?: number | null
          FIPS?: number | null
          Latitude?: number | null
          Longitude?: number | null
          MSA?: number | null
          service_lines?: string | null
          State?: string | null
        }
        Update: {
          annual_revenue?: number | null
          asking_price?: number | null
          City?: string | null
          clientele?: string | null
          County?: number | null
          employee_count?: number | null
          FIPS?: number | null
          Latitude?: number | null
          Longitude?: number | null
          MSA?: number | null
          service_lines?: string | null
          State?: string | null
        }
        Relationships: []
      }
      state_data: {
        Row: {
          B01001_001E: number | null
          B01002_001E: number | null
          B08303_001E: number | null
          B11001_001E: number | null
          B11003_001E: number | null
          B15003_001E: number | null
          B15003_022E: number | null
          B15003_023E: number | null
          B15003_025E: number | null
          B17001_001E: number | null
          B17001_002E: number | null
          B19013_001E: number | null
          B23001_001E: number | null
          B23025_004E: number | null
          B23025_005E: number | null
          B25001_001E: number | null
          B25002_002E: number | null
          B25002_003E: number | null
          B25064_001E: number | null
          B25077_001E: number | null
          C24010_001E: number | null
          C24010_012E: number | null
          C24010_033E: number | null
          C24010_034E: number | null
          C24060_001E: number | null
          C24060_004E: number | null
          C24060_007E: number | null
          EMP: number | null
          ESTAB: number | null
          PAYANN: number | null
          STATEFP: string
        }
        Insert: {
          B01001_001E?: number | null
          B01002_001E?: number | null
          B08303_001E?: number | null
          B11001_001E?: number | null
          B11003_001E?: number | null
          B15003_001E?: number | null
          B15003_022E?: number | null
          B15003_023E?: number | null
          B15003_025E?: number | null
          B17001_001E?: number | null
          B17001_002E?: number | null
          B19013_001E?: number | null
          B23001_001E?: number | null
          B23025_004E?: number | null
          B23025_005E?: number | null
          B25001_001E?: number | null
          B25002_002E?: number | null
          B25002_003E?: number | null
          B25064_001E?: number | null
          B25077_001E?: number | null
          C24010_001E?: number | null
          C24010_012E?: number | null
          C24010_033E?: number | null
          C24010_034E?: number | null
          C24060_001E?: number | null
          C24060_004E?: number | null
          C24060_007E?: number | null
          EMP?: number | null
          ESTAB?: number | null
          PAYANN?: number | null
          STATEFP: string
        }
        Update: {
          B01001_001E?: number | null
          B01002_001E?: number | null
          B08303_001E?: number | null
          B11001_001E?: number | null
          B11003_001E?: number | null
          B15003_001E?: number | null
          B15003_022E?: number | null
          B15003_023E?: number | null
          B15003_025E?: number | null
          B17001_001E?: number | null
          B17001_002E?: number | null
          B19013_001E?: number | null
          B23001_001E?: number | null
          B23025_004E?: number | null
          B23025_005E?: number | null
          B25001_001E?: number | null
          B25002_002E?: number | null
          B25002_003E?: number | null
          B25064_001E?: number | null
          B25077_001E?: number | null
          C24010_001E?: number | null
          C24010_012E?: number | null
          C24010_033E?: number | null
          C24010_034E?: number | null
          C24060_001E?: number | null
          C24060_004E?: number | null
          C24060_007E?: number | null
          EMP?: number | null
          ESTAB?: number | null
          PAYANN?: number | null
          STATEFP?: string
        }
        Relationships: []
      }
      state_fips_codes: {
        Row: {
          fips_code: string | null
          postal_abbr: string | null
          state: string | null
        }
        Insert: {
          fips_code?: string | null
          postal_abbr?: string | null
          state?: string | null
        }
        Update: {
          fips_code?: string | null
          postal_abbr?: string | null
          state?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      state_density_metrics: {
        Row: {
          B01001_001E: number | null
          density: number | null
          ESTAB: number | null
          STATEFP: string | null
        }
        Relationships: []
      }
      state_mappings: {
        Row: {
          state_name: string | null
          STATEFP: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_competitive_analysis: {
        Args: Record<PropertyKey, never>
        Returns: {
          statefp: string
          total_firms: number
          avg_employee_count: number
          market_concentration: number
          competition_level: string
        }[]
      }
      get_county_rankings: {
        Args: Record<PropertyKey, never>
        Returns: {
          statefp: string
          countyfp: string
          countyname: string
          total_firms: number
          population: number
          firm_density: number
          growth_rate: number
          density_rank: number
          growth_rank: number
          state_density_avg: number
          state_growth_avg: number
        }[]
      }
      get_enhanced_market_scores: {
        Args: Record<PropertyKey, never>
        Returns: {
          statefp: string
          population_score: number
          economic_score: number
          business_density_score: number
          employment_score: number
          market_potential_score: number
          total_score: number
        }[]
      }
      get_firm_density_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          region: string
          total_firms: number
          population: number
          firm_density: number
        }[]
      }
      get_growth_strategy_analysis: {
        Args: Record<PropertyKey, never>
        Returns: {
          msa: string
          msa_name: string
          total_firms: number
          avg_growth_rate: number
          recent_migration: number
          market_saturation: number
        }[]
      }
      get_growth_trend_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          region: string
          firms_current_year: number
          historical_growth_rate: number
          firms_previous_year: number
          projected_firms: number
        }[]
      }
      get_market_entry_analysis: {
        Args: Record<PropertyKey, never>
        Returns: {
          statefp: string
          total_firms: number
          firm_density: number
          market_saturation: number
          avg_growth_rate: number
        }[]
      }
      get_market_opportunities: {
        Args: Record<PropertyKey, never>
        Returns: {
          statefp: string
          countyfp: string
          countyname: string
          migration_score: number
          business_density_score: number
          service_coverage_score: number
        }[]
      }
      get_market_trends: {
        Args: Record<PropertyKey, never>
        Returns: {
          statefp: string
          year_2020_moves: number
          year_2021_moves: number
          year_2022_moves: number
          growth_rate: number
          trend_direction: string
        }[]
      }
      get_msa_rankings: {
        Args: Record<PropertyKey, never>
        Returns: {
          msa: string
          msa_name: string
          total_firms: number
          population: number
          firm_density: number
          growth_rate: number
          density_rank: number
          growth_rank: number
          national_density_avg: number
          national_growth_avg: number
          regional_specialization: string
          specialization_score: number
          avg_payroll_per_firm: number
          education_rate: number
          migration_trend: number
          median_income: number
        }[]
      }
      get_opportunity_analysis: {
        Args: Record<PropertyKey, never>
        Returns: {
          company_name: string
          location: string
          employee_count: number
          revenue_per_employee: number
          growth_rate: number
          market_saturation: number
        }[]
      }
      get_service_distribution: {
        Args: Record<PropertyKey, never>
        Returns: {
          statefp: string
          specialities: string
          specialty_count: number
          specialty_percentage: number
        }[]
      }
      get_state_rankings: {
        Args: Record<PropertyKey, never>
        Returns: {
          statefp: string
          total_firms: number
          population: number
          firm_density: number
          growth_rate: number
          density_rank: number
          growth_rank: number
          national_density_avg: number
          national_growth_avg: number
          market_saturation: number
          market_saturation_rank: number
          avg_payroll_per_firm: number
          education_rate: number
        }[]
      }
      get_weighted_market_opportunities: {
        Args: Record<PropertyKey, never>
        Returns: {
          statefp: string
          countyfp: string
          countyname: string
          state_name: string
          total_score: number
          migration_score: number
          economic_score: number
          market_score: number
          details: Json
        }[]
      }
      refresh_state_density_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_state_mappings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      report_visibility: "public" | "private"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
