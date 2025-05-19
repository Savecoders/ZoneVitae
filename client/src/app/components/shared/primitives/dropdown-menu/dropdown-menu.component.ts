import {
  Component,
  Input,
  Output,
  ElementRef,
  HostListener,
  ViewChild,
  ContentChild,
  TemplateRef,
  Optional,
  OnInit,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  CheckCheckIcon,
  ChevronDownIcon,
  LucideIconData,
} from 'lucide-angular';

export interface DropdownItem {
  id: string | number;
  label?: string;
  shortcut?: string;
  icon?: LucideIconData;
  disabled?: boolean;
  divider?: boolean;
  children?: DropdownItem[];
  href?: string;
}

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.css'],
})
export class DropdownMenuComponent implements OnInit {
  // Icons
  ChevronDownIcon = ChevronDownIcon;
  CheckCheckIcon = CheckCheckIcon;

  @Input() items: DropdownItem[] = [];
  @Input() label = 'Options';
  @Input() showChevron = true;
  @Input() disabled = false;
  @Input() maxHeight = '300px';
  @Input() minWidth = '200px';
  @Input() align: 'left' | 'right' = 'left';
  @Input() selectedItem: DropdownItem | null = null;
  @Input() showSelectedCheck = false;
  @Input() buttonClass =
    'inline-flex justify-center w-full rounded-md border border-content2 bg-content1 px-4 py-2 text-sm font-medium text-default-700 hover:bg-content2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary';
  @Input() menuClass = 'bg-content1 text-default-700 max-h-60';

  @Output() itemSelected = new EventEmitter<DropdownItem>();
  @Output() menuToggled = new EventEmitter<boolean>();

  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;
  @ContentChild('triggerTemplate') triggerTemplateRef?: TemplateRef<any>;
  @ContentChild('menuTemplate') menuTemplateRef?: TemplateRef<any>;

  isOpen = false;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {}

  toggleMenu(): void {
    if (this.disabled) return;

    this.isOpen = !this.isOpen;
    this.menuToggled.emit(this.isOpen);
  }

  closeMenu(): void {
    if (this.isOpen) {
      this.isOpen = false;
      this.menuToggled.emit(false);
    }
  }

  onSelect(event: Event, item: DropdownItem): void {
    event.preventDefault();

    if (item.disabled) {
      return;
    }

    this.selectedItem = item;
    this.itemSelected.emit(item);

    // Close the menu after selection unless it has children
    if (!item.children) {
      this.closeMenu();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Close the menu if clicked outside
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onKeydownEscape(): void {
    this.closeMenu();
  }
}
