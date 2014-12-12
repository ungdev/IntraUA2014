/* jshint strict: true, undef: true, browser: true, jquery: true */

(function () {
    'use strict';

    /**
     * Loads the given html fragment
     * @param {Element}  $target  The target where to put the fragment
     * @param {String}   link     The link to the fragment
     * @param {Function} callback The callback to call when the load is done
     */
    function loadPartial ($target, link, callback) {
        $target.load('partials/' + link, callback);
        location.hash = '!/' + link;
    }

    /**
     * Binds every links that has to load a partial
     */
    function bindLinks () {
        var $target = $('#page-content-wrapper');
        var $links  = $('[data-load-partial]');

        $links.off('click').click(function (e) {
            e.preventDefault();

            var $self = $(this);
            var link = $self.attr('data-load-partial');
            if (!link) {
                return;
            }

            $links.filter('.active').removeClass('active');
            $self.addClass('active');
            loadPartial($target, link, bindLinks);
        });
    }

    bindLinks();

    window.bindLinks = bindLinks;

    // Bind hashtag change in url
    window.onhashchange = function (e) {
        // Clear bootsrap-datetimepicker
        $('script').last().nextUntil().remove();

        var linkArr = location.hash.split('#!/');
        if (linkArr.length === 1 && linkArr[0] === '') {
            linkArr = ['', ''];
        }

        if (linkArr.length === 2) {
            var link = (linkArr[1] === '') ? 'index.html' : linkArr[1].trim();
            var $target = $('#page-content-wrapper');
            var $link = $('[data-load-partial="' + link + '"]');
            $link.addClass('active');
            loadPartial($target, link, function () {
                bindLinks();
            });
        }
    };
    window.onhashchange({
        oldURL: false
    });
}());
