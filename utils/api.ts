import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.106:5000'; // For Android emulator: Use 10.0.2.2 for localhost. For iOS/XCode simulator: Use your machine's IP address.

export interface Memory {
  _id: string;
  title: string;
  description?: string;
  placeName: string;
  locationLink?: string;
  fromDate: string; // Changed to string for API input
  toDate: string;   // Changed to string for API input
  photo: string; // Base64 string
  user: string;
  createdAt: Date;
  updatedAt: Date;
  // Virtual fields from backend
  year?: number;
  month?: string;
  monthName?: string;
  dateRange?: string;
}

// Interface for memory data when creating or updating (dates as strings)
export interface MemoryInput {
  title: string;
  description?: string;
  placeName: string;
  locationLink?: string;
  fromDate: string;
  toDate: string;
  photo: string;
}

export interface GroupedMemories {
  [year: string]: {
    [monthName: string]: {
      month: number;
      monthName: string;
      memories: Memory[];
    };
  };
}

export interface ApiMemoriesResponse {
  memories: Memory[];
  groupedMemories: GroupedMemories;
}

class ApiService {
  constructor() {
    // Configure axios defaults
    axios.defaults.baseURL = API_BASE_URL;
  }

  // Memory CRUD operations
  async getMemories(search?: string, year?: number, month?: number): Promise<ApiMemoriesResponse> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (year) params.append('year', year.toString());
      if (month !== undefined) params.append('month', month.toString());

      const response = await axios.get(`/memories?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching memories:', error);
      throw error;
    }
  }

  async createMemory(memoryData: MemoryInput): Promise<Memory> {
    try {
      const response = await axios.post('/memories', memoryData);
      return response.data.memory;
    } catch (error) {
      console.error('Error creating memory:', error);
      throw error;
    }
  }

  async updateMemory(id: string, memoryData: Partial<MemoryInput>): Promise<Memory> {
    try {
      const response = await axios.put(`/memories/${id}`, memoryData);
      return response.data.memory;
    } catch (error) {
      console.error('Error updating memory:', error);
      throw error;
    }
  }

  async deleteMemory(id: string): Promise<void> {
    try {
      await axios.delete(`/memories/${id}`);
    } catch (error) {
      console.error('Error deleting memory:', error);
      throw error;
    }
  }

  async deleteAllMemories(): Promise<{ deletedCount: number }> {
    try {
      const response = await axios.delete(`/memories`);
      return response.data;
    } catch (error) {
      console.error('Error deleting all memories:', error);
      throw error;
    }
  }

  // Helper function to format date for API
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  parseDate(dateString: string): Date {
    return new Date(dateString);
  }
}

export const apiService = new ApiService();
