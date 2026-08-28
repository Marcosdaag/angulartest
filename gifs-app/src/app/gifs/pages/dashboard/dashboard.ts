import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GitSideMenu } from "../../components/git-side-menu/git-side-menu";

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, GitSideMenu],
  templateUrl: './dashboard.html',
})
export default class Dashboard { }
