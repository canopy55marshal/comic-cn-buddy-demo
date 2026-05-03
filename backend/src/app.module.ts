import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MysqlService } from "./mysql/mysql.service";
import { OpenMapService } from "./open-map/open-map.service";
import { MvpController } from "./mvp/mvp.controller";
import { MvpService } from "./mvp/mvp.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    })
  ],
  controllers: [MvpController],
  providers: [MysqlService, OpenMapService, MvpService]
})
export class AppModule {}
