import { BigQuery } from '@google-cloud/bigquery';

let bigQueryClient: BigQuery | null = null;

export const initializeBigQuery = async () => {
  if (!bigQueryClient) {
    try {
      const { data: { secret: credentials }, error } = await supabase
        .from('secrets')
        .select('secret')
        .eq('name', 'GOOGLE_CLOUD_CREDENTIALS')
        .single();

      if (error) throw error;

      bigQueryClient = new BigQuery({
        credentials: JSON.parse(credentials),
        projectId: JSON.parse(credentials).project_id
      });
    } catch (error) {
      console.error('Error initializing BigQuery:', error);
      throw error;
    }
  }
  return bigQueryClient;
};

export const runQuery = async (query: string) => {
  const client = await initializeBigQuery();
  try {
    const [rows] = await client.query({ query });
    return rows;
  } catch (error) {
    console.error('Error running BigQuery query:', error);
    throw error;
  }
};