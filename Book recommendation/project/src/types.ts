export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail: string;
    };
    language?: string;
    publishedDate?: string;
    categories?: string[];
    pageCount?: number;
    averageRating?: number;
    ratingsCount?: number;
  };
}

export interface SearchFilters {
  query: string;
  language: string;
}