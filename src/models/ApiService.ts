import { IApiService } from '../types';
import { API_URL } from '../utils/constants';

export class ApiService implements IApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  async get(endpoint: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
    return response.json();
  }

  async post(endpoint: string, data: object): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to post: ${response.statusText}`);
    return response.json();
  }

  async getProducts(): Promise<IProduct[]> {
    try {
      const products = await this.get('/products');
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
}