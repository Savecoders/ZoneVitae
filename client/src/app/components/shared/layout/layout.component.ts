import { Component } from '@angular/core';
import { FollowSectionComponent } from "../follow-section/follow-section.component";
import { HeaderComponent } from "../header/header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-layout',
  imports: [FollowSectionComponent, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
