import { google } from 'googleapis';
import { GA4Auth } from './auth';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface ReportParams {
  propertyId: string;
  dimensions?: string[];
  metrics: string[];
  dateRanges: DateRange[];
  limit?: number;
  offset?: number;
}

export interface ReportRow {
  dimensions: string[];
  metrics: string[];
}

export interface ReportResult {
  rows: ReportRow[];
  dimensionHeaders: string[];
  metricHeaders: string[];
  rowCount: number;
}

export class GA4Client {
  private client: any;
  private auth: GA4Auth;

  constructor() {
    this.auth = new GA4Auth();
  }

  /**
   * Initialize the client with authentication
   */
  async initialize(): Promise<void> {
    const authClient = await this.auth.authenticate();
    
    // Use googleapis analyticsdata (GA4 API)
    this.client = google.analyticsdata({
      version: 'v1beta',
      auth: authClient,
    });
  }

  /**
   * Run a report with the given parameters
   */
  async runReport(params: ReportParams): Promise<ReportResult> {
    if (!this.client) {
      throw new Error('Client not initialized. Call initialize() first.');
    }

    const request = {
      property: `properties/${params.propertyId}`,
      dateRanges: params.dateRanges,
      dimensions: params.dimensions?.map(name => ({ name })),
      metrics: params.metrics.map(name => ({ name })),
      limit: params.limit || 100,
      offset: params.offset || 0,
    };

    try {
      const response = await this.client.properties.runReport({
        property: `properties/${params.propertyId}`,
        requestBody: request,
      });
      
      const data = response.data;
      
      return {
        rows: data.rows?.map((row: any) => ({
          dimensions: row.dimensionValues?.map((dv: any) => dv.value || '') || [],
          metrics: row.metricValues?.map((mv: any) => mv.value || '') || [],
        })) || [],
        dimensionHeaders: data.dimensionHeaders?.map((dh: any) => dh.name || '') || [],
        metricHeaders: data.metricHeaders?.map((mh: any) => mh.name || '') || [],
        rowCount: data.rowCount || 0,
      };
    } catch (error) {
      throw new Error(`Failed to run report: ${error}`);
    }
  }

  /**
   * Get top pages report
   */
  async getTopPages(propertyId: string, dateRange: DateRange, limit: number = 10): Promise<ReportResult> {
    return this.runReport({
      propertyId,
      dimensions: ['pagePath', 'pageTitle'],
      metrics: ['screenPageViews', 'sessions'],
      dateRanges: [dateRange],
      limit,
    });
  }

  /**
   * Get top events report
   */
  async getTopEvents(propertyId: string, dateRange: DateRange, limit: number = 10): Promise<ReportResult> {
    return this.runReport({
      propertyId,
      dimensions: ['eventName'],
      metrics: ['eventCount'],
      dateRanges: [dateRange],
      limit,
    });
  }

  /**
   * Get users and sessions by country
   */
  async getUsersByCountry(propertyId: string, dateRange: DateRange, limit: number = 10): Promise<ReportResult> {
    return this.runReport({
      propertyId,
      dimensions: ['country'],
      metrics: ['users', 'sessions'],
      dateRanges: [dateRange],
      limit,
    });
  }

  /**
   * Compare two date ranges
   */
  async compareReports(
    propertyId: string,
    currentRange: DateRange,
    previousRange: DateRange,
    dimensions: string[],
    metrics: string[]
  ): Promise<{
    current: ReportResult;
    previous: ReportResult;
  }> {
    const [current, previous] = await Promise.all([
      this.runReport({
        propertyId,
        dimensions,
        metrics,
        dateRanges: [currentRange],
      }),
      this.runReport({
        propertyId,
        dimensions,
        metrics,
        dateRanges: [previousRange],
      }),
    ]);

    return { current, previous };
  }

  /**
   * Get available dimensions and metrics (for reference)
   */
  getAvailableDimensions(): string[] {
    return [
      'country',
      'region',
      'city',
      'pagePath',
      'pageTitle',
      'eventName',
      'source',
      'medium',
      'campaign',
      'deviceCategory',
      'operatingSystem',
      'browser',
      'date',
      'hour',
      'minute',
    ];
  }

  getAvailableMetrics(): string[] {
    return [
      'users',
      'sessions',
      'screenPageViews',
      'eventCount',
      'bounceRate',
      'sessionDuration',
      'engagementRate',
      'conversions',
      'totalRevenue',
    ];
  }
}
