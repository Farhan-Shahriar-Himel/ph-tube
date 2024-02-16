let id;
let dark_text, light_text;

function make_red(key) {
    const buttons = document.getElementsByClassName('clicky-btn');

    for (let b of buttons) {
        if (b.innerText === key) {
            b.style.backgroundColor = "#FF1F3D";
            b.style.color = 'white';
        } else {
            b.style.backgroundColor = "";
            b.style.color = 'black';
        }
    }
}

function loadData(event) {

    const buttons = document.getElementsByClassName('clicky-btn');
    for (let button of buttons) {
        button.removeEventListener('mouseover', dark_text);
        button.removeEventListener('mouseout', light_text);
    }

    event.addEventListener('mouseover', dark_text = () => {
        event.style.color = 'black';
    });
    event.addEventListener('mouseout', light_text = () => {
        event.style.color = 'white';
    });

    fetch('https://openapi.programming-hero.com/api/videos/categories')
        .then((response) => response.json())
        .then((data) => {
            data.data.forEach((d) => {
                if (d.category === event.innerText) {
                    id = d.category_id;
                    make_red(event.innerText);
                }
            })
            fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`)
                .then((res) => res.json())
                .then((data) => display(data.data, false));
        });
}

const display = (data, bool) => {
    // console.log(data);
    const videoContainer = document.getElementById('video-container');
    videoContainer.innerHTML = "";
    const video_card = document.getElementById('no-content');
    video_card.innerHTML = "";

    if (bool) {
        data.sort(function (a, b) {
            const A = parseInt(a.others.views);
            const B = parseInt(b.others.views);
            return (B - A);
        })
    }

    const sort_btn = document.getElementById('sort-btn');
    let dataLen = data.length;
    if (dataLen != 0) {

        sort_btn.style.display = 'block';

        data.forEach((d) => {
            // console.log(d);
            const verified = d.authors[0].verified;

            let verified_sign = "";
            if (verified) {
                verified_sign = "images/verified.png";
            }

            let totalSeconds = d.others.posted_date;
            let tot_sec = totalSeconds;
            let haveTime = true;
            if (totalSeconds === "") {
                haveTime = false;
            }

            let years = Math.floor(totalSeconds / (365 * 24 * 60 * 60));
            totalSeconds %= (365 * 24 * 60 * 60);

        
            let months = Math.floor(totalSeconds / (30 * 24 * 60 * 60));
            totalSeconds %= (30 * 24 * 60 * 60);


            let days = Math.floor(totalSeconds / (24 * 60 * 60));
            totalSeconds %= (24 * 60 * 60);

    
            let hours = Math.floor(totalSeconds / (60 * 60));
            totalSeconds %= (60 * 60);

            
            let minutes = Math.floor(totalSeconds / 60);
            totalSeconds %= 60;

            
            let seconds = totalSeconds;

            let time_str = "";
            if (haveTime && tot_sec < 86400) {
                time_str = `${hours}hrs ${minutes}min ago`;
            }

            const video_card = document.createElement('div');

            video_card.innerHTML = `
            <div class="space-y-4">
                <div class="w-[100%] h-[200px] bg-cover bg-center bg-no-repeat border rounded-lg relative" style="background-image: url('${d.thumbnail}');">
                    <div class="bg-black text-white text-center rounded-md absolute right-2 bottom-2 p-1">
                        ${time_str}
                    </div>
                </div>
                <div class="flex gap-4">
                    <div class="">
                        <img class="w-[40px] h-[40px] border rounded-full" src="${d.authors[0].profile_picture}" alt="">
                    </div>
                    <div>
                        <h1 class="text-xl font-bold">${d.title}</h1>
                        <div class="flex gap-4">
                            <p>${d.authors[0].profile_name}</p>
                            <div class="mt-1"><img src="${verified_sign}" alt=""></div>
                        </div>
                        <p>${d.others.views} views</p>
                    </div>
                </div>
            </div>
            `

            videoContainer.appendChild(video_card);
        })
    } else {
        sort_btn.style.display = 'none';
        const new_div = document.createElement('div');
        new_div.innerHTML = `
            <div class="flex justify-center align-center">
                <img src="images/Icon.png" alt="">
            </div>
            <h1 class="text-4xl font-bold">Oops!! Sorry, There is no<br>content here</h1>
        `
        video_card.appendChild(new_div);
    }
}

function sortData(event) {
    fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`)
                .then((res) => res.json())
                .then((data) => display(data.data, true));
}


const db = document.getElementById('default-all');
loadData(db);