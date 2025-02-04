// custom-header.mjs
import { attachShadow, toHtml } from "./utils.mjs";

const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
    <style>
        /* General Styles for Header */
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: var(--color-header-bg);
            padding: var(--spacing-medium);
            position: relative;
        }

        .navbar-brand h1 {
            font-family: var(--font-secondary);
            font-size: 2rem;
            color: var(--color-inverted);
            margin: 0;
        }

        .navbar-links {
            list-style: none;
            display: flex;
            gap: var(--spacing-medium);
            margin: 0;
            padding: 0;
        }

        .navbar-links li {
            display: inline;
        }

        .navbar-links a {
            text-decoration: none;
            color: var(--color-accent);
            font-weight: bold;
            padding: var(--spacing-small);
            transition: background-color 0.3s ease;
        }

        .navbar-links a:hover {
            background-color: var(--color-accent-hover);
            color: var(--color-inverted);
        }

        /* Active Page Indicator */
        .navbar-links a.active {
            font-weight: bold;
            color: var(--color-inverted);
            background-color: var(--color-accent);
        }

        /* Mobile Menu */
        .menu-button {
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--color-accent);
        }

        @media (max-width: 768px) {
            .navbar-links {
                display: none;
                flex-direction: column;
                background-color: var(--color-header-bg);
                width: 100%;
                position: absolute;
                top: 100%; /* Ensures the dropdown starts below the header */
                left: 0;
                padding: var(--spacing-medium);
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            }

            .navbar-links.open {
                display: flex;
            }

            .menu-button {
                display: block;
            }
        }

        /* Profile Image Styling */
        .header-container {
            text-align: center;
            margin-top: var(--spacing-medium);
        }

        .header-image {
            display: block;
            margin: var(--spacing-medium) auto;
            max-width: 150px;
            height: auto;
            border-radius: 50%;
        }

    </style>

    <header>
        <nav>
            <div class="navbar-brand">
                <h1>Alex Banham</h1>
            </div>
            <button class="menu-button">☰</button>
            <ul class="navbar-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="projects.html">Projects</a></li>
                <li><a href="hobbies.html">Hobbies</a></li>
            </ul>
        </nav>
        <div class="header-container">
            <img src="IMG_1094.jpg" alt="Photo of Alex Banham" class="header-image">
        </div>
    </header>
`;

class CustomHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadowRoot = attachShadow(this, TEMPLATE);
        this.addMenuToggle(shadowRoot);
        this.highlightActiveLink(shadowRoot);
    }

    addMenuToggle(shadowRoot) {
        const menuButton = shadowRoot.querySelector(".menu-button");
        const navLinks = shadowRoot.querySelector(".navbar-links");

        menuButton.addEventListener("click", () => {
            navLinks.classList.toggle("open");
        });

        document.addEventListener("click", (event) => {
            if (!this.contains(event.target)) {
                navLinks.classList.remove("open");
            }
        });
    }

    highlightActiveLink(shadowRoot) {
        const currentPage = window.location.pathname.split("/").pop();
        const links = shadowRoot.querySelectorAll(".navbar-links a");

        links.forEach(link => {
            if (link.getAttribute("href") === currentPage) {
                link.classList.add("active");
            }
        });
    }
}

customElements.define("custom-header", CustomHeader);
