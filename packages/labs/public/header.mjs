// Function to create the header
export function createHeader() {
    const headerHTML = `
        <nav>
            <div class="navbar-brand">
                <h1>Alex Banham</h1>
            </div>
            <ul class="navbar-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="projects.html">Projects</a></li>
                <li><a href="hobbies.html">Hobbies</a></li>
            </ul>
        </nav>
        <img src="IMG_1094.jpg" alt="Photo of Alex Banham" class="header-image">
    `;

    const headerElement = document.createElement("header");
    headerElement.innerHTML = headerHTML;

    // Add active class to current page link
    const currentPage = window.location.pathname.split("/").pop(); // Get current filename
    const links = headerElement.querySelectorAll(".navbar-links a");

    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });

    return headerElement;
}

// Insert the header into the page
window.addEventListener("load", () => {
    const existingHeader = document.querySelector("header");
    if (existingHeader) {
        existingHeader.replaceWith(createHeader());
    } else {
        document.body.prepend(createHeader());
    }
});
