import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SideMenuHeader } from "../side-menu-header/side-menu-header";
import { SideMenuOptions } from "../side-menu-options/side-menu-options";

@Component({
  selector: 'app-git-side-menu',
  imports: [SideMenuHeader, SideMenuOptions],
  templateUrl: './git-side-menu.html',
})
export class GitSideMenu { }
