import { UserRole } from "@/domain/enums/UserRole";

export type TokensPayloadDTO = {
	userId: string;
	roles: UserRole[];
};
