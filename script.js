class RealBookFlipbook {
  constructor() {
    this.currentState = 0;
    this.totalStates = 5;
    this.isAnimating = false;
    this.autoFlipTimer = null;
    this.countdownTimer = null;
    this.autoFlipDelay = 10000; // 10 seconds
    this.timeRemaining = 10;
    
    this.pages = document.querySelectorAll('.flippable-page');
    this.leftDisplay = document.getElementById('leftDisplay');
    this.leftArea = document.getElementById('leftArea');
    this.rightArea = document.getElementById('rightArea');
    this.currentViewSpan = document.getElementById('currentView');
    this.timerDisplay = document.getElementById('timerDisplay');
    
    this.stateNames = [
      'Book Closed',
      'Pages 1-2',
      'Pages 3-4', 
      'Pages 5-6',
      'Page 7 & The End'
    ];

    this.leftContent = [
      '<div class="empty-page"></div>',
      '<img src="./media/Pic1.png" alt="Page 1" class="page-image">',
      '<img src="./media/Pic3.png" alt="Page 3" class="page-image">',
      '<img src="./media/Pic5.png" alt="Page 5" class="page-image">',
      '<img src="./media/Pic7.png" alt="Page 7" class="page-image">'
    ];
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateDisplay();
    this.startAutoFlip();
  }

  startAutoFlip() {
    this.clearAutoFlip();
    this.timeRemaining = 10;
    this.updateTimerDisplay();
    
    this.autoFlipTimer = setTimeout(() => {
      this.autoNextPage();
    }, this.autoFlipDelay);
    
    this.countdownTimer = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();
      
      if (this.timeRemaining <= 0) {
        clearInterval(this.countdownTimer);
      }
    }, 1000);
  }

  clearAutoFlip() {
    if (this.autoFlipTimer) {
      clearTimeout(this.autoFlipTimer);
      this.autoFlipTimer = null;
    }
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  updateTimerDisplay() {
    this.timerDisplay.textContent = this.timeRemaining;
    
    // Remove all classes first
    this.timerDisplay.classList.remove('warning', 'critical');
    
    // Add warning/critical states
    if (this.timeRemaining <= 3) {
      this.timerDisplay.classList.add('critical');
    } else if (this.timeRemaining <= 5) {
      this.timerDisplay.classList.add('warning');
    }
  }

  autoNextPage() {
    if (this.currentState >= this.totalStates - 1) {
      // At the end, go back to beginning
      this.reset();
    } else {
      this.nextPage();
    }
    // Start next timer after animation completes
    setTimeout(() => {
      this.startAutoFlip();
    }, 1000);
  }

  setupEventListeners() {
    this.leftArea.addEventListener('click', (e) => {
      e.preventDefault();
      this.clearAutoFlip();
      this.prevPage();
      this.startAutoFlip();
    });

    this.rightArea.addEventListener('click', (e) => {
      e.preventDefault();
      this.clearAutoFlip();
      this.nextPage();
      this.startAutoFlip();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.clearAutoFlip();
        this.prevPage();
        this.startAutoFlip();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        this.clearAutoFlip();
        this.nextPage();
        this.startAutoFlip();
      }
    });

    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Reset auto-flip on any mouse movement or touch
    document.addEventListener('mousemove', () => {
      this.clearAutoFlip();
      this.startAutoFlip();
    });

    document.addEventListener('touchstart', () => {
      this.clearAutoFlip();
      this.startAutoFlip();
    });
  }

  nextPage() {
    if (this.isAnimating || this.currentState >= this.totalStates - 1) {
      return;
    }

    this.isAnimating = true;
    const nextState = this.currentState + 1;
    const pageToFlip = this.currentState;

    if (pageToFlip < this.pages.length) {
      const pageElement = this.pages[pageToFlip];
      
      this.leftDisplay.classList.add('transitioning');
      
      setTimeout(() => {
        pageElement.classList.add('flipped');
        pageElement.style.zIndex = 0;
        
        setTimeout(() => {
          this.currentState = nextState;
          this.updateLeftDisplay();
          this.updateIndicator();
          this.leftDisplay.classList.remove('transitioning');
          
          setTimeout(() => {
            this.isAnimating = false;
          }, 100);
        }, 450);
      }, 50);
    } else {
      this.currentState = nextState;
      this.updateLeftDisplay();
      this.updateIndicator();
      this.isAnimating = false;
    }
  }

  prevPage() {
    if (this.isAnimating || this.currentState <= 0) {
      return;
    }

    this.isAnimating = true;
    const prevState = this.currentState - 1;
    const pageToFlip = prevState;

    if (pageToFlip < this.pages.length) {
      const pageElement = this.pages[pageToFlip];
      
      // Change left content instantly
      this.currentState = prevState;
      this.leftDisplay.innerHTML = this.leftContent[prevState];
      this.updateIndicator();
      
      // Start flip immediately - no delays
      pageElement.classList.remove('flipped');
      pageElement.style.zIndex = 4 - pageToFlip;
      
      setTimeout(() => {
        this.isAnimating = false;
      }, 900);
    } else {
      this.currentState = prevState;
      this.updateLeftDisplay();
      this.updateIndicator();
      this.isAnimating = false;
    }
  }

  updateLeftDisplay() {
    this.leftDisplay.innerHTML = this.leftContent[this.currentState];
  }

  updateDisplay() {
    this.pages.forEach((page, index) => {
      if (index < this.currentState) {
        page.classList.add('flipped');
        page.style.zIndex = 0;
      } else {
        page.classList.remove('flipped');
        page.style.zIndex = 4 - index;
      }
    });
    
    this.updateLeftDisplay();
    this.updateIndicator();
  }

  updateIndicator() {
    this.currentViewSpan.textContent = this.stateNames[this.currentState];
  }

  goToState(targetState) {
    if (this.isAnimating || targetState < 0 || targetState >= this.totalStates) {
      return;
    }
    
    this.clearAutoFlip();
    this.currentState = targetState;
    this.updateDisplay();
    setTimeout(() => {
      this.startAutoFlip();
    }, 500);
  }

  reset() {
    if (this.isAnimating) return;
    
    this.clearAutoFlip();
    this.currentState = 0;
    this.updateDisplay();
    setTimeout(() => {
      this.startAutoFlip();
    }, 500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.flipbook = new RealBookFlipbook();
});

window.goToState = (state) => {
  if (window.flipbook) {
    window.flipbook.goToState(state);
  }
};

window.resetBook = () => {
  if (window.flipbook) {
    window.flipbook.reset();
  }
};