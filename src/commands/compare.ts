import { GA4Client } from '../utils/ga4';
import { OutputFormatter, OutputFormat } from '../utils/formatter';

export interface CompareOptions {
  property: string;
  metrics: string[];
  dimensions?: string[];
  currentStart?: string;
  currentEnd?: string;
  previousStart?: string;
  previousEnd?: string;
  format?: OutputFormat;
  output?: string;
  limit?: number;
}

export class CompareCommand {
  private client: GA4Client;

  constructor() {
    this.client = new GA4Client();
  }

  async execute(options: CompareOptions): Promise<void> {
    try {
      console.log('Initializing GA4 client...');
      await this.client.initialize();

      // Calculate date ranges
      const dateRanges = this.calculateDateRanges(options);

      console.log(`Comparing data for property ${options.property}...`);
      console.log(`Current period: ${dateRanges.current.startDate} to ${dateRanges.current.endDate}`);
      console.log(`Previous period: ${dateRanges.previous.startDate} to ${dateRanges.previous.endDate}`);
      console.log(`Metrics: ${options.metrics.join(', ')}`);
      if (options.dimensions) {
        console.log(`Dimensions: ${options.dimensions.join(', ')}`);
      }

      const result = await this.client.compareReports(
        options.property,
        dateRanges.current,
        dateRanges.previous,
        options.dimensions || [],
        options.metrics
      );

      const format = options.format || 'table';
      const output = OutputFormatter.formatComparison(
        result.current,
        result.previous,
        format,
        'Current Period',
        'Previous Period'
      );

      if (options.output) {
        OutputFormatter.saveToFile(output, options.output);
      } else {
        console.log('\n' + output);
      }

      console.log(`\nComparison completed.`);
      console.log(`Current period rows: ${result.current.rowCount}`);
      console.log(`Previous period rows: ${result.previous.rowCount}`);
    } catch (error) {
      console.error('Error running comparison:', error);
      process.exit(1);
    }
  }

  private calculateDateRanges(options: CompareOptions): {
    current: { startDate: string; endDate: string };
    previous: { startDate: string; endDate: string };
  } {
    if (options.currentStart && options.currentEnd && options.previousStart && options.previousEnd) {
      return {
        current: { startDate: options.currentStart, endDate: options.currentEnd },
        previous: { startDate: options.previousStart, endDate: options.previousEnd }
      };
    }

    // Default to this week vs last week
    const today = new Date();
    const currentEnd = new Date(today);
    const currentStart = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
    const previousEnd = new Date(currentStart.getTime() - 24 * 60 * 60 * 1000);
    const previousStart = new Date(previousEnd.getTime() - 6 * 24 * 60 * 60 * 1000);

    return {
      current: {
        startDate: currentStart.toISOString().split('T')[0],
        endDate: currentEnd.toISOString().split('T')[0]
      },
      previous: {
        startDate: previousStart.toISOString().split('T')[0],
        endDate: previousEnd.toISOString().split('T')[0]
      }
    };
  }
}
