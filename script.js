class Flipbook {
      constructor() {
        this.currentPage = 0;
        this.totalPages = 8; // 4 physical pages × 2 sides
        this.pages = document.querySelectorAll('.page');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentPageSpan = document.getElementById('currentPage');
        
        this.init();
      }

      init() {
        this.updateDisplay();
        this.bindEvents();
      }

      bindEvents() {
        this.nextBtn.addEventListener('click', () => this.nextPage());
        this.prevBtn.addEventListener('click', () => this.prevPage());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            this.nextPage();
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.prevPage();
          }
        });

        // Optional: Click on pages to navigate
        this.pages.forEach((page, index) => {
          page.addEventListener('click', (e) => {
            const rect = page.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const pageWidth = rect.width;
            
            // Click on right side to go forward, left side to go back
            if (clickX > pageWidth * 0.7) {
              this.nextPage();
            } else if (clickX < pageWidth * 0.3) {
              this.prevPage();
            }
          });
        });
      }

      nextPage() {
        if (this.currentPage < this.totalPages - 1) {
          this.currentPage++;
          this.updateDisplay();
        }
      }

      prevPage() {
        if (this.currentPage > 0) {
          this.currentPage--;
          this.updateDisplay();
        }
      }

      updateDisplay() {
        // Calculate which physical pages should be flipped
        const pagesFlipped = Math.floor(this.currentPage / 2);
        
        this.pages.forEach((page, index) => {
          if (index < pagesFlipped) {
            page.classList.add('flipped');
          } else {
            page.classList.remove('flipped');
          }
        });

        // Update page counter
        this.currentPageSpan.textContent = this.currentPage + 1;

        // Update button states
        this.prevBtn.disabled = this.currentPage === 0;
        this.nextBtn.disabled = this.currentPage === this.totalPages - 1;
      }
    }

    // Initialize the flipbook when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
      new Flipbook();
    });