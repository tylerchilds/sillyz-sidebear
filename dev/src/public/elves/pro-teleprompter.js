import elf from "@silly/elf"
import shelf_merge from "shelf-merge"
import { render } from '@sillonious/saga'

const merge = shelf_merge

let shelf = [{hello: "world"}, [1, {hello: 1}]]

let change = merge(shelf, {more: "data"}) // version info infered

console.log(change)

const $ = elf('pro-teleprompter', { hidden: true })

$.draw((target) => {

  if(target.innerHTML) return
  return `
    <div class="background">
      <simpleton-client src="${target.getAttribute('src')}" data-script="${import.meta.url}" data-action="sync"></simpleton-client>
      <button data-teleprompt class="nonce" aria-label="Teleprompt" data-tooltip="Teleprompt"></button>
      <a href="/" class="nonce" aria-label="home" data-tooltip="home"></a>
    </div>
    <div class="foreground hidden">
      <div class="script"></div>
      <button data-close class="nonce"></button>
    </div>
  `
}, {
  afterUpdate: (target) => {
    {
      const { hidden } = $.learn()
      const play = render($.learn().text)
      const script = document.querySelector('.script')
      script.innerHTML = play
    }

    {
      const { hidden } = $.learn()
      const foreground = document.querySelector('.foreground')
      const background = document.querySelector('.background')

      hidden ? foreground.classList.add('hidden') : foreground.classList.remove('hidden')
      !hidden ? background.classList.add('hidden') : background.classList.remove('hidden')
    }

  }
})

export function sync(target, text) {
  const { src } = target.getAttribute('src') || 'nonce'
  $.teach({ src, text })
}

$.when('click', '[data-close]', () => $.teach({ hidden: true }))
$.when('click', '[data-teleprompt]', () => $.teach({ hidden: false }))

$.style(`
  & [data-close],
  & [data-teleprompt] {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    width: 3rem;
    height: 3rem;
  }

  & {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      touch-action: manipulation;
      user-select: none; /* supported by Chrome and Opera */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
    }

    & iframe {
      border: 0;
      width: 100%;
      height: 100%;
    }

    & .hidden {
      display: none;
    }

    & .input {
      position: sticky;
      top: 0;
      background: lemonchiffon;
      border-bottom: 1px solid saddlebrown;
      padding: 1rem;
      white-space: nowrap;
      overflow-x: auto;
    }

    & .output {
      overflow: auto;
      display: grid;
      gap: 1rem;
      padding: 1rem;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }

    & .background,
    & .foreground {
      position: absolute;
      inset: 0;
      padding-top: 3rem;
      overflow: auto;
    }

    & .foreground {
      background: black;
      color: white;
    }

    & .foreground button {
      pointer-events: all;
    }

    & textarea {
      resize: none;
      border: none;
      background: transparent;
    }

    & .result {
      background: lemonchiffon;
      color: saddlebrown;
      box-shadow: -1px -1px var(--accent, white), 3px 3px 0px 0px saddlebrown;
      padding: 1rem;
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 1rem;
    }

    & .result .count {
      width: 50px;
      height: 50px;
      border-radius: 100%;
      border: 3px solid var(--accent);
      background: transparent;
      color: saddlebrown;;
      font-weight: 1000;
      display: grid;
      place-items: center;
    }

    & .input button {
      width: 50px;
      height: 50px;
      border-radius: 100%;
      border: 3px solid var(--accent);
      background: transparent;
      color: dodgerblue;
      font-weight: 1000;
      display: inline-block;
    }

    & .to-tutorial {
      padding: 1rem;
    }

  @media screen {
    & hypertext-quote {
      position: relative;
    }

    & hypertext-quote::before {
      content: '>';
      background: gold;
      background-image: linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5));
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      padding: 0 1rem;
      display: grid;
      place-items: start;
      font-size: 1rem;
      color: rgba(0,0,0,.65);
      opacity: .25;
    }

    & hypertext-address::before {
      content: '#';
      background: mediumseagreen;
      background-image: linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5));
      left: 0;
      right: 0;
      padding: 0 1rem;
      position: absolute;
      height: 2rem;
      display: grid;
      place-items: start;
      font-size: 1rem;
      color: rgba(0,0,0,.65);
      opacity: .25;
    }

    & hypertext-puppet::before {
      content: '@';
      background: dodgerblue;
      background-image: linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,.5));
      left: 0;
      right: 0;
      padding: 0 1rem;
      position: absolute;
      height: 2rem;
      display: grid;
      place-items: start;
      font-size: 1rem;
      color: rgba(0,0,0,.65);
      opacity: .25;
    }
  }
`)

customElements.define('pro-teleprompter', class WebComponent extends HTMLElement { constructor() { super() } });
