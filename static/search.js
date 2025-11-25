document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const postsList = document.getElementById('posts-list');

    if (!searchInput || !postsList) return;

    const articles = postsList.querySelectorAll('article');

    const filterPosts = (query) => {
        query = query.toLowerCase();
        articles.forEach(article => {
            const title = article.getAttribute('data-title').toLowerCase();
            const tags = article.getAttribute('data-tags').toLowerCase();

            if (title.includes(query) || tags.includes(query)) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        });
    };

    searchInput.addEventListener('input', (e) => {
        filterPosts(e.target.value);
    });

    // Check for query param on load
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (query) {
        searchInput.value = query;
        filterPosts(query);
    }
});
