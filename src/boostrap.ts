import { AppDataSource } from "./infra/persistence/out/context/database-context";

export async function bootstrap() {
	await AppDataSource.initialize();
	console.log("📦 Banco de dados conectado");
}