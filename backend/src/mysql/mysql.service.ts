import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import mysql, { Pool, RowDataPacket } from "mysql2/promise";

@Injectable()
export class MysqlService implements OnModuleDestroy {
  private readonly logger = new Logger(MysqlService.name);
  private pool: Pool | null = null;

  constructor(private readonly configService: ConfigService) {}

  get mode() {
    return this.configService.get<string>("DATA_MODE", "mock");
  }

  private createPool() {
    if (this.pool || this.mode !== "mysql") {
      return;
    }

    this.pool = mysql.createPool({
      host: this.configService.get<string>("DB_HOST", "127.0.0.1"),
      port: Number(this.configService.get<string>("DB_PORT", "3306")),
      user: this.configService.get<string>("DB_USER", "root"),
      password: this.configService.get<string>("DB_PASSWORD", "root"),
      database: this.configService.get<string>("DB_NAME", "comic_con_buddy"),
      connectionLimit: 10,
      charset: "utf8mb4"
    });

    this.logger.log("MySQL pool initialized");
  }

  async query<T extends RowDataPacket[] = RowDataPacket[]>(sql: string, params: Array<string | number | boolean | null> = []) {
    this.createPool();

    if (!this.pool) {
      throw new Error("MySQL mode is disabled. Set DATA_MODE=mysql to enable database queries.");
    }

    const [rows] = await this.pool.query<T>(sql, params);
    return rows;
  }

  async execute(sql: string, params: Array<string | number | boolean | null> = []) {
    this.createPool();

    if (!this.pool) {
      throw new Error("MySQL mode is disabled. Set DATA_MODE=mysql to enable database writes.");
    }

    const [result] = await this.pool.execute(sql, params);
    return result;
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
      this.logger.log("MySQL pool closed");
    }
  }
}
