import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = Number(configService.get<string>("PORT", "3001"));
  const frontendOrigins = configService.get<string>("FRONTEND_ORIGINS", "");

  const originList = frontendOrigins
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  app.enableCors({
    origin: originList.length > 0 ? originList : true,
    credentials: true
  });

  app.setGlobalPrefix("api");

  await app.listen(port, "0.0.0.0");
  console.log(`Comic-Con Buddy backend running on http://0.0.0.0:${port}`);
}

bootstrap();
