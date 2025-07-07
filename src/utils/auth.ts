import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as readline from 'readline-sync';
import open from 'open';

export interface AuthCredentials {
  client_id: string;
  client_secret: string;
  redirect_uris?: string[];
}

export class GA4Auth {
  private oauth2Client: OAuth2Client;
  private tokenPath: string;
  private credentialsPath: string;

  constructor() {
    // Initialize paths
    const configDir = path.join(os.homedir(), '.ga4-cli');
    this.tokenPath = path.join(configDir, 'token.json');
    this.credentialsPath = path.join(configDir, 'credentials.json');
    
    // Ensure config directory exists
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // Initialize OAuth2 client for desktop app (OOB flow)
    this.oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      'urn:ietf:wg:oauth:2.0:oob'
    );
  }

  /**
   * Authenticate user and get access token
   */
  async authenticate(): Promise<OAuth2Client> {
    try {
      // Check if environment variables are set
      if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
        throw new Error('CLIENT_ID and CLIENT_SECRET must be set in environment variables. Check your .env file.');
      }

      // Try to load existing token
      const token = this.loadToken();
      if (token) {
        this.oauth2Client.setCredentials(token);
        
        // Check if token is valid
        try {
          await this.oauth2Client.getAccessToken();
          console.log('✅ Using existing authentication');
          return this.oauth2Client;
        } catch (error) {
          console.log('🔄 Existing token expired, requesting new authorization...');
        }
      }

      // Get new token
      await this.getNewToken();
      return this.oauth2Client;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Authentication failed: ${error.message}`);
      }
      throw new Error(`Authentication failed: ${error}`);
    }
  }

  /**
   * Load token from file
   */
  private loadToken(): any {
    try {
      const token = fs.readFileSync(this.tokenPath, 'utf8');
      return JSON.parse(token);
    } catch (error) {
      return null;
    }
  }

  /**
   * Save token to file
   */
  private saveToken(token: any): void {
    try {
      fs.writeFileSync(this.tokenPath, JSON.stringify(token, null, 2));
      console.log('Token saved successfully');
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  /**
   * Get new token from Google using OOB flow
   */
  private async getNewToken(): Promise<void> {
    const scopes = [
      'https://www.googleapis.com/auth/analytics.readonly'
    ];

    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });

    console.log('\n🔐 Authorization Required');
    console.log('==========================================');
    console.log('Opening browser for Google Analytics authorization...');
    console.log('\nIf browser doesn\'t open automatically, copy and paste this URL:');
    console.log('\n' + authUrl);
    console.log('\n==========================================');
    
    try {
      await open(authUrl);
    } catch (error) {
      console.log('Could not open browser automatically. Please visit the URL above.');
    }

    console.log('\nAfter authorizing, you will see an authorization code.');
    const code = readline.question('Enter the authorization code here: ');

    if (!code || code.trim() === '') {
      throw new Error('Authorization code is required');
    }

    try {
      const { tokens } = await this.oauth2Client.getToken(code.trim());
      this.oauth2Client.setCredentials(tokens);
      this.saveToken(tokens);
      console.log('✅ Authentication successful!');
    } catch (error) {
      throw new Error(`Error retrieving access token: ${error}`);
    }
  }

  /**
   * Get authenticated OAuth2 client
   */
  getClient(): OAuth2Client {
    return this.oauth2Client;
  }

  /**
   * Revoke token and remove from storage
   */
  async logout(): Promise<void> {
    try {
      await this.oauth2Client.revokeCredentials();
      if (fs.existsSync(this.tokenPath)) {
        fs.unlinkSync(this.tokenPath);
      }
      console.log('Successfully logged out');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}
