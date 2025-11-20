import Papa from 'papaparse';
import { TravelItem } from '../types';

export async function loadTravelData(): Promise<TravelItem[]> {
  const response = await fetch('/travel_by_month_clean.csv');
  const text = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse<TravelItem>(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn('CSV parsing errors:', results.errors);
        }
        resolve(results.data);
      },
      error: (error: unknown) => {
        reject(error);
      },
    });
  });
}

