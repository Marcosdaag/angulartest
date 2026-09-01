import { GiphyItem } from './../interfaces/giphy.interfaces';
import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { environment } from "@environments/environment.development";
import type { GiphyResponse } from "../interfaces/giphy.interfaces";
import { Gif } from "../interfaces/gif.interface";
import { GifMapper } from "../mapper/gif.mapper";
import { map, tap } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class GifService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  // De esta manera manejamos un arreglo de llave/valor "diccionario" para almacenar la busqueda en string y un array de gifs de resultado
  searchHistory = signal<Record<string, Gif[]>>({});

  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

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
      map(({ data }) => data),
      map((items) => GifMapper.mapGiphyItemToGifArray(items)),

      // Historial de busquedas
      tap(items => {
        this.searchHistory.update(history => ({
          ...history,
          [query.toLowerCase()]: items,
        }));
      })
    );
    // .subscribe((resp) => {
    //   const gifs = GifMapper.mapGiphyItemToGifArray(resp.data);
    //   console.log({ gifs });
    // });
  }
}
