/**
 * PleasureTowne Songs Page Controller
 * Handles search, category filtering, sorting, rendering, and responsive background resizing.
 */

(function ($) {
  'use strict';

  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'title'; // 'title', 'artist', or 'default'

  // Normalize text for flexible searching
  function normalizeText(text) {
    return (text || '').toLowerCase().trim();
  }

  // Filter and sort songs
  function getFilteredSongs() {
    if (!window.songsData || !Array.isArray(window.songsData)) {
      return [];
    }

    const query = normalizeText(searchQuery);

    let filtered = window.songsData.filter(function (song) {
      // Category check
      if (currentCategory !== 'all' && song.category !== currentCategory) {
        return false;
      }

      // Search query check (matches title, artist, or album)
      if (query) {
        const title = normalizeText(song.title);
        const artist = normalizeText(song.artist);
        const album = normalizeText(song.album);
        return title.includes(query) || artist.includes(query) || album.includes(query);
      }

      return true;
    });

    // Sorting
    if (currentSort === 'title') {
      filtered.sort(function (a, b) {
        return a.title.localeCompare(b.title);
      });
    } else if (currentSort === 'artist') {
      filtered.sort(function (a, b) {
        return a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title);
      });
    }

    return filtered;
  }

  // Render songs into the DOM
  function renderSongs() {
    const $container = $('#songs-container');
    const $countEl = $('#song-count');
    const songs = getFilteredSongs();

    if ($countEl.length) {
      const total = window.songsData ? window.songsData.length : 0;
      if (songs.length === total) {
        $countEl.text(`Showing all ${total} songs`);
      } else {
        $countEl.text(`Showing ${songs.length} of ${total} songs`);
      }
    }

    if (!songs.length) {
      $container.html(`
        <div class="tm-songs-empty text-center py-5">
          <i class="fas fa-search fa-2x mb-3 text-muted"></i>
          <p class="mb-1">No songs found matching "<strong>${escapeHtml(searchQuery)}</strong>"</p>
          <button type="button" class="btn btn-sm btn-outline-light mt-2" id="clear-search-btn">Reset search</button>
        </div>
      `);
      updateLayout();
      return;
    }

    const html = songs.map(function (song) {
      const safeTitle = escapeHtml(song.title);
      const safeArtist = escapeHtml(song.artist);
      const safeAlbum = escapeHtml(song.album);
      const safeCategory = escapeHtml(song.category || 'Party Favorite');
      const safeCover = encodeURI(song.cover || '');

      return `
        <li class="tm-song-item" data-category="${safeCategory}">
          <div class="tm-song-cover-wrap">
            <img 
              src="${safeCover}" 
              alt="${safeTitle} album art" 
              class="tm-song-cover"
              loading="lazy"
              width="64"
              height="64"
              onerror="this.onerror=null; this.src='favicon.ico';"
            />
          </div>
          <div class="tm-song-details">
            <div class="tm-song-header">
              <h3 class="tm-song-title">${safeTitle}</h3>
              <span class="tm-category-badge">${safeCategory}</span>
            </div>
            <p class="tm-song-artist"><i class="fas fa-microphone-alt fa-sm mr-1"></i>${safeArtist}</p>
            <p class="tm-song-album text-muted"><i class="fas fa-compact-disc fa-sm mr-1"></i>${safeAlbum}</p>
          </div>
        </li>
      `;
    }).join('');

    $container.html(html);
    updateLayout();
  }

  // Escape HTML helper
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Recalculate background overlay height from templatemo-script.js
  function updateLayout() {
    if (typeof setBgOverlay === 'function') {
      setTimeout(function () {
        setBgOverlay();
      }, 50);
    }
  }

  // Setup category filter counts and buttons
  function initCategories() {
    if (!window.songsData) return;

    // Count songs per category
    const counts = { all: window.songsData.length };
    window.songsData.forEach(function (song) {
      const cat = song.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    $('.tm-filter-pill').each(function () {
      const cat = $(this).data('category');
      const count = counts[cat] !== undefined ? counts[cat] : 0;
      $(this).find('.badge-count').text(count);
    });
  }

  // Initialize event listeners
  $(document).ready(function () {
    initCategories();
    renderSongs();

    // Search input listener with instant feedback
    $('#song-search-input').on('input', function () {
      searchQuery = $(this).val();
      $('#search-clear-btn').toggle(Boolean(searchQuery));
      renderSongs();
    });

    // Clear search button
    $('#search-clear-btn').on('click', function () {
      $('#song-search-input').val('').focus();
      searchQuery = '';
      $(this).hide();
      renderSongs();
    });

    // Reset search from empty state
    $(document).on('click', '#clear-search-btn', function () {
      $('#song-search-input').val('');
      searchQuery = '';
      $('#search-clear-btn').hide();
      currentCategory = 'all';
      $('.tm-filter-pill').removeClass('active');
      $('.tm-filter-pill[data-category="all"]').addClass('active');
      renderSongs();
    });

    // Category filter pills click
    $('.tm-filter-pill').on('click', function (e) {
      e.preventDefault();
      $('.tm-filter-pill').removeClass('active');
      $(this).addClass('active');
      currentCategory = $(this).data('category');
      renderSongs();
    });

    // Sort selector change
    $('#song-sort-select').on('change', function () {
      currentSort = $(this).val();
      renderSongs();
    });
  });

})(jQuery);
