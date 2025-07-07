import { GA4Client } from '../utils/ga4';
import { OutputFormatter, OutputFormat } from '../utils/formatter';

export interface EventsOptions {
  property: string;
  startDate?: string;
  endDate?: string;
  format?: OutputFormat;
  output?: string;
  limit?: number;
}

export class EventsCommand {
  private client: GA4Client;

  constructor() {
    this.client = new GA4Client();
  }

  async execute(options: EventsOptions): Promise<void> {
    try {
      console.log('Initializing GA4 client...');
      await this.client.initialize();

      // Set default date range if not provided
      const endDate = options.endDate || new Date().toISOString().split('T')[0];
      const startDate = options.startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      console.log(`Fetching top events for property ${options.property}...`);
      console.log(`Date range: ${startDate} to ${endDate}`);

      const result = await this.client.getTopEvents(
        options.property,
        { startDate, endDate },
        options.limit || 20
      );

      const format = options.format || 'table';
      const output = OutputFormatter.format(result, format);

      if (options.output) {
        OutputFormatter.saveToFile(output, options.output);
      } else {
        console.log('\n' + output);
      }

      console.log(`\nEvents report completed. Total events: ${result.rowCount}`);
    } catch (error) {
      console.error('Error fetching events:', error);
      process.exit(1);
    }
  }
}
