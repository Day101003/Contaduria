import { signal, computed } from '@angular/core';

export interface PaginationConfig {
  itemsPerPage?: number;
  currentPage?: number;
}

export function usePagination<T>(items: T[], config: PaginationConfig = {}) {
  const itemsPerPage = signal(config.itemsPerPage || 9);
  const currentPage = signal(config.currentPage || 1);

  
  const totalPages = computed(() => 
    Math.ceil(items.length / itemsPerPage())
  );

  
  const startIndex = computed(() => 
    (currentPage() - 1) * itemsPerPage()
  );

  const endIndex = computed(() => 
    startIndex() + itemsPerPage()
  );

  
  const paginatedItems = computed(() => 
    items.slice(startIndex(), endIndex())
  );

 
  const paginationInfo = computed(() => ({
    currentPage: currentPage(),
    totalPages: totalPages(),
    itemsPerPage: itemsPerPage(),
    totalItems: items.length,
    startItem: startIndex() + 1,
    endItem: Math.min(endIndex(), items.length),
    hasNextPage: currentPage() < totalPages(),
    hasPreviousPage: currentPage() > 1
  }));

  
  const nextPage = () => {
    if (currentPage() < totalPages()) {
      currentPage.set(currentPage() + 1);
    }
  };

  const previousPage = () => {
    if (currentPage() > 1) {
      currentPage.set(currentPage() - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages()) {
      currentPage.set(page);
    }
  };

  const setItemsPerPage = (perPage: number) => {
    itemsPerPage.set(perPage);
    currentPage.set(1); 
  };

 
  const pageNumbers = computed(() => {
    const pages: number[] = [];
    const total = totalPages();
    const current = currentPage();
    
    if (total <= 7) {
   
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
     
      pages.push(1);
      
      if (current > 3) {
        pages.push(-1); 
      }
      
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (current < total - 2) {
        pages.push(-1); 
      }
      
      pages.push(total);
    }
    
    return pages;
  });

  return {
   
    currentPage,
    itemsPerPage,
    
    
    paginatedItems,
    totalPages,
    paginationInfo,
    pageNumbers,
    
   
    nextPage,
    previousPage,
    goToPage,
    setItemsPerPage
  };
}
