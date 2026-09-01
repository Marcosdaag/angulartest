import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GifList } from "../../components/gif-list/gif-list";
import { GifService } from '../../services/gif.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search',
  imports: [GifList],
  templateUrl: './search.html',
})
export default class Search {

  gifSerive = inject(GifService);
  gifs = signal<Gif[]>([]);

  onSearch(query: string) {
    this.gifSerive.searchGifs(query).subscribe(resp => {
      this.gifs.set(resp);
    });
  }
}
