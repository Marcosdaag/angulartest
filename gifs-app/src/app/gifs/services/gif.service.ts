import { GiphyItem } from './../interfaces/giphy.interfaces';
import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { environment } from "@environments/environment.development";
import type { GiphyResponse } from "../interfaces/giphy.interfaces";
import { Gif } from "../interfaces/gif.interface";
import { GifMapper } from "../mapper/gif.mapper";
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GifService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
    this.http.get<GiphyResponse>(`${environment.apiUrl}/gifs/trending`, {
      params: {
        api_key: environment.gifApiKey,
        limit: 20,
      },
    }).subscribe((resp) => {
      const gifs = GifMapper.mapGiphyItemToGifArray(resp.data);
      this.trendingGifs.set(gifs);
      this.trendingGifsLoading.set(false);
      console.log(gifs);
    });
  }

  // Al usar el return devuelve los datos automaticamente en la peticion
  searchGifs(query: string) {
    return this.http.get<GiphyResponse>(`${environment.apiUrl}/gifs/search`, {
      params: {
        api_key: environment.gifApiKey,
        limit: 20,
        q: query
      }
    }).pipe(
    );
    // .subscribe((resp) => {
    //   const gifs = GifMapper.mapGiphyItemToGifArray(resp.data);
    //   console.log({ gifs });
    // });
  }
}
