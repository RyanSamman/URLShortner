// Change URL if putting Backend/Frontend on seperate URLS
const backendURL = ""

const formElement = document.querySelector<HTMLFormElement>("#createform")!
const urlInputElement = document.querySelector<HTMLInputElement>("#js-url")!
const shortenedInputElement = document.querySelector<HTMLInputElement>("#js-shortened")!
const URLOutputDivElement = document.querySelector<HTMLDivElement>("#output")!

interface responseData {
	url: string,
	shortened: string,
	id: string,
}

formElement.onsubmit = async (ev) => {
	// Stop form from submitting normally
	ev.preventDefault()

	// Get values from inputs
	const url = urlInputElement.value
	const shortened = shortenedInputElement.value

	// Send POST request to server
	const response = await fetch("/create", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ url, shortened })
	})

	console.log(response)

	if (response.status !== 201) {
		alert(`${response.status} Error! ${await response.text()}`)
		return
	}

	const data: responseData = await response.json()
	const shortenedURL = window.location.href + data.shortened
	alert(`Your Shortened URL is ${shortenedURL}`)
	repopulateOutput()
}

async function repopulateOutput() {
	const response = await fetch(backendURL + "/all")

	if (response.status !== 200) {
		alert(`${response.status} Error! ${await response.text()}`)
		return
	}

	const data: responseData[] = await response.json()
	URLOutputDivElement.innerHTML = ""
	data.map(d => dataToHTML(d))
		.forEach(c => URLOutputDivElement.appendChild(c))
}


function dataToHTML(data: responseData) {
	const template = document.createElement("template")
	template.innerHTML = (`
		<div>
			<a target="_blank" data-test="abc" href="#"></a>
			<a target="_blank" href="#"></a>
			<button>Copy URL</button>
		</div>
	`)

	const newNode = template.content.firstElementChild!;

	const realURLElement = <HTMLAnchorElement>newNode.children[0]
	const shortenedURLElement = <HTMLAnchorElement>newNode.children[1]
	const buttonElement = <HTMLButtonElement>newNode.children[2]

	const shortenedURL = (backendURL || window.location.href) + data.shortened

	realURLElement.innerText = data.url
	realURLElement.href = data.url

	shortenedURLElement.innerText = data.shortened
	shortenedURLElement.href = shortenedURL


	buttonElement.onclick = () => navigator.clipboard.writeText(shortenedURL)
		.then(() => alert(`${shortenedURL} Added to clipboard`))
		.catch(() => alert("Failed to copy to clipboard"))

	return newNode;
}

window.onload = repopulateOutput
