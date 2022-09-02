import { HttpError, HttpErrorType } from '../exceptions/http.exception';
import { Employee, findById } from '../repositories/employeeRepository';

export async function findEmployeeById(employeeId: number): Promise<Employee> {
  const employee = await findById(employeeId);

  if (!employee) {
    throw HttpError(HttpErrorType.NOT_FOUND, 'Could not find employee');
  }

  return employee;
}
