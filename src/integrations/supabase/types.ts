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
          longitude: number | null
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
          longitude?: number | null
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
          longitude?: number | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
