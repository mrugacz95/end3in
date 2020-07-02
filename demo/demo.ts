const select = document.getElementById("demo_sel") as HTMLSelectElement;

class Demo {
    name: string;
    path: string;

    constructor(path: string, name: string) {
        this.path = path;
        this.name = name;
    }

}

let defaultId = 'aabb'
let demos = {
    'aabb': new Demo('../examples/02_AABB_collisions.js', 'AABB collisions'),
    'juggle': new Demo('../examples/01_juggle.js', 'Juggle')
}
for (const id in demos) {
    let demo = demos[id]
    let op = document.createElement('option');
    op.innerHTML = demo.name;
    op.value = id;
    select.appendChild(op);
}

let script = document.getElementById('demo_source') as HTMLScriptElement
let url = window.location.href;
let index = url.indexOf('?')
let newId
if (index == -1) {
    newId = defaultId
} else {
    newId = url.substr(index + 1, url.length - index - 1)
}
if (newId in demos) {
    script.src = demos[newId].path
} else {
    script.src = demos[defaultId].path
}
document.head.appendChild(script)
select.value = newId


select.onchange = () => {
    let newId = select.options[select.selectedIndex].value
    let url = window.location.href;
    let index = url.indexOf('?')
    if (index == -1) {
        url += '?' + newId
    } else {
        url = url.substr(0, index) + '?' + newId
    }
    window.location.href = url;
}
