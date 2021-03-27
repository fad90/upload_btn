upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif', '.json']
});


function upload(selector, options = {}) {
    let files = [];
    const input = document.querySelector(selector);
    const preview = document.querySelector('.preview');

    const open = document.createElement('button');
    open.classList.add('btn');
    open.textContent = 'Открыть';

    if (options.multi) {
        input.setAttribute('multiple', true)
    }

    if (options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','))
    }


    input.insertAdjacentElement('afterend', open);

    const triggerInput = () => input.click();

    const changeHandler = (event) => {
        if (!event.target.files.length) {
            return
        }
        files = Array.from(event.target.files)

        files.forEach(file => {
            if (!file.type.match('image')) {
                return
            }

            const reader = new FileReader()

            reader.onload = ev => {
                const src = ev.target.result

                preview.insertAdjacentHTML('afterbegin', `
                <div class="preview-image">
                    <div class="preview-remove" data-name="${file.name}">&times;</div>
                    <img src="${src}" alt="${file.name}" />
                </div>
                `)
            }
            reader.readAsDataURL(file)
        })

        files.forEach(file => {
            if (!file.type.match('json')) {
                return
            }
            const reader = new FileReader();

            reader.readAsText(file);

            reader.onload = function () {

                const lines = reader.result;
                const linesObj = JSON.parse(lines);
                const allUrl = linesObj.galleryImages.map((image) => image.url)

                allUrl.map((url, i) => {
                    preview.insertAdjacentHTML('afterbegin', `
                <div class="preview-image">
                    <div class="preview-remove" data-name="${i}">&times;</div>
                    <img src="${url}" alt="${i}" />
                </div>
                `)
                })
            }

        })

    }

    const removeHandler = event => {
        if (!event.target.dataset.name) {
            return
        }

        const { name } = event.target.dataset
        files = files.filter(file => file.name !== name)

        const block = preview.querySelector(`[data-name="${name}"]`)
            .closest('.preview-image')

        block.classList.add('removing')
        setTimeout(() => block.remove(), 200)
    }

    open.addEventListener('click', triggerInput);
    input.addEventListener('change', changeHandler);
    preview.addEventListener('click', removeHandler);
};
