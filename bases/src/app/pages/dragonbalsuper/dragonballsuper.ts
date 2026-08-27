import { DragonballService } from './../../services/dragonball.service';
import { Component, inject, signal } from '@angular/core';
import { CharacterList } from '../../components/dragonball/character-list/character-list';
import { CharacterApp } from "../../components/dragonball/character-app/character-app";
import type { Character } from '../../interfaces/characterinterface';

@Component({
  selector: 'app-dragonballsuper',
  imports: [CharacterList, CharacterApp],
  templateUrl: './dragonballsuper.html',
})
export class Dragonbalsuper {
  public dragonballService = inject(DragonballService);
}
