import Slide from "../features/slide/slide.js"

new Slide();

const carrinho_screen = document.querySelector(".carrinho-screen")

document.querySelector("#carrinho").addEventListener("click", () => {carrinho_screen.classList.add("active")})

document.querySelector(".fechar").addEventListener("click", () => {carrinho_screen.classList.remove("active")})