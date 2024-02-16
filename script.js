let id;

function loadData(event) {
    fetch('https://openapi.programming-hero.com/api/videos/categories')
        .then((response) => response.json())
        .then((data) => {
            data.data.forEach((d) => {
                if (d.category === event.innerText) {
                    id = d.category_id;
                }
            })
            fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`)
                .then((res) => res.json())
                .then((data) => display(data.data));
        });
}

const display = (data) => {
    // console.log(data);
    const videoContainer = document.getElementById('video-container');
    videoContainer.innerHTML = "";
    const video_card = document.getElementById('no-content');
    video_card.innerHTML = "";

    console.log(data);
    console.log(data.length);
    let dataLen = data.length;
    if (dataLen != 0) {
        data.forEach((d) => {
            // console.log(d);
            const verified = d.authors[0].verified;

            let verified_sign = "";
            if (verified) {
                verified_sign = "images/verified.png";
            }

            const video_card = document.createElement('div');

            video_card.innerHTML = `
            <div class="space-y-4">
                <img class="w-[100%] h-[200px]" src="${d.thumbnail}" alt="">
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
