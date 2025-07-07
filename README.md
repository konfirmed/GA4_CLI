# 🧠 GA4 CLI - Google Analytics 4 Data Retrieval Tool

A powerful command-line interface for retrieving Google Analytics 4 data with OAuth authentication, multiple output formats, and comprehensive reporting capabilities.

## ✨ Features

- 🔐 **OAuth2 Authentication** - Secure authentication with Google Analytics
- 📊 **Multiple Report Types** - Custom reports, comparisons, top events, and pages
- 📁 **Multiple Output Formats** - Table, JSON, Markdown, and CSV
- 🔄 **Date Range Comparisons** - Compare current vs previous periods
- 💾 **File Export** - Save reports to files
- 🎯 **Flexible Metrics & Dimensions** - Use any GA4 metric/dimension combination

## 📦 Installation

### Prerequisites

- Node.js 16.0.0 or higher
- A Google Cloud Project with Analytics API enabled
- GA4 property access

### Install Dependencies

```bash
npm install
```

### Build the Project

```bash
npm run build
```

### Install Globally (Optional)

```bash
npm link
```

## 🔧 Setup

### 1. Create Google Cloud Project & Enable APIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Analytics Data API**
4. Enable the **Google Analytics Admin API** (optional, for property listing)

### 2. Create OAuth2 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client ID**
3. Choose **Desktop Application** (important for CLI tools)
4. Download the credentials JSON file
5. Note the `client_id` and `client_secret` values

### 3. Set Environment Variables

You can use the setup script:

```bash
npm run setup
```

Or create a `.env` file manually in the project root:

```env
CLIENT_ID=your-google-client-id
CLIENT_SECRET=your-google-client-secret
```

### 4. Find Your GA4 Property ID

