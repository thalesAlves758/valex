import { HttpError, HttpErrorType } from '../exceptions/http.exception';
import { Company, findByApiKey } from '../repositories/companyRepository';

export async function findCompanyByApiKey(apiKey: string): Promise<Company> {
  const company: Company = await findByApiKey(apiKey);

  if (!company) {
    throw HttpError(HttpErrorType.UNAUTHORIZED);
  }

  return company;
}
