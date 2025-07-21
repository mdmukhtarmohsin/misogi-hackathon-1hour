export interface SearchResult {
  title: string;
  price: string;
  location: string;
  source: string;
  link: string;
  amenities?: string[];
  description?: string;
}

export interface ApiResponse {
  response: string;
  results: SearchResult[];
  searchComplete: boolean;
}