Your GA4 property ID is the numeric ID found in:
- Google Analytics > Admin > Property > Property Details
- URL: `https://analytics.google.com/analytics/web/#/pXXXXXXXXX/` (the X's are your property ID)

## 🚀 Usage

### Authentication

On first run, the CLI will open your browser for OAuth authentication. The token will be saved to `~/.ga4-cli/token.json` for future use.

### Commands

#### 📊 Custom Reports

Generate custom reports with any combination of metrics and dimensions:

```bash
ga4-cli report --property=123456789 --metrics=users,sessions --dimensions=country,deviceCategory
```

**Options:**
- `-p, --property <propertyId>` - GA4 property ID (required)
- `-m, --metrics <metrics>` - Comma-separated metrics (required)
- `-d, --dimensions <dimensions>` - Comma-separated dimensions (optional)
- `-s, --start-date <date>` - Start date (YYYY-MM-DD, default: 7 days ago)
- `-e, --end-date <date>` - End date (YYYY-MM-DD, default: today)
- `-f, --format <format>` - Output format: table|json|markdown|csv (default: table)
- `-o, --output <file>` - Save to file (optional)
- `-l, --limit <number>` - Maximum rows (default: 100)

#### 🔄 Date Range Comparisons

Compare metrics between two time periods:

```bash
ga4-cli compare --property=123456789 --metrics=users,sessions --dimensions=pagePath
```

**Options:**
- Same as report command, plus:
- `--current-start <date>` - Current period start date
- `--current-end <date>` - Current period end date
- `--previous-start <date>` - Previous period start date
- `--previous-end <date>` - Previous period end date

*Note: If dates not specified, defaults to this week vs last week*

#### 🎯 Top Events

Get your most triggered events:

```bash
ga4-cli events --property=123456789 --format=markdown --output=events.md
```

**Options:**
- `-p, --property <propertyId>` - GA4 property ID (required)
- `-s, --start-date <date>` - Start date (default: 7 days ago)
- `-e, --end-date <date>` - End date (default: today)
- `-f, --format <format>` - Output format (default: table)
- `-o, --output <file>` - Save to file (optional)
- `-l, --limit <number>` - Maximum rows (default: 20)

#### 📄 Top Pages

Get your most visited pages:

```bash
ga4-cli pages --property=123456789 --format=json
```

**Options:**
- Same as events command

## 📊 Available Metrics & Dimensions

### Popular Metrics
- `users` - Total users
- `sessions` - Total sessions
- `screenPageViews` - Page views
- `eventCount` - Event count
- `bounceRate` - Bounce rate
- `sessionDuration` - Session duration
- `engagementRate` - Engagement rate
- `conversions` - Conversions
- `totalRevenue` - Total revenue

### Popular Dimensions
- `country` - Country
- `region` - Region
- `city` - City
- `pagePath` - Page path
- `pageTitle` - Page title
- `eventName` - Event name
- `source` - Traffic source
- `medium` - Traffic medium
- `campaign` - Campaign name
- `deviceCategory` - Device category
- `operatingSystem` - Operating system
- `browser` - Browser
- `date` - Date
- `hour` - Hour
- `minute` - Minute

## 📋 Example Commands

### Basic Usage

```bash
# Get users by country (last 7 days)
ga4-cli report -p 123456789 -m users -d country

# Get page views for specific pages
ga4-cli report -p 123456789 -m screenPageViews -d pagePath -s 2024-01-01 -e 2024-01-31

# Export top events to markdown
ga4-cli events -p 123456789 -f markdown -o events.md

# Compare this week vs last week
ga4-cli compare -p 123456789 -m users,sessions -d deviceCategory
```

### Advanced Usage

```bash
# Custom date range comparison
ga4-cli compare -p 123456789 -m users \
  --current-start 2024-01-01 --current-end 2024-01-31 \
  --previous-start 2023-01-01 --previous-end 2023-01-31

# Multiple metrics and dimensions
ga4-cli report -p 123456789 \
  -m users,sessions,screenPageViews,eventCount \
  -d country,deviceCategory,source,medium \
  -l 50 -f json -o report.json

# Top 100 pages with sessions data
ga4-cli pages -p 123456789 -l 100 -f csv -o pages.csv
```

## 🔍 Output Formats

### Table Format
```
┌──────────────┬─────────┬──────────┐
│ country      │ users   │ sessions │
├──────────────┼─────────┼──────────┤
│ United States│ 1,234   │ 1,456    │
│ Canada       │ 567     │ 678      │
└──────────────┴─────────┴──────────┘
```

### JSON Format
```json
{
  "summary": {
    "totalRows": 2,
    "dimensionHeaders": ["country"],
    "metricHeaders": ["users", "sessions"]
  },
  "data": [
    {
      "country": "United States",
      "users": "1234",
      "sessions": "1456"
    }
  ]
}
```

### Markdown Format
```markdown
# GA4 Report Results

Total rows: 2

| country | users | sessions |
| --- | --- | --- |
| United States | 1,234 | 1,456 |
| Canada | 567 | 678 |
```

### CSV Format
```csv
country,users,sessions
United States,1234,1456
Canada,567,678
```

## 🚨 Troubleshooting

### Authentication Issues

**Error: "Authentication failed"**
- Ensure `CLIENT_ID` and `CLIENT_SECRET` are correctly set in `.env`
- Check that the Google Analytics Data API is enabled in your project
- Verify your OAuth2 credentials are for a "Desktop Application"

**Error: "Token invalid"**
- Delete `~/.ga4-cli/token.json` and re-authenticate
- Run `ga4-cli logout` to revoke tokens

### API Issues

**Error: "Property not found"**
- Verify the property ID is correct
- Ensure you have access to the GA4 property
- Check that the property ID is numeric (not the measurement ID starting with "G-")

**Error: "Invalid metric/dimension"**
- Check the metric/dimension names for typos
- Refer to the [GA4 Dimensions & Metrics Explorer](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema)

### Common Issues

**No data returned**
- Check your date range
- Verify the property has data for the specified period
- Some metrics may not be available for certain dimensions

## 📚 Development

### Project Structure
```
src/
├── commands/
│   ├── report.ts      # Custom report command
│   ├── compare.ts     # Date comparison command
│   ├── events.ts      # Top events command
│   └── pages.ts       # Top pages command
├── utils/
│   ├── auth.ts        # OAuth2 authentication
│   ├── ga4.ts         # GA4 API wrapper
│   └── formatter.ts   # Output formatting
└── index.ts           # CLI entry point
```

### Build & Test

```bash
# Build the project
npm run build

# Run in development mode
npm run dev

# Test a command
npm run dev -- report -p 123456789 -m users -d country
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for the Google Analytics community**
