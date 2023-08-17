import { Request, Response } from 'express';
import countries from 'countries-list';

export const country = async (req: Request, res: Response) => {
  const countryCodes = Object.keys(countries.countries);
  const countryBody = countryCodes.map((code) => countries.countries[code]);
  res.json(countryBody);
};
