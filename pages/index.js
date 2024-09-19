const modules = document.querySelector('.module-list');
const moduleName = document.querySelector('#modules');

const modulesArr = [];

const getmoduledata = async () => {
    try {


        const res = await fetch('./data.json');
        const data = await res.json();

        if (data) {
            modules.innerHTML = ""
        }

        data.map((module) => {
            const li = document.createElement('li');

            modulesArr.push(li);

            li.insertAdjacentHTML('afterbegin',
                `
                <div class="container">
                <div class="card">
                    <div class="box">
                        <div class="content">
                            <h2>01</h2>
                            <h3>${module.name}</h3>
                            <p>${module.module1}</p>
                            <a href="${module.module1_url}">Read More</a>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="box">
                        <div class="content">
                            <h2>02</h2>
                            <h3>${module.name}</h3>
                            <p>${module.module2}</p>
                            <a href="${module.module2_url}">Read More</a>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="box">
                        <div class="content">
                            <h2>03</h2>
                            <h3>${module.name}</h3>
                            <p>${module.module3}</p>
                            <a href="${module.module3_url}">Read More</a>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="box">
                        <div class="content">
                            <h2>04</h2>
                            <h3>${module.name}</h3>
                            <p>${module.module4}</p>
                            <a href="${module.module4_url}">Read More</a>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="box">
                        <div class="content">
                            <h2>05</h2>
                            <h3>${module.name}</h3>
                            <p>${module.module5}</p>
                            <a href="${module.module5_url}">Read More</a>
                        </div>
                    </div>
                </div>
                </div>
                `
            )

            modules.appendChild(li);
        })

    } catch (error) {
        console.log(error);
    }
}

moduleName.addEventListener('input', (e) => {
    const val = e.target.value;
    console.log(val);

    modulesArr.filter((curElem) => {
        curElem.innerText.toLowerCase().includes(val.toLowerCase()) ?
        curElem.classList.remove('hide') :
        curElem.classList.add('hide')
    })
})

getmoduledata();


function getUrlParams() {
    const searchParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of searchParams) {
        params[key] = value;
    }
    return params;
}