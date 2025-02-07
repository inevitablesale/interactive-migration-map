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
      admin_users: {
        Row: {
          created_at: string
          is_admin: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          is_admin?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          is_admin?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      alerts: {
        Row: {
          additional_details: string | null
          buyer_type: string | null
          created_at: string | null
          deal_preferences: string[] | null
          id: string
          practice_size: string | null
          preferred_state: string | null
          remote_preference: string | null
          services: string[] | null
          timeline: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          additional_details?: string | null
          buyer_type?: string | null
          created_at?: string | null
          deal_preferences?: string[] | null
          id?: string
          practice_size?: string | null
          preferred_state?: string | null
          remote_preference?: string | null
          services?: string[] | null
          timeline?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          additional_details?: string | null
          buyer_type?: string | null
          created_at?: string | null
          deal_preferences?: string[] | null
          id?: string
          practice_size?: string | null
          preferred_state?: string | null
          remote_preference?: string | null
          services?: string[] | null
          timeline?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      canary_firm_interests: {
        Row: {
          company_id: number | null
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          company_id?: number | null
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: number | null
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "canary_firm_interests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "canary_firms_data"
            referencedColumns: ["Company ID"]
          },
        ]
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
          notes: string | null
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
          status: string | null
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
          notes?: string | null
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
          status?: string | null
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
          notes?: string | null
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
          status?: string | null
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
      deal_sourcing_forms: {
        Row: {
          additional_details: string | null
          buyer_type: string | null
          created_at: string
          deal_preferences: string[] | null
          id: string
          practice_size: string | null
          preferred_state: string | null
          remote_preference: string | null
          services: string[] | null
          timeline: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          additional_details?: string | null
          buyer_type?: string | null
          created_at?: string
          deal_preferences?: string[] | null
          id?: string
          practice_size?: string | null
          preferred_state?: string | null
          remote_preference?: string | null
          services?: string[] | null
          timeline?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          additional_details?: string | null
          buyer_type?: string | null
          created_at?: string
          deal_preferences?: string[] | null
          id?: string
          practice_size?: string | null
          preferred_state?: string | null
          remote_preference?: string | null
          services?: string[] | null
          timeline?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      firm_generated_text: {
        Row: {
          badges: string | null
          callouts: string | null
          company_id: number
          generated_summary: string | null
          teaser: string | null
          title: string | null
        }
        Insert: {
          badges?: string | null
          callouts?: string | null
          company_id: number
          generated_summary?: string | null
          teaser?: string | null
          title?: string | null
        }
        Update: {
          badges?: string | null
          callouts?: string | null
          company_id?: number
          generated_summary?: string | null
          teaser?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "firm_generated_text_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "canary_firms_data"
            referencedColumns: ["Company ID"]
          },
        ]
      }
      msa_county_reference: {
        Row: {
          COUNTYNAME: string
          fipscty: string
          MSA: string
          msa_name: string
          STATEFP: string
        }
        Insert: {
          COUNTYNAME: string
          fipscty: string
          MSA: string
          msa_name: string
          STATEFP: string
        }
        Update: {
          COUNTYNAME?: string
          fipscty?: string
          MSA?: string
          msa_name?: string
          STATEFP?: string
        }
        Relationships: []
      }
      msa_state_crosswalk: {
        Row: {
          COUNTYNAME: string | null
          MSA: string | null
          msa_name: string | null
          STATEFP: string | null
        }
        Insert: {
          COUNTYNAME?: string | null
          MSA?: string | null
          msa_name?: string | null
          STATEFP?: string | null
        }
        Update: {
          COUNTYNAME?: string | null
          MSA?: string | null
          msa_name?: string | null
          STATEFP?: string | null
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
      practice_buyer_pool: {
        Row: {
          id: string
          is_anonymous: boolean | null
          joined_at: string | null
          notes: string | null
          practice_id: string | null
          rating: number | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          is_anonymous?: boolean | null
          joined_at?: string | null
          notes?: string | null
          practice_id?: string | null
          rating?: number | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          is_anonymous?: boolean | null
          joined_at?: string | null
          notes?: string | null
          practice_id?: string | null
          rating?: number | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "practice_buyer_pool_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "tracked_practices"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          practice_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          practice_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          practice_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "practice_notes_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "tracked_practices"
            referencedColumns: ["id"]
          },
        ]
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
      scenario_models: {
        Row: {
          base_data: Json
          created_at: string | null
          description: string | null
          id: string
          name: string
          projected_results: Json
          scenario_parameters: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          base_data: Json
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          projected_results: Json
          scenario_parameters: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          base_data?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          projected_results?: Json
          scenario_parameters?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sold_firms_data: {
        Row: {
          annual_revenue: number | null
          asking_price: number | null
          City: string | null
          clientele: string | null
          COUNTYFP: number | null
          employee_count: number | null
          Latitude: number | null
          Longitude: number | null
          MSA: number | null
          service_lines: string | null
          State: string | null
          STATEFP: number | null
        }
        Insert: {
          annual_revenue?: number | null
          asking_price?: number | null
          City?: string | null
          clientele?: string | null
          COUNTYFP?: number | null
          employee_count?: number | null
          Latitude?: number | null
          Longitude?: number | null
          MSA?: number | null
          service_lines?: string | null
          State?: string | null
          STATEFP?: number | null
        }
        Update: {
          annual_revenue?: number | null
          asking_price?: number | null
          City?: string | null
          clientele?: string | null
          COUNTYFP?: number | null
          employee_count?: number | null
          Latitude?: number | null
          Longitude?: number | null
          MSA?: number | null
          service_lines?: string | null
          State?: string | null
          STATEFP?: number | null
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
          MOVEDIN2020: number | null
          MOVEDIN2021: number | null
          MOVEDIN2022: number | null
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
          MOVEDIN2020?: number | null
          MOVEDIN2021?: number | null
          MOVEDIN2022?: number | null
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
          MOVEDIN2020?: number | null
          MOVEDIN2021?: number | null
          MOVEDIN2022?: number | null
          PAYANN?: number | null
          STATEFP?: string
        }
        Relationships: []
      }
      state_fips_codes: {
        Row: {
          postal_abbr: string | null
          state: string | null
          STATEFP: string | null
        }
        Insert: {
          postal_abbr?: string | null
          state?: string | null
          STATEFP?: string | null
        }
        Update: {
          postal_abbr?: string | null
          state?: string | null
          STATEFP?: string | null
        }
        Relationships: []
      }
      tracked_practices: {
        Row: {
          acquisition_potential: string | null
          annual_revenue: number | null
          anonymized_details: boolean | null
          created_at: string | null
          employee_count: number | null
          id: string
          industry: string
          is_nda_signed: boolean | null
          last_updated: string | null
          region: string
          seller_response_due: string | null
          service_mix: Json | null
          status: Database["public"]["Enums"]["practice_status"] | null
          user_id: string | null
        }
        Insert: {
          acquisition_potential?: string | null
          annual_revenue?: number | null
          anonymized_details?: boolean | null
          created_at?: string | null
          employee_count?: number | null
          id?: string
          industry: string
          is_nda_signed?: boolean | null
          last_updated?: string | null
          region: string
          seller_response_due?: string | null
          service_mix?: Json | null
          status?: Database["public"]["Enums"]["practice_status"] | null
          user_id?: string | null
        }
        Update: {
          acquisition_potential?: string | null
          annual_revenue?: number | null
          anonymized_details?: boolean | null
          created_at?: string | null
          employee_count?: number | null
          id?: string
          industry?: string
          is_nda_signed?: boolean | null
          last_updated?: string | null
          region?: string
          seller_response_due?: string | null
          service_mix?: Json | null
          status?: Database["public"]["Enums"]["practice_status"] | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_documents: {
        Row: {
          created_at: string | null
          id: string
          nda_signed: boolean | null
          nda_signed_at: string | null
          success_fee_signed: boolean | null
          success_fee_signed_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nda_signed?: boolean | null
          nda_signed_at?: string | null
          success_fee_signed?: boolean | null
          success_fee_signed_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nda_signed?: boolean | null
          nda_signed_at?: string | null
          success_fee_signed?: boolean | null
          success_fee_signed_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      county_rankings: {
        Row: {
          avg_firms_per_10k: number | null
          avg_growth_rate: number | null
          avg_market_saturation: number | null
          bachelors_holders: number | null
          COUNTYFP: string | null
          COUNTYNAME: string | null
          doctorate_holders: number | null
          education_population: number | null
          employed_population: number | null
          firm_density_rank: number | null
          firms_per_10k: number | null
          growth_rank: number | null
          income_rank: number | null
          market_saturation: number | null
          market_saturation_rank: number | null
          masters_holders: number | null
          median_gross_rent: number | null
          median_home_value: number | null
          median_household_income: number | null
          national_firm_density_rank: number | null
          national_growth_rank: number | null
          national_income_rank: number | null
          national_market_saturation_rank: number | null
          national_population_rank: number | null
          national_rent_rank: number | null
          national_vacancy_rank: number | null
          population_growth_rate: number | null
          population_rank: number | null
          private_sector_accountants: number | null
          public_sector_accountants: number | null
          rent_rank: number | null
          state_name: string | null
          STATEFP: string | null
          total_employees: number | null
          total_establishments: number | null
          total_payroll: number | null
          total_population: number | null
          vacancy_rank: number | null
          vacancy_rate: number | null
        }
        Relationships: []
      }
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
      state_rankings: {
        Row: {
          avg_payroll_per_firm: number | null
          density_rank: number | null
          education_rate: number | null
          firm_density: number | null
          growth_rank: number | null
          growth_rate: number | null
          market_saturation: number | null
          market_saturation_rank: number | null
          national_density_avg: number | null
          national_growth_avg: number | null
          population: number | null
          STATEFP: string | null
          total_firms: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_scenario_metrics: {
        Args: {
          base_revenue: number
          growth_rate: number
          market_saturation: number
          competition_level: number
        }
        Returns: {
          projected_revenue: number
          market_opportunity_score: number
          risk_score: number
        }[]
      }
      get_affordable_talent_hubs: {
        Args: Record<PropertyKey, never>
        Returns: {
          county_name: string
          median_rent: number
          accountant_density: number
          vacancy_rate: number
          affordability_score: number
        }[]
      }
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
      get_competitive_market_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          county_name: string
          state: string
          state_fp: string
          county_fp: string
          total_population: number
          total_establishments: number
          establishments_per_1000_population: number
        }[]
      }
      get_comprehensive_growth_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          statefp: string
          countyfp: string
          countyname: string
          population_growth_score: number
          market_opportunity_score: number
          economic_health_score: number
          composite_growth_score: number
          growth_classification: string
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
          national_density_rank: number
          national_growth_rank: number
          state_density_avg: number
          state_growth_avg: number
          market_saturation: number
        }[]
      }
      get_education_age_analysis: {
        Args: Record<PropertyKey, never>
        Returns: {
          county_name: string
          state_fp: string
          median_age: number
          masters_degree_percent: number
          firm_count: number
        }[]
      }
      get_emerging_talent_markets: {
        Args: Record<PropertyKey, never>
        Returns: {
          county_name: string
          state_name: string
          education_rate_percent: number
          total_educated: number
          education_growth_rate: number
          median_age: number
        }[]
      }
      get_employee_rent_analysis: {
        Args: Record<PropertyKey, never>
        Returns: {
          county_name: string
          state_fp: string
          median_gross_rent: number
          total_population: number
          total_employees: number
          employees_per_1k_population: number
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
      get_follower_analysis: {
        Args: Record<PropertyKey, never>
        Returns: {
          company_name: string
          employee_count: number
          follower_count: number
          followers_per_employee: number
        }[]
      }
      get_future_saturation_risk: {
        Args: Record<PropertyKey, never>
        Returns: {
          county_name: string
          state_name: string
          current_firm_density: number
          projected_firm_density: number
          firm_growth_rate: number
          population_growth_rate: number
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
      get_market_growth_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          county_name: string
          state: string
          population_growth: number
          growth_rate_percentage: number
          total_movedin_2022: number
          total_movedin_2021: number
          total_movedin_2020: number
          total_moves: number
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
      get_market_similarity_analysis: {
        Args: {
          p_state_fp?: string
        }
        Returns: {
          region_name: string
          total_sold_firms: number
          avg_deal_size: number
          active_firms_count: number
          market_density: number
          similarity_score: number
          potential_opportunities: number
          projected_success_rate: number
          key_factors: Json
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
      get_merged_county_firm_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          county_name: string
          state_name: string
          state_fp: string
          county_fp: string
          total_population: number
          median_household_income: number
          firms_per_10k: number
          growth_rate_percentage: number
          market_saturation: number
          firm_density_rank: number
          national_density_rank: number
          total_firms: number
          avg_employee_count: number
          avg_follower_count: number
          top_specialties: string[]
          total_education_population: number
          bachelors_holders: number
          masters_holders: number
          doctorate_holders: number
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
      get_top_growth_regions: {
        Args: Record<PropertyKey, never>
        Returns: {
          county_name: string
          state_name: string
          growth_rate: number
          firm_density: number
          total_firms: number
          total_population: number
        }[]
      }
      get_underserved_regions: {
        Args: Record<PropertyKey, never>
        Returns: {
          county_name: string
          state_name: string
          total_establishments: number
          population: number
          firms_per_10k_population: number
          recent_movers: number
          market_status: string
          opportunity_status: string
        }[]
      }
      get_vacancy_analysis: {
        Args: Record<PropertyKey, never>
        Returns: {
          county_name: string
          state_fp: string
          vacant_to_occupied_ratio: number
          firm_count: number
          firms_per_10k_population: number
        }[]
      }
      get_value_metrics: {
        Args: Record<PropertyKey, never>
        Returns: {
          county_name: string
          state_name: string
          median_income: number
          median_home_value: number
          total_firms: number
          avg_revenue: number
          growth_potential: number
          state_rank: number
          national_rank: number
        }[]
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      refresh_state_density_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_state_mappings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_state_rankings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      practice_status:
        | "pending_response"
        | "owner_engaged"
        | "negotiation"
        | "closed"
        | "withdrawn"
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
