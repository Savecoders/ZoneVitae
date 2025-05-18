import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  MegaphoneIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpDownIcon,
  SearchIcon,
} from 'lucide-angular';

@NgModule({
  imports: [
    CommonModule,
    LucideAngularModule.pick({
      MegaphoneIcon,
      LinkIcon,
      PencilIcon,
      TrashIcon,
      ArrowUpDownIcon,
      SearchIcon,
    }),
  ],
  exports: [LucideAngularModule],
})
export class LucideIconsModule {}
