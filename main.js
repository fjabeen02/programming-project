

const website = {
    pages: [],
    display: new Event('display'),
    init () {
        website.pages = document.querySelectorAll('.page');
        website.pages.forEach((p) => {
            p.addEventListener('display', website.pagedisplayed);
        })
        document.querySelectorAll('.nav-link').forEach((l) => {
            l.addEventListener('click', website.navigate);
        })
        document.querySelectorAll('btn btn-info').forEach((b) => {
            console.log(b)
            b.addEventListener('click', website.navigate);
        })
        history.replaceState({}, 'home', '#home');
        window.addEventListener('popstate', website.pop);
    },

    navigate (event) {
        event.preventDefault();
        let current = event.target.getAttribute('data-target');
        console.log(current)
        document.querySelector('.active').classList.remove('active');
        document.getElementById(current).classList.add('active');
        console.log(current)
        history.pushState({}, current, `#${current}`);
        document.getElementById(current).dispatchEvent(website.display);
    },

    pagedisplayed (event) {
        console.log(event.target.id, ' shown');
    },

    pop () {
        console.log(location.hash, 'popstate');
        let hashval = location.hash.replace('#', '');
        document.querySelector('.active').classList.remove('active');
        document.getElementById(hashval).classList.add('active');
        console.log(hashval)
        document.getElementById(hashval).dispatchEvent(website.display);
    }
}

document.addEventListener('DOMContentLoaded', website.init);


async function loadImages () {
    document.getElementById('imagesHere').innerHTML=''
    let info ={
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }
    await fetch('http://127.0.0.1:3000/image', info).
        then((response) => response.json()).
        then((images) => {
            for (let image of images) {
                console.log(image.image);
                const x= `
            <div class="card" style="width: 18rem;">
            <img class="card-img-top" src='${image.image}' alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">${image.name}</h5>
              <p class="card-text">${image.title}</p>
            </div>
          </div>
            `;

                document.getElementById('imagesHere').innerHTML+=x;
            }
        }).
        catch((err) => {
            console.error('error', err);
            alert('there has been an error loading images');
        })
}
loadImages();

const ImageForm = document.getElementById("image-form");


async function ImageSubmit (event) {
    event.preventDefault();
    let name =document.getElementById('nameImageForm').value;
    let title =document.getElementById('titleImageForm').value;
    let imagefromdoc=document.getElementById('imageFile');
    let imgname=imagefromdoc.files.item(0).name;
    console.log(imgname);
    console.log(title);
    console.log(name);
    let getinfo ={
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }
    let imagenames=[]
    await fetch('http://127.0.0.1:3000/image', getinfo).
        then((response) => response.json()).
        then((images) => {
            for (let image of images) {
                imagenames.push(image.title);
                console.log(imagenames);
            }
        })
    if (imagenames.includes(title)===false) {
        let info={
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name,
                title,
                image: imgname
            })

        }
        await fetch('http://127.0.0.1:3000/uploadimage', info).then((response) => response.text()).
            then((response) => {
                if (response === '"success"') {
                    alert('image added');
                } else {
                    alert('An error has occurred when trying to add your image');
                }
            }).
            catch((e) => {
                console.log('error', e)
                alert('An error has occurred when trying to add your image');

            })
    }
    else {
        alert('Sorry an image with this title already exists')
    }
    ImageForm.reset();
    loadImages();

}
ImageForm.addEventListener("submit", ImageSubmit);

async function loadComments () {
    document.getElementById('commentsHere').innerHTML=''
    let info ={
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }
    await fetch('http://127.0.0.1:3000/comment', info).
        then((response) => response.json()).
        then((comments) => {
            for (let comment of comments) {
                const x= `
                <div class="col-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class= "card-title">${comment.name}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${comment.title}</h6>
                            <div>comment: ${comment.usercomment}</div>
                            <hr>
                        </div>
                     </div>
                </div>
            `;

                document.getElementById('commentsHere').innerHTML+=x;
            }
        }).
        catch((err) => {
            console.error('error', err);
            alert('there has been an error loading comments');
        })

}
loadComments();


const commentForm = document.getElementById("comment-form");

async function CommentSubmit (event) {
    event.preventDefault();
    let name =document.getElementById('name').value;
    let title =document.getElementById('title').value;
    let usercomment =document.getElementById('usercomment').value;
    console.log(name)
    console.log(title)
    console.log(usercomment)
    let getinfo ={
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }
    let imagenames=[]
    await fetch('http://127.0.0.1:3000/image', getinfo).
        then((response) => response.json()).
        then((images) => {
            for (let image of images) {
                imagenames.push(image.title);
                console.log(imagenames);
            }
        })
    if (imagenames.includes(title) === true) {
        let info ={
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                title,
                usercomment
            })
        }
        fetch('http://127.0.0.1:3000/uploadcomment', info).then((res) => res.text()).
            then((res) => {
                if (res === '"success"') {
                    alert('comment added');
                } else {
                    alert('An error has occurred when trying to add your comment');
                }
            }).
            catch(() => {
                alert('An error has occurred when trying to add your comment');

            })
    }
    else {
        alert('The image you are trying to comment on doesnt exist, please check and try again ')
    }
    commentForm.reset()
    loadComments()


}

commentForm.addEventListener("submit", CommentSubmit);


const searchForm = document.getElementById("search-form");
async function imageSearch (event) {
    event.preventDefault();
    document.getElementById('imageHere').innerHTML='';
    document.getElementById('imageComments').innerHTML='';
    let title =document.getElementById('titleSearchForm').value;
    let getinfo ={
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }
    let imageinfo=[]
    await fetch('http://127.0.0.1:3000/image', getinfo).
        then((response) => response.json()).
        then((images) => {
            for (let image of images) {
                if (image.title === title) {
                    imageinfo.push(image.title)
                    imageinfo.push(image.name)
                    imageinfo.push(image.image)
                    const x= `
                <div class="card" style="width: 18rem;">
                <img class="card-img-top" src='${image.image}' alt="Card image cap">
                <div class="card-body">
                  <h5 class="card-title">${image.name}</h5>
                  <p class="card-text">${image.title}</p>
                </div>
                </div>
            `;
                    document.getElementById('imageHere').innerHTML+=x;
                }
            }
        }).
        catch(() => {
            alert('An error has occurred when trying to find your image');

        })
    if (imageinfo.length !== 0) {
        await fetch('http://127.0.0.1:3000/comment', getinfo).
            then((response) => response.json()).
            then((comments) => {
                for (let comment of comments) {
                    if (comment.title === title) {
                        const x= `
                            <div class="col-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class= "card-title">${comment.name}</h5>
                                        <h6 class="card-subtitle mb-2 text-muted">${comment.title}</h6>
                                        <div>comment: ${comment.usercomment}</div>
                                        <hr>
                                    </div>
                                 </div>
                            </div>
                        `;

                        document.getElementById('imageComments').innerHTML+=x;
                    }
                }
            }).
            catch(() => {
                alert('An error has occurred when trying to find your image');

            })
    }
    else {
        alert('Image with this name does not exist')
        searchForm.reset()
    }
}

searchForm.addEventListener("submit", imageSearch);