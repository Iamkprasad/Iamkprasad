// Dark mode — default to light, toggle via localStorage only
(function() {
    var saved = localStorage.getItem('theme') || 'light';
    if (saved === 'dark') {
        document.documentElement.classList.add('dark');
    }
})();

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

function handleImgError(img) {
    img.onerror = null;
    var d = document.createElement('div');
    d.style.cssText = 'background:var(--border);border-radius:4px;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:13px;font-family:Outfit,sans-serif;';
    d.style.width = img.style.width || '100%';
    d.style.height = img.style.height || '200px';
    d.textContent = 'Image unavailable';
    if (img.parentNode) img.parentNode.replaceChild(d, img);
}

// Mobile menu — runs immediately (defer script guarantees DOM is parsed)
(function() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');

    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('open');
            if (menuIcon) menuIcon.classList.toggle('hidden');
            if (closeIcon) closeIcon.classList.toggle('hidden');
        });
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const cacheBuster = `?t=${new Date().getTime()}`;

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
                                <img src="${img.image}" alt="${img.title}" class="stack-img" loading="lazy" onerror="handleImgError(this)">
                                <div class="stack-overlay"></div>
                            </div>
                            <div class="stack-text">
                                <h2 class="stack-title">${img.title}</h2>
                                <p class="stack-desc">${img.desc}</p>
                            </div>
                        </div>
                    </div>
                `).join('');
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
                filtered = filtered.filter(p => p.category === blogFilter);
            }
            if (blogSearch) {
                filtered = filtered.filter(p =>
                    p.title.toLowerCase().includes(blogSearch) ||
                    p.summary.toLowerCase().includes(blogSearch)
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
                <a href="post.html?id=${item.id}" class="blog-card">
                    <span class="blog-card-tag">${item.category}</span>
                    <h2 class="blog-card-title">${item.title}</h2>
                    <p class="blog-card-excerpt">${item.summary}</p>
                    <div class="blog-card-footer">
                        <div class="blog-card-meta"><strong>${item.author}</strong> · ${item.published_date} · ${item.read_time}</div>
                        <span class="blog-card-more">Read more →</span>
                    </div>
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
                filtered = filtered.filter(p => p.category === newsFilter);
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
                <a href="post.html?id=${item.id}" class="blog-card">
                    <span class="blog-card-tag">${item.category}</span>
                    <h2 class="blog-card-title">${item.title}</h2>
                    <p class="blog-card-excerpt">${item.summary}</p>
                    <div class="blog-card-footer">
                        <div class="blog-card-meta"><strong>${item.source || item.author}</strong> · ${item.published_date}</div>
                        <span class="blog-card-more">Read more →</span>
                    </div>
                </a>
            `).join('');
        }
    }

    // Single post view
    const singlePostContainer = document.getElementById('single-post-container');
    if (singlePostContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id') || null;
        const postSlug = urlParams.get('slug') || (window.location.hash ? window.location.hash.substring(1) : null);

        if (!postId && !postSlug) {
            singlePostContainer.innerHTML = '<div class="text-center py-20" style="color: var(--text-muted);">No post specified.</div>';
        } else {
            Promise.all([
                loadData(`data/blogs.json${cacheBuster}`).catch(() => []),
                loadData(`data/news.json${cacheBuster}`).catch(() => [])
            ]).then(([blogs, news]) => {
                const allItems = [...blogs, ...news];
                var post;
                if (postId) {
                    post = allItems.find(item => item.id === postId);
                } else {
                    post = allItems.find(item => item.slug === postSlug);
                }

                if (!post) {
                    singlePostContainer.innerHTML = '<div class="text-center py-20" style="color: var(--text-muted);">Post not found.</div>';
                    return;
                }

                document.title = `${post.title} | BimaNiti`;

                const formattedContent = (post.content || post.summary || '').replace(/\*(.*?)\*/g, '<strong>$1</strong>').replace(/_(.*?)_/g, '<em>$1</em>');

                // Previous coverage banner
                var prevHtml = '';
                if (post.previous_coverage) {
                    prevHtml = `
                        <div class="prev-coverage-banner">
                            📌 Earlier coverage:
                            <a href="post.html?id=${post.previous_coverage.id}">
                                ${post.previous_coverage.title}
                            </a> →
                        </div>
                    `;
                }

                // Related articles
                var relatedHtml = '';
                if (post.related_ids && post.related_ids.length > 0) {
                    var relatedItems = allItems.filter(function(r) {
                        return post.related_ids.indexOf(r.id) !== -1;
                    });
                    if (relatedItems.length > 0) {
                        relatedHtml = '<div style="max-width:680px;margin:3rem auto 0;border-top:1px solid var(--border);padding-top:2rem;">';
                        relatedHtml += '<div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted);margin-bottom:1rem;">Related Coverage</div>';
                        relatedHtml += '<div style="display:grid;gap:1rem;">';
                        relatedItems.forEach(function(r) {
                            relatedHtml += `
                                <a href="post.html?id=${r.id}" style="display:block;background:var(--bg-primary);border:1px solid var(--border);border-radius:8px;padding:16px;text-decoration:none;transition:border-color 0.15s;">
                                    <span style="display:inline-block;font-size:10px;padding:2px 8px;border-radius:20px;background:var(--accent);color:#fff;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">${r.category}</span>
                                    <div style="font-family:var(--font-display);font-size:16px;color:var(--text-primary);margin-bottom:4px;">${r.title}</div>
                                    <div style="font-size:12px;color:var(--text-muted);">${r.published_date}</div>
                                </a>
                            `;
                        });
                        relatedHtml += '</div></div>';
                    }
                }

                singlePostContainer.innerHTML = `
                    <div class="post-hero">
                        <div class="post-hero-inner">
                            <span class="post-hero-tag">${post.category}</span>
                            <h1>${post.title}</h1>
                            <div class="post-hero-byline"><strong>${post.author || 'BimaNiti'}</strong> · ${post.published_date} · ${post.read_time || '6 min read'}</div>
                        </div>
                    </div>
                    <div class="post-body-wrapper">
                        <div class="post-content">${prevHtml}${formattedContent}</div>
                        ${relatedHtml}
                        <div class="post-sources" style="max-width: 680px; margin: 3rem auto 0; border-top: 1px solid var(--border); padding-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
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
                ...news.map(n => ({ ...n, type: 'News', _sortDate: n.published_date }))
            ].sort((a, b) => {
                if (a.published_date < b.published_date) return 1;
                if (a.published_date > b.published_date) return -1;
                return 0;
            });

            if (allItems.length === 0) {
                archivesContainer.innerHTML = '<p class="text-center" style="color: var(--text-muted); padding: 3rem 0;">No content archived yet.</p>';
                return;
            }

            // Group by month
            var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            var grouped = {};
            allItems.forEach(function(item) {
                var parts = item.published_date.split('-');
                var monthKey = parts[0] + '-' + parts[1];
                var label = monthNames[parseInt(parts[1]) - 1] + ' ' + parts[0];
                if (!grouped[monthKey]) grouped[monthKey] = { label: label, items: [] };
                grouped[monthKey].items.push(item);
            });

            // Sort months descending
            var monthKeys = Object.keys(grouped).sort().reverse();

            var html = '';
            monthKeys.forEach(function(key) {
                html += '<div class="archive-section-title">' + grouped[key].label + '</div>';
                grouped[key].items.forEach(function(item) {
                    html += `
                        <a href="post.html?id=${item.id}" class="archive-row" style="display: flex; justify-content: space-between; align-items: baseline;">
                            <div class="archive-row-left">
                                <span class="archive-row-tag">${item.id}</span>
                                <span class="archive-row-tag">${item.type}</span>
                                <span class="archive-row-title">${item.title}</span>
                            </div>
                            <span class="archive-row-date">${item.published_date}</span>
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
                    <a href="post.html?id=${blog.id}" class="card-link">
                        <article class="card">
                            <div class="card-body">
                                <span class="card-label">${blog.category}</span>
                                <h3 class="card-title">${blog.title}</h3>
                                <p class="card-excerpt">${blog.summary}</p>
                                <div class="card-meta">
                                    <span>${blog.published_date}</span>
                                    <span>·</span>
                                    <span>${blog.author}</span>
                                </div>
                            </div>
                        </article>
                    </a>
                `).join('');
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
                    <a href="post.html?id=${item.id}" class="post-card">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem;">
                            <span class="news-source">${item.source || item.author}</span>
                            <span style="font-size: 0.75rem; color: var(--text-muted); white-space: nowrap;">${item.published_date}</span>
                        </div>
                        <h3 style="font-family: var(--font-display); font-size: 1.1rem; color: var(--text-primary); margin: 0.5rem 0;">${item.title}</h3>
                        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${item.summary}</p>
                    </a>
                `).join('');
            })
            .catch(() => {});
    }

    // Theme toggle
    var toggle = document.querySelector('.theme-toggle');
    if (toggle) {
        toggle.addEventListener('click', function() {
            var html = document.documentElement;
            var isDark = html.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
});
