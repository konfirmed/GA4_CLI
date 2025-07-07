import { GA4Client } from '../utils/ga4';
import { OutputFormatter, OutputFormat } from '../utils/formatter';

export interface ReportOptions {
  property: string;
  metrics: string[];
  dimensions?: string[];
  startDate?: string;
  endDate?: string;
  format?: OutputFormat;
  output?: string;
  limit?: number;
}

export class ReportCommand {
  private client: GA4Client;

  constructor() {
    this.client = new GA4Client();
  }

  async execute(options: ReportOptions): Promise<void> {
    try {
      console.log('🚀 GA4 CLI Report');
      console.log('==========================================');
      console.log('Initializing GA4 client...');
      await this.client.initialize();

      // Set default date range if not provided
      const endDate = options.endDate || new Date().toISOString().split('T')[0];
      const startDate = options.startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      console.log(`📊 Property: ${options.property}`);
      console.log(`📅 Date range: ${startDate} to ${endDate}`);
      console.log(`📈 Metrics: ${options.metrics.join(', ')}`);
      if (options.dimensions) {
        console.log(`📋 Dimensions: ${options.dimensions.join(', ')}`);
      }
      console.log('==========================================\n');

      console.log('⏳ Fetching data...');
      const result = await this.client.runReport({
        propertyId: options.property,
        metrics: options.metrics,
        dimensions: options.dimensions,
        dateRanges: [{ startDate, endDate }],
        limit: options.limit || 100,
      });

      const format = options.format || 'table';
      const output = OutputFormatter.format(result, format);

      if (options.output) {
        OutputFormatter.saveToFile(output, options.output);
      } else {
        console.log(output);
      }

      console.log(`\n✅ Report completed successfully!`);
      console.log(`📊 Total rows: ${result.rowCount}`);
      if (options.output) {
        console.log(`💾 Saved to: ${options.output}`);
      }
    } catch (error) {
      console.error('❌ Error running report:', error);
      process.exit(1);
    }
  }
}
