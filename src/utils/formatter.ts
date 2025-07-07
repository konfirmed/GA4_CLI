import { ReportResult } from './ga4';
import * as fs from 'fs';

export type OutputFormat = 'table' | 'json' | 'markdown' | 'csv';

export class OutputFormatter {
  /**
   * Format report result based on the specified format
   */
  static format(result: ReportResult, format: OutputFormat): string {
    switch (format) {
      case 'table':
        return this.formatAsTable(result);
      case 'json':
        return this.formatAsJSON(result);
      case 'markdown':
        return this.formatAsMarkdown(result);
      case 'csv':
        return this.formatAsCSV(result);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Format as table (for console output)
   */
  static formatAsTable(result: ReportResult): string {
    if (result.rows.length === 0) {
      return 'No data found';
    }

    const headers = [...result.dimensionHeaders, ...result.metricHeaders];
    const rows = result.rows.map(row => [...row.dimensions, ...row.metrics]);

    // Calculate column widths
    const columnWidths = headers.map((header, index) => {
      const maxContentWidth = Math.max(
        header.length,
        ...rows.map(row => (row[index] || '').toString().length)
      );
      return Math.max(10, maxContentWidth);
    });

    // Create table
    const separator = '┌' + columnWidths.map(w => '─'.repeat(w + 2)).join('┬') + '┐';
    const headerRow = '│' + headers.map((h, i) => ` ${h.padEnd(columnWidths[i])} `).join('│') + '│';
    const headerSeparator = '├' + columnWidths.map(w => '─'.repeat(w + 2)).join('┼') + '┤';
    const dataRows = rows.map(row => 
      '│' + row.map((cell, i) => ` ${cell.toString().padEnd(columnWidths[i])} `).join('│') + '│'
    );
    const bottom = '└' + columnWidths.map(w => '─'.repeat(w + 2)).join('┴') + '┘';

    return [
      separator,
      headerRow,
      headerSeparator,
      ...dataRows,
      bottom
    ].join('\n');
  }

  /**
   * Format as JSON
   */
  static formatAsJSON(result: ReportResult): string {
    const formattedData = {
      summary: {
        totalRows: result.rowCount,
        dimensionHeaders: result.dimensionHeaders,
        metricHeaders: result.metricHeaders,
      },
      data: result.rows.map(row => {
        const formattedRow: any = {};
        
        // Add dimensions
        result.dimensionHeaders.forEach((header, index) => {
          formattedRow[header] = row.dimensions[index];
        });
        
        // Add metrics
        result.metricHeaders.forEach((header, index) => {
          formattedRow[header] = row.metrics[index];
        });
        
        return formattedRow;
      })
    };

    return JSON.stringify(formattedData, null, 2);
  }

  /**
   * Format as Markdown table
   */
  static formatAsMarkdown(result: ReportResult): string {
    if (result.rows.length === 0) {
      return 'No data found';
    }

    const headers = [...result.dimensionHeaders, ...result.metricHeaders];
    const headerRow = '| ' + headers.join(' | ') + ' |';
    const separatorRow = '| ' + headers.map(() => '---').join(' | ') + ' |';
    const dataRows = result.rows.map(row => 
      '| ' + [...row.dimensions, ...row.metrics].join(' | ') + ' |'
    );

    return [
      `# GA4 Report Results`,
      ``,
      `Total rows: ${result.rowCount}`,
      ``,
      headerRow,
      separatorRow,
      ...dataRows
    ].join('\n');
  }

  /**
   * Format as CSV
   */
  static formatAsCSV(result: ReportResult): string {
    if (result.rows.length === 0) {
      return 'No data found';
    }

    const headers = [...result.dimensionHeaders, ...result.metricHeaders];
    const headerRow = headers.join(',');
    const dataRows = result.rows.map(row => 
      [...row.dimensions, ...row.metrics].map(cell => 
        cell.includes(',') ? `"${cell}"` : cell
      ).join(',')
    );

    return [headerRow, ...dataRows].join('\n');
  }

  /**
   * Save formatted output to file
   */
  static saveToFile(content: string, filename: string): void {
    try {
      fs.writeFileSync(filename, content, 'utf8');
      console.log(`Output saved to: ${filename}`);
    } catch (error) {
      console.error(`Error saving file: ${error}`);
    }
  }

  /**
   * Display comparison results
   */
  static formatComparison(
    current: ReportResult,
    previous: ReportResult,
    format: OutputFormat,
    currentLabel: string = 'Current',
    previousLabel: string = 'Previous'
  ): string {
    const currentFormatted = this.format(current, format);
    const previousFormatted = this.format(previous, format);

    switch (format) {
      case 'markdown':
        return [
          `## ${currentLabel}`,
          currentFormatted,
          ``,
          `## ${previousLabel}`,
          previousFormatted
        ].join('\n');
      case 'json':
        return JSON.stringify({
          [currentLabel.toLowerCase()]: JSON.parse(currentFormatted),
          [previousLabel.toLowerCase()]: JSON.parse(previousFormatted)
        }, null, 2);
      default:
        return [
          `=== ${currentLabel} ===`,
          currentFormatted,
          ``,
          `=== ${previousLabel} ===`,
          previousFormatted
        ].join('\n');
    }
  }
}
