// Performance monitoring and optimization helper
export const performanceMonitor = {
  // Measure page load performance
  measurePageLoad: () => {
    if (typeof window !== "undefined" && window.performance) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domContentLoaded =
        timing.domContentLoadedEventEnd - timing.navigationStart;

      console.log(`Page Load Time: ${loadTime}ms`);
      console.log(`DOM Content Loaded: ${domContentLoaded}ms`);

      return { loadTime, domContentLoaded };
    }
  },

  // Measure component render time
  measureComponentRender: (componentName, startTime) => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
    return renderTime;
  },

  // Lazy loading observer for images
  createImageObserver: () => {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove("lazy");
            observer.unobserve(img);
          }
        });
      });
      return observer;
    }
    return null;
  },
};
