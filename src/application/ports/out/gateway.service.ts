export abstract class GatewayService {
	abstract createStudentCustomer(name: string, email: string): Promise<string>
	abstract createInstructorAccount(email: string): Promise<string>
	abstract generateOnboardingLink(accountId: string, returnUrl: string, refreshUrl: string): Promise<string>
}