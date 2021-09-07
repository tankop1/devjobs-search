// LOAD CARDS

let numberCards = 9;
let jobs;

function loadMore() {
    numberCards += 3;
    loadCards(jobs);
}

$('.load-more').click(loadMore);

function accessJSON() {
    let requestURL = './data.json';
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = function() {
        jobs = request.response;
        loadCards(jobs);
    }
}

function loadCards(jobs) {
    let filteredJobs = filterJobs(jobs);
    let newJobs = filteredJobs.map(obj => {
        return `<article class="card">
<div class="job-logo" style="background-image: url(${obj.logo}); background-color: ${obj.logoBackground};"></div>
<p class="job-info">${obj.postedAt} • ${obj.contract}</p>
<a href="#" class="card-link" id="${obj.id}">${obj.position}</a>
<p class="job-company">${obj.company}</p>
<p class="job-location">${obj.location}</p>
</article>`;
    });

    $('main').html(newJobs.splice(0, numberCards));

    $('.card-link').click(toJobDescription);

    $('.logo').click(() => {
        toJobDashboard();
    });
}

$(document).ready(accessJSON);


// FILTERING RESULTS

let filters = {company: '', location: '', contract: ''};

$('.full-time-section button').click(() => {
    filters.company = $('#search').val();
    filters.location = $('#location').val();
    filters.contract = $('#full-time').is(':checked') ? 'Full Time' : '';
    loadCards(jobs);

    if (!filters.company && !filters.location && !filters.contract) {
        $('.load-more').css({'opacity': '1'});
    }

    else {
        $('.load-more').css({'opacity': '0'});
    }
});

function filterJobs(jobs) {
    let finalJobs = jobs;

    console.log(jobs);

    Object.entries(filters).forEach(([key, value]) => {
        if (value) {
            finalJobs = finalJobs.filter(job => {
                return job[key] == value;
            });
        }
    });

    return finalJobs;
}


// LIGHT/DARK THEME

const lightTheme = () => {
    $('body').css({'background-color': '#F2F2F2'});
    $('.search-container').css({'background-color': 'white'});
    $('.search-container div').css({'border-left': '1px solid rgb(235, 235, 235)'});
    $('.search-container input').css({'background-color': 'transparent', 'color': 'black'});
    $('.search-container label').css({'color': 'black'});
    $('.card').css({'background-color': 'white'});
    $('.card a').css({'color': 'black'});

    $('.job-top').css({'color': 'black', 'background-color': 'white'});
    $('section').css({'color': 'black', 'background-color': 'white'});
    $('.job-bottom').css({'color': 'black', 'background-color': 'white'});
};

const darkTheme = () => {
    $('body').css({'background-color': '#121721'});
    $('.search-container').css({'background-color': '#19202D'});
    $('.search-container div').css({'border-left': '1px solid #313743'});
    $('.search-container input').css({'background-color': 'transparent', 'color': 'white'});
    $('.search-container label').css({'color': 'white'});
    $('.card').css({'background-color': '#19202D'});
    $('.card a').css({'color': 'white'});

    $('.job-top').css({'color': 'white', 'background-color': '#19202D'});
    $('section').css({'color': 'white', 'background-color': '#19202D'});
    $('.job-bottom').css({'color': 'white', 'background-color': '#19202D'});

    $('.popup').css({'background-color': '#19202D'});
    $('.location-section-mobile').css({'border-bottom': '1px solid #313743'});
    $('.location-section-mobile input').css({'color': 'white'});
    $('.full-time-section-mobile').css({'color': 'white'});
};

$('.switch-container').click(() => {
    if ($('.switch').css('left') == '5px') {
        $('.switch').css({'left': '30px'});
        darkTheme();
    }
    else {
        $('.switch').css({'left': '5px'});
        lightTheme();
    }
});

// JOB DESCRIPTION

function toJobDescription(e) {
    $('.search-container').css({'display': 'none'});
    $('main').css({'display': 'none'});
    $('.load-more').css({'display': 'none'});
    $('.job-top').css({'display': 'flex'});
    $('section').css({'display': 'block'});
    $('.job-bottom').css({'display': 'flex'});

    let cardId = $(e.target).attr('id');

    for (let i = 0; i < jobs.length; i++) {
        if (jobs[i].id == cardId) {
            $('.company-info h1').text(jobs[i].company);
            $('.company-info p').text(jobs[i].website);
            $('.job-logo-big').css({'background-image': `url(${jobs[i].logo})`, 'background-color': jobs[i].logoBackground});

            $('.description-info').text(jobs[i].postedAt + ' • ' + jobs[i].contract);
            $('.description-top h1').text(jobs[i].position);
            $('.description-top .job-location').text(jobs[i].location);

            $('.job-description').text(jobs[i].description);
            $('.job-requirements').text(jobs[i].requirements.content);
            $('.requirements-list').html(jobs[i].requirements.items.map(item => {
                return `<li>${item}</li>`;
            }));
            $('.job-duties').text(jobs[i].role.content);
            $('.duties-list').html(jobs[i].role.items.map(item => {
                return `<li>${item}</li>`;
            }));

            $('.job-bottom div h3').text(jobs[i].position);
            $('.job-bottom div p').text(jobs[i].company);

            $('.job-top button').click(() => {
                window.location.href = jobs[i].website;
            });
            $('.description-top button').click(() => {
                window.location.href = jobs[i].apply;
            });
            $('.job-bottom div button').click(() => {
                window.location.href = jobs[i].apply;
            });
        }
    }
}

function toJobDashboard() {
    $('.search-container').css({'display': 'flex'});
    $('main').css({'display': 'flex'});
    $('.load-more').css({'display': 'initial'});
    $('.job-top').css({'display': 'none'});
    $('section').css({'display': 'none'});
    $('.job-bottom').css({'display': 'none'});
}

// POPUP

$('.filter-button').click(e => {
    $('.shader').css({'display': 'flex'});
});

$('.shader').click(e => {
    let container = $('.popup');

    if (!container.is(e.target) && container.has(e.target).length === 0) {
        $('.shader').css({'display': 'none'});
    }
});

$('.popup button').click(e => {
    $('.shader').css({'display': 'none'});
});