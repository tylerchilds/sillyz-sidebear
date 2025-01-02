import elf from '../elf.js'
const $ = elf('find-forms', { forms: [] })

$.draw((target) => {
  const data = $.learn()

  const forms = data.forms.map((form) => {
    return `
      <form ${form.attributes}>
        ${form.inputs.length > 0 ? form.inputs.map(renderField).join(''):''}
      </form>
    `
  }).join('')

  return `
    <button data-find>
      Find Forms
    </button>
    ${data.error ? `<div>${data.error}</div>`:''}
    <hr>
    ${forms}
  `
})

const renderers = {
  'INPUT': (node) => {
    return `
      <input ${node.attributes} />
    `
  },
  'BUTTON': (node) => {
    return `
      <button ${node.attributes}>
        ${node.innerText}
      </button>
    `
  },
  'TEXTAREA': (node) => {
    return `
      <textarea ${node.attributes}>${node.value}</textarea>
    `
  },
}

function renderField(node) {
  return (renderers[node.tag] || (() => null))(node)
}

$.when('click', '[data-find]', async (event) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: findForms,
  }, (data) => {
    console.log(data)
    if (data && data[0].result.length) {
      $.teach({ forms: data[0].result })
    } else {
      $.teach({ error: 'No Forms Found' })
    }
  });
})

function findForms() {
  return Array.from(document.forms).map(form => {
    let attributes = "";
    for (const attr of form.attributes) {
      attributes += ` ${attr.name}="${attr.value}" `;
    }
    return {
      action: form.action,
      method: form.method,
      attributes,
      inputs: Array.from(form.elements).map(element => {
        let attributes = "";
        for (const attr of element.attributes) {
          attributes += ` ${attr.name}="${attr.value}" `;
        }
        return {
          type: element.type,
          name: element.name,
          value: element.value,
          tag: element.tagName,
          innerText: element.innerText,
          attributes
        }
      })
    }
  });
}
