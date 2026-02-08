export interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  tags: string[];
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  groundingChunks?: {
    web?: { uri: string; title: string };
  }[];
}