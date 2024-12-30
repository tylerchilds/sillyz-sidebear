import elf from '@silly/elf'
import 'randomuuid'
import { doingBusinessAs } from "@sillonious/brand"

self.plan98 ||= { env: {} }

self.requestIdleCallback = self.requestIdleCallback || function (fn) { setTimeout(fn, 1) };

const parameters = new URLSearchParams(window.location.search)
const world = parameters.get('world')
const database = localStorage.getItem("plan98.database") || self.plan98.env.POCKETBASE_URL;

self.plan98 = {
  ...self.plan98,
  parameters,
  database,
  host: world ? world : doingBusinessAs[window.location.host] ? window.location.host : 'hivelabworks.com',
}

const style = document.createElement('link')

style.setAttribute('href', `/public/cdn/${window.plan98.host}/default.css`)
style.setAttribute('rel', `stylesheet`)
document.head.appendChild(style)

const newpage = `
  <sillonious-brand host="${plan98.host}"></sillonious-brand>
`

elf('#main').draw(target => newpage)

export function setDatabase(url) {
  localStorage.setItem("plan98.database", 'https://sillonious.pockethost.io')
}
