const initBg = (autoplay = true) => {
    const bgImgsNames = [
        '40performance.jpg',
        '01-backlight.jpg',
        '03performance.jpg',
        '65performance.jpg',
        '09performance.jpg',
        '51performance.jpg',
        '10performance.jpg',
        '14performance.jpg',
        '17performance.jpg',
        '20performance.jpg',
        '11performance.jpg',
        '25performance.jpg',
        '36performance.jpg',
        '43performance.jpg',
        '54performance.jpg',
        '60performance.jpg',
        'Group2.jpg'
    ];
    const bgImgs = bgImgsNames.map(img => "img/" + img);

    $.backstretch(bgImgs, { duration: 4000, fade: 500 });

    if (!autoplay) {
        $.backstretch('pause');
    }
}

const setBg = id => {
    $.backstretch('show', id);
}

const setBgOverlay = () => {
    const windowWidth = window.innerWidth;
    const bgHeight = $('body').height();
    const tmBgLeft = $('.tm-bg-left');

    $('.tm-bg').height(bgHeight);

    if (windowWidth > 768) {
        tmBgLeft.css('border-left', `0`)
            .css('border-top', `${bgHeight}px solid transparent`);
    } else {
        tmBgLeft.css('border-left', `${windowWidth}px solid transparent`)
            .css('border-top', `0`);
    }
}

$(document).ready(function() {

    const autoplayBg = true; // set Auto Play for Background Images
    initBg(autoplayBg);
    setBgOverlay();

    const bgControl = $('.tm-bg-control');
    bgControl.click(function() {
        bgControl.removeClass('active');
        $(this).addClass('active');
        const id = $(this).data('id');
        setBg(id);
    });

    $(window).on("backstretch.after", function(e, instance, index) {
        const bgControl = $('.tm-bg-control');
        bgControl.removeClass('active');
        const current = $(".tm-bg-controls-wrapper").find(`[data-id=${index}]`);
        current.addClass('active');
    });

    $(window).resize(function() {
        setBgOverlay();
    });

});