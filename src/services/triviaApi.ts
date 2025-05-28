
import { Question } from '@/types/quiz';

const API_BASE_URL = 'https://opentdb.com/api.php';

export interface FetchQuestionsParams {
  amount?: number;
  category?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  type?: 'multiple' | 'boolean';
}

export const triviaApi = {
  async fetchQuestions(params: FetchQuestionsParams = {}): Promise<Question[]> {
    const {
      amount = 10,
      category,
      difficulty,
      type
    } = params;

    const url = new URL(API_BASE_URL);
    url.searchParams.append('amount', amount.toString());
    
    if (category) url.searchParams.append('category', category.toString());
    if (difficulty) url.searchParams.append('difficulty', difficulty);
    if (type) url.searchParams.append('type', type);

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.response_code !== 0) {
        throw new Error('Failed to fetch questions from API');
      }

      return data.results.map((q: any) => ({
        ...q,
        question: this.decodeHtml(q.question),
        correct_answer: this.decodeHtml(q.correct_answer),
        incorrect_answers: q.incorrect_answers.map((ans: string) => this.decodeHtml(ans))
      }));
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw new Error('Failed to load quiz questions. Please check your internet connection and try again.');
    }
  },

  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
};
