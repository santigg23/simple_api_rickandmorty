import { Component, OnInit } from '@angular/core';
import { RickMortyService } from './services/rick-morty';
import { Character } from './interfaces/character.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  characters: Character[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  loading: boolean = false;
  itemsPerPage: number = 12;
  displayedCharacters: Character[] = [];

  constructor(private rickMortyService: RickMortyService) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    this.loading = true;
    const apiPage = Math.ceil((this.currentPage * this.itemsPerPage) / 20);
    
    this.rickMortyService.getCharacters(apiPage).subscribe({
      next: (response) => {
        this.characters = response.results;
        this.totalPages = Math.ceil(response.info.count / this.itemsPerPage);
        this.updateDisplayedCharacters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading characters:', error);
        this.loading = false;
      }
    });
  }

  updateDisplayedCharacters(): void {
    const startIndex = ((this.currentPage - 1) * this.itemsPerPage) % 20;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedCharacters = this.characters.slice(startIndex, endIndex);
    
    if (this.displayedCharacters.length < this.itemsPerPage && this.currentPage < this.totalPages) {
      this.loadMoreCharacters();
    }
  }

  loadMoreCharacters(): void {
    const nextApiPage = Math.ceil((this.currentPage * this.itemsPerPage) / 20) + 1;
    
    this.rickMortyService.getCharacters(nextApiPage).subscribe({
      next: (response) => {
        this.characters = [...this.characters, ...response.results];
        this.updateDisplayedCharacters();
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedCharacters();
      
      if (this.displayedCharacters.length < this.itemsPerPage) {
        this.loadCharacters();
      }
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedCharacters();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadCharacters();
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}