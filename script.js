function loadData(url) {
    return fetch(url, { mode: 'same-origin' }).then(function(r) { if (!r.ok) throw new Error('HTTP '+r.status); return r.json(); }).catch(function() {
        return new Promise(function(resolve, reject) {
            try {
                var x = new XMLHttpRequest();
                x.open('GET', url, true);
                x.onreadystatechange = function() {
                    if (x.readyState === 4) {
                        if (x.status === 0 || x.status === 200) { try { resolve(JSON.parse(x.responseText)); } catch(e) { reject(e); } }
                        else { reject(new Error('XHR '+x.status)); }
                    }
                };
                x.onerror = function() { reject(new Error('Network')); };
                x.send();
            } catch(e) { reject(e); }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const cacheBuster = `?t=${new Date().getTime()}`;
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    setTimeout(() => {
        document.querySelectorAll('.scroll-anim').forEach(el => scrollObserver.observe(el));
    }, 100);

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const progressBar = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        const winScroll = window.pageYOffset || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        if (progressBar) progressBar.style.width = `${scrolled}%`;
        if (navbar) {
            if (winScroll > 50) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');

    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', () => {
            const isOpen = mobileNav.classList.contains('open');
            mobileNav.classList.toggle('open');
            menuIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });
    }

    // Current year
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // Profile data loading
    let profileData = null;
    loadData(`data/profile.json${cacheBuster}`)
        .then(data => { profileData = data; })
        .catch(() => {});

    // Stacking gallery on home page
    const stackingContainer = document.getElementById('stacking-container');
    if (stackingContainer) {
        loadData(`data/stack-images.json${cacheBuster}`)
            .then(data => {
                stackingContainer.innerHTML = data.map(img => `
                    <div class="stack-layer">
                        <div class="stack-content">
                            <div class="stack-img-wrapper">
                                <img src="${img.image}" alt="${img.title}" class="stack-img" loading="lazy">
                                <div class="stack-overlay"></div>
                            </div>
                            <div class="stack-text scroll-anim">
                                <h2 class="stack-title">${img.title}</h2>
                                <p class="stack-desc">${img.desc}</p>
                            </div>
                        </div>
                    </div>
                `).join('');
                stackingContainer.querySelectorAll('.scroll-anim').forEach(el => scrollObserver.observe(el));
            })
            .catch(() => {});
    }

    // Blog listing page (with filters)
    const blogFeedContainer = document.getElementById('blog-feed-container');
    const blogFilters = document.getElementById('blog-filters');
    if (blogFeedContainer && blogFilters) {
        let allBlogPosts = [];
        let blogFilter = 'all';
        let blogSearch = '';

        loadData(`data/blogs.json${cacheBuster}`)
            .then(data => {
                allBlogPosts = data;
                renderBlogPage(data);
            })
            .catch(() => {
                blogFeedContainer.innerHTML = '<p class="text-center" style="color: var(--text-muted); padding: 3rem 0;">Unable to load blog posts.</p>';
            });

        document.querySelectorAll('#blog-filters .filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                blogFilter = this.dataset.filter;
                document.querySelectorAll('#blog-filters .filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                filterBlogPage();
            });
        });

        const blogSearchInput = document.getElementById('blog-search');
        if (blogSearchInput) {
            blogSearchInput.addEventListener('input', function() {
                blogSearch = this.value.toLowerCase();
                filterBlogPage();
            });
        }

        function filterBlogPage() {
            let filtered = allBlogPosts;
            if (blogFilter !== 'all') {
                filtered = filtered.filter(p => p.label === blogFilter);
            }
            if (blogSearch) {
                filtered = filtered.filter(p =>
                    p.title.toLowerCase().includes(blogSearch) ||
                    p.excerpt.toLowerCase().includes(blogSearch)
                );
            }
            renderBlogPage(filtered);
        }

        function renderBlogPage(posts) {
            if (posts.length === 0) {
                blogFeedContainer.innerHTML = '<p class="text-center" style="color: var(--text-muted); padding: 3rem 0;">No posts match your criteria.</p>';
                return;
            }
            blogFeedContainer.innerHTML = posts.map((item, index) => `
                <a href="post.html?id=${item.id}" class="blog-summary-card fade-in-up" style="animation-delay: ${0.05 + (index * 0.03)}s; display: block; margin-bottom: 1rem;">
                    <div class="blog-summary-content">
                        <span class="card-label">${item.label}</span>
                        <h2 class="blog-card-title">${item.title}</h2>
                        <p class="card-excerpt" style="margin-bottom: 0.75rem;">${item.excerpt}</p>
                        <div class="card-meta" style="margin-top: 0;">
                            <span>${item.author}</span>
                            <span>·</span>
                            <span>${item.date}</span>
                            <span style="margin-left: auto; color: var(--accent); font-weight: 500; font-size: 0.85rem;">Read more →</span>
                        </div>
                    </div>
                    ${item.image ? `<div class="blog-summary-img-wrapper"><img src="${item.image}" alt="${item.title}" class="blog-summary-img" loading="lazy"></div>` : ''}
                </a>
            `).join('');
        }
    }

    // News listing page (with filters)
    const newsFeedContainer = document.getElementById('news-feed-container');
    const newsFilters = document.getElementById('news-filters');
    if (newsFeedContainer && newsFilters) {
        let allNewsItems = [];
        let newsFilter = 'all';
        let newsSearch = '';

        loadData(`data/news.json${cacheBuster}`)
            .then(data => {
                allNewsItems = data;
                renderNewsPage(data);
            })
            .catch(() => {
                newsFeedContainer.innerHTML = '<p class="text-center" style="color: var(--text-muted); padding: 3rem 0;">Unable to load news.</p>';
            });

        document.querySelectorAll('#news-filters .filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                newsFilter = this.dataset.filter;
                document.querySelectorAll('#news-filters .filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                filterNewsPage();
            });
        });

        const newsSearchInput = document.getElementById('news-search');
        if (newsSearchInput) {
            newsSearchInput.addEventListener('input', function() {
                newsSearch = this.value.toLowerCase();
                filterNewsPage();
            });
        }

        function filterNewsPage() {
            let filtered = allNewsItems;
            if (newsFilter !== 'all') {
                filtered = filtered.filter(p => p.label === newsFilter);
            }
            if (newsSearch) {
                filtered = filtered.filter(p =>
                    p.title.toLowerCase().includes(newsSearch) ||
                    p.summary.toLowerCase().includes(newsSearch)
                );
            }
            renderNewsPage(filtered);
        }

        function renderNewsPage(items) {
            if (items.length === 0) {
                newsFeedContainer.innerHTML = '<p class="text-center" style="color: var(--text-muted); padding: 3rem 0;">No news items match your criteria.</p>';
                return;
            }
            newsFeedContainer.innerHTML = items.map((item, index) => `
                <a href="post.html?id=${item.id}" class="post-card fade-in-up" style="animation-delay: ${0.05 + (index * 0.03)}s; display: block; margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
                        <span class="news-source">${item.source}</span>
                        <span style="font-size: 0.75rem; color: var(--text-muted); white-space: nowrap;">${item.date}</span>
                    </div>
                    <h2 class="post-card-title">${item.title}</h2>
                    <p class="post-card-desc">${item.summary}</p>
                    <div class="post-card-meta">
                        <span class="card-label" style="margin: 0;">${item.label}</span>
                    </div>
                </a>
            `).join('');
        }
    }

    // Single post view
    const singlePostContainer = document.getElementById('single-post-container');
    if (singlePostContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id') || (window.location.hash ? window.location.hash.substring(1) : null);

        if (!postId) {
            singlePostContainer.innerHTML = '<div class="text-center py-20" style="color: var(--text-muted);">No post specified.</div>';
        } else {
            Promise.all([
                loadData(`data/blogs.json${cacheBuster}`).catch(() => []),
                loadData(`data/news.json${cacheBuster}`).catch(() => [])
            ]).then(([blogs, news]) => {
                const allItems = [...blogs, ...news];
                const post = allItems.find(item => item.id === postId);

                if (!post) {
                    singlePostContainer.innerHTML = '<div class="text-center py-20" style="color: var(--text-muted);">Post not found.</div>';
                    return;
                }

                document.title = `${post.title} | Prasad Kulal`;

                let formattedContent = post.content || post.summary;
                if (formattedContent) {
                    formattedContent = formattedContent
                        .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
                        .replace(/_(.*?)_/g, '<em>$1</em>');
                }

                singlePostContainer.innerHTML = `
                    <div class="post-header px-6">
                        <div class="max-w-4xl mx-auto text-center">
                            <span class="card-label" style="color: var(--accent);">${post.label}</span>
                            <h1 class="text-3xl md-text-5xl font-serif" style="color: var(--page-bg); margin: 0.75rem 0;">${post.title}</h1>
                            <div style="color: hsla(40, 30%, 90%, 0.5); font-size: 0.9rem;">
                                <span>${post.author || 'Prasad Chandra Kulal'}</span>
                                <span style="margin: 0 0.5rem;">·</span>
                                <span>${post.date}</span>
                                ${post.source ? `<span style="margin: 0 0.5rem;">·</span><span>${post.source}</span>` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="px-6 py-24">
                        <div class="max-w-3xl mx-auto">
                            ${post.image ? `<div style="border-radius: 8px; overflow: hidden; margin-bottom: 2.5rem; max-height: 450px; box-shadow: 0 4px 16px rgba(28,43,58,0.08);"><img src="${post.image}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;"></div>` : ''}
                            <div class="post-content">${formattedContent}</div>
                            <div style="margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                                <span style="font-size: 0.85rem; color: var(--text-muted);">Share this article</span>
                                <div style="display: flex; gap: 0.5rem;">
                                    <button class="share-btn" onclick="window.open('https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(window.location.href),'_blank')">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                        LinkedIn
                                    </button>
                                    <button class="share-btn" onclick="window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(document.title)+' '+encodeURIComponent(window.location.href),'_blank')">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                        X
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
    }

    // Archives page
    const archivesContainer = document.getElementById('archives-container');
    if (archivesContainer) {
        Promise.all([
            loadData(`data/blogs.json${cacheBuster}`).catch(() => []),
            loadData(`data/news.json${cacheBuster}`).catch(() => [])
        ]).then(([blogs, news]) => {
            const allItems = [
                ...blogs.map(b => ({ ...b, type: 'Blog' })),
                ...news.map(n => ({ ...n, type: 'News' }))
            ].sort((a, b) => new Date(b.date) - new Date(a.date));

            if (allItems.length === 0) {
                archivesContainer.innerHTML = '<p class="text-center" style="color: var(--text-muted); padding: 3rem 0;">No content archived yet.</p>';
                return;
            }

            const grouped = {};
            allItems.forEach(item => {
                const cat = item.type;
                if (!grouped[cat]) grouped[cat] = [];
                grouped[cat].push(item);
            });

            let html = '';
            Object.keys(grouped).forEach(category => {
                html += `<h2 class="archive-year" style="margin-top: 2.5rem;">${category}</h2>`;
                grouped[category].forEach((item, i) => {
                    html += `
                        <a href="post.html?id=${item.id}" class="post-card" style="margin-bottom: 1rem; display: block;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
                                <div>
                                    <span class="card-label" style="margin-bottom: 0.25rem;">${item.label}</span>
                                    <h3 style="font-family: var(--font-display); font-size: 1.1rem; color: var(--text-dark); margin-top: 0.25rem;">${item.title}</h3>
                                </div>
                                <span style="font-size: 0.75rem; color: var(--text-muted); white-space: nowrap;">${item.date}</span>
                            </div>
                        </a>
                    `;
                });
            });

            archivesContainer.innerHTML = html;
        }).catch(() => {
            archivesContainer.innerHTML = '<p class="text-center" style="color: var(--text-muted); padding: 3rem 0;">Unable to load archives.</p>';
        });
    }

    // Featured posts on home
    const featuredContainer = document.getElementById('featured-posts');
    if (featuredContainer) {
        loadData(`data/blogs.json${cacheBuster}`)
            .then(blogs => {
                const featured = blogs.slice(0, 3);
                featuredContainer.innerHTML = featured.map((blog, index) => `
                    <a href="post.html?id=${blog.id}" class="card-link scroll-anim" style="${index === 1 ? 'transition-delay: 0.15s;' : index === 2 ? 'transition-delay: 0.3s;' : ''}">
                        <article class="card">
                            <img src="${blog.image || 'assets/images/blog/default.jpg'}" alt="${blog.title}" class="card-img" loading="lazy">
                            <div class="card-body">
                                <span class="card-label">${blog.label}</span>
                                <h3 class="card-title">${blog.title}</h3>
                                <p class="card-excerpt">${blog.excerpt}</p>
                                <div class="card-meta">
                                    <span>${blog.date}</span>
                                    <span>·</span>
                                    <span>${blog.author}</span>
                                </div>
                            </div>
                        </article>
                    </a>
                `).join('');
                featuredContainer.querySelectorAll('.scroll-anim').forEach(el => scrollObserver.observe(el));
            })
            .catch(() => {});
    }

    // Latest news on home
    const latestNews = document.getElementById('latest-news');
    if (latestNews) {
        loadData(`data/news.json${cacheBuster}`)
            .then(news => {
                const latest = news.slice(0, 3);
                latestNews.innerHTML = latest.map(item => `
                    <a href="post.html?id=${item.id}" class="post-card scroll-anim" style="display: block;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem;">
                            <span class="news-source">${item.source}</span>
                            <span style="font-size: 0.75rem; color: var(--text-muted); white-space: nowrap;">${item.date}</span>
                        </div>
                        <h3 style="font-family: var(--font-display); font-size: 1.1rem; color: var(--text-dark); margin: 0.5rem 0;">${item.title}</h3>
                        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${item.summary}</p>
                    </a>
                `).join('');
                latestNews.querySelectorAll('.scroll-anim').forEach(el => scrollObserver.observe(el));
            })
            .catch(() => {});
    }
});
