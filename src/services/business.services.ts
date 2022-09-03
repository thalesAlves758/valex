import { HttpError, HttpErrorType } from '../exceptions/http.exception';
import { Business, findById } from '../repositories/businessRepository';

export async function getBusinessById(businessId: number): Promise<Business> {
  const business = await findById(businessId);

  if (!business) {
    throw HttpError(
      HttpErrorType.NOT_FOUND,
      `Could not find business with id ${businessId}`
    );
  }

  return business;
}
