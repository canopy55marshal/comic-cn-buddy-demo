import { Injectable, Logger } from "@nestjs/common";

type NominatimItem = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  class: string;
};

@Injectable()
export class OpenMapService {
  private readonly logger = new Logger(OpenMapService.name);

  async searchPlaces(query: string) {
    if (!query?.trim()) {
      return [];
    }

    const params = new URLSearchParams({
      q: query.trim(),
      format: "jsonv2",
      limit: "8",
      addressdetails: "1",
      "accept-language": "zh-CN"
    });

    const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "comic-con-buddy-mvp/0.1",
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Nominatim returned ${response.status}`);
      }

      const data = (await response.json()) as NominatimItem[];

      return data.map((item) => ({
        id: item.place_id,
        name: item.display_name,
        latitude: Number(item.lat),
        longitude: Number(item.lon),
        type: item.type,
        category: item.class
      }));
    } catch (error) {
      this.logger.error(`Open map search failed: ${(error as Error).message}`);
      return [];
    }
  }
}
