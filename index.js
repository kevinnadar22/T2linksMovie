// Initializing the variables
let url = 'https://gist.githubusercontent.com/kevinnadar22/112e759f1f6f7747c5df8d8749e464f0/raw/0190049fe65baabc057662495125b0070cb6d764/data.json';



// Fetch Movie
async function fetchMovies(url) {
    const response = await fetch(url);
    return await response.json()
}

const start = async function (url) {
    const result = await fetchMovies(url);
    return result
}

// linkify
function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">Link</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">Link</a>');

    // Replace URL starting with t.me
    replacePattern3 = /t.me\/T2linksAnnc\/[0-9]/;
    let result = replacedText.match(replacePattern3)

    if (result != null) {
        replacedText = replacedText.replace(replacePattern3, `<a href="https://${result[0]}" target="_blank">${result[0]}</a>`);
    }

    // Replace username with link
    let replacePattern4 = /@[a-zA-Z0-9_]+/gim;
    result = replacedText.match(replacePattern4)

    if (result) {
        for (let index = 0; index < result.length; index++) {
            replacedText = replacedText.replace(result[index], `<a href="https://telegram.me/${result[index].replace('@', '')}" target="_blank">${result[index].replace('@', '')}</a>`)
        }

    }

    return replacedText;
}

// Display Movie Function
const displayMovie = async function () {
    document.getElementById('row').innerHTML = ''
    const movieInput = document.getElementById('movieInput').value

    if (movieInput == '') {
        updateTitle("No Results Found")
        document.getElementById('count').innerText = 0  
        showAlert('Type any Movie Name')
        return false;
    }

    updateTitle(`Search Results for "${movieInput}"`)
    document.getElementById('results').innerText = 'Searching 🔍🔎';
    document.getElementById('count').innerText = 0
    const result = await start(url);
    let i = 0
    result.forEach(movie => {
        if (movie['title'].toLowerCase().includes(movieInput.toLowerCase())) {
            console.log(movie["caption"]);
            let regex = /http/
            let caption = movie['caption'];

            let result = caption.match(regex)

            if (result == null) {
                return false
            }

            caption = linkify(caption)

            let title = movie['title'];

            let clonedNode = document.getElementById('originalNode').cloneNode(true)
            clonedNode.querySelector('h5').innerText = title;
            clonedNode.querySelector('p').innerHTML = caption;

            document.getElementById('row').appendChild(clonedNode)
            clonedNode.style.display = 'block'
            i++;
        }
  
    });
    document.getElementById('results').innerText = 'Results Found'
    document.getElementById('count').innerText = i 
}

// Reset Function
function resetButton() {
    updateTitle(`T2links Movie Search`)
    document.getElementById('movieInput').value = '';
    document.getElementById('row').innerHTML = '';
    document.getElementById('results').innerText = 'Results Found';
    document.getElementById('count').innerText = 0
}

// Alert Function
function showAlert(str) {
    let alertHTML = document.getElementById('alert');
    let alertText = document.getElementById('alert-text');

    alertHTML.style.display = 'block';
    alertText.innerText = str;

    setTimeout(() => {
        alertHTML.style.display = 'none';
    }, 2000);
}

//Update Window Title
function updateTitle(title) {
    window.document.title = title
} 

// click button
movieSubmit.addEventListener('click', displayMovie)

// Reset Button
reset.addEventListener('click', resetButton)
