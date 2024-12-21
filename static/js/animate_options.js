document.addEventListener('DOMContentLoaded', function() {
    const mainContainer = document.getElementById('mainContainer');
    const optionsGrid = document.getElementById('optionsGrid');
    const options = document.querySelectorAll('.option-container');
    let isGridTransformed = false;

    options.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!isGridTransformed) {
                // Transform grid to sidebar
                optionsGrid.classList.add('sidebar-mode');
                mainContainer.classList.add('sidebar-active');
                isGridTransformed = true;

                // Remove active class from all options and add to clicked one
                options.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                // Show content area
                const contentType = this.getAttribute('data-content');
                const contentArea = document.getElementById(contentType + 'Content');
                document.querySelectorAll('.content-area').forEach(area => {
                    area.classList.remove('active');
                });
                contentArea.classList.add('active');
            } else {
                // Just switch content if already in sidebar mode
                options.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                const contentType = this.getAttribute('data-content');
                const contentArea = document.getElementById(contentType + 'Content');
                document.querySelectorAll('.content-area').forEach(area => {
                    area.classList.remove('active');
                });
                contentArea.classList.add('active');
            }
        });
    });
});