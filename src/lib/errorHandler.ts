import { toast } from 'react-hot-toast';

export class AppError extends Error {
  code: string;
  details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    toast.error(`${error.message} (Code: ${error.code})`);
    console.error('Application Error:', error);
  } else if (error instanceof Error) {
    toast.error(error.message);
    console.error('Unexpected Error:', error);
  } else {
    toast.error('An unknown error occurred');
    console.error('Unknown Error:', error);
  }
};
