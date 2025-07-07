#!/usr/bin/env node

import { Command } from 'commander';
import * as dotenv from 'dotenv';
import { ReportCommand } from './commands/report';
import { CompareCommand } from './commands/compare';
import { EventsCommand } from './commands/events';
import { PagesCommand } from './commands/pages';
import { OutputFormat } from './utils/formatter';

// Load environment variables
dotenv.config();

const program = new Command();

program
  .name('ga4-cli')
  .description('CLI tool for Google Analytics 4 data retrieval')
  .version('1.0.0');

// Report command
program
  .command('report')
  .description('Generate a custom GA4 report')
  .requiredOption('-p, --property <propertyId>', 'GA4 property ID')
  .requiredOption('-m, --metrics <metrics>', 'Comma-separated list of metrics')
  .option('-d, --dimensions <dimensions>', 'Comma-separated list of dimensions')
  .option('-s, --start-date <date>', 'Start date (YYYY-MM-DD)')
  .option('-e, --end-date <date>', 'End date (YYYY-MM-DD)')
  .option('-f, --format <format>', 'Output format (table|json|markdown|csv)', 'table')
  .option('-o, --output <file>', 'Output file path')
  .option('-l, --limit <number>', 'Maximum number of rows', '100')
  .action(async (options) => {
    try {
      const command = new ReportCommand();
      await command.execute({
        property: options.property,
        metrics: options.metrics.split(',').map((m: string) => m.trim()),
        dimensions: options.dimensions ? options.dimensions.split(',').map((d: string) => d.trim()) : undefined,
        startDate: options.startDate,
        endDate: options.endDate,
        format: options.format as OutputFormat,
        output: options.output,
        limit: parseInt(options.limit),
      });
    } catch (error) {
      console.error('Command failed:', error);
      process.exit(1);
    }
  });

// Compare command
program
  .command('compare')
  .description('Compare GA4 data between two time periods')
  .requiredOption('-p, --property <propertyId>', 'GA4 property ID')
  .requiredOption('-m, --metrics <metrics>', 'Comma-separated list of metrics')
  .option('-d, --dimensions <dimensions>', 'Comma-separated list of dimensions')
  .option('--current-start <date>', 'Current period start date (YYYY-MM-DD)')
  .option('--current-end <date>', 'Current period end date (YYYY-MM-DD)')
  .option('--previous-start <date>', 'Previous period start date (YYYY-MM-DD)')
  .option('--previous-end <date>', 'Previous period end date (YYYY-MM-DD)')
  .option('-f, --format <format>', 'Output format (table|json|markdown|csv)', 'table')
  .option('-o, --output <file>', 'Output file path')
  .option('-l, --limit <number>', 'Maximum number of rows', '100')
  .action(async (options) => {
    try {
      const command = new CompareCommand();
      await command.execute({
        property: options.property,
        metrics: options.metrics.split(',').map((m: string) => m.trim()),
        dimensions: options.dimensions ? options.dimensions.split(',').map((d: string) => d.trim()) : undefined,
        currentStart: options.currentStart,
        currentEnd: options.currentEnd,
        previousStart: options.previousStart,
        previousEnd: options.previousEnd,
        format: options.format as OutputFormat,
        output: options.output,
        limit: parseInt(options.limit),
      });
    } catch (error) {
      console.error('Command failed:', error);
      process.exit(1);
    }
  });

// Events command
program
  .command('events')
  .description('Get top events report')
  .requiredOption('-p, --property <propertyId>', 'GA4 property ID')
  .option('-s, --start-date <date>', 'Start date (YYYY-MM-DD)')
  .option('-e, --end-date <date>', 'End date (YYYY-MM-DD)')
  .option('-f, --format <format>', 'Output format (table|json|markdown|csv)', 'table')
  .option('-o, --output <file>', 'Output file path')
  .option('-l, --limit <number>', 'Maximum number of rows', '20')
  .action(async (options) => {
    try {
      const command = new EventsCommand();
      await command.execute({
        property: options.property,
        startDate: options.startDate,
        endDate: options.endDate,
        format: options.format as OutputFormat,
        output: options.output,
        limit: parseInt(options.limit),
      });
    } catch (error) {
      console.error('Command failed:', error);
      process.exit(1);
    }
  });

// Pages command
program
  .command('pages')
  .description('Get top pages report')
  .requiredOption('-p, --property <propertyId>', 'GA4 property ID')
  .option('-s, --start-date <date>', 'Start date (YYYY-MM-DD)')
  .option('-e, --end-date <date>', 'End date (YYYY-MM-DD)')
  .option('-f, --format <format>', 'Output format (table|json|markdown|csv)', 'table')
  .option('-o, --output <file>', 'Output file path')
  .option('-l, --limit <number>', 'Maximum number of rows', '20')
  .action(async (options) => {
    try {
      const command = new PagesCommand();
      await command.execute({
        property: options.property,
        startDate: options.startDate,
        endDate: options.endDate,
        format: options.format as OutputFormat,
        output: options.output,
        limit: parseInt(options.limit),
      });
    } catch (error) {
      console.error('Command failed:', error);
      process.exit(1);
    }
  });

// Help command
program
  .command('help')
  .description('Show help information')
  .action(() => {
    console.log('\n🧠 GA4 CLI - Google Analytics 4 Data Retrieval Tool\n');
    console.log('Available commands:');
    console.log('  report   - Generate custom GA4 reports');
    console.log('  compare  - Compare data between time periods');
    console.log('  events   - Get top events report');
    console.log('  pages    - Get top pages report');
    console.log('\nEnvironment variables required:');
    console.log('  CLIENT_ID     - Google OAuth2 client ID');
    console.log('  CLIENT_SECRET - Google OAuth2 client secret');
    console.log('\nExample usage:');
    console.log('  ga4-cli report -p 123456789 -m users,sessions -d country');
    console.log('  ga4-cli compare -p 123456789 -m users -d pagePath');
    console.log('  ga4-cli events -p 123456789 -f markdown -o events.md');
    console.log('  ga4-cli pages -p 123456789 -f json');
    console.log('\nFor more help on a specific command, use:');
    console.log('  ga4-cli <command> --help');
  });

// Parse command line arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
