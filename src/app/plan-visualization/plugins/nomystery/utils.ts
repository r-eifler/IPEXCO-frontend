import { HttpClient } from "@angular/common/http";

export interface Position {
  x: number;
  y: number;
}

export function loadSVGFile(
  fileName: string,
  http: HttpClient
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    http
      .get("/assets/" + fileName, { responseType: "text" })
      .subscribe((logo) => {
        resolve(logo);
      });
  });
}
