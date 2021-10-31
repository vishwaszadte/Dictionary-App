const wrapper = document.querySelector(".wrapper"),
searchInput = wrapper.querySelector("input"),
infoText = wrapper.querySelector(".info-text"),
synonyms = wrapper.querySelector(".synonyms .list"),
volumeIcon = wrapper.querySelector(".word i"),
removeIcon = wrapper.querySelector(".search span");
let audio;

function data(result, word) {
    if(result.title) { // if api the message can't find the word
        infoText.innerHTML =  `Can't find the meaning of <span>"${word}"</span>. Please, try and search for another word`;
        wrapper.classList.remove("active");
    } else {
        console.log(result);
        wrapper.classList.add("active");
        let definitions = result[0].meanings[0].definitions[0],
        phonetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[0].text}/`;

        // pass the particular response data to a particular html element
        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".meaning span").innerText = definitions.definition;

        if (definitions.example == undefined) {
            document.querySelector(".example").parentElement.style.display = "none";
        } else {
            document.querySelector(".example").parentElement.style.display = "block";
            document.querySelector(".example span").innerText = definitions.example;
        }

        document.querySelector(".word span").innerText = phonetics;
        audio = new Audio("https:" + result[0].phonetics[0].audio); // creating new audio object and passing audio src

        if (definitions.synonyms[0] == undefined) {
            synonyms.parentElement.style.display = "none";
        } else {
            synonyms.parentElement.style.display = "block";
            synonyms.innerHTML = "";

            for (let i = 0; i < 5; i++) { // getting only 5 synonyms
                let tag =  `<span onClick = search('${definitions.synonyms[i]}')>${definitions.synonyms[i]}</span> `;
                synonyms.insertAdjacentHTML("beforeend", tag); // pass the synonymns
            }
        }
    }
}

// search synonyms function
function search(word) {
    searchInput.value = word;
    fetchApi(word);
}

// fetch api function
function fetchApi(word) {
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    // fetching api response and returning it with parsing into js object and in another then
    // method calling data function with passing api response and searched word as an argument
    fetch(url).then(res => res.json()).then(result => data(result, word));
}

searchInput.addEventListener("keyup", e => {
    if(e.key === "Enter" && e.target.value) {
        fetchApi(e.target.value);
    }
});

volumeIcon.addEventListener("click", () => {
    audio.play();
})

removeIcon.addEventListener("click", ()=> {
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
    infoText.style.color = "#000";
    infoText.innerHTML = `<p>Type a word and press enter to get meaning, example, pronounciation and synonynms of that word!</p>`
})