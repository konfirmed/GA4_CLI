# GA4 CLI - Quick Start Guide

## 🚀 Quick Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Create `.env` file**:
   ```env
   CLIENT_ID=your-google-client-id
   CLIENT_SECRET=your-google-client-secret
   ```

4. **Test the CLI**:
   ```bash
   node dist/index.js help
   ```

## 📊 Common Commands

### Get users by country (last 7 days)
```bash
node dist/index.js report -p 123456789 -m users -d country
```

### Compare this week vs last week
```bash
node dist/index.js compare -p 123456789 -m users,sessions -d deviceCategory
```

### Get top events as markdown
```bash
node dist/index.js events -p 123456789 -f markdown -o events.md
```

### Get top pages as JSON
```bash
node dist/index.js pages -p 123456789 -f json
```

## 🔧 Available Metrics & Dimensions

### Metrics
- `users`, `sessions`, `screenPageViews`, `eventCount`
- `bounceRate`, `sessionDuration`, `engagementRate`
- `conversions`, `totalRevenue`

### Dimensions
- `country`, `region`, `city`, `pagePath`, `pageTitle`
- `eventName`, `source`, `medium`, `campaign`
- `deviceCategory`, `operatingSystem`, `browser`
- `date`, `hour`, `minute`

## 📁 Output Formats

- `table` - Pretty console table (default)
- `json` - JSON format
- `markdown` - Markdown table
- `csv` - CSV format

## 🆘 Need Help?

Run any command with `--help` for detailed options:
```bash
node dist/index.js report --help
node dist/index.js compare --help
node dist/index.js events --help
node dist/index.js pages --help
```
